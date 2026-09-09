import {
  Building2,
  Check,
  Copy,
  KeyRound,
  Plus,
  RadioTower,
  ShieldCheck,
} from "lucide-react"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { useAppStore } from "@/app/app-store"
import { DashboardShell } from "@/components/dashboard-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { GeneratedAccess, NewMallInput } from "@/types/app"

const emptyForm: NewMallInput = {
  name: "",
  cnpj: "",
  address: "",
  managerName: "",
  managerEmail: "",
  managerPhone: "",
  totalSpaces: 0,
}

export function AdminPage() {
  const { malls, createMall } = useAppStore()
  const [form, setForm] = useState<NewMallInput>(emptyForm)
  const [formOpen, setFormOpen] = useState(false)
  const [generatedAccess, setGeneratedAccess] = useState<GeneratedAccess | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [copied, setCopied] = useState(false)

  const awaitingSensors = malls.filter((mall) => !mall.sensorsConnected).length

  function updateField<K extends keyof NewMallInput>(key: K, value: NewMallInput[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError("")
    setSubmitting(true)

    try {
      const result = await createMall({
        ...form,
        name: form.name.trim(),
        cnpj: form.cnpj.trim(),
        address: form.address.trim(),
        managerName: form.managerName.trim(),
        managerEmail: form.managerEmail.trim(),
        managerPhone: form.managerPhone.trim(),
        totalSpaces: Number(form.totalSpaces),
      })
      setGeneratedAccess(result)
      setForm(emptyForm)
      setFormOpen(false)
      toast.success("Shopping cadastrado e acesso gerado.")
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Não foi possível cadastrar o shopping.")
    } finally {
      setSubmitting(false)
    }
  }

  async function copyCredentials() {
    if (!generatedAccess) return

    const value = `Acesso VAGGU\nShopping: ${generatedAccess.mall.name}\nLogin: ${generatedAccess.email}\nSenha temporária: ${generatedAccess.temporaryPassword}`
    await navigator.clipboard.writeText(value)
    setCopied(true)
    toast.success("Credenciais copiadas.")
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardShell eyebrow="Operação interna" title="Gestão de shoppings">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-black/5 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid size-12 place-items-center rounded-2xl bg-[#ffe100]"><Building2 aria-hidden="true" /></div>
              <div><p className="text-sm text-neutral-500">Shoppings criados</p><p className="text-3xl font-black">{malls.length}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-black/5 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid size-12 place-items-center rounded-2xl bg-neutral-950 text-[#ffe100]"><RadioTower aria-hidden="true" /></div>
              <div><p className="text-sm text-neutral-500">Aguardando sensores</p><p className="text-3xl font-black">{awaitingSensors}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-black/5 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><ShieldCheck aria-hidden="true" /></div>
              <div><p className="text-sm text-neutral-500">Acessos preparados</p><p className="text-3xl font-black">{malls.length}</p></div>
            </CardContent>
          </Card>
        </section>

        <Card className="overflow-hidden rounded-[1.75rem] border-black/5 shadow-none">
          <CardHeader className="flex flex-col gap-5 border-b border-black/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-heading text-2xl font-black tracking-tight">Shoppings cadastrados</CardTitle>
              <CardDescription>Cadastre os dados recebidos pela equipe e gere o acesso do cliente.</CardDescription>
            </div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <Button className="h-11 rounded-full bg-[#ffe100] px-5 font-black text-black hover:bg-[#f2d500]">
                  <Plus aria-hidden="true" />
                  Novo shopping
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl font-black">Cadastrar shopping</DialogTitle>
                  <DialogDescription>
                    Insira os dados enviados à VAGGU. O cliente receberá um login já vinculado ao shopping.
                  </DialogDescription>
                </DialogHeader>
                <form className="mt-2" onSubmit={handleSubmit}>
                  <FieldGroup>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="mall-name">Nome do shopping</FieldLabel>
                        <Input id="mall-name" onChange={(event) => updateField("name", event.target.value)} required value={form.name} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="cnpj">CNPJ</FieldLabel>
                        <Input id="cnpj" inputMode="numeric" onChange={(event) => updateField("cnpj", event.target.value)} placeholder="00.000.000/0000-00" required value={form.cnpj} />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="address">Endereço</FieldLabel>
                      <Input id="address" onChange={(event) => updateField("address", event.target.value)} required value={form.address} />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="manager-name">Responsável</FieldLabel>
                        <Input id="manager-name" onChange={(event) => updateField("managerName", event.target.value)} required value={form.managerName} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="manager-phone">WhatsApp do responsável</FieldLabel>
                        <Input id="manager-phone" onChange={(event) => updateField("managerPhone", event.target.value)} required type="tel" value={form.managerPhone} />
                      </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="manager-email">E-mail para o login</FieldLabel>
                        <Input autoComplete="off" id="manager-email" onChange={(event) => updateField("managerEmail", event.target.value)} required type="email" value={form.managerEmail} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="total-spaces">Total previsto de vagas</FieldLabel>
                        <Input id="total-spaces" min={1} onChange={(event) => updateField("totalSpaces", Number(event.target.value))} required type="number" value={form.totalSpaces || ""} />
                      </Field>
                    </div>

                    {formError && (
                      <Alert variant="destructive">
                        <AlertTitle>Revise o cadastro</AlertTitle>
                        <AlertDescription>{formError}</AlertDescription>
                      </Alert>
                    )}

                    <DialogFooter>
                      <Button onClick={() => setFormOpen(false)} type="button" variant="outline">Cancelar</Button>
                      <Button className="bg-neutral-950 text-white hover:bg-neutral-800" disabled={submitting} type="submit">
                        <KeyRound aria-hidden="true" />
                        {submitting ? "Gerando acesso..." : "Cadastrar e gerar acesso"}
                      </Button>
                    </DialogFooter>
                  </FieldGroup>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shopping</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Vagas previstas</TableHead>
                    <TableHead>Sensores</TableHead>
                    <TableHead>Insights</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {malls.map((mall) => (
                    <TableRow key={mall.id}>
                      <TableCell className="min-w-56 py-4">
                        <p className="font-bold">{mall.name}</p>
                        <p className="text-xs text-neutral-500">{mall.cnpj}</p>
                      </TableCell>
                      <TableCell className="min-w-56">
                        <p>{mall.managerName}</p>
                        <p className="text-xs text-neutral-500">{mall.managerEmail}</p>
                      </TableCell>
                      <TableCell>{mall.totalSpaces.toLocaleString("pt-BR")}</TableCell>
                      <TableCell><Badge className="bg-amber-100 text-amber-900" variant="secondary">Aguardando conexão</Badge></TableCell>
                      <TableCell><Badge variant="outline">Inativos</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Alert className="rounded-2xl border-amber-300 bg-amber-50">
          <RadioTower aria-hidden="true" />
          <AlertTitle>Ativação depende da instalação real</AlertTitle>
          <AlertDescription>
            Este MVP não oferece um botão para simular sensores. Os insights só serão liberados quando a integração com os dispositivos das vagas estiver implementada.
          </AlertDescription>
        </Alert>
      </div>

      <Dialog open={Boolean(generatedAccess)} onOpenChange={(open) => !open && setGeneratedAccess(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-black">Acesso gerado com sucesso</DialogTitle>
            <DialogDescription>
              Demonstração local: use estas credenciais neste mesmo navegador para validar o fluxo.
            </DialogDescription>
          </DialogHeader>
          {generatedAccess && (
            <div className="space-y-5">
              <Alert className="border-[#ffe100] bg-[#fffbea]">
                <KeyRound aria-hidden="true" />
                <AlertTitle>{generatedAccess.mall.name}</AlertTitle>
                <AlertDescription className="mt-2 space-y-1 break-all">
                  <p><strong>Login:</strong> {generatedAccess.email}</p>
                  <p><strong>Senha temporária:</strong> {generatedAccess.temporaryPassword}</p>
                </AlertDescription>
              </Alert>
              <Button className="w-full" onClick={() => void copyCredentials()}>
                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                {copied ? "Credenciais copiadas" : "Copiar credenciais"}
              </Button>
              <p className="text-xs leading-relaxed text-neutral-500">
                A senha aparece em texto apenas neste momento e o protótipo armazena somente o hash local. Sem um backend, este acesso não funciona em outro dispositivo ou navegador.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
