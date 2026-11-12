# Análises com menos texto — 11/11/2026

Rota http://127.0.0.1:5190/painel/analise, Gerente fictício, Shopping QA Fictício. Fixtures interceptadas no navegador, sem banco, equipamento ou publicação.

Seis combinações aprovadas, 48 PNGs. Desktop 1440×1000, tablet 768×1024 e celular 390×844 nos temas claro e escuro. Cada combinação registra inicio, completa, situacao, estados, filtros, avancados, sem-observacao e falha.

Ajuste: retiradas explicações óbvias das entradas/saídas, gráficos e abertura. Ocupação/permanência mantêm ressalvas curtas. Explicação dos estados fica em Entender os estados, inicialmente recolhida e operável por teclado. Total fora da rosca e card compacto preservados. Apenas ícones das categorias têm cores discretas; fundos, títulos e números permanecem neutros.

Roteiro: node ambiente.local/analises-menos-texto-qa.cjs, Edge/Playwright com preview local autorizado fora do isolamento; Browser plugin/skill ausentes. Confere filtros/cancelamento/aplicação, teclado em estados e avançados, ausência/falha/recuperação, Excel/PDF, overflow, console e cores dos ícones. Build e lint frontend; node scripts/verificar-documentacao.mjs e git diff --check. Aviso conhecido de chunks grandes permanece. Evidências anteriores preservadas como histórico; prova local sem teste com usuários ou homologação publicada.

[Desktop completo](desktop-light-completa.png) · [Card compacto](desktop-light-situacao.png) · [Estados expandidos](desktop-light-estados.png) · [Celular](celular-light-completa.png).

Resultado final: build/lint aprovados; verificador documental com 1380 arquivos/71 documentos Markdown e diff check sem erros. Sem overflow, overlay ou erro inesperado de console. Inspeção visual do painel desktop claro e card celular escuro aprovada.
