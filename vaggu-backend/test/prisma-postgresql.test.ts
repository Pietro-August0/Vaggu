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
