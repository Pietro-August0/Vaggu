/** Relaciona a imagem de movimento urbano aos benefícios da gestão e ao atendimento. */
import { ArrowRight, BarChart3, ParkingCircle } from "lucide-react"
import { WHATSAPP_URL } from "@/lib/constants"
import "./operacao-vaggu.css"

/** Mantém a foto como destaque e apresenta o acompanhamento oferecido ao shopping. */
export function OperacaoVaggu() {
  return (
    <section className="operacao-vaggu" aria-labelledby="titulo-operacao">
      <img className="operacao-imagem" src="/assets/city-flow-vaggu.png" alt="" loading="lazy" />
      <div className="operacao-conteudo">
        <div className="operacao-texto" data-reveal>
          <h2 id="titulo-operacao">O shopping em movimento.<br /><span>Sua gestão mais clara.</span></h2>
          <p className="operacao-descricao">Entenda o uso do estacionamento e transforme os dados das vagas em decisões para o dia a dia da sua equipe.</p>
          <ul className="operacao-beneficios">
            <li>
              <BarChart3 aria-hidden="true" />
              <div><h3>Entenda o movimento</h3><p>Consulte o histórico de ocupação para reconhecer horários de maior demanda e planejar a operação.</p></div>
            </li>
            <li>
              <ParkingCircle aria-hidden="true" />
              <div><h3>Conte com a equipe VAGGU</h3><p>Da avaliação à implantação, nossa equipe prepara a estrutura e os acessos para o seu shopping.</p></div>
            </li>
          </ul>
          <a className="operacao-contato" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Conversar sobre meu shopping com a VAGGU no WhatsApp (abre em nova aba)">Conversar sobre meu shopping <ArrowRight aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
