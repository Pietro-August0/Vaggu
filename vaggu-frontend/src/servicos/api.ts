/** Cliente da API na mesma origem. Tokens ficam apenas em memória e nunca são registrados. */
export class ErroApi extends Error {
  constructor(public codigo: string, mensagem: string, public status = 0) {
    super(mensagem)
  }
}

/** Distingue objetos JSON válidos de valores arbitrários recebidos pela rede. */
export function objeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor)
}

/** Executa transportes JSON ou binários com o mesmo prazo e contrato seguro de erro. */
async function executarRequisicao(caminho: string, token: string | undefined, opcoes: RequestInit): Promise<unknown> {
  const controle = new AbortController()
  const prazo = window.setTimeout(() => controle.abort(), 15000)
  try {
    const resposta = await fetch("/api/v1" + caminho, {
      ...opcoes,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opcoes.headers },
      cache: "no-store",
      credentials: "omit",
      signal: controle.signal,
    })
    if (resposta.status === 204) return undefined
    const dados: unknown = await resposta.json().catch(() => null)
    if (!resposta.ok) {
      const erro = objeto(dados) && objeto(dados.erro) ? dados.erro : null
      throw new ErroApi(
        typeof erro?.codigo === "string" ? erro.codigo : "SERVICO_INDISPONIVEL",
        resposta.status < 500 && typeof erro?.mensagem === "string"
          ? erro.mensagem : "Não foi possível conectar à VAGGU. Tente novamente em instantes.",
        resposta.status,
      )
    }
    if (!objeto(dados)) throw new ErroApi("RESPOSTA_INVALIDA", "Não foi possível confirmar os dados recebidos. Tente novamente.")
    return dados
  } catch (erro) {
    if (erro instanceof ErroApi) throw erro
    throw new ErroApi("SEM_CONEXAO", "Não foi possível conectar à VAGGU. Verifique sua conexão e tente novamente.")
  } finally {
    window.clearTimeout(prazo)
  }
}

/** Impõe prazo, rejeita respostas inválidas e preserva o código de erro de domínio. */
export function requisitarApi(
  caminho: string,
  token?: string,
  corpo?: unknown,
  metodo?: "GET" | "POST" | "PATCH" | "DELETE",
): Promise<unknown> {
  return executarRequisicao(caminho, token, {
    method: metodo ?? (corpo === undefined ? "GET" : "POST"),
    headers: corpo === undefined ? {} : { "Content-Type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  })
}

/** Envia o arquivo original somente à rota administrativa de prévia, sem convertê-lo em JSON. */
export function requisitarArquivoApi(caminho: string, token: string, arquivo: File): Promise<unknown> {
  const csv = arquivo.name.toLocaleLowerCase("pt-BR").endsWith(".csv")
  return executarRequisicao(caminho, token, {
    method: "POST",
    headers: { "Content-Type": csv ? "text/csv;charset=UTF-8" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    body: arquivo,
  })
}
