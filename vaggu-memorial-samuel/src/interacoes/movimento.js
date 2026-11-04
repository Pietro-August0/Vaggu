/** Aplica uma entrada curta quando o conteúdo chega à área visível. */
export function iniciarMovimento() {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return
      target.classList.add("is-visible")
      observador.unobserve(target)
    })
  })

  document.querySelectorAll(".reveal").forEach((elemento) => observador.observe(elemento))
}
