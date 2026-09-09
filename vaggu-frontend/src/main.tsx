import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import "./index.css"
import { AppStoreProvider } from "@/app/app-store"
import { ProtectedRoute } from "@/components/protected-route"
import { Toaster } from "@/components/ui/sonner"
import { AdminPage } from "@/pages/admin-page"
import { LandingPage } from "@/pages/landing-page"
import { LoginPage } from "@/pages/login-page"
import { MallPanelPage } from "@/pages/mall-panel-page"

function App() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} path="/admin" />
      <Route element={<ProtectedRoute role="shopping"><MallPanelPage /></ProtectedRoute>} path="/painel" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <BrowserRouter>
        <AppStoreProvider>
          <App />
          <Toaster position="top-right" richColors />
        </AppStoreProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
