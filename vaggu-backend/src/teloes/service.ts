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
export function agregarTelao(estrutura: Estrutura, andarId: string | null, setorId: string | null) {
 const andares = estrutura.andares.filter(a => a.ativo && (!andarId || a.id === andarId));
 if (andarId && !andares.length) throw new ApiError(409, 'RECORTE_INDISPONIVEL', 'O recorte do telão não está disponível.');
 const setores = andares.flatMap(a => a.setores.filter(s => s.ativo && (!setorId || s.id === setorId)));
 if (setorId && !setores.length) throw new ApiError(409, 'RECORTE_INDISPONIVEL', 'O recorte do telão não está disponível.');
 const vagas = setores.flatMap(s => s.vagas.filter(v => v.ativo));
 const contar = (lista: Vaga[]) => {
   const validas = lista.filter(v => v.monitoramento && ['OPERANDO', 'CONFIRMANDO'].includes(v.monitoramento.situacao) && ['LIVRE', 'OCUPADA'].includes(v.estadoAtual));
   return { total: lista.length, monitoradas: validas.length, livres: validas.filter(v => v.estadoAtual === 'LIVRE').length, parcial: validas.length < lista.length };
 };
 const escopo = setorId ? { tipo: 'SETOR' as const, nome: `${andares[0].nome} · ${setores[0].nome}` }
   : andarId ? { tipo: 'ANDAR' as const, nome: andares[0].nome }
   : { tipo: 'GERAL' as const, nome: 'Todos os andares' };
 return { shopping: estrutura.shopping.nome, demonstracao: estrutura.shopping.demonstracao === true, andarId, setorId, escopo,
   ...contar(vagas), atualizadoEm: new Date().toISOString(), validadeMs: 30_000,
   grupos: andarId ? setores.map(s => ({ nome: s.nome, ...contar(s.vagas.filter(v => v.ativo)) })) : andares.map(a => ({ nome: a.nome, ...contar(a.setores.filter(s => s.ativo).flatMap(s => s.vagas.filter(v => v.ativo))) })),
   categorias: ['PCD', 'IDOSO', 'ELETRICA'].map(tipo => ({ tipo, ...contar(vagas.filter(v => v.tipo === tipo)) })),
 };
}
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
  async listar(shoppingId: string) { await shoppingAtivo(shoppingId); return { teloes: await prisma.telao.findMany({ where: { shoppingId }, select: publico, orderBy: { criadoEm: 'desc' } }) }; },
  async criar(shoppingId: string, body: Record<string, unknown>) {
   await shoppingAtivo(shoppingId);
   const nome = textoEquipamento(body.nome), andarId = recorteId(body.andarId), setorId = recorteId(body.setorId);
   await validarRecorte(shoppingId, andarId, setorId);
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
