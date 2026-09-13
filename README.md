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
- Exclusão reversível de gerente, com confirmação e sete segundos para desfazer.
- Mapa do gerente com troca de andar, categorias, seleção e busca.
- Token somente em memória; recarregar a página exige novo login.

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

O Vite exibirá no terminal o endereço local da aplicação. O proxy de /api usa http://127.0.0.1:3000; API_PROXY_TARGET permite alterar esse destino local. Em produção, configurar proxy reverso de /api para a API e fallback das demais rotas para index.html. VITE_WHATSAPP_NUMBER deve ser definido somente após a equipe fornecer o número oficial. Para validar uma entrega do frontend:

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

## Acessos

O frontend não cria nem preenche contas. A equipe deve cadastrar o administrador pelo procedimento do backend e emitir acessos individuais aos gerentes. Nunca publicar credenciais em documentação ou na interface.

## Estado atual

A autenticação, a gestão administrativa e o mapa estão integrados à API. Em 12–13/09, 54 testes do backend passaram com PostgreSQL real; os fluxos principais também foram aprovados no navegador. A interface permite excluir um gerente com confirmação e desfazer por sete segundos. A troca obrigatória mostra os requisitos de senha, permite visualizar os três campos e explica o erro junto ao campo responsável. Importação, telemetria, telões e Power BI continuam pendentes.

O [planejamento do projeto](./docs/planejamento-do-projeto.md) registra o estado real, os resultados da revisão e a próxima entrega. As skills `$start` e `$end` usam esse documento para iniciar e encerrar o trabalho diário.

Consulte a [documentação do produto](./docs/README.md) para conhecer o escopo, as decisões técnicas e os critérios de aceite sem confundir funcionalidades planejadas com funcionalidades já entregues.
