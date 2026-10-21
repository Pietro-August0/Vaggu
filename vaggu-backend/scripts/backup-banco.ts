import { spawn } from 'node:child_process';
import { open, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Client } from 'pg';

export function conexaoBackup(valor: string, somenteLocal = false): URL {
  let url: URL;
  try { url = new URL(valor); } catch { throw new Error('Informe uma URL PostgreSQL explícita.'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !/^\/[a-zA-Z0-9_]+$/.test(url.pathname)
    || url.hash || [...url.searchParams.keys()].some((chave) => chave !== 'sslmode')) {
    throw new Error('Conexão inválida: use banco simples e somente sslmode opcional.');
  }
  if (somenteLocal && (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
    || !/_(teste|test)$/.test(url.pathname) || url.search)) {
    throw new Error('Restauração permitida somente em banco local novo terminado em _teste ou _test.');
  }
  return url;
}

function executar(ferramenta: string, args: string[], url: URL, bin: string) {
  const env = { ...process.env, PGHOST: url.hostname.replace(/^\[|\]$/g, ''), PGPORT: url.port || '5432',
    PGDATABASE: decodeURIComponent(url.pathname.slice(1)), PGUSER: decodeURIComponent(url.username),
    PGPASSWORD: decodeURIComponent(url.password), PGSSLMODE: url.searchParams.get('sslmode') || 'prefer', PGCONNECT_TIMEOUT: '10' };
  return new Promise<void>((ok, falha) => {
    const filho = spawn(bin ? join(bin, ferramenta + (process.platform === 'win32' ? '.exe' : '')) : ferramenta,
      args, { env, windowsHide: true, stdio: 'ignore' });
    filho.on('error', () => falha(new Error(`Não foi possível executar ${ferramenta}; confira PG_BIN.`)));
    filho.on('exit', (codigo) => codigo === 0 ? ok() : falha(new Error(`${ferramenta} falhou; confira versão, permissões e conexão. Nenhuma credencial foi registrada.`)));
  });
}

export async function criarBackup(valor: string, arquivo: string, bin = '') {
  const url = conexaoBackup(valor);
  const destino = resolve(arquivo);
  const reserva = await open(destino, 'wx', 0o600);
  await reserva.close();
  try {
    await executar('pg_dump', ['--format=custom', '--no-owner', '--no-acl', '--file', destino], url, bin);
  } catch (erro) { await unlink(destino); throw erro; }
  return destino;
}

export async function restaurarBackupLocal(valor: string, arquivo: string, bin = '') {
  const url = conexaoBackup(valor, true);
  const fonte = resolve(arquivo);
  const fd = await open(fonte, 'r');
  try {
    const cabecalho = Buffer.alloc(5);
    await fd.read(cabecalho, 0, 5, 0);
    if (cabecalho.toString() !== 'PGDMP') throw new Error('Informe um backup custom do pg_dump.');
  } finally { await fd.close(); }
  const controleUrl = new URL(url.href);
  controleUrl.pathname = '/postgres';
  const controle = new Client({ connectionString: controleUrl.href, connectionTimeoutMillis: 10000 });
  try {
    await controle.connect();
    // O nome passou pela lista estrita de caracteres. CREATE falha se já existir.
    await controle.query(`CREATE DATABASE "${url.pathname.slice(1)}" TEMPLATE template0`);
  } catch {
    throw new Error('Destino não criado: pode já existir ou faltar permissão CREATEDB. Nenhum banco existente foi alterado.');
  } finally { await controle.end(); }
  // Sem --clean/--create: só escreve no banco que acabou de ser criado; uma falha deixa o destino para inspeção.
  await executar('pg_restore', ['--exit-on-error', '--single-transaction', '--no-owner', '--no-acl', '--dbname', url.pathname.slice(1), fonte], url, bin);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [acao, arquivo] = process.argv.slice(2);
  try {
    if (!arquivo || !['criar', 'restaurar-local'].includes(acao)) throw new Error('Uso: backup-banco.js criar|restaurar-local arquivo.dump');
    const valor = process.env[acao === 'criar' ? 'BACKUP_DATABASE_URL' : 'RESTORE_DATABASE_URL'];
    if (!valor) throw new Error('Defina BACKUP_DATABASE_URL ou RESTORE_DATABASE_URL explicitamente; DATABASE_URL não é utilizada.');
    if (acao === 'criar') await criarBackup(valor, arquivo, process.env.PG_BIN);
    else await restaurarBackupLocal(valor, arquivo, process.env.PG_BIN);
    console.log(acao === 'criar' ? 'Backup concluído.' : 'Restauração local concluída; valide os dados antes de utilizar.');
  } catch (erro) {
    console.error(erro instanceof Error ? erro.message : 'Operação de backup falhou.');
    process.exitCode = 1;
  }
}
