# Configurações e organização do painel — 11/11/2026

## Orientação do usuário

O usuário forneceu uma referência de dashboard com indicadores compactos e um gráfico principal e pediu reunir Minha conta, modo escuro, solicitação de alterações e saída em Configurações. Na sequência, pediu retirar a faixa superior que repetia Área do cliente, título da página e Acesso autenticado. A referência orienta hierarquia e proporções; mantivemos a identidade amarela/escura e os dados reais disponíveis da VAGGU, sem incorporar conteúdo médico ou criar funções fictícias.

## Comportamento atual

- **Desktop:** a faixa superior foi retirada; o menu lateral contém a navegação de trabalho e Configurações no rodapé. Os títulos do próprio conteúdo permanecem. Um título H1 somente para leitores de tela e o landmark nomeado preservam contexto sem repetir a faixa visual.
- **Celular/tablet:** apenas controles compactos para abrir navegação e configurações. O menu móvel também contém Configurações e devolve o foco ao seu botão quando necessário.
- **Configurações:** uma janela acessível reúne conta, aparência e sessão. Gerentes também encontram Solicitar alterações, por WhatsApp quando válido ou e-mail como alternativa. As ações pessoais deixam de competir com a navegação principal.
- **Minha conta:** reutiliza o formulário existente como subárea na mesma janela, com Voltar às configurações. O diálogo preexistente de alteração de senha foi preservado. E-mail, perfil e vínculo continuam protegidos no servidor.
- **Aparência:** claro e escuro usam o ThemeProvider/armazenamento já existentes, sem novo serviço de preferências.
- **Saída:** chama o logout existente; bloqueia nova ação durante envio, mantém falha na janela e navega ao login após sucesso. Não foi adicionada saída apenas visual.
- **Compatibilidade:** /admin/conta e /painel/conta continuam abrindo Minha conta. Voltar leva à tela inicial mantendo configurações; fechar encerra a janela e devolve o contexto/foco. O conteúdo principal recebe foco após navegação interna.

## Análises alinhadas à referência

Quatro cartões compactos no topo mostram ocupação média, entradas, saídas e tempo médio na vaga. Categorias permanecem neutras e passam para uma faixa abaixo do resumo. O gráfico de evolução ocupa mais largura; situação da última consulta é complementar. Movimento/setores permanecem na linha seguinte e os dados técnicos continuam recolhidos. Filtros em popup, tratamento de ausência, comparação e exportações completas são preservados. Nenhuma métrica foi inventada nem consulta da API alterada.

## Validação

Build e lint frontend aprovados. [Matriz e capturas](../Evidências%20visuais/2026-11-11%20-%20Painel%20e%20configuracoes/README.md): 12 combinações de dois perfis, três tamanhos e dois temas aprovadas em Edge/Playwright com fixtures interceptadas no navegador. Conferidos abertura pelo teclado, foco ao fechar, menu móvel, alternância de tema, conta/PATCH simulado, senha sem preenchimento, rotas legadas e logout503/204. Não houve envio ao contato externo. Prints adicionais de mapa/editor atualizam as experiências afetadas pelo componente compartilhado. Sem overflow ou erro inesperado.

Comandos: `npm.cmd --prefix vaggu-frontend run build`, `npm.cmd --prefix vaggu-frontend run lint`, `node ambiente.local/painel-configuracoes-qa.cjs`, `node ambiente.local/painel-configuracoes-prints.cjs`, `node scripts/verificar-documentacao.mjs` e `git diff --check`. Browser plugin ausente; preview/QA autorizados fora do isolamento. O aviso conhecido de chunks grandes permanece.

## Limites e rastreabilidade

Somente frontend, documentação e evidências. Sem alteração de API, banco, credenciais, dependências ou hardware nesta rodada. Provas locais não substituem conferência no ambiente publicado e avaliação com usuários. Referências de 09/11 e a revisão anterior de 11/11 permanecem históricas, substituídas por esta organização onde divergirem.

Branch local `codex/fix/pendencias-tcc-pietro`, base `20205056`, com todo trabalho anterior preservado. Indicação de responsabilidade: Elisa em UX, Juan em UI e Pietro na integração, Ana em documentação; identidade Git preservada, sem aprovação/coautoria atribuída, commit, push, PR, publicação ou mensagens.
