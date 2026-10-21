/** Exibe agregados confirmados para prévia autenticada dos telões. */

import { Accessibility, PersonStanding, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useParams } from "react-router-dom"

import { useEstruturaAtualizada } from "@/hooks/use-estrutura-atualizada"

import type { EstruturaEstacionamento, TipoVaga, VagaEstrutura } from "@/types/estrutura"
import "./telao-page.css"

type VagaConhecida = VagaEstrutura & { andarId: string; andarNome: string; setorId: string; setorNome: string }
type Contagem = { livres: number; monitoradas: number; total: number; parcial: boolean }

const tipos: Array<{ codigo: TipoVaga; nome: string; icone: LucideIcon }> = [
  { codigo: "PCD", nome: "PCD", icone: Accessibility },
  { codigo: "IDOSO", nome: "Idoso", icone: PersonStanding },
  { codigo: "ELETRICA", nome: "Elétrica", icone: Zap },
]

function vagasDaEstrutura(estrutura: EstruturaEstacionamento): VagaConhecida[] {
  return estrutura.andares.flatMap(andar => andar.ativo ? andar.setores.flatMap(setor => setor.ativo
    ? setor.vagas.filter(vaga => vaga.ativo).map(vaga => ({
      ...vaga, andarId: andar.id, andarNome: andar.nome, setorId: setor.id, setorNome: setor.nome,
    })) : []) : [])
}

function contar(vagas: VagaConhecida[]): Contagem {
  const monitoradas = vagas.filter(vaga => Boolean(vaga.monitoramento)
    && ["OPERANDO", "CONFIRMANDO"].includes(vaga.monitoramento?.situacao ?? "")
    && ["LIVRE", "OCUPADA"].includes(vaga.estadoAtual)).length
  const livres = vagas.filter(vaga => vaga.estadoAtual === "LIVRE"
    && Boolean(vaga.monitoramento)
    && ["OPERANDO", "CONFIRMANDO"].includes(vaga.monitoramento?.situacao ?? "")).length
  return { livres, monitoradas, total: vagas.length, parcial: monitoradas < vagas.length }
}

/** Usa exclusivamente a estrutura autorizada pela sessão do gerente e renova a consulta periodicamente. */
export function TelaoPage() {
  const { andarId } = useParams()
  const { estrutura, consultadoEm, erro, vencida } = useEstruturaAtualizada("/estacionamento/estrutura")
  const carregando = !estrutura && !erro
  const vagas = estrutura ? vagasDaEstrutura(estrutura) : []
  const andares = estrutura?.andares.filter(andar => andar.ativo) ?? []
  const andarAtual = andares.find(andar => andar.id === andarId)
  const escopo = andarAtual ? vagas.filter(vaga => vaga.andarId === andarAtual.id) : vagas
  const contagemGeral = contar(escopo)
  const porTipo = tipos.map(tipo => ({ ...tipo, contagem: contar(escopo.filter(vaga => vaga.tipo === tipo.codigo)) }))
  const porAndar = andares.map(andar => ({ andar, contagem: contar(vagas.filter(vaga => vaga.andarId === andar.id)) }))
  const porSetor = andarAtual?.setores.filter(setor => setor.ativo).map(setor => ({
    setor, contagem: contar(vagas.filter(vaga => vaga.setorId === setor.id)),
  })) ?? []
  const semAndares = estrutura !== null && andares.length === 0

  const grupos = andarAtual
    ? porSetor.map(({ setor, contagem }) => ({ id: setor.id, nome: setor.nome, contagem }))
    : porAndar.map(({ andar, contagem }) => ({ id: andar.id, nome: andar.nome, contagem }))
  const disponivel = !carregando && !erro && !vencida && !semAndares && (!andarId || !!andarAtual)

  return (
    <main className="telao-vaggu" aria-label="Disponibilidade do estacionamento">
      <header className="telao-vaggu__topo">
        <img src="/assets/vaggu-logo-yellow.svg" alt="VAGGU" className="telao-vaggu__logo" />
        <h1>{estrutura?.shopping.nome ?? "Estacionamento"}{andarAtual && <span> · {andarAtual.nome}</span>}</h1>
      </header>
      <section className="telao-vaggu__principal" aria-label="Vagas disponíveis">
        <div className="telao-vaggu__total">
          <h2>Vagas livres agora</h2>
          <strong>{disponivel && contagemGeral.monitoradas ? contagemGeral.livres : "—"}</strong>
          <span className="telao-vaggu__total-legenda">{andarAtual ? "neste andar" : "no estacionamento"}</span>
        </div>
        <div className="telao-vaggu__orientacao">
          <p className="telao-vaggu__chamada">{andarAtual ? "Encontre um setor com vagas" : "Encontre seu andar"}</p>
          <p className="telao-vaggu__mensagem">{erro ? "Informações temporariamente indisponíveis" : carregando ? "Atualizando disponibilidade" : contagemGeral.parcial ? "Dados parciais · siga a sinalização local" : "Compare as vagas livres abaixo"}</p>
        </div>
      </section>
      <section className="telao-vaggu__andares" aria-label={andarAtual ? "Vagas por setor" : "Vagas por andar"}>
        {disponivel && grupos.map(({ id, nome, contagem }) => {
          const proporcao = contagem.monitoradas ? contagem.livres / contagem.monitoradas : 0
          const tom = !contagem.monitoradas || contagem.parcial ? "parcial" : proporcao <= .2 ? "alta" : proporcao <= .5 ? "media" : "baixa"
          const rotulo = !contagem.monitoradas ? "Indisponível" : contagem.parcial ? "Dados parciais" : !contagem.livres ? "Lotado" : tom === "alta" ? "Poucas vagas" : tom === "media" ? "Vagas disponíveis" : "Maior disponibilidade"
          return <article className={"telao-vaggu__andar telao-vaggu__andar--" + tom} key={id}>
            <h2>{nome}</h2>
            <p><strong>{contagem.monitoradas ? contagem.livres : "—"}</strong><span>vagas<br />livres</span></p>
            <span className="telao-vaggu__situacao">{rotulo}</span>
          </article>
        })}
        {!disponivel && <p className="telao-vaggu__indisponivel">{carregando ? "Aguarde um instante." : "Consulte a sinalização do estacionamento."}</p>}
      </section>
      <section className="telao-vaggu__categorias" aria-label="Vagas livres por categoria">
        <h2>Vagas livres por categoria</h2>
        <div className="telao-vaggu__categorias-grade">{porTipo.map(tipo => {
          const Icone = tipo.icone
          return <div className={`telao-vaggu__categoria telao-vaggu__categoria--${tipo.codigo.toLowerCase()}`} key={tipo.codigo}>
            <span className="telao-vaggu__categoria-icone" aria-hidden="true"><Icone strokeWidth={2.5} /></span>
            <h3>{tipo.nome}</h3>
            <p><strong>{disponivel && tipo.contagem.monitoradas ? tipo.contagem.livres : "—"}</strong><span>livres</span></p>
          </div>
        })}</div>
      </section>
      <footer className="telao-vaggu__rodape">
        <span>{estrutura?.shopping.demonstracao ? "Dados de demonstração" : "Categorias especiais incluídas no total"}{disponivel && contagemGeral.parcial ? " · Disponibilidade parcial" : ""}</span>
        <span>{consultadoEm ? "Atualizado às " + new Date(consultadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "Aguardando atualização"}</span>
      </footer>
    </main>
  )
}
