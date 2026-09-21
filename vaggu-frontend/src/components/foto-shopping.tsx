/** Carrega a foto privada do shopping com a sessão atual e libera a URL temporária ao desmontar. */
import { useEffect, useState } from "react"
import { Building2 } from "lucide-react"
import { useAppStore } from "@/app/app-store"
import { cn } from "@/lib/utils"

interface FotoShoppingProps {
  shoppingId: string
  nome: string
  possuiFoto: boolean
  className?: string
}

/** Exibe um fallback estável quando não há foto ou quando o download autenticado falha. */
export function FotoShopping({ shoppingId, nome, possuiFoto, className }: FotoShoppingProps) {
  const { consultarImagem } = useAppStore()
  const [endereco, setEndereco] = useState("")

  useEffect(() => {
    if (!possuiFoto) {
      setEndereco("")
      return
    }
    let ativo = true
    let url = ""
    consultarImagem(`/shoppings/${shoppingId}/foto`).then(imagem => {
      if (!ativo) return
      url = URL.createObjectURL(imagem)
      setEndereco(url)
    }).catch(() => { if (ativo) setEndereco("") })
    return () => {
      ativo = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [consultarImagem, possuiFoto, shoppingId])

  if (endereco) return <img src={endereco} alt={`Foto do ${nome}`} className={cn("object-cover", className)}/>
  return <span className={cn("grid place-items-center bg-neutral-950 text-[#ffe100]", className)} aria-label={`${nome} sem foto cadastrada`}><Building2 aria-hidden="true"/></span>
}
