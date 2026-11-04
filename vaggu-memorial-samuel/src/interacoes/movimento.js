/** Atualiza o progresso da página e revela seções sem ignorar movimento reduzido. */
export function iniciarMovimento() {
  const barraProgresso = document.getElementById("progress")
  let quadroAgendado = false

  function atualizarProgresso() {
    if (!barraProgresso) return
    if (!quadroAgendado) {
      quadroAgendado = true
      window.requestAnimationFrame(() => {
        const alturaRolavel = document.documentElement.scrollHeight - window.innerHeight
        const progresso = alturaRolavel > 0 ? (window.scrollY / alturaRolavel) * 100 : 0
        barraProgresso.style.width = `${progresso}%`
        quadroAgendado = false
      })
    }
  }

  window.addEventListener("scroll", atualizarProgresso, { passive: true })
  window.addEventListener("resize", atualizarProgresso, { passive: true })
  atualizarProgresso()

  const elementosRevelados = document.querySelectorAll(".reveal")
  const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (!("IntersectionObserver" in window) || movimentoReduzido) {
    elementosRevelados.forEach((elemento) => elemento.classList.add("is-visible"))
    return
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible")
          observador.unobserve(entrada.target)
        }
      })
    },
    { threshold: 0.05, rootMargin: "0px 0px -32px 0px" },
  )

  elementosRevelados.forEach((elemento) => observador.observe(elemento))
}
