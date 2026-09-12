// Recebe o desafio de configuração e os eventos da Meta, validando sua origem antes de processá-los.
import { Router } from 'express';
import { validateMetaSignature } from './signature.js';
import { extractWhatsappEvents } from './payload.js';

/** Monta o webhook; o POST depende de express.raw para preservar os bytes assinados pela Meta. */
export function whatsappRoutes({ config, service }) {
  const router = Router();

  router.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (!config.verifyToken) {
      return res.status(503).json({
        erro: { codigo: 'WHATSAPP_VERIFY_TOKEN_AUSENTE', mensagem: 'Webhook nao configurado.' },
      });
    }
    if (typeof mode !== 'string' || typeof token !== 'string' || typeof challenge !== 'string') {
      return res.status(400).json({
        erro: { codigo: 'PARAMETROS_INVALIDOS', mensagem: 'Parametros de verificacao invalidos.' },
      });
    }
    if (mode !== 'subscribe') {
      return res.status(400).json({
        erro: { codigo: 'MODO_INVALIDO', mensagem: 'Modo de verificacao invalido.' },
      });
    }
    if (token !== config.verifyToken) {
      return res.status(403).json({
        erro: { codigo: 'TOKEN_INVALIDO', mensagem: 'Token de verificacao invalido.' },
      });
    }
    return res.status(200).type('text/plain').send(challenge);
  });

  router.post('/', async (req, res, next) => {
    try {
      if (!config.appSecret) {
        return res.status(503).json({
          erro: { codigo: 'META_APP_SECRET_AUSENTE', mensagem: 'Webhook nao configurado.' },
        });
      }
      const rawBody = req.body;
      const signature = req.get('x-hub-signature-256');
      if (!validateMetaSignature(rawBody, signature, config.appSecret)) {
        return res.status(401).json({
          erro: { codigo: 'ASSINATURA_INVALIDA', mensagem: 'Assinatura do webhook invalida.' },
        });
      }

      let payload;
      try {
        payload = JSON.parse(rawBody.toString('utf8'));
      } catch {
        return res.status(400).json({
          erro: { codigo: 'JSON_INVALIDO', mensagem: 'O corpo deve ser um JSON valido.' },
        });
      }

      const events = extractWhatsappEvents(payload);
      for (const status of events.statuses) service.handleStatus(status);
      for (const message of events.messages) await service.handleMessage(message);

      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
