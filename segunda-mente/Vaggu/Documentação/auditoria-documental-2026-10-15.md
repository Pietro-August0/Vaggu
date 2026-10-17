# Auditoria documental e pendências — 15/10/2026

Base funcional inspecionada: commit `c505b78`. Esta revisão compara o repositório com seus documentos; não certifica hardware, produção ou ausência absoluta de defeitos. As alterações desta auditoria são documentais e no verificador, sem implementar os módulos pendentes.

## Resultado

A navegação local, o inventário dos arquivos e os resumos atuais foram reconciliados. Havia contradições: editor e monitoramento recentes não apareciam em alguns índices; validade do mapa, seleção de período e exportações ainda eram listadas como ausentes; a arquitetura afirmava que a tela recebia novas leituras automaticamente. Também havia uma descrição incorreta de movimento reduzido e instruções de criação de bancos sem explicitar a execução fora de uma transação.

Os documentos agora distinguem:

- **Implementado:** código e evidência correspondente encontrados.
- **Parcial:** parte existe, mas faltam comportamentos do aceite.
- **Não verificado externamente:** publicação, hardware ou serviço conectado não conferidos nesta sessão.
- **Histórico:** evidência datada preservada; não deve ser lida como estado atual.

## Inventário funcional conferido

| Área | Estado observado | Evidência no repositório |
| --- | --- | --- |
| Login, sessão, primeira senha e isolamento | Implementados e testados na entrega anterior | `src/auth`, cookie HttpOnly, serviços administrativos e testes PostgreSQL. |
| Shoppings, vários gerentes e Minha conta | Implementados | Rotas e páginas Admin/Gerente; exclusão lógica, desfazer de gerente e emissão única de senha provisória. |
| Hierarquia e importação CSV/XLSX | Implementadas | `src/estrutura`, `src/importacao`, prévia e confirmação idempotente. |
| Mapa e edição direta | Implementados | `editor-mapa-vagas.tsx`, arraste/toque/teclado, tamanho/rotação, rascunho, revisão concorrente e prints de 15/10. |
| Monitoramento individual | Consulta implementada | Projeção `monitoramento` da estrutura, cartões, filtros e detalhes. Cadastro operacional de equipamentos e ordens de manutenção não estão entregues. |
| Telemetria e expiração | Backend implementado; integração física pendente | `src/telemetria`, provisionamento/simulador por scripts e testes PostgreSQL. |
| Histórico, período e comparação | Implementados parcialmente | `src/analiticos`, recorte de até 31 dias UTC e comparação com período anterior. |
| Exportações | XLSX estrutural e Excel/PDF analíticos implementados | Serviços locais de exportação; não há uma API REST de exportação a documentar como existente. |
| Shopping Exemplo | Implementado como apresentação | Provisionamento idempotente de 80 vagas, histórico, quatro placas e 80 sensores. Fonte sintética preservada internamente; textos públicos neutros conforme pedido. |
| Telões | Prévia autenticada por andar/setor; P07 ainda parcial | `/painel/telao` e `/painel/telao/andares/:andarId` usam a estrutura autorizada do gerente. Instalação pública, autorização própria e configuração do recorte ainda ausentes. |
| Power BI | Preparação de dados implementada; integração final pendente | View SQL, fixtures e testes. Nenhum PBIX/PBIP/PBIT final versionado; o protótipo externo citado no diário não foi acessado. |
| WhatsApp | Infraestrutura e menu parcial | Webhook assinado, deduplicação, cliente Meta e menu de teste; opções ainda retornam mensagem de configuração do fluxo. |

## O que falta, por prioridade

