import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot } from '../src/config/database.js';

test('schema Prisma usa PostgreSQL e UUIDs nos vínculos principais', () => {
  const schema = readFileSync(join(projectRoot, 'prisma/schema.prisma'), 'utf8');
  assert.match(schema, /provider = "postgresql"/);
  assert.match(schema, /shoppingId\s+String\?\s+@map\("shopping_id"\)\s+@db\.Uuid/);
  assert.match(schema, /usuarioId\s+String\s+@map\("usuario_id"\)\s+@db\.Uuid/);
});

test('migration inicial PostgreSQL preserva constraints e índices de isolamento', () => {
  const sql = readFileSync(join(projectRoot, 'prisma/migrations/20260909000300_inicial_postgresql/migration.sql'), 'utf8');
  assert.match(sql, /CREATE TYPE "Perfil" AS ENUM/);
  assert.match(sql, /usuarios_perfil_shopping_check/);
  assert.match(sql, /CREATE INDEX "usuarios_shopping_id_idx"/);
  assert.match(sql, /CREATE UNIQUE INDEX "vagas_shopping_id_codigo_key"/);
  assert.match(sql, /FOREIGN KEY \("dispositivo_id", "shopping_id"\)/);
});

test('migration P04 preserva hierarquia, posição proporcional e revisão do mapa', () => {
  const sql = readFileSync(join(projectRoot, 'prisma/migrations/20260912000100_estrutura_estacionamento/migration.sql'), 'utf8');
  assert.match(sql, /CREATE TYPE "TipoVaga" AS ENUM \('COMUM', 'PCD', 'IDOSO', 'ELETRICA'\)/);
  assert.match(sql, /setores_andar_id_shopping_id_fkey/);
  assert.match(sql, /vagas_setor_id_shopping_id_andar_id_fkey/);
  assert.match(sql, /vagas_posicao_check/);
  assert.match(sql, /revisao_mapa/);
});

test('migration de exclusão reversível preserva gerente e estado anterior', () => {
  const sql = readFileSync(join(projectRoot, 'prisma/migrations/20260912000200_exclusao_reversivel_gerentes/migration.sql'), 'utf8');
  assert.match(sql, /"excluido_em" TIMESTAMP\(3\)/);
  assert.match(sql, /"ativo_antes_exclusao" BOOLEAN/);
  assert.match(sql, /usuarios_exclusao_check/);
  assert.doesNotMatch(sql, /DELETE\s+FROM\s+"usuarios"/i);
});

test('migration de confirmação registra idempotência da importação', () => {
  const sql = readFileSync(join(projectRoot, 'prisma/migrations/20260915000100_confirmacao_importacao/migration.sql'), 'utf8');
  assert.match(sql, /"resultado_confirmacao" JSONB/);
  assert.match(sql, /"confirmado_em" TIMESTAMP\(3\)/);
  assert.match(sql, /importacoes_estrutura_confirmacao_check/);
  assert.match(sql, /jsonb_typeof\("resultado_confirmacao"\) = 'object'/);
});
test('migration cadastral amplia a ficha sem invalidar shoppings existentes', () => {
  const sql = readFileSync(join(projectRoot, 'prisma/migrations/20260914000200_dados_cadastrais_shopping/migration.sql'), 'utf8');
  assert.match(sql, /ADD COLUMN "cnpj" TEXT/);
  assert.match(sql, /ADD COLUMN "fuso_horario" TEXT/);
  assert.match(sql, /shoppings_uf_formato_check/);
  assert.doesNotMatch(sql, /DROP\s+(TABLE|COLUMN)/i);
});

test('migration final da foto mantém somente URL e hash de senha no PostgreSQL', () => {
  const sql = readFileSync(join(projectRoot, 'prisma/migrations/20260921000200_referencia_foto_shopping/migration.sql'), 'utf8');
  assert.match(sql, /ADD COLUMN "imagem_url" TEXT/);
  assert.match(sql, /DROP TABLE "fotos_shopping"/);
  assert.match(sql, /DROP COLUMN "senha_provisoria_protegida"/);
  assert.doesNotMatch(sql, /BYTEA/);
});
