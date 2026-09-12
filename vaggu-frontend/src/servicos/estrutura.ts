/** Valida a estrutura recebida da API antes que mapa e formulários a utilizem. */
import { objeto } from "@/servicos/api"
import type { AndarEstrutura, EstruturaEstacionamento, SetorEstrutura, TipoVaga, VagaEstrutura } from "@/types/estrutura"

const tipos = new Set<TipoVaga>(["COMUM", "PCD", "IDOSO", "ELETRICA"])
const estados = new Set(["LIVRE", "OCUPADA", "DESCONHECIDA"])

function lerVaga(valor: unknown): VagaEstrutura {
  if (!objeto(valor) || typeof valor.id !== "string" || typeof valor.codigo !== "string" || typeof valor.tipo !== "string" || !tipos.has(valor.tipo as TipoVaga)
    || typeof valor.estadoAtual !== "string" || !estados.has(valor.estadoAtual) || typeof valor.ativo !== "boolean") throw new Error("A estrutura de vagas recebida é inválida.")
  let posicao = null
  if (objeto(valor.posicao)) {
    const p = valor.posicao
    if (![p.x, p.y, p.largura, p.altura, p.rotacao].every(numero => typeof numero === "number" && Number.isFinite(numero))) throw new Error("Uma posição do mapa é inválida.")
    posicao = { x: p.x as number, y: p.y as number, largura: p.largura as number, altura: p.altura as number, rotacao: p.rotacao as number }
  }
  return { id: valor.id, codigo: valor.codigo, tipo: valor.tipo as TipoVaga, estadoAtual: valor.estadoAtual as VagaEstrutura["estadoAtual"], ativo: valor.ativo, posicao }
}

/** Lê a árvore inteira e preserva a ordem devolvida pelo servidor. */
export function lerEstrutura(dados: unknown): EstruturaEstacionamento {
  if (!objeto(dados) || !objeto(dados.shopping) || typeof dados.shopping.id !== "string" || typeof dados.shopping.nome !== "string"
    || typeof dados.shopping.situacaoImplantacao !== "string" || !Array.isArray(dados.andares)) throw new Error("Não foi possível consultar a estrutura do estacionamento.")
  const andares: AndarEstrutura[] = dados.andares.map((andar: unknown) => {
    if (!objeto(andar) || typeof andar.id !== "string" || typeof andar.nome !== "string" || typeof andar.ordem !== "number"
      || typeof andar.revisaoMapa !== "number" || typeof andar.ativo !== "boolean" || !Array.isArray(andar.setores)) throw new Error("Um andar recebido é inválido.")
    const setores: SetorEstrutura[] = andar.setores.map((setor: unknown) => {
      if (!objeto(setor) || typeof setor.id !== "string" || typeof setor.nome !== "string" || typeof setor.ativo !== "boolean" || !Array.isArray(setor.vagas)) throw new Error("Um setor recebido é inválido.")
      return { id: setor.id, nome: setor.nome, ativo: setor.ativo, vagas: setor.vagas.map(lerVaga) }
    })
    return { id: andar.id, nome: andar.nome, ordem: andar.ordem, imagemMapa: typeof andar.imagemMapa === "string" ? andar.imagemMapa : null,
      revisaoMapa: andar.revisaoMapa, ativo: andar.ativo, setores }
  })
  return { shopping: dados.shopping as EstruturaEstacionamento["shopping"], andares }
}
