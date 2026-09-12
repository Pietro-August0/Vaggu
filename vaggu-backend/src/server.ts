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

const config = readEnv();
const prisma = createPrisma(config.databaseUrl);
const whatsappClient = createWhatsappClient(config.whatsapp);
const whatsappService = createWhatsappService(prisma, whatsappClient, config.whatsapp);
const app = createApp({
  checkDatabase: () => prisma.$queryRaw`SELECT 1`,
  auth: createAuthService(prisma),
  whatsapp: { config: config.whatsapp, service: whatsappService },
  shoppings: createShoppingsService(prisma),
  conta: createContaService(prisma),
  estrutura: createEstruturaService(prisma),
});

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
  const timeout = setTimeout(() => process.exit(1), 5000);
  timeout.unref();
  server.close(async () => {
    await prisma.$disconnect();
    clearTimeout(timeout);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
