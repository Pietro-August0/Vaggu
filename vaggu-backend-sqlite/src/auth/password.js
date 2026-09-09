import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(scrypt);
const options = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
// Mesmo custo de verificação para um e-mail que não existe.
export const dummyHash = `scrypt$32768$8$1$${'00'.repeat(16)}$${'00'.repeat(64)}`;

export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
    throw new Error('A senha deve ter entre 12 e 128 caracteres.');
  }
  const salt = randomBytes(16);
  const hash = await derive(password, salt, 64, options);
  return `scrypt$32768$8$1$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || password.length > 128) return false;
  if (typeof storedHash !== 'string'
    || !/^scrypt\$32768\$8\$1\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(storedHash)) return false;
  const [, , , , salt, expected] = storedHash.split('$');
  const actual = await derive(password, Buffer.from(salt, 'hex'), 64, options);
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
