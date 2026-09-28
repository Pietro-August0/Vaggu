// Persiste indisponibilidade de sensores silenciosos sem usar heartbeat da placa como evidência individual.
import type { PrismaClient } from '@prisma/client';
import type { ConfiguracaoTelemetria } from './service.js';

/** Marca uma única vez cada período expirado e preserva o instante efetivo do timeout. */
export async function expirarSensores(
  prisma: PrismaClient,
  configuracao: ConfiguracaoTelemetria,
  referencia = new Date(),
) {
  const limite = new Date(referencia.getTime() - configuracao.timeoutSensorMs);
  return prisma.$transaction(async (tx) => {
    const sensores = await tx.sensor.findMany({
      where: {
        ativo: true,
        expiradoEm: null,
        ultimaObservacaoEm: { lte: limite },
      },
    });
    const expirados: Array<{ sensorId: string; efetivoEm: Date }> = [];
    for (const candidato of sensores) {
      // Usa o mesmo lock da ingestão para não expirar uma observação renovada em outra instância.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${candidato.dispositivoId}))`;
      const sensor = await tx.sensor.findUnique({ where: { id: candidato.id } });
      if (!sensor?.ultimaObservacaoEm || sensor.expiradoEm !== null || sensor.ultimaObservacaoEm > limite) continue;
      const efetivoEm = new Date(sensor.ultimaObservacaoEm.getTime() + configuracao.timeoutSensorMs);
      const eventoId = `expiracao:${sensor.id}:${efetivoEm.toISOString()}`;
      await tx.sensor.update({
        where: { id: sensor.id },
        data: {
          estadoConfirmado: 'INDISPONIVEL',
          estadoCandidato: null,
          candidatoIniciadoEm: null,
          expiradoEm: efetivoEm,
        },
      });
      await tx.vaga.update({
        where: { id: sensor.vagaId },
        data: { estadoAtual: 'INDISPONIVEL' },
      });
      await tx.historicoVaga.upsert({
        where: { eventoId },
        create: {
          shoppingId: sensor.shoppingId,
          vagaId: sensor.vagaId,
          eventoId,
          estadoAnterior: sensor.estadoConfirmado,
          estado: 'INDISPONIVEL',
          efetivoEm,
          recebidoEm: referencia,
          origem: 'EXPIRACAO',
          motivo: 'SENSOR_SEM_RESPOSTA',
        },
        update: {},
      });
      expirados.push({ sensorId: sensor.id, efetivoEm });
    }
    return expirados;
  });
}
