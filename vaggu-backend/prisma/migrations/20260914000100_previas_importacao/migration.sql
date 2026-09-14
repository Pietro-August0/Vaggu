-- Persiste prévias por shopping sem modificar vagas, equipamentos ou histórico existente.
CREATE TABLE "importacoes_estrutura" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shopping_id" UUID NOT NULL,
    "formato" VARCHAR(4) NOT NULL,
    "previa" JSONB NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "importacoes_estrutura_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "importacoes_estrutura_formato_check" CHECK ("formato" IN ('CSV', 'XLSX')),
    CONSTRAINT "importacoes_estrutura_previa_check" CHECK (jsonb_typeof("previa") = 'object'),
    CONSTRAINT "importacoes_estrutura_shopping_id_fkey" FOREIGN KEY ("shopping_id")
        REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "importacoes_estrutura_shopping_id_criado_em_idx"
    ON "importacoes_estrutura"("shopping_id", "criado_em");
