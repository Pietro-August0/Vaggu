# Pesquisa e filtros antes dos andares — 11/11/2026

Rota local: /painel. Perfil: gerente fictício Pessoa QA, Shopping QA Fictício. Origem: fixtures interceptadas somente no navegador, sem API/banco reais. Viewports: desktop 1625×884, tablet 768×1024 e celular 390×844, temas claro e escuro. Não comprova publicação, hardware nem dados de produção.

## Resultado

Trinta capturas documentam seis combinações aprovadas: início, andar selecionado, diálogo de filtros, recorte aplicado e pesquisa exata que abre detalhes. Pesquisa, Filtros e Diagnóstico aparecem antes dos botões de andar tanto no DOM quanto na navegação por Tab. Troca de andar, categoria PCD, limpeza e busca B01 foram exercitadas. Sem overflow horizontal ou erros de console. O foco visível no botão Térreo das capturas iniciais registra a verificação por teclado.

Browser plugin não disponível no catálogo da sessão; usado Playwright/Edge local. Script ignorado: ambiente.local/ordem-mapa-qa.cjs. Build conjunto fornecido pelo fluxo de validação das análises; nenhuma dependência adicionada. Resultado detalhado local: ambiente.local/ordem-mapa-resultado.json.

- [Desktop claro](desktop-light-inicio.png)
- [Tablet claro](tablet-light-inicio.png)
- [Celular escuro](celular-dark-inicio.png)
- [Filtros no celular](celular-light-filtros.png)
- [Busca exata no desktop](desktop-light-pesquisa.png)

O componente compartilhado mantém a lógica de filtros, contagens e seleção; esta rodada mudou somente a ordem dos controles.
