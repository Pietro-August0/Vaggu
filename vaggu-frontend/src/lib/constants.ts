export const WHATSAPP_NUMBER = "5511999999999"

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá, equipe VAGGU! Quero conversar sobre a gestão do estacionamento do meu shopping.",
)}`

export const DEMO_ACCOUNTS = {
  admin: {
    email: "admin@vaggu.com",
    password: "Vaggu#Admin2026",
  },
  shopping: {
    email: "shopping@vaggu.com",
    password: "Vaggu#Shopping2026",
  },
} as const

export const STORAGE_KEY = "vaggu:mvp:v1"
