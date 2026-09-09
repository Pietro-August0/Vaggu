export function createWhatsappClient(config, { fetchImpl = globalThis.fetch } = {}) {
  return {
    async sendText(to, body) {
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
              type: 'text',
              text: { preview_url: false, body },
            }),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          let metaCode = `HTTP_${response.status}`;
          try {
            const data = await response.json();
            if (data?.error?.code) metaCode = String(data.error.code);
          } catch {
            // Mantem o codigo HTTP quando a Meta nao retorna JSON parseavel.
          }
          throw new Error(`META_ENVIO_FALHOU:${metaCode}`);
        }
        return response.json().catch(() => ({}));
      } catch (error) {
        if (error.name === 'AbortError') throw new Error('META_ENVIO_TIMEOUT');
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
