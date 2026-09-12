// Coordena mensagens recebidas, deduplicação persistente e respostas do menu demonstrativo.
import { flowSetupText, shouldSendTestMenu, testMenuText } from './payload.js';

/** Limita tamanho e caracteres do código registrado; não armazena o corpo completo de respostas externas. */
function safeErrorCode(error) {
  const message = error?.message || 'ERRO_DESCONHECIDO';
  return message.slice(0, 80).replace(/[^A-Z0-9_:.-]/gi, '_');
}

/** Recebe persistência e cliente de envio, mantendo as regras independentes do Express. */
export function createWhatsappService(prisma, client, config) {
  return {
    /** Assume o evento uma vez, responde quando habilitado e registra sucesso ou falha para reentrega. */
    async handleMessage(message) {
      const claim = await claimMessage(prisma, message);
      if (!claim.shouldProcess) return { duplicate: true };

      try {
        if (config.autoReplyEnabled && message.from) {
          if (shouldSendTestMenu(message)) {
            await client.sendText(message.from, testMenuText);
          } else if (message.type === 'text' && /^[1-5]$/.test(message.text.trim())) {
            await client.sendText(message.from, flowSetupText);
          }
        }

        await prisma.whatsappEvento.update({
          where: { id: claim.eventId },
          data: { status: 'PROCESSADO', erroCodigo: null, processadoEm: new Date() },
        });
        return { duplicate: false };
      } catch (error) {
        const code = safeErrorCode(error);
        console.error('Falha ao processar mensagem WhatsApp', {
          metaMessageId: message.id,
          tipo: message.type,
          erroCodigo: code,
        });
        await prisma.whatsappEvento.update({
          where: { id: claim.eventId },
          data: { status: 'FALHOU', erroCodigo: code },
        });
        throw error;
      }
    },

    /** Registra falhas de entrega sem tratá-las como mensagem de usuário nem responder automaticamente. */
    handleStatus(status) {
      if (['failed', 'undelivered'].includes(status.status)) {
        console.warn('Falha de entrega reportada pelo WhatsApp', {
          metaMessageId: status.id,
          status: status.status,
          erroCodigo: status.errorCode || 'SEM_CODIGO',
        });
      }
    },
  };
}

/** Usa o ID único da Meta para deduplicar; apenas eventos FALHOU podem ser retomados.
 * Eventos presos em PROCESSANDO após queda ainda não possuem expiração automática.
 */
async function claimMessage(prisma, message) {
  try {
    const event = await prisma.whatsappEvento.create({
      data: {
        metaMessageId: message.id,
        tipo: message.type,
        status: 'PROCESSANDO',
        tentativas: 1,
      },
    });
    return { shouldProcess: true, eventId: event.id };
  } catch (error) {
    if (error.code !== 'P2002') throw error;
  }

  const existing = await prisma.whatsappEvento.findUnique({ where: { metaMessageId: message.id } });
  if (existing?.status !== 'FALHOU') return { shouldProcess: false, eventId: existing?.id };

  // A condição FALHOU na própria escrita permite que só uma tentativa concorrente assuma a retomada.
  const update = await prisma.whatsappEvento.updateMany({
    where: { id: existing.id, status: 'FALHOU' },
    data: {
      status: 'PROCESSANDO',
      erroCodigo: null,
      tentativas: { increment: 1 },
    },
  });
  return { shouldProcess: update.count === 1, eventId: existing.id };
}
