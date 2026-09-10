# VAGGU — planejamento e continuidade do projeto

Última revisão: **10/09/2026**, fuso **America/Sao_Paulo**. Base da revisão: `368a774`; a entrega da landing, documentação e skills compõe o fechamento Git descrito na seção 7. Este documento registra evidências e orienta o trabalho diário; não substitui o [SSD](SSD-VAGGU.md) nem os [critérios de aceite](plano-e-aceite.md).

## 1. Situação atual

A apresentação pública foi refinada e conferida no navegador. O frontend autenticado continua sendo um **protótipo local**, com contas de demonstração e persistência em `localStorage`. O backend possui módulos de autenticação, contas, shoppings e webhook WhatsApp, mas **não está conectado ao frontend**. Mapa operacional, telemetria, telões, análises reais e Power BI ainda precisam ser implementados.

A revisão final não libera o sistema para operação com clientes. Foram encontrados problemas nos comandos de inicialização e na descoberta dos testes do backend, além de um erro de lint do frontend. As correções estão ordenadas abaixo; esta revisão não as executou.

Classificações: **verificado** exige execução do comportamento indicado; **presente no código** significa inspeção estática; **parcial** identifica uma entrega incompleta; **ausente** indica que não foi encontrada implementação no escopo inspecionado. Um teste simulado não comprova banco, hardware ou serviço externo real.

## 2. O que foi implementado

| Área | Estado em 10/09 | Evidência e limite |
| --- | --- | --- |
| Landing, marca, login separado e contato comercial | Verificado na interface; contato real pendente | [Landing](../vaggu-frontend/src/pages/landing-page.tsx). CTA usa `wa.me`, mas o número configurado é de exemplo; não foi enviada mensagem. |
| Seção Sobre | Verificado | [Componente](../vaggu-frontend/src/components/sobre-vaggu.tsx) e [estilos](../vaggu-frontend/src/components/sobre-vaggu.css): texto de apresentação, anéis, etapas, notebook e benefícios. |
| Movimento e responsividade da seção Sobre | Verificado durante esta sessão | Pontos percorrem os anéis, pausam fora da tela e por controle do usuário; movimento reduzido desativa a animação. Conexões das etapas e benefícios acompanham o layout. Conferências entre 320 e 1440 px registradas na sessão. |
| Seção abaixo do Sobre | Verificado | [Operação VAGGU](../vaggu-frontend/src/components/operacao-vaggu.tsx): foto urbana, título, explicação, benefícios e contato. Conteúdo usa hierarquia mais leve e altura ajustada. |
| Remoção das legendas | Verificado novamente nesta revisão | Não há legenda visível do notebook nem texto de pausa. Permanece botão por ícone com nome acessível; o `alt` do notebook informa que é ilustração. |
| Login, cadastro Admin e painel do shopping no frontend | Protótipo presente no código | [Store local](../vaggu-frontend/src/app/app-store.tsx), [Admin](../vaggu-frontend/src/pages/admin-page.tsx) e [painel](../vaggu-frontend/src/pages/mall-panel-page.tsx). SHA-256, hashes e identidade de sessão ficam no navegador; isso não implementa autorização real. |
| Estado sem sensores | Parcial | Painel mostra preparação, sensores não conectados e análises inativas. Ainda não consulta estados reais da API; CA08 não está validado de ponta a ponta. |
| Base Express e saúde | Presente no código | [Aplicação](../vaggu-backend/src/app.ts): health/readiness, Helmet, limites de JSON e erros públicos. Execução do backend não realizada nesta revisão. |
| Autenticação e conta na API | Presente no código | [Auth](../vaggu-backend/src/auth/service.ts), [middlewares](../vaggu-backend/src/auth/middleware.ts) e [conta](../vaggu-backend/src/conta/service.ts): sessão opaca, hash do token, validade, troca obrigatória, revogação e dados pessoais permitidos. |
| Shoppings e vários gerentes | Parcial, presente na API | [Serviço](../vaggu-backend/src/shoppings/service.ts): criação/listagem de shoppings; criação/listagem, alteração/bloqueio e redefinição de senha de gerentes. Frontend real, ficha completa e etapas de implantação faltam. |
| Persistência PostgreSQL | Schema e migration presentes | [Schema](../vaggu-backend/prisma/schema.prisma) e migrations: usuários, sessões, shoppings, dispositivos, vagas, histórico e eventos WhatsApp. Aplicação e integridade em banco real não verificadas nesta revisão. |
| Webhook WhatsApp | Parcial | [WhatsApp](../vaggu-backend/src/whatsapp/service.ts): assinatura, distinção entre mensagens/status, deduplicação e cliente Meta. Conversa contém menu de teste; fluxos de demonstração/suporte não estão concluídos. |
| Skills de continuidade | Criadas, validadas e instaladas | Fontes versionadas em [start](../skills/start/SKILL.md) e [end](../skills/end/SKILL.md); cópias em `C:/Users/CASA/.codex/skills/start` e `end` conferidas por hash. Usam este documento como registro compartilhado. |
| Mapa, andares, setores, tipos e importação | Ausentes como funcionalidade operacional | O schema inicial de vagas não entrega a hierarquia, posições, mapa nem importações exigidas. |
| ESP32, sensores, confirmação e expiração | Ausentes como fluxo funcional | Entidades iniciais não equivalem a ingestão, confirmação consistente de 30 s, ordenação, expiração ou manutenção. |
| Histórico consultável, contagens, telões e exportações | Ausentes como fluxo funcional | Exigem observações confirmadas e isolamento; não confundir a imagem da landing com um painel de dados real. |
| Power BI | Ausente | Nenhum relatório funcional com histórico e atualização foi verificado/encontrado no projeto. |

