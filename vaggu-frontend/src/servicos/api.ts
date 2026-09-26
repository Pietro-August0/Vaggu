/** Cliente da API na mesma origem; o navegador envia o cookie HttpOnly sem expor o token ao React. */
export class ErroApi extends Error {
  constructor(public codigo: string, mensagem: string, public status = 0) {
    super(mensagem)
  }
}

/** Mantém mensagens acionáveis para erros de configuração conhecidos do ambiente local. */
function mensagemErroApi(codigo: unknown, mensagem: unknown, status: number): string {
  return status < 500 && typeof mensagem === "string" ? mensagem : "Não foi possível conectar à VAGGU. Verifique sua conexão e tente novamente."
}

/** Distingue objetos JSON válidos de valores arbitrários recebidos pela rede. */
export function objeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor)
}

/** Impõe prazo, rejeita respostas inválidas e preserva o código de erro de domínio. */
export async function requisitarApi(
  caminho: string,
  token?: string,
  corpo?: unknown,
  metodo?: "GET" | "POST" | "PATCH" | "DELETE",
): Promise<unknown> {
  const controle = new AbortController()
  const prazo = window.setTimeout(() => controle.abort(), 15000)
  try {
    const resposta = await fetch("/api/v1" + caminho, {
      method: metodo ?? (corpo === undefined ? "GET" : "POST"),
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(corpo === undefined ? {} : { "Content-Type": "application/json" }), "X-VAGGU-Request": "1" },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      cache: "no-store",
      credentials: "same-origin",
      signal: controle.signal,
    })
    if (resposta.status === 204) return undefined
    const dados: unknown = await resposta.json().catch(() => null)
    if (!resposta.ok) {
      const erro = objeto(dados) && objeto(dados.erro) ? dados.erro : null
      throw new ErroApi(
        typeof erro?.codigo === "string" ? erro.codigo : "SERVICO_INDISPONIVEL",
        mensagemErroApi(erro?.codigo, erro?.mensagem, resposta.status),
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

/** Envia bytes de arquivos com a sessão HttpOnly, sem converter o conteúdo para JSON. */
export async function requisitarArquivoApi(
  caminho: string,
  arquivo: File,
  tipoConteudo: string,
): Promise<unknown> {
  const controle = new AbortController()
  const prazo = window.setTimeout(() => controle.abort(), 30000)
  try {
    const resposta = await fetch("/api/v1" + caminho, {
      method: "POST",
      headers: { "Content-Type": tipoConteudo, "X-VAGGU-Request": "1" },
      body: arquivo,
      cache: "no-store",
      credentials: "same-origin",
      signal: controle.signal,
    })
    const dados: unknown = await resposta.json().catch(() => null)
    if (!resposta.ok) {
      const erro = objeto(dados) && objeto(dados.erro) ? dados.erro : null
      throw new ErroApi(
        typeof erro?.codigo === "string" ? erro.codigo : "SERVICO_INDISPONIVEL",
        mensagemErroApi(erro?.codigo, erro?.mensagem, resposta.status),
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
