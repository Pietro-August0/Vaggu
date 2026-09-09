import { resolveDatabaseUrl } from './database.js';

export function readEnv(env = process.env) {
  const databaseUrl = resolveDatabaseUrl(env.DATABASE_URL);

  const rawPort = env.PORT ?? '3000';
  const port = Number(rawPort);
  if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT deve ser um número inteiro entre 1 e 65535.');
  }

  return {
    databaseUrl,
    port,
    host: env.HOST || '127.0.0.1',
    whatsapp: {
      verifyToken: env.WHATSAPP_VERIFY_TOKEN || '',
      appSecret: env.META_APP_SECRET || '',
      accessToken: env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID || '',
      apiVersion: env.WHATSAPP_API_VERSION || 'v23.0',
      autoReplyEnabled: env.WHATSAPP_AUTO_REPLY_ENABLED === 'true',
    },
  };
}
