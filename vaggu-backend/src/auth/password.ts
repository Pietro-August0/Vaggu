// Protege senhas com scrypt e sal aleatório; guarda o resultado derivado, nunca a senha original.
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const options = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
// Mesmo custo de verificação para um e-mail que não existe.
export const dummyHash = `scrypt$32768$8$1$${'00'.repeat(16)}$${'00'.repeat(64)}`;

/** Executa a derivação assíncrona com os mesmos parâmetros na criação e na verificação. */
function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey as Buffer);
    });
  });
}

/** Aceita de 12 a 128 caracteres e serializa parâmetros, sal e hash para futuras verificações. */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
    throw new Error('A senha deve ter entre 12 e 128 caracteres.');
  }
  const salt = randomBytes(16);
  const hash = await derive(password, salt);
  return `scrypt$32768$8$1$${salt.toString('hex')}$${hash.toString('hex')}`;
}

/** Recusa formatos inválidos e compara hashes em tempo constante para evitar comparação caractere a caractere. */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (typeof password !== 'string' || password.length > 128) return false;
  if (typeof storedHash !== 'string'
    || !/^scrypt\$32768\$8\$1\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(storedHash)) return false;
  const [, , , , salt, expected] = storedHash.split('$');
  const actual = await derive(password, Buffer.from(salt, 'hex'));
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
