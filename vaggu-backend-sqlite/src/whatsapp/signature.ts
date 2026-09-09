import { createHmac, timingSafeEqual } from 'node:crypto';

const signaturePattern = /^sha256=([a-f0-9]{64})$/i;

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

export function signMetaPayload(rawBody, appSecret) {
  return `sha256=${createHmac('sha256', appSecret).update(rawBody).digest('hex')}`;
}
