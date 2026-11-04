/** Consulta o ViaCEP e entrega apenas os campos de endereço usados no cadastro. */
export interface EnderecoPorCep {
  logradouro: string
  bairro: string
  cidade: string
  uf: string
}

export class ErroCep extends Error {
  constructor(public codigo: "INVALIDO" | "NAO_ENCONTRADO" | "INDISPONIVEL", mensagem: string) {
    super(mensagem)
  }
}

/** Normaliza o CEP e distingue formato inválido de ausência na base pública. */
export async function buscarEnderecoPorCep(cep: string, sinal?: AbortSignal): Promise<EnderecoPorCep> {
  const digitos = cep.replace(/\D/g, "")
  if (!/^\d{8}$/.test(digitos)) throw new ErroCep("INVALIDO", "Informe um CEP válido com 8 números.")
  try {
    const sinalConsulta = sinal ? AbortSignal.any([sinal, AbortSignal.timeout(8000)]) : AbortSignal.timeout(8000)
    const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`, { signal: sinalConsulta })
    if (!resposta.ok) throw new Error("Consulta indisponível")
    const dados: unknown = await resposta.json()
    if (typeof dados !== "object" || dados === null || Array.isArray(dados)) throw new Error("Resposta inválida")
    const endereco = dados as Record<string, unknown>
    if (endereco.erro === true) throw new ErroCep("NAO_ENCONTRADO", "CEP não encontrado.")
    if (typeof endereco.localidade !== "string" || typeof endereco.uf !== "string") throw new Error("Resposta inválida")
    return {
      logradouro: typeof endereco.logradouro === "string" ? endereco.logradouro : "",
      bairro: typeof endereco.bairro === "string" ? endereco.bairro : "",
      cidade: endereco.localidade,
      uf: endereco.uf,
    }
  } catch (erro) {
    if (erro instanceof ErroCep || (erro instanceof DOMException && erro.name === "AbortError")) throw erro
    throw new ErroCep("INDISPONIVEL", "Não foi possível buscar o endereço automaticamente. Preencha o endereço manualmente.")
  }
}
