/** Identifica o destino no menu e abre depoimentos acessados por link direto. */
export function iniciarNavegacao() {
  const links = document.querySelectorAll(".memorial-nav nav a")

  function atualizarDestino() {
    for (const link of links) {
      if (link.hash === window.location.hash) link.setAttribute("aria-current", "location")
      else link.removeAttribute("aria-current")
    }
    const destino = document.getElementById(window.location.hash.slice(1))
    if (destino instanceof HTMLDetailsElement) destino.open = true
  }

  window.addEventListener("hashchange", atualizarDestino)
  atualizarDestino()
}
