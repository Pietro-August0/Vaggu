# VAGGU — planejamento e continuidade do projeto

Última atualização: **23/09/2026**, fuso **America/Sao_Paulo**. A revisão da landing e seu fechamento permanecem atribuídos a **09/09/2026**, conforme solicitado. Base de P01: `c127b5e`; registros das entregas na seção 7. Este documento registra evidências e orienta o trabalho diário; não substitui o [SSD](SSD-VAGGU.md) nem os [critérios de aceite](plano-e-aceite.md).

## 1. Situação atual

A autenticação do frontend usa a API real: login, identidade, primeira senha, revogação e expiração. A senha definitiva possui política explícita e erros por campo na API e na interface. Os acessos demonstrativos foram removidos. O backend cadastra e exclui logicamente shoppings e gerentes, mas a auditoria do código atual em 23/09 não encontrou na interface as ações de exclusão e desfazer antes registradas como entregues. A interface continua oferecendo cadastro, edição, bloqueio, reativação, redefinição, foto externa, andares, setores, vagas, categorias, importação e mapa 2D compartilhado. O gerente consulta o mapa do próprio shopping mesmo durante a configuração, alterna andares e localiza vagas. Telemetria, telões e Power BI continuam pendentes.

P01 foi concluído em 10/09 e P02 em 11/09, incluindo autenticação e acabamento visual. P03 foi concluído em 12/09 com gestão administrativa, vários gerentes e Minha conta. P04 foi concluído em 12/09 com estrutura e mapa validados em PostgreSQL real e no navegador. O P05 foi concluído em 21/09: prévias CSV/XLSX, confirmação idempotente e preservação de IDs/histórico foram executadas no PostgreSQL; a jornada Admin autenticada foi validada no navegador em desktop e viewport móvel. A base local está verificável, mas o sistema ainda não está liberado para operação com clientes.

As Sprints 1 e 2 foram confirmadas pela equipe como etapas de descoberta, definição da ideia e planejamento inicial do Figma. As fotografias das Sprints 3 e 4 foram incorporadas como evidências históricas. O registro consolidado está em [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md); essa numeração não corresponde aos pacotes técnicos P01–P11.

Classificações: **verificado** exige execução do comportamento indicado; **presente no código** significa inspeção estática; **parcial** identifica uma entrega incompleta; **ausente** indica que não foi encontrada implementação no escopo inspecionado. Um teste simulado não comprova banco, hardware ou serviço externo real.

## 2. O que foi implementado

