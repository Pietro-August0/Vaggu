/** Inicia a entrada na área visível e controla os ciclos da seção do projeto. */
export function iniciarMovimento() {
  if (!("IntersectionObserver" in window)) return

  const etapas = document.querySelector(".etapas-projeto")
  const controle = document.querySelector(".controle-etapas")
  if (etapas && controle) {
    controle.hidden = false
    controle.addEventListener("click", () => {
      const pausadas = etapas.classList.toggle("etapas-pausadas")
      controle.textContent = pausadas ? "Reproduzir animações" : "Pausar animações"
    })
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return
      target.classList.add("is-visible")
      observador.unobserve(target)
    })
  })

  document.querySelectorAll(".reveal").forEach((elemento) => observador.observe(elemento))
}
