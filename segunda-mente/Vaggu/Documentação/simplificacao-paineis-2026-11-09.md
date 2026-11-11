# Simplificação dos painéis — 09/11/2026

**Decisão posterior de 11/11:** nas análises, o usuário preferiu a composição anterior com categorias neutras, mais gráficos visíveis e técnicos recolhidos. Ver [hierarquia vigente](hierarquia-analises-2026-11-11.md); o diagnóstico datado abaixo permanece histórico.

## Brief adotado

Aplicamos o pedido do usuário “Refatoração de UX/UI, Simplificação da Navegação e Hierarquia de Informações”: reduzir informações simultâneas, consolidar mapa e monitoramento, recolher filtros complementares e destacar decisões operacionais, preservando pesquisa, diagnóstico, manutenção, relatórios e regras de acesso. A imagem fornecida registra a barra de atualização que motivou a revisão. O relato de uso do usuário orientou a mudança; não foram inventadas entrevistas ou aprovações externas.

O trabalho refina a identidade e os componentes existentes. Não cria tema, biblioteca, API, dados de demonstração no produto ou uma nova área principal de navegação.

## Diagnóstico e destino de cada informação

| Classe | Elemento encontrado | Resultado |
| --- | --- | --- |
| Essencial | Andar, pesquisa, disponibilidade, falhas e seleção de vaga | Permanecem no mapa; resumo do recorte mostra livres, ocupadas e indisponíveis, incluindo estados sem leitura neste último grupo |
| Essencial | Ocupação histórica, movimento e comparação espacial | Três indicadores principais: ocupação no período, entradas observadas e dia de maior ocupação; evolução diária e ocupação por setor em destaque |
| Secundário | Conectividade, sensor/placa, horários e confirmação candidata | Botão Diagnóstico e dados técnicos recolhidos nos detalhes da vaga |
| Secundário | Cobertura, permanência, rotatividade, categorias e tabela completa | Detalhes da análise; exportações continuam completas |
| Secundário | Cadastros de estrutura, equipamentos/manutenção e telões | Admin abre o mapa; configuração e edição ficam nas mesmas abas, com equipamentos e telões recolhidos na configuração |
| Redundante | Duas visualizações principais das mesmas vagas | Retirada a alternância Mapa/Monitoramento; o componente de monitoramento é reutilizado somente no diagnóstico |
| Desnecessário | Horário com segundos e botão Atualizando a cada consulta saudável | Retirados; atualização automática continua, com carregamento inicial, erro, desatualização e nova tentativa quando relevantes |

Não removemos o diagnóstico ou seus utilitários, usados também nos detalhes. Campos de cadastro, implantação, vínculo de equipamentos, seleção de vaga em edição e escolha da exibição salva de telão são controles de operação, não filtros de navegação.

## Filtros e navegação

- Mapa: setor, categoria e status em **Filtros**; andar e pesquisa de vaga/sensor/placa ficam visíveis. Busca exata continua navegando ao andar da vaga.
- Diagnóstico: situação do sensor em **Filtros**; pesquisa e contagem de atenção permanecem no diagnóstico.
- Editor: setor em **Filtros**; pesquisa e seleção da vaga continuam disponíveis sem sair da edição.
- Telões: ativos/revogados/todos em **Filtros**; pesquisa, cadastro e exibição salva preservados.
- Análises: período UTC de até 31 dias, setor e categoria em **Filtros**, com resumo e contagem do recorte aplicado.

Todos os popups usam os diálogos existentes, rascunho independente, Aplicar filtros, Limpar filtros e Cancelar. Escape/cancelamento descartam o rascunho; limpar aplica os valores padrão e fecha. No mapa, limpar conserva a pesquisa e o andar; na análise restaura os últimos sete dias UTC, sem setor/categoria. Nos telões, limpar mostra todos. Os diálogos permitem rolagem em telas pequenas e mantêm o foco de teclado. Ao fechar detalhes originados no diagnóstico, o foco retorna ao botão Diagnóstico; quando a origem ainda existe, retorna à vaga ou pesquisa correspondente.

