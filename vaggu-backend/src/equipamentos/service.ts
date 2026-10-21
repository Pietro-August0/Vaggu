/** Operações administrativas; vínculos e escopo são conferidos no servidor. */
import { randomBytes, randomUUID } from 'node:crypto';
import type { Prisma, PrismaClient } from '@prisma/client';
import { ApiError } from '../auth/service.js';
import { hashPassword } from '../auth/password.js';

export function idEquipamento(valor: unknown): string {
  if (typeof valor !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor)) throw new ApiError(400, 'ID_INVALIDO', 'Identificador inválido.');
  return valor;
}
export function textoEquipamento(valor: unknown, max = 120): string {
  if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > max) throw new ApiError(400, 'DADOS_INVALIDOS', `Informe um texto de 1 a ${max} caracteres.`);
  return valor.trim();
}
const placaPublica = { id: true, shoppingId: true, codigo: true, nome: true, ativo: true, emManutencao: true, ultimoContatoEm: true } as const;
function codigoEquipamento(valor: unknown) {
  const codigo = textoEquipamento(valor, 60);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(codigo)) throw new ApiError(400, 'CODIGO_INVALIDO', 'Comece com letra ou número; use apenas letras sem acentos, números, ponto, hífen ou sublinhado.');
  return codigo;
}
async function shoppingAtivo(tx: Prisma.TransactionClient, shoppingId: string) {
  if (!await tx.shopping.findFirst({ where: { id: idEquipamento(shoppingId), ativo: true, excluidoEm: null }, select: { id: true } })) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping ativo não encontrado.');
}
async function placaNoShopping(tx: Prisma.TransactionClient, shoppingId: string, id: string) {
  await shoppingAtivo(tx, shoppingId);
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${idEquipamento(id)}))`;
  const placa = await tx.dispositivo.findFirst({ where: { id, shoppingId } });
  if (!placa) throw new ApiError(404, 'PLACA_NAO_ENCONTRADA', 'Placa não encontrada neste shopping.');
  return placa;
}
export async function invalidarSensor(tx: Prisma.TransactionClient, sensorId: string, motivo: string, agora = new Date()) {
  const sensor = await tx.sensor.findUniqueOrThrow({ where: { id: sensorId } });
  await tx.sensor.update({ where: { id: sensorId }, data: { estadoConfirmado: 'INDISPONIVEL', estadoCandidato: null, candidatoIniciadoEm: null, ultimaObservacaoEm: null, expiradoEm: null } });
  await tx.vaga.update({ where: { id: sensor.vagaId }, data: { estadoAtual: 'INDISPONIVEL', ultimaLeituraEm: null } });
  if (sensor.estadoConfirmado !== 'INDISPONIVEL') await tx.historicoVaga.create({ data: { shoppingId: sensor.shoppingId, vagaId: sensor.vagaId, eventoId: `operacao:${randomUUID()}`, estadoAnterior: sensor.estadoConfirmado, estado: 'INDISPONIVEL', efetivoEm: agora, recebidoEm: agora, origem: 'OPERACAO', motivo } });
}
function conflito(erro: unknown): never {
  if (typeof erro === 'object' && erro !== null && 'code' in erro && erro.code === 'P2002') throw new ApiError(409, 'VINCULO_DUPLICADO', 'Código ou vaga já vinculados. Atualize a lista antes de tentar novamente.');
  throw erro;
}
export function createEquipamentosService(prisma: PrismaClient) {
  return {
    async listar(shoppingId: string) {
      await shoppingAtivo(prisma, shoppingId);
      return { placas: await prisma.dispositivo.findMany({ where: { shoppingId }, orderBy: { nome: 'asc' }, select: { ...placaPublica, sensores: { orderBy: { codigo: 'asc' }, select: { id: true, codigo: true, ativo: true, emManutencao: true, vagaId: true, ultimaObservacaoEm: true, estadoConfirmado: true } } } }), ocorrencias: [...await prisma.ocorrenciaEquipamento.findMany({ where: { shoppingId, encerradaEm: null }, orderBy: { abertaEm: 'desc' } }), ...await prisma.ocorrenciaEquipamento.findMany({ where: { shoppingId, encerradaEm: { not: null } }, orderBy: { abertaEm: 'desc' }, take: 100 })] };
    },
    async criarPlaca(shoppingId: string, corpo: Record<string, unknown>) {
      const codigo = codigoEquipamento(corpo.codigo), nome = textoEquipamento(corpo.nome);
      const chave = randomBytes(32).toString('base64url'), chaveApiHash = await hashPassword(chave);
      try { return await prisma.$transaction(async tx => {
        await shoppingAtivo(tx, shoppingId);
        const placa = await tx.dispositivo.create({ data: { shoppingId, codigo, nome, chaveApiHash }, select: placaPublica });
        return { placa, chave };
      }); } catch (erro) { conflito(erro); }
    },
    async editarPlaca(shoppingId: string, id: string, corpo: Record<string, unknown>) {
      if (corpo.ativo !== undefined && typeof corpo.ativo !== 'boolean') throw new ApiError(400, 'DADOS_INVALIDOS', 'Estado de ativação inválido.');
      const nome = corpo.nome === undefined ? undefined : textoEquipamento(corpo.nome);
      return prisma.$transaction(async tx => {
        await placaNoShopping(tx, shoppingId, id);
        const placa = await tx.dispositivo.update({ where: { id }, data: { nome, ativo: corpo.ativo as boolean | undefined }, select: placaPublica });
        if (corpo.ativo === false) for (const sensor of await tx.sensor.findMany({ where: { dispositivoId: id } })) await invalidarSensor(tx, sensor.id, 'PLACA_INATIVA');
        return { placa };
      });
    },
    async rotacionarChave(shoppingId: string, id: string) {
      const chave = randomBytes(32).toString('base64url'), chaveApiHash = await hashPassword(chave);
      return prisma.$transaction(async tx => {
        await placaNoShopping(tx, shoppingId, id);
        await tx.dispositivo.update({ where: { id }, data: { chaveApiHash } });
        return { chave };
      });
    },
    async vincularSensor(shoppingId: string, id: string, corpo: Record<string, unknown>) {
      const vagaId = idEquipamento(corpo.vagaId), codigo = codigoEquipamento(corpo.codigo);
      try { return await prisma.$transaction(async tx => {
        const placa = await placaNoShopping(tx, shoppingId, id);
        if (!placa.ativo) throw new ApiError(409, 'PLACA_INATIVA', 'Reative a placa antes de cadastrar sensores.');
        const vaga = await tx.vaga.findFirst({ where: { id: vagaId, shoppingId, ativo: true, andar: { ativo: true }, setor: { ativo: true } } });
        if (!vaga) throw new ApiError(404, 'VAGA_NAO_ENCONTRADA', 'Vaga ativa não encontrada neste shopping.');
        const sensor = await tx.sensor.create({ data: { shoppingId, dispositivoId: id, vagaId, codigo }, select: { id: true, codigo: true, vagaId: true } });
        await tx.vaga.update({ where: { id: vagaId }, data: { dispositivoId: id, canalSensor: codigo, estadoAtual: 'INDISPONIVEL', ultimaLeituraEm: null } });
        return { sensor };
      }); } catch (erro) { conflito(erro); }
    },
    async abrirManutencao(shoppingId: string, dispositivoId: string, corpo: Record<string, unknown>, autorId: string) {
      const motivo = textoEquipamento(corpo.motivo, 500), sensorId = corpo.sensorId == null ? null : idEquipamento(corpo.sensorId);
      return prisma.$transaction(async tx => {
        await placaNoShopping(tx, shoppingId, dispositivoId);
        if (sensorId && !await tx.sensor.findFirst({ where: { id: sensorId, shoppingId, dispositivoId } })) throw new ApiError(404, 'SENSOR_NAO_ENCONTRADO', 'Sensor não encontrado nesta placa.');
        const chaveAtiva = `MANUTENCAO:${sensorId ?? dispositivoId}`;
        const ocorrencia = await tx.ocorrenciaEquipamento.upsert({ where: { chaveAtiva }, update: {}, create: { shoppingId, dispositivoId, sensorId, tipo: 'MANUTENCAO', motivo, autorId, chaveAtiva } });
        if (sensorId) await tx.sensor.update({ where: { id: sensorId }, data: { emManutencao: true } });
        else await tx.dispositivo.update({ where: { id: dispositivoId }, data: { emManutencao: true } });
        for (const sensor of await tx.sensor.findMany({ where: { dispositivoId, ...(sensorId ? { id: sensorId } : {}) } })) await invalidarSensor(tx, sensor.id, 'MANUTENCAO');
        return { ocorrencia };
      });
    },
    async encerrarManutencao(shoppingId: string, id: string, corpo: Record<string, unknown>, autorId: string) {
      const conclusao = textoEquipamento(corpo.conclusao, 500);
      return prisma.$transaction(async tx => {
        const original = await tx.ocorrenciaEquipamento.findFirst({ where: { id: idEquipamento(id), shoppingId: idEquipamento(shoppingId), tipo: 'MANUTENCAO' } });
        if (!original) throw new ApiError(404, 'OCORRENCIA_NAO_ENCONTRADA', 'Manutenção não encontrada.');
        await placaNoShopping(tx, shoppingId, original.dispositivoId);
        const ocorrencia = await tx.ocorrenciaEquipamento.findUniqueOrThrow({ where: { id } });
        if (ocorrencia.encerradaEm) return { ocorrencia };
        if (ocorrencia.sensorId) await tx.sensor.update({ where: { id: ocorrencia.sensorId }, data: { emManutencao: false } });
        else await tx.dispositivo.update({ where: { id: ocorrencia.dispositivoId }, data: { emManutencao: false } });
        for (const sensor of await tx.sensor.findMany({ where: { dispositivoId: ocorrencia.dispositivoId, ...(ocorrencia.sensorId ? { id: ocorrencia.sensorId } : {}) } })) await invalidarSensor(tx, sensor.id, 'RETORNO_MANUTENCAO');
        return { ocorrencia: await tx.ocorrenciaEquipamento.update({ where: { id }, data: { conclusao, encerradoPorId: autorId, encerradaEm: new Date(), chaveAtiva: null } }) };
      });
    },
  };
}
