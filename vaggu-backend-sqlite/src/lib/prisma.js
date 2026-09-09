import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';

export function createPrisma(databaseUrl) {
  // Adapter em modo de arquivo local: não usa serviço na nuvem.
  const adapter = new PrismaLibSql({ url: databaseUrl });

  return new PrismaClient({ adapter });
}
