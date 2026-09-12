// Configura a CLI do Prisma: schema, migrations e conexão obtida do ambiente, sem credenciais no código.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL deve apontar para um PostgreSQL, como postgresql://usuario:senha@localhost:5432/vaggu.');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: databaseUrl },
});
