// Rotas HTTP de autenticação. A regra de sessão fica no serviço para ser
// reutilizada por outros módulos sem acoplar Express à regra de negócio.
import { Router } from 'express';
import { loginLimiter, requireAuth } from './middleware.js';

export function authRoutes(auth) {
  const router = Router();
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.post('/login', loginLimiter(), async (req, res) => {
    res.json(await auth.login(req.body));
  });
  router.get('/me', requireAuth(auth), (_req, res) => {
    res.json({ usuario: res.locals.auth.usuario });
  });
  router.post('/change-password', requireAuth(auth), async (req, res) => {
    res.json(await auth.changePassword(res.locals.auth.sessionId, req.body));
  });
  router.post('/logout', requireAuth(auth), async (_req, res) => {
    await auth.logout(res.locals.auth.sessionId);
    res.status(204).end();
  });
  return router;
}
