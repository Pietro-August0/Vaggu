/** Número público confirmado pela equipe; o ambiente pode substituir o destino no build. */
export const WHATSAPP_NUMBER = String(import.meta.env.VITE_WHATSAPP_NUMBER ?? "5511993807892").replace(/\D/g, "")
export const WHATSAPP_URL = /^\d{10,15}$/.test(WHATSAPP_NUMBER)
  ? `https://wa.me/${WHATSAPP_NUMBER}`
  : undefined
export const WHATSAPP_SUPPORT_URL = WHATSAPP_URL ?? null
