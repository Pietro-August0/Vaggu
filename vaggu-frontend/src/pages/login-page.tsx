import { ArrowLeft, Eye, EyeOff, Info, LockKeyhole, UserRoundCog } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import { useAppStore } from "@/app/app-store"
import { Brand } from "@/components/brand"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DEMO_ACCOUNTS } from "@/lib/constants"

export function LoginPage() {
  const { currentUser, login, ready } = useAppStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (ready && currentUser) {
    return <Navigate replace to={currentUser.role === "admin" ? "/admin" : "/painel"} />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const user = await login(email, password)
      if (!user) {
        setError("E-mail ou senha inválidos. Confira os dados e tente novamente.")
        return
      }

      navigate(user.role === "admin" ? "/admin" : "/painel", { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  function fillDemoAccount(account: (typeof DEMO_ACCOUNTS)[keyof typeof DEMO_ACCOUNTS]) {
    setEmail(account.email)
    setPassword(account.password)
    setError("")
  }

  return (
    <main className="grid min-h-screen bg-neutral-950 lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <img alt="Movimento urbano com trem amarelo" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" src="/assets/hero-vaggu.png" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/65" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <Brand inverted />
          <div className="max-w-xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#ffe100]">Acesso seguro</p>
            <h1 className="mt-5 font-heading text-6xl font-black leading-[0.94] tracking-[-0.055em] xl:text-7xl">
              Tudo pronto para você acompanhar.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
              Sua conta chega configurada pela equipe VAGGU. Entre para consultar os dados do shopping e o status da conexão.
            </p>
          </div>
          <p className="text-sm text-white/45">Gestão inteligente de estacionamentos</p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-[#f5f5f3] px-4 py-10 sm:px-8">
        <div className="w-full max-w-lg">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Brand />
            <Button asChild size="sm" variant="ghost">
              <Link to="/">
                <ArrowLeft aria-hidden="true" />
                Voltar
              </Link>
            </Button>
          </div>

          <Card className="rounded-[2rem] border-black/5 bg-white shadow-2xl shadow-black/8">
            <CardHeader className="px-6 pt-7 sm:px-9 sm:pt-9">
              <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#ffe100]">
                <LockKeyhole className="size-6" aria-hidden="true" />
              </div>
              <CardTitle className="font-heading text-3xl font-black tracking-[-0.04em]">Acesse a VAGGU</CardTitle>
              <CardDescription className="text-base">
                Use o login enviado pela equipe. Não há cadastro pelo site.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-7 sm:px-9 sm:pb-9">
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">E-mail corporativo</FieldLabel>
                    <Input
                      autoComplete="email"
                      id="email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="voce@shopping.com.br"
                      required
                      type="email"
                      value={email}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <div className="relative">
                      <Input
                        autoComplete="current-password"
                        className="pr-12"
                        id="password"
                        minLength={8}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                      />
                      <Button
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword((value) => !value)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                      </Button>
                    </div>
                    <FieldDescription>Problemas com o acesso? Fale com a equipe VAGGU.</FieldDescription>
                  </Field>

                  {error && (
                    <Alert variant="destructive">
                      <Info aria-hidden="true" />
                      <AlertTitle>Não foi possível entrar</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button className="h-12 w-full rounded-full bg-neutral-950 font-black text-white hover:bg-neutral-800" disabled={!ready || submitting} type="submit">
                    {submitting ? "Entrando..." : "Entrar no painel"}
                  </Button>
                </FieldGroup>
              </form>

              <div className="mt-8 border-t border-black/8 pt-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-neutral-500">
                  <UserRoundCog className="size-4" aria-hidden="true" />
                  Acessos da demonstração
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button className="h-auto justify-start rounded-xl px-3 py-3 text-left" onClick={() => fillDemoAccount(DEMO_ACCOUNTS.admin)} type="button" variant="outline">
                    <span>
                      <span className="block text-xs text-neutral-500">Admin VAGGU</span>
                      <span className="block text-xs font-bold">Preencher acesso</span>
                    </span>
                  </Button>
                  <Button className="h-auto justify-start rounded-xl px-3 py-3 text-left" onClick={() => fillDemoAccount(DEMO_ACCOUNTS.shopping)} type="button" variant="outline">
                    <span>
                      <span className="block text-xs text-neutral-500">Shopping</span>
                      <span className="block text-xs font-bold">Preencher acesso</span>
                    </span>
                  </Button>
                </div>
                <details className="mt-3 rounded-xl bg-neutral-100 px-4 py-3 text-xs text-neutral-600">
                  <summary className="cursor-pointer font-bold text-neutral-800">Ver credenciais do protótipo</summary>
                  <div className="mt-3 space-y-2 break-all">
                    <p><strong>Admin:</strong> {DEMO_ACCOUNTS.admin.email} / {DEMO_ACCOUNTS.admin.password}</p>
                    <p><strong>Shopping:</strong> {DEMO_ACCOUNTS.shopping.email} / {DEMO_ACCOUNTS.shopping.password}</p>
                  </div>
                </details>
              </div>
            </CardContent>
          </Card>

          <Button asChild className="mx-auto mt-5 hidden text-neutral-600 lg:flex" variant="ghost">
            <Link to="/">
              <ArrowLeft aria-hidden="true" />
              Voltar para o site
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
