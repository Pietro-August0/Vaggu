/** Abre o depoimento quando o endereço aponta diretamente para um integrante. */
export function iniciarNavegacao() {
  function abrirDepoimento() {
    const destino = document.getElementById(window.location.hash.slice(1))
    if (destino instanceof HTMLDetailsElement) destino.open = true
  }

  window.addEventListener("hashchange", abrirDepoimento)
  abrirDepoimento()
}
