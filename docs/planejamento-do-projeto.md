# VAGGU — planejamento e continuidade do projeto

Última atualização: **12/09/2026**, fuso **America/Sao_Paulo**. A revisão da landing e seu fechamento permanecem atribuídos a **09/09/2026**, conforme solicitado. Base de P01: `c127b5e`; registros das entregas na seção 7. Este documento registra evidências e orienta o trabalho diário; não substitui o [SSD](SSD-VAGGU.md) nem os [critérios de aceite](plano-e-aceite.md).

## 1. Situação atual

A autenticação do frontend usa a API real: login, identidade, primeira senha, revogação e expiração. Os acessos demonstrativos foram removidos. O Admin configura shoppings, gerentes, andares, setores, vagas, categorias e posições no mapa. O gerente consulta o mapa do próprio shopping, alterna andares e localiza vagas. Telemetria, telões e Power BI continuam pendentes.

P01 foi concluído em 10/09 e P02 em 11/09, incluindo autenticação e acabamento visual. P03 foi concluído em 12/09 com gestão administrativa, vários gerentes e Minha conta. P04 foi concluído em 12/09 com estrutura e mapa validados em PostgreSQL real e no navegador. A base local está verificável; o sistema ainda não está liberado para operação com clientes. Depois, prosseguir para P05.

Classificações: **verificado** exige execução do comportamento indicado; **presente no código** significa inspeção estática; **parcial** identifica uma entrega incompleta; **ausente** indica que não foi encontrada implementação no escopo inspecionado. Um teste simulado não comprova banco, hardware ou serviço externo real.

## 2. O que foi implementado

| Área | Estado atual | Evidência e limite |
| --- | --- | --- |
| Landing, marca, login separado e contato comercial | Verificado na interface; contato real pendente | [Landing](../vaggu-frontend/src/pages/landing-page.tsx). Número de exemplo removido em 11/09; equipe ainda não possui número oficial. Não foi enviada mensagem. |
| Seção Sobre | Verificado | [Componente](../vaggu-frontend/src/components/sobre-vaggu.tsx) e [estilos](../vaggu-frontend/src/components/sobre-vaggu.css): texto de apresentação, anéis, etapas, notebook e benefícios. |
| Movimento e responsividade da seção Sobre | Verificado durante esta sessão | Pontos percorrem os anéis, pausam fora da tela e por controle do usuário; movimento reduzido desativa a animação. Conexões das etapas e benefícios acompanham o layout. Conferências entre 320 e 1440 px registradas na sessão. |
| Seção abaixo do Sobre | Verificado | [Operação VAGGU](../vaggu-frontend/src/components/operacao-vaggu.tsx): foto urbana, título, explicação, benefícios e contato. Conteúdo usa hierarquia mais leve e altura ajustada. |
| Remoção das legendas | Verificado novamente nesta revisão | Não há legenda visível do notebook nem texto de pausa. Permanece botão por ícone com nome acessível; o `alt` do notebook informa que é ilustração. |
| Login e destinos autenticados | Integração verificada em 11/09 | API real, token em memória, primeira senha e logout; sem contas locais. Telas antigas preservadas fora das rotas. Cadastro na interface continua pendente. |
| Estado sem sensores | Verificado no recorte de P04 | O gerente recebe da API a situação de implantação do próprio shopping. Enquanto não estiver ativa, a interface apresenta a configuração em andamento sem inventar leituras de sensores. |
| Base Express e saúde | Verificado em 10/09 | `start` e `dev` iniciaram a saída compilada; health e readiness responderam 200 com PostgreSQL local. Processos de API usados na verificação encerrados. |
| Autenticação e conta na API | Verificado nos cenários de integração em 10/09 | [Runner](../vaggu-backend/test/integracao-acessos.test.ts): identidade, hash, sessão, primeira senha, conta, expiração, logout e escopo entre shoppings. Frontend integrado em 11/09; rotas de vagas usadas nos testes são exclusivas da suíte. |
| Shoppings e vários gerentes | Verificado no recorte entregue | Cadastro de shopping, dois gerentes, redefinição e bloqueio individual aprovados no PostgreSQL e na interface. A implantação agora possui situação própria; ficha comercial completa continua fora deste recorte. |
| Persistência PostgreSQL | Migration aplicada e integração local verificada | PostgreSQL 17.11 portátil, bancos de desenvolvimento e controle de teste separados. Migrations aplicadas a cada banco descartável; descarte e ausência de fixtures nos bancos persistentes conferidos. Isso não valida histórico/telemetria ainda ausentes. |
| Webhook WhatsApp | Parcial | [WhatsApp](../vaggu-backend/src/whatsapp/service.ts): assinatura, distinção entre mensagens/status, deduplicação e cliente Meta. Conversa contém menu de teste; fluxos de demonstração/suporte não estão concluídos. |
| Skills de continuidade | Criadas, validadas e instaladas | Fontes versionadas em [start](../skills/start/SKILL.md) e [end](../skills/end/SKILL.md); cópias em `C:/Users/CASA/.codex/skills/start` e `end` conferidas por hash. Usam este documento como registro compartilhado. |
| Andares, setores, tipos e mapa | Verificado em P04 | Hierarquia por shopping, coordenadas proporcionais, revisão concorrente, dois andares, categorias, filtros, seleção e busca entre andares aprovados. O mapa usa base neutra; associação de planta ilustrada permanece uma evolução. |
| Importação CSV/XLSX | Ausente | Cadastro manual está disponível. Prévia, erros por linha e confirmação da importação pertencem ao P05. |
| ESP32, sensores, confirmação e expiração | Ausentes como fluxo funcional | Entidades iniciais não equivalem a ingestão, confirmação consistente de 30 s, ordenação, expiração ou manutenção. |
| Histórico consultável, contagens, telões e exportações | Ausentes como fluxo funcional | Exigem observações confirmadas e isolamento; não confundir a imagem da landing com um painel de dados real. |
| Power BI | Ausente | Nenhum relatório funcional com histórico e atualização foi verificado/encontrado no projeto. |

