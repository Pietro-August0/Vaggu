# Hierarquia das análises — 11/11/2026

**Complemento posterior de 11/11:** o usuário forneceu nova referência de painel e pediu remover a faixa superior. [Configurações e organização vigentes](configuracoes-e-painel-2026-11-11.md) centralizam ações pessoais e usam quatro indicadores compactos, preservando o registro anterior como histórico.

## Direção corrigida pelo usuário

O usuário preferiu a composição anterior à simplificação de 09/11: queria maior hierarquia visual e menos competição de cores, sem recolher tanto conteúdo. Esta decisão substitui a organização anterior das análises; filtros em popup, atualização silenciosa e consolidação do mapa permanecem. Não atribui aprovação à versão final implementada.

## Organização aplicada

- **Contexto discreto:** Vagas por categoria voltou à página principal em uma faixa neutra, com ícones/números cinza e sem quatro cartões coloridos. É o cadastro atual do recorte, não uma métrica histórica.
- **Ponto principal de leitura:** Resumo do período, com ocupação média em maior destaque e entradas registradas e tempo médio na vaga ao lado. A linguagem esclarece ocupações iniciadas e permanências com entrada/saída confirmadas; não presume identificação de veículos únicos.
- **Composição familiar:** evolução da ocupação e situação da última consulta na primeira linha de gráficos; entradas/saídas diárias e ocupação por setor na linha seguinte. A fotografia atual é identificada como consulta, sem alegar disponibilidade ao vivo.
- **Informação técnica secundária:** Dados avançados recolhe cobertura estimada, saídas, dia de maior ocupação, rotatividade e tabela completa. Os indicadores técnicos têm peso visual menor. Avisos de cobertura parcial, ausência e erro continuam visíveis quando necessários.

Período UTC, filtros, comparação anterior, proteção contra respostas antigas, tratamento de null, preservação da última consulta e relatórios completos não foram alterados. Não houve mudança em backend, autenticação, firmware, dados reais ou bibliotecas.

## Verificação

Build e lint do frontend aprovados. [Matriz e 36 prints](../Evidências%20visuais/2026-11-11%20-%20Hierarquia%20das%20analises/README.md): desktop 1440×1000, tablet 768×1024 e celular 390×844 nos temas claro/escuro, seis combinações aprovadas no Edge/Playwright com fixtures fictícias interceptadas no navegador. Conferidos layout, categorias neutras, métricas/gráficos, dados avançados recolhidos, teclado, filtros, ausência de observação, falha/recuperação e exportação Excel/PDF. Sem overflow ou erro inesperado; respostas 503 fazem parte do ensaio.

Comandos: `npm.cmd --prefix vaggu-frontend run build`, `npm.cmd --prefix vaggu-frontend run lint`, `node ambiente.local/hierarquia-analises-qa.cjs`, `node scripts/verificar-documentacao.mjs` e `git diff --check`. Browser plugin ausente; preview e QA fora do isolamento com autorização. Build mantém aviso conhecido de chunks grandes. Esta é prova local, sem nova homologação publicada ou pesquisa com usuários.

## Rastreabilidade

Trabalho incremental nos dois arquivos de análises, com documentação/prints e referência do README atualizadas. Branch local `codex/fix/pendencias-tcc-pietro`, base `20205056`, preservando as alterações anteriores. Indicação de responsabilidade: Elisa em UX, Juan em UI e Pietro na integração; autoria Git preservada, sem aprovação/coautoria atribuída, commit, push, PR ou publicação.
