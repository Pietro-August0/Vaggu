/** Cliente da API na mesma origem. Tokens ficam apenas em memória e nunca são registrados. */
export class ErroApi extends Error {
  constructor(public codigo: string, mensagem: string, public status = 0) {
    super(mensagem)
  }
}

/** Mantém mensagens acionáveis para erros de configuração conhecidos do ambiente local. */
function mensagemErroApi(codigo: unknown, mensagem: unknown, status: number): string {
  if (codigo === "ARMAZENAMENTO_NAO_CONFIGURADO") return "A foto foi validada, mas o armazenamento de fotos não está configurado no backend. Defina BLOB_READ_WRITE_TOKEN para salvar a imagem."
  if (codigo === "FOTO_INVALIDA" || codigo === "FOTO_MUITO_GRANDE") return typeof mensagem === "string" ? mensagem : "A foto selecionada não atende aos formatos ou tamanho permitidos."
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
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(corpo === undefined ? {} : { "Content-Type": "application/json" }) },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
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

/** Envia bytes de CSV/XLSX sem converter o arquivo para JSON ou expor o token. */
export async function requisitarArquivoApi(
  caminho: string,
  token: string,
  arquivo: File,
  tipoConteudo: string,
): Promise<unknown> {
  const controle = new AbortController()
  const prazo = window.setTimeout(() => controle.abort(), 30000)
  try {
    const resposta = await fetch("/api/v1" + caminho, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": tipoConteudo },
      body: arquivo,
      cache: "no-store",
      credentials: "omit",
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
