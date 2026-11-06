/** Emenda a faixa e reproduz apenas os vídeos que entram na área visível. */
export function iniciarCarrossel() {
  const carrossel = document.querySelector(".abertura-foto")
  const janela = carrossel.querySelector(".abertura-janela")
  const faixa = carrossel.querySelector(".abertura-faixa")
  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)")
  let pausaManual = false
  let tocando = false
  let arraste = null
  let retomarEm = 0

  const destaques = [...faixa.children]
  for (const destaque of destaques) {
    const copia = destaque.cloneNode()
    if (copia instanceof HTMLImageElement) copia.alt = ""
    copia.removeAttribute("fetchpriority")
    copia.setAttribute("aria-hidden", "true")
    faixa.append(copia)
  }

  const videos = [...faixa.querySelectorAll("video")]
  const visiveis = new Set()
  const observador = new IntersectionObserver(entradas => {
    for (const { target, intersectionRatio } of entradas) {
      if (intersectionRatio >= .25) visiveis.add(target)
      else visiveis.delete(target)
    }
    atualizarVideos()
  }, { threshold: .25 })
  for (const video of videos) {
    video.muted = true
    observador.observe(video)
  }

  function atualizarVideos() {
    for (const video of videos) {
      if (!pausaManual && !movimentoReduzido.matches && !document.hidden && visiveis.has(video)) {
        if (video.paused) video.play().catch(() => {})
      } else {
        video.pause()
      }
    }
  }

  janela.addEventListener("keydown", evento => {
    if (evento.code !== "Space" || movimentoReduzido.matches) return
    evento.preventDefault()
    if (evento.repeat) return
    pausaManual = !pausaManual
    atualizarVideos()
  })
  janela.addEventListener("pointerdown", evento => {
    if (evento.pointerType !== "mouse" || evento.button !== 0) return
    arraste = { id: evento.pointerId, x: evento.clientX, inicio: janela.scrollLeft }
    janela.setPointerCapture(evento.pointerId)
    janela.classList.add("arrastando")
  })
  janela.addEventListener("pointermove", evento => {
    if (arraste?.id !== evento.pointerId) return
    janela.scrollLeft = arraste.inicio + arraste.x - evento.clientX
  })
  janela.addEventListener("lostpointercapture", () => {
    arraste = null
    janela.classList.remove("arrastando")
    adiarRetomada()
  })

  function adiarRetomada() {
    retomarEm = performance.now() + 900
  }

  janela.addEventListener("touchstart", () => { tocando = true }, { passive: true })
  for (const evento of ["touchend", "touchcancel"]) {
    janela.addEventListener(evento, () => {
      tocando = false
      adiarRetomada()
    }, { passive: true })
  }
  janela.addEventListener("scroll", () => {
    if (tocando || performance.now() < retomarEm) adiarRetomada()
  }, { passive: true })
  janela.addEventListener("wheel", adiarRetomada, { passive: true })
  janela.addEventListener("keydown", evento => {
    if (evento.key === "ArrowLeft" || evento.key === "ArrowRight") adiarRetomada()
  })

  let quadroAnterior
  let fracao = 0
  let reducaoAnterior = movimentoReduzido.matches
  function avancar(agora) {
    const reduzir = movimentoReduzido.matches
    if (reduzir !== reducaoAnterior) {
      reducaoAnterior = reduzir
      atualizarVideos()
    }
    if (quadroAnterior !== undefined && !pausaManual && !reduzir &&
      !arraste && !tocando && !document.hidden && agora >= retomarEm) {
      const volta = faixa.children[destaques.length].offsetLeft - faixa.firstElementChild.offsetLeft
      const distancia = fracao + Math.min(agora - quadroAnterior, 32) * volta / (destaques.length * 8000)
      const pixels = Math.floor(distancia)
      fracao = distancia - pixels
      if (pixels) janela.scrollLeft = (janela.scrollLeft + pixels) % volta
    }
    quadroAnterior = agora
    requestAnimationFrame(avancar)
  }

  movimentoReduzido.addEventListener("change", atualizarVideos)
  document.addEventListener("visibilitychange", atualizarVideos)
  requestAnimationFrame(avancar)
}
