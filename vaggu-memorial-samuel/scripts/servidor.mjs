/** Serve o memorial localmente sem dependências ou acesso à rede externa. */
import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const pastaProjeto = resolve(fileURLToPath(new URL("..", import.meta.url)))
const tiposConteudo = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".woff2", "font/woff2"],
  [".webp", "image/webp"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".mp4", "video/mp4"],
])

function localizarArquivo(caminhoUrl) {
  const caminhoDecodificado = decodeURIComponent(caminhoUrl)
  if (caminhoDecodificado === "/") return resolve(pastaProjeto, "index.html")

  const caminhoRelativo = caminhoDecodificado.replace(/^\/+/, "")
  const caminhoPermitido = caminhoRelativo.startsWith("assets/") || caminhoRelativo.startsWith("src/")
  if (!caminhoPermitido) return null

  const baseArquivos = caminhoRelativo.startsWith("assets/") ? "public" : "."
  const arquivo = resolve(pastaProjeto, baseArquivos, caminhoRelativo)
  const relativoAoProjeto = relative(pastaProjeto, arquivo)

  if (relativoAoProjeto === ".." || relativoAoProjeto.startsWith(`..${sep}`)) return null
  return arquivo
}

const servidor = createServer(async (requisicao, resposta) => {
  if (requisicao.method !== "GET" && requisicao.method !== "HEAD") {
    resposta.writeHead(405, { Allow: "GET, HEAD" }).end("Método não permitido")
    return
  }

  let arquivo
  try {
    arquivo = localizarArquivo(new URL(requisicao.url ?? "/", "http://localhost").pathname)
  } catch {
    resposta.writeHead(400).end("Endereço inválido")
    return
  }

  if (!arquivo) {
    resposta.writeHead(403).end("Acesso negado")
    return
  }

  try {
    const informacao = await stat(arquivo)
    if (!informacao.isFile()) throw new Error("O caminho não corresponde a um arquivo")

    resposta.writeHead(200, {
      "Content-Length": informacao.size,
      "Content-Type": tiposConteudo.get(extname(arquivo)) ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": extname(arquivo) === ".html" ? "no-cache" : "public, max-age=3600",
    })

    if (requisicao.method === "HEAD") resposta.end()
    else createReadStream(arquivo).pipe(resposta)
  } catch {
    resposta.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Arquivo não encontrado")
  }
})

const porta = Number(process.env.PORT ?? 4173)
if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
  throw new Error("PORT precisa ser um número entre 1 e 65535.")
}

servidor.listen(porta, "127.0.0.1", () => {
  console.log(`Memorial disponível em http://127.0.0.1:${porta}`)
})
