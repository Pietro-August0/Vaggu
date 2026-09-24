---
tags: [vaggu, evidencias, interface]
---
# Evidências visuais da VAGGU

Capturas geradas durante validações locais da interface e referências fornecidas pela equipe. Elas documentam o estado observado ou planejado na data de origem; não comprovam sensores, serviços externos, produção nem a interface atual sem nova validação.

> [!important] Estado histórico
> As capturas de P02, P03, P04 e “Melhorias — interações e gerentes” são registros históricos de versões anteriores. O código atual pode divergir delas. A exclusão reversível de gerente está novamente implementada na ficha atual, mas os prints antigos não comprovam seu visual de hoje.

## 24/09/2026 — capturas públicas atuais

Capturadas no frontend local com Chromium/Playwright após aguardar as animações. A largura móvel foi 390 px e a desktop, 1440 px. Não havia sessão autenticada, banco ou deploy sob teste; portanto estas imagens **não** validam Admin, gerente, mapa ou produção.

| Área | Captura | O que mostra |
| --- | --- | --- |
| Landing móvel | ![[Vaggu/Evidências visuais/landing-mobile-2026-09-24.png]] | Hero e acesso ao login em 390 px. |
| Rodapé móvel | ![[Vaggu/Evidências visuais/rodape-mobile-2026-09-24.png]] | Marca, chamada e links, sem a imagem de celulares. |
| Rodapé desktop | ![[Vaggu/Evidências visuais/rodape-desktop-2026-09-24.png]] | Imagem de celulares preservada em 1440 px. |
| Login móvel | ![[Vaggu/Evidências visuais/login-mobile-2026-09-24.png]] | Formulário de entrada em 390 px, sem credenciais. |

No ensaio, o documento não apresentou transbordamento horizontal nas duas larguras e o navegador não registrou erros de página. A ausência de número oficial explica por que o rodapé não mostra botão de WhatsApp; outras chamadas da landing ainda precisam da mesma guarda.

## P02 — Login — histórico

Exemplo principal: ![[Vaggu/Evidências visuais/P02 - Login/login-desktop-final.png]]

- `login-desktop.png` e `login-mobile.png`: composição inicial validada.
- `login-desktop-com-assets.png` e `login-mobile-com-assets.png`: aplicação dos assets entregues pela equipe.
- `login-desktop-final.png` e `login-mobile-final.png`: resultado final usado na validação do P02.

## P03 — Administração — histórico

Exemplo principal: ![[Vaggu/Evidências visuais/P03 - Administração/p03-admin-desktop.png]]

- `p03-admin-desktop.png`: gestão administrativa em desktop.
- `p03-admin-mobile.png`: responsividade da gestão administrativa.
- `p03-minha-conta.png`: edição permitida da conta do gerente.

## P04 — Estrutura e mapa — histórico

Exemplo principal: ![[Vaggu/Evidências visuais/P04 - Estrutura e mapa/p04-gerente.png]]

- `p04-admin.png`: configuração de andares, setores, vagas, categorias e posições.
- `p04-gerente.png`: mapa do shopping para o gerente.
- `p04-mobile.png`: mapa e controles em largura móvel, sem rolagem horizontal.

## Origem das capturas de validação

As capturas foram copiadas de pastas temporárias de validação em 12/09/2026. As cópias versionadas nesta área são as referências compartilháveis pelo time; caminhos externos registrados nos diários são apenas evidência histórica da máquina onde a validação ocorreu. Novas imagens da VAGGU devem ser guardadas aqui e citadas no diário correspondente.

## Melhorias — interações e gerentes — histórico

Exemplo principal: ![[Vaggu/Evidências visuais/Melhorias - interações e gerentes/confirmacao-excluir-gerente.png]]

- `login-rabisco-animado.png`: resultado final do contorno SVG desenhado em torno de “vagas”.
- `confirmacao-excluir-gerente.png`: modal de uma versão anterior; não representa necessariamente a ficha atual.
- `aviso-desfazer-exclusao.png`: aparência anterior da ação “Desfazer” durante sete segundos. O comportamento existe novamente, mas precisa de print atual para comparação visual.

## Planejamento e identidade — material fornecido pela equipe

Pasta de destino: `Vaggu/Evidências visuais/Planejamento/`.

- `sprint-03-planejamento-09-09-2026.jpeg`: quadro da Sprint 3, com período de 09/09 a 16/09, divisão inicial de tarefas para API/banco, Arduino, login e landing page e resumo do planejamento.
- `sprint-04-divisao-equipe.jpeg`: folha da Sprint 4 com divisão de documentação, cronogramas, prototipação de Arduino, pesquisa de Power BI, banco de dados e preparação de novo pitch.
- `guia-identidade-visual-vaggu.png`: guia fornecido pela equipe com logotipo, Poppins e paleta `#ffe100`, `#ffeb54`, `#fff49d`, `#343231`, `#171717`, `#000000` e `#ffffff`. É referência da equipe, não extração do Figma.

Esses três arquivos registram planejamento e direção visual; não comprovam a conclusão das tarefas citadas nem fidelidade das telas ao Figma.

Ver [[Vaggu/Diário/2026-09-12]] e [[Vaggu/Vaggu]].
