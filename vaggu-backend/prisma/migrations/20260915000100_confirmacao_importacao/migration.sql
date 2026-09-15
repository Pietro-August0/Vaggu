-- Registra a aplicação atômica de uma prévia para que reenvios não dupliquem andares, setores ou vagas.
ALTER TABLE "importacoes_estrutura"
  ADD COLUMN "resultado_confirmacao" JSONB,
  ADD COLUMN "confirmado_em" TIMESTAMP(3);

ALTER TABLE "importacoes_estrutura"
  ADD CONSTRAINT "importacoes_estrutura_confirmacao_check"
  CHECK (
    ("confirmado_em" IS NULL AND "resultado_confirmacao" IS NULL)
    OR
    ("confirmado_em" IS NOT NULL AND "resultado_confirmacao" IS NOT NULL AND jsonb_typeof("resultado_confirmacao") = 'object')
  );
