// Revela blocos da landing conforme entram na viewport, respeitando movimento reduzido.
import { useEffect } from "react"

export function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    elements.forEach((element) => element.classList.add("reveal-pending"))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])
}
