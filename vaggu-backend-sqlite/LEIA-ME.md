# VAGGU Backend

Este pacote contem o backend em TypeScript, Express, Prisma 7 e PostgreSQL.

## Como rodar

1. Instale as dependencias:

```sh
npm ci
```

2. Crie um `.env` baseado em `.env.example` e configure `DATABASE_URL` com PostgreSQL.

3. Gere o Prisma Client e aplique migrations:

```sh
npm run db:setup
```

4. Verifique o projeto:

```sh
npm run typecheck
npm test
```

5. Rode em desenvolvimento:

```sh
npm run dev
```

## Observacoes

- `dist/`, `node_modules/`, `.env` e artefatos gerados nao devem ser versionados.
- O banco agora e PostgreSQL. Nao use `file:./prisma/dev.db`.
- A migration atual cria o schema inicial PostgreSQL para shoppings, usuarios, sessoes, dispositivos, vagas, historico e eventos do WhatsApp.
