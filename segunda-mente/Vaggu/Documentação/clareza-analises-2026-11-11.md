# Clareza e distribuição das análises — 11/11/2026

## Composição e categorias — revisão após comentários em produção

O usuário apontou cor pouco perceptível nas categorias, lacuna abaixo do card da consulta, legenda de cadastro desnecessária e distância entre Filtros e período. Os ícones agora têm badge sutil e os números usam a cor de cada categoria, com contraste nos dois temas; fundos inteiros permanecem neutros. Removido “Cadastro atual do recorte”. O botão Filtros passa à esquerda do período/recorte, no mesmo grupo visual e na ordem do teclado.

Os dois gráficos principais ficam em cards de altura equilibrada: a comparação com o período anterior passa para faixa própria abaixo dos gráficos e o traçado foi ajustado para11rem no desktop. Isso elimina a lacuna exterior sem devolver o grande espaço vazio interno ao card da rosca. Ajuda dos estados continua recolhida; resumo alinhado, cobertura contextual, filtros e métricas preservados. Sem mudança de fórmula ou API. [Evidências atuais](../Evidências%20visuais/2026-11-11%20-%20Composicao%20das%20analises/README.md).

Continuação na branch local existente, base `acfc4a76`, preservando todas as alterações. Sem commit/push por esta tarefa.

## Alinhamento do resumo

O usuário apontou que os conjuntos de ícone, valor e título ficavam em alturas diferentes quando um indicador não tinha apoio. Os quatro cards agora compartilham linhas consistentes e área inferior reservada, sem inserir texto vazio ou fictício. A borda superior também tem espessura uniforme para não deslocar a ocupação. [Capturas atuais](../Evidências%20visuais/2026-11-11%20-%20Alinhamento%20do%20resumo/README.md). Métricas e contratos preservados.

## Cobertura no contexto do indicador

O usuário considerou o aviso de cobertura parcial isolado no topo. Ele agora aparece discretamente no próprio card Ocupação média, substituindo o apoio e mantendo o percentual e a ressalva de tempo com leitura válida. Em cobertura completa ou ausente não há aviso parcial; ausência de observação e erro continuam explícitos. Sem mudança de cálculo, contrato ou API. [Capturas atuais](../Evidências%20visuais/2026-11-11%20-%20Cobertura%20no%20resumo/README.md).

## Refinamento posterior — menos texto e cor nos ícones

O usuário pediu retirar legendas que podem ser deduzidas. Removidos os apoios de entradas/saídas, descrições óbvias dos gráficos e orientação inicial. Ocupação/permanência preservam apenas ressalvas curtas; estados passaram para Entender os estados, fechado inicialmente. Ícones de categorias recebem cores discretas, sem colorir cards ou fundos. Total fora da rosca e card compacto permanecem. [Capturas atuais](../Evidências%20visuais/2026-11-11%20-%20Analises%20com%20menos%20texto/README.md). A seção abaixo registra a rodada anterior e suas motivações, substituída por este refinamento onde divergir. Continuação na mesma branch local, base após integração `185c0bbc`; sem commit/publicação.

Após a entrevista de decisões, o usuário confirmou preservar os gráficos, destacar o resumo, explicar os indicadores e separar Sem leitura de Indisponíveis. O print fornecido mostrou rótulo apertado no centro da rosca e espaço vertical vazio no card da última consulta.

## Ajustes

- Total retirado do centro da rosca e apresentado como número e “vagas no recorte atual”. Considera somente vagas ativas do recorte de setor/categoria, sem confundir cadastro atual com histórico do período.
- Card da consulta pontual deixa de esticar para igualar a altura do gráfico de evolução. Rosca e legenda permanecem juntas; não há texto espremido no furo.
- Orientação curta no início, explicações dos quatro indicadores e dos gráficos. Até 420 px, indicadores passam para uma coluna para preservar leitura dos títulos e explicações.
- Categorias discretas e Dados avançados recolhidos preservados. Filtros, comparação, estados de ausência/erro e exportações continuam disponíveis.
- Sem leitura e Indisponíveis continuam separados. Conferência de `estrutura/service.ts`: sem sensor resulta em ocupação desconhecida; sensor sem leitura válida, desativado ou em manutenção resulta em indisponibilidade. Corrigida a interpretação anterior de indisponibilidade como apenas “fora de uso”. Dado antigo nunca vira livre. [Glossário de domínio](../../../GLOSSARY.md) registra definições sem detalhes técnicos.

## Validação e limites

[Matriz e prints](../Evidências%20visuais/2026-11-11%20-%20Clareza%20das%20analises/README.md) locais com dados fictícios interceptados no navegador. Sem alteração de API, fórmulas, credenciais, banco, dependências ou hardware. A validação não comprova publicação ou sensores físicos.

Roteamento: Elisa como referência de UX e Juan de UI, com Pietro na integração; nenhuma participação, aprovação ou coautoria atribuída. Continuação na branch local `codex/fix/pendencias-tcc-pietro`, base `20205056`; alterações anteriores preservadas. Sem commit, push ou publicação.
