# Clareza das análises — evidências locais de 11/11/2026

Rota `http://127.0.0.1:5190/painel/analise`, perfil Gerente fictício. Shopping QA Fictício, Pessoa QA e números totalmente simulados por interceptação `/api/v1/**` no navegador. Não houve consulta a banco, envio de mensagem, sensor físico ou publicação.

| Viewport | Tema claro | Tema escuro |
| --- | --- | --- |
| Desktop 1440×1000 | Aprovado | Aprovado |
| Tablet 768×1024 | Aprovado | Aprovado |
| Celular 390×844 | Aprovado | Aprovado |

42 PNGs: para cada tamanho/tema, `inicio`, `completa`, `situacao`, `filtros`, `avancados`, `sem-observacao` e `falha`. Exemplos: [desktop completo](desktop-light-completa.png), [card corrigido](desktop-light-situacao.png), [celular completo](celular-light-completa.png), [card escuro](desktop-dark-situacao.png).

Resultado observado: total fora da rosca, legenda legível, card da consulta sem altura esticada, explicações de indicadores e estados visíveis e indicadores em uma coluna no celular. Categorias neutras e dados avançados recolhidos preservados. Sem corte, overflow da página, overlay de framework ou erro inesperado de console. HTTP503 é falha simulada intencional e a recuperação foi aprovada.

Interações: abrir/cancelar filtros, aplicar setor/categoria e confirmar parâmetros, expandir Dados avançados por Enter, exportar Excel/PDF com assinatura de arquivo válida, ausência de observações, falha e Tentar novamente. Identidade de rota e conteúdo conferidos; também conferida altura do card menor que 440px e ausência de overflow interno. Nenhuma contagem foi inventada para preencher ausência.

Comandos: `npm.cmd --prefix vaggu-frontend run build`, `npm.cmd --prefix vaggu-frontend run lint`, `node ambiente.local/clareza-analises-qa.cjs`, `node scripts/verificar-documentacao.mjs`, `git diff --check`. Roteiro e downloads somente em `ambiente.local`, ignorado pelo Git. Browser plugin/skill não disponíveis na sessão; usado Playwright com Edge headless, preview e execução autorizados fora do isolamento. Capturas inspecionadas visualmente em desktop, celular e nos dois temas.

Limites: prova local com fixtures, sem homologação publicada ou teste com pessoas usuárias. Aviso conhecido de chunks acima de 500kB no build permanece. Evidências anteriores foram preservadas como histórico.