| Área | Estado atual | Evidência e limite |
| --- | --- | --- |
| Landing, marca, login separado e contato comercial | Verificado na interface; contato real pendente | [Landing](../../../vaggu-frontend/src/pages/landing-page.tsx). Número de exemplo removido em 11/09; equipe ainda não possui número oficial. Não foi enviada mensagem. |
| Seção Sobre | Verificado | [Componente](../../../vaggu-frontend/src/components/sobre-vaggu.tsx) e [estilos](../../../vaggu-frontend/src/components/sobre-vaggu.css): texto de apresentação, anéis, etapas, notebook e benefícios. |
| Movimento e responsividade da seção Sobre | Verificado em 14/09 | Pontos percorrem os anéis automaticamente. A versão integrada à `main` não possui controle manual e mantém as animações mesmo quando o navegador informa movimento reduzido. Conexões das etapas e benefícios acompanham o layout. |
| Seção abaixo do Sobre | Verificado | [Operação VAGGU](../../../vaggu-frontend/src/components/operacao-vaggu.tsx): foto urbana, título, explicação, benefícios e contato. Conteúdo usa hierarquia mais leve e altura ajustada. |
| Remoção das legendas e do controle manual | Verificado novamente em 14/09 | Não há legenda visível do notebook, texto de pausa ou botão de controle das animações. O `alt` do notebook informa que é ilustração. |
| Login e destinos autenticados | Integração verificada e política de senha reforçada em 13/09 | API real, token em memória, primeira senha e logout; sem contas locais. Troca exige seis critérios, mostra checklist, olhos independentes e erros por campo. Cadastro na interface continua pendente. |
| Estado sem sensores | Verificado novamente em 21/09 | O gerente recebe da API a situação de implantação do próprio shopping. Enquanto não estiver ativa, a interface apresenta o aviso e mantém a estrutura visível; vagas sem leitura confirmada permanecem indisponíveis. |
| Base Express e saúde | Verificado em 10/09 | `start` e `dev` iniciaram a saída compilada; health e readiness responderam 200 com PostgreSQL local. Processos de API usados na verificação encerrados. |
| Autenticação e conta na API | Verificado nos cenários de integração em 10/09 | [Runner](../../../vaggu-backend/test/integracao-acessos.test.ts): identidade, hash, sessão, primeira senha, conta, expiração, logout e escopo entre shoppings. Frontend integrado em 11/09; rotas de vagas usadas nos testes são exclusivas da suíte. |
| Shoppings e vários gerentes | Verificado no recorte entregue | Cadastro e exclusão lógica de shopping, dois gerentes, redefinição e bloqueio individual aprovados no PostgreSQL e na interface. O banco mantém apenas o hash da senha provisória; o Admin pode copiá-la somente na resposta imediata de criação ou redefinição. A foto pública usa armazenamento externo e referência HTTPS. |
| Persistência PostgreSQL | Migration aplicada e integração local verificada | PostgreSQL 17.11 portátil, bancos de desenvolvimento e controle de teste separados. Migrations aplicadas a cada banco descartável; descarte e ausência de fixtures nos bancos persistentes conferidos. Isso não valida histórico/telemetria ainda ausentes. |
| Webhook WhatsApp | Parcial | [WhatsApp](../../../vaggu-backend/src/whatsapp/service.ts): assinatura, distinção entre mensagens/status, deduplicação e cliente Meta. Conversa contém menu de teste; fluxos de demonstração/suporte não estão concluídos. |
| Skills de continuidade | Criadas, validadas e instaladas | Fontes versionadas em [start](../../../skills/start/SKILL.md) e [end](../../../skills/end/SKILL.md); cópias em `C:/Users/CASA/.codex/skills/start` e `end` conferidas por hash. Usam este documento como registro compartilhado. |
| Andares, setores, tipos e mapa | Verificado em P04 e novamente em 21/09 | Hierarquia por shopping, coordenadas proporcionais, revisão concorrente, dois andares, categorias, filtros, seleção e busca entre andares aprovados. Admin e gerente usam o mesmo componente visual; mutações administrativas fazem refetch sem refresh manual. O mapa usa base neutra; associação de planta ilustrada permanece uma evolução. |
| Importação CSV/XLSX | Verificado, P05 concluído em 21/09 | API aceita CSV e XLSX, valida por linha/campo, identifica criação ou atualização, persiste a prévia isolada por shopping e confirma de forma idempotente. PostgreSQL real comprovou concorrência, preservação de IDs/histórico e manutenção das vagas ausentes. A ficha Admin autenticada foi validada com arquivo inválido e válido, confirmação explícita e recarga da estrutura. |
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
| R08 | Resolvido em P03 e endurecido em 21/09 | A resposta administrativa informa `ativo` sem expor hash, senha definitiva ou token. A senha provisória em texto existe somente na resposta imediata de criação ou redefinição. | Listagem, bloqueio e reativação foram validados; a migration remove a cópia reversível e os testes asseguram que a listagem não reapresente a senha. |
| R09 | Média, evolução do backend | `tsconfig.json`: `strict` e `noImplicitAny` desativados; contratos de serviços incompletos. | Tipar fronteiras e módulos tocados progressivamente; evitar refatoração global junto da integração. |
| R10 | Baixa, acabamento | CSS ainda contém regra de `figcaption` removido; pacote frontend gera aviso de bundle acima de 500 kB. | Remover estilo sem uso na próxima manutenção focalizada. Avaliar divisão por rotas quando a integração aumentar o bundle. Não é falha de build. |
| R11 | Alta, correção de interface | A auditoria de 23/09 não encontrou no frontend atual ações para excluir shopping, excluir gerente ou desfazer a exclusão, embora o backend e registros históricos as descrevam. | Revalidar a jornada atual, restaurar as ações com confirmação e feedback ou registrar decisão explícita de remoção. Não declarar o fluxo atual como verificado antes dessa correção. |
| R12 | Alta, consistência documental — resolvida no D01 | A auditoria encontrou Visão do produto e tecnologias descrevendo P05 como parcial; evidências visuais antigas apareciam sem aviso histórico. | Resumos corrigidos, novas evidências catalogadas e estados implementado, histórico e planejado separados em 23/09. |

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

As sprints reais da equipe estão registradas em [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md). Os itens abaixo são pacotes técnicos e de correção; a numeração não deve ser confundida.

| ID | Entrega | Estado | Dependências | Critério para concluir |
| --- | --- | --- | --- | --- |
| D01 | Consolidar documentação, sprints e evidências após a auditoria de 23/09 | Concluído em 23/09 | Auditoria concluída e fontes fornecidas pela equipe. | PRD, TRD, fluxo, modelo de dados, API, identidade, sprints, índices e mapa coerentes; verificador documental aprovado. |
| C01 | Corrigir divergências funcionais da interface atual | Pronto | D01 concluído; confirmar R11 no navegador ao iniciar a implementação. | Exclusões e desfazer reconciliados com o backend; estados e evidências atualizados; frontend lint/build e fluxos afetados aprovados. |
| P01 | Base local verificável: R01, R02, R03 e R05 | Concluído em 10/09 | Runtime compatível e PostgreSQL local preparados; evidências na seção 4.1. | API inicia pelo caminho gerado; frontend lint/build aprovados; cenários auth/admin executados em banco real isolado. |
| P02 | Integrar login, sessão, troca obrigatória e saída | Concluído em 11/09 | P01 concluído. Contratos `/api/v1/auth/login`, `/me`, `/change-password` e `/logout` integrados pelo proxy local; token fica apenas em memória. | Frontend consulta identidade da API; senha provisória restringe acesso, troca libera; expiração e logout revogam acesso. Fluxos validados no navegador/API. |
| P03 | Integrar Admin, vários gerentes e minha conta | Concluído em 12/09 | Contratos reais integrados; DTO informa situação ativa e bloqueio remove sessões na transação. | CA04, CA06 e o recorte disponível de CA07 aprovados em PostgreSQL real; fluxos principais aprovados no navegador. |
| P04 | Estrutura e implantação: andares, setores, vagas, categorias e mapa | Concluído em 12/09 | P03 concluído; migration e contratos incrementais entregues. | CA08–CA12 cobertos: estado de configuração, dois andares, filtros, seleção, busca entre andares, rejeição de vaga de outro andar, revisão concorrente e isolamento. |
| P05 | Importação CSV/XLSX com prévia e preservação de histórico | Concluído em 21/09 | Backend, PostgreSQL e interface Admin autenticada validados; confirmação concorrente e recarga da estrutura aprovadas. | CA13–CA14 cobertos sem alteração parcial, perda de ID/histórico ou remoção silenciosa de vaga ausente. |
| P06 | ESP32/sensores, ingestão e estados confiáveis | Pronto | P04–P05 concluídos; falta estabilizar o contrato de firmware: autenticação, sensor, inicialização, sequência, frequência e expiração. | Confirmação de 30 s com evidência, deduplicação, ordem e expiração por sensor; histórico transacional. CA15–CA24. |
| P07 | Operação, manutenção, contagens e telões | Bloqueado por P06 | Observações confiáveis e ocorrências. | Contagens reconciliadas sem duplicar categorias; dado vencido não vira livre. CA23–CA26. |
| P08 | Histórico, métricas e exportações | Bloqueado por P06/P07 | Intervalos confirmados, cobertura e recortes. | Cálculos reproduzem conjunto controlado; exportações respeitam shopping e filtros. CA27–CA31. |
| P09 | Primeiro relatório funcional Power BI | Bloqueado por P08 | Histórico disponível e decisão de distribuição/acesso. | Atualização funcional e métricas reconciliadas (CA32); isolamento de acesso (CA33) só concluído na distribuição efetiva. |
| P10 | Concluir contato e fluxos comerciais WhatsApp | Pronto para trabalho independente | Número oficial, ambiente Meta autorizado; recuperação de processamento (R07). | Demonstração/suporte coletam dados e registram solicitação sem duplicação; atendimento encaminhado à equipe. CA01–CA03. |
| P11 | Revisão integrada para apresentação do TCC | Bloqueado pelas entregas utilizadas na demonstração | Fluxos completos, dados identificados e ambiente reproduzível. | Executar roteiro de `plano-e-aceite.md`, declarar limitações e validar CA34–CA36 conforme o escopo. |

