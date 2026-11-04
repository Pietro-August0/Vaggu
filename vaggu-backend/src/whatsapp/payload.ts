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
              selectionId: message.interactive?.type === 'list_reply' && typeof message.interactive.list_reply?.id === 'string'
                ? message.interactive.list_reply.id
                : message.interactive?.type === 'button_reply' && typeof message.interactive.button_reply?.id === 'string'
                  ? message.interactive.button_reply.id : '',
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

/** Reconhece saudações, MENU e retorno clicável; ignora mídia. */
export function shouldSendTestMenu(message) {
  if (message.type === 'interactive') return message.selectionId === 'menu';
  if (message.type !== 'text') return false;
  const normalized = message.text.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toUpperCase();
  return ['OI', 'OLA', 'MENU'].includes(normalized);
}

// Menu de orientação; demonstração e suporte são tratados na conversa comercial.
export const testMenuText = 'Olá, seja bem-vindo à VAGGU.\n\nConheça nossa solução para a gestão de estacionamentos ou encontre o atendimento que precisa. Toque em “Ver opções” para começar.';

export const menuAtendimento = {
  type: 'list',
  header: { type: 'text', text: 'Atendimento VAGGU' },
  body: { text: testMenuText },
  footer: { text: 'Você também pode digitar de 1 a 5.' },
  action: {
    button: 'Ver opções',
    sections: [{ title: 'Como podemos ajudar?', rows: [
      { id: '1', title: 'Conhecer a VAGGU', description: 'Entenda nossa solução para estacionamentos.' },
      { id: '2', title: 'Ver funcionalidades', description: 'Mapa de vagas, monitoramento e análises.' },
      { id: '3', title: 'Pedir demonstração', description: 'Converse sobre uma apresentação para seu shopping.' },
      { id: '4', title: 'Solicitar suporte', description: 'Conte à equipe o que precisa de atenção.' },
      { id: '5', title: 'Falar com a equipe', description: 'Consulte nosso contato de atendimento.' },
    ] }],
  },
};

/** Menu nativo e retorno clicável; não envia uma segunda mensagem para a mesma entrada. */
export function mensagemInterativaAtendimento(message) {
  if (shouldSendTestMenu(message)) return menuAtendimento;
  const text = respostaAtendimento(message);
  const option = message.type === 'interactive' ? message.selectionId : message.text.trim();
  return text ? {
    type: 'button', body: { text },
    ...(option === '1' ? { header: { type: 'image', image: { link: 'https://vaggu-tcc.onrender.com/assets/apresentacao-whatsapp-vaggu.jpg' } } } : {}),
    action: { buttons: [
      ...(option === '1' ? [
        { type: 'reply', reply: { id: '2', title: 'Ver recursos' } },
        { type: 'reply', reply: { id: '3', title: 'Pedir demonstração' } },
      ] : []),
      { type: 'reply', reply: { id: 'menu', title: 'Voltar ao menu' } },
    ] },
  } : null;
}

/** Respostas úteis sem prometer preços, prazos ou disponibilidade humana não configurados. */
export function respostaAtendimento(message: { type: string; text: string; selectionId?: string }) {
  if (shouldSendTestMenu(message)) return testMenuText;
  if (!['text', 'interactive'].includes(message.type)) return null;
  const respostas: Record<string, string> = {
    '1': 'A VAGGU reúne mapa de vagas, monitoramento e análises para ajudar na gestão do estacionamento do seu shopping. Cada unidade tem seu próprio acesso.\n\nConheça o projeto no nosso site:\nhttps://vaggu-tcc.onrender.com\n\nVeja os recursos ou saiba como pedir uma demonstração nas opções abaixo.',
    '2': 'Você pode acompanhar vagas por andar, setor e categoria; consultar o monitoramento; analisar períodos e exportar relatórios. A disponibilidade depende de leituras confirmadas. Digite MENU para voltar.',
    '3': 'Quer conhecer a VAGGU na prática? Envie seu nome, shopping e cidade para vagguempresarial@outlook.com com o assunto “Demonstração VAGGU”. A equipe combinará os detalhes por e-mail. O menu não agenda uma apresentação automaticamente.',
    '4': 'Para solicitar suporte, escreva para vagguempresarial@outlook.com. Informe o shopping, o problema e quando começou. Se houver, inclua o código da vaga ou equipamento. Nunca envie senhas ou chaves de equipamentos. Para redefinir acesso, procure o Admin VAGGU.',
    '5': 'Fale com nossa equipe pelo e-mail vagguempresarial@outlook.com. Conte brevemente o que precisa e informe como prefere ser contatado.\n\nEste menu é automático; o envio de uma opção não abre um chamado nem confirma prazo de resposta.',
  };
  const option = message.type === 'interactive' ? message.selectionId : message.text.trim();
  return Object.hasOwn(respostas, option) ? respostas[option] : null;
}
