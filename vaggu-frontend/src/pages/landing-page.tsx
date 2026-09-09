import {
  ArrowRight,
  BarChart3,
  Database,
  ExternalLink,
  Gauge,
  LogIn,
  MessageCircle,
  ParkingCircle,
} from "lucide-react"
import { Link } from "react-router-dom"

import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WHATSAPP_URL } from "@/lib/constants"

const benefits = [
  {
    icon: Gauge,
    title: "Operação centralizada",
    description: "Uma visão simples do estacionamento quando a estrutura estiver conectada.",
  },
  {
    icon: Database,
    title: "Dados com origem real",
    description: "Indicadores liberados somente após a conexão dos sensores das vagas.",
  },
  {
    icon: BarChart3,
    title: "Análises confiáveis",
    description: "Histórico transformado em leitura clara para a gestão do shopping.",
  },
]

export function LandingPage() {
  return (
    <div className="overflow-hidden bg-white text-neutral-950">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <Brand inverted />
          <nav aria-label="Navegação principal" className="flex items-center gap-2 sm:gap-3">
            <Button asChild className="hidden rounded-full text-white hover:bg-white/10 sm:inline-flex" variant="ghost">
              <a href="#sobre">Sobre nós</a>
            </Button>
            <Button asChild className="rounded-full bg-[#ffe100] px-5 font-bold text-black hover:bg-[#f2d500]">
              <Link to="/login">
                <LogIn className="size-4" aria-hidden="true" />
                Login
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative min-h-[760px] bg-neutral-950 text-white lg:min-h-[850px]">
          <img
            alt="Pessoa observando o movimento urbano diante de um trem amarelo"
            className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
            fetchPriority="high"
            src="/assets/hero-vaggu.png"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.92)_0%,rgba(0,0,0,.58)_42%,rgba(0,0,0,.08)_75%),linear-gradient(0deg,rgba(0,0,0,.5)_0%,transparent_45%)]" />
          <div className="relative mx-auto flex min-h-[760px] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8 lg:min-h-[850px] lg:px-12 lg:pb-20">
            <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <h1 className="max-w-3xl font-heading text-[clamp(2.75rem,5.4vw,5.25rem)] font-light leading-[0.92] tracking-[-0.065em] " >
                  Mais <strong className="font-medium italic font-black text-[#ffe100]">fluxo.</strong>
                  <br />
                  Mais controle.
                  <br />
                  <strong className="font-medium italic font-black text-[#ffe100]">Mais oportunidades.</strong>
                </h1>
                <Button
                  asChild
                  className="mt-10 h-13 rounded-full border-white/70 bg-transparent px-7 text-base font-bold text-white hover:bg-white hover:text-black"
                  size="lg"
                  variant="outline"
                >
                  <a href={WHATSAPP_URL} rel="noreferrer" target="_blank">
                    Falar com a VAGGU
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </a>
                </Button>
              </div>
              <p className="max-w-lg text-lg leading-relaxed text-white/80 lg:justify-self-end lg:pb-3 lg:text-xl">
                Gestão inteligente de estacionamentos, conectando sensores, dados e uma visão operacional clara para shoppings.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-500">Seu próximo passo</p>
            <h2 className="mt-4 font-heading text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Fale com quem cuida de tudo.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              O cadastro do shopping, das vagas e a preparação do acesso são feitos pela nossa equipe, diretamente com você.
            </p>

            <Card className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-[2rem] border-[#ffe100] bg-[#fffdf2] text-left shadow-xl shadow-black/8">
              <CardContent className="grid gap-7 p-7 sm:grid-cols-[auto_1fr] sm:p-9">
                <div className="grid size-16 place-items-center rounded-2xl bg-[#ffe100]">
                  <MessageCircle className="size-8" strokeWidth={2.5} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-black tracking-tight">Converse com a equipe VAGGU <br /> pelo WhatsApp</h3>
                  <p className="mt-2 text-neutral-600">
                  Faça parte da equipe Vaggu e garanta uma gestão precisa para seu estacionamento, com insights e dados em tempo real.
                  </p>

                </div>

              </CardContent>
              <Button asChild className="mt-6 h-12 w-full justify-between rounded-full bg-[#ffe100] px-6 font-black text-black hover:bg-[#f2d500] sm:w-auto sm:min-w-120 m-5">
                <a href={WHATSAPP_URL} rel="noreferrer" target="_blank">
                  Iniciar conversa
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </Card>
          </div>
        </section>

        <section className="bg-neutral-950 px-5 py-20 text-white sm:px-8 lg:py-28" id="sobre">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-black text-[#ffe100]">Sobre a Vaggu</p>
                <h2 className="mt-5 max-w-xl font-heading text-4xl font-black leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Solução <span className="text-[#ffe100]">inteligente</span> para estacionamentos mais eficientes.
                </h2>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-400">
                  A Vaggu é uma solução para gestão inteligente de estacionamentos de shoppings, conectando dados, vagas e visão estratégica.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {benefits.map(({ icon: Icon, title, description }) => (
                  <Card className="rounded-2xl border-white/10 bg-white/[0.055] text-white" key={title}>
                    <CardContent className="flex h-full gap-4 p-5">
                      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#ffe100] text-black">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-bold">{title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-400">{description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-[700px] bg-neutral-900 text-white lg:min-h-[820px]">
          <img
            alt="Fluxo de pessoas em uma cidade, com uma pessoa destacada em amarelo"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            src="/assets/city-flow-vaggu.png"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/60" />
          <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-end justify-end px-5 py-16 sm:px-8 lg:min-h-[820px] lg:py-24">
            <div className="w-full max-w-xl space-y-4">
              <Card className="border-white/15 bg-black/75 text-white backdrop-blur-md">
                <CardContent className="flex gap-4 p-5 sm:p-6">
                  <BarChart3 className="mt-1 size-7 shrink-0 text-[#ffe100]" aria-hidden="true" />
                  <div>
                    <h3 className="font-heading text-xl font-black">Dados reais, quando estiverem prontos</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      Ocupação e fluxo começam a ser analisados somente após a conexão dos sensores reais das vagas.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-white/15 bg-black/75 text-white backdrop-blur-md">
                <CardContent className="flex gap-4 p-5 sm:p-6">
                  <ParkingCircle className="mt-1 size-7 shrink-0 text-[#ffe100]" aria-hidden="true" />
                  <div>
                    <h3 className="font-heading text-xl font-black">Gestão feita em conjunto</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      Shopping, vagas e acessos são preparados pela VAGGU para que a equipe do cliente apenas consulte o que importa.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-black px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <img alt="Celulares amarelos com a identidade VAGGU" className="h-full w-full object-contain object-right-bottom opacity-85" loading="lazy" src="/assets/phones-vaggu.png" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
          <div className="max-w-xl">
            <Brand inverted className="h-12" />
            <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-[#ffe100]">Fale conosco</p>
            <h2 className="mt-4 font-heading text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Seu estacionamento começa por uma conversa.
            </h2>
            <Button asChild className="mt-8 h-12 rounded-full bg-[#ffe100] px-6 font-black text-black hover:bg-[#f2d500]">
              <a href={WHATSAPP_URL} rel="noreferrer" target="_blank">
                <MessageCircle className="size-5" aria-hidden="true" />
                Chamar no WhatsApp
              </a>
            </Button>
            <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-neutral-500">
              <span>© 2026 VAGGU</span>
              <Link className="underline-offset-4 hover:text-white hover:underline" to="/login">Área do cliente</Link>
              <span>Frontend MVP</span>
            </div>
          </div>
          <div className="grid place-items-center lg:hidden">
            <img alt="Celulares amarelos com a identidade VAGGU" className="max-h-72 w-full object-contain" loading="lazy" src="/assets/phones-vaggu.png" />
          </div>
        </div>
      </footer>
    </div>
  )
}
