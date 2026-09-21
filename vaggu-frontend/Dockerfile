# Vite de desenvolvimento com Node 24.14.0 e npm 11.9.0, como no backend.
FROM node:24.14.0-bookworm-slim
WORKDIR /aplicacao
RUN chown node:node /aplicacao
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY --chown=node:node index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js ./
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
EXPOSE 5173
CMD ["node", "node_modules/vite/bin/vite.js", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
