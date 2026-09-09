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

- Landing page institucional com contato pelo WhatsApp.
- Login demonstrativo para os perfis Admin VAGGU e Shopping.
- Área administrativa para cadastro de shopping e geração de acesso temporário.
- Painel responsivo do shopping com navegação protegida por perfil.
- Estados informativos para recursos que dependem da conexão com sensores.
- Persistência local dos dados de demonstração no navegador.

### Backend

- API REST em Node.js, Express e TypeScript.
- Autenticação com sessões opacas, hash seguro de senhas e troca obrigatória no primeiro acesso.
- Cadastro de shoppings e múltiplos gerentes com isolamento por shopping.
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
├── docs/             # Especificação, regras e critérios de aceite
├── AGENTS.md         # Acordos de desenvolvimento do projeto
└── README.md
```

## Como executar

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

O Vite exibirá no terminal o endereço local da aplicação. Para validar uma entrega do frontend:

```bash
npm run lint
npm run build
```

### Backend

```bash
cd vaggu-backend
npm ci
cp .env.example .env
npm run db:setup
npm run dev
```

Atualize o `.env` com a conexão PostgreSQL e as credenciais de integração adequadas ao seu ambiente. Segredos reais nunca devem ser versionados.

Com a configuração padrão, a API responde em `http://127.0.0.1:3000/api/v1`.

```bash
npm run typecheck
npm run db:validate
npm test
```

As instruções completas de configuração e os contratos da API estão no [README do backend](./vaggu-backend/README.md).

## Acessos da demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Admin VAGGU | `admin@vaggu.com` | `Vaggu#Admin2026` |
| Shopping | `shopping@vaggu.com` | `Vaggu#Shopping2026` |

Essas credenciais pertencem somente ao protótipo local do frontend. O backend não cria contas ou senhas reais automaticamente.

## Estado atual

O frontend é um protótipo funcional que usa `localStorage`; a API PostgreSQL está implementada e testada como projeto separado dentro deste monorepo. A integração direta entre ambos, a telemetria de sensores, o mapa operacional completo e o Power BI permanecem como próximas etapas.

Consulte a [documentação do produto](./docs/README.md) para conhecer o escopo, as decisões técnicas e os critérios de aceite sem confundir funcionalidades planejadas com funcionalidades já entregues.

## Segurança

- Não inclua arquivos `.env`, tokens, senhas reais ou strings de conexão em commits.
- Use HTTPS, CORS restritivo e configuração segura de proxy antes de publicar a API.
- Faça backup do banco antes de aplicar migrations em ambientes compartilhados.
- Substitua o número demonstrativo do WhatsApp antes de disponibilizar a landing page.
