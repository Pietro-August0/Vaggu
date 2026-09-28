-- Evolui a base legada de dispositivo/vaga para telemetria persistente sem apagar histórico.
CREATE TYPE "TipoEventoTelemetria" AS ENUM ('HEARTBEAT', 'ESTADOS');
CREATE TYPE "ResultadoEventoTelemetria" AS ENUM ('PROCESSADO', 'REJEITADO_ORDEM');

ALTER TABLE "dispositivos"
  ADD COLUMN "codigo" TEXT,
  ADD COLUMN "inicializacao_atual_id" TEXT,
  ADD COLUMN "ultima_sequencia" INTEGER;

CREATE UNIQUE INDEX "dispositivos_codigo_key" ON "dispositivos"("codigo");
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_ordem_check"
  CHECK (("inicializacao_atual_id" IS NULL AND "ultima_sequencia" IS NULL)
    OR ("inicializacao_atual_id" IS NOT NULL AND "ultima_sequencia" IS NOT NULL AND "ultima_sequencia" >= 0));

CREATE UNIQUE INDEX "vagas_id_shopping_id_key" ON "vagas"("id", "shopping_id");

ALTER TABLE "historico_vagas"
  ADD COLUMN "shopping_id" UUID,
  ADD COLUMN "estado_anterior" "EstadoVaga",
  ADD COLUMN "efetivo_em" TIMESTAMP(3),
  ADD COLUMN "recebido_em" TIMESTAMP(3),
  ADD COLUMN "origem" VARCHAR(32),
  ADD COLUMN "motivo" VARCHAR(32);

UPDATE "historico_vagas" AS h
SET "shopping_id" = v."shopping_id",
    "efetivo_em" = h."registrado_em",
    "recebido_em" = h."registrado_em",
    "origem" = 'LEGADO',
    "motivo" = 'LEGADO'
FROM "vagas" AS v
WHERE v."id" = h."vaga_id";

ALTER TABLE "historico_vagas"
  ALTER COLUMN "shopping_id" SET NOT NULL,
  ALTER COLUMN "efetivo_em" SET NOT NULL,
  ALTER COLUMN "recebido_em" SET NOT NULL,
  ALTER COLUMN "origem" SET NOT NULL,
  ALTER COLUMN "motivo" SET NOT NULL;

ALTER TABLE "historico_vagas" ADD CONSTRAINT "historico_vagas_shopping_id_fkey"
  FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "historico_vagas_shopping_id_efetivo_em_idx" ON "historico_vagas"("shopping_id", "efetivo_em");

CREATE TABLE "sensores" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "shopping_id" UUID NOT NULL,
  "dispositivo_id" UUID NOT NULL,
  "vaga_id" UUID NOT NULL,
  "codigo" TEXT NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "estado_confirmado" "EstadoVaga" NOT NULL DEFAULT 'INDISPONIVEL',
  "estado_candidato" "EstadoVaga",
  "candidato_iniciado_em" TIMESTAMP(3),
  "ultima_observacao_em" TIMESTAMP(3),
  "expirado_em" TIMESTAMP(3),
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sensores_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sensores_candidato_check" CHECK (("estado_candidato" IS NULL AND "candidato_iniciado_em" IS NULL)
    OR ("estado_candidato" IN ('LIVRE', 'OCUPADA') AND "candidato_iniciado_em" IS NOT NULL))
);

CREATE UNIQUE INDEX "sensores_vaga_id_key" ON "sensores"("vaga_id");
CREATE UNIQUE INDEX "sensores_dispositivo_id_codigo_key" ON "sensores"("dispositivo_id", "codigo");
CREATE UNIQUE INDEX "sensores_vaga_id_shopping_id_key" ON "sensores"("vaga_id", "shopping_id");
CREATE INDEX "sensores_shopping_id_ultima_observacao_em_idx" ON "sensores"("shopping_id", "ultima_observacao_em");
ALTER TABLE "sensores" ADD CONSTRAINT "sensores_shopping_id_fkey"
  FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sensores" ADD CONSTRAINT "sensores_dispositivo_id_shopping_id_fkey"
  FOREIGN KEY ("dispositivo_id", "shopping_id") REFERENCES "dispositivos"("id", "shopping_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sensores" ADD CONSTRAINT "sensores_vaga_id_shopping_id_fkey"
  FOREIGN KEY ("vaga_id", "shopping_id") REFERENCES "vagas"("id", "shopping_id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "inicializacoes_placa" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "shopping_id" UUID NOT NULL,
  "dispositivo_id" UUID NOT NULL,
  "inicializacao_id" TEXT NOT NULL,
  "iniciada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "encerrada_em" TIMESTAMP(3),
  CONSTRAINT "inicializacoes_placa_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "inicializacoes_placa_dispositivo_id_inicializacao_id_key" ON "inicializacoes_placa"("dispositivo_id", "inicializacao_id");
CREATE INDEX "inicializacoes_placa_shopping_id_iniciada_em_idx" ON "inicializacoes_placa"("shopping_id", "iniciada_em");
ALTER TABLE "inicializacoes_placa" ADD CONSTRAINT "inicializacoes_placa_shopping_id_fkey"
  FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inicializacoes_placa" ADD CONSTRAINT "inicializacoes_placa_dispositivo_id_shopping_id_fkey"
  FOREIGN KEY ("dispositivo_id", "shopping_id") REFERENCES "dispositivos"("id", "shopping_id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "eventos_telemetria_recebidos" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "shopping_id" UUID NOT NULL,
  "dispositivo_id" UUID NOT NULL,
  "inicializacao_id" TEXT NOT NULL,
  "sequencia" INTEGER NOT NULL,
  "tipo" "TipoEventoTelemetria" NOT NULL,
  "payload_hash" CHAR(64) NOT NULL,
  "resultado" "ResultadoEventoTelemetria" NOT NULL DEFAULT 'PROCESSADO',
  "recebido_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "eventos_telemetria_recebidos_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "eventos_telemetria_sequencia_check" CHECK ("sequencia" >= 0),
  CONSTRAINT "eventos_telemetria_payload_hash_check" CHECK ("payload_hash" ~ '^[a-f0-9]{64}$')
);

CREATE UNIQUE INDEX "eventos_telemetria_dispositivo_inicializacao_sequencia_key" ON "eventos_telemetria_recebidos"("dispositivo_id", "inicializacao_id", "sequencia");
CREATE INDEX "eventos_telemetria_shopping_id_recebido_em_idx" ON "eventos_telemetria_recebidos"("shopping_id", "recebido_em");
ALTER TABLE "eventos_telemetria_recebidos" ADD CONSTRAINT "eventos_telemetria_shopping_id_fkey"
  FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eventos_telemetria_recebidos" ADD CONSTRAINT "eventos_telemetria_dispositivo_id_shopping_id_fkey"
  FOREIGN KEY ("dispositivo_id", "shopping_id") REFERENCES "dispositivos"("id", "shopping_id") ON DELETE RESTRICT ON UPDATE CASCADE;
