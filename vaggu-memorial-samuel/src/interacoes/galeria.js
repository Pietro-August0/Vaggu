import { fotos } from "../dados/acervo.js"

/** Coordena filtros, expansão do acervo e visualização acessível das fotografias. */
export function iniciarGaleria() {
  const fotografias = [...document.querySelectorAll(".gal-item")]
  const botaoMais = document.getElementById("showAll")
  const janela = document.getElementById("lightbox")
  const imagemAmpliada = document.getElementById("lightImage")
  const legenda = document.getElementById("lightCaption")
  const botaoFechar = document.getElementById("lightClose")
  const botaoAnterior = document.getElementById("lightPrev")
  const botaoProxima = document.getElementById("lightNext")

  if (
    !botaoMais || !janela || !(imagemAmpliada instanceof HTMLImageElement) ||
    !legenda || !botaoFechar || !botaoAnterior || !botaoProxima
  ) return

  let filtroAtual = "todos"
  let mostrarTodas = false
  let fotografiasFiltradas = []
  let indiceAtual = 0
  let ultimoFoco = null

  document.querySelectorAll("img[data-foto]").forEach((imagem) => {
    if (!(imagem instanceof HTMLImageElement)) return
    const fonte = fotos[imagem.dataset.foto ?? ""]
    if (fonte) imagem.src = fonte
  })

  function atualizarGaleria() {
    fotografiasFiltradas = fotografias.filter(
      (item) => filtroAtual === "todos" || item.dataset.cat === filtroAtual,
    )

    fotografias.forEach((item) => {
      const posicao = fotografiasFiltradas.indexOf(item)
      item.hidden = posicao < 0 || (!mostrarTodas && posicao >= 12)
    })

    botaoMais.hidden = fotografiasFiltradas.length <= 12
    botaoMais.setAttribute("aria-expanded", String(mostrarTodas))
    botaoMais.textContent = mostrarTodas
      ? "Mostrar menos ↑"
      : `Ver todas as ${fotografiasFiltradas.length} fotografias ↓`
  }

  function abrirFotografia(indice) {
    const item = fotografiasFiltradas[indice]
    if (!item) return

    if (janela.hidden) ultimoFoco = document.activeElement
    indiceAtual = indice
    imagemAmpliada.src = fotos[item.dataset.imgId ?? ""] ?? ""
    imagemAmpliada.alt = item.getAttribute("aria-label")?.replace("Ampliar imagem: ", "") ?? "Fotografia do acervo"
    legenda.textContent = `${imagemAmpliada.alt} · ${indiceAtual + 1} de ${fotografiasFiltradas.length}`
    janela.hidden = false
    document.body.classList.add("lightbox-aberto")
    botaoFechar.focus()
  }

  function fecharFotografia() {
    janela.hidden = true
    document.body.classList.remove("lightbox-aberto")
    if (ultimoFoco instanceof HTMLElement) ultimoFoco.focus()
  }

  function moverFotografia(direcao) {
    indiceAtual = (indiceAtual + direcao + fotografiasFiltradas.length) % fotografiasFiltradas.length
    abrirFotografia(indiceAtual)
    botaoFechar.focus()
  }

  document.querySelectorAll(".filter").forEach((botao) => {
    botao.addEventListener("click", () => {
      filtroAtual = botao.dataset.filter ?? "todos"
      mostrarTodas = false
      document.querySelectorAll(".filter").forEach((outroBotao) => {
        outroBotao.setAttribute("aria-pressed", String(outroBotao === botao))
      })
      atualizarGaleria()
    })
  })

  botaoMais.addEventListener("click", () => {
    mostrarTodas = !mostrarTodas
    atualizarGaleria()
  })

  fotografias.forEach((item) => {
    item.addEventListener("click", () => {
      const indice = fotografiasFiltradas.indexOf(item)
      if (indice >= 0) abrirFotografia(indice)
    })
  })

  botaoFechar.addEventListener("click", fecharFotografia)
  botaoAnterior.addEventListener("click", () => moverFotografia(-1))
  botaoProxima.addEventListener("click", () => moverFotografia(1))
  janela.addEventListener("click", (evento) => {
    if (evento.target === janela) fecharFotografia()
  })

  document.addEventListener("keydown", (evento) => {
    if (janela.hidden) return

    if (evento.key === "Escape") fecharFotografia()
    if (evento.key === "ArrowRight") moverFotografia(1)
    if (evento.key === "ArrowLeft") moverFotografia(-1)
    if (evento.key === "Tab") {
      const controles = [botaoFechar, botaoAnterior, botaoProxima]
      const inicio = controles[0]
      const fim = controles.at(-1)
      if (evento.shiftKey && document.activeElement === inicio) {
        evento.preventDefault()
        fim?.focus()
      } else if (!evento.shiftKey && document.activeElement === fim) {
        evento.preventDefault()
        inicio?.focus()
      }
    }
  })

  atualizarGaleria()
}
