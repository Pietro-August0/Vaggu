import {
  ArrowRight,
  BarChart3,
  Database,
  ExternalLink,
  Gauge,
  LogIn,
  ParkingCircle,
  Layers,
  Zap,
  MessageCircle,
  CheckCircle,
  Settings,
  TrendingUp,
} from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"

import { Brand } from "@/components/brand"
import { IconeWhatsApp } from "@/components/icone-whatsapp"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
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
  useScrollReveal()

  return (
    <div className="overflow-hidden bg-white font-landing font-light text-neutral-950">
      <header className="landing-header absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <Brand inverted />
          <nav aria-label="Navegação principal" className="flex items-center gap-2 sm:gap-3">
            <Button asChild className="hidden rounded-full text-white hover:bg-white/10 sm:inline-flex" variant="ghost">
              <a href="#sobre">Sobre nós</a>
            </Button>
            <Button asChild className="rounded-full bg-[#ffe100] px-5 font-medium text-black hover:bg-[#f2d500]">
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
            className="landing-hero-media absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-[62%_center]"
            fetchPriority="high"
            src="/assets/hero-vaggu.png"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.92)_0%,rgba(0,0,0,.58)_42%,rgba(0,0,0,.08)_75%),linear-gradient(0deg,rgba(0,0,0,.5)_0%,transparent_45%)]" />
          <div className="relative mx-auto flex min-h-[760px] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8 lg:min-h-[850px] lg:px-12 lg:pb-20">
            <div className="grid min-w-0 items-end gap-12 lg:grid-cols-[1.15fr_.85fr]">
              <motion.div
                className="min-w-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <h1 className="landing-hero-title max-w-3xl font-landing text-[clamp(1.95rem,7.8vw,5.25rem)] font-light leading-[0.98] tracking-[-0.045em] sm:leading-[0.92] sm:tracking-[-0.065em]">
                  Mais <strong className="font-semibold italic text-[#ffe100]">fluxo.</strong>
                  <br />
                  Mais controle.
                  <br />
                  <strong className="font-semibold italic text-[#ffe100]">Mais oportunidades.</strong>
                </h1>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Button
                    asChild
                    className="landing-hero-action mt-8 h-12 rounded-full border-white/70 bg-transparent px-6 text-base font-medium text-white hover:bg-white hover:text-black sm:mt-10 sm:h-13 sm:px-7 transition-all duration-300"
                    size="lg"
                    variant="outline"
                  >
                    <a aria-label="Falar com a VAGGU pelo WhatsApp (abre em nova aba)" href={WHATSAPP_URL} rel="noreferrer" target="_blank">
                      Falar com a VAGGU
                      <ArrowRight className="size-5" aria-hidden="true" />
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.p
                className="landing-hero-description min-w-0 max-w-lg text-base font-light leading-relaxed text-white/80 sm:text-lg lg:justify-self-end lg:pb-3 lg:text-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Gestão inteligente de estacionamentos, conectando sensores, dados e uma visão operacional clara para shoppings.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <motion.div
            className="mx-auto max-w-6xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p
              className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Seu próximo passo
            </motion.p>
            <motion.h2
              className="mt-4 font-landing text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Fale com quem cuida de tudo.
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-2xl text-lg font-light text-neutral-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              O cadastro do shopping, das vagas e a preparação do acesso são feitos pela nossa equipe, diretamente com você.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-[2rem] border-[#ffe100] bg-[#fffdf2] text-left shadow-xl shadow-black/8 sm:mt-12">
                <CardContent className="grid gap-7 p-7 sm:grid-cols-[auto_1fr] sm:p-9">
                  <div className="grid size-16 place-items-center rounded-2xl bg-[#ffe100] text-black">
                    <IconeWhatsApp className="size-8" />
                  </div>
                  <div>
                    <h3 className="font-landing text-2xl font-semibold tracking-tight">Converse com a equipe VAGGU pelo WhatsApp</h3>
                    <p className="mt-2 font-light text-neutral-600">
                      Conheça a implantação e prepare o acesso do seu shopping com o acompanhamento da nossa equipe.
                    </p>
                  </div>
                  <Button asChild className="h-12 w-full justify-between rounded-full bg-[#ffe100] px-6 font-medium text-black hover:bg-[#f2d500] sm:col-span-2">
                    <a aria-label="Iniciar conversa com a VAGGU no WhatsApp (abre em nova aba)" href={WHATSAPP_URL} rel="noreferrer" target="_blank">
                      Iniciar conversa
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        <section className="bg-neutral-950 px-5 py-20 text-white sm:px-8 lg:py-28" id="sobre">
          <div className="mx-auto max-w-7xl">
            {/* Seção de Texto e Introdução */}
            <motion.div
              className="mb-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="text-sm font-medium text-[#ffe100]">Sobre a Vaggu</p>
              <h2 className="mt-5 mx-auto max-w-2xl font-landing text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Solução <span className="font-bold text-[#ffe100]">inteligente</span> para estacionamentos mais eficientes.
              </h2>
              <p className="mt-7 mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-400">
                A Vaggu conecta sensores, dados e visão estratégica para transformar a gestão de estacionamentos em shoppings.
              </p>
            </motion.div>

            {/* Seção: Você visualiza */}
            <motion.div
              className="mb-28 py-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-center text-3xl font-semibold mb-12">Você visualiza</h3>
              
              <div className="relative mx-auto max-w-5xl">
                {/* SVG Linhas Conectoras Pontilhadas Curvas */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <filter id="glow-connector">
                      <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Linha 1 - Para "Relatórios e exportação" (Card 1 - topo) */}
                  <motion.path
                    d="M 40 20 Q 65 15 85 20"
                    stroke="#ffe100"
                    strokeWidth="0.4"
                    fill="none"
                    strokeDasharray="2 1"
                    filter="url(#glow-connector)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  />

                  {/* Linha 2 - Para "Gestão por andar e setor" (Card 2 - meio) */}
                  <motion.path
                    d="M 40 50 Q 65 50 85 50"
                    stroke="#ffe100"
                    strokeWidth="0.4"
                    fill="none"
                    strokeDasharray="2 1"
                    filter="url(#glow-connector)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  />

                  {/* Linha 3 - Para "Insights em tempo real" (Card 3 - embaixo) */}
                  <motion.path
                    d="M 40 80 Q 65 85 85 80"
                    stroke="#ffe100"
                    strokeWidth="0.4"
                    fill="none"
                    strokeDasharray="2 1"
                    filter="url(#glow-connector)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  />
                </svg>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.5fr] items-center">
                  {/* Mockup Laptop */}
                  <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="relative w-full max-w-sm">
                      {/* Glow Background */}
                      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-[#ffe100]/20 via-[#ffe100]/5 to-transparent blur-3xl" />
                      
                      {/* Mockup - Sem Borda */}
                      <img 
                        src="/assets/mockup-laptop-vaggu.svg" 
                        alt="Mockup do dashboard VAGGU em laptop"
                        className="w-full drop-shadow-2xl"
                      />
                    </div>
                  </motion.div>

                  {/* Cards à direita */}
                  <div className="space-y-6">
                    {/* Card 1 */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <div className="flex gap-4 rounded-xl bg-white/[0.05] border border-white/10 p-5 hover:border-[#ffe100]/50 hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-sm">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#ffe100]/10 text-[#ffe100]">
                          <BarChart3 className="size-6" aria-hidden="true" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Relatórios e exportação de dados</h4>
                          <p className="mt-1 text-sm font-light text-neutral-400">Análises e métricas em tempo real para decisões estratégicas.</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <div className="flex gap-4 rounded-xl bg-white/[0.05] border border-white/10 p-5 hover:border-[#ffe100]/50 hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-sm">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#ffe100]/10 text-[#ffe100]">
                          <Layers className="size-6" aria-hidden="true" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Gestão por andar e setor</h4>
                          <p className="mt-1 text-sm font-light text-neutral-400">Organize e navegue sua estrutura com facilidade e controle.</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <div className="flex gap-4 rounded-xl bg-white/[0.05] border border-white/10 p-5 hover:border-[#ffe100]/50 hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-sm">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#ffe100]/10 text-[#ffe100]">
                          <Zap className="size-6" aria-hidden="true" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Insights em tempo real</h4>
                          <p className="mt-1 text-sm font-light text-neutral-400">Indicadores frescos atualizados constantemente para sua gestão.</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Seção: Saber como começar */}
            <motion.div
              className="py-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-center text-3xl font-semibold mb-16">Saber como começar</h3>

              <div className="relative mx-auto max-w-5xl">
                {/* SVG Linhas Conectoras Timeline */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 1200 300"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <filter id="glow-timeline">
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Linha 1 - Entre círculo 1 e 2 */}
                  <motion.line
                    x1="150" y1="150"
                    x2="450" y2="150"
                    stroke="#ffe100"
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    opacity="0.5"
                    filter="url(#glow-timeline)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  />

                  {/* Linha 2 - Entre círculo 2 e 3 */}
                  <motion.line
                    x1="750" y1="150"
                    x2="1050" y2="150"
                    stroke="#ffe100"
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    opacity="0.5"
                    filter="url(#glow-timeline)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  />

                  {/* Linha extra - Círculo 3 continua */}
                  <motion.line
                    x1="1050" y1="150"
                    x2="1150" y2="150"
                    stroke="#ffe100"
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    opacity="0.5"
                    filter="url(#glow-timeline)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  />
                </svg>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Passo 1 - WhatsApp */}
                  <motion.div
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full bg-[#ffe100]/10 blur-xl" />
                      <div className="relative size-24 rounded-full border-2 border-[#ffe100] bg-gradient-to-br from-[#ffe100]/20 to-[#ffe100]/5 flex items-center justify-center">
                        <MessageCircle className="size-10 text-[#ffe100]" aria-hidden="true" />
                      </div>
                    </div>
                    <h4 className="font-semibold">Entre em contato<br />consco pelo WhatsApp</h4>
                    <p className="mt-2 text-sm font-light text-neutral-400">Conversa direta com nossa equipe.</p>
                  </motion.div>

                  {/* Passo 2 - Avaliação */}
                  <motion.div
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full bg-[#ffe100]/10 blur-xl" />
                      <div className="relative size-24 rounded-full border-2 border-[#ffe100] bg-gradient-to-br from-[#ffe100]/20 to-[#ffe100]/5 flex items-center justify-center">
                        <CheckCircle className="size-10 text-[#ffe100]" aria-hidden="true" />
                      </div>
                    </div>
                    <h4 className="font-semibold">Agende uma<br />avaliação do seu<br />estacionamento</h4>
                    <p className="mt-2 text-sm font-light text-neutral-400">Conhecemos seu espaço.</p>
                  </motion.div>

                  {/* Passo 3 - Implementação */}
                  <motion.div
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full bg-[#ffe100]/10 blur-xl" />
                      <div className="relative size-24 rounded-full border-2 border-[#ffe100] bg-gradient-to-br from-[#ffe100]/20 to-[#ffe100]/5 flex items-center justify-center">
                        <Settings className="size-10 text-[#ffe100]" aria-hidden="true" />
                      </div>
                    </div>
                    <h4 className="font-semibold">Implementação da<br />Vaggu no seu local</h4>
                    <p className="mt-2 text-sm font-light text-neutral-400">Sensores, estrutura e acesso.</p>
                  </motion.div>

                  {/* Passo 4 - Gestão */}
                  <motion.div
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full bg-[#ffe100]/10 blur-xl" />
                      <div className="relative size-24 rounded-full border-2 border-[#ffe100] bg-gradient-to-br from-[#ffe100]/20 to-[#ffe100]/5 flex items-center justify-center">
                        <TrendingUp className="size-10 text-[#ffe100]" aria-hidden="true" />
                      </div>
                    </div>
                    <h4 className="font-semibold">Acesso imediato do<br />gerenciamento em<br />tempo real</h4>
                    <p className="mt-2 text-sm font-light text-neutral-400">Dados atualizados constantemente.</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
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
            <motion.div
              className="w-full max-w-xl space-y-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="border-white/15 bg-black/75 text-white backdrop-blur-md hover:border-[#ffe100]/50 transition-all duration-300">
                  <CardContent className="flex gap-4 p-5 sm:p-6">
                    <BarChart3 className="mt-1 size-7 shrink-0 text-[#ffe100]" aria-hidden="true" />
                    <div>
                      <h3 className="font-landing text-xl font-semibold">Dados operacionais após a implantação</h3>
                      <p className="mt-2 text-sm font-light leading-relaxed text-neutral-300">
                        Ocupação e fluxo passam a ser analisados somente após a conexão e a validação dos sensores das vagas.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="border-white/15 bg-black/75 text-white backdrop-blur-md hover:border-[#ffe100]/50 transition-all duration-300">
                  <CardContent className="flex gap-4 p-5 sm:p-6">
                    <ParkingCircle className="mt-1 size-7 shrink-0 text-[#ffe100]" aria-hidden="true" />
                    <div>
                      <h3 className="font-landing text-xl font-semibold">Gestão feita em conjunto</h3>
                      <p className="mt-2 text-sm font-light leading-relaxed text-neutral-300">
                        Shopping, vagas e acessos são preparados pela VAGGU para que a equipe do cliente apenas consulte o que importa.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-black px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <motion.img
            alt="Celulares amarelos com a identidade VAGGU"
            className="h-full w-full object-contain object-right-bottom opacity-85"
            loading="lazy"
            src="/assets/phones-vaggu.png"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 0.85, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Brand inverted className="h-12" />
            <p className="mt-8 text-xs font-medium uppercase tracking-[0.24em] text-[#ffe100]">Fale conosco</p>
            <h2 className="mt-4 font-landing text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Seu estacionamento começa por uma conversa.
            </h2>
            <Button asChild className="mt-8 h-12 rounded-full bg-[#ffe100] px-6 font-medium text-black hover:bg-[#f2d500]">
              <a aria-label="Chamar a VAGGU no WhatsApp (abre em nova aba)" href={WHATSAPP_URL} rel="noreferrer" target="_blank">
                <IconeWhatsApp className="size-5" />
                Chamar no WhatsApp
              </a>
            </Button>
            <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-neutral-500">
              <span>© 2026 VAGGU</span>
              <Link className="underline-offset-4 hover:text-white hover:underline" to="/login">Área do cliente</Link>
              <span>Gestão inteligente de estacionamentos</span>
            </div>
          </motion.div>
          <div className="grid place-items-center lg:hidden">
            <motion.img
              alt="Celulares amarelos com a identidade VAGGU"
              className="max-h-72 w-full object-contain"
              loading="lazy"
              src="/assets/phones-vaggu.png"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            />
          </div>
        </div>
      </footer>
    </div>
  )
}
