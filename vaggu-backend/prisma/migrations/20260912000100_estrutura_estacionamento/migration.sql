-- P04: hierarquia do estacionamento, categoria da vaga e posição proporcional no mapa.
CREATE TYPE "TipoVaga" AS ENUM ('COMUM', 'PCD', 'IDOSO', 'ELETRICA');
CREATE TYPE "SituacaoImplantacao" AS ENUM ('NOVO_ATENDIMENTO', 'EM_ANALISE', 'DOCUMENTACAO_PENDENTE', 'APROVADO', 'EM_CONFIGURACAO', 'AGUARDANDO_INSTALACAO', 'ATIVO', 'REJEITADO', 'INATIVO');

ALTER TABLE "shoppings" ADD COLUMN "situacao_implantacao" "SituacaoImplantacao" NOT NULL DEFAULT 'EM_CONFIGURACAO';

CREATE TABLE "andares" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "shopping_id" UUID NOT NULL,
  "nome" TEXT NOT NULL, "ordem" INTEGER NOT NULL, "imagem_mapa" TEXT,
  "revisao_mapa" INTEGER NOT NULL DEFAULT 0, "ativo" BOOLEAN NOT NULL DEFAULT true,
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "andares_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "andares_ordem_check" CHECK ("ordem" >= 0)
);

CREATE TABLE "setores" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "shopping_id" UUID NOT NULL,
  "andar_id" UUID NOT NULL, "nome" TEXT NOT NULL, "ativo" BOOLEAN NOT NULL DEFAULT true,
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "setores_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "vagas" ADD COLUMN "andar_id" UUID;
ALTER TABLE "vagas" ADD COLUMN "setor_id" UUID;
ALTER TABLE "vagas" ADD COLUMN "tipo" "TipoVaga" NOT NULL DEFAULT 'COMUM';
ALTER TABLE "vagas" ADD COLUMN "posicao_x" DECIMAL(7,6);
ALTER TABLE "vagas" ADD COLUMN "posicao_y" DECIMAL(7,6);
ALTER TABLE "vagas" ADD COLUMN "largura" DECIMAL(7,6);
ALTER TABLE "vagas" ADD COLUMN "altura" DECIMAL(7,6);
ALTER TABLE "vagas" ADD COLUMN "rotacao" DECIMAL(6,2);
ALTER TABLE "vagas" ADD CONSTRAINT "vagas_estrutura_check" CHECK (("andar_id" IS NULL AND "setor_id" IS NULL) OR ("andar_id" IS NOT NULL AND "setor_id" IS NOT NULL));
ALTER TABLE "vagas" ADD CONSTRAINT "vagas_posicao_check" CHECK (("posicao_x" IS NULL AND "posicao_y" IS NULL AND "largura" IS NULL AND "altura" IS NULL AND "rotacao" IS NULL) OR ("posicao_x" BETWEEN 0 AND 1 AND "posicao_y" BETWEEN 0 AND 1 AND "largura" > 0 AND "largura" <= 1 AND "altura" > 0 AND "altura" <= 1 AND "rotacao" >= -360 AND "rotacao" <= 360));

CREATE UNIQUE INDEX "andares_id_shopping_id_key" ON "andares"("id", "shopping_id");
CREATE UNIQUE INDEX "andares_shopping_id_nome_key" ON "andares"("shopping_id", "nome");
CREATE UNIQUE INDEX "andares_shopping_id_ordem_key" ON "andares"("shopping_id", "ordem");
CREATE INDEX "andares_shopping_id_ativo_ordem_idx" ON "andares"("shopping_id", "ativo", "ordem");
CREATE UNIQUE INDEX "setores_id_shopping_id_andar_id_key" ON "setores"("id", "shopping_id", "andar_id");
CREATE UNIQUE INDEX "setores_andar_id_nome_key" ON "setores"("andar_id", "nome");
CREATE INDEX "setores_shopping_id_andar_id_ativo_idx" ON "setores"("shopping_id", "andar_id", "ativo");
CREATE INDEX "vagas_shopping_id_andar_id_setor_id_ativo_idx" ON "vagas"("shopping_id", "andar_id", "setor_id", "ativo");

ALTER TABLE "andares" ADD CONSTRAINT "andares_shopping_id_fkey" FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "setores" ADD CONSTRAINT "setores_shopping_id_fkey" FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "setores" ADD CONSTRAINT "setores_andar_id_shopping_id_fkey" FOREIGN KEY ("andar_id", "shopping_id") REFERENCES "andares"("id", "shopping_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "vagas" ADD CONSTRAINT "vagas_andar_id_shopping_id_fkey" FOREIGN KEY ("andar_id", "shopping_id") REFERENCES "andares"("id", "shopping_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "vagas" ADD CONSTRAINT "vagas_setor_id_shopping_id_andar_id_fkey" FOREIGN KEY ("setor_id", "shopping_id", "andar_id") REFERENCES "setores"("id", "shopping_id", "andar_id") ON DELETE RESTRICT ON UPDATE CASCADE;
