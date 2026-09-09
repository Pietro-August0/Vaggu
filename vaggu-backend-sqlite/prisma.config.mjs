import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { prismaDatabaseUrl } from './src/config/database.js';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // CLI e API usam exatamente o mesmo caminho, inclusive no Windows.
  datasource: { url: prismaDatabaseUrl(process.env.DATABASE_URL) },
});
