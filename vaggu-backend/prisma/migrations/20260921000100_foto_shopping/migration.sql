-- Armazena uma foto institucional pequena e privada sem carregar bytes nas listagens.
CREATE TABLE "fotos_shopping" (
  "shopping_id" UUID NOT NULL,
  "dados" BYTEA NOT NULL,
  "mime" TEXT NOT NULL,
  "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fotos_shopping_pkey" PRIMARY KEY ("shopping_id"),
  CONSTRAINT "fotos_shopping_formato_check" CHECK (
    "mime" IN ('image/jpeg', 'image/png', 'image/webp')
    AND octet_length("dados") BETWEEN 1 AND 2097152
  ),
  CONSTRAINT "fotos_shopping_shopping_id_fkey"
    FOREIGN KEY ("shopping_id") REFERENCES "shoppings"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
