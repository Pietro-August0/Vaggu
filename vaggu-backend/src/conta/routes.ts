// Rotas HTTP da conta do usuário autenticado. Usam a identidade da sessão para
// impedir que o cliente escolha qual conta será lida ou editada.
import { Router } from 'express';
import { requireAuth } from '../auth/middleware.js';

/** Monta consulta e edição pessoal usando exclusivamente o ID obtido na sessão autenticada. */
export function contaRoutes(auth, conta) {
  const router = Router();
  router.use(requireAuth(auth));

  router.get('/', async (_req, res) => {
    res.json(await conta.buscarMinhaConta(res.locals.auth.usuario.id));
  });

  router.patch('/', async (req, res) => {
    res.json(await conta.atualizarMinhaConta(res.locals.auth.usuario.id, req.body));
  });

  return router;
}
