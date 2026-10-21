import type { EstruturaEstacionamento } from "../types/estrutura"

/** Preserva localização e filtros, mas nunca apresenta disponibilidade vencida como atual. */
export function invalidarLeituras(estrutura: EstruturaEstacionamento): EstruturaEstacionamento {
  return {
    ...estrutura,
    andares: estrutura.andares.map(andar => ({ ...andar, setores: andar.setores.map(setor => ({
      ...setor,
      vagas: setor.vagas.map(vaga => ({
        ...vaga,
        estadoAtual: "INDISPONIVEL",
        monitoramento: vaga.monitoramento ? { ...vaga.monitoramento, estadoConfirmado: "INDISPONIVEL", estadoCandidato: null, candidatoIniciadoEm: null, situacao: vaga.monitoramento.situacao === "MANUTENCAO" ? "MANUTENCAO" : "SEM_RESPOSTA" } : null,
      })),
    })) })),
  }
}
