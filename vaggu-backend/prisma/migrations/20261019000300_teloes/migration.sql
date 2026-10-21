CREATE TABLE teloes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), shopping_id uuid NOT NULL, andar_id uuid, setor_id uuid,
 nome varchar(120) NOT NULL, chave_hash text NOT NULL, ativo boolean NOT NULL DEFAULT true, criado_em timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(shopping_id) REFERENCES shoppings(id) ON DELETE RESTRICT,
 FOREIGN KEY(andar_id, shopping_id) REFERENCES andares(id, shopping_id) ON DELETE RESTRICT,
 FOREIGN KEY(setor_id, shopping_id, andar_id) REFERENCES setores(id, shopping_id, andar_id) ON DELETE RESTRICT,
 CHECK (setor_id IS NULL OR andar_id IS NOT NULL)
);
CREATE INDEX teloes_shopping_id_idx ON teloes(shopping_id);