Preservar os limites do produto: web responsiva, sem cadastro público de gerente, sem reservas/pagamentos/reconhecimento de veículos/chatbot de IA. Power BI e hardware não podem ser declarados integrados a partir de imagens, fixtures ou espaços reservados.

## 6. Trabalho atual e próxima implementação

- **Pacote documental concluído:** D01 — consolidação documental e das sprints, finalizada em 23/09/2026.
- **Pacote atual para implementação:** C01 — corrigir as divergências confirmadas da interface antes de avançar o produto.
- **Primeira ação:** revalidar no navegador a ficha Admin atual e registrar o ponto de partida antes de restaurar exclusões e desfazer.
- **Pacote de produto seguinte:** P06 — ESP32/sensores, ingestão e estados confiáveis.
- **Primeira ação do P06:** consolidar o contrato de firmware e telemetria antes de criar endpoints: autenticação da placa, identificador do sensor, inicialização, sequência, frequência e prazo de expiração.
- **Arquivos de entrada:** `segunda-mente/Vaggu/Documentação/arquitetura-estrutura-sensores-telao.md`, `segunda-mente/Vaggu/Documentação/SSD-VAGGU.md`, `vaggu-backend/prisma/schema.prisma` e os cenários CA15–CA24 de `plano-e-aceite.md`.
- **Base já validada:** P05 concluído no PostgreSQL e no navegador em 21/09; estrutura, IDs e histórico permanecem preservados durante importações.
- **Aceite e verificação a confirmar:** isolamento por shopping/placa, deduplicação, ordenação, confirmação após 30 segundos consistentes, expiração sem assumir vaga livre e histórico transacional.
- **Comandos a confirmar:** detectar scripts reais após definir o recorte; manter backend build/test/integração, frontend lint/build quando houver interface e `node scripts/verificar-documentacao.mjs`.
- **Limites:** não iniciar P07 antes de existir estado confiável; heartbeat da placa não comprova sensores; WhatsApp oficial continua indisponível.
- **Estado atual:** P05 e D01 concluídos; C01 pronto para implementação; P06 continua pronto tecnicamente, mas começa depois das correções prioritárias. A entrega atual permanece local na branch `test/p05-integracao-samuel` até nova autorização de Git.

### 14/09/2026 — PostgreSQL local instalado e configurado

- Instalador oficial EDB 17.11-3 com assinatura válida; instalação em `C:/Program Files/PostgreSQL/17`, fora do repositório. Serviço `postgresql-vaggu-17` automático e em execução, porta 5432; autenticação SCRAM restrita a loopback pelo pg_hba.
- Bancos `vaggu` e `vaggu_teste` com usuários separados. Usuário de desenvolvimento sem superusuário/CREATEDB; teste com CREATEDB para bancos descartáveis. Segredos somente em `.env`, `.env.teste.local` ignorados e credencial administrativa protegida pelo Windows no perfil local.
- Cinco migrations aplicadas ao novo banco `vaggu`. Suíte completa com `.env.teste.local`: 68 aprovados, zero falhas, zero skips; bancos descartáveis removidos pela suíte. API `/api/v1/health/ready` respondeu `status=ok`, `banco=conectado`.
- Comentários e mapa revisados; configuração descartável removida após uso. Pendência anterior de conexão resolvida; confirmação de importação continua pendente.

### 14/09/2026 — persistência inicial do P05 (Samuel)

- Migration incremental adiciona `importacoes_estrutura`, JSONB, vínculo ao shopping e restrições de formato; não modifica vagas ou histórico.
- Prévia gravada em transação Repeatable Read, com ID retornado e consulta administrativa por shopping/ID; shopping excluído não permite consulta.
- Na primeira verificação desta etapa, cliente Prisma, typecheck e build foram aprovados; 37 testes passaram e 2 integrações ficaram pendentes porque ainda não havia `TEST_DATABASE_URL` ou serviço detectado. A instalação e a validação posteriores estão registradas na entrada imediatamente anterior.
- Comentários e mapa revisados; schema, serviço e rotas documentam as novas responsabilidades. Sem confirmação de importação, política de retenção ou substituição de artefato ativo nesta etapa.

