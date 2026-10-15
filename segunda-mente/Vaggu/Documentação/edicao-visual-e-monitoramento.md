# Edição visual e monitoramento dos sensores

Entrega de 15/10/2026. As alterações usam as rotas e os modelos PostgreSQL existentes. A consulta continua isolada pelo shopping autorizado; somente o Admin salva posições.

## Como editar o mapa

1. Abra a ficha do shopping, entre em **Estrutura e mapa → Editar posições** e escolha o piso.
2. Selecione uma vaga no mapa ou na lista **Vaga selecionada**.
3. Arraste a vaga com mouse ou toque. Também é possível selecionar a vaga e clicar/tocar em uma área vazia para posicioná-la nesse local.
4. Use **Aumentar vaga**, **Diminuir vaga** e **Girar 90°** para ajustar a forma. Com foco na vaga, as setas movem em passos de 1% do mapa; Shift aumenta o passo para 5%.
5. Confira a prévia e use **Salvar posições**. **Desfazer alterações** restaura o último mapa carregado.

O editor limita as posições à área disponível e bloqueia o salvamento enquanto houver sobreposição entre as caixas das vagas. No celular, o mapa mantém uma área mínima de 720 px para que as vagas continuem legíveis; a navegação horizontal ocorre dentro do editor, sem alargar a página. Arrastar uma vaga usa captura de ponteiro, enquanto o entorno permite navegar pelo mapa.

Trocar de piso ou sair da aba de edição solicita confirmação quando existe rascunho. Fechar ou recarregar a aba do navegador aciona a proteção nativa de alterações não salvas. A navegação interna por outros links do site ainda não possui bloqueio global de rascunho.

## Persistência e concorrência

O editor mantém o rascunho no componente `EditorMapaVagas`, sem enviar cada movimento ao servidor. Ao salvar, o Admin envia `PATCH /api/v1/andares/:andarId/mapa` com a revisão carregada e as posições proporcionais. Não há alteração do contrato de coordenadas armazenado no banco.

A API mantém autorização administrativa, validação de vínculo das vagas, atualização atômica e incremento da revisão. Uma edição concorrente recebe `409 MAPA_DESATUALIZADO`; o rascunho fica visível para conferência. A prevenção de sobreposição é uma ajuda do editor, não uma nova restrição SQL para integrações externas.

## Onde consultar os sensores

Na visualização compartilhada de Admin e gerente, **Monitoramento dos sensores** alterna o mapa por uma lista de equipamentos. Os filtros de piso, setor, categoria, estado e busca continuam valendo. Um filtro adicional permite escolher a situação do sensor.

Os cartões exibem vaga, setor, código do sensor, placa ESP32 e última observação individual. **Ver detalhes**, ou a seleção de uma vaga no mapa, abre o diálogo com situação, placa, último contato da placa, última observação do sensor, estado confirmado, mudança pendente e início da confirmação.

| Situação | Critério |
| --- | --- |
| Operando | Sensor ativo com observação válida e estado confirmado, sem candidato pendente. |
| Confirmando mudança | Existe candidato pendente e o estado anterior continua sendo apresentado até confirmação. |
| Sem resposta | Sensor expirado ou observação individual vencida no ambiente operacional. |
| Em manutenção | Sensor marcado como inativo. É uma consulta do estado, sem nova operação de manutenção nesta entrega. |
| Sem leitura confirmada | Ainda não há observação/estado confirmado suficiente. |
| Sem sensor vinculado | A vaga não possui sensor cadastrado. |

O contato da placa e a leitura do sensor têm horários separados. O heartbeat nunca torna, por si só, uma vaga livre. A API retorna uma projeção explícita dos dados de monitoramento; chaves, hashes e credenciais não fazem parte da resposta.

## Shopping Exemplo

A inicialização de produção também executa `garantirMonitoramentoApresentacao`: quatro registros de ESP32, um por setor, e um sensor por vaga, totalizando 80 sensores. Cada setor possui exemplos de manutenção, falta de resposta e confirmação pendente, além dos sensores com leitura e dos casos sem estado confirmado. Os registros são sintéticos, sem equipamentos físicos conectados.

O preenchimento usa uma transação com advisory lock e só atua no ID conhecido do Shopping Exemplo, quando `demonstracao=true`. Sensores existentes não são sobrescritos. Repetir o deploy ou iniciar duas instâncias não duplica equipamentos, não redefine senhas e não modifica o histórico de ocupação.

Os horários e situações constituem uma fotografia de apresentação, preservada entre reinicializações. O job de expiração operacional exclui shoppings marcados como demonstração. Esses dados não são renovados artificialmente a cada consulta, nem são ingestão real do ESP32.

## Apresentação dos textos

A pedido do usuário, o Shopping Exemplo deixou de mostrar os selos e avisos de dados fictícios na interface, na análise compacta e nas exportações Excel/PDF. Títulos, códigos e nomes exibidos receberam redação neutra. O código interno, a marcação do shopping e esta documentação preservam a origem sintética para manter o isolamento e os testes. Não foi acrescentada alegação de transmissão ao vivo.

Os avisos de ausência de medições e os estados de erro continuam existindo. A distinção de fontes das séries genéricas usadas quando outros shoppings não têm histórico não foi convertida em medição confirmada.

## Verificação e evidências

- Frontend: lint e build; revisão de tipos, hooks, foco, rótulos dos seletores e cleanup de eventos/captura de ponteiro.
- PostgreSQL descartável: criação concorrente do exemplo, 80 sensores/quatro placas, situações previstas, repetição sem alterações, exclusão da expiração operacional e projeção pública sem hashes. A integração de telemetria real confere os horários independentes de sensor e placa.
- Edge headless com Playwright e API/PostgreSQL reais: arraste com mouse, setas, persistência após recarga, desfazer, proteção de rascunho ao trocar piso, tamanho e rotação; monitoramento e detalhes para Admin e gerente; larguras 1440, 768 e 390 px; arraste por toque, posicionamento por toque e bloqueio de sobreposição.
- Relatórios: Excel gerado e relido; PDF gerado e conferido. O exemplo não apresenta avisos de origem sintética nesses arquivos.

As capturas compartilháveis estão na [galeria de evidências](../Evid%C3%AAncias%20visuais/%C3%8Dndice%20de%20evid%C3%AAncias.md), pasta **2026-10-15 - Editor e sensores**. Foram obtidas localmente com contas e banco exclusivos de QA; não comprovam o deploy remoto nem funcionamento de hardware real.

Permanecem fora desta entrega: cadastro visual de placas/sensores de clientes, comandos de manutenção, histórico de ocorrências técnicas, comunicação com ESP32 real e atualização automática do histórico sintético para apresentações futuras.
