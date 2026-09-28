// Processa telemetria autenticada com ordem, idempotência e confirmação persistidas no PostgreSQL.
import { createHash } from 'node:crypto';
import type { PrismaClient } from '@prisma/client';
import { ApiError } from '../auth/service.js';
import { verifyPassword } from '../auth/password.js';
import { criarConfirmacaoEstado, observarEstado, type ConfirmacaoEstado } from './confirmacao-estado.js';
import {
  extrairChaveDispositivo,
  validarHeartbeat,
  validarMensagemEstados,
  type MensagemBaseTelemetria,
  type MensagemEstados,
} from './contratos.js';

export type ConfiguracaoTelemetria = {
  lacunaMaximaMs: number;
  timeoutSensorMs: number;
  timeoutPlacaMs: number;
};

type TipoMensagem = 'HEARTBEAT' | 'ESTADOS';

const erroCredencial = () => new ApiError(401, 'PLACA_NAO_AUTENTICADA', 'Credencial da placa ausente ou inválida.');

function hashPayload(tipo: TipoMensagem, mensagem: MensagemBaseTelemetria | MensagemEstados): string {
  return createHash('sha256').update(JSON.stringify({ tipo, mensagem })).digest('hex');
}

function confirmacaoPersistida(sensor: {
  estadoConfirmado: string;
  estadoCandidato: string | null;
  candidatoIniciadoEm: Date | null;
  ultimaObservacaoEm: Date | null;
  expiradoEm: Date | null;
}): ConfirmacaoEstado {
  const estadoConfirmado = sensor.expiradoEm === null && ['LIVRE', 'OCUPADA'].includes(sensor.estadoConfirmado)
    ? sensor.estadoConfirmado as 'LIVRE' | 'OCUPADA'
    : 'DESCONHECIDA';
  const estadoCandidato = sensor.estadoCandidato;
  const candidatoIniciadoEm = sensor.candidatoIniciadoEm;
  const ultimaObservacaoEm = sensor.ultimaObservacaoEm;
  if (sensor.expiradoEm !== null
    || (estadoCandidato !== 'LIVRE' && estadoCandidato !== 'OCUPADA')
    || candidatoIniciadoEm === null
    || ultimaObservacaoEm === null) return criarConfirmacaoEstado(estadoConfirmado);
  return {
    estadoConfirmado,
    candidato: {
      estado: estadoCandidato,
      iniciadoEmMs: candidatoIniciadoEm.getTime(),
      ultimaObservacaoEmMs: ultimaObservacaoEm.getTime(),
    },
    ultimaObservacaoEmMs: ultimaObservacaoEm.getTime(),
  };
}