## 7. Registro diário

Cada entrada mantém: data local, estado do dia, pacote/objetivo, evidências de entrada, alterações, verificações e resultados, pendências/bloqueios, primeira ação da retomada e situação Git. Acrescentar entradas sem apagar dias anteriores. O resumo das seções 1–6 deve acompanhar o estado mais recente.

### 23/09/2026 — consolidação das sprints e plano de correção

- **Estado:** D01 concluído; C01 planejado e pronto para implementação.
- **Pacote e objetivo:** corrigir contradições documentais encontradas na auditoria, incorporar o relato das Sprints 1–2 e as fotografias das Sprints 3–4 e ordenar a próxima correção funcional.
- **Situação de entrada:** P01–P05 constavam como concluídos, mas documentos ainda tratavam P05 como parcial, misturavam proposta com implementação e apresentavam ações administrativas históricas como se existissem no frontend atual.
- **Roteamento:** Ana como responsável principal pela documentação; Samuel revisa produto, API e dados; Juan revisa identidade; Elisa revisa jornada; Pietro revisa integração. A branch local `test/p05-integracao-samuel` foi preservada porque já continha trabalho e acompanha `origin/main`; não foi criada nova branch em árvore suja.
- **Entrega:** PRD e TRD consolidados; Sprints 1–4 registradas; paleta e Poppins catalogadas a partir da evidência fornecida; fluxo de telas, modelo de dados, inventário da API, decisões, matriz de rastreabilidade, índices e mapa atualizados. Capturas antigas de exclusão foram marcadas como históricas. O plano coloca C01 antes do P06.
- **Verificações:** `git diff --check` e `node scripts/verificar-documentacao.mjs` aprovados sobre o conjunto integrado. Não houve mudança funcional no frontend ou backend, portanto as suítes de código não foram repetidas nesta etapa documental.
- **Limites:** datas e divisão individual das Sprints 1–2, período da Sprint 4 e personas continuam como informação a ser fornecida. O Figma não foi alterado nem teve novos tokens atribuídos; a evidência de identidade é uma imagem fornecida pela equipe. PostgreSQL, navegador, Meta, hardware e Power BI não foram executados nesta etapa.
- **Próxima ação:** iniciar C01 revalidando a ficha Admin no navegador e restaurar os fluxos de exclusão de gerente, desfazer por sete segundos e exclusão de shopping conforme os contratos reais.
- **Git:** alterações locais, sem commit, push, PR ou deploy; a modificação preexistente em `vaggu-backend/.env.example` foi preservada.

### 21/09/2026 — retomada segura: mapa, acessos e foto do shopping

- **Estado:** implementação e validação concluídas; o dia permanece aberto até solicitação explícita de fechamento.
- **Pacote e objetivo:** disponibilizar a visualização 2D compartilhada para Admin e gerente, corrigir a ocultação indevida do mapa do gerente, atualizar a interface após mutações, permitir copiar a senha provisória e concluir a foto do shopping sem armazenar binários no PostgreSQL.
- **Situação de entrada:** `main` limpa e sincronizada com `origin/main` em `4261b16`. O commit mais recente já continha preview e endpoints preliminares de foto, mas persistia `BYTEA`, não enviava a seleção do formulário, não montava a foto nas telas e deixava um erro de lint. O Admin ainda usava somente a tabela de coordenadas; o Gerente recebia a estrutura correta da API, mas o frontend ocultava toda a árvore enquanto a implantação não fosse `ATIVO`.
- **Roteamento:** Pietro como responsável primário pelo escopo fullstack transversal; revisão indicada para Juan (visual), Elisa (jornada/QA) e Samuel (Prisma). Branch local `feat/mapa-admin-foto-shopping-pietro`, baseada em `main`/`origin/main` no commit `4261b16`.
- **Primeira ação:** estabilizar os contratos compartilhados do mapa e substituir a persistência binária da foto por uma referência de armazenamento externo, preservando a prévia local e deixando a ausência de configuração explícita.
- **Linha de base:** frontend build aprovado e lint reprovado apenas em `foto-shopping.tsx`; backend typecheck aprovado, suíte básica com 43 aprovações e três integrações puladas. A primeira integração PostgreSQL falhou por cliente Prisma local desatualizado; após `db:generate`, aprovou 32/32 cenários. O Figma não retornou o nó `2022:2` por exigir seleção ativa, então os componentes e tokens existentes são a referência verificada desta retomada.
- **Entrega:** `VisualizacaoVagas` centraliza o mapa 2D responsivo de Admin e gerente; o wrapper do gerente não oculta mais a estrutura durante a implantação. A ficha Admin recarrega estrutura após mutações, exibe foto/fallback, envia e remove a foto, e oferece cópia com feedback para a credencial recém-emitida. O backend usa Vercel Blob, salva somente `imagem_url`, remove o antigo `BYTEA` e deixa de persistir cópia reversível da senha provisória.
- **Causa do bug do gerente:** `MapaEstacionamento` encerrava a renderização para qualquer `situacaoImplantacao` diferente de `ATIVO`, embora a API retornasse corretamente shopping, andares, setores, vagas e posições. A condição foi substituída por aviso não bloqueante acima da visualização compartilhada.
- **Verificações:** backend `typecheck` aprovado; suíte básica com 43 aprovações e três integrações puladas; integração PostgreSQL 32/32; migrations 9/9 aplicadas no banco local. Frontend lint e build aprovados, mantendo apenas o aviso conhecido de chunk acima de 500 kB. Navegador autenticado confirmou mapa no Admin e gerente, troca de andar, categorias/estados, nova vaga refletida sem refresh, clipboard igual à senha exibida, preview de imagem, desktop, tablet e celular; console sem avisos ou erros.
- **Documentação e comentários:** contratos de credencial, imagem, mapa, configuração e responsabilidades dos arquivos foram atualizados. A extração do Figma ficou indisponível por falta de seleção ativa; a validação visual usou os tokens e componentes existentes, sem declarar fidelidade não comparada.
- **Limites:** nenhuma publicação, deploy ou configuração real do Vercel Blob foi autorizada. O upload externo foi comprovado por adapter nos testes; no ambiente local sem `BLOB_READ_WRITE_TOKEN`, somente seleção e preview foram validados no navegador e a API falha explicitamente com 503 ao tentar persistir. O dia permanece aberto até solicitação explícita de fechamento.
- **Git:** alterações locais na branch `feat/mapa-admin-foto-shopping-pietro`, sem commit, push, PR ou deploy solicitado.

