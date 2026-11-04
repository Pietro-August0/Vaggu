-- Expõe intervalos confirmados para o primeiro modelo analítico do Power BI.
CREATE VIEW "power_bi_intervalos_ocupacao" AS
WITH "historico_ordenado" AS (
  SELECT
    "historico_vagas".*,
    LEAD("efetivo_em") OVER (
      PARTITION BY "vaga_id"
      ORDER BY "efetivo_em", "registrado_em", "id"
    ) AS "proximo_efetivo_em"
  FROM "historico_vagas"
)
SELECT
  'historico-confirmado'::text AS "cenario_id",
  "historico_ordenado"."origem"::text AS "origem",
  "historico_ordenado"."shopping_id"::text AS "shopping_codigo",
  COALESCE("andares"."nome", 'Sem andar')::text AS "andar",
  COALESCE("setores"."nome", 'Sem setor')::text AS "setor",
  "vagas"."codigo"::text AS "vaga_codigo",
  "vagas"."tipo"::text AS "tipo_vaga",
  "historico_ordenado"."estado"::text AS "estado",
  "historico_ordenado"."efetivo_em" AS "inicio_em",
  COALESCE("historico_ordenado"."proximo_efetivo_em", CURRENT_TIMESTAMP) AS "fim_em",
  (
    "historico_ordenado"."estado" = 'OCUPADA'::"EstadoVaga"
    AND "historico_ordenado"."estado_anterior" = 'LIVRE'::"EstadoVaga"
  ) AS "entrada_observada"
FROM "historico_ordenado"
INNER JOIN "vagas"
  ON "vagas"."id" = "historico_ordenado"."vaga_id"
  AND "vagas"."shopping_id" = "historico_ordenado"."shopping_id"
LEFT JOIN "andares"
  ON "andares"."id" = "vagas"."andar_id"
  AND "andares"."shopping_id" = "vagas"."shopping_id"
LEFT JOIN "setores"
  ON "setores"."id" = "vagas"."setor_id"
  AND "setores"."shopping_id" = "vagas"."shopping_id"
  AND "setores"."andar_id" = "vagas"."andar_id"
WHERE COALESCE("historico_ordenado"."proximo_efetivo_em", CURRENT_TIMESTAMP)
  > "historico_ordenado"."efetivo_em";

COMMENT ON VIEW "power_bi_intervalos_ocupacao" IS
  'Intervalos semiabertos confirmados para importacao no Power BI, isolaveis por shopping_codigo.';
