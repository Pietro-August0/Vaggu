// Configura a interface e o proxy da API; polling é opcional para volumes do Docker Desktop.
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: process.env.VAGGU_POLLING === "true" ? { usePolling: true, interval: 500 } : undefined,
    proxy: { "/api": { target: process.env.API_PROXY_TARGET || "http://127.0.0.1:3000", changeOrigin: true } },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
