// Calcula e verifica assinaturas HMAC para confirmar que o corpo recebido veio de quem possui o segredo Meta.
import { createHmac, timingSafeEqual } from 'node:crypto';

const signaturePattern = /^sha256=([a-f0-9]{64})$/i;

/** Confere formato e bytes originais; compara assinaturas em tempo constante e retorna false se inválida. */
export function validateMetaSignature(rawBody, signatureHeader, appSecret) {
  if (!Buffer.isBuffer(rawBody) || rawBody.length === 0) return false;
  if (typeof appSecret !== 'string' || appSecret.length === 0) return false;
  if (typeof signatureHeader !== 'string') return false;

  const match = signaturePattern.exec(signatureHeader.trim());
  if (!match) return false;

  const expected = createHmac('sha256', appSecret).update(rawBody).digest();
  const received = Buffer.from(match[1], 'hex');
  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected);
}

/** Produz o cabeçalho usado pelos testes para simular um envio assinado; não envia mensagens. */
export function signMetaPayload(rawBody, appSecret) {
  return `sha256=${createHmac('sha256', appSecret).update(rawBody).digest('hex')}`;
}
