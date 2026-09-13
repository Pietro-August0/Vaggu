// Protege a senha provisória reversível usada somente durante a entrega inicial do acesso.
// O hash continua sendo a credencial de autenticação; esta cópia é apagada na primeira troca.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const VERSAO = 'v1';

/** Deriva uma chave AES estável sem persistir a chave junto ao texto protegido. */
function derivarChave(segredo: string) {
  if (!segredo) throw new Error('Configure o segredo de proteção das senhas provisórias.');
  return createHash('sha256').update(segredo, 'utf8').digest();
}

/** Criptografa com AES-256-GCM e reúne versão, nonce, tag e conteúdo em um único campo. */
export function protegerSenhaProvisoria(senha: string, segredo: string) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', derivarChave(segredo), nonce);
  const conteudo = Buffer.concat([cipher.update(senha, 'utf8'), cipher.final()]);
  return [VERSAO, nonce.toString('base64url'), cipher.getAuthTag().toString('base64url'), conteudo.toString('base64url')].join('.');
}

/** Recupera a senha somente quando o payload íntegro foi criado pela versão conhecida. */
export function revelarSenhaProvisoria(valor: string, segredo: string) {
  const [versao, nonce, tag, conteudo, excedente] = valor.split('.');
  if (versao !== VERSAO || !nonce || !tag || !conteudo || excedente) {
    throw new Error('Credencial provisória protegida inválida.');
  }
  const decipher = createDecipheriv('aes-256-gcm', derivarChave(segredo), Buffer.from(nonce, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(conteudo, 'base64url')), decipher.final()]).toString('utf8');
}
