-- Schema inicial em PostgreSQL para a VAGGU.
-- As FKs e indices cobrem os filtros por shopping, usuario, equipamento e historico.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "Perfil" AS ENUM ('VAGGU', 'SHOPPING');
CREATE TYPE "EstadoVaga" AS ENUM ('LIVRE', 'OCUPADA', 'DESCONHECIDA');
CREATE TYPE "WhatsappEventStatus" AS ENUM ('PROCESSANDO', 'PROCESSADO', 'FALHOU');

CREATE TABLE "shoppings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "endereco" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shoppings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shopping_id" UUID,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "senha_hash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "trocar_senha_obrigatoria" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "usuarios_perfil_shopping_check" CHECK (("perfil" = 'VAGGU' AND "shopping_id" IS NULL) OR ("perfil" = 'SHOPPING' AND "shopping_id" IS NOT NULL))
);

CREATE TABLE "sessoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_hash" TEXT NOT NULL,
    "usuario_id" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_em" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dispositivos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shopping_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "chave_api_hash" TEXT NOT NULL,
    "ultimo_contato_em" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "dispositivos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "vagas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shopping_id" UUID NOT NULL,
    "dispositivo_id" UUID,
    "codigo" TEXT NOT NULL,
    "canal_sensor" TEXT,
    "estado_atual" "EstadoVaga" NOT NULL DEFAULT 'DESCONHECIDA',
    "ultima_leitura_em" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "vagas_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "vagas_dispositivo_canal_check" CHECK (("dispositivo_id" IS NULL AND "canal_sensor" IS NULL) OR ("dispositivo_id" IS NOT NULL AND "canal_sensor" IS NOT NULL AND length(trim("canal_sensor")) > 0))
);

CREATE TABLE "historico_vagas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vaga_id" UUID NOT NULL,
    "evento_id" TEXT NOT NULL,
    "estado" "EstadoVaga" NOT NULL,
    "registrado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historico_vagas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "whatsapp_eventos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "meta_message_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" "WhatsappEventStatus" NOT NULL DEFAULT 'PROCESSANDO',
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "erro_codigo" TEXT,
    "recebido_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processado_em" TIMESTAMP(3),
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "whatsapp_eventos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE INDEX "usuarios_shopping_id_idx" ON "usuarios"("shopping_id");

CREATE UNIQUE INDEX "sessoes_token_hash_key" ON "sessoes"("token_hash");
CREATE INDEX "sessoes_usuario_id_idx" ON "sessoes"("usuario_id");
CREATE INDEX "sessoes_expira_em_idx" ON "sessoes"("expira_em");

CREATE INDEX "dispositivos_shopping_id_idx" ON "dispositivos"("shopping_id");
CREATE UNIQUE INDEX "dispositivos_id_shopping_id_key" ON "dispositivos"("id", "shopping_id");

CREATE INDEX "vagas_dispositivo_id_shopping_id_idx" ON "vagas"("dispositivo_id", "shopping_id");
CREATE UNIQUE INDEX "vagas_shopping_id_codigo_key" ON "vagas"("shopping_id", "codigo");
CREATE UNIQUE INDEX "vagas_dispositivo_id_canal_sensor_key" ON "vagas"("dispositivo_id", "canal_sensor");

CREATE UNIQUE INDEX "historico_vagas_evento_id_key" ON "historico_vagas"("evento_id");
CREATE INDEX "historico_vagas_vaga_id_registrado_em_idx" ON "historico_vagas"("vaga_id", "registrado_em");

CREATE UNIQUE INDEX "whatsapp_eventos_meta_message_id_key" ON "whatsapp_eventos"("meta_message_id");
CREATE INDEX "whatsapp_eventos_status_atualizado_em_idx" ON "whatsapp_eventos"("status", "atualizado_em");

ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_shopping_id_fkey"
  FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_usuario_id_fkey"
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_shopping_id_fkey"
  FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "vagas" ADD CONSTRAINT "vagas_shopping_id_fkey"
  FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "vagas" ADD CONSTRAINT "vagas_dispositivo_id_shopping_id_fkey"
  FOREIGN KEY ("dispositivo_id", "shopping_id") REFERENCES "dispositivos"("id", "shopping_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "historico_vagas" ADD CONSTRAINT "historico_vagas_vaga_id_fkey"
  FOREIGN KEY ("vaga_id") REFERENCES "vagas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