| Prioridade | Pendência concreta | Evidência e critério para encerrar |
| --- | --- | --- |
| Alta | Atualizar mapa/monitoramento automaticamente | `mapa-estacionamento.tsx` consulta ao carregar. O `setInterval` de `app-store.tsx` verifica sessão, não vagas. Implementar transporte/refetch, perda de conexão e invalidação do dado que ficou antigo na tela. |
| Alta | Diferenciar cobertura zero de ocupação zero — CA28 | `percentual()` em `src/analiticos/service.ts` devolve 0 se o denominador é zero. Reprodução local: uma vaga com uma hora somente `INDISPONIVEL` retorna `temHistorico=true`, ocupação 0%, cobertura 0%. Falta representar e exibir “sem observação suficiente”, inclusive nos arquivos. |
| Alta | Conferir a versão publicada | Push foi confirmado; sucesso do deploy, migrations, criação do exemplo, login, mapa e exportações no domínio real precisam de validação autenticada. Verificar o workflow/hook e a saúde do Render sem expor segredos. |
| Alta para operação real | ESP32, tempos e retomada de comunicação | Exercitar o firmware com credencial, inicialização/sequência, frequência, confirmação, falha isolada e falha/retorno da placa. Os tempos atuais são provisórios; dados sintéticos não encerram esse aceite. |
| Média | Cadastro/vínculo de placas e sensores; manutenção/ocorrências | Existem scripts de provisionamento e consulta visual. Faltam operações administrativas, manutenção manual, ocorrências sem duplicação e conciliação com retorno da comunicação — CA23/CA24. |
| Média | Preservar a classificação histórica — CA30 | A view `power_bi_intervalos_ocupacao` associa eventos ao cadastro atual de `Vaga`, `Setor` e `Andar`. Falta vigência/snapshot para relatórios anteriores a uma alteração cadastral. |
| Média | Completar P08 | Faltam filtros analíticos por setor/categoria, saídas, ciclos completos, permanência e rotatividade com regra e testes. CA31 permanece parcial pelos filtros, não por ausência de XLSX. |
| Média | Completar instalação de telões e agregados — P07 | A prévia autenticada já mostra somente estados confirmados. Falta contrato de instalação/autorizações, configuração administrativa do recorte e validação de atualização/estado desatualizado no ambiente de uso. |
| Média | Relatório funcional e acesso Power BI — P09 | Entregar artefato reproduzível, conexão/medidas/atualização e isolamento por shopping. O registro de um protótipo externo não comprova CA32/CA33. |
| Média | Fluxos completos e homologação WhatsApp — P10 | Confirmar configuração comercial, concluir opções de atendimento e testar Meta real. Reentrega pode duplicar resposta após envio externo e falha antes da confirmação local. |
| Antes da apresentação | Atualizar controladamente o cenário e repetir o roteiro | O histórico do exemplo é criado uma vez; os dias passam e saem da janela padrão. Preparar uma rotina específica se houver apresentação posterior, preservando IDs e acessos. |
| P11 | Completar evidências e decisões operacionais | Regressão integrada autenticada em produção, capturas de importação/exclusões/erros, acessibilidade ampla e celular físico; versionar roteiro E2E reproduzível. Backups/restauração e retenção de prévias/replay precisam de decisão e evidência operacional. |

O editor protege a troca de piso/aba e o fechamento/reload do navegador com rascunho; o bloqueio de navegação interna por outros links ainda é uma evolução registrada no guia da entrega. O aviso conhecido de bundle acima de 500 kB não impede o build; tipagem estrita progressiva do backend também permanece melhoria técnica.

## Correções documentais aplicadas

- Índice principal, próximos passos, plano de correção, PRD, TRD, SSD, modelo de dados e matriz de aceite alinhados ao editor, monitoramento, validade na consulta e Excel/PDF.
- Separadas validade no servidor e atualização automática da tela; removida a afirmação de que o mapa já recebe telemetria nova sem recarga.
- CA31 reconciliado com SSD §10.3: PDF e planilha, com XLSX na entrega atual. O SSD permite CSV como alternativa; não foi criado um requisito novo de CSV.
- Modelo de dados passou a explicitar `Shopping.demonstracao`, campos de `Sensor`, relações do diagrama e a exceção de expiração do exemplo.
- Motion documentado conforme `MotionConfig reducedMotion="user"` e regras CSS existentes, sem prometer cobertura integral de toda animação.
- Contrato de login esclarece cookie e resposta web sem token versus Bearer legado; exceção de emissão imediata da senha provisória explicitada no guia de contribuição.
- Configuração orienta executar `CREATE DATABASE` fora de transação, uma instrução por vez no pgAdmin.
- Histórico antigo preservado com contexto; estado atual recebe prioridade sobre resultados datados de outras máquinas/entregas.