/** Cria o serviço; o relógio injetável mantém confirmação e expiração determinísticas nos testes. */
export function createTelemetriaService(
  prisma: PrismaClient,
  configuracao: ConfiguracaoTelemetria,
  { now = () => new Date() }: { now?: () => Date } = {},
) {
  async function autenticar(placaCodigo: string, autorizacao: string | undefined) {
    const chave = extrairChaveDispositivo(autorizacao);
    const dispositivo = await prisma.dispositivo.findUnique({ where: { codigo: placaCodigo } });
    if (!dispositivo || !dispositivo.ativo || !(await verifyPassword(chave, dispositivo.chaveApiHash))) {
      throw erroCredencial();
    }
    return dispositivo;
  }

  async function processar(
    tipo: TipoMensagem,
    mensagem: MensagemBaseTelemetria | MensagemEstados,
    autorizacao: string | undefined,
  ) {
    const autenticado = await autenticar(mensagem.placaCodigo, autorizacao);
    const recebidoEm = now();
    const payloadHash = hashPayload(tipo, mensagem);

    const resultado = await prisma.$transaction(async (tx) => {
      // Serializa mensagens da mesma placa, inclusive quando chegam em instâncias diferentes da API.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${autenticado.id}))`;
      const dispositivo = await tx.dispositivo.findUnique({ where: { id: autenticado.id } });
      if (!dispositivo || !dispositivo.ativo) throw erroCredencial();

      const chaveEvento = {
        dispositivoId_inicializacaoId_sequencia: {
          dispositivoId: dispositivo.id,
          inicializacaoId: mensagem.inicializacaoId,
          sequencia: mensagem.sequencia,
        },
      };
      const existente = await tx.eventoTelemetriaRecebido.findUnique({ where: chaveEvento });
      if (existente) {
        if (existente.payloadHash !== payloadHash || existente.tipo !== tipo) {
          return { erro: new ApiError(409, 'SEQUENCIA_REUTILIZADA', 'A sequência já foi usada com outro conteúdo.') };
        }
        if (existente.resultado === 'REJEITADO_ORDEM') {
          return { erro: new ApiError(409, 'EVENTO_FORA_DE_ORDEM', 'A mensagem pertence a uma ordem ou inicialização antiga.') };
        }
        return { duplicado: true, recebidoEm: existente.recebidoEm, leituras: [] as Array<unknown> };
      }

      const inicializacaoConhecida = await tx.inicializacaoPlaca.findUnique({
        where: {
          dispositivoId_inicializacaoId: {
            dispositivoId: dispositivo.id,
            inicializacaoId: mensagem.inicializacaoId,
          },
        },
      });
      const mudouInicializacao = dispositivo.inicializacaoAtualId !== mensagem.inicializacaoId;
      const inicializacaoAntiga = mudouInicializacao && inicializacaoConhecida !== null;
      const sequenciaAntiga = !mudouInicializacao
        && dispositivo.ultimaSequencia !== null
        && mensagem.sequencia <= dispositivo.ultimaSequencia;
      const novaInicializacaoInvalida = mudouInicializacao && inicializacaoConhecida === null && mensagem.sequencia > 1;

      if (inicializacaoAntiga || sequenciaAntiga || novaInicializacaoInvalida) {
        await tx.eventoTelemetriaRecebido.create({
          data: {
            shoppingId: dispositivo.shoppingId,
            dispositivoId: dispositivo.id,
            inicializacaoId: mensagem.inicializacaoId,
            sequencia: mensagem.sequencia,
            tipo,
            payloadHash,
            resultado: 'REJEITADO_ORDEM',
            recebidoEm,
          },
        });
        return { erro: new ApiError(409, 'EVENTO_FORA_DE_ORDEM', 'A mensagem pertence a uma ordem ou inicialização antiga.') };
      }

      let sensores: Awaited<ReturnType<typeof tx.sensor.findMany>> = [];
      if (tipo === 'ESTADOS') {
        const estados = mensagem as MensagemEstados;
        sensores = await tx.sensor.findMany({
          where: {
            dispositivoId: dispositivo.id,
            shoppingId: dispositivo.shoppingId,
            codigo: { in: estados.leituras.map((leitura) => leitura.sensorCodigo) },
            ativo: true,
          },
          include: { vaga: true },
        });
        if (sensores.length !== estados.leituras.length) {
          throw new ApiError(403, 'SENSOR_NAO_AUTORIZADO', 'O lote contém sensor não vinculado à placa autenticada.');
        }
      }

      if (mudouInicializacao) {
        if (dispositivo.inicializacaoAtualId) {
          await tx.inicializacaoPlaca.updateMany({
            where: { dispositivoId: dispositivo.id, inicializacaoId: dispositivo.inicializacaoAtualId, encerradaEm: null },
            data: { encerradaEm: recebidoEm },
          });
        }
        await tx.inicializacaoPlaca.create({
          data: {
            shoppingId: dispositivo.shoppingId,
            dispositivoId: dispositivo.id,
            inicializacaoId: mensagem.inicializacaoId,
            iniciadaEm: recebidoEm,
          },
        });
        // Uma reinicialização invalida candidatos montados antes da perda de continuidade.
        await tx.sensor.updateMany({
          where: { dispositivoId: dispositivo.id },
          data: { estadoCandidato: null, candidatoIniciadoEm: null },
        });
      }

      await tx.eventoTelemetriaRecebido.create({
        data: {
          shoppingId: dispositivo.shoppingId,
          dispositivoId: dispositivo.id,
          inicializacaoId: mensagem.inicializacaoId,
          sequencia: mensagem.sequencia,
          tipo,
          payloadHash,
          recebidoEm,
        },
      });
      await tx.dispositivo.update({
        where: { id: dispositivo.id },
        data: {
          inicializacaoAtualId: mensagem.inicializacaoId,
          ultimaSequencia: mensagem.sequencia,
          ultimoContatoEm: recebidoEm,
        },
      });

      const leiturasProcessadas: Array<{ sensorCodigo: string; situacao: string; estadoConfirmado: string }> = [];
      if (tipo === 'ESTADOS') {
        const estados = mensagem as MensagemEstados;
        const sensoresPorCodigo = new Map(sensores.map((sensor) => [sensor.codigo, sensor]));
        for (const leitura of estados.leituras) {
          const sensor = sensoresPorCodigo.get(leitura.sensorCodigo);
          if (!sensor) {
            throw new ApiError(403, 'SENSOR_NAO_AUTORIZADO', 'O lote contém sensor não vinculado à placa autenticada.');
          }
          const observacao = observarEstado(
            confirmacaoPersistida(sensor),
            { estado: leitura.estadoDetectado, recebidoEmMs: recebidoEm.getTime() },
            configuracao.lacunaMaximaMs,
          );
          const candidato = observacao.proximo.candidato;
          const estadoConfirmado = observacao.situacao === 'CONFIRMADA'
            ? leitura.estadoDetectado
            : sensor.estadoConfirmado;
          await tx.sensor.update({
            where: { id: sensor.id },
            data: {
              estadoConfirmado,
              estadoCandidato: candidato?.estado ?? null,
              candidatoIniciadoEm: candidato ? new Date(candidato.iniciadoEmMs) : null,
              ultimaObservacaoEm: recebidoEm,
              expiradoEm: null,
            },
          });
          await tx.vaga.update({
            where: { id: sensor.vagaId },
            data: {
              ultimaLeituraEm: recebidoEm,
              ...(observacao.situacao === 'CONFIRMADA' ? { estadoAtual: leitura.estadoDetectado } : {}),
            },
          });
          if (observacao.situacao === 'CONFIRMADA') {
            await tx.historicoVaga.create({
              data: {
                shoppingId: dispositivo.shoppingId,
                vagaId: sensor.vagaId,
                eventoId: `${dispositivo.id}:${mensagem.inicializacaoId}:${mensagem.sequencia}:${sensor.id}`,
                estadoAnterior: sensor.estadoConfirmado,
                estado: leitura.estadoDetectado,
                efetivoEm: recebidoEm,
                recebidoEm,
                origem: 'TELEMETRIA',
                motivo: 'CONFIRMACAO',
              },
            });
          }
          leiturasProcessadas.push({
            sensorCodigo: leitura.sensorCodigo,
            situacao: observacao.situacao,
            estadoConfirmado,
          });
        }
      }
      return { duplicado: false, recebidoEm, leituras: leiturasProcessadas };
    });

    if ('erro' in resultado) throw resultado.erro;
    const status: 'DUPLICADO' | 'PROCESSADO' = resultado.duplicado ? 'DUPLICADO' : 'PROCESSADO';
    return {
      status,
      recebidoEm: resultado.recebidoEm,
      leituras: resultado.leituras,
    };
  }

  return {
    receberHeartbeat(autorizacao: string | undefined, valor: unknown) {
      const mensagem = validarHeartbeat(valor);
      return processar('HEARTBEAT', mensagem, autorizacao);
    },
    receberEstados(autorizacao: string | undefined, valor: unknown) {
      const mensagem = validarMensagemEstados(valor);
      return processar('ESTADOS', mensagem, autorizacao);
    },
  };
}
