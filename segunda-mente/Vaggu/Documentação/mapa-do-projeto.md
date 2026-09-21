# Mapa do projeto VAGGU

O frontend começa em main.tsx, monta o provedor de sessão e encaminha /login, /trocar-senha, /admin e /painel. O cliente HTTP chama /api/v1 pelo proxy local do Vite; o backend server.ts conecta os serviços e app.ts monta as rotas. Serviços validam permissões antes de acessar o Prisma/PostgreSQL. A sessão do navegador permanece somente em memória.

Conhecimento, documentos e regras ficam em `segunda-mente`. As skills `start` e `end` usam o planejamento canônico da segunda mente como registro diário. Assets da aplicação ficam no `public` do frontend; o cofre mantém cópias próprias das evidências necessárias ao Obsidian. Dependências, builds, segredos e bancos ignorados não integram o mapa.

No Docker, `compose.yaml` encadeia `postgres` saudável, `migracoes` concluído, `backend` pronto e `frontend`. A rede bridge `interna` é própria do projeto e resolve nomes dos serviços; somente portas locais são publicadas. O volume nomeado `dados-postgres` persiste o banco fora do repositório. Os fontes são montados para leitura nos contêineres; dependências Linux e builds permanecem neles e são recriados a partir das imagens. Não se monta a pasta `ambiente.local` nem os `.env` nativos. Operação completa em [configuração](configuracao.md).

## Pastas principais

| Pasta | Finalidade |
| --- | --- |
| `scripts/` | Reúne verificações do repositório que não pertencem ao frontend nem ao backend. |
| `segunda-mente/` | Mantém o cofre Obsidian canônico, suas fontes, evidências e registros históricos. |
| `skills/` | Versiona rotinas operacionais usadas pelos agentes e pela equipe. |
| `vaggu-backend/` | Contém API, regras de domínio, persistência, integrações e testes do servidor. |
| `vaggu-frontend/` | Contém a aplicação React, componentes, páginas, contratos e assets publicados. |

As cópias de imagens entre `segunda-mente/Vaggu/Identidade visual/Assets/` e `vaggu-frontend/public/assets/` são intencionais: o cofre precisa renderizar a referência visual sem depender do bundle, enquanto a aplicação precisa publicar seus próprios arquivos. As notas em `segunda-mente/Vaggu/Skills/` são índices documentais, não implementações duplicadas.

## Arquivos versionáveis