## Verificações desta auditoria

As 13 entidades Prisma têm menção no modelo de dados. Permanecem dependentes de fontes da equipe as personas, datas/divisão individual de sprints históricas e medidas finais do Figma. A documentação registra essas lacunas; não foram preenchidas com informação inventada.

`node scripts/verificar-documentacao.mjs` passou após a reconciliação. O verificador agora abrange todos os Markdown versionáveis, incluindo README da raiz, backend e CONTRIBUTING, e verifica destinos e âncoras de links Markdown locais. Blocos de código são ignorados. Os wikilinks existentes foram conferidos quanto ao arquivo de destino; não há wikilinks com âncora no conjunto atual.

Um ensaio negativo temporário confirmou detecção de arquivo ausente e âncora ausente no README, aceitação de âncora válida e ausência de falso positivo em bloco de código. A fixture foi removida ao terminar. `git diff --check` e a conferência de integridade/quantidade dos oito PNGs da última entrega também foram executados.

Os 114 testes PostgreSQL/backend, lint/build e os testes de navegador/Excel/PDF pertencem à entrega funcional anterior de 15/10 (`c505b78`), cujo código da aplicação não foi alterado por esta auditoria. A reprodução de CA28 executou apenas a função de agregação local, sem banco de produção.

Não foram verificados nesta sessão: links externos, execução dos serviços publicados, anexos/fontes externos, hardware, contas Meta/Power BI, backup/restauração e todos os critérios de aceite. Por isso, “documentação reconciliada e verificações locais aprovadas” não equivale a sistema integralmente concluído ou garantia de zero falhas.

## Referências atuais

- [Planejamento canônico](planejamento-do-projeto.md) e [critérios de aceite](plano-e-aceite.md).
- [Edição visual e monitoramento](edicao-visual-e-monitoramento.md).
- [Galeria e oito capturas atuais](../Evid%C3%AAncias%20visuais/%C3%8Dndice%20de%20evid%C3%AAncias.md).
- [Modelo de dados](modelo-de-dados.md) e [inventário da API](../../../vaggu-backend/README.md).

## Retomada adiada por solicitação do usuário

Em 15/10/2026, o usuário pediu guardar as lacunas documentais para depois. Permanecem registradas para retomada: fontes das personas; datas e divisão das sprints 1–2 e período da sprint 4; aprovação da identidade visual e medidas do Figma; decisões de frequência, confirmação, expiração e manutenção dos sensores; alcance de Power BI e WhatsApp na apresentação; validação autenticada da versão publicada. Não preencher essas informações por suposição. As pendências funcionais da tabela acima continuam abertas.


## Atualização das datas das sprints — 16/10/2026

A equipe confirmou a Sprint 5 atual, com encerramento e início da Sprint 6 em 21/10/2026. Os períodos das Sprints 1–6 foram calculados em ciclos semanais de quarta a quarta no [registro das sprints](../Planejamento/Sprints%20do%20projeto.md). A lacuna de calendário recebeu uma referência atual; permanecem pendentes a divisão individual histórica e a conciliação com a fonte antiga que datava a Sprint 3 em 09–16/09. O calendário calculado não comprova conclusão das tarefas.


## Atualização de personas e cobertura do mapa — 16/10/2026

Recebidos os dois slides de Carlos; ficha consolidada em [[Vaggu/Especificações/Personas]], com complementos e Mariana/Rafael identificados como propostas para validação. A lacuna de recebimento do material foi parcialmente resolvida, mas pesquisa de campo e aprovação dos perfis continuam pendentes. Necessidades de lojas não foram incorporadas ao escopo.

Mapa ampliado com sete assets otimizados e o script de compressão, a partir dos arquivos e referências do frontend. As pendências históricas das seções anteriores devem ser lidas com estas atualizações. Permanecem necessárias aprovação visual, decisões operacionais dos sensores, alcance de Power BI/WhatsApp, conciliação e divisão das sprints e validação publicada.


## Aprovação visual encerrada — 16/10/2026

