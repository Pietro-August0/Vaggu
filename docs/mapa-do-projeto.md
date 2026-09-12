# Mapa do projeto VAGGU

O frontend começa em main.tsx, monta o provedor de sessão e encaminha /login, /trocar-senha, /admin e /painel. O cliente HTTP chama /api/v1 pelo proxy local do Vite; o backend server.ts conecta os serviços e app.ts monta as rotas. Serviços validam permissões antes de acessar o Prisma/PostgreSQL. A sessão do navegador permanece somente em memória.

Documentos e regras ficam em docs; skills/start e skills/end usam o planejamento como registro diário. Assets ficam no public do frontend. Dependências, builds, segredos e bancos ignorados não integram o mapa.

| Arquivo | Responsabilidade |
| --- | --- |
| `.gitattributes` | Padroniza tratamento de arquivos e terminações de linha no Git. |
| `.gitignore` | Exclui ferramentas locais, segredos, dependências e saídas de build. |
| `AGENTS.md` | Define escopo, regras de implementação, documentação e verificação para agentes. |
| `README.md` | Apresenta o produto, recursos entregues e comandos de execução. |
| `docs/README.md` | Documentação: Documentação da VAGGU. |
| `docs/SSD-VAGGU.md` | Documentação: SSD VAGGU — especificação de produto e desenho do sistema. |
| `docs/arquitetura-estrutura-sensores-telao.md` | Documenta configuração, mapa, sensores e telões nos pacotes P04–P07. |
| `docs/configuracao.md` | Documentação: Configuração e execução da VAGGU. |
| `docs/mapa-do-projeto.md` | Relaciona responsabilidades, caminhos e fluxo de execução dos arquivos versionáveis. |
| `docs/planejamento-do-projeto.md` | Documentação: VAGGU — planejamento e continuidade do projeto. |
| `docs/plano-e-aceite.md` | Documentação: VAGGU — plano de implementação e critérios de aceite. |
| `docs/regras-de-codigo.md` | Documentação: VAGGU — regras de código e organização. |
| `docs/regras-visuais.md` | Documentação: VAGGU — regras visuais permanentes. |
| `docs/validacao-login-2026-09-11.md` | Registra evidências e limites da integração do login com a API. |
| `docs/whatsapp-webhook.md` | Documentação: Webhook WhatsApp Cloud API. |
| `scripts/verificar-documentacao.mjs` | Confere se o mapa explica todos os arquivos versionáveis, sem percorrer dependências ou segredos ignorados. |
| `skills/end/SKILL.md` | Documentação: Fechamento do dia — VAGGU. |
| `skills/end/agents/openai.yaml` | Metadados de descoberta e apresentação da skill no Codex. |
| `skills/start/SKILL.md` | Documentação: Início do dia — VAGGU. |
| `skills/start/agents/openai.yaml` | Metadados de descoberta e apresentação da skill no Codex. |
| `vaggu-backend/.env.example` | Documenta variáveis de ambiente sem incluir credenciais reais. |
| `vaggu-backend/README.md` | Documentação: Vaggu Backend — 0.5.0. |
| `vaggu-backend/package-lock.json` | Fixa a árvore de dependências e integridade para instalação reproduzível via npm ci. |
| `vaggu-backend/package.json` | Declara dependências, faixa do Node e scripts de desenvolvimento, build e verificação. |
| `vaggu-backend/prisma.config.mjs` | Configura a CLI do Prisma: schema, migrations e conexão obtida do ambiente, sem credenciais no código. |
| `vaggu-backend/prisma/migrations/20260909000300_inicial_postgresql/migration.sql` | Configuração de migration.sql utilizada pelo módulo backend. |
| `vaggu-backend/prisma/migrations/20260912000100_estrutura_estacionamento/migration.sql` | Cria hierarquia, tipos, implantação, posições e relações compostas do P04. |
| `vaggu-backend/prisma/migrations/migration_lock.toml` | Registra o provedor PostgreSQL das migrations do Prisma. |
| `vaggu-backend/prisma/schema.prisma` | Define entidades, relacionamentos, índices e restrições de persistência. |
| `vaggu-backend/scripts/create-admin.ts` | Comando interativo para criar o primeiro administrador e exibir a senha gerada uma única vez no terminal. |
| `vaggu-backend/src/app.ts` | Monta a API Express, suas rotas e respostas de erro, sem abrir uma porta de rede. |
| `vaggu-backend/src/auth/bootstrap.ts` | Cria o primeiro administrador por uma operação de terminal, sem cadastro público. |
| `vaggu-backend/src/auth/middleware.ts` | Middlewares de autorização usados pelas rotas HTTP. Eles constroem o escopo |
| `vaggu-backend/src/auth/password.ts` | Protege senhas com scrypt e sal aleatório; guarda o resultado derivado, nunca a senha original. |
| `vaggu-backend/src/auth/routes.ts` | Rotas HTTP de autenticação. A regra de sessão fica no serviço para ser |
| `vaggu-backend/src/auth/service.ts` | Serviço de autenticação humana: valida credenciais, emite sessões opacas, |
| `vaggu-backend/src/config/database.ts` | Configuração de banco do backend. A especificação VAGGU define PostgreSQL |
| `vaggu-backend/src/config/env.ts` | Converte variáveis do processo em configuração da API e valida banco e porta. |
| `vaggu-backend/src/estrutura/routes.ts` | Expõe configuração administrativa e consulta isolada da estrutura pelo gerente. |
| `vaggu-backend/src/estrutura/service.ts` | Valida hierarquia, tipos, posições e revisões concorrentes do mapa. |
| `vaggu-backend/src/conta/routes.ts` | Rotas HTTP da conta do usuário autenticado. Usam a identidade da sessão para |
| `vaggu-backend/src/conta/service.ts` | Serviço de conta própria. Só permite alterações pessoais simples, mantendo |
| `vaggu-backend/src/lib/prisma.ts` | Cliente Prisma do PostgreSQL. Regras de domínio recebem o cliente por injeção |
| `vaggu-backend/src/server.ts` | Ponto de entrada executável: lê a configuração, conecta os serviços e inicia o HTTP. |
| `vaggu-backend/src/shoppings/routes.ts` | Rotas HTTP administrativas de shoppings e gerentes. Todas exigem Admin VAGGU |
| `vaggu-backend/src/shoppings/service.ts` | Serviço administrativo de shoppings e gerentes. Centraliza a regra de que |
| `vaggu-backend/src/whatsapp/client.ts` | Cliente de envio de texto pela API da Meta; recebe configuração privada e transporte substituível em testes. |
| `vaggu-backend/src/whatsapp/payload.ts` | Interpreta o formato externo do webhook e mantém os textos do menu demonstrativo. |
| `vaggu-backend/src/whatsapp/routes.ts` | Recebe o desafio de configuração e os eventos da Meta, validando sua origem antes de processá-los. |
| `vaggu-backend/src/whatsapp/service.ts` | Coordena mensagens recebidas, deduplicação persistente e respostas do menu demonstrativo. |
| `vaggu-backend/src/whatsapp/signature.ts` | Calcula e verifica assinaturas HMAC para confirmar que o corpo recebido veio de quem possui o segredo Meta. |
| `vaggu-backend/test-support/admin-cases.ts` | Cenários administrativos sequenciais, com usuários fictícios no banco exclusivo do runner. |
| `vaggu-backend/test-support/auth-cases.ts` | Cenários sequenciais de autenticação e isolamento, usados pelo runner com banco exclusivo. |
| `vaggu-backend/test-support/banco-de-teste.ts` | Prepara um banco PostgreSQL exclusivo por execução e aplica as migrations versionadas. |
| `vaggu-backend/test-support/estrutura-cases.ts` | Verifica hierarquia, mapa, implantação e isolamento do P04 em PostgreSQL real. |
| `vaggu-backend/test/app.test.ts` | Configuração de app.test.ts utilizada pelo módulo backend. |
| `vaggu-backend/test/env.test.ts` | Configuração de env.test.ts utilizada pelo módulo backend. |
| `vaggu-backend/test/integracao-acessos.test.ts` | Executa os cenários HTTP de autenticação e administração em PostgreSQL descartável. |
| `vaggu-backend/test/prisma-postgresql.test.ts` | Configuração de prisma-postgresql.test.ts utilizada pelo módulo backend. |
| `vaggu-backend/test/whatsapp.test.ts` | Configuração de whatsapp.test.ts utilizada pelo módulo backend. |
| `vaggu-backend/tsconfig.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/components.json` | Configura aliases e estilo de geração dos componentes shadcn. |
| `vaggu-frontend/eslint.config.js` | Configuração de eslint.config.js utilizada pelo módulo frontend. |
| `vaggu-frontend/index.html` | Documento de entrada do Vite e ponto de montagem do React. |
| `vaggu-frontend/package-lock.json` | Fixa a árvore de dependências e integridade para instalação reproduzível via npm ci. |
| `vaggu-frontend/package.json` | Declara dependências, faixa do Node e scripts de desenvolvimento, build e verificação. |
| `vaggu-frontend/public/assets/city-flow-vaggu.png` | Asset visual city-flow-vaggu.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/hero-vaggu.png` | Asset visual hero-vaggu.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/mockup-laptop-vaggu.svg` | Asset visual mockup-laptop-vaggu.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/phones-vaggu.png` | Asset visual phones-vaggu.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/vaggu-circulado.png` | Asset visual vaggu-circulado.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/vaggu-foto-homem-login-sem-fundo.png` | Asset visual vaggu-foto-homem-login-sem-fundo.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/vaggu-logo-white.svg` | Asset visual vaggu-logo-white.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/vaggu-logo-yellow.svg` | Asset visual vaggu-logo-yellow.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/vaggu-logo.svg` | Asset visual vaggu-logo.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/src/app/app-store.tsx` | Mantém token apenas em memória, valida identidade na API e gerencia sessão, troca de senha, consultas autenticadas e atualização da própria conta. |
| `vaggu-frontend/src/components/brand.tsx` | Reutiliza os arquivos de marca publicados em public/assets nos links para a página inicial. |
| `vaggu-frontend/src/components/dashboard-shell.tsx` | Compartilha cabeçalho, menu responsivo e saída da sessão entre os painéis autenticados. |
| `vaggu-frontend/src/components/estrutura-admin.tsx` | Permite ao Admin criar a hierarquia, escolher implantação e salvar posições do mapa. |
| `vaggu-frontend/src/components/mapa-estacionamento.tsx` | Exibe ao gerente andares, busca, filtros, posições e estados do próprio shopping. |
| `vaggu-frontend/src/components/icone-whatsapp.tsx` | Disponibiliza o símbolo usado nos links de atendimento, sem requisições externas. |
| `vaggu-frontend/src/components/operacao-vaggu.css` | Foto e conteúdo dividem a seção sem impor uma altura vazia acima dos benefícios. |
| `vaggu-frontend/src/components/operacao-vaggu.tsx` | Relaciona a imagem de movimento urbano aos benefícios da gestão e ao atendimento. |
| `vaggu-frontend/src/components/protected-route.tsx` | Protege a navegação com identidade da API; autorização de recursos continua no backend. |
| `vaggu-frontend/src/components/sobre-vaggu.css` | Escala e pesos da landing; medidas compartilhadas mantêm as conexões alinhadas. |
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
| `vaggu-frontend/src/hooks/use-scroll-animations.ts` | Hook para animações de scroll usando Motion |
| `vaggu-frontend/src/hooks/use-scroll-reveal.ts` | Revela blocos da landing conforme entram na viewport, respeitando movimento reduzido. |
| `vaggu-frontend/src/index.css` | Estilos e estados responsivos de index. |
| `vaggu-frontend/src/lib/constants.ts` | Publica links de contato somente após configurar o número oficial da equipe. |
| `vaggu-frontend/src/lib/utils.ts` | Configuração de utils.ts utilizada pelo módulo frontend. |
| `vaggu-frontend/src/main.tsx` | Inicializa o React e reúne tema, navegação, mensagens e sessão autenticada das páginas. |
| `vaggu-frontend/src/pages/admin-page.tsx` | Preserva a tela administrativa do protótipo; não está montada nas rotas autenticadas atuais. |
| `vaggu-frontend/src/pages/area-autenticada.tsx` | Integra o P03: cadastro de shoppings, vários gerentes, bloqueio, redefinição de senha e edição da própria conta. |
| `vaggu-frontend/src/pages/landing-page.tsx` | Compõe a landing pública e encaminha o contato comercial ao WhatsApp. |
| `vaggu-frontend/src/pages/login-page.css` | Define composição responsiva do login e troca de senha; foto do Figma ainda pendente. |
| `vaggu-frontend/src/pages/login-page.tsx` | Entrada única para Admin e gerente; composição baseada no frame Figma 2580:30. |
| `vaggu-frontend/src/pages/mall-panel-page.tsx` | Preserva o painel demonstrativo antigo; não está montado nas rotas autenticadas atuais. |
| `vaggu-frontend/src/pages/trocar-senha-page.tsx` | Exige uma senha definitiva antes de qualquer acesso operacional. |
| `vaggu-frontend/src/servicos/api.ts` | Cliente da API na mesma origem para GET, POST e PATCH autenticados; tokens ficam somente em memória. |
| `vaggu-frontend/src/servicos/estrutura.ts` | Valida a árvore pública de andares, setores, vagas e posições recebida da API. |
| `vaggu-frontend/src/types/app.ts` | Declara identidade pública validada e tipos legados das telas preservadas. |
| `vaggu-frontend/src/types/estrutura.ts` | Declara os contratos TypeScript da estrutura, implantação, tipos e mapa. |
| `vaggu-frontend/src/vite-env.d.ts` | / <reference types="vite/client" /> |
| `vaggu-frontend/tsconfig.app.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/tsconfig.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/tsconfig.node.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/vite.config.ts` | Configura React, Tailwind, aliases e proxy local de /api para o backend. |
