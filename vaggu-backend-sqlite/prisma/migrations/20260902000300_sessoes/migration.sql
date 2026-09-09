-- Migration aditiva: não remove nem recria tabelas da etapa anterior.
CREATE TABLE "sessoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token_hash" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_em" DATETIME NOT NULL,
    CONSTRAINT "sessoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "sessoes_token_hash_key" ON "sessoes"("token_hash");
CREATE INDEX "sessoes_usuario_id_idx" ON "sessoes"("usuario_id");
CREATE INDEX "sessoes_expira_em_idx" ON "sessoes"("expira_em");
