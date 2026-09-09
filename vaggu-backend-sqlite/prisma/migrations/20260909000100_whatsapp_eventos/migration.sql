-- Migration aditiva para deduplicacao duravel dos eventos de mensagem do WhatsApp.
CREATE TABLE "whatsapp_eventos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "meta_message_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSANDO',
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "erro_codigo" TEXT,
    "recebido_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processado_em" DATETIME,
    "atualizado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "whatsapp_eventos_status_check" CHECK ("status" IN ('PROCESSANDO', 'PROCESSADO', 'FALHOU'))
);

CREATE UNIQUE INDEX "whatsapp_eventos_meta_message_id_key" ON "whatsapp_eventos"("meta_message_id");
CREATE INDEX "whatsapp_eventos_status_atualizado_em_idx" ON "whatsapp_eventos"("status", "atualizado_em");