### 21/09/2026 — retomada do P05: validação integrada

- **Estado:** aberto; pacote P05 concluído nesta retomada. O dia permanece aberto até solicitação explícita de fechamento.
- **Pacote e objetivo:** concluir o P05 validando a importação CSV/XLSX no PostgreSQL descartável e o fluxo administrativo autenticado contra a API real, sem declarar CA13–CA14 antes das evidências.
- **Situação de entrada:** implementação do backend e da interface já integrada à `origin/main`; árvore de trabalho limpa. A máquina possui artefatos locais ignorados de PostgreSQL, mas não há processo escutando nem `.env.teste.local` configurado no início da retomada.
- **Roteamento:** Samuel como responsável primário; revisões indicadas para Pietro, Ana Clara e Elisa. Branch local `test/p05-integracao-samuel`, baseada em `origin/main` no commit `e5cfcc84`.
- **Primeira ação:** conferir o runtime e o PostgreSQL locais sem expor credenciais, preparar uma conexão exclusiva terminada em `_teste` e executar a integração do backend.
- **Correções:** o advisory lock passou a converter o retorno `void` para texto antes da leitura pelo Prisma 7, preservando a serialização por shopping. A importação foi retirada do painel administrativo legado sem rota e montada na ficha Admin real; a área do gerente ficou somente com mapa e Minha conta. Grids e contêineres compartilhados foram restringidos para não ampliar a página em telas menores.
- **Verificações:** `npm.cmd run test:integracao` aprovou 32/32 cenários em PostgreSQL descartável. `npm.cmd test` aprovou 42 testes e manteve três integrações explicitamente puladas por não carregar `.env.teste.local` nesse comando. Frontend `npm.cmd run lint` e `npm.cmd run build` passaram; permanece apenas o aviso conhecido de bundle acima de 500 kB.
- **Navegador real:** Edge headless autenticou o Admin contra API e banco locais, cadastrou shopping, bloqueou confirmação de CSV inválido, confirmou CSV válido e mostrou a estrutura recarregada. Desktop e viewport móvel ficaram sem erro de console; a página móvel não apresentou transbordamento horizontal e as tabelas largas permaneceram em contêiner rolável.
- **Documentação e comentários:** responsabilidades revisadas nos arquivos tocados; o mapa foi atualizado somente onde a ficha Admin ganhou a importação. Índice, próximos passos, situação, backlog e próximo início foram reconciliados para P05 concluído e P06 pronto.
- **Limites:** XLSX foi coberto pelo leitor real e pelas rotas automatizadas, enquanto a jornada visual usou CSV. Meta, hardware, telemetria e Power BI não foram validados. O banco, credenciais, logs, capturas e scripts de verificação usados localmente permanecem ignorados pelo Git.
- **Próxima ação:** iniciar P06 estabilizando o contrato de firmware/telemetria e os testes CA15–CA24 antes da implementação.
- **Git:** alterações locais na branch `test/p05-integracao-samuel`, baseada em `origin/main` (`e5cfcc84`); nenhum commit, push, PR ou deploy solicitado.

### 21/09/2026 — banco local de testes para a equipe

- **Decisão:** a proposta Docker da branch foi cancelada pela equipe. Todos os arquivos e ajustes do commit `c957f349` foram revertidos sem reescrever o histórico; execução e instalação permanecem pelo fluxo npm/PostgreSQL anterior.
- **Documentação:** o guia canônico agora ensina cada integrante a criar o papel local `vaggu_teste_runner`, o banco de controle `vaggu_teste`, o arquivo ignorado `.env.teste.local` e executar `test:integracao`. Também explica isolamento, limpeza automática e diagnóstico sem expor credenciais.
- **Execução local da API:** o mesmo guia passou a diferenciar explicitamente produção, desenvolvimento e integração e inclui o fluxo Windows para criar `vaggu_local`, configurar o `.env`, aplicar migrations, iniciar a API e verificar os endpoints de saúde e prontidão.
- **Revisão de clareza:** `configuracao.md` foi reorganizado para parceiros novos, com pré-requisitos, primeira instalação, uso diário, resultados esperados, Prisma Studio, testes, encerramento, diagnóstico e distinção explícita entre o ambiente portátil desta máquina e uma instalação comum. O README da raiz agora aponta para esse guia como fonte única, sem duplicar uma configuração incompleta.
- **Evidência de execução:** PostgreSQL 17.11 iniciado em `127.0.0.1:55432`, banco `vaggu_p05_local` acessado, 7 migrations conferidas sem pendências, API iniciada em `127.0.0.1:3000` e endpoints `/health` e `/health/ready` aprovados.
- **Padrão documental:** `regras-de-codigo.md` agora exige instruções ordenadas, resultado verificável, separação entre instalação/uso/testes/produção e texto compreensível sem conversas anteriores ou arquivos ignorados.
- **Revisão do mapa:** as finalidades dos arquivos documentais e do README continuam corretas no mapa do projeto; nenhuma responsabilidade ou caminho estrutural mudou.
- **Segurança:** o banco de teste é local e separado de desenvolvimento/produção; o usuário possui `LOGIN` e `CREATEDB`, sem `SUPERUSER`. Nenhuma senha, banco ou arquivo local foi versionado.
- **Git:** correção preparada na mesma branch da proposta cancelada, com Juan como identidade executora e Pietro como coautor confirmado pela configuração local da equipe.