## Dados e funcionalidades preservados

Polling do mapa continua a cada 500 ms, com pausa da renovação automática em aba oculta e proteção contra sobreposição; validade visual de 30 s preservada. A consulta não ganha spinner, horário ou anúncio a cada sucesso. Falha ou expiração continuam invalidando os estados exibidos: dado antigo não vira vaga livre. Não alteramos o hook de validade, firmware ou parâmetros de confirmação.

As análises continuam consultando o período anterior em paralelo, preservam a última consulta válida durante nova carga/erro e distinguem ausência de observação de ocupação zero. Cobertura parcial permanece sinalizada. O destaque de maior movimento usa o **dia de maior ocupação média observado**, não um horário de pico que a API não fornece. Excel e PDF conservam as métricas e o contexto completos mesmo quando os detalhes estão recolhidos.

Cadastro, manutenção de placas/sensores, ocorrências, seleção dos telões, importação, revisão de posições, desfazer e autorização por shopping permanecem nos serviços existentes. Nenhuma rota, contrato Prisma, autenticação ou regra de servidor foi alterada nesta entrega.

## Validação e evidências

Execução local com Edge/Playwright, preview em `http://127.0.0.1:5190`, fixtures fictícias interceptadas no navegador, sem banco, Meta, credenciais reais ou ESP32. A matriz usa desktop 1440×1000, tablet 768×1024 e celular 390×844 nos temas claro e escuro. O Browser plugin não estava disponível; usamos Playwright já instalado, com execução autorizada fora do isolamento. Os dados fictícios existem somente no roteiro de QA ignorado pelo Git, não no código do produto.

[Galeria atual e matriz de estados](../Evidências%20visuais/2026-11-09%20-%20Simplificacao%20dos%20paineis/README.md).

Foram exercitados aplicação/cancelamento/limpeza de filtros, manutenção do recorte durante polling, busca em outro andar, diagnóstico e detalhes técnicos por teclado, falha/recuperação de consulta, análises com dados/sem observação/carga lenta/erro e downloads Excel/PDF. A edição preservou seleção, alteração por seta, desfazer e erro de conflito visível ao salvar. A proteção de navegação do gerente foi conferida; isso não substitui teste de isolamento no servidor, cujo código não mudou.

Os testes identificaram e corrigiram feedback de salvamento oculto fora da configuração, retorno de foco após diagnóstico, sobreposição da exportação sobre a toolbar e pesquisa estreita no celular. A escolha do formato de relatório agora expande o cabeçalho em fluxo. A pesquisa ocupa sua própria linha em telas pequenas e os indicadores principais usam duas linhas no celular.

Comandos: `npm.cmd --prefix vaggu-frontend run build`, `npm.cmd --prefix vaggu-frontend run lint`, `node ambiente.local/ux-simplificacao-qa.cjs`, `node scripts/verificar-documentacao.mjs` e `git diff --check`. O roteiro temporário e os downloads de QA ficam em `ambiente.local`, ignorados. O build mantém o aviso conhecido de chunks grandes; a revisão visual não é um ensaio de carga nem homologação de produção.

## Rastreabilidade e limites

As alterações anteriores de documentação, contatos e dependências foram preservadas na branch local `codex/fix/pendencias-tcc-pietro`, base `20205056`; não foram transportadas para outra branch. Responsáveis indicados pelo escopo: Elisa para UX, Juan para UI e Pietro para integração, com Ana na documentação. Essas indicações não atribuem aprovação ou coautoria. Identidade Git preservada; sem commit, push, PR, publicação ou envio de mensagens nesta entrega.

A validação local não comprova carga no Render, integração física ou teste com usuários após a refatoração. O aceite web anterior de 04/11 permanece histórico; esta alteração de interface ainda requer conferência no ambiente de destino quando publicada. Evidências antigas continuam preservadas como histórico.
