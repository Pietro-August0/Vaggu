/** Configurador do P04 para criar a hierarquia e salvar posições proporcionais no mapa. */
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { lerEstrutura } from "@/servicos/estrutura"
import type { EstruturaEstacionamento, PosicaoVaga, SituacaoImplantacao, TipoVaga } from "@/types/estrutura"

const situacoes: Array<[SituacaoImplantacao, string]> = [["EM_CONFIGURACAO", "Em configuração"], ["AGUARDANDO_INSTALACAO", "Aguardando instalação"], ["ATIVO", "Ativo"], ["EM_ANALISE", "Em análise"], ["DOCUMENTACAO_PENDENTE", "Documentação pendente"], ["APROVADO", "Aprovado"], ["INATIVO", "Inativo"], ["REJEITADO", "Rejeitado"], ["NOVO_ATENDIMENTO", "Novo atendimento"]]

/** Mantém formulários pequenos e atualiza a árvore sempre a partir da resposta do servidor. */
export function EstruturaAdmin({ shoppingId }: { shoppingId: string }) {
  const { consultar } = useAppStore(); const [estrutura, setEstrutura] = useState<EstruturaEstacionamento | null>(null)
  const [erro, setErro] = useState(""); const [mensagem, setMensagem] = useState(""); const [ocupado, setOcupado] = useState(false)
  const [andarMapaId, setAndarMapaId] = useState(""); const [posicoes, setPosicoes] = useState<Record<string, PosicaoVaga>>({})

  const carregar = useCallback(async () => { const valor = lerEstrutura(await consultar(`/shoppings/${shoppingId}/estrutura`)); setEstrutura(valor); setAndarMapaId(atual => valor.andares.some(a => a.id === atual) ? atual : valor.andares[0]?.id ?? "") }, [consultar, shoppingId])
  useEffect(() => { let ativo = true; consultar(`/shoppings/${shoppingId}/estrutura`).then(lerEstrutura).then(valor => { if (ativo) { setEstrutura(valor); setAndarMapaId(valor.andares[0]?.id ?? "") } }).catch(falha => { if (ativo) setErro(falha instanceof Error ? falha.message : "Falha ao consultar a estrutura.") }); return () => { ativo = false } }, [consultar, shoppingId])
  const andarMapa = estrutura?.andares.find(andar => andar.id === andarMapaId)
  const vagasMapa = useMemo(() => andarMapa?.setores.flatMap(setor => setor.vagas) ?? [], [andarMapa])
  useEffect(() => { if (!andarMapa) return; const grade: Record<string, PosicaoVaga> = {}; vagasMapa.forEach((vaga, indice) => { grade[vaga.id] = vaga.posicao ?? { x: 0.05 + (indice % 6) * 0.15, y: 0.08 + Math.floor(indice / 6) * 0.18, largura: 0.1, altura: 0.12, rotacao: 0 } }); queueMicrotask(() => setPosicoes(grade)) }, [andarMapa, vagasMapa])

  async function executar(tarefa: () => Promise<void>, sucesso: string) { setOcupado(true); setErro(""); setMensagem(""); try { await tarefa(); setMensagem(sucesso) } catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível concluir.") } finally { setOcupado(false) } }
  const dados = (evento: FormEvent<HTMLFormElement>) => { evento.preventDefault(); return { elemento: evento.currentTarget, valores: new FormData(evento.currentTarget) } }

  function criarAndar(evento: FormEvent<HTMLFormElement>) { const { elemento, valores } = dados(evento); void executar(async () => { await consultar(`/shoppings/${shoppingId}/andares`, { nome: valores.get("nome"), ordem: Number(valores.get("ordem")) }); elemento.reset(); await carregar() }, "Andar criado.") }
  function criarSetor(evento: FormEvent<HTMLFormElement>) { const { elemento, valores } = dados(evento); void executar(async () => { await consultar(`/andares/${valores.get("andarId")}/setores`, { nome: valores.get("nome") }); elemento.reset(); await carregar() }, "Setor criado.") }
  function criarVaga(evento: FormEvent<HTMLFormElement>) { const { elemento, valores } = dados(evento); void executar(async () => { await consultar(`/setores/${valores.get("setorId")}/vagas`, { codigo: valores.get("codigo"), tipo: valores.get("tipo") as TipoVaga }); elemento.reset(); await carregar() }, "Vaga criada.") }
  function salvarMapa() { if (!andarMapa) return; void executar(async () => { await consultar(`/andares/${andarMapa.id}/mapa`, { revisao: andarMapa.revisaoMapa, posicoes: vagasMapa.map(vaga => ({ vagaId: vaga.id, ...posicoes[vaga.id] })) }, "PATCH"); await carregar() }, "Mapa salvo.") }
  function mudarPosicao(vagaId: string, campo: keyof PosicaoVaga, valor: string) { setPosicoes(atuais => ({ ...atuais, [vagaId]: { ...atuais[vagaId], [campo]: Number(valor) } })) }
  function mudarSituacao(valor: SituacaoImplantacao) { void executar(async () => { await consultar(`/shoppings/${shoppingId}/implantacao`, { situacao: valor }, "PATCH"); await carregar() }, "Situação atualizada.") }

  if (!estrutura) return <div className="rounded-2xl bg-white p-6"><p role="status">Carregando estrutura...</p>{erro && <p role="alert" className="mt-2 text-red-700">{erro}</p>}</div>
  const setores = estrutura.andares.flatMap(andar => andar.setores.map(setor => ({ ...setor, andarNome: andar.nome })))
  return <div className="grid gap-6">
    <div className="rounded-2xl bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Estrutura do estacionamento</h2><p className="mt-1 text-sm text-neutral-600">{estrutura.andares.length} andar(es) · {setores.length} setor(es)</p></div><div><Label htmlFor="situacao">Implantação</Label><select id="situacao" className="ml-3 rounded-md border bg-white px-3 py-2" value={estrutura.shopping.situacaoImplantacao} disabled={ocupado} onChange={evento => mudarSituacao(evento.target.value as SituacaoImplantacao)}>{situacoes.map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}</select></div></div>{erro && <p role="alert" className="mt-4 text-red-700">{erro}</p>}{mensagem && <p role="status" className="mt-4 text-green-700">{mensagem}</p>}</div>
    <div className="grid gap-4 lg:grid-cols-3">
      <form className="rounded-2xl bg-white p-5" onSubmit={criarAndar}><h3 className="font-semibold">Novo andar</h3><Label className="mt-4" htmlFor="andar-nome">Nome</Label><Input id="andar-nome" name="nome" required maxLength={120}/><Label className="mt-3" htmlFor="andar-ordem">Ordem</Label><Input id="andar-ordem" name="ordem" type="number" min={0} max={999} required/><Button className="mt-4" disabled={ocupado}>Criar andar</Button></form>
      <form className="rounded-2xl bg-white p-5" onSubmit={criarSetor}><h3 className="font-semibold">Novo setor</h3><Label className="mt-4" htmlFor="setor-andar">Andar</Label><select id="setor-andar" name="andarId" className="w-full rounded-md border bg-white px-3 py-2" required>{estrutura.andares.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}</select><Label className="mt-3" htmlFor="setor-nome">Nome</Label><Input id="setor-nome" name="nome" required maxLength={120}/><Button className="mt-4" disabled={ocupado || !estrutura.andares.length}>Criar setor</Button></form>
      <form className="rounded-2xl bg-white p-5" onSubmit={criarVaga}><h3 className="font-semibold">Nova vaga</h3><Label className="mt-4" htmlFor="vaga-setor">Setor</Label><select id="vaga-setor" name="setorId" className="w-full rounded-md border bg-white px-3 py-2" required>{setores.map(s => <option key={s.id} value={s.id}>{s.andarNome} · {s.nome}</option>)}</select><div className="mt-3 flex gap-2"><div><Label htmlFor="vaga-codigo">Código</Label><Input id="vaga-codigo" name="codigo" required maxLength={40}/></div><div><Label htmlFor="vaga-tipo">Tipo</Label><select id="vaga-tipo" name="tipo" className="w-full rounded-md border bg-white px-3 py-2">{["COMUM","PCD","IDOSO","ELETRICA"].map(t => <option key={t}>{t}</option>)}</select></div></div><Button className="mt-4" disabled={ocupado || !setores.length}>Criar vaga</Button></form>
    </div>
    {estrutura.andares.length > 0 && <div className="rounded-2xl bg-white p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><Label htmlFor="andar-mapa">Mapa do andar</Label><select id="andar-mapa" className="ml-3 rounded-md border bg-white px-3 py-2" value={andarMapaId} onChange={e => setAndarMapaId(e.target.value)}>{estrutura.andares.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}</select></div><Button disabled={ocupado || !vagasMapa.length} onClick={salvarMapa}>Salvar posições · revisão {andarMapa?.revisaoMapa}</Button></div>
      {vagasMapa.length === 0 ? <p className="mt-5 text-neutral-600">Crie setores e vagas neste andar para montar o mapa.</p> : <div className="mt-5 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left"><th>Vaga</th><th>X</th><th>Y</th><th>Largura</th><th>Altura</th><th>Rotação</th></tr></thead><tbody>{vagasMapa.map(vaga => <tr key={vaga.id} className="border-t"><td className="py-2 font-medium">{vaga.codigo} · {vaga.tipo}</td>{(["x","y","largura","altura","rotacao"] as Array<keyof PosicaoVaga>).map(campo => <td key={campo} className="p-1"><Input className="min-w-24" type="number" step={campo === "rotacao" ? 1 : 0.01} min={campo === "rotacao" ? -360 : 0} max={campo === "rotacao" ? 360 : 1} value={posicoes[vaga.id]?.[campo] ?? 0} onChange={e => mudarPosicao(vaga.id, campo, e.target.value)}/></td>)}</tr>)}</tbody></table></div>}
    </div>}
  </div>
}