## 3. Revisão final — achados e prioridades

| ID | Prioridade | Evidência | Impacto e encaminhamento |
| --- | --- | --- | --- |
| R01 | Alta para iniciar a API | `vaggu-backend/package.json`, scripts `dev`/`start`, apontam para `dist/server.js`; `tsconfig.json` usa `rootDir: "."` e fonte `src/server.ts`. | Saída esperada é `dist/src/server.js`. Ajustar comandos e comprovar inicialização após build. Achado estático, sem tentativa de iniciar a API nesta revisão. |
| R02 | Alta para confiar nos testes | `test-support/auth-cases.ts` e `admin-cases.ts` exportam `runAuthCases`/`runAdminCases` sem chamada encontrada nos quatro arquivos `test/*.test.ts`. | `npm test` não executa esses cenários. Criar entrada de integração com PostgreSQL de teste isolado; falha/skip por ambiente ausente deve ficar explícito. CA04–CA07 continuam pendentes. |
| R03 | Alta para executar o backend | Node local `v26.7.0`; `engines` do backend exige `>=22.12.0 <25`; pasta `node_modules` do backend ausente. | Usar runtime compatível antes de instalar e testar. Não atualizar engines nem dependências apenas para silenciar incompatibilidade. |
| R04 | Alta para sair da demonstração | `app-store.tsx`, funções de login/persistência, e `protected-route.tsx`; nenhuma integração HTTP da aplicação encontrada. | A identidade pode ser alterada no navegador. Ligar frontend aos contratos da API; backend deve decidir perfil, shopping e primeira senha. Não migrar hashes/senhas locais para contas reais. |
| R05 | Média, bloqueia lint | `src/hooks/use-scroll-animations.ts:3`, import `useMotionTemplate` sem uso. | `npm run lint` retorna 1. Correção focalizada no próximo pacote. |
| R06 | Média, bloqueia contato real | `src/lib/constants.ts:1`, número WhatsApp de exemplo. | Confirmar número com a equipe e configurar contato real; nunca inventar destinatário nem enviar mensagem de teste sem autorização. |
| R07 | Média, retomada WhatsApp | `src/whatsapp/service.ts`, `claimMessage`: somente `FALHOU` pode ser retomado. | Queda após gravar `PROCESSANDO` pode deixar reentregas presas como duplicadas. Implementar expiração de posse/retomada e tratar o risco de envio duplicado. |
| R08 | Média, integração Admin | `publicUser` em `auth/service.ts` não inclui `ativo`; listagem/alteração de gerentes reutiliza essa projeção. | Criar resposta administrativa segura com situação de bloqueio; não expor hash, senha ou token. |
| R09 | Média, evolução do backend | `tsconfig.json`: `strict` e `noImplicitAny` desativados; contratos de serviços incompletos. | Tipar fronteiras e módulos tocados progressivamente; evitar refatoração global junto da integração. |
| R10 | Baixa, acabamento | CSS ainda contém regra de `figcaption` removido; pacote frontend gera aviso de bundle acima de 500 kB. | Remover estilo sem uso na próxima manutenção focalizada. Avaliar divisão por rotas quando a integração aumentar o bundle. Não é falha de build. |

Revisão visual: composição, tipografia, cores, imagens, conexões e comportamento em telas menores foram comparados com os anexos e com as correções posteriores da equipe. Não houve nova extração de medidas do Figma: a integração retornou erro de seleção na etapa anterior. Mantêm-se as pendências do [guia visual](regras-visuais.md).

