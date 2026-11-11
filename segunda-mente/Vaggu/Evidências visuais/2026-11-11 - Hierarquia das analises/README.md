# Hierarquia das análises — 11/11/2026

Rota `/painel/analise`, perfil Gerente fictício, Edge/Playwright no preview local `http://127.0.0.1:5190`. Shopping QA, estrutura e histórico simulados exclusivamente no navegador; não são dados reais nem nova demonstração adicionada ao produto. O Browser plugin não está disponível.

Ajuste solicitado pelo usuário: recuperar a composição anterior, reduzir cores em Vagas por categoria, destacar dados compreensíveis e recolher os avançados. Categorias usam ícones/números neutros; resumo destaca ocupação média, entradas registradas e tempo médio na vaga. Evolução/situação da última consulta e movimento/setores ficam visíveis. Dados avançados permanecem recolhidos.

| Viewport | Tema | Visão inicial | Página completa | Filtros | Avançados | Sem observação | Falha |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1440×1000 | claro | [Print](desktop-light-inicio.png) | [Print](desktop-light-completa.png) | [Print](desktop-light-filtros.png) | [Print](desktop-light-avancados.png) | [Print](desktop-light-sem-observacao.png) | [Print](desktop-light-falha.png) |
| 768×1024 | claro | [Print](tablet-light-inicio.png) | [Print](tablet-light-completa.png) | [Print](tablet-light-filtros.png) | [Print](tablet-light-avancados.png) | [Print](tablet-light-sem-observacao.png) | [Print](tablet-light-falha.png) |
| 390×844 | claro | [Print](celular-light-inicio.png) | [Print](celular-light-completa.png) | [Print](celular-light-filtros.png) | [Print](celular-light-avancados.png) | [Print](celular-light-sem-observacao.png) | [Print](celular-light-falha.png) |
| 1440×1000 | escuro | [Print](desktop-dark-inicio.png) | [Print](desktop-dark-completa.png) | [Print](desktop-dark-filtros.png) | [Print](desktop-dark-avancados.png) | [Print](desktop-dark-sem-observacao.png) | [Print](desktop-dark-falha.png) |
| 768×1024 | escuro | [Print](tablet-dark-inicio.png) | [Print](tablet-dark-completa.png) | [Print](tablet-dark-filtros.png) | [Print](tablet-dark-avancados.png) | [Print](tablet-dark-sem-observacao.png) | [Print](tablet-dark-falha.png) |
| 390×844 | escuro | [Print](celular-dark-inicio.png) | [Print](celular-dark-completa.png) | [Print](celular-dark-filtros.png) | [Print](celular-dark-avancados.png) | [Print](celular-dark-sem-observacao.png) | [Print](celular-dark-falha.png) |

**Resultado:** seis combinações aprovadas, 36 PNGs. Conferidos quatro itens de categoria visíveis com o mesmo fundo neutro, três métricas principais, gráficos visíveis e dados avançados recolhidos por padrão, teclado para expandir, filtros com cancelamento/rascunho/aplicação/limpeza, ausência distinta de zero, erro/recuperação, falta de overflow e erros inesperados de console. Os HTTP 503 são falhas deliberadas de QA. Excel e PDF foram baixados e suas assinaturas conferidas; arquivos ficam em `ambiente.local` ignorado.

Comando: `node ambiente.local/hierarquia-analises-qa.cjs`. Movimento reduzido habilitado. Capturas de desktop, celular e dados avançados foram abertas para inspeção visual. Não comprova produção, hardware, backend real ou aprovação por participantes.
