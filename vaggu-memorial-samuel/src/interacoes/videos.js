import { fotos, videos } from "../dados/acervo.js"

/** Prepara miniaturas e carrega cada vídeo somente após foco ou interação. */
export function iniciarVideos() {
  document.querySelectorAll("video[data-poster]").forEach((elemento) => {
    if (!(elemento instanceof HTMLVideoElement)) return

    const indice = Number(elemento.id.replace("video", ""))
    const fonte = videos[indice]
    const miniatura = fotos[elemento.dataset.poster ?? ""]
    if (miniatura) elemento.poster = miniatura
    elemento.preload = "none"

    function carregarVideo() {
      if (!fonte || elemento.getAttribute("src")) return
      elemento.src = fonte
      elemento.load()
    }

    elemento.addEventListener("pointerdown", carregarVideo, { once: true })
    elemento.addEventListener("focus", carregarVideo, { once: true })
  })
}