## 4. Verificações executadas e limites

| Conferência | Resultado em 10/09/2026 |
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

## 5. Backlog ordenado

Estados do backlog: **pronto**, **em andamento**, **bloqueado**, **concluído**. Dependências ainda não entregues permanecem explícitas. A prioridade não é uma promessa de prazo.

| ID | Entrega | Estado | Dependências | Critério para concluir |
| --- | --- | --- | --- | --- |
| P01 | Base local verificável: R01, R02, R03 e R05 | Pronto | Runtime e PostgreSQL de teste precisam ser preparados/confirmados; correções de arquivos podem avançar sem eles. | API inicia pelo caminho gerado; frontend lint/build passam; cenários auth/admin entram de fato no runner e passam em banco de teste. Enquanto essa validação estiver pendente, manter o pacote aberto. |
| P02 | Integrar login, sessão, troca obrigatória e saída | Bloqueado por P01 | Contratos existentes em `/api/v1/auth/login`, `/me`, `/change-password`, `/logout`; conferir montagem, origem/proxy e armazenamento da sessão. | Frontend consulta identidade da API; senha provisória restringe acesso, troca libera; expiração e logout revogam acesso. CA05 e parte de CA07 em navegador/API. |
| P03 | Integrar Admin, vários gerentes e minha conta | Bloqueado por P02 | DTO de situação do gerente (R08) e contratos reais de shopping/conta. | Dois gerentes independentes no mesmo shopping; bloquear um invalida sua sessão; conta edita só campos permitidos. CA04, CA06, CA07. |
| P04 | Estrutura e implantação: andares, setores, vagas, categorias e mapa | Bloqueado por P03 | Migrations incrementais e contratos de estrutura estáveis. | Implantação expõe estado “em configuração” (CA08); Admin configura e gerente consulta mapa em dois andares, filtros e seleção; sem motos. CA09–CA12 e isolamento. |
| P05 | Importação CSV/XLSX com prévia e preservação de histórico | Bloqueado por P04 | IDs e modelo de estrutura definidos. | Erros por linha, confirmação consistente e atualização sem apagar histórico. CA13–CA14. |
| P06 | ESP32/sensores, ingestão e estados confiáveis | Bloqueado por P04 | Contrato de firmware: autenticação, sensor, inicialização, sequência, frequência e expiração. | Confirmação de 30 s com evidência, deduplicação, ordem e expiração por sensor; histórico transacional. CA15–CA24. |
| P07 | Operação, manutenção, contagens e telões | Bloqueado por P06 | Observações confiáveis e ocorrências. | Contagens reconciliadas sem duplicar categorias; dado vencido não vira livre. CA23–CA26. |
| P08 | Histórico, métricas e exportações | Bloqueado por P06/P07 | Intervalos confirmados, cobertura e recortes. | Cálculos reproduzem conjunto controlado; exportações respeitam shopping e filtros. CA27–CA31. |
| P09 | Primeiro relatório funcional Power BI | Bloqueado por P08 | Histórico disponível e decisão de distribuição/acesso. | Atualização funcional e métricas reconciliadas (CA32); isolamento de acesso (CA33) só concluído na distribuição efetiva. |
| P10 | Concluir contato e fluxos comerciais WhatsApp | Pronto para trabalho independente | Número oficial, ambiente Meta autorizado; recuperação de processamento (R07). | Demonstração/suporte coletam dados e registram solicitação sem duplicação; atendimento encaminhado à equipe. CA01–CA03. |
| P11 | Revisão integrada para apresentação do TCC | Bloqueado pelas entregas utilizadas na demonstração | Fluxos completos, dados identificados e ambiente reproduzível. | Executar roteiro de `plano-e-aceite.md`, declarar limitações e validar CA34–CA36 conforme o escopo. |

Preservar os limites do produto: web responsiva, sem cadastro público de gerente, sem reservas/pagamentos/reconhecimento de veículos/chatbot de IA. Power BI e hardware não podem ser declarados integrados a partir de imagens, fixtures ou espaços reservados.

## 6. Próximo início

