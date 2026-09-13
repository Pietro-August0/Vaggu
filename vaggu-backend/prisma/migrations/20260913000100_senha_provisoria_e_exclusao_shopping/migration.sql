-- Preserva shoppings excluídos para manter estrutura e histórico, ocultando-os da operação.
ALTER TABLE "shoppings" ADD COLUMN "excluido_em" TIMESTAMP(3);

-- A cópia reversível existe somente enquanto a troca obrigatória estiver pendente.
ALTER TABLE "usuarios" ADD COLUMN "senha_provisoria_protegida" TEXT;

CREATE INDEX "shoppings_excluido_em_ativo_nome_idx"
ON "shoppings"("excluido_em", "ativo", "nome");
