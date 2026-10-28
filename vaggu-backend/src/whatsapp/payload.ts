// Interpreta o formato externo do webhook e mantém os textos do menu demonstrativo.
/** Extrai mensagens e status separadamente, ignorando trechos sem a estrutura esperada. */
export function extractWhatsappEvents(payload) {
  const events = { messages: [], statuses: [] };
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.entry)) return events;

  for (const entry of payload.entry) {
    if (!entry || typeof entry !== 'object' || !Array.isArray(entry.changes)) continue;
    for (const change of entry.changes) {
      const value = change?.value;
      if (!value || typeof value !== 'object') continue;
      if (Array.isArray(value.messages)) {
        for (const message of value.messages) {
          if (message && typeof message === 'object' && typeof message.id === 'string') {
            events.messages.push({
              id: message.id,
              from: typeof message.from === 'string' ? message.from : '',
              type: typeof message.type === 'string' ? message.type : 'unsupported',
              text: typeof message.text?.body === 'string' ? message.text.body : '',
              errorCode: firstStatusErrorCode(message),
            });
          }
        }
      }
      if (Array.isArray(value.statuses)) {
        for (const status of value.statuses) {
          if (status && typeof status === 'object') {
            events.statuses.push({
              id: typeof status.id === 'string' ? status.id : '',
              status: typeof status.status === 'string' ? status.status : 'unknown',
              errorCode: firstStatusErrorCode(status),
            });
          }
        }
      }
    }
  }
  return events;
}

/** Seleciona apenas o primeiro código de falha de entrega, sem guardar o conteúdo completo. */
function firstStatusErrorCode(status) {
  const error = Array.isArray(status.errors) ? status.errors[0] : null;
  const code = error?.code;
  return code === undefined || code === null ? '' : String(code).replace(/[^0-9]/g, '').slice(0, 24);
}

/** Diagnóstico sem corpo, contato, identificador de mensagem ou credencial. */
export function summarizeWhatsappEvents(events) {
  return {
    mensagens: events.messages.length,
    status: events.statuses.length,
    tipos: [...new Set(events.messages.map((message) => message.type.replace(/[^a-z_]/gi, '').slice(0, 24)))],
    comTexto: events.messages.filter((message) => message.text.length > 0).length,
    comRemetente: events.messages.filter((message) => message.from.length > 0).length,
    errosMeta: [...new Set(events.messages.map((message) => message.errorCode).filter(Boolean))],
  };
}

/** Reconhece saudações e MENU sem diferenciar acentos ou maiúsculas; ignora mídia. */
export function shouldSendTestMenu(message) {
  if (message.type !== 'text') return false;
  const normalized = message.text.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toUpperCase();
  return ['OI', 'OLA', 'MENU'].includes(normalized);
}

// Menu de orientação; demonstração e suporte são tratados na conversa comercial.
export const testMenuText = 'Olá! 👋 Bem-vindo à VAGGU.\n\n'
  + 'Como podemos ajudar?\n\n'
  + '1 — Conhecer a VAGGU\n'
  + '2 — Ver funcionalidades\n'
  + '3 — Solicitar uma demonstração\n'
  + '4 — Solicitar suporte\n'
  + '5 — Falar com a equipe';

/** Respostas úteis sem prometer preços, prazos ou disponibilidade humana não configurados. */
export function respostaAtendimento(message: { type: string; text: string }) {
  if (shouldSendTestMenu(message)) return testMenuText;
  if (message.type !== 'text') return null;
  const respostas: Record<string, string> = {
    '1': 'A VAGGU organiza estacionamentos de shoppings com mapa de vagas, acompanhamento de ocupação e acessos separados por unidade. Digite 2 para conhecer as funcionalidades ou 3 para solicitar uma demonstração.',
    '2': 'Você pode acompanhar vagas por andar, setor e categoria; consultar o monitoramento; analisar períodos e exportar relatórios. A disponibilidade depende de leituras confirmadas. Digite MENU para voltar.',
    '3': 'Para solicitar uma demonstração, envie nesta conversa o nome do shopping, a cidade e seu nome. A equipe poderá combinar os detalhes por aqui. Não envie senhas ou dados de documentos. Digite MENU para voltar.',
    '4': 'Descreva o problema, o shopping e o código da vaga ou equipamento, se houver. Informe quando começou. Nunca envie sua senha ou chave de equipamento. Para redefinir acesso, procure o Admin VAGGU. Digite MENU para voltar.',
    '5': 'Escreva sua solicitação nesta conversa para o atendimento da equipe. Este menu automático não confirma horário nem prazo de resposta. Digite MENU para voltar.',
  };
  return respostas[message.text.trim()] ?? null;
}
