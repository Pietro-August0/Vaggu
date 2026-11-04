import { createReadStream, cpSync, existsSync, mkdirSync, statSync } from "node:fs"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const memorialRoot = path.resolve(import.meta.dirname, "../vaggu-memorial-samuel")
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

function localizarArquivoMemorial(caminhoUrl: string) {
  let caminho: string
  try {
    caminho = decodeURIComponent(new URL(caminhoUrl, "http://localhost").pathname)
  } catch {
    return null
  }

  if (caminho === "/" || caminho === "/index.html") return path.resolve(memorialRoot, "index.html")

  const caminhoRelativo = caminho.replace(/^\/+/, "")
  const baseArquivos = caminhoRelativo.startsWith("assets/")
    ? "public"
    : caminhoRelativo.startsWith("src/")
      ? "."
      : null
  if (!baseArquivos) return null

  const arquivo = path.resolve(memorialRoot, baseArquivos, caminhoRelativo)
  const relativoAoProjeto = path.relative(memorialRoot, arquivo)
  if (relativoAoProjeto === ".." || relativoAoProjeto.startsWith(`..${path.sep}`)) return null
  return arquivo
}

function publicarMemorial(): Plugin {
  return {
    name: "vaggu-memorial",
    configureServer(server) {
      server.middlewares.use((requisicao, resposta, proximo) => {
        const url = new URL(requisicao.url ?? "/", "http://localhost")
        if (url.pathname !== "/memorial" && !url.pathname.startsWith("/memorial/")) {
          proximo()
          return
        }
        if (url.pathname === "/memorial") {
          proximo()
          return
        }

        if (requisicao.method !== "GET" && requisicao.method !== "HEAD") {
          resposta.writeHead(405, { Allow: "GET, HEAD" }).end("Método não permitido")
          return
        }

        const caminhoMemorial = `${url.pathname.slice("/memorial".length)}${url.search}`
        const arquivo = localizarArquivoMemorial(caminhoMemorial)
        if (!arquivo || !existsSync(arquivo) || !statSync(arquivo).isFile()) {
          resposta.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Arquivo não encontrado")
          return
        }

        const informacao = statSync(arquivo)
        const extensao = path.extname(arquivo)
        resposta.writeHead(200, {
          "Content-Length": informacao.size,
          "Content-Type": tiposConteudo.get(extensao) ?? "application/octet-stream",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": [".html", ".css", ".js"].includes(extensao) ? "no-cache" : "public, max-age=3600",
        })

        if (requisicao.method === "HEAD") {
          resposta.end()
          return
        }

        const fluxo = createReadStream(arquivo)
        fluxo.on("error", proximo)
        fluxo.pipe(resposta)
      })
    },
    writeBundle(opcoes) {
      const diretorioSaida = opcoes.dir ?? path.resolve(import.meta.dirname, "dist")
      const diretorioMemorial = path.resolve(diretorioSaida, "memorial")
      mkdirSync(diretorioMemorial, { recursive: true })
      cpSync(path.resolve(memorialRoot, "index.html"), path.resolve(diretorioMemorial, "index.html"))
      cpSync(path.resolve(memorialRoot, "src"), path.resolve(diretorioMemorial, "src"), { recursive: true })
      cpSync(path.resolve(memorialRoot, "public/assets"), path.resolve(diretorioMemorial, "assets"), { recursive: true })
    },
  }
}

export default defineConfig({
  plugins: [publicarMemorial(), react(), tailwindcss()],
  server: { proxy: { "/api": { target: process.env.API_PROXY_TARGET || "http://127.0.0.1:3000", changeOrigin: true } } },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
