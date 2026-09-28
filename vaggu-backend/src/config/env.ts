// Converte variáveis do processo em configuração da API e valida banco e porta.
// Segredos do WhatsApp permanecem no backend; a resposta automática exige habilitação explícita.
import { resolveDatabaseUrl } from './database.js';

function inteiroPositivo(valor: string | undefined, padrao: number, nome: string): number {
  const texto = valor ?? String(padrao);
  const numero = Number(texto);
  if (!/^\d+$/.test(texto) || !Number.isSafeInteger(numero) || numero <= 0) {
    throw new Error(`${nome} deve ser um número inteiro positivo.`);
  }
  return numero;
}

/** Lê um ambiente informado ou o processo atual e falha cedo diante de configuração obrigatória inválida. */
export function readEnv(env: NodeJS.ProcessEnv = process.env) {
  const databaseUrl = resolveDatabaseUrl(env.DATABASE_URL);

  const rawPort = env.PORT ?? '3000';
  const port = Number(rawPort);
  if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT deve ser um número inteiro entre 1 e 65535.');
  }
  const lacunaMaximaMs = inteiroPositivo(env.TELEMETRIA_LACUNA_MAXIMA_MS, 15_000, 'TELEMETRIA_LACUNA_MAXIMA_MS');
  if (lacunaMaximaMs >= 30_000) {
    throw new Error('TELEMETRIA_LACUNA_MAXIMA_MS deve ser menor que a janela de confirmação de 30000 ms.');
  }

  return {
    databaseUrl,
    port,
    host: env.HOST || '127.0.0.1',
    telemetria: {
      lacunaMaximaMs,
      timeoutSensorMs: inteiroPositivo(env.TELEMETRIA_TIMEOUT_SENSOR_MS, 120_000, 'TELEMETRIA_TIMEOUT_SENSOR_MS'),
      timeoutPlacaMs: inteiroPositivo(env.TELEMETRIA_TIMEOUT_PLACA_MS, 120_000, 'TELEMETRIA_TIMEOUT_PLACA_MS'),
      intervaloExpiracaoMs: inteiroPositivo(env.TELEMETRIA_INTERVALO_EXPIRACAO_MS, 30_000, 'TELEMETRIA_INTERVALO_EXPIRACAO_MS'),
    },
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
