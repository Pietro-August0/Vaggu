import { fotos } from "../dados/acervo.js"

/** Coordena o carrossel do projeto e a ampliação acessível das fotos. */
export function iniciarGaleria() {
  const fotografias = [...document.querySelectorAll(".gal-item")]
  const janela = document.getElementById("lightbox")
  const imagemAmpliada = document.getElementById("lightImage")
  const legenda = document.getElementById("lightCaption")
  const botaoFechar = document.getElementById("lightClose")
  const botaoAnterior = document.getElementById("lightPrev")
  const botaoProxima = document.getElementById("lightNext")

  if (
    !janela || !(imagemAmpliada instanceof HTMLImageElement) ||
    !legenda || !botaoFechar || !botaoAnterior || !botaoProxima
  ) return

  let fotografiasFiltradas = fotografias
  let indiceAtual = 0
  let ultimoFoco = null

  document.querySelectorAll("img[data-foto]").forEach((imagem) => {
    if (!(imagem instanceof HTMLImageElement)) return
    const fonte = fotos[imagem.dataset.foto ?? ""]
    if (fonte) imagem.src = fonte
  })

  const slides = [...document.querySelectorAll(".projeto-slide")]
  let slideAtual = 0
  function mostrarSlide(direcao) {
    slideAtual = (slideAtual + direcao + slides.length) % slides.length
    slides.forEach((slide, indice) => { slide.hidden = indice !== slideAtual })
    document.getElementById("projeto-contagem").textContent = `${slideAtual + 1} / ${slides.length}`
  }
  document.getElementById("projeto-anterior")?.addEventListener("click", () => mostrarSlide(-1))
  document.getElementById("projeto-proximo")?.addEventListener("click", () => mostrarSlide(1))
  document.querySelector(".carrossel")?.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft" || evento.key === "ArrowRight") {
      evento.preventDefault()
      mostrarSlide(evento.key === "ArrowRight" ? 1 : -1)
    }
  })
  mostrarSlide(0)

  function abrirFotografia(indice) {
    const item = fotografiasFiltradas[indice]
    if (!item) return

    const estavaFechada = janela.hidden
    if (estavaFechada) ultimoFoco = document.activeElement
    indiceAtual = indice
    imagemAmpliada.src = fotos[item.dataset.imgId ?? ""] ?? ""
    imagemAmpliada.alt = item.getAttribute("aria-label")?.replace("Ampliar imagem: ", "") ?? "Fotografia do acervo"
    legenda.textContent = `${imagemAmpliada.alt} · ${indiceAtual + 1} de ${fotografiasFiltradas.length}`
    janela.hidden = false
    document.body.classList.add("lightbox-aberto")
    if (estavaFechada) botaoFechar.focus()
  }

  function fecharFotografia() {
    janela.hidden = true
    document.body.classList.remove("lightbox-aberto")
    if (ultimoFoco instanceof HTMLElement) ultimoFoco.focus()
  }

  function moverFotografia(direcao) {
    indiceAtual = (indiceAtual + direcao + fotografiasFiltradas.length) % fotografiasFiltradas.length
    abrirFotografia(indiceAtual)
  }

  fotografias.forEach((item) => {
    item.addEventListener("click", () => {
      fotografiasFiltradas = fotografias.filter((foto) => foto.dataset.cat === item.dataset.cat)
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


}
