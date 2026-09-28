// Valida o contrato recebido do ESP32 antes de autenticar ou persistir qualquer evento.
import { ApiError } from '../auth/service.js';

export type EstadoDetectadoTelemetria = 'LIVRE' | 'OCUPADA';

export type MensagemBaseTelemetria = {
  placaCodigo: string;
  inicializacaoId: string;
  sequencia: number;
  capturadoEm?: string;
};

export type MensagemHeartbeat = MensagemBaseTelemetria;

export type LeituraSensor = {
  sensorCodigo: string;
  estadoDetectado: EstadoDetectadoTelemetria;
};

export type MensagemEstados = MensagemBaseTelemetria & {
  leituras: LeituraSensor[];
};

const codigoRegex = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const inicializacaoRegex = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;

function objeto(valor: unknown): Record<string, unknown> {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
    throw new ApiError(400, 'TELEMETRIA_INVALIDA', 'O corpo da telemetria deve ser um objeto JSON.');
  }
  return valor as Record<string, unknown>;
}

function textoCodigo(valor: unknown, campo: string): string {
  if (typeof valor !== 'string' || !codigoRegex.test(valor)) {
    throw new ApiError(400, 'TELEMETRIA_INVALIDA', `${campo} deve ter de 1 a 64 caracteres válidos.`);
  }
  return valor;
}

function base(valor: unknown): MensagemBaseTelemetria {
  const dados = objeto(valor);
  const placaCodigo = textoCodigo(dados.placaCodigo, 'placaCodigo');
  if (typeof dados.inicializacaoId !== 'string' || !inicializacaoRegex.test(dados.inicializacaoId)) {
    throw new ApiError(400, 'TELEMETRIA_INVALIDA', 'inicializacaoId deve ter de 8 a 128 caracteres válidos.');
  }
  if (!Number.isSafeInteger(dados.sequencia) || Number(dados.sequencia) < 0 || Number(dados.sequencia) > 2_147_483_647) {
    throw new ApiError(400, 'TELEMETRIA_INVALIDA', 'sequencia deve ser um inteiro entre 0 e 2147483647.');
  }
  let capturadoEm: string | undefined;
  if (dados.capturadoEm !== undefined) {
    if (typeof dados.capturadoEm !== 'string' || Number.isNaN(Date.parse(dados.capturadoEm))) {
      throw new ApiError(400, 'TELEMETRIA_INVALIDA', 'capturadoEm deve ser uma data ISO válida quando informado.');
    }
    capturadoEm = dados.capturadoEm;
  }
  return { placaCodigo, inicializacaoId: dados.inicializacaoId, sequencia: Number(dados.sequencia), capturadoEm };
}

/** Normaliza um heartbeat, mantendo o horário do equipamento apenas como metadado não autoritativo. */
export function validarHeartbeat(valor: unknown): MensagemHeartbeat {
  return base(valor);
}

/** Rejeita o lote inteiro diante de sensor duplicado, desconhecido estruturalmente ou estado inválido. */
export function validarMensagemEstados(valor: unknown): MensagemEstados {
  const dados = objeto(valor);
  const mensagem = base(dados);
  if (!Array.isArray(dados.leituras) || dados.leituras.length < 1 || dados.leituras.length > 256) {
    throw new ApiError(400, 'TELEMETRIA_INVALIDA', 'leituras deve conter entre 1 e 256 sensores.');
  }
  const codigos = new Set<string>();
  const leituras = dados.leituras.map((item, indice): LeituraSensor => {
    const leitura = objeto(item);
    const sensorCodigo = textoCodigo(leitura.sensorCodigo, `leituras[${indice}].sensorCodigo`);
    if (codigos.has(sensorCodigo)) {
      throw new ApiError(400, 'SENSOR_DUPLICADO_NO_LOTE', `O sensor ${sensorCodigo} aparece mais de uma vez no lote.`);
    }
    codigos.add(sensorCodigo);
    if (leitura.estadoDetectado !== 'LIVRE' && leitura.estadoDetectado !== 'OCUPADA') {
      throw new ApiError(400, 'ESTADO_SENSOR_INVALIDO', `O estado do sensor ${sensorCodigo} deve ser LIVRE ou OCUPADA.`);
    }
    return { sensorCodigo, estadoDetectado: leitura.estadoDetectado };
  });
  return { ...mensagem, leituras };
}

/** Extrai a credencial da placa sem aceitar chave em query string ou no corpo. */
export function extrairChaveDispositivo(autorizacao: string | undefined): string {
  const correspondencia = autorizacao?.match(/^Device ([\x21-\x7E]{12,128})$/);
  if (!correspondencia) {
    throw new ApiError(401, 'PLACA_NAO_AUTENTICADA', 'Credencial da placa ausente ou inválida.');
  }
  return correspondencia[1];
}
