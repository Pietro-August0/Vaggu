-- Congela a classificação usada por cada evento. O legado é referência do cadastro
-- na migração, explicitamente não confirmada como classificação original.
ALTER TABLE historico_vagas
  ADD COLUMN andar_id_snapshot uuid,
  ADD COLUMN setor_id_snapshot uuid,
  ADD COLUMN andar_nome_snapshot text,
  ADD COLUMN setor_nome_snapshot text,
  ADD COLUMN vaga_codigo_snapshot text,
  ADD COLUMN tipo_vaga_snapshot text,
  ADD COLUMN classificacao_confirmada boolean NOT NULL DEFAULT false;
UPDATE historico_vagas h SET
  andar_id_snapshot = v.andar_id, setor_id_snapshot = v.setor_id,
  andar_nome_snapshot = COALESCE(a.nome, 'Sem andar'), setor_nome_snapshot = COALESCE(s.nome, 'Sem setor'),
  vaga_codigo_snapshot = v.codigo, tipo_vaga_snapshot = v.tipo::text
FROM vagas v LEFT JOIN andares a ON a.id = v.andar_id LEFT JOIN setores s ON s.id = v.setor_id
WHERE v.id = h.vaga_id AND v.shopping_id = h.shopping_id;

CREATE FUNCTION registrar_classificacao_historica() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  SELECT v.andar_id, v.setor_id, COALESCE(a.nome, 'Sem andar'), COALESCE(s.nome, 'Sem setor'), v.codigo, v.tipo::text
    INTO NEW.andar_id_snapshot, NEW.setor_id_snapshot, NEW.andar_nome_snapshot, NEW.setor_nome_snapshot, NEW.vaga_codigo_snapshot, NEW.tipo_vaga_snapshot
    FROM vagas v LEFT JOIN andares a ON a.id = v.andar_id LEFT JOIN setores s ON s.id = v.setor_id
    WHERE v.id = NEW.vaga_id AND v.shopping_id = NEW.shopping_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Vaga incompatível com o histórico'; END IF;
  NEW.classificacao_confirmada := true;
  RETURN NEW;
END $$;
CREATE TRIGGER historico_classificacao BEFORE INSERT ON historico_vagas FOR EACH ROW EXECUTE FUNCTION registrar_classificacao_historica();

CREATE OR REPLACE VIEW power_bi_intervalos_ocupacao AS
WITH ordenado AS (
  SELECT h.*,
    LEAD(efetivo_em) OVER w AS proximo_em,
    LEAD(estado) OVER w AS proximo_estado
  FROM historico_vagas h
  WINDOW w AS (PARTITION BY vaga_id ORDER BY efetivo_em, registrado_em, id)
)
SELECT 'historico-confirmado'::text AS cenario_id, origem::text,
  shopping_id::text AS shopping_codigo,
  COALESCE(andar_nome_snapshot, 'Sem andar')::text AS andar,
  COALESCE(setor_nome_snapshot, 'Sem setor')::text AS setor,
  vaga_codigo_snapshot::text AS vaga_codigo, tipo_vaga_snapshot::text AS tipo_vaga,
  estado::text, efetivo_em AS inicio_em, COALESCE(proximo_em, CURRENT_TIMESTAMP) AS fim_em,
  COALESCE(estado = 'OCUPADA' AND estado_anterior = 'LIVRE', false) AS entrada_observada,
  setor_id_snapshot::text AS setor_id, andar_id_snapshot::text AS andar_id,
  classificacao_confirmada,
  COALESCE(estado = 'OCUPADA' AND proximo_estado = 'LIVRE', false) AS saida_observada
FROM ordenado
WHERE COALESCE(proximo_em, CURRENT_TIMESTAMP) > efetivo_em;
COMMENT ON VIEW power_bi_intervalos_ocupacao IS 'Intervalos por shopping; classificação congelada no evento. Legado com classificacao_confirmada=false não comprova a classificação original.';
