// Rotas HTTP de autenticação. A regra de sessão fica no serviço para ser
// reutilizada por outros módulos sem acoplar Express à regra de negócio.
import { Router } from 'express';
import { loginLimiter, requireAuth } from './middleware.js';

/** Liga login, consulta da identidade, troca de senha e logout ao serviço, impedindo cache das respostas. */
export function authRoutes(auth) {
  const router = Router();
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.post('/login', loginLimiter(), async (req, res) => {
    const dados = await auth.login(req.body);
    res.cookie('vaggu_sessao', dados.token, {
      httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production',
      path: '/api/v1', expires: new Date(dados.expiraEm),
    });
    // O cliente web usa o cookie; consumidores Bearer antigos mantêm o contrato anterior.
    res.json(req.get('X-VAGGU-Request') === '1'
      ? { tipo: dados.tipo, expiraEm: dados.expiraEm, usuario: dados.usuario }
      : dados);
  });
  router.get('/me', requireAuth(auth), (_req, res) => {
    res.json({ usuario: res.locals.auth.usuario, expiraEm: res.locals.auth.expiraEm });
  });
  router.post('/change-password', requireAuth(auth), async (req, res) => {
    res.json(await auth.changePassword(res.locals.auth.sessionId, req.body));
  });
  router.post('/logout', requireAuth(auth), async (_req, res) => {
    await auth.logout(res.locals.auth.sessionId);
    res.clearCookie('vaggu_sessao', { path: '/api/v1', sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    res.status(204).end();
  });
  return router;
}
