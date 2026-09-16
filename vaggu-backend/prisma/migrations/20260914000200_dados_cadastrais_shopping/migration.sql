-- Amplia a ficha administrativa sem invalidar shoppings criados antes desta entrega.
ALTER TABLE "shoppings"
  ADD COLUMN "cnpj" TEXT,
  ADD COLUMN "responsavel_nome" TEXT,
  ADD COLUMN "responsavel_cpf" TEXT,
  ADD COLUMN "email_corporativo" TEXT,
  ADD COLUMN "telefone" TEXT,
  ADD COLUMN "cep" TEXT,
  ADD COLUMN "uf" VARCHAR(2),
  ADD COLUMN "cidade" TEXT,
  ADD COLUMN "bairro" TEXT,
  ADD COLUMN "logradouro" TEXT,
  ADD COLUMN "numero" TEXT,
  ADD COLUMN "complemento" TEXT,
  ADD COLUMN "horario_abertura" VARCHAR(5),
  ADD COLUMN "horario_fechamento" VARCHAR(5),
  ADD COLUMN "fuso_horario" TEXT;

ALTER TABLE "shoppings"
  ADD CONSTRAINT "shoppings_uf_formato_check" CHECK ("uf" IS NULL OR "uf" ~ '^[A-Z]{2}$'),
  ADD CONSTRAINT "shoppings_horario_abertura_check" CHECK ("horario_abertura" IS NULL OR "horario_abertura" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  ADD CONSTRAINT "shoppings_horario_fechamento_check" CHECK ("horario_fechamento" IS NULL OR "horario_fechamento" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');