### 21/09/2026 — auditoria de documentação e estrutura

- **Objetivo:** confirmar que pastas e arquivos versionáveis possuem finalidade clara, reconciliar o estado atual e remover redundâncias sem uso.
- **Decisões:** removidos o painel demonstrativo sem rota e o hook de animação nunca importado; retirados seus tipos e estado locais legados e uma regra CSS órfã. Cópias de assets do cofre e índices documentais das skills foram mantidos porque atendem consumidores diferentes. A ponte `docs/` foi removida após confirmação da equipe, pois não possuía consumidor necessário.
- **Documentação:** o mapa passou a explicar as pastas principais e os 212 arquivos versionáveis; descrições genéricas foram corrigidas e o estado do P05 foi alinhado à implementação presente.
- **Verificação:** `node scripts/verificar-documentacao.mjs`, `npm.cmd run lint`, `npm.cmd run build` e `git diff --check` concluídos com código 0. O build mantém o aviso conhecido de chunk JavaScript acima de 500 kB.
- **Git:** trabalho local na branch `docs/auditoria-estrutura-ana`, criada a partir de `origin/main`; sem commit, push ou PR nesta sessão.

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

### 12–13/09/2026 — melhorias de interação, gerentes e senha

- **Estado:** encerrado por solicitação de Pietro; a implementação começou em 12/09 e o fechamento terminou após a virada para 13/09, no fuso America/Sao_Paulo.
- **Objetivo:** acrescentar resposta de clique aos cards, animar o rabisco em torno de “vagas”, permitir excluir um gerente com confirmação e sete segundos para desfazer e reforçar a criação da senha definitiva.
- **Decisão:** exclusão lógica preserva o ID e o estado anterior, encerra sessões imediatamente e oculta o acesso. O desfazer restaura o mesmo registro dentro da janela; depois dela, o e-mail pode ser cadastrado novamente sem duplicar a identidade.
- **Entrega presente no código:** migration incremental; rotas `DELETE /gerentes/:id` e `POST /gerentes/:id/desfazer-exclusao`; modal acessível; aviso Sonner com ação; microinterações de cards e rabisco SVG com movimento reduzido. A troca de senha agora exige 12–128 caracteres, minúscula, maiúscula, número, símbolo e ausência de espaços; possui olhos independentes, checklist vivo, confirmação e erros associados aos campos. A API é a autoridade e usa códigos distintos para cada requisito.
- **Verificações:** suíte completa 54/54 e integração PostgreSQL 29/29; os cenários cobrem sete falhas da política, repetição, senha atual incorreta e sucesso. Lint e build aprovados, com o aviso conhecido do bundle. Navegador aprovou rabisco, pressão do card, confirmação, encerramento do acesso, aviso e restauração do mesmo gerente; na troca de senha, aprovou os três olhos, checklist, confirmação, erros por campo, desktop 1440×1024 e viewport móvel, sem erros de console. A submissão válida pela interface não foi repetida porque a política de controle do navegador exige entrega ao usuário nesse passo; o mesmo contrato foi comprovado pela integração HTTP. Migration aplicada ao banco persistente `vaggu_local`; conta temporária e servidores de QA removidos. Mapa documental: 123 arquivos cobertos; `git diff --check` aprovado.
- **Evidências visuais:** três capturas guardadas em `Minha segunda mente/Vaggu/Evidências visuais/Melhorias - interações e gerentes`.
- **Resultado:** melhorias concluídas e dia encerrado; P05 continua sendo a próxima entrega planejada, sem início automático.
- **Próxima ação:** criar o contrato intermediário da importação e a prévia CSV sem escrita no banco, preparando a leitura XLSX sobre a mesma estrutura.
- **Git:** entrega funcional publicada na `main` em `c05d7e7` (`feat: reforca acessos e interacoes administrativas`); documentação final de fechamento publicada em seguida, com `main` e `origin/main` conferidas. Nenhum deploy foi solicitado.

### 13/09/2026 — exclusão de shopping, senha provisória e fechamento

