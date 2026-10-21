import { Router } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil, loginLimiter } from '../auth/middleware.js';
import { ApiError } from '../auth/service.js';
import type { createTeloesService } from './service.js';
export function teloesRoutes(auth: unknown, servico: ReturnType<typeof createTeloesService>) {
 const r = Router();
 r.get('/teloes/:id/disponibilidade', loginLimiter({ limit: 180, windowMs: 60_000 }), async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(await servico.consultar(req.params.id, req.get('Authorization'))); });
 r.use('/shoppings/:shoppingId/teloes', requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));
 r.get('/shoppings/:shoppingId/teloes', async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(await servico.listar(req.params.shoppingId)); });
 r.post('/shoppings/:shoppingId/teloes', async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe um objeto válido.');
  res.set('Cache-Control', 'no-store'); res.status(201).json(await servico.criar(req.params.shoppingId, req.body));
 });
 r.delete('/shoppings/:shoppingId/teloes/:id', async (req, res) => res.json(await servico.revogar(req.params.shoppingId, req.params.id)));
 return r;
}
