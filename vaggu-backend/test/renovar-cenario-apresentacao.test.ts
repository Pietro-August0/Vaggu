import assert from 'node:assert/strict';
import test from 'node:test';
import type { PrismaClient } from '@prisma/client';
import { planejarRenovacao, renovarCenarioApresentacao, SHOPPING_EXEMPLO_ID } from '../scripts/renovar-cenario-apresentacao.js';

const agora = new Date('2026-12-02T15:42:00Z');
function bancoFalso(demonstracao = true) {
  const historico: any[] = [{ estado: 'LIVRE', efetivoEm: new Date('2026-10-01T00:00:00Z') }];
  const gravados: any[] = [];
  const atualizacoes: any[] = [];
  let travas = 0;
  const tx = {
    $queryRaw: async () => { travas++; return []; },
    shopping: { findUnique: async (consulta: any) => { assert.equal(consulta.where.id, SHOPPING_EXEMPLO_ID); return { demonstracao, excluidoEm: null }; } },
    vaga: {
      findMany: async (consulta: any) => {
        assert.equal(consulta.where.shoppingId, SHOPPING_EXEMPLO_ID);
        return [{ id: 'vaga-exemplo', estadoAtual: 'LIVRE', historico: [historico.at(-1)] }];
      },
      updateMany: async (consulta: any) => { assert.equal(consulta.where.shoppingId, SHOPPING_EXEMPLO_ID); atualizacoes.push(consulta); },
    },
    historicoVaga: { createMany: async ({ data }: any) => { gravados.push(...data); historico.push(...data); } },
  };
  return { prisma: { $transaction: async (fn: any) => fn(tx) } as unknown as PrismaClient, gravados, atualizacoes, travas: () => travas };
}

test('renovação gera somente janela recente e nunca sobrepõe histórico existente ou futuro', () => {
  const antiga = [{ id: 'a', estadoAtual: 'LIVRE' as const, historico: [{ estado: 'LIVRE' as const, efetivoEm: new Date('2026-10-01') }] }];
  const eventos = planejarRenovacao(antiga, agora);
  assert.ok(eventos.length > 0 && eventos.length <= 337);
  assert.ok(eventos[0].efetivoEm >= new Date('2026-11-18T15:00:00.000Z'));
  assert.ok(eventos.every(e => e.efetivoEm <= agora && e.shoppingId === SHOPPING_EXEMPLO_ID && e.origem === 'DEMONSTRACAO'));
  assert.equal(new Set(eventos.map(e => e.eventoId)).size, eventos.length);
  antiga[0].historico[0].efetivoEm = new Date('2026-12-02T14:30:00Z');
  assert.equal(planejarRenovacao(antiga, agora).length, 1);
  antiga[0].historico[0].efetivoEm = new Date('2027-01-01');
  assert.equal(planejarRenovacao(antiga, agora).length, 0);
  assert.throws(() => planejarRenovacao(antiga, new Date('invalid')));
});

test('prévia é padrão e não grava histórico nem estado', async () => {
  const banco = bancoFalso();
  const resultado = await renovarCenarioApresentacao(banco.prisma, { agora });
  assert.equal(resultado.modo, 'PREVIA');
  assert.ok(resultado.eventos > 0);
  assert.equal(banco.gravados.length, 0);
  assert.equal(banco.atualizacoes.length, 0);
  assert.equal(banco.travas(), 2);
});

test('aplicação é idempotente e preserva histórico anterior sem acessar contas ou estrutura', async () => {
  const banco = bancoFalso();
  await renovarCenarioApresentacao(banco.prisma, { agora, aplicar: true });
  assert.ok(banco.gravados.length > 0);
  assert.equal(banco.atualizacoes.length, 1);
  const resultado = await renovarCenarioApresentacao(banco.prisma, { agora, aplicar: true });
  assert.equal(resultado.eventos, 0);
  assert.ok(banco.gravados.length > 0);
  assert.equal(banco.atualizacoes.length, 1);
});

test('recusa identificador conhecido sem marcador de demonstração', async () => {
  const banco = bancoFalso(false);
  await assert.rejects(renovarCenarioApresentacao(banco.prisma, { agora, aplicar: true }), /demonstração/);
  assert.equal(banco.gravados.length, 0);
  assert.equal(banco.atualizacoes.length, 0);
});
