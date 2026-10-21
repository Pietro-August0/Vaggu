/** Consulta continuamente o shopping autorizado da sessão. */
import { MapaAoVivo } from "@/components/mapa-ao-vivo"

export function MapaEstacionamento() {
  return <MapaAoVivo caminho="/estacionamento/estrutura" modo="gerente" />
}
