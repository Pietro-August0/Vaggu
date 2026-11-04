import { useMovimentoReduzido } from "@/hooks/use-movimento-reduzido"
/** Anima somente a apresentação; tecnologias assistivas recebem sempre o valor confirmado. */
import { useEffect, useRef } from "react"
import { animate, useInView } from "motion/react"
import { formatarDuracao, formatarMetrica } from "@/servicos/analise"

type Formato = "inteiro" | "percentual" | "duracao"

function formatar(valor: number, formato: Formato) {
  return formato === "duracao" ? formatarDuracao(valor) : formatarMetrica(valor, formato === "percentual" ? "%" : "", 0)
}

export function NumeroAnimado({ valor, formato = "inteiro", ausente = "Sem observação" }: {
  valor: number | null | undefined
  formato?: Formato
  ausente?: string
}) {
  const elemento = useRef<HTMLSpanElement>(null)
  const atual = useRef(0)
  const iniciou = useRef(false)
  const visivel = useInView(elemento, { once: true, amount: .5 })
  const reduzirMovimento = useMovimentoReduzido()
  const textoFinal = valor == null ? ausente : formatar(valor, formato)

  useEffect(() => {
    const span = elemento.current
    if (!span) return
    if (valor == null || reduzirMovimento) {
      span.textContent = textoFinal
      if (valor == null) { atual.current = 0; iniciou.current = false }
      else if (reduzirMovimento) { atual.current = valor; iniciou.current = true }
      return
    }
    if (!visivel) { span.textContent = formatar(0, formato); return }
    const inicio = iniciou.current ? atual.current : 0
    iniciou.current = true
    if (inicio === valor) { span.textContent = textoFinal; return }
    const animacao = animate(inicio, valor, {
      duration: .85,
      ease: [.22, 1, .36, 1],
      onUpdate: numero => { atual.current = numero; span.textContent = formatar(numero, formato) },
      onComplete: () => { atual.current = valor; span.textContent = textoFinal },
    })
    return () => animacao.stop()
  }, [valor, formato, textoFinal, visivel, reduzirMovimento])

  return <span className="analise-valor-animado"><span className="sr-only">{textoFinal}</span><span aria-hidden="true" className="analise-valor-medida">{textoFinal}</span><span aria-hidden="true" className="analise-valor-visivel" ref={elemento}>{valor == null || reduzirMovimento ? textoFinal : formatar(0, formato)}</span></span>
}
