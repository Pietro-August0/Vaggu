/** Exibe a foto institucional persistida no Blob ou o fallback visual da VAGGU. */
import { useState } from "react"
import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FotoShoppingProps {
  nome: string
  imagemUrl: string | null
  className?: string
}

/** Exibe um fallback estável quando não há foto ou quando a URL externa falha. */
export function FotoShopping({ nome, imagemUrl, className }: FotoShoppingProps) {
  const [urlComFalha, setUrlComFalha] = useState<string | null>(null)
  if (imagemUrl && imagemUrl !== urlComFalha) return <img src={imagemUrl} alt={`Foto do ${nome}`} className={cn("object-cover", className)} onError={() => setUrlComFalha(imagemUrl)}/>
  return <span className={cn("grid place-items-center bg-neutral-950 text-[#ffe100]", className)} aria-label={`${nome} sem foto cadastrada`}><Building2 aria-hidden="true"/></span>
}
