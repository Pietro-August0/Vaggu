ALTER TABLE dispositivos ADD COLUMN em_manutencao boolean NOT NULL DEFAULT false;
ALTER TABLE sensores ADD COLUMN em_manutencao boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX sensores_id_shopping_id_dispositivo_id_key ON sensores(id, shopping_id, dispositivo_id);
CREATE TABLE ocorrencias_equipamento (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), shopping_id uuid NOT NULL, dispositivo_id uuid NOT NULL, sensor_id uuid,
 tipo varchar(24) NOT NULL CHECK(tipo IN ('MANUTENCAO', 'COMUNICACAO')),
 motivo varchar(500) NOT NULL, conclusao varchar(500), autor_id uuid, encerrado_por_id uuid,
 aberta_em timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, encerrada_em timestamp(3), chave_ativa text UNIQUE,
 FOREIGN KEY(shopping_id) REFERENCES shoppings(id) ON DELETE RESTRICT,
 FOREIGN KEY(dispositivo_id, shopping_id) REFERENCES dispositivos(id, shopping_id) ON DELETE RESTRICT,
 FOREIGN KEY(sensor_id, shopping_id, dispositivo_id) REFERENCES sensores(id, shopping_id, dispositivo_id) ON DELETE RESTRICT,
 CHECK ((encerrada_em IS NULL AND chave_ativa IS NOT NULL) OR (encerrada_em IS NOT NULL AND chave_ativa IS NULL))
);
CREATE INDEX ocorrencias_equipamento_shopping_id_encerrada_em_idx ON ocorrencias_equipamento(shopping_id, encerrada_em);
