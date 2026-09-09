-- CreateTable
CREATE TABLE "shoppings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "endereco" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopping_id" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "usuarios_perfil_check" CHECK ("perfil" IN ('VAGGU', 'SHOPPING')),
    CONSTRAINT "usuarios_perfil_shopping_check" CHECK (("perfil" = 'VAGGU' AND "shopping_id" IS NULL) OR ("perfil" = 'SHOPPING' AND "shopping_id" IS NOT NULL)),
    CONSTRAINT "usuarios_shopping_id_fkey" FOREIGN KEY ("shopping_id") REFERENCES "shoppings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dispositivos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopping_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "chave_api_hash" TEXT NOT NULL,
    "ultimo_contato_em" DATETIME,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "dispositivos_shopping_id_fkey" FOREIGN KEY ("shopping_id") REFERENCES "shoppings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vagas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopping_id" TEXT NOT NULL,
    "dispositivo_id" TEXT,
    "codigo" TEXT NOT NULL,
    "canal_sensor" TEXT,
    "estado_atual" TEXT NOT NULL DEFAULT 'DESCONHECIDA',
    "ultima_leitura_em" DATETIME,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "vagas_estado_check" CHECK ("estado_atual" IN ('LIVRE', 'OCUPADA', 'DESCONHECIDA')),
    CONSTRAINT "vagas_dispositivo_canal_check" CHECK (("dispositivo_id" IS NULL AND "canal_sensor" IS NULL) OR ("dispositivo_id" IS NOT NULL AND "canal_sensor" IS NOT NULL AND length(trim("canal_sensor")) > 0)),
    CONSTRAINT "vagas_shopping_id_fkey" FOREIGN KEY ("shopping_id") REFERENCES "shoppings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vagas_dispositivo_id_shopping_id_fkey" FOREIGN KEY ("dispositivo_id", "shopping_id") REFERENCES "dispositivos" ("id", "shopping_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historico_vagas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vaga_id" TEXT NOT NULL,
    "evento_id" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "registrado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historico_estado_check" CHECK ("estado" IN ('LIVRE', 'OCUPADA', 'DESCONHECIDA')),
    CONSTRAINT "historico_vagas_vaga_id_fkey" FOREIGN KEY ("vaga_id") REFERENCES "vagas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_shopping_id_idx" ON "usuarios"("shopping_id");

-- CreateIndex
CREATE INDEX "dispositivos_shopping_id_idx" ON "dispositivos"("shopping_id");

-- CreateIndex
CREATE UNIQUE INDEX "dispositivos_id_shopping_id_key" ON "dispositivos"("id", "shopping_id");

-- CreateIndex
CREATE INDEX "vagas_dispositivo_id_shopping_id_idx" ON "vagas"("dispositivo_id", "shopping_id");

-- CreateIndex
CREATE UNIQUE INDEX "vagas_shopping_id_codigo_key" ON "vagas"("shopping_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "vagas_dispositivo_id_canal_sensor_key" ON "vagas"("dispositivo_id", "canal_sensor");

-- CreateIndex
CREATE UNIQUE INDEX "historico_vagas_evento_id_key" ON "historico_vagas"("evento_id");

-- CreateIndex
CREATE INDEX "historico_vagas_vaga_id_registrado_em_idx" ON "historico_vagas"("vaga_id", "registrado_em");
