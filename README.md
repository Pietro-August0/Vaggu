<p align="center"><img src="./vaggu-frontend/public/assets/vaggu-logo.svg" alt="Logotipo VAGGU" width="210"></p>

<h1 align="center">VAGGU</h1>
<p align="center">Gestão web de estacionamentos para shoppings, com estrutura por andar e setor, mapa de vagas e acessos individuais.</p>
<p align="center"><strong>MVP acadêmico de TCC · atualização documental: 24/09/2026</strong></p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-343231?logo=react&logoColor=FFE100&labelColor=171717">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-frontend%20e%20API-343231?logo=typescript&logoColor=FFE100&labelColor=171717">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-343231?logo=vite&logoColor=FFE100&labelColor=171717">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-API-343231?logo=nodedotjs&logoColor=FFE100&labelColor=171717">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-dados-343231?logo=postgresql&logoColor=FFE100&labelColor=171717">
</p>

> A VAGGU ainda **não está liberada para operação com clientes**. Telemetria ESP32, telões, histórico operacional e Power BI são etapas futuras. As imagens históricas abaixo não representam necessariamente a interface de hoje.

## Comece por aqui

| Quero… | Onde ir |
| --- | --- |
| Executar o projeto | [Guia de configuração local](./segunda-mente/Vaggu/Documentação/configuracao.md) |
| Entender as telas e permissões | [Fluxo de telas](./segunda-mente/Vaggu/Documentação/fluxo-de-telas.md) |
| Ver escopo, decisões e pendências | [Segunda mente](./segunda-mente/Vaggu/Vaggu.md) e [planejamento](./segunda-mente/Vaggu/Documentação/planejamento-do-projeto.md) |
| Consultar a API e o banco | [README do backend](./vaggu-backend/README.md) e [modelo de dados](./segunda-mente/Vaggu/Documentação/modelo-de-dados.md) |
| Revisar critérios de aceite | [Plano e aceite](./segunda-mente/Vaggu/Documentação/plano-e-aceite.md) |

## O que já funciona

- Landing e login únicos para Admin e gerente; contas são criadas pela equipe, sem cadastro público.
- Autenticação pela API, sessão apenas em memória e troca obrigatória da senha provisória no primeiro acesso.
- Administração de shoppings, fotos, múltiplos gerentes, andares, setores e vagas. A senha provisória aparece apenas quando é emitida; o banco armazena somente seu hash.
- Mapa 2D compartilhado. O Admin configura a estrutura; o gerente consulta somente o shopping vinculado à sua sessão. Sem leitura confirmada, uma vaga permanece indisponível — nunca é presumida livre.
- Importação estrutural CSV/XLSX com prévia e confirmação idempotente; exportação XLSX da **estrutura**, não do histórico de ocupação.
- Navegação separada nos painéis, tema claro/escuro e formulário de shopping em etapas. No celular, a ficha apresenta dados essenciais e abre a edição sob demanda.

**Ainda não concluído:** ingestão dos sensores ESP32, expiração operacional, telões, métricas históricas e primeiro relatório Power BI. O webhook WhatsApp existe parcialmente, mas o número oficial e o fluxo completo de atendimento dependem da equipe. Consulte o [estado verificado](./segunda-mente/Vaggu/Documentação/planejamento-do-projeto.md) antes de usar uma funcionalidade em demonstração.

## Capturas com data e contexto

As capturas de **24/09/2026** foram produzidas na aplicação local, sem sessão autenticada, após o carregamento e as animações. Elas mostram a interface pública; não comprovam deploy, API, PostgreSQL ou o mapa atual.

| Landing móvel · 390 px | Rodapé móvel · 390 px | Login móvel · 390 px |
| --- | --- | --- |
| <img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/landing-mobile-2026-09-24.png" alt="Landing VAGGU no celular em 24 de setembro de 2026" width="230"> | <img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/rodape-mobile-2026-09-24.png" alt="Rodapé sem celulares na largura móvel em 24 de setembro de 2026" width="230"> | <img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/login-mobile-2026-09-24.png" alt="Login VAGGU no celular em 24 de setembro de 2026" width="230"> |

