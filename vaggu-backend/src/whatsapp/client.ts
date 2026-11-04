// Cliente de texto e mensagens interativas da Meta, com transporte substituível em testes.
/** Cria o adaptador HTTP utilizado pelo serviço de mensagens. */
export function createWhatsappClient(config, { fetchImpl = globalThis.fetch } = {}) {
    /** Compartilha timeout e tratamento de falha entre texto e interação, sem reenvio automático. */
    async function send(to, content) {
      if (!config.accessToken || !config.phoneNumberId || !config.apiVersion) {
        throw new Error('WHATSAPP_ENVIO_NAO_CONFIGURADO');
      }
      if (typeof fetchImpl !== 'function') throw new Error('FETCH_INDISPONIVEL');

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetchImpl(
          `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to,
              ...content,
            }),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          let metaCode = `HTTP_${response.status}`;
          try {
            const data: any = await response.json();
            if (data?.error?.code) metaCode = String(data.error.code);
          } catch {
            // Mantém o código HTTP quando a Meta não retorna JSON legível.
          }
          throw new Error(`META_ENVIO_FALHOU:${metaCode}`);
        }
        return response.json().catch(() => ({}));
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') throw new Error('META_ENVIO_TIMEOUT');
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    }
  return {
    sendText(to, body) { return send(to, { type: 'text', text: { preview_url: false, body } }); },
    sendInteractive(to, interactive) { return send(to, { type: 'interactive', interactive }); },
  };
}
