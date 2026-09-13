-- Exclusão lógica de gerentes com restauração breve, sem apagar identidade ou histórico.
ALTER TABLE "usuarios" ADD COLUMN "excluido_em" TIMESTAMP(3);
ALTER TABLE "usuarios" ADD COLUMN "ativo_antes_exclusao" BOOLEAN;

CREATE INDEX "usuarios_shopping_id_excluido_em_idx" ON "usuarios"("shopping_id", "excluido_em");

ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_exclusao_check"
CHECK (("excluido_em" IS NULL AND "ativo_antes_exclusao" IS NULL)
  OR ("excluido_em" IS NOT NULL AND "ativo_antes_exclusao" IS NOT NULL AND "ativo" = false));
