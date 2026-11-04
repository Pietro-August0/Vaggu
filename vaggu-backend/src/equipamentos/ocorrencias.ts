/** Agrupa a perda de contato da placa e conserva ocorrências independentes de manutenção. */
import type { Prisma } from '@prisma/client';
import type { ConfiguracaoTelemetria } from '../telemetria/service.js';
export async function sincronizarOcorrencias(tx: Prisma.TransactionClient, config: ConfiguracaoTelemetria, agora: Date) {
  const placas = await tx.dispositivo.findMany({ where: { ativo: true, shopping: { ativo: true, demonstracao: false, excluidoEm: null } }, orderBy: { id: 'asc' }, select: { id: true } });
  for (const { id } of placas) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${id}))`;
    const placa = await tx.dispositivo.findUniqueOrThrow({ where: { id }, include: { sensores: { where: { ativo: true }, orderBy: { criadoEm: 'asc' } } } });
    if (!placa.ativo) continue;
    const contato = placa.ultimoContatoEm ?? placa.sensores[0]?.criadoEm;
    const semPlaca = contato && agora.getTime() - contato.getTime() >= config.timeoutPlacaMs;
    if (semPlaca && !placa.emManutencao) {
      const chaveAtiva = `COMUNICACAO:${id}`;
      await tx.ocorrenciaEquipamento.upsert({ where: { chaveAtiva }, update: {}, create: { shoppingId: placa.shoppingId, dispositivoId: id, tipo: 'COMUNICACAO', motivo: 'Placa sem contato; os sensores associados podem estar afetados.', abertaEm: new Date(contato.getTime() + config.timeoutPlacaMs), chaveAtiva } });
      await tx.ocorrenciaEquipamento.updateMany({ where: { dispositivoId: id, sensorId: { not: null }, tipo: 'COMUNICACAO', encerradaEm: null }, data: { encerradaEm: agora, chaveAtiva: null, conclusao: 'Falha agrupada na ocorrência de comunicação da placa.' } });
      continue;
    }
    for (const sensor of placa.sensores) {
      const ultima = sensor.ultimaObservacaoEm ?? sensor.criadoEm;
      if (placa.emManutencao || sensor.emManutencao || agora.getTime() - ultima.getTime() < config.timeoutSensorMs) continue;
      const chaveAtiva = `COMUNICACAO:${sensor.id}`;
      await tx.ocorrenciaEquipamento.upsert({ where: { chaveAtiva }, update: {}, create: { shoppingId: placa.shoppingId, dispositivoId: id, sensorId: sensor.id, tipo: 'COMUNICACAO', motivo: 'Sensor sem observação individual válida.', abertaEm: new Date(ultima.getTime() + config.timeoutSensorMs), chaveAtiva } });
    }
  }
}
