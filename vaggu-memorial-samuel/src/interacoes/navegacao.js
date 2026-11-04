/** Controla o menu principal e fecha a navegação após uma escolha. */
export function iniciarNavegacao() {
  const botaoMenu = document.getElementById("menuBtn")
  const linksNavegacao = document.getElementById("navlinks")

  if (!(botaoMenu instanceof HTMLButtonElement) || !(linksNavegacao instanceof HTMLElement)) return

  function fecharMenu(devolverFoco = false) {
    linksNavegacao.classList.remove("is-open")
    botaoMenu.setAttribute("aria-expanded", "false")
    botaoMenu.textContent = "☰"
    botaoMenu.setAttribute("aria-label", "Abrir menu")
    if (devolverFoco) botaoMenu.focus()
  }

  botaoMenu.addEventListener("click", () => {
    const aberto = botaoMenu.getAttribute("aria-expanded") !== "true"
    linksNavegacao.classList.toggle("is-open", aberto)
    botaoMenu.setAttribute("aria-expanded", String(aberto))
    botaoMenu.textContent = aberto ? "×" : "☰"
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu")
  })

  linksNavegacao.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => fecharMenu())
  })

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && botaoMenu.getAttribute("aria-expanded") === "true") {
      fecharMenu(true)
    }
  })

  document.addEventListener("pointerdown", (evento) => {
    if (
      evento.target instanceof Node &&
      !botaoMenu.contains(evento.target) &&
      !linksNavegacao.contains(evento.target)
    ) {
      fecharMenu()
    }
  })
}