- **Pacote selecionado:** P01 — base local verificável.
- **Objetivo do próximo dia:** preparar uma base que permita testar a integração com confiança.
- **Primeira ação concreta:** conferir estado Git, scripts e runtime; corrigir `dev`/`start` para a saída real do compilador e remover o import sem uso do frontend. Não iniciar pela migração completa da interface.
- **Depois:** preparar um runner que chame `runAuthCases` e `runAdminCases` com PostgreSQL de teste identificado, fixtures isoladas e descarte limitado aos dados desse teste. Testes sem banco devem sinalizar pendência, nunca sucesso simulado.
- **Arquivos de entrada:** `vaggu-backend/package.json`, `tsconfig.json`, `test-support/*`, `test/*`, `vaggu-frontend/src/hooks/use-scroll-animations.ts` e READMEs pertinentes.
- **Validação prevista:** frontend lint/build; backend typecheck/build, inicialização/health e execução dos cenários de auth/admin em banco de teste. Confirmar comandos reais antes de executar.
- **Dependências em aberto:** runtime compatível e conexão PostgreSQL de teste. Não ler/imprimir segredos em relatório nem usar banco real como fixture. Sem esses recursos, entregar correções independentes e registrar validação pendente.
- **Condição de parada do pacote:** aceite de P01 satisfeito, impedimento que exija decisão externa, ou novo direcionamento do usuário. Ao concluir, atualizar o próximo início para P02; não começar P02 automaticamente no mesmo pedido de fechamento.

## 7. Registro diário

Cada entrada mantém: data local, estado do dia, pacote/objetivo, evidências de entrada, alterações, verificações e resultados, pendências/bloqueios, primeira ação da retomada e situação Git. Acrescentar entradas sem apagar dias anteriores. O resumo das seções 1–6 deve acompanhar o estado mais recente.

### 10/09/2026 — fechamento da revisão e preparação da continuidade

- **Estado:** encerrado em 10/09/2026; fechamento consolidado por `$end`, sem invocação prévia de `$start` nesta sessão. P01 preparado para o próximo início. Nenhuma etapa operacional adicional foi implementada nesta revisão.
- **Entrega da sessão:** refinamento da landing (Sobre, anéis, etapas e seção da foto), remoção das legendas a pedido da equipe, revisão do frontend/backend e criação deste planejamento e das skills.
- **Verificação:** resultados e limites na seção 4. Skills aprovadas na validação estrutural e revisão de comportamento; fontes e cópias instaladas idênticas por hash. Ambas constam no catálogo disponível; `end` foi lida e aplicada neste fechamento. As verificações anteriores permanecem válidas para o mesmo código; não foram repetidas sem mudança correspondente.
- **Arquivos da entrega:** componentes `sobre-vaggu` e `operacao-vaggu` (TSX/CSS), `landing-page.tsx`, este planejamento, guia visual, índices README, `AGENTS.md` e fontes/metadados de `skills/start` e `skills/end`.
- **Ambiente local:** servidor Vite iniciado pela sessão em `http://127.0.0.1:5173/`; não foi encerrado pelo fechamento. Confirmar disponibilidade ao retomar.
- **Pendências preservadas:** R01–R10 e backlog P01–P11. Não há data prometida para uma implantação real.
- **Próxima retomada:** P01, começando pelos caminhos de inicialização e pelo lint. A invocação de `start` inicia o pacote; este registro sozinho não dispara execução.
- **Git:** entrega preparada sobre `368a774` na `main`, com commit e push explicitamente autorizados pela equipe. Este registro integra o commit de fechamento; consultar `git log` e a referência `origin/main` para identificar o hash publicado e conferir sincronização no próximo início. Não houve solicitação de deploy.

## 8. Uso das skills

Invocar `$start` para iniciar o dia de projeto e executar o pacote registrado em “Próximo início”. Invocar `$end` para consolidar o que de fato mudou, registrar verificações e deixar a primeira ação do próximo dia pronta.

As fontes ficam em `skills/start` e `skills/end`. As cópias de descoberta são instaladas em `$CODEX_HOME/skills` ou, quando essa variável está vazia, `~/.codex/skills`. Neste ambiente o destino padrão é `C:/Users/CASA/.codex/skills`. Alterações futuras nas fontes devem ser sincronizadas com essas cópias, após comparar diferenças e preservar customizações.

Se a lista de skills da conversa atual ainda não refletir a instalação, abrir uma nova conversa no projeto. Também é possível pedir para ler `skills/start/SKILL.md` ou `skills/end/SKILL.md` diretamente. Não há agendamento: as skills são acionadas pela conversa, não executam sozinhas quando a data muda.

`start` reutiliza uma entrada já aberta na mesma data e reabre a entrada se o trabalho for retomado após o fechamento. Se o dia anterior não teve `end`, marca a entrada anterior como interrompida e vincula sua continuidade ao dia atual, sem fabricar resultados. `end` fecha a entrada da sessão atual; repetido no mesmo dia, atualiza o fechamento sem duplicar entregas. Nenhuma das skills publica, envia mensagens ou altera um banco real por autorização implícita do planejamento.
