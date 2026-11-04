-- Marca explicitamente o shopping de apresentação sem alterar os clientes existentes.
ALTER TABLE "shoppings" ADD COLUMN "demonstracao" BOOLEAN NOT NULL DEFAULT false;
