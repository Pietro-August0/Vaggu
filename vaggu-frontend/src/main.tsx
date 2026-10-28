import { TelaoInstaladoPage } from "@/pages/telao-instalado-page"
/** Inicializa o React e reúne tema, navegação, mensagens e sessão autenticada das páginas. */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { createBrowserRouter, RouterProvider, Route, Routes } from "react-router-dom"
import { MotionConfig } from "motion/react"

import "./index.css"
import { AppStoreProvider } from "@/app/app-store"
import { ProtectedRoute } from "@/components/protected-route"
import { Toaster } from "@/components/ui/sonner"
import { AreaAutenticada } from "@/pages/area-autenticada"
import { AdminPage } from "@/pages/admin-page"
import { TrocarSenhaPage } from "@/pages/trocar-senha-page"
import { LandingPage } from "@/pages/landing-page"
import { LoginPage } from "@/pages/login-page"
import { PrivacidadePage } from "@/pages/privacidade-page"
import { PaginaNaoEncontrada } from "@/pages/pagina-nao-encontrada"
import { TeloesPage } from "@/pages/teloes-page"
import { TelaoPage } from "@/pages/telao-page"

/** Define as rotas públicas, a troca obrigatória e os destinos por perfil validados pela API. */
function App() {
  return (
    <Routes>
      <Route element={<TelaoInstaladoPage />} path="/telao/:telaoId" />
      <Route element={<LandingPage />} path="/" />
      <Route element={<PrivacidadePage />} path="/privacidade" />
      <Route element={<PrivacidadePage exclusao />} path="/exclusao-de-dados" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<TrocarSenhaPage />} path="/trocar-senha" />
      <Route element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} path="/admin" />
      <Route element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} path="/admin/cadastrar" />
      <Route element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} path="/admin/conta" />
      <Route element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} path="/admin/shoppings" />
      <Route element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} path="/admin/shoppings/:shoppingId" />
      <Route element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} path="/admin/shoppings/:shoppingId/estrutura" />
      <Route element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} path="/admin/shoppings/:shoppingId/gerentes" />
      <Route element={<ProtectedRoute role="shopping"><AreaAutenticada /></ProtectedRoute>} path="/painel" />
      <Route element={<ProtectedRoute role="shopping"><AreaAutenticada /></ProtectedRoute>} path="/painel/analise" />
      <Route element={<ProtectedRoute role="shopping"><AreaAutenticada /></ProtectedRoute>} path="/painel/conta" />
      <Route element={<ProtectedRoute role="shopping"><TeloesPage /></ProtectedRoute>} path="/painel/teloes" />
      <Route element={<ProtectedRoute role="shopping"><TelaoPage /></ProtectedRoute>} path="/painel/telao" />
      <Route element={<ProtectedRoute role="shopping"><TelaoPage /></ProtectedRoute>} path="/painel/telao/andares/:andarId" />
      <Route element={<PaginaNaoEncontrada />} path="*" />
    </Routes>
  )
}

const router = createBrowserRouter([{ path: "*", element: <AppStoreProvider><App /><Toaster position="top-right" richColors /></AppStoreProvider> }])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>,
)