## 3. Revisão final — achados e prioridades

| ID | Prioridade | Evidência | Impacto e encaminhamento |
| --- | --- | --- | --- |
| R01 | Resolvido em P01 | `dev`/`start` apontam para `dist/src/server.js`. | Ambos iniciaram a API após build e responderam health/readiness com banco conectado. |
| R02 | Resolvido em P01 | Runner chama `runAuthCases` e `runAdminCases` em banco exclusivo. | 47 testes aprovados na suíte completa. CA04–CA06 cobertos na API; CA07 coberto nos cenários disponíveis, sem alegar validação de exportações/tempo real/frontend ausentes. Sem configuração, integração fica explicitamente pendente; banco inacessível falha. |
| R03 | Resolvido para o ambiente local de P01 | Node portátil 24.18.0 e npm 11.16.0 em `ambiente.local`; dependências instaladas pelo lockfile. | O Node global permanece 26.7.0; usar o PATH temporário do [guia local](configuracao.md). Engines e versões de dependências preservados. |
| R04 | Resolvido na autenticação em P02 | Login e /me na API, token apenas em memória e validação de perfil/primeira senha. | 12 cenários no navegador com banco isolado aprovados; recarga exige novo login. |
| R05 | Resolvido em P01 | Removido apenas o import `useMotionTemplate` sem uso. | Frontend `npm.cmd run lint` e `npm.cmd run build` aprovados; aviso de bundle permanece. |
| R06 | Pendente de definição comercial | A equipe informou em 11/09 que ainda não há WhatsApp oficial. | Número fictício removido; login orienta contato pelo canal da parceria. Configurar VITE_WHATSAPP_NUMBER quando disponível. |
| R07 | Média, retomada WhatsApp | `src/whatsapp/service.ts`, `claimMessage`: somente `FALHOU` pode ser retomado. | Queda após gravar `PROCESSANDO` pode deixar reentregas presas como duplicadas. Implementar expiração de posse/retomada e tratar o risco de envio duplicado. |
| R08 | Resolvido em P03 | A resposta administrativa informa `ativo` sem expor hash, senha ou token. | Listagem, bloqueio e reativação foram validados no PostgreSQL e no navegador. |
| R09 | Média, evolução do backend | `tsconfig.json`: `strict` e `noImplicitAny` desativados; contratos de serviços incompletos. | Tipar fronteiras e módulos tocados progressivamente; evitar refatoração global junto da integração. |
| R10 | Baixa, acabamento | CSS ainda contém regra de `figcaption` removido; pacote frontend gera aviso de bundle acima de 500 kB. | Remover estilo sem uso na próxima manutenção focalizada. Avaliar divisão por rotas quando a integração aumentar o bundle. Não é falha de build. |