A equipe aprovou o visual atual do site e confirmou sua evolução em relação à proposta inicial do Figma. Site aprovado e tokens atuais passam a orientar a continuidade; medidas exatas do Figma deixam de ser requisito para encerrar esta lacuna documental. Regras visuais e identidade foram atualizadas. As referências anteriores a aprovação visual pendente são históricas. A decisão não encerra verificações técnicas de acessibilidade, responsividade ou validação publicada nem altera o escopo funcional por si só.


## Alcance da apresentação — atualização de 17/10/2026

Confirmados slides produzidos pela equipe, interação real com bot WhatsApp e exposição breve de telões por interação ou imagens. A equipe já possui chip e celular para a configuração. Formato do Power BI aguarda esclarecimento da transcrição; data, duração e participação específica de site/hardware ainda serão confirmadas. Decisões e dependências registradas no [cenário de apresentação](cenario-de-apresentacao.md). Não há confirmação de conclusão das integrações.


### Confirmação do Power BI para a apresentação — 17/10/2026

A equipe considera suficiente uma imagem dos modelos de gráficos nos slides, dispensando demonstração ao vivo do Power BI para esta apresentação. Encerrada a dúvida de formato registrada acima. A imagem não comprova conexão, atualização ou integração funcional, e P09 permanece pendente no produto. Data, duração e roteiro específico de site/hardware ainda aguardam confirmação.


### Site, maquete e período da apresentação — confirmação de 17/10/2026

Equipe informou apresentação no início de dezembro de 2026, normalmente com 20 a 25 minutos. Dia/horário e limite final ainda não confirmados. Site ficará aberto para navegação breve; sensores estarão na maquete, com um sensor dentro de uma caixa/carcaça de proteção a ser criada. Formato geral registrado no [cenário de apresentação](cenario-de-apresentacao.md). Faltam roteiro por tela e responsáveis, especificação da caixa e evidência da integração física com o site; a instalação na maquete não comprova conclusão do P06.


### Responsabilidade pelas informações dos sensores — 17/10/2026

Equipe informou que Kamilly é responsável pelas definições dos sensores e que os detalhes serão enviados depois. Modelo/hardware, frequência, confirmação, expiração/perda de comunicação e manutenção continuam pendentes, aguardando o repasse da equipe. Não preencher com suposições nem considerar parâmetros provisórios como aprovados.


### Recálculo das sprints — confirmação de 17/10/2026

Equipe confirmou como correta a data da foto: Sprint 3 de 09 a 16/09. Retrocalculados os períodos 1–2 e projetados 4–9 em ciclos consecutivos de sete dias, detalhados no [registro das sprints](../Planejamento/Sprints%20do%20projeto.md). Esse cálculo coloca a Sprint 5 em 23–30/09 e faz 21/10 iniciar a Sprint 9, conflitante com o relato de 16/10 de que a Sprint 5 terminaria em 21/10 e começaria a 6. A duração de sete dias e as datas calculadas dependem da ausência de pausas ou mudanças de duração. É necessário esclarecer a numeração e eventuais interrupções; não associar atividades aos períodos calculados como fato confirmado.


### Confirmação da divergência do calendário — 17/10/2026

O usuário informou que ainda precisa confirmar com a equipe se houve pausas, sprints com duração diferente ou mudança de numeração. A diferença entre o cálculo semanal a partir da Sprint 3 (09–16/09) e o relato de Sprint 5 terminando em 21/10 permanece aberta.


## Prévia funcional dos telões — 17/10/2026

Criadas as rotas autenticadas do gerente `/painel/telao` e `/painel/telao/andares/:andarId`, com contagens de vagas livres em estados monitorados, categorias especiais separadas, atualização a cada 30 segundos, tratamento de leituras ausentes/parciais, ausência de controles e identificação do Shopping Exemplo como demonstração. O fluxo está descrito em [fluxo de telas](fluxo-de-telas.md). A prévia reutiliza o endpoint existente e não implementa instalação pública, autorização de kiosk, configuração administrativa, ESP32 real ou transporte em tempo real; P07/P06 permanecem parciais. O validador documental foi executado após atualizar o mapa.
