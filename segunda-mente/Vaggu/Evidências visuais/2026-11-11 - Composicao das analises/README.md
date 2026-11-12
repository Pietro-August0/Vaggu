# Composição das análises — 11/11/2026

Gerente fictício em http://127.0.0.1:5190/painel/analise; Shopping QA Fictício com fixtures interceptadas no navegador. Sem banco, hardware ou publicação.

Viewports: desktop amplo1625×884, desktop1440×1000, tablet768×1024 e celular390×844, claro/escuro. Capturas por combinação: resumo, início, completo, situação, estados, filtros, avançados, cobertura completa, cobertura ausente, sem observação e falha.

Resultado: cores presentes no ícone com badge discreto e no número das categorias, sem saturar superfícies. Legenda do cadastro retirada. Filtros à esquerda junto ao período, com rascunho/aplicação/cancelamento preservados. Comparação histórica fora dos cards, numa faixa abaixo da dupla; alturas dos cards principais conferidas iguais no desktop, com traçado reduzido e sem lacuna exterior. Total fora da rosca e ajuda recolhida preservados.

Roteiro ignorado node ambiente.local/composicao-analises-qa.cjs: oito combinações, cores dos ícones/números, DOM e posição dos filtros, alinhamento dos quatro KPIs, geometria dos cards, abertura/fechamento dos estados/avançados por teclado, filtros/cancelamento/aplicação e parâmetros enviados, cobertura94%/100%/null, ausência/falha/recuperação. Exports não repetidos por não terem sido alterados. Sem overflow, framework overlay ou console inesperado.

Playwright/Edge headless porque Browser plugin/skill não disponíveis na sessão; preview e QA autorizados fora do isolamento. Build e lint executados com scripts existentes; node scripts/verificar-documentacao.mjs e git diff --check. Aviso conhecido de chunks grandes permanece. Provas locais não substituem produção ou teste com usuários. Evidências anteriores preservadas.

[Desktop amplo](desktop-amplo-light-inicio.png) · [Desktop completo](desktop-light-completa.png) · [Celular escuro](celular-dark-completa.png).

Oito combinações aprovadas, 88 PNGs atuais. Inspeção visual desktop amplo claro e tablet escuro aprovada. Build/lint exit0.
