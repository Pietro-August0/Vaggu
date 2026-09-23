-- Registra confirmação idempotente e mantém uma única importação ativa por shopping.
ALTER TABLE "importacoes_estrutura"
    ADD COLUMN "resultado_confirmacao" JSONB,
    ADD COLUMN "ativa" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "confirmada_em" TIMESTAMP(3);

ALTER TABLE "importacoes_estrutura"
    ADD CONSTRAINT "importacoes_estrutura_resultado_check"
        CHECK ("resultado_confirmacao" IS NULL OR jsonb_typeof("resultado_confirmacao") = 'object'),
    ADD CONSTRAINT "importacoes_estrutura_confirmacao_check"
        CHECK (("confirmada_em" IS NULL) = ("resultado_confirmacao" IS NULL)),
    ADD CONSTRAINT "importacoes_estrutura_ativa_check"
        CHECK (NOT "ativa" OR "confirmada_em" IS NOT NULL);

CREATE INDEX "importacoes_estrutura_shopping_id_ativa_idx"
    ON "importacoes_estrutura"("shopping_id", "ativa");
CREATE UNIQUE INDEX "importacoes_estrutura_ativa_por_shopping_key"
    ON "importacoes_estrutura"("shopping_id") WHERE "ativa" = true;
