/** Apresenta a rota 404 pública com uma vaga sendo liberada em uma animação única. */
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { WHATSAPP_URL } from "@/lib/constants"

import "./pagina-nao-encontrada.css"

/** Mantém navegação útil enquanto relaciona o erro à identidade de estacionamento da VAGGU. */
export function PaginaNaoEncontrada() {
  return (
    <div className="pagina-404">
      <header className="pagina-404__cabecalho">
        <Brand className="h-8 sm:h-9" />
        <nav aria-label="Navegação da página não encontrada" className="pagina-404__navegacao">
          <Link className="pagina-404__atalho" to="/#sobre">Sobre nós</Link>
          {WHATSAPP_URL && (
            <a className="pagina-404__whatsapp" href={WHATSAPP_URL} rel="noreferrer" target="_blank">
              WhatsApp
            </a>
          )}
        </nav>
      </header>

      <main className="pagina-404__conteudo">
        <div aria-hidden="true" className="pagina-404__ilustracao">
          <span className="pagina-404__numero">4</span>
          <span className="pagina-404__vaga">
            <span className="pagina-404__sensor" />
            <span className="pagina-404__carro" />
          </span>
          <span className="pagina-404__numero">4</span>
        </div>

        <div className="pagina-404__mensagem">
          <p className="pagina-404__codigo">Erro 404</p>
          <h1>Página vaga</h1>
          <p>Não conseguimos encontrar nada por aqui.</p>
        </div>
      </main>

      <Button asChild className="pagina-404__voltar" variant="outline">
        <Link to="/">
          <ArrowLeft aria-hidden="true" />
          Voltar para a tela inicial
        </Link>
      </Button>
    </div>
  )
}
