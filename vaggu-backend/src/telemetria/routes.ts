// Expõe os dois canais de entrada do ESP32 sem reutilizar sessão ou cookie de usuário humano.
import { Router } from 'express';
export type RespostaTelemetria = { status: 'DUPLICADO' | 'PROCESSADO'; [campo: string]: unknown };
export type TelemetriaHttpService = {
  receberHeartbeat: (autorizacao: string | undefined, corpo: unknown) => Promise<RespostaTelemetria>;
  receberEstados: (autorizacao: string | undefined, corpo: unknown) => Promise<RespostaTelemetria>;
};

/** Recebe heartbeat e lotes de sensores; a credencial Device permanece somente no cabeçalho. */
export function telemetriaRoutes(telemetria: TelemetriaHttpService) {
  const router = Router();
  router.post('/heartbeat', async (req, res) => {
    const resultado = await telemetria.receberHeartbeat(req.get('Authorization'), req.body);
    res.status(resultado.status === 'DUPLICADO' ? 200 : 202).json(resultado);
  });
  router.post('/estados', async (req, res) => {
    const resultado = await telemetria.receberEstados(req.get('Authorization'), req.body);
    res.status(resultado.status === 'DUPLICADO' ? 200 : 202).json(resultado);
  });
  return router;
}
