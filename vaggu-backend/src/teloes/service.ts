// Gerencia instalações e credenciais de telões e resume a disponibilidade por recorte.
import { randomBytes } from 'node:crypto';
import type { PrismaClient } from '@prisma/client';
import { ApiError } from '../auth/service.js';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { idEquipamento, textoEquipamento } from '../equipamentos/service.js';
import { createEstruturaService } from '../estrutura/service.js';

type Vaga = { ativo: boolean; tipo: string; estadoAtual: string; monitoramento: { situacao: string } | null };
type Setor = { id: string; nome: string; ativo: boolean; vagas: Vaga[] };
type Andar = { id: string; nome: string; ativo: boolean; setores: Setor[] };
type Estrutura = { shopping: { nome: string; demonstracao?: boolean }; andares: Andar[] };
const publico = { id: true, nome: true, andarId: true, setorId: true, ativo: true, criadoEm: true } as const;

function setoresAtivos(andar: Andar) {
  return andar.setores.filter(setor => setor.ativo);
}

function vagasAtivas(setor: Setor) {
  return setor.vagas.filter(vaga => vaga.ativo);
}

/** Em confirmação, a vaga ainda usa o último estado confirmado e válido. */
function resumirDisponibilidade(vagas: Vaga[]) {
  const monitoradas = vagas.filter(({ monitoramento, estadoAtual }) =>
    (monitoramento?.situacao === 'OPERANDO' || monitoramento?.situacao === 'CONFIRMANDO')
    && (estadoAtual === 'LIVRE' || estadoAtual === 'OCUPADA'));
  return {
    total: vagas.length,
    monitoradas: monitoradas.length,
    livres: monitoradas.filter(vaga => vaga.estadoAtual === 'LIVRE').length,
    parcial: monitoradas.length < vagas.length,
  };
}

/** Conta capacidade ativa e sinaliza cobertura parcial quando faltam leituras válidas. */
export function agregarTelao(estrutura: Estrutura, andarId: string | null, setorId: string | null) {
  const andares = estrutura.andares.filter(andar => andar.ativo && (!andarId || andar.id === andarId));
  if (andarId && !andares.length) throw new ApiError(409, 'RECORTE_INDISPONIVEL', 'O recorte do telão não está disponível.');
  const setores = andares.flatMap(setoresAtivos).filter(setor => !setorId || setor.id === setorId);
  if (setorId && !setores.length) throw new ApiError(409, 'RECORTE_INDISPONIVEL', 'O recorte do telão não está disponível.');
  const vagas = setores.flatMap(vagasAtivas);
  const escopo = setorId ? { tipo: 'SETOR' as const, nome: `${andares[0].nome} · ${setores[0].nome}` }
    : andarId ? { tipo: 'ANDAR' as const, nome: andares[0].nome }
    : { tipo: 'GERAL' as const, nome: 'Todos os andares' };
  // A visão geral agrupa por andar. Dentro de um andar, cada grupo corresponde a um setor.
  const grupos = andarId
    ? setores.map(setor => ({ nome: setor.nome, ...resumirDisponibilidade(vagasAtivas(setor)) }))
    : andares.map(andar => ({ nome: andar.nome, ...resumirDisponibilidade(setoresAtivos(andar).flatMap(vagasAtivas)) }));
  return {
    shopping: estrutura.shopping.nome,
    demonstracao: estrutura.shopping.demonstracao === true,
    andarId,
    setorId,
    escopo,
    ...resumirDisponibilidade(vagas),
    atualizadoEm: new Date().toISOString(),
    validadeMs: 30_000,
    grupos,
    categorias: ['PCD', 'IDOSO', 'ELETRICA'].map(tipo => ({
      tipo,
      ...resumirDisponibilidade(vagas.filter(vaga => vaga.tipo === tipo)),
    })),
  };
}

