// Recebe o desafio de configuração e os eventos da Meta, validando sua origem antes de processá-los.
import { Router } from 'express';
import { validateMetaSignature } from './signature.js';
import { extractWhatsappEvents, summarizeWhatsappEvents } from './payload.js';

/** Monta o webhook; o POST depende de express.raw para preservar os bytes assinados pela Meta. */
export function whatsappRoutes({ config, service }) {
  const router = Router();

  router.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (!config.verifyToken) {
      return res.status(503).json({
        erro: { codigo: 'WHATSAPP_VERIFY_TOKEN_AUSENTE', mensagem: 'Webhook não configurado.' },
      });
    }
    if (typeof mode !== 'string' || typeof token !== 'string' || typeof challenge !== 'string') {
      return res.status(400).json({
        erro: { codigo: 'PARAMETROS_INVALIDOS', mensagem: 'Parâmetros de verificação inválidos.' },
      });
    }
    if (mode !== 'subscribe') {
      return res.status(400).json({
        erro: { codigo: 'MODO_INVALIDO', mensagem: 'Modo de verificação inválido.' },
      });
    }
    if (token !== config.verifyToken) {
      return res.status(403).json({
        erro: { codigo: 'TOKEN_INVALIDO', mensagem: 'Token de verificação inválido.' },
      });
    }
    return res.status(200).type('text/plain').send(challenge);
  });

  router.post('/', async (req, res, next) => {
    try {
      if (!config.appSecret) {
        return res.status(503).json({
          erro: { codigo: 'META_APP_SECRET_AUSENTE', mensagem: 'Webhook não configurado.' },
        });
      }
      const rawBody = req.body;
      const signature = req.get('x-hub-signature-256');
      if (!validateMetaSignature(rawBody, signature, config.appSecret)) {
        console.warn('Webhook WhatsApp rejeitado', { codigo: 'ASSINATURA_INVALIDA' });
        return res.status(401).json({
          erro: { codigo: 'ASSINATURA_INVALIDA', mensagem: 'Assinatura do webhook inválida.' },
        });
      }

      let payload;
      try {
        payload = JSON.parse(rawBody.toString('utf8'));
      } catch {
        return res.status(400).json({
          erro: { codigo: 'JSON_INVALIDO', mensagem: 'O corpo deve ser um JSON válido.' },
        });
      }

      const events = extractWhatsappEvents(payload);
      console.info('Webhook WhatsApp recebido', summarizeWhatsappEvents(events));
      for (const status of events.statuses) service.handleStatus(status);
      for (const message of events.messages) await service.handleMessage(message);

      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