- **Estado:** encerrado por solicitação de Pietro; não houve `start` específico para esta retomada.
- **Objetivo:** permitir ao Admin excluir um shopping, consultar a senha provisória do gerente até a primeira troca e remover o controle manual de pausa da animação da seção Sobre.
- **Decisões:** shopping usa exclusão lógica para preservar estrutura e histórico; a operação desativa seus gerentes, revoga sessões e apaga cópias provisórias. A senha provisória tem cópia cifrada disponível somente ao Admin enquanto a troca obrigatória estiver pendente; a senha definitiva permanece somente como hash. Os anéis da landing animam automaticamente quando visíveis e respeitam movimento reduzido, sem controle manual.
- **Entrega:** migration `20260913000100_senha_provisoria_e_exclusao_shopping`; rota `DELETE /shoppings/:shoppingId`; estados visuais de senha provisória, redefinida ou antiga indisponível; confirmação de exclusão; chave `CREDENTIAL_ENCRYPTION_KEY` documentada; botão de pausa e estilos associados removidos.
- **Verificações:** migration aplicada ao PostgreSQL local; integração 30/30; suíte básica 26 aprovações e uma integração explicitamente pulada; lint e build do frontend aprovados, com aviso conhecido de chunk acima de 500 kB; landing e login carregaram sem overlay ou erros de console; ausência do controle de pausa confirmada no DOM; documentação e `git diff --check` aprovados, com 125 arquivos cobertos.
- **Limites:** contas provisórias criadas antes da migration não possuem cópia recuperável e precisam de redefinição administrativa. Importação, telemetria, telões e Power BI continuam pendentes. Nenhum deploy foi realizado.
- **Próxima ação:** P05, começando pelo contrato intermediário da importação e pela prévia CSV sem escrita no banco, preparando XLSX sobre a mesma estrutura. Validar com testes de parser, integração do endpoint, lint, build e fluxo de prévia no navegador.
- **Ambiente:** API, frontend e PostgreSQL locais encerrados ao concluir o dia.
- **Git:** entrega funcional publicada na `main` no commit `8cf06f0` (`feat: amplia controle administrativo de acessos`); este fechamento documental foi preparado em seguida. Nenhum deploy foi realizado.

### 14/09/2026 — segunda mente canônica e animações

- **Objetivo:** compartilhar o cofre pelo repositório, eliminar fontes documentais concorrentes e reativar as animações no ambiente atual.
- **Decisões:** `segunda-mente/Vaggu/Vaggu.md` tornou-se o índice canônico. `docs/README.md` é somente uma ponte. Pela decisão mais recente da equipe, as animações da landing são automáticas, inclusive quando o navegador informa movimento reduzido, e não possuem botão ou controle manual de pausa.
- **Preservação:** 73 arquivos e 20.877.712 bytes foram copiados; `.obsidian/workspace.json` ficou de fora por ser estado local. Quatro deltas mais recentes de `docs` foram incorporados antes da remoção das cópias.
- **Verificações:** lint e build aprovados; mapa com 195 arquivos cobertos; localhost respondeu 200. No Edge, mesmo com `prefers-reduced-motion: reduce`, as três órbitas permaneceram em execução e mudaram de transformação entre duas medições; as conexões das etapas e do painel passaram de `100%` para `0%` ao entrar na tela. Nenhum controle de pausa ou animação foi encontrado no DOM.

### 15/09/2026 — revisão integral da segunda mente

- **Estado:** revisão documental concluída; não houve invocação de `$start` nem início de novo pacote de produto.
- **Objetivo:** conferir estrutura, navegação, fatos atuais, histórico, alinhamento com o código e utilidade do cofre compartilhado.
- **Entrega:** índices e resumos atualizados para o P05 parcial; decisões intermediárias sobre animações marcadas como substituídas; regra da senha provisória reconciliada; links corrompidos reparados; links de pastas substituídos por evidências reais; nota inicial transformada em guia; canvas vazio removido; verificador ampliado para links Obsidian e Markdown locais.
- **Verificações:** mapa com 206 arquivos e links internos válidos em Node 24.18.0; `git diff --check` aprovado; frontend lint/build aprovados com aviso conhecido de chunk; backend básico 38 aprovados e 2 integrações puladas; integração PostgreSQL 31/31 após sincronizar dependências e gerar o cliente Prisma.
- **Limites:** nenhuma nova validação visual, Figma, Meta, hardware ou Power BI. Registros antigos permanecem históricos; os resumos atuais são a referência de estado.
- **Próxima ação:** concluir P05 pela confirmação atômica e idempotente da prévia, preservando IDs e histórico, antes de criar a interface administrativa.
- **Git:** trabalho preparado em `docs/revisao-segunda-mente-ana`, baseada em `99125ef`; nenhuma publicação remota foi solicitada nesta revisão.
- **Limites:** o bundle principal ainda gera o aviso conhecido de tamanho acima de 500 kB. As mudanças estão locais e ainda não foram publicadas no remoto.

### 15/09/2026 — P05: confirmação backend da importação

- **Estado:** implementação backend em andamento na branch local `feat-p05-confirmacao-importacao-samuel`; responsável primário Samuel.
- **Entrega:** migration `20260915000100_confirmacao_importacao`; rota `POST /shoppings/:shoppingId/importacoes/:importacaoId/confirmar`; serviço idempotente que cria andares/setores ausentes, cria ou atualiza vagas pelo código do shopping, preserva IDs e histórico e não remove vagas ausentes da planilha. Um advisory lock transacional serializa confirmações estruturais por shopping e permite que uma repetição simultânea releia o resultado já confirmado.
- **Verificações:** cliente Prisma gerado com `DATABASE_URL` fictícia válida; `npm.cmd run typecheck` aprovado; `npm.cmd test` aprovado com 41 testes, 0 falhas e 3 skips explícitos por falta de `TEST_DATABASE_URL`; `git diff --check` aprovado. A suíte cobre parser, rota de confirmação, autorização e contrato SQL da migration, e o cenário de integração agora dispara duas confirmações concorrentes. O PostgreSQL 17 documentado em outra máquina não está instalado neste computador; o cenário real ficou pendente porque também não há `TEST_DATABASE_URL` nem `.env.teste.local` nesta retomada.
- **Limites:** ainda não há interface administrativa para importar/confirmar; a migration não foi aplicada ao banco local nesta sessão; telemetria, telões, histórico analítico e Power BI continuam fora deste pacote.
- **Próxima ação:** configurar `TEST_DATABASE_URL`, executar `npm.cmd run test:integracao`, aplicar `db:deploy` no banco local correto e validar a interface administrativa contra a API real.

