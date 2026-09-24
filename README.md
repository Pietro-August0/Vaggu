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
- Exibição e cópia da senha provisória somente no instante da criação ou redefinição do gerente.
- Mapa 2D compartilhado entre Admin e gerente, com troca de andar, setor, categorias, estados e busca.
- Painéis com navegação contextual por seção, modo claro/escuro e conta do gerente em página própria.
- Estrutura dividida entre cadastro, mapa e posições, com importação e exportação em janelas. A exportação XLSX tem abas de vagas e resumo; não é um relatório histórico.
- Foto representativa do shopping com preview e armazenamento externo por URL.
- Token somente em memória; recarregar a página exige novo login.

### Backend

- API REST em Node.js, Express e TypeScript.
- Autenticação com sessões opacas, hash seguro de senhas e troca obrigatória no primeiro acesso.
- Cadastro de shoppings e múltiplos gerentes com isolamento por shopping.
- Senhas provisória e definitiva armazenadas somente como hash; o texto provisório existe apenas na resposta imediata de emissão.
- Fotos públicas no Vercel Blob, com apenas a URL HTTPS persistida no PostgreSQL.
- Consulta e edição segura dos dados permitidos da conta.
- Webhook da WhatsApp Cloud API com validação de assinatura e deduplicação de eventos.
- Persistência PostgreSQL com Prisma e migrations versionadas.
- Endpoints de saúde e prontidão para operação e banco de dados.
- Núcleo isolado de confirmação temporal de 30 segundos, ainda sem ingestão, persistência ou conexão com o ESP32.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React 19, TypeScript, Vite, Tailwind CSS e Radix UI |
| API | Node.js, Express, TypeScript e Helmet |
| Dados | PostgreSQL e Prisma ORM |
| Integração | WhatsApp Cloud API e Vercel Blob |
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

## Como executar

Use o [guia de configuração local](./segunda-mente/Vaggu/Documentação/configuracao.md). Ele ensina, em ordem:

1. instalar os pré-requisitos;
2. criar os bancos PostgreSQL de desenvolvimento e teste;
3. configurar os arquivos locais sem publicar segredos;
4. aplicar migrations e criar o primeiro administrador;
5. iniciar API e frontend;
6. verificar a conexão e executar os testes.

Depois da primeira configuração, o uso diário exige somente iniciar o PostgreSQL e abrir dois terminais:

```powershell
# Terminal 1
Set-Location .\vaggu-backend
npm.cmd run build
npm.cmd start

# Terminal 2
Set-Location .\vaggu-frontend
npm.cmd run dev
```

A API responde em `http://127.0.0.1:3000/api/v1` e o Vite informa no segundo terminal o endereço da interface. Consulte o [README do backend](./vaggu-backend/README.md) somente para contratos e detalhes da API.

## Acessos

O frontend não cria nem preenche contas. A equipe deve cadastrar o administrador pelo procedimento do backend e emitir acessos individuais aos gerentes. Nunca publicar credenciais em documentação ou na interface.

## Estado atual

A autenticação, a gestão administrativa e o mapa estão integrados à API. A interface permite excluir um gerente com confirmação e desfazer por sete segundos. A troca obrigatória mostra os requisitos de senha, permite visualizar os três campos e explica o erro junto ao campo responsável. O P05 aceita CSV/XLSX, persiste prévias isoladas por shopping e possui confirmação idempotente no backend e na interface; a validação completa com PostgreSQL real e navegador autenticado foi concluída em 21/09/2026. O P06 possui somente um cálculo temporal testado: telemetria operacional, telões e Power BI continuam pendentes.

Em 23/09, a equipe registrou a hospedagem da API e do frontend juntos no serviço `vaggu-tcc` do Render e a conexão PostgreSQL no Neon. O [guia de configuração](./segunda-mente/Vaggu/Documentação/configuracao.md#hospedagem-no-render) explica o build, a verificação de prontidão e a automação de deploy. A URL pública e a conclusão das execuções do workflow devem ser conferidas nos painéis dos provedores; o repositório não contém esses dados.

O [planejamento do projeto](./segunda-mente/Vaggu/Documentação/planejamento-do-projeto.md) registra o estado real, os resultados da revisão e a próxima entrega. As skills `$start` e `$end` usam esse documento para iniciar e encerrar o trabalho diário.

Consulte a [segunda mente](./segunda-mente/Vaggu/Vaggu.md) para conhecer o escopo, as decisões técnicas e os critérios de aceite sem confundir funcionalidades planejadas com funcionalidades já entregues.
