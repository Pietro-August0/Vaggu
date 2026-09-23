// Monta a API Express, suas rotas e respostas de erro, sem abrir uma porta de rede.
// Os serviços são recebidos do servidor ou substituídos por simuladores nos testes.
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { resolve } from 'node:path';
import { authRoutes } from './auth/routes.js';
import { ApiError } from './auth/service.js';
import { whatsappRoutes } from './whatsapp/routes.js';
import { gerentesRoutes, shoppingsRoutes } from './shoppings/routes.js';
import { contaRoutes } from './conta/routes.js';
import { estruturaAdminRoutes, estruturaGerenteRoutes } from './estrutura/routes.js';
import { importacaoRoutes } from './importacao/routes.js';

type AppServices = {
  checkDatabase: () => Promise<unknown> | unknown;
  frontendDistPath?: string;
  auth?: any;
  whatsapp?: any;
  shoppings?: any;
  conta?: any;
  estrutura?: any;
  importacao?: any;
};

// Injeção da consulta facilita testar HTTP sem um banco real.
export function createApp({ checkDatabase, frontendDistPath, auth, whatsapp, shoppings, conta, estrutura, importacao }: AppServices) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  // A assinatura da Meta depende dos bytes originais, antes da conversão para JSON.
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
  if (auth && conta) app.use('/api/v1/minha-conta', contaRoutes(auth, conta));
  if (auth && shoppings) {
    app.use('/api/v1/shoppings', shoppingsRoutes(auth, shoppings));
    app.use('/api/v1/gerentes', gerentesRoutes(auth, shoppings));
  }
  if (auth && estrutura) {
    app.use('/api/v1/estacionamento/estrutura', estruturaGerenteRoutes(auth, estrutura));
    app.use('/api/v1', estruturaAdminRoutes(auth, estrutura));
  }
  if (auth && importacao) app.use('/api/v1', importacaoRoutes(auth, importacao));

  // Na hospedagem, entrega o build React pelo mesmo domínio da API. Assim, login e
  // chamadas autenticadas mantêm a política de mesma origem sem liberar CORS amplo.
  if (frontendDistPath) {
    const frontendIndexPath = resolve(frontendDistPath, 'index.html');
    app.use(express.static(frontendDistPath, { index: false }));
    app.get(/^\/(?!api(?:\/|$)).*/, (_req, res, next) => {
      res.sendFile(frontendIndexPath, (error) => error ? next(error) : undefined);
    });
  }

  app.use((_req, res) => {
    res.status(404).json({
      erro: { codigo: 'ROTA_NAO_ENCONTRADA', mensagem: 'Rota não encontrada.' },
    });
  });

  // Só erros de domínio conhecidos podem expor sua mensagem; falhas internas recebem texto genérico.
  const errorHandler: ErrorRequestHandler = (error: any, _req, res, _next) => {
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
        erro: { codigo: 'CORPO_MUITO_GRANDE', mensagem: 'O conteúdo excede o limite permitido para esta rota.' },
      });
    }
    return res.status(500).json({
      erro: { codigo: 'ERRO_INTERNO', mensagem: 'Não foi possível processar a solicitação.' },
    });
  };
  app.use(errorHandler);

  return app;
}
