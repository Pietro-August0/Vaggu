/** Compõe a landing pública e encaminha o contato comercial ao WhatsApp. */
import {
  ArrowRight,
  ExternalLink,
  LogIn,
} from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"

import { OperacaoVaggu } from "@/components/operacao-vaggu"
import { SobreVaggu } from "@/components/sobre-vaggu"
import { Brand } from "@/components/brand"
import { IconeWhatsApp } from "@/components/icone-whatsapp"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { WHATSAPP_URL } from "@/lib/constants"

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

        <SobreVaggu />

        <OperacaoVaggu />
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
