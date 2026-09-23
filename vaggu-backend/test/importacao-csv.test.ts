// Testes unitários da prévia CSV do P05; nenhuma execução acessa ou modifica o banco.
import test from 'node:test';
import assert from 'node:assert/strict';
import { criarPreviaCsv } from '../src/importacao/parser-csv.js';
import { identificarAcoes } from '../src/importacao/service.js';
import { criarPreviaXlsx } from '../src/importacao/parser-xlsx.js';

test('cria prévia válida com vírgula, BOM e tipos normalizados', () => {
  const previa = criarPreviaCsv('\uFEFFcódigo,andar,setor,tipo\r\nA-001,Térreo,Setor A,comum\r\nA-002,Térreo,Setor A,elétrica');
  assert.equal(previa.podeConfirmar, true);
  assert.deepEqual(previa.resumo, { totalLinhas: 2, registrosValidos: 2, totalErros: 0, novos: 2, atualizacoes: 0, preservadasAusentes: 0 });
  assert.deepEqual(previa.registros.map(registro => registro.tipo), ['COMUM', 'ELETRICA']);
});

test('marca vaga existente como atualização e preserva seu ID na prévia', () => {
  const previa = criarPreviaCsv('codigo,andar,setor,tipo\nA-001,Térreo,A,COMUM\nA-002,Térreo,A,PCD');
  const identificada = identificarAcoes(previa, [{ id: 'vaga-preservada', codigo: 'a-001' }]);
  assert.deepEqual(identificada.registros.map(registro => ({ acao: registro.acao, vagaId: registro.vagaId })), [
    { acao: 'ATUALIZAR', vagaId: 'vaga-preservada' },
    { acao: 'CRIAR', vagaId: null },
  ]);
  assert.equal(identificada.resumo.novos, 1);
  assert.equal(identificada.resumo.atualizacoes, 1);
});

test('informa linha e campo para duplicata e categoria inválida', () => {
  const previa = criarPreviaCsv('codigo;andar;setor;tipo\nA-001;Térreo;A;PCD\na-001;Térreo;A;MOTO');
  assert.equal(previa.podeConfirmar, false);
  assert.equal(previa.registros.length, 1);
  assert.deepEqual(previa.erros.map(item => ({ linha: item.linha, campo: item.campo, codigo: item.codigo })), [
    { linha: 3, campo: 'codigo', codigo: 'CODIGO_DUPLICADO' },
    { linha: 3, campo: 'tipo', codigo: 'TIPO_VAGA_INVALIDO' },
  ]);
});

test('rejeita cabeçalho incompleto e não produz registros', () => {
  const previa = criarPreviaCsv('codigo,andar,tipo\nA-001,Térreo,COMUM');
  assert.equal(previa.podeConfirmar, false);
  assert.equal(previa.registros.length, 0);
  assert.equal(previa.erros[0]?.campo, 'setor');
  assert.equal(previa.erros[0]?.linha, 1);
});

test('rejeita CSV com aspas não fechadas', () => {
  const previa = criarPreviaCsv('codigo,andar,setor,tipo\n"A-001,Térreo,A,COMUM');
  assert.equal(previa.podeConfirmar, false);
  assert.equal(previa.erros[0]?.codigo, 'CSV_ASPAS_NAO_FECHADAS');
  assert.equal(previa.erros[0]?.linha, 2);
});

test('XLSX usa a mesma validação tabular e considera somente os valores lidos', async () => {
  const previa = await criarPreviaXlsx(Buffer.from('xlsx-simulado'), async () => [
    ['código', 'andar', 'setor', 'tipo'],
    ['A-001', 'Térreo', 'A', 'PCD'],
    ['A-002', 'Térreo', 'A', 'MOTO'],
  ]);
  assert.equal(previa.registros[0]?.codigo, 'A-001');
  assert.equal(previa.erros[0]?.codigo, 'TIPO_VAGA_INVALIDO');
  assert.equal(previa.erros[0]?.linha, 3);
  assert.equal(previa.podeConfirmar, false);
});

test('leitor XLSX real rejeita arquivo ilegível com erro seguro', async () => {
  const previa = await criarPreviaXlsx(Buffer.from('detalhe interno que não é um XLSX'));
  assert.equal(previa.erros[0]?.codigo, 'XLSX_INVALIDO');
  assert.ok(!previa.erros[0]?.mensagem.includes('detalhe interno'));
});