| Arquivo | Responsabilidade |
| --- | --- |
| `.gitattributes` | Padroniza tratamento de arquivos e terminações de linha no Git. |
| `.gitignore` | Exclui ferramentas locais, segredos, dependências e saídas de build. |
| `.env.example` | Lista personalizações opcionais do Compose e padrões públicos exclusivos de desenvolvimento; o .env local permanece ignorado. |
| `compose.yaml` | Orquestra PostgreSQL 17.9, migrations explícitas, API e Vite, com saúde, portas locais configuráveis, rede interna do projeto e volume persistente. |
| `AGENTS.md` | Define escopo, regras de implementação, documentação e verificação para agentes. |
| `README.md` | Apresenta o produto, recursos entregues e comandos de execução. |
| `scripts/verificar-documentacao.mjs` | Confere se o mapa canônico explica os arquivos versionáveis e se os links internos da segunda mente possuem destino válido. |
| `skills/end/SKILL.md` | Documentação: Fechamento do dia — VAGGU. |
| `skills/end/agents/openai.yaml` | Metadados de descoberta e apresentação da skill no Codex. |
| `skills/rotear-trabalho-equipe/SKILL.md` | Roteia cada tarefa para o integrante responsável e seleciona ou cria uma branch segura e rastreável. |
| `skills/rotear-trabalho-equipe/agents/openai.yaml` | Metadados de descoberta e apresentação do roteador de trabalho da equipe. |
| `skills/rotear-trabalho-equipe/references/equipe.md` | Registra papéis, branches-base e critérios de desempate entre áreas da equipe. |
| `skills/rotear-trabalho-equipe/references/autoria-coletiva.md` | Define a atribuição honesta de coautoria para trabalho coletivo realizado em uma única máquina. |
| `skills/rotear-trabalho-equipe/scripts/gerar-coautoria.mjs` | Gera trailers `Co-authored-by` a partir da configuração local ignorada pelo Git, sem trocar identidades nem criar commits. |
| `skills/start/SKILL.md` | Documentação: Início do dia — VAGGU. |
| `skills/start/agents/openai.yaml` | Metadados de descoberta e apresentação da skill no Codex. |
| `vaggu-backend/.env.example` | Documenta variáveis de ambiente sem incluir credenciais reais. |
| `vaggu-backend/.dockerignore` | Limita o contexto de build aos fontes e configurações necessários, excluindo segredos, dependências, bancos e artefatos locais. |
| `vaggu-backend/Dockerfile` | Prepara Node/npm fixados, dependências Linux, cliente Prisma e compilação; recompila fontes por polling e reinicia a API no desenvolvimento. |
| `vaggu-backend/README.md` | Documentação: Vaggu Backend — 0.5.0. |
| `vaggu-backend/package-lock.json` | Fixa a árvore de dependências e integridade para instalação reproduzível via npm ci. |
| `vaggu-backend/package.json` | Declara dependências, faixa do Node e scripts de desenvolvimento, build e verificação. |
| `vaggu-backend/prisma.config.mjs` | Configura a CLI do Prisma: schema, migrations e conexão obtida do ambiente, sem credenciais no código. |
| `vaggu-backend/prisma/migrations/20260909000300_inicial_postgresql/migration.sql` | Cria o modelo PostgreSQL inicial de usuários, shoppings, sessões, placas, sensores, vagas e eventos do WhatsApp. |
| `vaggu-backend/prisma/migrations/20260912000100_estrutura_estacionamento/migration.sql` | Cria hierarquia, tipos, implantação, posições e relações compostas do P04. |
| `vaggu-backend/prisma/migrations/20260912000200_exclusao_reversivel_gerentes/migration.sql` | Acrescenta exclusão lógica de gerente, estado anterior e restrição de consistência para o desfazer. |
| `vaggu-backend/prisma/migrations/20260913000100_senha_provisoria_e_exclusao_shopping/migration.sql` | Acrescenta exclusão lógica de shopping e a cópia cifrada temporária da senha provisória. |
| `vaggu-backend/prisma/migrations/migration_lock.toml` | Registra o provedor PostgreSQL das migrations do Prisma. |
| `vaggu-backend/prisma/schema.prisma` | Define entidades, relações e restrições, incluindo estrutura, exclusão lógica, prévias e confirmação de importação. |
| `vaggu-backend/scripts/create-admin.ts` | Comando interativo para criar o primeiro administrador e exibir a senha gerada uma única vez no terminal. |
| `vaggu-backend/src/app.ts` | Monta a API Express, suas rotas e respostas de erro, sem abrir uma porta de rede. |
| `vaggu-backend/src/auth/bootstrap.ts` | Cria o primeiro administrador por uma operação de terminal, sem cadastro público. |
| `vaggu-backend/src/auth/credencial-provisoria.ts` | Cifra e revela a senha provisória enquanto a troca obrigatória estiver pendente. |
| `vaggu-backend/src/auth/middleware.ts` | Autentica sessões, exige perfis e fornece às rotas o escopo autorizado do usuário. |
| `vaggu-backend/src/auth/password.ts` | Protege senhas com scrypt e sal aleatório; guarda o resultado derivado, nunca a senha original. |
| `vaggu-backend/src/auth/routes.ts` | Expõe login, identidade, troca de senha e logout; delega as regras de sessão ao serviço. |
| `vaggu-backend/src/auth/service.ts` | Serviço de autenticação humana: valida credenciais, emite sessões opacas e recusa contas excluídas. |
| `vaggu-backend/src/config/database.ts` | Valida e normaliza a URL PostgreSQL usada pelo backend sem expor credenciais. |
| `vaggu-backend/src/config/env.ts` | Converte variáveis do processo em configuração da API e valida banco e porta. |
| `vaggu-backend/src/estrutura/routes.ts` | Expõe configuração administrativa e consulta isolada da estrutura pelo gerente. |
| `vaggu-backend/src/estrutura/service.ts` | Valida hierarquia, tipos, posições e revisões concorrentes do mapa. |
| `vaggu-backend/src/importacao/contratos.ts` | Define a representação intermediária e os erros da prévia de importação reutilizáveis por CSV e XLSX. |
| `vaggu-backend/src/importacao/parser-csv.ts` | Converte CSV em uma prévia validada por linha e campo, sem persistir alterações. |
| `vaggu-backend/src/importacao/parser-tabela.ts` | Centraliza cabeçalhos, tipos, duplicatas e erros usados igualmente pelas prévias CSV e XLSX. |
| `vaggu-backend/src/importacao/parser-xlsx.ts` | Lê a primeira planilha XLSX com limites explícitos e a converte para o contrato tabular comum. |
| `vaggu-backend/src/importacao/routes.ts` | Expõe criação, consulta e confirmação administrativa de importações estruturais. |
| `vaggu-backend/src/importacao/service.ts` | Persiste prévias, confirma a estrutura de forma idempotente e restringe consultas ao shopping indicado. |
| `vaggu-backend/prisma/migrations/20260914000100_previas_importacao/migration.sql` | Cria armazenamento JSONB de prévias com vínculo ao shopping, índice e restrições de formato. |
| `vaggu-backend/prisma/migrations/20260914000200_dados_cadastrais_shopping/migration.sql` | Amplia a ficha do shopping com dados institucionais, endereço, horários e fuso, mantendo registros anteriores compatíveis. |
| `vaggu-backend/prisma/migrations/20260915000100_confirmacao_importacao/migration.sql` | Registra revisão e confirmação idempotente das prévias de importação estrutural. |
| `vaggu-backend/test/importacao-postgresql.test.ts` | Verifica persistência, isolamento de consulta e preservação de vagas e histórico em PostgreSQL descartável. |
| `vaggu-backend/src/conta/routes.ts` | Expõe consulta e edição da conta usando exclusivamente a identidade da sessão. |
| `vaggu-backend/src/conta/service.ts` | Atualiza somente dados pessoais permitidos, sem conceder mudanças de perfil ou shopping. |
| `vaggu-backend/src/lib/prisma.ts` | Cria o cliente Prisma compartilhado; serviços aceitam cliente transacional por injeção. |
| `vaggu-backend/src/server.ts` | Ponto de entrada executável: lê a configuração, conecta os serviços e inicia o HTTP. |
| `vaggu-backend/src/shoppings/routes.ts` | Rotas administrativas de cadastro, consulta e edição da ficha de shoppings, gerentes, exclusões e senha provisória. |
| `vaggu-backend/src/shoppings/service.ts` | Valida e administra a ficha institucional dos shoppings e seus gerentes, incluindo exclusão lógica, senha provisória e restauração por sete segundos. |
| `vaggu-backend/src/whatsapp/client.ts` | Cliente de envio de texto pela API da Meta; recebe configuração privada e transporte substituível em testes. |
| `vaggu-backend/src/whatsapp/payload.ts` | Interpreta o formato externo do webhook e mantém os textos do menu demonstrativo. |
| `vaggu-backend/src/whatsapp/routes.ts` | Recebe o desafio de configuração e os eventos da Meta, validando sua origem antes de processá-los. |
| `vaggu-backend/src/whatsapp/service.ts` | Coordena mensagens recebidas, deduplicação persistente e respostas do menu demonstrativo. |
| `vaggu-backend/src/whatsapp/signature.ts` | Calcula e verifica assinaturas HMAC para confirmar que o corpo recebido veio de quem possui o segredo Meta. |
| `vaggu-backend/test-support/admin-cases.ts` | Verifica acessos administrativos, bloqueio, exclusão, prazo para desfazer e reutilização segura do e-mail. |
| `vaggu-backend/test-support/auth-cases.ts` | Cenários sequenciais de autenticação e isolamento, usados pelo runner com banco exclusivo. |
| `vaggu-backend/test-support/banco-de-teste.ts` | Prepara um banco PostgreSQL exclusivo por execução e aplica as migrations versionadas. |
| `vaggu-backend/test-support/estrutura-cases.ts` | Verifica hierarquia, mapa, implantação e isolamento do P04 em PostgreSQL real. |
| `vaggu-backend/test/app.test.ts` | Verifica montagem da API, saúde, prontidão e respostas para rotas inexistentes. |
| `vaggu-backend/test/env.test.ts` | Verifica leitura e rejeição das variáveis de ambiente obrigatórias. |
| `vaggu-backend/test/integracao-acessos.test.ts` | Executa os cenários HTTP de autenticação e administração em PostgreSQL descartável. |
| `vaggu-backend/test/importacao-csv.test.ts` | Verifica a prévia CSV do P05, incluindo normalização, duplicatas, colunas ausentes e sintaxe inválida. |
| `vaggu-backend/test/importacao-routes.test.ts` | Verifica autorização e transporte HTTP da prévia CSV administrativa. |
| `vaggu-backend/test/prisma-postgresql.test.ts` | Confere provider, relações, índices e migrations PostgreSQL relevantes. |
| `vaggu-backend/test/whatsapp.test.ts` | Verifica assinatura, desafio, interpretação, deduplicação e respostas do webhook WhatsApp. |
| `vaggu-backend/tsconfig.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/components.json` | Configura aliases e estilo de geração dos componentes shadcn. |
| `vaggu-frontend/.dockerignore` | Permite somente entradas da imagem web e impede incluir ambientes, segredos, bancos, caches ou perfis locais. |
| `vaggu-frontend/Dockerfile` | Instala dependências do lockfile com Node/npm fixados e inicia Vite de desenvolvimento acessível pelas portas do Compose. |
| `vaggu-frontend/eslint.config.js` | Configura o ESLint para TypeScript, React Hooks e recarga do Vite. |
| `vaggu-frontend/index.html` | Documento de entrada do Vite e ponto de montagem do React. |
| `vaggu-frontend/package-lock.json` | Fixa a árvore de dependências e integridade para instalação reproduzível via npm ci. |
| `vaggu-frontend/package.json` | Declara dependências, faixa do Node e scripts de desenvolvimento, build e verificação. |
| `vaggu-frontend/public/assets/city-flow-vaggu.png` | Asset visual city-flow-vaggu.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/hero-vaggu.png` | Asset visual hero-vaggu.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/mockup-laptop-vaggu.svg` | Asset visual mockup-laptop-vaggu.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/phones-vaggu.png` | Asset visual phones-vaggu.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/vaggu-circulado.png` | Variante circular da marca preservada no catálogo público; não está montada nas telas atuais. |
| `vaggu-frontend/public/assets/vaggu-foto-homem-login-sem-fundo.png` | Asset visual vaggu-foto-homem-login-sem-fundo.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/vaggu-logo-white.svg` | Asset visual vaggu-logo-white.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/vaggu-logo-yellow.svg` | Variante amarela do logotipo preservada no catálogo público; não está montada nas telas atuais. |
| `vaggu-frontend/public/assets/vaggu-logo.svg` | Asset visual vaggu-logo.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/src/app/app-store.tsx` | Mantém token apenas em memória, valida identidade na API e gerencia sessão, troca de senha, consultas autenticadas, envio de arquivos e atualização da própria conta. |
| `vaggu-frontend/src/components/brand.tsx` | Reutiliza os arquivos de marca publicados em public/assets nos links para a página inicial. |
| `vaggu-frontend/src/components/dashboard-shell.tsx` | Compartilha cabeçalho, menu responsivo e saída da sessão entre os painéis autenticados. |
| `vaggu-frontend/src/components/estrutura-admin.tsx` | Permite ao Admin criar a hierarquia, escolher implantação e salvar posições do mapa. |
| `vaggu-frontend/src/components/importacao-estrutura.tsx` | Permite ao Admin baixar o modelo CSV, enviar CSV/XLSX, revisar registros e erros, confirmar a importação e consultar o resumo aplicado. |
| `vaggu-frontend/src/components/formulario-shopping.tsx` | Compartilha os campos institucionais, endereço, horários e fuso entre cadastro e edição do shopping. |
| `vaggu-frontend/src/components/mapa-estacionamento.tsx` | Exibe ao gerente andares, busca, filtros, posições e estados do próprio shopping. |
| `vaggu-frontend/src/components/icone-whatsapp.tsx` | Disponibiliza o símbolo usado nos links de atendimento, sem requisições externas. |
| `vaggu-frontend/src/components/operacao-vaggu.css` | Foto e conteúdo dividem a seção sem impor uma altura vazia acima dos benefícios. |
| `vaggu-frontend/src/components/operacao-vaggu.tsx` | Relaciona a imagem de movimento urbano aos benefícios da gestão e ao atendimento. |
| `vaggu-frontend/src/components/protected-route.tsx` | Protege a navegação com identidade da API; autorização de recursos continua no backend. |
| `vaggu-frontend/src/components/sobre-vaggu.css` | Escala, anéis automáticos e pesos da landing; medidas compartilhadas mantêm as conexões alinhadas. |
| `vaggu-frontend/src/components/sobre-vaggu.tsx` | Apresenta a solução, a jornada comercial e os benefícios conectados ao painel. |
| `vaggu-frontend/src/components/ui/alert.tsx` | Componente de interface reutilizável alert; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/avatar.tsx` | Componente de interface reutilizável avatar; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/badge.tsx` | Componente de interface reutilizável badge; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/button.tsx` | Componente de interface reutilizável button; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/card.tsx` | Componente de interface reutilizável card; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/dialog.tsx` | Componente de interface reutilizável dialog; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/field.tsx` | Componente de interface reutilizável field; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/input.tsx` | Componente de interface reutilizável input; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/label.tsx` | Componente de interface reutilizável label; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/separator.tsx` | Componente de interface reutilizável separator; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/sheet.tsx` | Componente de interface reutilizável sheet; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/sonner.tsx` | Componente de interface reutilizável sonner; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/table.tsx` | Componente de interface reutilizável table; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/tooltip.tsx` | Componente de interface reutilizável tooltip; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/hooks/use-scroll-reveal.ts` | Revela uma vez os blocos da landing conforme entram na viewport; a decisão atual mantém esse movimento automático. |
| `vaggu-frontend/src/index.css` | Reúne tema global, responsividade e microinterações dos cards acionáveis. |
| `vaggu-frontend/src/lib/constants.ts` | Publica links de contato somente após configurar o número oficial da equipe. |
| `vaggu-frontend/src/lib/utils.ts` | Combina classes condicionais e resolve conflitos de utilitários Tailwind. |
| `vaggu-frontend/src/main.tsx` | Inicializa o React e reúne tema, navegação, mensagens e sessão autenticada das páginas. |
| `vaggu-frontend/src/pages/admin-page.tsx` | Implementa o fluxo autenticado de cadastrar, listar e abrir a ficha do shopping com dados, vagas, estrutura e gerentes. |
| `vaggu-frontend/src/pages/area-autenticada.tsx` | Mantém o painel operacional e a edição da própria conta do gerente; o Admin usa a página administrativa dedicada. |
| `vaggu-frontend/src/pages/landing-page.tsx` | Compõe a landing pública e encaminha o contato comercial ao WhatsApp. |
| `vaggu-frontend/src/pages/login-page.css` | Define composição responsiva do login, troca de senha e desenho animado do rabisco em “vagas”. |
| `vaggu-frontend/src/pages/login-page.tsx` | Entrada única para Admin e gerente, sem solicitar preenchimento automático das credenciais ao abrir a página. |
| `vaggu-frontend/src/pages/trocar-senha-page.tsx` | Exige uma senha definitiva e reaproveita na aba a senha provisória digitada no login. |
| `vaggu-frontend/src/servicos/api.ts` | Cliente autenticado da API para GET, POST, PATCH e DELETE; tokens ficam somente em memória. |
| `vaggu-frontend/src/servicos/estrutura.ts` | Valida a árvore pública de andares, setores, vagas e posições recebida da API. |
| `vaggu-frontend/src/servicos/importacao.ts` | Valida as respostas da API de prévia e confirmação antes de entregá-las à interface administrativa. |
| `vaggu-frontend/src/servicos/shoppings.ts` | Valida fichas, listas e gerentes recebidos pelas rotas administrativas. |
| `vaggu-frontend/src/types/app.ts` | Declara o contrato da identidade autenticada compartilhado pela interface. |
| `vaggu-frontend/src/types/estrutura.ts` | Declara os contratos TypeScript da estrutura, implantação, tipos e mapa. |
| `vaggu-frontend/src/types/admin.ts` | Declara os contratos TypeScript da ficha administrativa de shopping e gerente. |
| `vaggu-frontend/src/types/importacao.ts` | Declara prévias, erros, registros e resumos da importação estrutural. |
| `vaggu-frontend/src/vite-env.d.ts` | Disponibiliza ao TypeScript os tipos de ambiente fornecidos pelo Vite. |
| `vaggu-frontend/tsconfig.app.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/tsconfig.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/tsconfig.node.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/vite.config.ts` | Configura React, Tailwind, aliases, proxy /api para o backend e polling opcional dos fontes no Docker Desktop. |