Revisão visual: composição, tipografia, cores, imagens, conexões e comportamento em telas menores foram comparados com os anexos e com as correções posteriores da equipe. Não houve nova extração de medidas do Figma: a integração retornou erro de seleção na etapa anterior. Mantêm-se as pendências do [guia visual](regras-visuais.md).

## 4. Verificações executadas e limites

| Conferência | Resultado em 09/09/2026 |
| --- | --- |
| Frontend `npm.cmd run build` | Passou, código 0; aviso de bundle acima de 500 kB. |
| Frontend `npm.cmd run lint` | Falhou, código 1: R05. O lint direcionado aos componentes alterados havia passado na etapa anterior; isso não equivale ao lint geral. |
| Chrome em `http://127.0.0.1:5173/` | Landing identificada, imagens carregadas, ausência das duas legendas confirmada e nenhum erro registrado. Larguras 1440 e 360 px sem transbordamento nesta revisão. |
| Movimento/teclado, etapas anteriores da mesma sessão | Pausa/retomada por teclado, movimento reduzido, pausa fora da tela e larguras 320/360/768/1024/1440 px conferidas. Não constituem auditoria completa de acessibilidade. |
| Backend build/typecheck/test/Prisma | Não executados nesta revisão: dependências ausentes e Node fora da faixa declarada. A existência dos testes foi inspecionada, não apresentada como execução. |
| PostgreSQL, Meta e hardware reais | Não acessados/validados nesta revisão. Testes HTTP simulados e leitura de schema não comprovam essas integrações. |
| Git e diffs | Alterações preservadas e `git diff --check` aprovado. Após a revisão, a equipe autorizou explicitamente commit e push na `main` ao invocar `$end`; publicação preparada neste fechamento. |
| Skills `start` e `end` | Frontmatter e metadados YAML, nomes, prompts e links locais validados com Node e o parser `js-yaml` já instalado no frontend. O validador Python da skill-creator não pôde executar: o alias `python.exe` do ambiente está indisponível. |
| Comportamento e instalação das skills | Revisão independente em modo leitura dos cenários: retomada com banco indisponível, dois fechamentos no dia e dia anterior sem `end`. Ajustadas seleção da entrada e continuidade; instalação local conferida por hash. As skills não foram invocadas para iniciar P01 nesta entrega. |

Os comandos acima são relativos ao diretório de cada pacote. Em PowerShell deste ambiente, usar `npm.cmd`, pois `npm.ps1` está bloqueado pela política de execução. Para outras máquinas, confirmar gerenciador e scripts atuais; não copiar comandos de migration para um banco sem identificar seu destino.

### 4.1 Verificações de P01 — 10/09/2026

