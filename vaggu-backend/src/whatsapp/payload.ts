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

export const testMenuText = 'Olá! Este é o bot da VAGGU.\n\nToque em “Ver opções” para conhecer ou contratar a VAGGU, ver uma demonstração ou consultar orientações de suporte.';

export const menuAtendimento = {
  type: 'list',
  header: { type: 'text', text: 'Atendimento VAGGU' },
  body: { text: testMenuText },
  footer: { text: 'Você também pode digitar de 1 a 6.' },
  action: {
    button: 'Ver opções',
    sections: [{ title: 'Como podemos ajudar?', rows: [
      { id: '1', title: 'Conhecer a VAGGU', description: 'Entenda nossa solução para estacionamentos.' },
      { id: '2', title: 'Ver funcionalidades', description: 'Mapa de vagas, monitoramento e análises.' },
      { id: '3', title: 'Ver demonstração', description: 'Veja o que explorar no site e no roteiro da VAGGU.' },
      { id: '4', title: 'Ajuda com a plataforma', description: 'Confira os primeiros passos para problemas comuns.' },
      { id: '5', title: 'Contato da equipe', description: 'Encontre os canais oficiais da VAGGU.' },
      { id: '6', title: 'Contratar a VAGGU', description: 'Veja como começar a usar a VAGGU no seu shopping.' },
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
      ...(['1', '3'].includes(option) ? [{ type: 'reply', reply: { id: '2', title: 'Ver recursos' } }] : []),
      ...(['1', '2'].includes(option) ? [{ type: 'reply', reply: { id: '3', title: 'Ver demonstração' } }] : []),
      ...(option === '4' ? [{ type: 'reply', reply: { id: '5', title: 'Contato da equipe' } }] : []),
      { type: 'reply', reply: { id: 'menu', title: 'Voltar ao menu' } },
    ] },
  } : null;
}

/** Respostas do menu demonstrativo, sem coleta de dados ou acionamento de atendimento. */
export function respostaAtendimento(message: { type: string; text: string; selectionId?: string }) {
  if (shouldSendTestMenu(message)) return testMenuText;
  if (!['text', 'interactive'].includes(message.type)) return null;
  const respostas: Record<string, string> = {
    '1': 'A VAGGU ajuda a gerenciar o estacionamento do seu shopping com mapa de vagas, monitoramento e análises. Cada unidade tem seu próprio acesso.\n\nConheça o projeto no nosso site:\nhttps://vaggu-tcc.onrender.com\n\nEscolha uma opção abaixo para continuar.',
    '2': '*Conheça os recursos da VAGGU*\n\n*Gestão de vagas*\n• Consulte a disponibilidade por andar, setor e categoria.\n\n*Monitoramento*\n• Acompanhe a ocupação com base nas leituras confirmadas.\n\n*Análises e relatórios*\n• Compare períodos de movimento e exporte relatórios.',
    '3': '*Roteiro da demonstração*\n\n1. No mapa, veja como localizar vagas por andar, setor e categoria.\n2. No monitoramento, confira como a ocupação é acompanhada.\n3. Nas análises, veja como comparar períodos e exportar relatórios.\n\nComece pela apresentação pública do projeto:\nhttps://vaggu-tcc.onrender.com\n\nO painel do shopping exige acesso autorizado.',
    '4': '*Ajuda com a plataforma*\n\n• Se não conseguir entrar, confira se está usando o acesso do seu shopping.\n• Se o mapa parecer desatualizado, confira o horário da última leitura. Uma vaga sem leitura atual não deve ser considerada livre.\n\nSe o problema continuar, consulte “Contato da equipe”. Nunca compartilhe senhas ou chaves de equipamentos.',
    '5': '*Contato da equipe VAGGU*\n\nPara dúvidas sobre o projeto ou contato institucional, consulte os canais oficiais no rodapé do site:\nhttps://vaggu-tcc.onrender.com\n\nEste bot é demonstrativo e não encaminha mensagens para a equipe.',
    '6': 'Obrigado pelo interesse em contratar a VAGGU! Nesta demonstração, a resposta seria: “Nossa equipe vai entrar em contato para conversar sobre a contratação e os próximos passos.”',
  };
  const option = message.type === 'interactive' ? message.selectionId : message.text.trim();
  return Object.hasOwn(respostas, option) ? respostas[option] : null;
}
