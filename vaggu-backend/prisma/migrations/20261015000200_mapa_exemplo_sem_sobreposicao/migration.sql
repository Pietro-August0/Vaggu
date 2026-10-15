-- Corrige somente posições originais do exemplo: setores dividem o espaço do piso.
-- Posições editadas pela equipe e dados de outros shoppings são preservados.
WITH originais AS (
  SELECT v.id, v.andar_id, substring(v.codigo FROM '^[NSLO]-([0-9]{2})$')::integer - 1 AS indice,
    CASE WHEN left(v.codigo, 1) IN ('S', 'O') THEN 1 ELSE 0 END AS faixa
  FROM vagas v
  JOIN shoppings s ON s.id = v.shopping_id
  WHERE s.id = 'd3a09b29-7e5a-4b7e-8c42-8f371d0a0001'
    AND s.demonstracao = true
    AND v.codigo ~ '^[NSLO]-(0[1-9]|1[0-9]|20)$'
    AND v.posicao_x = 0.06 + ((substring(v.codigo FROM '^[NSLO]-([0-9]{2})$')::integer - 1) % 5) * 0.18
    AND v.posicao_y = 0.08 + ((substring(v.codigo FROM '^[NSLO]-([0-9]{2})$')::integer - 1) / 5) * 0.21
    AND v.largura = 0.12 AND v.altura = 0.1 AND v.rotacao = 0
), atualizadas AS (
  UPDATE vagas v SET posicao_y = 0.04 + o.faixa * 0.48 + (o.indice / 5) * 0.105
  FROM originais o WHERE v.id = o.id
  RETURNING v.andar_id
)
UPDATE andares SET revisao_mapa = revisao_mapa + 1
WHERE id IN (SELECT andar_id FROM atualizadas);
