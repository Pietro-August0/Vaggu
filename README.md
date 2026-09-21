<p align="center">
  <img src="./vaggu-frontend/public/assets/vaggu-logo.svg" alt="Logotipo da VAGGU" width="220">
</p>

<h1 align="center">VAGGU</h1>

<p align="center">
  Plataforma web para gestão inteligente de estacionamentos de shopping centers.
</p>

## Sobre o projeto

A VAGGU centraliza a operação de estacionamentos em uma experiência responsiva para a equipe administrativa e os gerentes de cada shopping. O projeto combina uma interface navegável, uma API segura e documentação de produto para evoluir do protótipo à integração com sensores e dados operacionais reais.

Este repositório reúne o MVP acadêmico da solução, desenvolvido como projeto de TCC.

![Apresentação visual da VAGGU](./vaggu-frontend/public/assets/hero-vaggu.png)

## Funcionalidades disponíveis

### Frontend

- Landing institucional; contato depende do número oficial da equipe.
- Login integrado à API para Admin e gerente, sem contas de demonstração.
- Troca obrigatória da senha provisória, verificação da sessão e logout no servidor.
- Gestão real de shoppings, gerentes, andares, setores, vagas e implantação.
- Exclusão lógica de shopping, com encerramento dos acessos vinculados e preservação do histórico.
- Exclusão reversível de gerente, com confirmação e sete segundos para desfazer.
- Consulta administrativa da senha provisória enquanto o gerente ainda não a redefiniu.
- Mapa do gerente com troca de andar, categorias, seleção e busca.
- Token somente em memória; recarregar a página exige novo login.

### Backend

- API REST em Node.js, Express e TypeScript.
- Autenticação com sessões opacas, hash seguro de senhas e troca obrigatória no primeiro acesso.
- Cadastro de shoppings e múltiplos gerentes com isolamento por shopping.
- Proteção reversível da senha provisória até a primeira troca; a senha definitiva continua armazenada somente como hash.
- Consulta e edição segura dos dados permitidos da conta.
- Webhook da WhatsApp Cloud API com validação de assinatura e deduplicação de eventos.
- Persistência PostgreSQL com Prisma e migrations versionadas.
- Endpoints de saúde e prontidão para operação e banco de dados.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React 19, TypeScript, Vite, Tailwind CSS e Radix UI |
| API | Node.js, Express, TypeScript e Helmet |
| Dados | PostgreSQL e Prisma ORM |
| Integração | WhatsApp Cloud API |
| Qualidade | ESLint, TypeScript e Node Test Runner |

## Estrutura do repositório

```text
Vaggu/
├── vaggu-frontend/   # Interface web e protótipo navegável
├── vaggu-backend/    # API, autenticação, banco e webhook
├── segunda-mente/    # Cofre Obsidian e documentação canônica compartilhada
├── scripts/          # Verificações de documentação do repositório
├── skills/           # Rotinas operacionais versionadas da equipe
├── AGENTS.md         # Acordos de desenvolvimento do projeto
└── README.md
```

## Executar com Docker

Instale Git e Docker Desktop, inicie o Docker em modo de contêineres Linux e, na pasta clonada, execute:

```bash
git clone https://github.com/Pietro-August0/Vaggu.git
cd Vaggu
docker compose up --build
```

Não é necessário instalar Node ou PostgreSQL no computador. O Compose prepara PostgreSQL, aplica migrations pendentes sem reset e inicia API e Vite. Os padrões são públicos e exclusivos de desenvolvimento local; o `.env` da raiz é opcional, a partir de `.env.example`, para personalizar portas e valores locais.

Abra [a aplicação](http://localhost:5173). A [prontidão da API](http://localhost:3000/api/v1/health/ready) fica na porta 3000; PostgreSQL em `localhost:5433`. Em outro terminal na raiz, crie seu primeiro administrador:

```bash
docker compose exec backend npm run admin:create
```

Informe nome e e-mail e guarde a senha gerada. Não há conta automática. Para parar preservando os dados, use `docker compose down`; para retomar, `docker compose up --build`.

Consulte o [guia canônico de configuração](./segunda-mente/Vaggu/Documentação/configuracao.md) para Windows/Linux/macOS, versões, logs, migrations, atualização, testes e remoção consciente dos dados. Este Compose é de desenvolvimento; não configura produção. A execução dos contêineres ainda precisa ser validada em uma máquina com Docker, conforme o planejamento.

## Executar sem Docker

### Pré-requisitos

- Node.js 22.12 ou superior e anterior à versão 25.
- npm.
- PostgreSQL para executar a API com persistência.

### Frontend

```bash
cd vaggu-frontend
npm ci
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação. O proxy de /api usa http://127.0.0.1:3000; API_PROXY_TARGET permite alterar esse destino local. Em produção, configurar proxy reverso de /api para a API e fallback das demais rotas para index.html. VITE_WHATSAPP_NUMBER deve ser definido somente após a equipe fornecer o número oficial. Para validar uma entrega do frontend:

```bash
npm run lint
npm run build
```

### Backend

```bash
cd vaggu-backend
npm ci
test -f .env || cp .env.example .env
# Edite o .env com seu PostgreSQL de desenvolvimento antes do próximo comando.
npm run db:setup
npm run dev
```

Crie o `.env` somente se ele ainda não existir. No PowerShell, use `Copy-Item .env.example .env` e `npm.cmd` se necessário. Atualize a conexão PostgreSQL e a chave estável de proteção das senhas provisórias antes de aplicar migrations. Segredos reais nunca devem ser versionados.

Com a configuração padrão, a API responde em `http://127.0.0.1:3000/api/v1`.

```bash
npm run typecheck
npm run db:validate
npm test
```

As instruções completas de configuração e os contratos da API estão no [README do backend](./vaggu-backend/README.md).

## Acessos

O frontend não cria nem preenche contas. A equipe deve cadastrar o administrador pelo procedimento do backend e emitir acessos individuais aos gerentes. Nunca publicar credenciais em documentação ou na interface.

## Estado atual

A autenticação, a gestão administrativa e o mapa estão integrados à API. A interface permite excluir um gerente com confirmação e desfazer por sete segundos. A troca obrigatória mostra os requisitos de senha, permite visualizar os três campos e explica o erro junto ao campo responsável. O P05 aceita CSV/XLSX, persiste prévias isoladas por shopping e possui confirmação idempotente no backend e na interface; a validação completa com PostgreSQL real e navegador autenticado permanece pendente. Telemetria, telões e Power BI continuam pendentes.

O [planejamento do projeto](./segunda-mente/Vaggu/Documentação/planejamento-do-projeto.md) registra o estado real, os resultados da revisão e a próxima entrega. As skills `$start` e `$end` usam esse documento para iniciar e encerrar o trabalho diário.

Consulte a [segunda mente](./segunda-mente/Vaggu/Vaggu.md) para conhecer o escopo, as decisões técnicas e os critérios de aceite sem confundir funcionalidades planejadas com funcionalidades já entregues.
