# Imagem de desenvolvimento; npm 11.9.0 acompanha o Node 24.14.0 fixado.
FROM node:24.14.0-bookworm-slim

# Prisma precisa de OpenSSL no Debian slim; nenhum banco é instalado nesta imagem.
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /aplicacao
RUN chown node:node /aplicacao
USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node prisma.config.mjs ./
# Geração não conecta ao banco; a URL ilustrativa existe apenas neste comando de build.
RUN DATABASE_URL=postgresql://geracao:geracao@127.0.0.1:5432/geracao npm run db:generate
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node test ./test
COPY --chown=node:node test-support ./test-support
RUN npm run build

EXPOSE 3000
# Polling dos fontes funciona em pastas compartilhadas pelo Docker Desktop.
# O JS gerado fica no Linux; Node observa dist e recebe sinais pelo init do Compose.
CMD ["sh", "-c", "npm run db:generate && npm run build || exit $?; node node_modules/typescript/bin/tsc -p tsconfig.json --watch --watchFile fixedPollingInterval --watchDirectory fixedPollingInterval --preserveWatchOutput & exec node --watch dist/src/server.js"]
