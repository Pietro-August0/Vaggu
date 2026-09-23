# Sprints do projeto VAGGU

Este documento registra a sequência das sprints da equipe em linguagem simples. Ele não substitui os pacotes técnicos `P01` a `P11`: as sprints organizam o trabalho do grupo e os pacotes registram dependências e critérios técnicos do sistema.

## Fontes e limites

- As Sprints 1 e 2 foram confirmadas pela equipe em 23/09/2026. Como ainda não foram fornecidas datas, tarefas individuais ou atas, esses campos permanecem como `PENDENTE DE DEFINIÇÃO`.
- As Sprints 3 e 4 foram transcritas das fotografias fornecidas pela equipe em 23/09/2026. A Sprint 3 informa o período de 09/09/2026 a 16/09/2026; a Sprint 4 não apresenta período legível.
- As fotografias registram o planejamento feito naquele momento. Elas não comprovam sozinhas que todas as tarefas foram concluídas.

## Sprint 1 — descoberta do problema

**Estado:** realizada, conforme relato da equipe.

**Objetivo:** fazer brainstorming, revisar problemas que poderiam ser resolvidos e desenvolver uma ideia inicial para o TCC.

**Trabalho realizado:** discussão coletiva dos problemas, possibilidades de solução e direção inicial do projeto.

**Responsáveis:** participação coletiva; divisão individual `PENDENTE DE DEFINIÇÃO`.

**Resultado:** base de ideias usada para iniciar a definição da VAGGU.

**Período e evidências adicionais:** `INFORMAÇÃO A SER FORNECIDA`.

## Sprint 2 — definição inicial da VAGGU e planejamento do Figma

**Estado:** realizada, conforme relato da equipe.

**Objetivo:** começar a transformar a ideia em VAGGU, avaliar o que funcionava ou não nas propostas e planejar o protótipo no Figma.

**Trabalho realizado:** refinamento do escopo, descarte de ideias incompatíveis e preparação da direção visual e dos primeiros fluxos.

**Responsáveis:** participação coletiva; divisão individual `PENDENTE DE DEFINIÇÃO`.

**Resultado:** conceito da VAGGU mais definido e base para as primeiras telas.

**Período e evidências adicionais:** `INFORMAÇÃO A SER FORNECIDA`.

## Sprint 3 — primeiros componentes e base técnica

**Período registrado:** 09/09/2026 a 16/09/2026.

**Objetivo:** concluir a landing page e a tela de login por convite, iniciar testes com Arduino, criar APIs e estruturar melhor o backend.

| Integrante | Atividade registrada |
| --- | --- |
| Samuel | Ver possibilidades de API e tabelas do banco e iniciar a criação das APIs. |
| Pietro | Configurar e testar Arduino e trabalhar na landing page. |
| Ana | Programar a tela de login por convite. |
| Elisa | Programar a tela de login por convite. |
| Juan | Programar a landing page. |
| Kamilly | Configurar e testar Arduino. |

**Evidência:** [[Vaggu/Evidências visuais/Planejamento/sprint-03-planejamento-09-09-2026.jpeg]].

**Limite:** o registro indica o planejamento da sprint. A conclusão de cada atividade deve ser conferida pelo código, testes e histórico do repositório.

## Sprint 4 — organização, protótipo físico e apresentação

**Período registrado:** `PENDENTE DE DEFINIÇÃO`.

**Objetivo:** organizar documentação e cronogramas, avançar no protótipo do Arduino, preparar banco e Power BI e montar uma nova apresentação do projeto.

| Integrante | Atividade registrada |
| --- | --- |
| Ana | Documentação e organização de cronogramas. |
| Elisa | Documentação e organização de cronogramas. |
| Pietro | Primeira prototipação de Arduino. |
| Kamilly | Primeira prototipação de Arduino. |
| Juan | Pesquisas e novos conhecimentos sobre Power BI. |
| Samuel | Subir o banco de dados. |
| Equipe | Organizar um novo pitch para o professor Giovanni, mostrando avanços e o sistema disponível naquele momento. |

**Evidência:** [[Vaggu/Evidências visuais/Planejamento/sprint-04-divisao-equipe.jpeg]].

**Limite:** o registro indica tarefas planejadas. A existência de banco, protótipo ou relatório funcional precisa de evidência técnica separada.

## Relação com os pacotes técnicos

As sprints acima começaram antes da organização atual do repositório em pacotes `P01` a `P11`. Não existe correspondência numérica direta: a Sprint 1 não é o pacote P01, e a Sprint 4 não é o pacote P04.

- As sprints contam a evolução do trabalho da equipe.
- Os pacotes técnicos registram dependências, implementação verificada e critérios de aceite.
- O estado atual dos pacotes permanece em [[Vaggu/Documentação/planejamento-do-projeto]].

## Próxima sprint proposta — correção e consolidação

**Número:** Sprint 5, a confirmar pela equipe.

**Objetivo:** alinhar documentação e implementação antes de iniciar a telemetria do P06.

| Frente | Responsável principal | Revisores | Resultado esperado |
| --- | --- | --- | --- |
| PRD, sprints e organização | Ana | Samuel e Pietro | Produto, histórico e ordem de trabalho compreensíveis. |
| TRD, banco e API | Samuel | Kamilly e Pietro | Tecnologias, entidades e endpoints atuais separados do que ainda é planejado. |
| Fluxos e experiência | Elisa | Ana e Pietro | Telas reais e ausentes documentadas por perfil e ação. |
| Identidade e evidências | Juan | Elisa e Ana | Paleta, tipografia e capturas com origem e limites registrados. |
| Preparação da telemetria | Kamilly | Samuel e Pietro | Contrato de firmware pronto para o P06, sem criar endpoints antes da decisão. |

**Dependências:** concluir as correções documentais prioritárias, confirmar as lacunas atuais da interface e validar com a equipe os campos ainda marcados como pendentes.

**Critério de conclusão:** documentação canônica sem contradições conhecidas, matriz de rastreabilidade atualizada, evidências catalogadas e primeira decisão do contrato de telemetria pronta para revisão.

Detalhamento da execução: [[Vaggu/Planejamento/Plano de correção e implementação]].

## Sequência posterior

1. Corrigir as divergências funcionais atuais da interface que foram identificadas na auditoria.
2. Executar o P06: telemetria, confirmação e expiração confiáveis.
3. Executar P07 e P08: operação, telões, histórico, métricas e exportações.
4. Executar P09: primeiro relatório funcional Power BI.
5. Concluir P10 e P11 conforme dependências externas e roteiro da apresentação.
