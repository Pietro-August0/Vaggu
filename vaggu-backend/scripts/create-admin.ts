// Comando interativo para criar o primeiro administrador e exibir a senha gerada uma única vez no terminal.
import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { readEnv } from '../src/config/env.js';
import { createPrisma } from '../src/lib/prisma.js';
import { createInitialAdmin } from '../src/auth/bootstrap.js';
import { ApiError } from '../src/auth/service.js';

const prompt = createInterface({ input: stdin, output: stdout });
let prisma;
try {
  prisma = createPrisma(readEnv().databaseUrl);
  console.log('Criar o primeiro administrador da Vaggu (não substitui contas existentes).');
  const nome = await prompt.question('Seu nome: ');
  const email = await prompt.question('Seu e-mail: ');
  const result = await createInitialAdmin(prisma, { nome, email });
  console.log('\nAdministrador criado. Guarde os dados em um gerenciador de senhas.');
  console.log(`E-mail: ${result.usuario.email}`);
  console.log(`Senha gerada (exibida somente agora): ${result.senha}`);
  console.log('Não compartilhe essa senha nem envie prints deste terminal.');
} catch (error) {
  console.error(error instanceof ApiError ? error.message
    : 'Não foi possível criar o administrador. Confira a configuração e execute npm run db:setup.');
  process.exitCode = 1;
} finally {
  prompt.close();
  if (prisma) await prisma.$disconnect();
}
