/** Exibe agregados confirmados para prévia autenticada dos telões. */

import { TelaoApresentacao } from "@/components/telao-apresentacao"
import { useParams } from "react-router-dom"

import { useEstruturaAtualizada } from "@/hooks/use-estrutura-atualizada"

import type { EstruturaEstacionamento, TipoVaga, VagaEstrutura } from "@/types/estrutura"
import "./telao-page.css"

type VagaConhecida = VagaEstrutura & { andarId: string; andarNome: string; setorId: string; setorNome: string }
type Contagem = { livres: number; monitoradas: number; total: number; parcial: boolean }

const tipos: TipoVaga[] = ["PCD", "IDOSO", "ELETRICA"]

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
  const { estrutura, erro, vencida } = useEstruturaAtualizada("/estacionamento/estrutura")
  const carregando = !estrutura && !erro
  const vagas = estrutura ? vagasDaEstrutura(estrutura) : []
  const andares = estrutura?.andares.filter(andar => andar.ativo) ?? []
  const andarAtual = andares.find(andar => andar.id === andarId)
  const escopo = andarId ? vagas.filter(vaga => vaga.andarId === andarAtual?.id) : vagas
  const contagemGeral = contar(escopo)
  const porTipo = tipos.map(tipo => ({ tipo, ...contar(escopo.filter(vaga => vaga.tipo === tipo)) }))
  const porAndar = andares.map(andar => ({ andar, contagem: contar(vagas.filter(vaga => vaga.andarId === andar.id)) }))
  const porSetor = andarAtual?.setores.filter(setor => setor.ativo).map(setor => ({
    setor, contagem: contar(vagas.filter(vaga => vaga.setorId === setor.id)),
  })) ?? []
  const semAndares = estrutura !== null && andares.length === 0

  const grupos = andarAtual
    ? porSetor.map(({ setor, contagem }) => ({ id: setor.id, nome: setor.nome, contagem }))
    : andarId ? [] : porAndar.map(({ andar, contagem }) => ({ id: andar.id, nome: andar.nome, contagem }))
  const disponivel = !carregando && !erro && !vencida && !semAndares && (!andarId || !!andarAtual)

  return <TelaoApresentacao
    key={andarId ?? "geral"}
    shopping={estrutura?.shopping.nome ?? "Estacionamento"}
    escopo={andarAtual?.nome ?? (andarId ? "Andar indisponível" : "Visão geral")}
    porAndar={!!andarId}
    contagem={contagemGeral}
    grupos={grupos.map(g => ({ nome: g.nome, ...g.contagem }))}
    categorias={porTipo}
    disponivel={disponivel}
    demonstracao={estrutura?.shopping.demonstracao}
    retorno="/painel/teloes"
  />
}
