// Hook para animações de scroll usando Motion
// Gerencia variantes de animação baseadas na posição da viewport
import { useScroll, useTransform, useMotionTemplate } from "motion/react"
import { useRef } from "react"

export function useScrollAnimations() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Opacidade aumenta conforme scroll
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.8, 1])

  // Escala aumenta suavemente
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.95, 1])

  // Deslocamento vertical (parallax suave)
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])

  return { ref, opacity, scale, y, scrollYProgress }
}

// Variantes de animação de entrada
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
}
