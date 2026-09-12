// Cliente Prisma do PostgreSQL. Regras de domínio recebem o cliente por injeção
// para permitir testes de serviço sem abrir conexão real.
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/** Cria o cliente com adaptador PostgreSQL; quem o cria deve desconectá-lo ao terminar. */
export function createPrisma(databaseUrl = process.env.DATABASE_URL): PrismaClient {
  if (!databaseUrl) throw new Error('DATABASE_URL deve estar configurada para criar o Prisma Client.');
  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
}