| Diretório e comando/conferência | Resultado |
| --- | --- |
| `vaggu-frontend`: `npm.cmd run lint` e `npm.cmd run build` | Ambos código 0; bundle de aproximadamente 526 kB mantém o aviso já conhecido. Sem mudança de comportamento visual; não foi repetida a revisão de navegador/Figma. |
| `vaggu-backend`: `npm.cmd ci --cache ../.npm-cache --offline --no-audit --no-fund`, com Node 24.18.0/npm 11.16.0 | 257 pacotes instalados do lockfile. Scripts automáticos de Prisma não foram aprovados globalmente; geração executada explicitamente. |
| `vaggu-backend`: `npm.cmd run db:generate`, `npm.cmd run typecheck`, `npm.cmd run db:validate` e `npm.cmd run db:deploy` | Código 0; cliente Prisma 7.10.0 gerado, tipos/schema válidos e migration aplicada somente ao banco local `vaggu_local`. Geração exigiu acesso fora da sandbox ao cache do Prisma. |
| `vaggu-backend`: `npm.cmd test` sem `TEST_DATABASE_URL` | 24 aprovados e 1 skip com mensagem PENDENTE, comprovando ausência explícita da integração. |
| `vaggu-backend`: `npm.cmd run test:integracao` | 24 testes aprovados, sem skip, com PostgreSQL real e banco descartável. |
| `vaggu-backend`: `node --env-file=.env.teste.local ../ambiente.local/node-v24.18.0-win-x64/node_modules/npm/bin/npm-cli.js test`, com PATH portátil | Suíte completa: 47 aprovados, 0 falhas, 0 skips. |
| `vaggu-backend`: `node --test dist/test/integracao-acessos.test.js`, com URL de teste apontando para porta local inacessível | Código 1 e mensagem de impossibilidade de criar banco isolado conferidos; falha não convertida em skip. |
| Raiz: verificador temporário em `ambiente.local/verificar-inicio.mjs` | `npm run start` e `npm run dev` responderam health/readiness 200, portas 3051/3052. Encerramento das árvores de processos exigiu execução fora da sandbox e foi concluído. |
| Raiz: verificador temporário em `ambiente.local/verificar-preservacao.mjs` | Banco de controle sem tabelas de aplicação; desenvolvimento sem usuários/shoppings/sessões fictícios; nenhum banco descartável remanescente. |
| Raiz: `git diff --check` e `git check-ignore` dos arquivos locais | Sem erros de whitespace; `.env`, `.env.teste.local` e ferramentas/dados locais ignorados. Lockfile preservado. |

O PostgreSQL portátil escuta somente em `127.0.0.1:55432`. Configurações locais e ferramentas estão ignoradas pelo Git, sem segredos no planejamento. Meta, hardware, navegador autenticado e Power BI reais não foram validados. Os resultados de 09/09 acima permanecem como histórico daquela revisão.

## 5. Backlog ordenado

Estados do backlog: **pronto**, **em andamento**, **bloqueado**, **concluído**. Dependências ainda não entregues permanecem explícitas. A prioridade não é uma promessa de prazo.

