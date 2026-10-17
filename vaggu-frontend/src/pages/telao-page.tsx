/** Exibe agregados confirmados para prévia autenticada dos telões. */
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { useAppStore } from "@/app/app-store"
import { lerEstrutura } from "@/servicos/estrutura"
import type { EstruturaEstacionamento, TipoVaga, VagaEstrutura } from "@/types/estrutura"
import "./telao-page.css"

type VagaConhecida = VagaEstrutura & { andarId: string; andarNome: string; setorId: string; setorNome: string }
type Contagem = { livres: number; monitoradas: number; total: number; parcial: boolean }

const tipos: Array<{ codigo: TipoVaga; nome: string }> = [
  { codigo: "PCD", nome: "PCD" },
  { codigo: "IDOSO", nome: "Idoso" },
  { codigo: "ELETRICA", nome: "Elétrica" },
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
  const { consultar } = useAppStore()
  const { andarId } = useParams()
  const [estrutura, setEstrutura] = useState<EstruturaEstacionamento | null>(null)
  const [consultadoEm, setConsultadoEm] = useState<Date | null>(null)
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(true)

  const atualizar = useCallback(async () => {
    if (document.visibilityState !== "visible") return
    try {
      const resultado = lerEstrutura(await consultar("/estacionamento/estrutura"))
      setEstrutura(resultado)
      setConsultadoEm(new Date())
      setErro("")
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível atualizar as informações do estacionamento.")
    } finally {
      setCarregando(false)
    }
  }, [consultar])

  useEffect(() => {
    const primeiraConsulta = window.setTimeout(() => { void atualizar() }, 0)
    const intervalo = window.setInterval(() => { void atualizar() }, 30000)
    const aoRetornar = () => { if (document.visibilityState === "visible") void atualizar() }
    document.addEventListener("visibilitychange", aoRetornar)
    return () => {
      window.clearTimeout(primeiraConsulta)
      window.clearInterval(intervalo)
      document.removeEventListener("visibilitychange", aoRetornar)
    }
  }, [atualizar])

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
  const disponivel = !carregando && !erro && !semAndares && (!andarId || !!andarAtual)

  return (
    <main className="telao-vaggu" aria-label="Disponibilidade do estacionamento">
      <header className="telao-vaggu__topo">
        <img src="/assets/vaggu-logo-yellow.svg" alt="VAGGU" className="telao-vaggu__logo" />
        <h1>{estrutura?.shopping.nome ?? "Estacionamento"}{andarAtual && <span> · {andarAtual.nome}</span>}</h1>
      </header>
      <section className="telao-vaggu__principal" aria-label="Vagas disponíveis">
        <div className="telao-vaggu__total">
          <h2>Vagas disponíveis</h2>
          <strong>{disponivel && contagemGeral.monitoradas ? contagemGeral.livres : "—"}</strong>
        </div>
        <p className="telao-vaggu__mensagem">{erro ? "Informações temporariamente indisponíveis" : carregando ? "Atualizando disponibilidade" : "Siga a sinalização para o melhor acesso"}</p>
      </section>
      <section className="telao-vaggu__andares" aria-label={andarAtual ? "Vagas por setor" : "Vagas por andar"}>
        {disponivel && grupos.map(({ id, nome, contagem }) => {
          const proporcao = contagem.monitoradas ? contagem.livres / contagem.monitoradas : 0
          const tom = !contagem.monitoradas || contagem.parcial ? "parcial" : proporcao <= .2 ? "alta" : proporcao <= .5 ? "media" : "baixa"
          const rotulo = !contagem.monitoradas ? "Indisponível" : contagem.parcial ? "Dados parciais" : !contagem.livres ? "Lotado" : tom === "alta" ? "Poucas vagas" : tom === "media" ? "Vagas disponíveis" : "Maior disponibilidade"
          return <article className={"telao-vaggu__andar telao-vaggu__andar--" + tom} key={id}>
            <h2>{nome}</h2>
            <p><strong>{contagem.monitoradas ? contagem.livres : "—"}</strong><span>vagas livres</span></p>
            <span className="telao-vaggu__situacao">{rotulo}</span>
          </article>
        })}
        {!disponivel && <p className="telao-vaggu__indisponivel">{carregando ? "Aguarde um instante." : "Consulte a sinalização do estacionamento."}</p>}
      </section>
      <section className="telao-vaggu__categorias" aria-label="Vagas livres por categoria">
        <h2>Vagas por categoria</h2>
        <div>{porTipo.map(tipo => <div className="telao-vaggu__categoria" key={tipo.codigo}>
          <h3>{tipo.nome}</h3><strong>{disponivel && tipo.contagem.monitoradas ? tipo.contagem.livres : "—"}</strong>
        </div>)}</div>
      </section>
      <footer className="telao-vaggu__rodape">
        <span>{estrutura?.shopping.demonstracao ? "Dados de demonstração" : "Categorias especiais incluídas no total"}{disponivel && contagemGeral.parcial ? " · Disponibilidade parcial" : ""}</span>
        <span>{consultadoEm ? "Atualizado às " + consultadoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "Aguardando atualização"}</span>
      </footer>
    </main>
  )
}
