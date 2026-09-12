/** Apresenta o cadastro demonstrativo do shopping vinculado, com análises ainda inativas. */
import {
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  ExternalLink,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  ParkingCircle,
  RadioTower,
  UserRound,
} from "lucide-react"

import { useAppStore } from "@/app/app-store"
import { DashboardShell } from "@/components/dashboard-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { WHATSAPP_URL } from "@/lib/constants"

/** Padroniza a apresentação de um dado cadastral recebido pela página. */
function DataRow({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex gap-3 py-4">
      <Icon className="mt-0.5 size-5 shrink-0 text-neutral-400" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">{label}</p>
        <p className="mt-1 break-words font-medium text-neutral-900">{value}</p>
      </div>
    </div>
  )
}

/** Lê o shopping do contexto local; a área de gráficos é somente uma indicação de entrega futura. */
export function MallPanelPage() {
  const { currentMall } = useAppStore()

  if (!currentMall) {
    return (
      <DashboardShell eyebrow="Área do cliente" title="Painel do shopping">
        <Alert variant="destructive">
          <AlertTitle>Shopping não vinculado</AlertTitle>
          <AlertDescription>Fale com a equipe VAGGU para revisar o seu acesso.</AlertDescription>
        </Alert>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell eyebrow="Área do cliente" title={currentMall.name}>
      <div className="mx-auto max-w-7xl space-y-8">
        <Alert className="rounded-2xl border-[#ffe100] bg-[#fffbea] p-5">
          <RadioTower aria-hidden="true" />
          <AlertTitle className="font-heading text-lg font-black">Preparando a conexão do estacionamento</AlertTitle>
          <AlertDescription className="max-w-3xl text-neutral-700">
            Os sensores das vagas ainda não estão conectados. Até a instalação real, indicadores, gráficos e insights permanecem inativos e nenhum dado de ocupação é estimado.
          </AlertDescription>
        </Alert>

        <section aria-label="Resumo do shopping" className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-black/5 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid size-12 place-items-center rounded-2xl bg-[#ffe100]"><ParkingCircle aria-hidden="true" /></div>
              <div><p className="text-sm text-neutral-500">Vagas previstas</p><p className="text-3xl font-black">{currentMall.totalSpaces.toLocaleString("pt-BR")}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-black/5 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid size-12 place-items-center rounded-2xl bg-neutral-200"><RadioTower aria-hidden="true" /></div>
              <div><p className="text-sm text-neutral-500">Sensores</p><p className="font-heading text-xl font-black">Não conectados</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-black/5 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid size-12 place-items-center rounded-2xl bg-neutral-950 text-[#ffe100]"><LockKeyhole aria-hidden="true" /></div>
              <div><p className="text-sm text-neutral-500">Insights</p><p className="font-heading text-xl font-black">Inativos</p></div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <Card className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] border-black/5 bg-neutral-950 text-white shadow-none">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,225,0,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,225,0,.15)_1px,transparent_1px)] [background-size:42px_42px]" />
            <CardHeader className="relative border-b border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-heading text-2xl font-black">Análise do estacionamento</CardTitle>
                  <CardDescription className="text-neutral-400">A área será alimentada pela telemetria real das vagas.</CardDescription>
                </div>
                <Badge className="border-white/15 bg-white/10 text-white" variant="outline">Bloqueado</Badge>
              </div>
            </CardHeader>
            <CardContent className="relative grid min-h-72 place-items-center p-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto grid size-20 place-items-center rounded-full border border-[#ffe100]/40 bg-[#ffe100]/10 text-[#ffe100]">
                  <ChartNoAxesCombined className="size-9" aria-hidden="true" />
                </div>
                <h2 className="mt-6 font-heading text-2xl font-black">Sem dados até a conexão real</h2>
                <p className="mt-3 leading-relaxed text-neutral-400">
                  Quando os sensores estiverem ativos, este espaço receberá ocupação, histórico e insights automáticos. Nenhuma métrica fictícia é exibida neste MVP.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-black/5 shadow-none">
            <CardHeader>
              <CardTitle className="font-heading text-2xl font-black">Dados do shopping</CardTitle>
              <CardDescription>Informações configuradas pela equipe VAGGU.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataRow icon={Building2} label="Shopping" value={currentMall.name} />
              <Separator />
              <DataRow icon={MapPin} label="Endereço" value={currentMall.address} />
              <Separator />
              <DataRow icon={UserRound} label="Responsável" value={currentMall.managerName} />
              <Separator />
              <DataRow icon={Mail} label="E-mail de acesso" value={currentMall.managerEmail} />
              <Separator />
              <DataRow icon={CalendarClock} label="Cadastro" value={new Date(currentMall.createdAt).toLocaleDateString("pt-BR")} />
            </CardContent>
          </Card>
        </section>

        <Card className="overflow-hidden rounded-[1.75rem] border-0 bg-[#ffe100] shadow-none">
          <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em]">Atendimento VAGGU</p>
              <h2 className="mt-2 font-heading text-3xl font-black tracking-tight">Precisa corrigir algum dado?</h2>
              <p className="mt-2 text-black/70">
                Alterações do shopping, estacionamento ou vagas são tratadas com a nossa equipe pelo WhatsApp.
              </p>
            </div>
            <Button asChild className="h-12 shrink-0 rounded-full bg-neutral-950 px-6 font-black text-white hover:bg-neutral-800">
              <a href={WHATSAPP_URL} rel="noreferrer" target="_blank">
                <MessageCircle aria-hidden="true" />
                Falar com a equipe
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
