/** Renova somente o histórico sintético do Shopping Exemplo, sem recriar contas. */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { EstadoVaga, PrismaClient } from '@prisma/client';
import { createPrisma } from '../src/lib/prisma.js';

export const SHOPPING_EXEMPLO_ID = 'd3a09b29-7e5a-4b7e-8c42-8f371d0a0001';
const HORA_MS = 3_600_000;
const JANELA_MS = 14 * 24 * HORA_MS;
type VagaRenovacao = {
  id: string;
  estadoAtual: EstadoVaga;
  historico: Array<{ estado: EstadoVaga; efetivoEm: Date }>;
};

/** Horas absolutas tornam os eventos estáveis entre execuções e não criam dados futuros. */
export function planejarRenovacao(vagas: VagaRenovacao[], agora: Date) {
  if (!Number.isFinite(agora.getTime())) throw new Error('Data de referência inválida.');
  const fim = Math.floor(agora.getTime() / HORA_MS) * HORA_MS;
  return vagas.flatMap((vaga) => {
    const ultimo = vaga.historico[0];
    const inicio = Math.max(fim - JANELA_MS, ultimo ? Math.floor(ultimo.efetivoEm.getTime() / HORA_MS) * HORA_MS + HORA_MS : 0);
    let anterior: EstadoVaga = ultimo?.estado ?? vaga.estadoAtual;
    const semente = [...vaga.id].reduce((soma, letra) => soma + letra.charCodeAt(0), 0);
    const eventos = [];
    for (let instante = inicio; instante <= fim; instante += HORA_MS) {
      const valor = (Math.floor(instante / HORA_MS) * 17 + semente * 13) % 100;
      const estado: EstadoVaga = valor < 4 ? 'DESCONHECIDA' : valor < 64 ? 'OCUPADA' : 'LIVRE';
      // Registra apenas transições para preservar os ciclos completos na análise.
      if (estado === anterior) continue;
      eventos.push({
        shoppingId: SHOPPING_EXEMPLO_ID, vagaId: vaga.id,
        eventoId: `demo-renovacao:${vaga.id}:${instante}`, estadoAnterior: anterior, estado,
        efetivoEm: new Date(instante), recebidoEm: new Date(instante),
        origem: 'DEMONSTRACAO', motivo: 'RENOVACAO_CENARIO',
      });
      anterior = estado;
    }
    return eventos;
  });
}

export async function renovarCenarioApresentacao(prisma: PrismaClient, opcoes: { aplicar?: boolean; agora?: Date } = {}) {
  const agora = opcoes.agora ?? new Date();
  return prisma.$transaction(async (tx) => {
    // A trava serializa renovações e impede mudanças no marcador durante a operação.
    await tx.$queryRaw`SELECT id FROM shoppings WHERE id = ${SHOPPING_EXEMPLO_ID}::uuid FOR UPDATE`;
    const shopping = await tx.shopping.findUnique({ where: { id: SHOPPING_EXEMPLO_ID }, select: { demonstracao: true, excluidoEm: true } });
    if (!shopping?.demonstracao || shopping.excluidoEm) throw new Error('Shopping Exemplo ativo como demonstração não encontrado; nenhum dado alterado.');
    await tx.$queryRaw`SELECT id FROM vagas WHERE shopping_id = ${SHOPPING_EXEMPLO_ID}::uuid ORDER BY id FOR UPDATE`;
    const vagas = await tx.vaga.findMany({
      where: { shoppingId: SHOPPING_EXEMPLO_ID, ativo: true }, orderBy: { id: 'asc' },
      select: { id: true, estadoAtual: true, historico: { orderBy: [{ efetivoEm: 'desc' }, { registradoEm: 'desc' }], take: 1, select: { estado: true, efetivoEm: true } } },
    });
    const eventos = planejarRenovacao(vagas, agora);
    if (opcoes.aplicar) {
      for (let inicio = 0; inicio < eventos.length; inicio += 500) {
        await tx.historicoVaga.createMany({ data: eventos.slice(inicio, inicio + 500) });
      }
      // Estado corrente e histórico avançam juntos, sem alterar estrutura, sensores ou acessos.
      const ultimos = new Map(eventos.map((evento) => [evento.vagaId, evento]));
      for (const [id, evento] of ultimos) {
        await tx.vaga.updateMany({ where: { id, shoppingId: SHOPPING_EXEMPLO_ID }, data: { estadoAtual: evento.estado, ultimaLeituraEm: evento.efetivoEm } });
      }
    }
    return { shoppingId: SHOPPING_EXEMPLO_ID, modo: opcoes.aplicar ? 'APLICADO' : 'PREVIA', vagas: vagas.length, eventos: eventos.length, referencia: agora.toISOString() };
  }, { timeout: 120_000 });
}

async function main() {
  const argumentos = process.argv.slice(2);
  if (argumentos.some((arg) => arg !== '--apply')) throw new Error('Argumento inválido. Use sem argumentos para prévia ou --apply para gravar.');
  const databaseUrl = process.env.DEMO_DATABASE_URL;
  if (!databaseUrl) throw new Error('Defina DEMO_DATABASE_URL; DATABASE_URL não é usada.');
  const prisma = createPrisma(databaseUrl);
  try {
    console.log(JSON.stringify(await renovarCenarioApresentacao(prisma, { aplicar: argumentos.includes('--apply') })));
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(() => {
  // Falhas de conexão podem conter credenciais; não imprimir o erro bruto do driver.
  console.error('Não foi possível renovar o cenário. Confira argumentos, DEMO_DATABASE_URL e o marcador de demonstração.');
  process.exitCode = 1;
});