| ID | Entrega | Estado | Dependências | Critério para concluir |
| --- | --- | --- | --- | --- |
| P01 | Base local verificável: R01, R02, R03 e R05 | Concluído em 10/09 | Runtime compatível e PostgreSQL local preparados; evidências na seção 4.1. | API inicia pelo caminho gerado; frontend lint/build aprovados; cenários auth/admin executados em banco real isolado. |
| P02 | Integrar login, sessão, troca obrigatória e saída | Concluído em 11/09 | P01 concluído. Contratos `/api/v1/auth/login`, `/me`, `/change-password` e `/logout` integrados pelo proxy local; token fica apenas em memória. | Frontend consulta identidade da API; senha provisória restringe acesso, troca libera; expiração e logout revogam acesso. Fluxos validados no navegador/API. |
| P03 | Integrar Admin, vários gerentes e minha conta | Concluído em 12/09 | Contratos reais integrados; DTO informa situação ativa e bloqueio remove sessões na transação. | CA04, CA06 e o recorte disponível de CA07 aprovados em PostgreSQL real; fluxos principais aprovados no navegador. |
| P04 | Estrutura e implantação: andares, setores, vagas, categorias e mapa | Concluído em 12/09 | P03 concluído; migration e contratos incrementais entregues. | CA08–CA12 cobertos: estado de configuração, dois andares, filtros, seleção, busca entre andares, rejeição de vaga de outro andar, revisão concorrente e isolamento. |
| P05 | Importação CSV/XLSX com prévia e preservação de histórico | Pronto | IDs e modelo de estrutura definidos em P04. | Erros por linha, confirmação consistente e atualização sem apagar histórico. CA13–CA14. |
| P06 | ESP32/sensores, ingestão e estados confiáveis | Bloqueado por P04 | Contrato de firmware: autenticação, sensor, inicialização, sequência, frequência e expiração. | Confirmação de 30 s com evidência, deduplicação, ordem e expiração por sensor; histórico transacional. CA15–CA24. |
| P07 | Operação, manutenção, contagens e telões | Bloqueado por P06 | Observações confiáveis e ocorrências. | Contagens reconciliadas sem duplicar categorias; dado vencido não vira livre. CA23–CA26. |
| P08 | Histórico, métricas e exportações | Bloqueado por P06/P07 | Intervalos confirmados, cobertura e recortes. | Cálculos reproduzem conjunto controlado; exportações respeitam shopping e filtros. CA27–CA31. |
| P09 | Primeiro relatório funcional Power BI | Bloqueado por P08 | Histórico disponível e decisão de distribuição/acesso. | Atualização funcional e métricas reconciliadas (CA32); isolamento de acesso (CA33) só concluído na distribuição efetiva. |
| P10 | Concluir contato e fluxos comerciais WhatsApp | Pronto para trabalho independente | Número oficial, ambiente Meta autorizado; recuperação de processamento (R07). | Demonstração/suporte coletam dados e registram solicitação sem duplicação; atendimento encaminhado à equipe. CA01–CA03. |
| P11 | Revisão integrada para apresentação do TCC | Bloqueado pelas entregas utilizadas na demonstração | Fluxos completos, dados identificados e ambiente reproduzível. | Executar roteiro de `plano-e-aceite.md`, declarar limitações e validar CA34–CA36 conforme o escopo. |

Preservar os limites do produto: web responsiva, sem cadastro público de gerente, sem reservas/pagamentos/reconhecimento de veículos/chatbot de IA. Power BI e hardware não podem ser declarados integrados a partir de imagens, fixtures ou espaços reservados.

## 6. Próximo início

- **Pacote:** P05 — importação CSV/XLSX com prévia e preservação de histórico.
- **Primeira ação:** definir o contrato do arquivo, as chaves de correspondência e o formato da prévia de erros antes de gravar qualquer linha.
- **Base já validada:** P04 concluído: estrutura hierárquica e mapa proporcional, com revisão concorrente, isolamento e fluxo Admin/gerente aprovados no PostgreSQL e no navegador em 12/09.
- **Aceite e verificação a confirmar:** prévia, erros por linha, confirmação atômica, atualização sem apagar histórico e CA13–CA14.
- **Limites:** WhatsApp oficial não existe ainda; não inventar número. Preservar alterações Git e não publicar sem solicitação.
- **Estado diário:** aberto em 12/09; P03 concluído. O dia permanece aberto até pedido de fechamento.

## 7. Registro diário

Cada entrada mantém: data local, estado do dia, pacote/objetivo, evidências de entrada, alterações, verificações e resultados, pendências/bloqueios, primeira ação da retomada e situação Git. Acrescentar entradas sem apagar dias anteriores. O resumo das seções 1–6 deve acompanhar o estado mais recente.

### 09/09/2026 — fechamento da revisão e preparação da continuidade

Por solicitação da equipe, as alterações e verificações desta sessão pertencem ao dia de trabalho **09/09/2026**, embora tenham avançado pela madrugada de **10/09/2026** (America/Sao_Paulo). A correção documental foi solicitada via `$start` em 10/09 e constitui o escopo desta retomada; P01 permanece preparado para o próximo início. Os horários originais dos commits permanecem preservados.

