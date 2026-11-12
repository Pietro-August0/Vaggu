/** Compõe a landing pública e encaminha o contato comercial ao WhatsApp. */
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  LogIn,
  Mail,
} from "lucide-react"
import { Link } from "react-router-dom"
import { motion, MotionConfig } from "motion/react"

import { OperacaoVaggu } from "@/components/operacao-vaggu"
import { SobreVaggu } from "@/components/sobre-vaggu"
import { Brand } from "@/components/brand"
import { IconeWhatsApp } from "@/components/icone-whatsapp"
import { Button } from "@/components/ui/button"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { EMAIL_CONTATO, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/constants"

/** Reúne conteúdo comercial estático, imagens e animações; o contato usa o link compartilhado. */
export function LandingPage() {
  useScrollReveal()
  const contatoUrl = WHATSAPP_URL ?? `mailto:${EMAIL_CONTATO}`

  return (
    <MotionConfig reducedMotion="user">
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
            alt="Imagem ilustrativa de estacionamento coberto com pilares amarelos"
            className="landing-hero-media absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-center"
            fetchPriority="high"
            width="1672"
            height="941"
            src="/assets/estacionamento-hero-vaggu.webp"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.35)_35%,transparent_72%),linear-gradient(90deg,rgba(0,0,0,.3),transparent_60%)]" />
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
                    <a
                      aria-label={WHATSAPP_URL ? "Falar com a VAGGU pelo WhatsApp (abre em nova aba)" : "Falar com a VAGGU por e-mail"}
                      href={contatoUrl}
                      rel={WHATSAPP_URL ? "noreferrer" : undefined}
                      target={WHATSAPP_URL ? "_blank" : undefined}
                    >
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

        <section id="implantacao" aria-labelledby="implantacao-titulo" className="bg-[#ffe100] px-5 py-10 text-neutral-950 sm:px-8 sm:py-14 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-12 gap-y-6">
            <div className="max-w-2xl">
              <h2 id="implantacao-titulo" className="text-balance font-landing text-2xl font-semibold tracking-tight sm:text-4xl">
                Como levar a VAGGU ao seu shopping
              </h2>
              <p className="mt-3 max-w-xl text-pretty leading-relaxed text-neutral-900">
                Nossa equipe cadastra o shopping e as vagas e prepara o acesso dos gerentes.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 rounded-lg bg-neutral-950 px-5 font-medium text-white hover:bg-neutral-800 focus-visible:ring-neutral-950">
              {WHATSAPP_URL ? (
                <a href={WHATSAPP_URL} rel="noreferrer" target="_blank" aria-label="Falar no WhatsApp (abre em nova aba)">
                  <IconeWhatsApp className="size-5" />
                  Falar no WhatsApp
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              ) : (
                <a href={`mailto:${EMAIL_CONTATO}`}>
                  <Mail className="size-5" aria-hidden="true" />
                  Enviar e-mail
                </a>
              )}
            </Button>
          </div>
        </section>

        <SobreVaggu />

        <OperacaoVaggu />
      </main>

      <footer id="contatos" className="bg-black px-5 pb-8 pt-14 text-white sm:px-8 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Brand inverted className="h-10 sm:h-12" />
              <p className="mt-9 text-xs font-medium uppercase tracking-[0.24em] text-[#ffe100] sm:mt-8">Fale conosco</p>
              <h2 className="mt-3 font-landing text-3xl font-semibold tracking-[-0.04em] sm:mt-4 sm:text-5xl">
                Seu estacionamento começa por uma conversa.
              </h2>
            </motion.div>
            <section aria-labelledby="contatos-projeto" className="lg:justify-self-end lg:w-full lg:max-w-xl">
              <p id="contatos-projeto" className="text-xs font-medium uppercase tracking-[0.24em] text-[#ffe100]">Canais oficiais</p>
              <ul className="mt-6 grid gap-3 xl:grid-cols-2">
                {WHATSAPP_URL && <li>
                  <a
                    className="flex min-h-16 min-w-0 items-center gap-3 rounded-2xl border border-white/15 p-4 text-sm transition-colors hover:border-[#ffe100]/70 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe100]"
                    href={WHATSAPP_URL}
                    rel="noreferrer"
                    target="_blank"
                    aria-label="WhatsApp da VAGGU (abre em nova aba)"
                  >
                    <IconeWhatsApp className="size-5 shrink-0 text-[#ffe100]" aria-hidden="true" />
                    <span className="whitespace-nowrap">WhatsApp</span>
                  </a>
                </li>}
                <li>
                  <a
                    className="flex min-h-16 min-w-0 items-center gap-3 rounded-2xl border border-white/15 p-4 text-sm transition-colors hover:border-[#ffe100]/70 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe100]"
                    href={`mailto:${EMAIL_CONTATO}`}
                    aria-label={`Enviar e-mail para ${EMAIL_CONTATO}`}
                  >
                    <Mail className="size-5 shrink-0 text-[#ffe100]" aria-hidden="true" />
                    <span className="whitespace-nowrap text-xs">{EMAIL_CONTATO}</span>
                  </a>
                </li>
                <li>
                  <a
                    className="flex min-h-16 min-w-0 items-center gap-3 rounded-2xl border border-white/15 p-4 text-sm transition-colors hover:border-[#ffe100]/70 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe100]"
                    href={INSTAGRAM_URL}
                    rel="noreferrer"
                    target="_blank"
                    aria-label="Instagram da VAGGU, vagguempresarial (abre em nova aba)"
                  >
                    <svg className="size-5 shrink-0 text-[#ffe100]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                    <span className="whitespace-nowrap">Instagram</span>
                  </a>
                </li>
                <li>
                  <Link
                    className="flex min-h-16 min-w-0 items-center gap-3 rounded-2xl border border-white/15 p-4 text-sm transition-colors hover:border-[#ffe100]/70 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe100]"
                    to="/memorial"
                  >
                    <BookOpen className="size-5 shrink-0 text-[#ffe100]" aria-hidden="true" />
                    <span>Memorial da VAGGU</span>
                  </Link>
                </li>
              </ul>
            </section>
          </div>
          <div className="mt-12 grid gap-6 border-t border-white/15 pt-7 text-sm sm:mt-16 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <p className="max-w-xs leading-relaxed text-neutral-400">Gestão inteligente de estacionamentos para shoppings.</p>
            <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-6 gap-y-3"><a className="underline-offset-4 hover:text-[#ffe100] hover:underline focus-visible:outline-2 focus-visible:outline-[#ffe100]" href="#sobre">Sobre a VAGGU</a><Link className="underline-offset-4 hover:text-[#ffe100] hover:underline focus-visible:outline-2 focus-visible:outline-[#ffe100]" to="/login">Área do cliente</Link><Link className="underline-offset-4 hover:text-[#ffe100] hover:underline focus-visible:outline-2 focus-visible:outline-[#ffe100]" to="/privacidade">Privacidade</Link><Link className="underline-offset-4 hover:text-[#ffe100] hover:underline focus-visible:outline-2 focus-visible:outline-[#ffe100]" to="/exclusao-de-dados">Exclusão de dados</Link></nav>
            <span className="text-neutral-500 sm:shrink-0">© 2026 VAGGU</span>
          </div>
        </div>
      </footer>
      </div>
    </MotionConfig>
  )
}
