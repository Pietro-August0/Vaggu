import { createTeloesService } from './teloes/service.js';
import { createEquipamentosService } from './equipamentos/service.js';
// Ponto de entrada executável: lê a configuração, conecta os serviços e inicia o HTTP.
// Também encerra a conexão com o banco quando o processo recebe um sinal de parada.
import 'dotenv/config';
import { readEnv } from './config/env.js';
import { createPrisma } from './lib/prisma.js';
import { createApp } from './app.js';
import { createAuthService } from './auth/service.js';
import { createWhatsappClient } from './whatsapp/client.js';
import { createWhatsappService } from './whatsapp/service.js';
import { createShoppingsService } from './shoppings/service.js';
import { createContaService } from './conta/service.js';
import { createEstruturaService } from './estrutura/service.js';
import { createImportacaoService } from './importacao/service.js';
import { createTelemetriaService } from './telemetria/service.js';
import { expirarSensores } from './telemetria/expiracao.js';
import { createAnaliticosService } from './analiticos/service.js';
import { garantirCenarioApresentacao } from '../scripts/criar-cenario-apresentacao.js';

const config = readEnv();
const prisma = createPrisma(config.databaseUrl);
// O ambiente publicado usa sua própria conexão; os dados fictícios ficam isolados no exemplo.
if (process.env.NODE_ENV === 'production') await garantirCenarioApresentacao(prisma);
const whatsappClient = createWhatsappClient(config.whatsapp);
const whatsappService = createWhatsappService(prisma, whatsappClient, config.whatsapp);
const telemetriaService = createTelemetriaService(prisma, config.telemetria);
const app = createApp({
  checkDatabase: () => prisma.$queryRaw`SELECT 1`,
  frontendDistPath: process.env.FRONTEND_DIST_PATH,
  auth: createAuthService(prisma),
  whatsapp: { config: config.whatsapp, service: whatsappService },
  shoppings: createShoppingsService(prisma),
  conta: createContaService(prisma),
  estrutura: createEstruturaService(prisma, config.telemetria.timeoutSensorMs),
  importacao: createImportacaoService(prisma),
  telemetria: telemetriaService,
  analiticos: createAnaliticosService(prisma),
  equipamentos: createEquipamentosService(prisma),
  teloes: createTeloesService(prisma, config.telemetria.timeoutSensorMs),
});

// O job persiste a expiração; o mapa também aplica validade no momento da leitura.
const tarefaExpiracao = setInterval(() => {
  expirarSensores(prisma, config.telemetria).catch(() => {
    console.error('Não foi possível executar a expiração de sensores.');
  });
}, config.telemetria.intervaloExpiracaoMs);
tarefaExpiracao.unref();

const server = app.listen(config.port, config.host, () => {
  console.log(`Vaggu API: http://${config.host}:${config.port}/api/v1/health`);
  console.log('Para testar o banco: GET /api/v1/health/ready');
});

server.on('error', async (error: NodeJS.ErrnoException) => {
  console.error(error.code === 'EADDRINUSE'
    ? 'Porta já está em uso. Altere PORT no .env.'
    : 'Não foi possível iniciar o servidor. Verifique HOST e PORT.');
  await prisma.$disconnect();
  process.exitCode = 1;
});

let closing = false;
/** Impede encerramentos duplicados e limita a cinco segundos a espera por conexões abertas. */
async function shutdown() {
  if (closing) return;
  closing = true;
  clearInterval(tarefaExpiracao);
  const timeout = setTimeout(() => process.exit(1), 5000);
  timeout.unref();
  server.close(async () => {
    await prisma.$disconnect();
    clearTimeout(timeout);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
