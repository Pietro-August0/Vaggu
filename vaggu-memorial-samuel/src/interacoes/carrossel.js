/** Repete a sequência para emendar o fim da faixa ao começo. */
export function iniciarCarrossel() {
  const carrossel = document.querySelector(".abertura-foto")
  const janela = carrossel.querySelector(".abertura-janela")
  const faixa = carrossel.querySelector(".abertura-faixa")
  const controle = carrossel.querySelector("button")
  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)")
  let reproduzindo = !movimentoReduzido.matches

  for (const foto of [...faixa.children]) {
    const copia = foto.cloneNode()
    copia.alt = ""
    copia.removeAttribute("fetchpriority")
    copia.setAttribute("aria-hidden", "true")
    faixa.append(copia)
  }

  function atualizarReproducao() {
    janela.dataset.loop = reproduzindo && !document.hidden ? "ativo" : "pausado"
    controle.textContent = reproduzindo ? "Pausar fotos" : "Reproduzir fotos"
  }

  controle.addEventListener("click", () => {
    reproduzindo = !reproduzindo
    atualizarReproducao()
  })
  movimentoReduzido.addEventListener("change", () => {
    if (movimentoReduzido.matches) reproduzindo = false
    atualizarReproducao()
  })
  document.addEventListener("visibilitychange", atualizarReproducao)
  atualizarReproducao()
  controle.hidden = false
}
