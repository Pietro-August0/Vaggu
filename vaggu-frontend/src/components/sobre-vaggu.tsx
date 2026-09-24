/** Apresenta a solução, a jornada comercial e os benefícios conectados ao painel. */
import { CalendarClock, Car, Monitor } from "lucide-react"
import { motion } from "motion/react"
import { IconeWhatsApp } from "@/components/icone-whatsapp"
import { WHATSAPP_URL } from "@/lib/constants"
import "./sobre-vaggu.css"

const etapas = [
  { icone: IconeWhatsApp, texto: <>Entre em contato conosco pelo WhatsApp</> },
  { icone: CalendarClock, texto: <>Agende uma avaliação do seu estacionamento</> },
  { icone: Car, texto: <>Implantação da <span>Vaggu</span> no seu local</> },
  { icone: Monitor, texto: <>Acompanhe a operação e seus dados em tempo real</> },
]

const beneficios = [
  { titulo: "Relatórios e exportação de dados", descricao: "Transforme o histórico de ocupação em informações para planejar a operação." },
  { titulo: "Gestão por andar e setor", descricao: "Consulte o mapa e identifique vagas livres, ocupadas e indisponíveis." },
  { titulo: "Indicadores em tempo real", descricao: "Acompanhe a ocupação com as atualizações dos sensores das vagas." },
]

/** Pontos orbitais representam a circulação contínua de dados ao redor da marca. */
function DiagramaDaVaggu() {
  return (
    <div className="sobre-orbitas">
      <div className="sobre-aneis" aria-hidden="true">
        <i /><i /><i />
        <div className="sobre-marca"><img src="/assets/vaggu-logo.svg" alt="" /></div>
      </div>
      <span className="sobre-satelite sobre-satelite-topo">Dados em tempo real</span>
      <span className="sobre-satelite sobre-satelite-esquerda">Planejamento da operação</span>
      <span className="sobre-satelite sobre-satelite-direita">Visão da ocupação</span>
      <span className="sobre-satelite sobre-satelite-base">Estatísticas do estacionamento</span>
    </div>
  )
}

/** As conexões entram em sequência após o painel estar quase todo visível. */
export function SobreVaggu() {
  const entrada = {
    initial: "desconectado",
    whileInView: "conectado",
    viewport: { once: true, amount: 0.25 },
    variants: {
      desconectado: { "--conectar": "100%" },
      conectado: { "--conectar": "0%" },
    },
  }
  const entradaDoPainel = {
    ...entrada,
    viewport: { once: true, amount: 0.8 },
  }

  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="sobre-vaggu">
      <div className="sobre-conteudo">
        <div className="sobre-introducao">
          <div>
            <p className="sobre-legenda">Sobre a Vaggu</p>
            <h2 id="titulo-sobre">Solução <span>inteligente</span> para shoppings mais eficientes e com grande fluxo</h2>
            <p className="sobre-descricao">A Vaggu é uma solução para gestão inteligente de estacionamentos de shoppings, conectando dados, vagas e visão estratégica.</p>
          </div>
          <DiagramaDaVaggu />
        </div>

        <div className="sobre-comecar">
          <h3>Saiba como começar</h3>
          <motion.ol className="sobre-etapas" {...entrada}>
            {etapas.map(({ icone: Icone, texto }, indice) => (
              <li key={indice} className="sobre-etapa" style={{ transitionDelay: `${indice * 0.45}s` }}>
                <p>{texto}</p>
                <div className="sobre-circulo">
                  {indice === 0 ? (
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Conversar com a VAGGU no WhatsApp (abre em nova aba)"><Icone aria-hidden="true" /></a>
                  ) : <div><Icone aria-hidden="true" /></div>}
                </div>
              </li>
            ))}
          </motion.ol>
        </div>

        <div className="sobre-visualiza">
          <h3>Você visualiza</h3>
          <motion.div className="sobre-painel" {...entradaDoPainel}>
            {/* Trajetos decorativos compartilham a grade dos destinos e ficam atrás do notebook. */}
            <svg className="sobre-conexoes" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 220 225 C 400 30 510 -30 660 70" />
              <path d="M 220 225 C 390 350 510 300 660 210" />
              <path d="M 220 225 C 210 510 460 430 660 350" />
            </svg>
            <figure className="sobre-notebook">
              <img src="/assets/mockup-laptop-vaggu.svg" alt="Ilustração do painel de análise da VAGGU em um notebook" loading="lazy" width="600" height="420" />
            </figure>
            <ul className="sobre-beneficios">
              {beneficios.map(({ titulo, descricao }) => <li key={titulo}><h4>{titulo}</h4><p>{descricao}</p></li>)}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
