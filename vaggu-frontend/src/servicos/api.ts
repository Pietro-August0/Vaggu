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

/** Baixa uma imagem privada usando a sessão em memória, sem colocar token na URL. */
export async function requisitarImagemApi(caminho: string, token: string): Promise<Blob> {
  const controle = new AbortController()
  const prazo = window.setTimeout(() => controle.abort(), 15000)
  try {
    const resposta = await fetch("/api/v1" + caminho, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      credentials: "omit",
      signal: controle.signal,
    })
    if (!resposta.ok) {
      const dados: unknown = await resposta.json().catch(() => null)
      const erro = objeto(dados) && objeto(dados.erro) ? dados.erro : null
      throw new ErroApi(
        typeof erro?.codigo === "string" ? erro.codigo : "SERVICO_INDISPONIVEL",
        resposta.status < 500 && typeof erro?.mensagem === "string"
          ? erro.mensagem : "Não foi possível carregar a foto do shopping.",
        resposta.status,
      )
    }
    const tipo = resposta.headers.get("content-type")?.split(";", 1)[0] ?? ""
    if (!["image/jpeg", "image/png", "image/webp"].includes(tipo)) {
      throw new ErroApi("RESPOSTA_INVALIDA", "A foto recebida possui formato inválido.")
    }
    const imagem = await resposta.blob()
    if (imagem.size === 0 || imagem.size > 2 * 1024 * 1024) {
      throw new ErroApi("RESPOSTA_INVALIDA", "A foto recebida possui tamanho inválido.")
    }
    return imagem
  } catch (erro) {
    if (erro instanceof ErroApi) throw erro
    throw new ErroApi("SEM_CONEXAO", "Não foi possível carregar a foto do shopping.")
  } finally {
    window.clearTimeout(prazo)
  }
}
