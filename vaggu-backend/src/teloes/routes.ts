import { Router } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil, shoppingScope, loginLimiter } from '../auth/middleware.js';
import { ApiError } from '../auth/service.js';
import type { createTeloesService } from './service.js';
function corpo(valor: unknown): Record<string, unknown> {
 if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe um objeto válido.');
 return valor as Record<string, unknown>;
}
export function teloesRoutes(auth: unknown, servico: ReturnType<typeof createTeloesService>) {
 const r = Router();
 r.get('/teloes/:id/disponibilidade', loginLimiter({ limit: 180, windowMs: 60_000 }), async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(await servico.consultar(req.params.id, req.get('Authorization'))); });
 r.use('/estacionamento/teloes', requireAuth(auth), requirePasswordReady, shoppingScope, (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
 r.get('/estacionamento/teloes', async (_req, res) => res.json(await servico.listar(res.locals.shoppingId)));
 r.post('/estacionamento/teloes', async (req, res) => res.status(201).json(await servico.criar(res.locals.shoppingId, corpo(req.body))));
 r.patch('/estacionamento/teloes/:id', async (req, res) => res.json(await servico.editar(res.locals.shoppingId, req.params.id, corpo(req.body))));
 r.delete('/estacionamento/teloes/:id/cadastro', async (req, res) => res.json(await servico.excluir(res.locals.shoppingId, req.params.id)));
 r.delete('/estacionamento/teloes/:id', async (req, res) => res.json(await servico.revogar(res.locals.shoppingId, req.params.id)));
 r.use('/shoppings/:shoppingId/teloes', requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));
 r.get('/shoppings/:shoppingId/teloes', async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(await servico.listar(req.params.shoppingId)); });
 r.post('/shoppings/:shoppingId/teloes', async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe um objeto válido.');
  res.set('Cache-Control', 'no-store'); res.status(201).json(await servico.criar(req.params.shoppingId, req.body));
 });
 r.patch('/shoppings/:shoppingId/teloes/:id', async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(await servico.editar(req.params.shoppingId, req.params.id, corpo(req.body))); });
 r.delete('/shoppings/:shoppingId/teloes/:id/cadastro', async (req, res) => res.json(await servico.excluir(req.params.shoppingId, req.params.id)));
 r.delete('/shoppings/:shoppingId/teloes/:id', async (req, res) => res.json(await servico.revogar(req.params.shoppingId, req.params.id)));
 return r;
}
