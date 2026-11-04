# Evidências complementares do TCC — 04/11/2026

A homologação completa do site foi confirmada pelo usuário. Estas capturas complementam o acervo visual com **API interceptada e dados fictícios locais**; não são uma nova homologação de produção nem prova de hardware.

Ambiente: Vite em http://127.0.0.1:5186; Microsoft Edge headless com Playwright 1.64.1; perfil Admin fictício; temas claro/escuro; desktop 1440×1000, tablet 768×1024 e celular 390×844. Nenhum acesso ou escrita em banco real, nenhuma emissão/captura de senha provisória, chave ou hash. Browser plugin not available; fallback Playwright conforme skill.

Rotas: importação em /admin/shoppings/shopping-ficticio/estrutura; gerentes e exclusão do shopping em /admin/shoppings/shopping-ficticio/gerentes; resultado da exclusão do shopping em /admin/shoppings.

## Capturas por estado

| Estado e resultado | Desktop claro / escuro | Tablet claro / escuro | Celular claro / escuro |
| --- | --- | --- | --- |
| Importação em processamento, controles bloqueados | [Claro](desktop-light-importacao-carregando.png) · [Escuro](desktop-dark-importacao-carregando.png) | [Claro](tablet-light-importacao-carregando.png) · [Escuro](tablet-dark-importacao-carregando.png) | [Claro](celular-light-importacao-carregando.png) · [Escuro](celular-dark-importacao-carregando.png) |
| Prévia válida e registros para criar | [Claro](desktop-light-importacao-valida.png) · [Escuro](desktop-dark-importacao-valida.png) | [Claro](tablet-light-importacao-valida.png) · [Escuro](tablet-dark-importacao-valida.png) | [Claro](celular-light-importacao-valida.png) · [Escuro](celular-dark-importacao-valida.png) |
| Confirmação preserva vagas e histórico | [Claro](desktop-light-importacao-confirmacao.png) · [Escuro](desktop-dark-importacao-confirmacao.png) | [Claro](tablet-light-importacao-confirmacao.png) · [Escuro](tablet-dark-importacao-confirmacao.png) | [Claro](celular-light-importacao-confirmacao.png) · [Escuro](celular-dark-importacao-confirmacao.png) |
| Resumo de importação confirmada | [Claro](desktop-light-importacao-sucesso.png) · [Escuro](desktop-dark-importacao-sucesso.png) | [Claro](tablet-light-importacao-sucesso.png) · [Escuro](tablet-dark-importacao-sucesso.png) | [Claro](celular-light-importacao-sucesso.png) · [Escuro](celular-dark-importacao-sucesso.png) |
| Erro por linha e confirmação bloqueada | [Claro](desktop-light-importacao-invalida.png) · [Escuro](desktop-dark-importacao-invalida.png) | [Claro](tablet-light-importacao-invalida.png) · [Escuro](tablet-dark-importacao-invalida.png) | [Claro](celular-light-importacao-invalida.png) · [Escuro](celular-dark-importacao-invalida.png) |
| Falha HTTP 503 controlada e mensagem de recuperação | [Claro](desktop-light-importacao-falha.png) · [Escuro](desktop-dark-importacao-falha.png) | [Claro](tablet-light-importacao-falha.png) · [Escuro](tablet-dark-importacao-falha.png) | [Claro](celular-light-importacao-falha.png) · [Escuro](celular-dark-importacao-falha.png) |
| Confirmação de exclusão; Escape cancela | [Claro](desktop-light-gerente-confirmacao.png) · [Escuro](desktop-dark-gerente-confirmacao.png) | [Claro](tablet-light-gerente-confirmacao.png) · [Escuro](tablet-dark-gerente-confirmacao.png) | [Claro](celular-light-gerente-confirmacao.png) · [Escuro](celular-dark-gerente-confirmacao.png) |
| Gerente removido e ação Desfazer disponível | [Claro](desktop-light-gerente-excluido.png) · [Escuro](desktop-dark-gerente-excluido.png) | [Claro](tablet-light-gerente-excluido.png) · [Escuro](tablet-dark-gerente-excluido.png) | [Claro](celular-light-gerente-excluido.png) · [Escuro](celular-dark-gerente-excluido.png) |
| Desfazer restaura o gerente fictício | [Claro](desktop-light-gerente-restaurado.png) · [Escuro](desktop-dark-gerente-restaurado.png) | [Claro](tablet-light-gerente-restaurado.png) · [Escuro](tablet-dark-gerente-restaurado.png) | [Claro](celular-light-gerente-restaurado.png) · [Escuro](celular-dark-gerente-restaurado.png) |
| Impacto da exclusão de shopping; Cancelar preserva | [Claro](desktop-light-shopping-confirmacao.png) · [Escuro](desktop-dark-shopping-confirmacao.png) | [Claro](tablet-light-shopping-confirmacao.png) · [Escuro](tablet-dark-shopping-confirmacao.png) | [Claro](celular-light-shopping-confirmacao.png) · [Escuro](celular-dark-shopping-confirmacao.png) |
| Após exclusão fictícia, retorno à listagem sem shopping | [Claro](desktop-light-shopping-excluido.png) · [Escuro](desktop-dark-shopping-excluido.png) | [Claro](tablet-light-shopping-excluido.png) · [Escuro](tablet-dark-shopping-excluido.png) | [Claro](celular-light-shopping-excluido.png) · [Escuro](celular-dark-shopping-excluido.png) |

## Interações e limites

- Arquivo fictício selecionado; foco no campo de upload, Tab até Gerar prévia e Enter para gerar. Estados de processamento, erro, sucesso e prévia inválida exercitados.
- Prévia válida → confirmação → aplicação fictícia; prévia inválida mantém confirmação desabilitada; HTTP 503 é intencional.
- Excluir gerente → Escape cancela → excluir → Desfazer → gerente restaurado. Excluir shopping → Cancelar → confirmar → lista sem o shopping. Todas as mutações ocorrem apenas nas fixtures em memória.
- Sem overflow horizontal da página, overlay do Vite ou erros JavaScript inesperados nas seis combinações. O console HTTP 503 do cenário de falha é esperado. Diálogos extensos usam rolagem vertical interna; tabelas podem usar rolagem horizontal interna, sem alargar a página.
- Foram refinadas as capturas para mostrar registros/erros na rolagem do diálogo; não foi alterado CSS ou comportamento do produto para produzir os prints.
- Inventário de Computer Use não mostrou sessão controlável do WhatsApp, nem aba correspondente. Não foram abertas conversas privadas nem fabricada uma captura do mensageiro. Confirmação funcional anterior preservada; captura real permanece indisponível nesta sessão.
- Prints anteriores de landing, login, painel, análises, equipamentos e telões permanecem no índice com suas datas. Como não houve mudança visual dessas telas, não foram substituídos.
- [Resultados estruturados](resultados.json) registram rota, perfil, viewport, tema, estado, origem e checks de cada captura.
