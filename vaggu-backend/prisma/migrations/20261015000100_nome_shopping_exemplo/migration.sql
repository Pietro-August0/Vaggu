-- Renomeia somente o cenário fictício conhecido, preservando acessos e histórico.
UPDATE "shoppings"
SET "nome" = 'Shopping Exemplo'
WHERE "id" = 'd3a09b29-7e5a-4b7e-8c42-8f371d0a0001'
  AND "demonstracao" = true
  AND "nome" = 'Shopping Aurora — DEMONSTRAÇÃO';