- **Estado:** encerrado, referente ao dia de trabalho 09/09/2026; fechamento consolidado por `$end`, sem invocação prévia de `$start` nesta sessão. P01 preparado para o próximo início. Nenhuma etapa operacional adicional foi implementada nesta revisão.
- **Entrega da sessão:** refinamento da landing (Sobre, anéis, etapas e seção da foto), remoção das legendas a pedido da equipe, revisão do frontend/backend e criação deste planejamento e das skills.
- **Verificação:** resultados e limites na seção 4. Skills aprovadas na validação estrutural e revisão de comportamento; fontes e cópias instaladas idênticas por hash. Ambas constam no catálogo disponível; `end` foi lida e aplicada neste fechamento. As verificações anteriores permanecem válidas para o mesmo código; não foram repetidas sem mudança correspondente.
- **Arquivos da entrega:** componentes `sobre-vaggu` e `operacao-vaggu` (TSX/CSS), `landing-page.tsx`, este planejamento, guia visual, índices README, `AGENTS.md` e fontes/metadados de `skills/start` e `skills/end`.
- **Ambiente local:** servidor Vite iniciado pela sessão em `http://127.0.0.1:5173/`; não foi encerrado pelo fechamento. Confirmar disponibilidade ao retomar.
- **Pendências preservadas:** R01–R10 e backlog P01–P11. Não há data prometida para uma implantação real.
- **Próxima retomada:** P01, começando pelos caminhos de inicialização e pelo lint. A invocação de `start` inicia o pacote; este registro sozinho não dispara execução.
- **Git:** entrega preparada sobre `368a774` na `main`, com commit e push explicitamente autorizados pela equipe. Este registro integra o commit de fechamento; consultar `git log` e a referência `origin/main` para identificar o hash publicado e conferir sincronização no próximo início. Não houve solicitação de deploy.

### 10/09/2026 — P01: base local verificável

- **Estado:** interrompido — fechamento não realizado; retomado em 11/09/2026.
- **Pacote e objetivo:** P01; corrigir inicialização da API, lint e descoberta dos cenários de autenticação/administração, preparando validação com PostgreSQL de teste isolado.
- **Entrada:** `c127b5e` na `main`, sincronizada com a referência local `origin/main`; preservadas alterações documentais de data no README, guia visual e neste planejamento. O fechamento anterior permanece atribuído a 09/09, conforme solicitado.
- **Ambiente identificado:** Node 26.7.0 fora da faixa do backend; dependências do frontend presentes e do backend ausentes. PostgreSQL e Docker não encontrados no PATH nem como serviços.
- **Entrega:** caminhos de `dev`/`start` corrigidos; import sem uso removido; runner de integração e preparação de banco exclusivo adicionados; helpers de casos tipados e atualização de senha limitada às fixtures; READMEs, exemplo de configuração e guia de ambiente atualizados.
- **Ambiente preparado:** Node 24.18.0/npm 11.16.0 e PostgreSQL 17.11 portáteis em `ambiente.local`, com bancos `vaggu_local` e `vaggu_teste` separados. Credenciais aleatórias salvas somente em arquivos ignorados; nenhum administrador real criado.
- **Processos ao concluir o pacote:** APIs temporárias encerradas e PostgreSQL parado normalmente, com dados preservados. Seguir o guia local para iniciar novamente; o estado diário permanece aberto.
- **Verificações:** seção 4.1; 47 testes aprovados com PostgreSQL real, lint/build do frontend e tipos/schema do backend aprovados. Health/readiness e descarte dos bancos de teste conferidos.
- **Resultado:** P01 concluído; dia permanece **aberto** até `$end`. P02 pronto para o próximo início, sem execução automática nesta entrega.
- **Pendências:** R04 e R06–R10; integração real do frontend, Meta, hardware e Power BI permanecem fora desta entrega. Aviso de bundle preservado.
- **Git:** mudanças locais sobre `c127b5e`, incluindo o ajuste de datas já solicitado. Sem commit, push ou deploy nesta retomada.

## 8. Uso das skills

Invocar `$start` para iniciar o dia de projeto e executar o pacote registrado em “Próximo início”. Invocar `$end` para consolidar o que de fato mudou, registrar verificações e deixar a primeira ação do próximo dia pronta.