### 15/09/2026 — P05: interface administrativa da importação — encerrado

- **Estado:** dia encerrado na branch local `feat-p05-confirmacao-importacao-samuel`; não houve invocação de `start`, então o fechamento foi reconstruído pelos commits, diff e verificações desta sessão. Integração multidisciplinar com Samuel responsável por dados/produto e revisão indicada para Pietro, Ana Clara e Elisa.
- **Entrega:** transporte autenticado de CSV/XLSX sem JSON; validação dos DTOs da API; seleção de arquivo com limites visíveis por formato; modelo CSV baixável com BOM UTF-8 e exemplos dos quatro tipos; resumo da prévia; tabelas de registros e erros; confirmação em modal; resumo do resultado e recarga da estrutura após aplicação. O cabeçalho autenticado também foi corrigido para não cortar o título no celular.
- **Verificações:** `npm.cmd run lint` e `npm.cmd run build` aprovados. O build mantém o aviso conhecido de bundle acima de 500 kB. Como o navegador integrado não estava disponível, o fallback Playwright validou com API simulada: login Admin, download `modelo-importacao-vaggu.csv` com conteúdo/BOM conferidos, upload CSV, prévias válida e inválida, erros por linha, bloqueio da confirmação inválida, modal, confirmação, resumo final, console com 0 erros/avisos e viewport de 360 px sem overflow horizontal. O `git fetch origin --prune` confirmou `origin/main` sem commits novos; a branch estava um commit à frente antes desta entrega. O `git pull` foi recusado pela camada de segurança por poder alterar o histórico, sem impacto porque não havia atualização remota a integrar.
- **Limites:** upload e confirmação reais ainda não foram executados no navegador porque este computador não possui PostgreSQL nem `TEST_DATABASE_URL`. A interface não conclui CA13–CA14 isoladamente.
- **Git:** entrega preparada para commit local com autoria individual de Samuel; nenhum push, PR, merge ou deploy autorizado neste fechamento.
- **Próxima ação:** seguir a seção “Próximo início”: validar migration e confirmação no PostgreSQL descartável, depois repetir no navegador com API real as prévias válida/inválida, a confirmação e a recarga da estrutura.
### 14/09/2026 — navegação e ficha administrativa de shoppings (Juan)

- **Objetivo:** iniciar o Admin pelo cadastro completo, separar a listagem de shoppings e reunir edição cadastral, vagas, estrutura e gerentes na ficha selecionada; evitar preenchimento automático do login e reaproveitar a senha provisória na troca obrigatória.
- **Entrega:** migration incremental compatível adiciona dados institucionais, endereço estruturado, horários e fuso. A API ganhou `GET/PATCH /shoppings/:id`. O frontend usa as rotas `/admin`, `/admin/shoppings` e `/admin/shoppings/:id`, com navegação responsiva, criação e edição de gerentes e resumo dos estados persistidos das vagas.
- **Segurança e dados:** a senha provisória digitada fica somente na memória da aba e é apagada ao trocar a senha, sair ou limpar a sessão. O login inicia vazio e não solicita autopreenchimento. Análises históricas continuam indisponíveis até existirem eventos reais; a ficha não exibe gráficos ou números inventados.
- **Verificações:** migration aplicada ao `vaggu_local`; integração PostgreSQL isolada 31/31; suíte básica do backend com 39 aprovações e duas integrações puladas quando executada sem `TEST_DATABASE_URL`; build backend, lint e build frontend aprovados. Capturas em 1440×1024 e 390×844 conferiram cadastro, lista e ficha completa; o fluxo real levou o gerente a `/trocar-senha` com a senha provisória já preenchida.
- **Limites:** documentos privados, telemetria e histórico analítico não foram implementados nesta entrega. O aviso conhecido de bundle acima de 500 kB permanece. Mudanças locais na branch `feat/admin-shoppings-juan`, sem commit, push ou deploy.

### 23/09/2026 — banco Neon e hospedagem pública

- **Responsável:** Samuel Santos (`mukinha01`).
- **Banco:** estrutura e dados existentes migrados para o PostgreSQL gratuito do Neon; a API usa a conexão somente por variável secreta do Render.
- **Hospedagem:** o serviço `vaggu-tcc` publica API e frontend na mesma origem, aplica migrations na inicialização e verifica o banco em `/api/v1/health/ready`.
- **Git:** o trabalho local da Sprint 4 foi preservado em `feat/p05-importacao-samuel`; depois, a `main` foi atualizada por avanço rápido e recebeu somente a adaptação de hospedagem compatível com a versão mais nova do sistema.
- **Verificações finais:** backend com 43 testes aprovados e três integrações puladas sem `TEST_DATABASE_URL`; frontend com lint e build aprovados; documentação com 223 arquivos cobertos e links internos válidos.
- **Limite do plano:** o serviço gratuito pode suspender por inatividade e demorar na primeira abertura seguinte; os dados permanecem persistidos no Neon.
