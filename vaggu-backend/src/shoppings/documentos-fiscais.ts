export function normalizarCpf(valor: string): string | null {
  const texto = valor.trim()
  if (!/^(?:[0-9]{11}|[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2})$/.test(texto)) return null
  const cpf = texto.replace(/[.-]/g, "")
  if (/^([0-9])\1+$/.test(cpf)) return null
  for (const tamanho of [9, 10]) {
    const soma = Array.from(cpf.slice(0, tamanho)).reduce((total, digito, indice) =>
      total + Number(digito) * (tamanho + 1 - indice), 0)
    const verificador = (soma * 10) % 11 % 10
    if (verificador !== Number(cpf[tamanho])) return null
  }
  return cpf
}

export function normalizarCnpj(valor: string): string | null {
  const texto = valor.trim()
  if (!/^(?:[A-Za-z0-9]{12}[0-9]{2}|[A-Za-z0-9]{2}\.[A-Za-z0-9]{3}\.[A-Za-z0-9]{3}\/[A-Za-z0-9]{4}-[0-9]{2})$/.test(texto)) return null
  const cnpj = texto.replace(/[./-]/g, "").toUpperCase()
  if (/^([0-9])\1+$/.test(cnpj)) return null
  for (const tamanho of [12, 13]) {
    // A Receita Federal usa o código ASCII menos 48 e pesos de 2 a 9 da direita para a esquerda.
    const soma = Array.from(cnpj.slice(0, tamanho)).reduce((total, caractere, indice) =>
      total + (caractere.charCodeAt(0) - 48) * (2 + (tamanho - 1 - indice) % 8), 0)
    const resto = soma % 11
    if ((resto < 2 ? 0 : 11 - resto) !== Number(cnpj[tamanho])) return null
  }
  return cnpj
}