As fontes ficam em `skills/start` e `skills/end`. As cópias de descoberta são instaladas em `$CODEX_HOME/skills` ou, quando essa variável está vazia, `~/.codex/skills`. Neste ambiente o destino padrão é `C:/Users/CASA/.codex/skills`. Alterações futuras nas fontes devem ser sincronizadas com essas cópias, após comparar diferenças e preservar customizações.

Se a lista de skills da conversa atual ainda não refletir a instalação, abrir uma nova conversa no projeto. Também é possível pedir para ler `skills/start/SKILL.md` ou `skills/end/SKILL.md` diretamente. Não há agendamento: as skills são acionadas pela conversa, não executam sozinhas quando a data muda.

`start` reutiliza uma entrada já aberta na mesma data e reabre a entrada se o trabalho for retomado após o fechamento. Se o dia anterior não teve `end`, marca a entrada anterior como interrompida e vincula sua continuidade ao dia atual, sem fabricar resultados. `end` fecha a entrada da sessão atual; repetido no mesmo dia, atualiza o fechamento sem duplicar entregas. Nenhuma das skills publica, envia mensagens ou altera um banco real por autorização implícita do planejamento.

### 11/09/2026 — P02: login e autenticação real

- **Estado:** encerrado em 11/09, por solicitação de Pietro.
- **Objetivo:** primeiro corrigir o login conforme o Figma, retirar acessos demonstrativos e integrar/testar autenticação na API.
- **Entrada:** alterações locais da reorganização anterior preservadas; mapa de arquivos ausente. Nenhum resultado antigo comprova as alterações desta sessão.
- **Figma:** MCP conectado, leitura limitada pelo plano; frame 2580:30 localizado e visualizado no navegador.

- **Entrega de 11/09:** layout do login ajustado à composição observada no Figma; contas demonstrativas removidas; autenticação, primeira senha, verificação periódica e logout integrados. Número fictício removido após confirmação da equipe.
- **Verificações atuais:** 47/47 testes backend com PostgreSQL isolado, lint aprovado, build aprovado com aviso de tamanho; 12 cenários E2E aprovados e nenhum erro JavaScript não tratado. Detalhes em [validação](validacao-login-2026-09-11.md).
- **Acabamento visual:** Pietro enviou a foto recortada e o contorno do termo “vagas”; ambos foram aplicados e conferidos em desktop e celular. O MCP permanece limitado pela cota do plano, sem nova extração de medidas.
- **Resultado:** P02 concluído. A autenticação real e o acabamento visual foram entregues dentro do escopo; telemetria, operação e Power BI permanecem fora deste pacote.
- **Próxima retomada:** P03, começando pela revisão dos contratos administrativos e do DTO de situação dos gerentes.
- **Documentação e Git:** mapa de arquivos reconstruído e verificado; diário geral e diário VAGGU atualizados. Alterações locais, sem commit, push ou deploy.

### 12/09/2026 — P03: Admin, vários gerentes e minha conta

