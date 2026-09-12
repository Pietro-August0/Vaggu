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
  return code === undefined || code === null ? '' : String(code);
}

/** Reconhece saudações e MENU sem diferenciar acentos ou maiúsculas; ignora mídia. */
export function shouldSendTestMenu(message) {
  if (message.type !== 'text') return false;
  const normalized = message.text.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toUpperCase();
  return ['OI', 'OLA', 'MENU'].includes(normalized);
}

// Menu de demonstração: as opções ainda não executam os fluxos comerciais completos.
export const testMenuText = 'Olá! 👋 Bem-vindo à VAGGU.\n\n'
  + 'Como podemos ajudar?\n\n'
  + '1 — Conhecer a VAGGU\n'
  + '2 — Ver funcionalidades\n'
  + '3 — Solicitar uma demonstração\n'
  + '4 — Solicitar suporte\n'
  + '5 — Falar com a equipe';

export const flowSetupText = 'Esse fluxo ainda está em configuração.';