O [rodapé desktop de 24/09](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/rodape-desktop-2026-09-24.png) mantém a imagem de celulares. As [capturas históricas de P02, P03 e P04](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/%C3%8Dndice%20de%20evid%C3%AAncias.md), copiadas em **12/09/2026**, registram fases anteriores de login, Admin e mapa; não devem ser apresentadas como prints da versão atual.

## Tecnologias e arquitetura

<p>
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-343231?logo=tailwindcss&logoColor=FFE100&labelColor=171717">
  <img alt="Express" src="https://img.shields.io/badge/Express-5-343231?logo=express&logoColor=FFE100&labelColor=171717">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7-343231?logo=prisma&logoColor=FFE100&labelColor=171717">
  <img alt="Render" src="https://img.shields.io/badge/Render-hospedagem-343231?logo=render&logoColor=FFE100&labelColor=171717">
</p>

```text
Navegador React/Vite ── /api/v1 ──> Express ──> Prisma ──> PostgreSQL
                                     └──────────> Vercel Blob (fotos, se configurado)
```

O frontend e a API estão configurados para a mesma origem no Render; o repositório registra PostgreSQL no Neon. **A URL pública e a disponibilidade do deploy não foram verificadas aqui.** O banco guarda a referência HTTPS da foto, não o binário. [Tecnologias e decisões detalhadas](./segunda-mente/Vaggu/Tecnologias/Tecnologias%20e%20arquitetura.md).

Os badges usam ícones do catálogo [Simple Icons](https://github.com/simple-icons/simple-icons) por meio do serviço [Shields.io](https://shields.io/docs/logos); são imagens externas de apresentação, não dependências da aplicação. Se o serviço estiver indisponível, os nomes e versões continuam legíveis nesta página e no documento de tecnologias.

## Executar localmente

Requer Node.js `>=22.12.0 <25`, npm e PostgreSQL configurado. A primeira instalação **não** termina em `npm ci`: também exige configurar o banco e os arquivos locais, aplicar migrations e criar o Admin. Siga as etapas do [guia de configuração](./segunda-mente/Vaggu/Documentação/configuracao.md) antes de iniciar.

Depois da configuração inicial, a partir da raiz do repositório, abra dois terminais:

```powershell
# Terminal da API
Set-Location .\vaggu-backend
npm.cmd run build
npm.cmd start
```

```powershell
# Terminal da interface
Set-Location .\vaggu-frontend
npm.cmd run dev
```

A API responde em `http://127.0.0.1:3000/api/v1`; o Vite informa a URL local no terminal. Pare os dois processos com `Ctrl+C`. Nunca publique `.env`, credenciais ou dados reais de shoppings.

## Evolução registrada

| Dia | Marco | Limite da evidência |
| --- | --- | --- |
| 09/09/2026 | Escopo, identidade e regras consolidados no [SSD](./segunda-mente/Vaggu/Documentação/SSD-VAGGU.md). | Especificação não significa implementação. |
| 12/09/2026 | Capturas de login, administração e mapa das entregas iniciais. | Imagens históricas, anteriores à navegação atual. |
| 21/09/2026 | Importação estrutural P05 validada com PostgreSQL e navegador autenticado; mapa Admin/Gerente compartilhado. | Não comprova telemetria física. |
| 23/09/2026 | Configuração de hospedagem Render/Neon registrada. | Endereço público e última publicação não conferidos. |
| 24/09/2026 | Navegação e tema dos painéis; formulário em etapas e rodapé móvel revistos; novas capturas públicas. | Admin autenticado e largura móvel da ficha ainda precisam de novo ensaio. |

O histórico detalhado, os resultados de teste e as próximas tarefas ficam no [planejamento canônico](./segunda-mente/Vaggu/Documentação/planejamento-do-projeto.md). As skills `$start` e `$end` usam esse arquivo para continuidade da equipe.