- **Estado:** concluído; o dia técnico permanece aberto.
- **Pacote e objetivo:** P03; consolidar contratos e persistência PostgreSQL para shoppings, vários gerentes e minha conta, integrar a interface e validar permissões e isolamento.
- **Entrada:** P02 encerrado em 11/09; `c127b5e` permanece como HEAD, com as alterações locais documentadas de P01/P02 preservadas. Nenhum resultado anterior será atribuído às mudanças de P03 sem nova execução.
- **Primeira ação:** revisar o schema Prisma e os contratos atuais de `/shoppings`, gerentes e `/minha-conta`, resolvendo a situação administrativa do gerente antes da interface.
- **Aceite:** CA04, CA06 e CA07; dois gerentes independentes no mesmo shopping, bloqueio individual que invalida sessão, edição apenas de campos permitidos e isolamento por shopping.
- **Entrega:** DTO público passou a informar o estado ativo; bloquear um gerente remove suas sessões na mesma transação. O painel Admin cadastra shoppings, cria vários acessos individuais, lista situação, bloqueia/reativa e redefine senha. A área do gerente edita nome e telefone por `/minha-conta`, mantendo e-mail, perfil e shopping protegidos pelo backend.
- **Verificações:** backend com PostgreSQL real: 47/47 testes aprovados, incluindo CA04, CA06, campos permitidos e recorte de isolamento disponível em CA07. Frontend: lint e build aprovados, com aviso conhecido de chunk acima de 500 kB. Navegador Edge/Playwright: criação de shopping, dois gerentes, bloqueio, troca de senha, Minha conta, desktop 1440×1024 e celular 390×844 aprovados; nenhum erro JavaScript/console. `node scripts/verificar-documentacao.mjs` atualizou o mapa para 113 arquivos.
- **Resultado:** P03 concluído. P04 está pronto para a próxima retomada.
- **Limites:** CA07 ainda precisa ser reaplicado a exportações, downloads e tempo real quando esses canais existirem. Não houve deploy, conta real ou dados de produção. PostgreSQL e Vite temporários foram encerrados; bancos descartáveis do teste foram removidos pelo runner.
- **Git:** alterações locais preservadas, sem commit ou push.

### 12/09/2026 — P04: estrutura, implantação e mapa

- **Estado:** concluído; retomado e entregue após o P03 no mesmo dia. O dia técnico permanece aberto.
- **Pacote e objetivo:** P04; criar hierarquia de andares, setores e vagas, categorias especiais, situação de implantação e posições proporcionais com revisão concorrente do mapa.
- **Entrada:** P03 concluído e validado; PostgreSQL local disponível. Alterações locais anteriores preservadas, sem commit ou publicação.
- **Decisão documentada:** fluxo completo de configuração, sensores e telões em [arquitetura de estrutura, sensores e telões](arquitetura-estrutura-sensores-telao.md). P04 implementa estrutura/mapa; P05 importação; P06 telemetria; P07 operação/telões.
- **Primeira ação:** migration incremental compatível com vagas existentes, usando FKs compostas e índices por shopping/andar/setor.
- **Aceite:** CA08–CA12 e isolamento; nenhuma leitura simulada será apresentada como telemetria real.
- **Entrega:** migration incremental adicionou situação de implantação, andares, setores, categorias e posições proporcionais das vagas, mantendo compatibilidade com vagas legadas. A API permite configurar a estrutura e salvar uma revisão completa do mapa de forma transacional. O frontend Admin cadastra a hierarquia e posiciona vagas; a área do gerente usa somente o shopping autenticado, alterna andares, filtra por tipo, seleciona e busca vagas inclusive em outro andar.
- **Verificações:** migration aplicada ao banco persistente `vaggu_local`; suíte completa do backend com PostgreSQL real: 52/52 testes aprovados. Os cenários de P04 cobrem dois andares, tipos especiais, isolamento, rejeição de vaga de outro andar e conflito de revisão. Frontend: lint e build aprovados, com o aviso conhecido de chunk acima de 500 kB. Navegador/Playwright: criação de estrutura, salvamento de posições, ativação, troca de andar, busca entre andares e celular sem rolagem horizontal aprovados. Mapa de documentação: 122 arquivos cobertos; `git diff --check` sem erro.
- **Resultado:** P04 concluído. P05 está pronto para a próxima retomada.
- **Limites:** ainda não há importação CSV/XLSX, ingestão de sensores, atualização em tempo real ou telão. O mapa atual usa uma base neutra e posições proporcionais; uma planta ilustrada poderá ser associada depois. Nenhum dado exibido foi apresentado como leitura real de sensor.
- **Ambiente:** PostgreSQL local permanece iniciado para uso da equipe; o Vite temporário de validação foi encerrado. O dia continua aberto até pedido de fechamento.
- **Git:** P01–P04 e a reorganização documental publicados na `main` no commit `dc316b2`. Nenhum deploy foi solicitado.
