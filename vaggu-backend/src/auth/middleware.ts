// Middlewares de autorização usados pelas rotas HTTP. Eles constroem o escopo
// a partir da sessão validada, nunca de filtros enviados pelo navegador.
import { ApiError } from './service.js';

/** Aceita Bearer legado ou cookie HttpOnly; requisições com cookie exigem cabeçalho ant-CSRF. */
export function requireAuth(auth) {
  return async (req, res, next) => {
    const bearer = req.get('Authorization');
    const tokenCookie = req.get('Cookie')?.split(';').map(parte => parte.trim())
      .find(parte => parte.startsWith('vaggu_sessao='))?.slice('vaggu_sessao='.length);
    if (!bearer && tokenCookie && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)
      && req.get('X-VAGGU-Request') !== '1') {
      throw new ApiError(403, 'ORIGEM_INVALIDA', 'Atualize a página e tente novamente.');
    }
    res.locals.auth = await auth.authenticate(bearer ?? (tokenCookie ? `Bearer ${tokenCookie}` : undefined));
    next();
  };
}

/** Autoriza somente o perfil exigido pela rota, após a autenticação. */
export function requirePerfil(perfil) {
  return (_req, res, next) => {
    if (!res.locals.auth) throw new ApiError(401, 'NAO_AUTENTICADO', 'Faça login para continuar.');
    if (res.locals.auth.usuario.perfil !== perfil) {
      throw new ApiError(403, 'ACESSO_NEGADO', 'Seu perfil não permite esta operação.');
    }
    next();
  };
}

/** Bloqueia áreas protegidas enquanto o usuário ainda usa a senha provisória. */
export function requirePasswordReady(_req, res, next) {
  const user = res.locals.auth?.usuario;
  if (!user) throw new ApiError(401, 'NAO_AUTENTICADO', 'Faça login para continuar.');
  if (user.trocarSenhaObrigatoria) {
    throw new ApiError(403, 'TROCA_SENHA_OBRIGATORIA', 'Troque a senha provisória antes de acessar esta área.');
  }
  next();
}

// Futuras consultas da dashboard devem usar este escopo, nunca o shoppingId
// enviado em body/query/params. A conta vem da sessão validada no servidor.
export function shoppingScope(_req, res, next) {
  const user = res.locals.auth?.usuario;
  if (!user) throw new ApiError(401, 'NAO_AUTENTICADO', 'Faça login para continuar.');
  if (user.perfil !== 'SHOPPING' || !user.shoppingId) {
    throw new ApiError(403, 'ACESSO_NEGADO', 'Acesso exclusivo do shopping.');
  }
  res.locals.shoppingId = user.shoppingId;
  next();
}

// Proteção básica de desenvolvimento: limitada em memória e por IP real.
// Não habilitar trust proxy sem configurar os proxies confiáveis.
export function loginLimiter({ now = Date.now, limit = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const attempts = new Map();
  return (req, res, next) => {
    const timestamp = now();
    for (const [key, value] of attempts) {
      if (value.until <= timestamp) attempts.delete(key);
    }
    const key = req.ip;
    const entry = attempts.get(key) ?? { count: 0, until: timestamp + windowMs };
    if (entry.count >= limit || (!attempts.has(key) && attempts.size >= 5000)) {
      res.set('Retry-After', String(Math.max(1, Math.ceil((entry.until - timestamp) / 1000))));
      throw new ApiError(429, 'MUITAS_TENTATIVAS', 'Muitas tentativas. Aguarde antes de tentar novamente.');
    }
    entry.count++;
    attempts.set(key, entry);
    next();
  };
}
