import { Router } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil, shoppingScope } from '../auth/middleware.js';
import { ApiError } from '../auth/service.js';
import type { createEquipamentosService } from './service.js';
type Servico = ReturnType<typeof createEquipamentosService>;
function corpo(valor: unknown): Record<string, unknown> {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe um objeto válido.');
  return valor as Record<string, unknown>;
}
export function equipamentosRoutes(auth: unknown, servico: Servico) {
  const r = Router();

  r.get('/estacionamento/ocorrencias', requireAuth(auth), requirePasswordReady, shoppingScope, async (_req, res) => { res.set('Cache-Control', 'no-store'); res.json({ ocorrencias: (await servico.listar(res.locals.shoppingId)).ocorrencias }); });
  r.use(['/shoppings/:shoppingId/equipamentos', '/shoppings/:shoppingId/ocorrencias'], requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));
  r.get('/shoppings/:shoppingId/equipamentos', async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(await servico.listar(req.params.shoppingId)); });
  r.post('/shoppings/:shoppingId/equipamentos', async (req, res) => { res.set('Cache-Control', 'no-store'); res.status(201).json(await servico.criarPlaca(req.params.shoppingId, corpo(req.body))); });
  r.patch('/shoppings/:shoppingId/equipamentos/:id', async (req, res) => res.json(await servico.editarPlaca(req.params.shoppingId, req.params.id, corpo(req.body))));
  r.post('/shoppings/:shoppingId/equipamentos/:id/chave', async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(await servico.rotacionarChave(req.params.shoppingId, req.params.id)); });
  r.post('/shoppings/:shoppingId/equipamentos/:id/sensores', async (req, res) => res.status(201).json(await servico.vincularSensor(req.params.shoppingId, req.params.id, corpo(req.body))));
  r.post('/shoppings/:shoppingId/equipamentos/:id/manutencao', async (req, res) => res.status(201).json(await servico.abrirManutencao(req.params.shoppingId, req.params.id, corpo(req.body), res.locals.auth.usuario.id)));
  r.post('/shoppings/:shoppingId/ocorrencias/:id/encerrar', async (req, res) => res.json(await servico.encerrarManutencao(req.params.shoppingId, req.params.id, corpo(req.body), res.locals.auth.usuario.id)));
  return r;
}
