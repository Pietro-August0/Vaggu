/** Mantém a escolha explícita de movimento e a aplica às animações CSS e Motion. */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { MotionConfig } from "motion/react"

const CHAVE_PREFERENCIA_ANIMACOES = "vaggu-animacoes"

type PreferenciaAnimacoes = {
  animacoesAtivas: boolean
  alternarAnimacoes: () => void
}

const ContextoPreferenciaAnimacoes = createContext<PreferenciaAnimacoes | null>(null)

/** Ativa as animações por padrão e conserva a opção de pausá-las neste navegador. */
export function PreferenciaAnimacoesProvider({ children }: { children: ReactNode }) {
  const [animacoesAtivas, setAnimacoesAtivas] = useState(
    () => window.localStorage.getItem(CHAVE_PREFERENCIA_ANIMACOES) !== "reduzidas",
  )

  useEffect(() => {
    const preferencia = animacoesAtivas ? "ativas" : "reduzidas"
    document.documentElement.dataset.animacoes = preferencia
    window.localStorage.setItem(CHAVE_PREFERENCIA_ANIMACOES, preferencia)
  }, [animacoesAtivas])

  return (
    <ContextoPreferenciaAnimacoes.Provider
      value={{ animacoesAtivas, alternarAnimacoes: () => setAnimacoesAtivas((ativa) => !ativa) }}
    >
      <MotionConfig reducedMotion={animacoesAtivas ? "never" : "always"}>{children}</MotionConfig>
    </ContextoPreferenciaAnimacoes.Provider>
  )
}

/** Expõe a preferência somente dentro do provedor global da aplicação. */
export function usePreferenciaAnimacoes() {
  const contexto = useContext(ContextoPreferenciaAnimacoes)
  if (!contexto) throw new Error("usePreferenciaAnimacoes deve ser usado dentro de PreferenciaAnimacoesProvider.")
  return contexto
}
