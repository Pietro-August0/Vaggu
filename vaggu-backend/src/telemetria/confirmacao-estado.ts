/**
 * Calcula a confirmação temporal de leituras já autenticadas, validadas e ordenadas.
 * Não recebe mensagens do ESP32 nem grava no banco; o serviço futuro persistirá este estado.
 */

export type EstadoDetectado = 'LIVRE' | 'OCUPADA';
export type EstadoConfirmado = EstadoDetectado | 'DESCONHECIDA';

export type CandidatoEstado = {
  estado: EstadoDetectado;
  iniciadoEmMs: number;
  ultimaObservacaoEmMs: number;
};

export type ConfirmacaoEstado = {
  estadoConfirmado: EstadoConfirmado;
  candidato: CandidatoEstado | null;
  ultimaObservacaoEmMs: number | null;
};

export type ResultadoLeitura = {
  proximo: ConfirmacaoEstado;
  situacao: 'IGNORADA' | 'PENDENTE' | 'CONFIRMADA' | 'SEM_MUDANCA';
};

export const JANELA_CONFIRMACAO_MS = 30_000;

/** Inicia o cálculo sem observações em memória, a partir do estado confirmado informado. */
export function criarConfirmacaoEstado(estadoConfirmado: EstadoConfirmado = 'DESCONHECIDA'): ConfirmacaoEstado {
  return { estadoConfirmado, candidato: null, ultimaObservacaoEmMs: null };
}

/**
 * Processa uma leitura nova usando o instante de recebimento do servidor.
 * A lacuna máxima depende do ciclo de envio e tem limite de continuidade independente da janela curta;
 * mensagens duplicadas ou de inicializações antigas ainda exigirão controle persistente externo.
 */
export function observarEstado(
  atual: ConfirmacaoEstado,
  leitura: { estado: EstadoDetectado; recebidoEmMs: number },
  lacunaMaximaMs: number,
  janelaConfirmacaoMs = JANELA_CONFIRMACAO_MS,
): ResultadoLeitura {
  if (!Number.isSafeInteger(janelaConfirmacaoMs) || janelaConfirmacaoMs < 1000) {
    throw new RangeError('A janela de confirmação deve ser um inteiro de pelo menos 1000 ms.');
  }
  // Janelas de bancada podem ser menores que o ciclo físico de envio.
  // Mantém limite de silêncio e exige uma segunda observação; relógio sozinho não confirma.
  if (!Number.isSafeInteger(lacunaMaximaMs) || lacunaMaximaMs <= 0 || lacunaMaximaMs >= Math.max(JANELA_CONFIRMACAO_MS, janelaConfirmacaoMs)) {
    throw new RangeError('A lacuna máxima deve ser positiva e menor que o limite de continuidade.');
  }
  if (!Number.isSafeInteger(leitura.recebidoEmMs) || leitura.recebidoEmMs < 0) {
    throw new RangeError('O instante de recebimento deve ser um horário válido do servidor em milissegundos.');
  }
  if (leitura.estado !== 'LIVRE' && leitura.estado !== 'OCUPADA') {
    throw new TypeError('A leitura deve indicar LIVRE ou OCUPADA.');
  }

  // Este limite local evita regressão por horário; sequência/reinício exigem validação persistente anterior.
  if (atual.ultimaObservacaoEmMs !== null && leitura.recebidoEmMs <= atual.ultimaObservacaoEmMs) {
    return { proximo: atual, situacao: 'IGNORADA' };
  }

  if (leitura.estado === atual.estadoConfirmado) {
    return {
      proximo: { estadoConfirmado: atual.estadoConfirmado, candidato: null, ultimaObservacaoEmMs: leitura.recebidoEmMs },
      situacao: 'SEM_MUDANCA',
    };
  }

  const candidato = atual.candidato;
  if (
    candidato === null ||
    candidato.estado !== leitura.estado ||
    leitura.recebidoEmMs - candidato.ultimaObservacaoEmMs > lacunaMaximaMs
  ) {
    // Alternância ou silêncio interrompe a continuidade; não se confirma estado por relógio sozinho.
    return {
      proximo: {
        estadoConfirmado: atual.estadoConfirmado,
        candidato: { estado: leitura.estado, iniciadoEmMs: leitura.recebidoEmMs, ultimaObservacaoEmMs: leitura.recebidoEmMs },
        ultimaObservacaoEmMs: leitura.recebidoEmMs,
      },
      situacao: 'PENDENTE',
    };
  }

  if (leitura.recebidoEmMs - candidato.iniciadoEmMs >= janelaConfirmacaoMs) {
    // O instante efetivo da mudança é a confirmação; não retroage à primeira observação.
    return {
      proximo: { estadoConfirmado: leitura.estado, candidato: null, ultimaObservacaoEmMs: leitura.recebidoEmMs },
      situacao: 'CONFIRMADA',
    };
  }

  return {
    proximo: {
      estadoConfirmado: atual.estadoConfirmado,
      candidato: { ...candidato, ultimaObservacaoEmMs: leitura.recebidoEmMs },
      ultimaObservacaoEmMs: leitura.recebidoEmMs,
    },
    situacao: 'PENDENTE',
  };
}
