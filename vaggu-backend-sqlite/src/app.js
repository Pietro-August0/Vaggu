import express from 'express';
import helmet from 'helmet';
import { authRoutes } from './auth/routes.js';
import { ApiError } from './auth/service.js';
import { whatsappRoutes } from './whatsapp/routes.js';

// Injeção da consulta facilita testar HTTP sem um banco real.
export function createApp({ checkDatabase, auth, whatsapp }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  if (whatsapp) {
    app.use('/api/v1/whatsapp/webhook', express.raw({ type: 'application/json', limit: '64kb' }), whatsappRoutes(whatsapp));
  }
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', servico: 'vaggu-api' });
  });

  app.get('/api/v1/health/ready', async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
      await checkDatabase();
      res.json({ status: 'ok', banco: 'conectado' });
    } catch {
      // Não devolver caminho, senha ou mensagem interna do banco.
      res.status(503).json({
        erro: {
          codigo: 'BANCO_INDISPONIVEL',
          mensagem: 'Não foi possível acessar o banco de dados.',
        },
      });
    }
  });

  if (auth) app.use('/api/v1/auth', authRoutes(auth));

  app.use((_req, res) => {
    res.status(404).json({
      erro: { codigo: 'ROTA_NAO_ENCONTRADA', mensagem: 'Rota não encontrada.' },
    });
  });

  app.use((error, _req, res, _next) => {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ erro: { codigo: error.codigo, mensagem: error.message } });
    }
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({
        erro: { codigo: 'JSON_INVALIDO', mensagem: 'O corpo deve ser um JSON válido.' },
      });
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({
        erro: { codigo: 'CORPO_MUITO_GRANDE', mensagem: 'O limite é 32 KB.' },
      });
    }
    return res.status(500).json({
      erro: { codigo: 'ERRO_INTERNO', mensagem: 'Não foi possível processar a solicitação.' },
    });
  });

  return app;
}
