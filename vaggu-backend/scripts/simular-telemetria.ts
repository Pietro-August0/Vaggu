// Envia um cenário sintético pela mesma API usada pelo ESP32, sem gravar fixtures diretamente no banco.
import { randomUUID } from 'node:crypto';

const apiUrl = process.env.SIMULADOR_API_URL ?? 'http://127.0.0.1:3000/api/v1';
const placaCodigo = process.env.SIMULADOR_PLACA_CODIGO;
const chave = process.env.SIMULADOR_PLACA_CHAVE;
const sensores = process.env.SIMULADOR_SENSORES_CODIGOS?.split(',').map((codigo) => codigo.trim()).filter(Boolean) ?? [];
const intervaloMs = Number(process.env.SIMULADOR_INTERVALO_MS ?? '15000');

if (!placaCodigo || !chave || sensores.length === 0) {
  throw new Error('Informe SIMULADOR_PLACA_CODIGO, SIMULADOR_PLACA_CHAVE e SIMULADOR_SENSORES_CODIGOS.');
}
if (!Number.isSafeInteger(intervaloMs) || intervaloMs <= 0) throw new Error('SIMULADOR_INTERVALO_MS deve ser positivo.');

const inicializacaoId = `simulador-${randomUUID()}`;
let sequencia = 0;

async function enviar(caminho: 'heartbeat' | 'estados', dados: Record<string, unknown>) {
  const resposta = await fetch(`${apiUrl}/telemetria/${caminho}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Device ${chave}` },
    body: JSON.stringify({ placaCodigo, inicializacaoId, sequencia: sequencia++, ...dados }),
  });
  const corpo = await resposta.text();
  if (!resposta.ok) throw new Error(`Telemetria recusada (${resposta.status}): ${corpo}`);
  console.log(`${caminho}: ${corpo}`);
}

const aguardar = (duracao: number) => new Promise((resolve) => setTimeout(resolve, duracao));
await enviar('heartbeat', { capturadoEm: new Date().toISOString() });
for (let repeticao = 0; repeticao < 3; repeticao++) {
  await enviar('estados', {
    capturadoEm: new Date().toISOString(),
    leituras: sensores.map((sensorCodigo, indice) => ({
      sensorCodigo,
      estadoDetectado: indice === 0 ? 'OCUPADA' : 'LIVRE',
    })),
  });
  if (repeticao < 2) await aguardar(intervaloMs);
}
console.log('Cenário sintético enviado pela API. Aguarde o timeout configurado para testar expiração.');
