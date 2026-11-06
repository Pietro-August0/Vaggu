/** Inicia a entrada na área visível e controla os ciclos da seção do projeto. */
export function iniciarMovimento() {
  if (!("IntersectionObserver" in window)) return

  const etapas = document.querySelector(".etapas-projeto")
  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)")
  etapas?.addEventListener("keydown", evento => {
    if (evento.code !== "Space" || movimentoReduzido.matches) return
    evento.preventDefault()
    if (!evento.repeat) etapas.classList.toggle("etapas-pausadas")
  })

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return
      target.classList.add("is-visible")
      observador.unobserve(target)
    })
  })

  document.querySelectorAll(".reveal").forEach((elemento) => observador.observe(elemento))
}
