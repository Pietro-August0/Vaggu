/** Acrescenta equipamentos fictícios somente ao exemplo conhecido, sem simular tráfego real. */
import { randomBytes } from 'node:crypto';
import type { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/auth/password.js';

export async function garantirMonitoramentoApresentacao(prisma: PrismaClient) {
  const shoppingId = 'd3a09b29-7e5a-4b7e-8c42-8f371d0a0001';
  await prisma.$transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`monitoramento:${shoppingId}`}))`;
    const shopping = await tx.shopping.findUnique({ where: { id: shoppingId }, select: { demonstracao: true, excluidoEm: true } });
    if (!shopping?.demonstracao || shopping.excluidoEm) return;
    const setores = await tx.setor.findMany({ where: { shoppingId }, include: { vagas: { orderBy: { codigo: 'asc' } } } });
    const existentes = new Set((await tx.sensor.findMany({ where: { shoppingId }, select: { vagaId: true } })).map(sensor => sensor.vagaId));
    const referencia = new Date();
    for (const setor of setores) {
      if (!setor.vagas.length) continue;
      const codigo = `DEMO-ESP32-${setor.vagas[0].codigo.split('-')[0]}`;
      const existente = await tx.dispositivo.findUnique({ where: { codigo } });
      // Não assume a propriedade de um código eventualmente utilizado fora do exemplo.
      if (existente && existente.shoppingId !== shoppingId) continue;
      const placa = existente ?? await tx.dispositivo.create({ data: { shoppingId, codigo,
        nome: `ESP32 fictício · ${setor.nome}`, chaveApiHash: await hashPassword(randomBytes(32).toString('hex')),
        ultimoContatoEm: new Date(referencia.getTime() - 5_000) } });
      for (const [indice, vaga] of setor.vagas.entries()) {
        if (existentes.has(vaga.id)) continue;
        const manutencao = indice === 0;
        const semResposta = indice === 1;
        const pendente = indice === 2;
        // O exemplo reserva uma confirmação por setor mesmo quando o histórico sintético do dia termina sem leitura.
        const estadoConfirmado = pendente && !['LIVRE', 'OCUPADA'].includes(vaga.estadoAtual) ? 'LIVRE' : vaga.estadoAtual;
        if (estadoConfirmado !== vaga.estadoAtual) await tx.vaga.update({ where: { id: vaga.id }, data: { estadoAtual: estadoConfirmado } });
        await tx.sensor.create({ data: { shoppingId, dispositivoId: placa.id, vagaId: vaga.id,
          codigo: `DEMO-${vaga.codigo}`, ativo: !manutencao,
          estadoConfirmado: manutencao || semResposta ? 'INDISPONIVEL' : estadoConfirmado,
          estadoCandidato: pendente ? estadoConfirmado === 'LIVRE' ? 'OCUPADA' : 'LIVRE' : null,
          candidatoIniciadoEm: pendente ? new Date(referencia.getTime() - 15_000) : null,
          ultimaObservacaoEm: new Date(referencia.getTime() - (semResposta ? 600_000 : 5_000)),
          expiradoEm: semResposta ? new Date(referencia.getTime() - 480_000) : null,
        } });
      }
    }
  }, { timeout: 60_000 });
}