/** Usa a estrutura do shopping para aplicar ao telão a mesma validade das leituras. */
export function createTeloesService(prisma: PrismaClient, timeoutSensorMs: number) {
  const estrutura = createEstruturaService(prisma, timeoutSensorMs);
  async function shoppingAtivo(shoppingId: string) {
    if (!await prisma.shopping.findFirst({ where: { id: idEquipamento(shoppingId), ativo: true, excluidoEm: null } })) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');
  }
  async function validarRecorte(shoppingId: string, andarId: string | null, setorId: string | null) {
    if (setorId && !andarId) throw new ApiError(400, 'RECORTE_INVALIDO', 'Selecione o andar do setor.');
    if (andarId && !await prisma.andar.findFirst({ where: { id: andarId, shoppingId, ativo: true } })) throw new ApiError(400, 'RECORTE_INVALIDO', 'Andar incompatível com o shopping.');
    if (setorId && !await prisma.setor.findFirst({ where: { id: setorId, shoppingId, andarId, ativo: true } })) throw new ApiError(400, 'RECORTE_INVALIDO', 'Setor incompatível com o andar.');
  }
  function recorteId(valor: unknown) { return valor === null || valor === undefined ? null : idEquipamento(valor); }
  return {
    async listar(shoppingId: string) {
      await shoppingAtivo(shoppingId);
      return { teloes: await prisma.telao.findMany({ where: { shoppingId }, select: publico, orderBy: { criadoEm: 'desc' } }) };
    },
    async criar(shoppingId: string, body: Record<string, unknown>) {
      await shoppingAtivo(shoppingId);
      const nome = textoEquipamento(body.nome), andarId = recorteId(body.andarId), setorId = recorteId(body.setorId);
      await validarRecorte(shoppingId, andarId, setorId);
      // A chave em texto é entregue na emissão. O banco guarda apenas o hash.
      const chave = randomBytes(32).toString('base64url');
      return { telao: await prisma.telao.create({ data: { shoppingId, andarId, setorId, nome, chaveHash: await hashPassword(chave) }, select: publico }), chave };
    },
    async editar(shoppingId: string, id: string, body: Record<string, unknown>) {
      await shoppingAtivo(shoppingId);
      if (!['nome', 'andarId', 'setorId'].some(campo => Object.hasOwn(body, campo))) throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe o nome ou a tela apresentada.');
      const atual = await prisma.telao.findFirst({ where: { id: idEquipamento(id), shoppingId }, select: publico });
      if (!atual) throw new ApiError(404, 'TELAO_NAO_ENCONTRADO', 'Telão não encontrado.');
      if (!atual.ativo) throw new ApiError(409, 'TELAO_REVOGADO', 'Este telão foi revogado. Cadastre uma nova instalação.');
      const nome = Object.hasOwn(body, 'nome') ? textoEquipamento(body.nome) : atual.nome;
      const mudouAndar = Object.hasOwn(body, 'andarId');
      const andarId = mudouAndar ? recorteId(body.andarId) : atual.andarId;
      // Quando só o andar muda, o setor anterior deixa de fazer parte do recorte.
      const setorId = Object.hasOwn(body, 'setorId') ? recorteId(body.setorId) : mudouAndar ? null : atual.setorId;
      await validarRecorte(shoppingId, andarId, setorId);
      // A condição ativo impede que uma revogação concorrente reative ou altere a instalação.
      const resultado = await prisma.telao.updateMany({ where: { id: atual.id, shoppingId, ativo: true }, data: { nome, andarId, setorId } });
      if (!resultado.count) throw new ApiError(409, 'TELAO_REVOGADO', 'Este telão foi revogado.');
      return { telao: await prisma.telao.findFirstOrThrow({ where: { id: atual.id, shoppingId }, select: publico }) };
    },
    async revogar(shoppingId: string, id: string) {
      await shoppingAtivo(shoppingId);
      const r = await prisma.telao.updateMany({ where: { id: idEquipamento(id), shoppingId }, data: { ativo: false } });
      if (!r.count) throw new ApiError(404, 'TELAO_NAO_ENCONTRADO', 'Telão não encontrado.');
      return { revogado: true };
    },
    async excluir(shoppingId: string, id: string) {
      await shoppingAtivo(shoppingId);
      const resultado = await prisma.telao.deleteMany({ where: { id: idEquipamento(id), shoppingId } });
      if (!resultado.count) throw new ApiError(404, 'TELAO_NAO_ENCONTRADO', 'Telão não encontrado.');
      return { excluido: true };
    },
    /** Autentica a instalação e consulta somente o shopping associado à credencial. */
    async consultar(id: string, autorizacao?: string) {
      const chave = autorizacao?.startsWith('Telao ') ? autorizacao.slice(6) : '';
      if (!/^[A-Za-z0-9_-]{43}$/.test(chave)) throw new ApiError(401, 'TELAO_NAO_AUTORIZADO', 'Informe uma credencial válida do telão.');
      const telao = await prisma.telao.findFirst({ where: { id: idEquipamento(id), ativo: true, shopping: { ativo: true, excluidoEm: null } } });
      if (!telao || !await verifyPassword(chave, telao.chaveHash)) throw new ApiError(401, 'TELAO_NAO_AUTORIZADO', 'Credencial inválida ou revogada.');
      const dados = await estrutura.buscarEstrutura(telao.shoppingId);
      // Uma revogação concorrente não deve entregar nova consulta após a desativação.
      if (!await prisma.telao.findFirst({ where: { id: telao.id, ativo: true } })) throw new ApiError(401, 'TELAO_NAO_AUTORIZADO', 'Credencial revogada.');
      return { nome: telao.nome, ...agregarTelao(dados as unknown as Estrutura, telao.andarId, telao.setorId) };
    },
  };
}
