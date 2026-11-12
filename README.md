<p align="center"><img src="./vaggu-frontend/public/assets/vaggu-logo-yellow.svg" alt="VAGGU" width="210"></p>
<p align="center"><strong>Gestão de estacionamentos de shopping centers</strong></p>

A VAGGU é uma plataforma web responsiva desenvolvida como TCC em Desenvolvimento de Sistemas. O Admin VAGGU configura os estacionamentos, e cada gerente acompanha as vagas, os sensores e os indicadores do próprio shopping.

![Mapa do Shopping Exemplo, com andares, filtros e disponibilidade das vagas](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/mapa-desktop.png)

*Mapa do gerente em ambiente local, com dados fictícios do Shopping Exemplo.*

## Funcionalidades

- **Mapa 2D:** organiza vagas por andar, setor e categoria, com editor de posições e importação CSV/XLSX com prévia.
- **Monitoramento:** vincula sensores e vagas a placas ESP32 e registra manutenção e ocorrências. Leituras ausentes ou vencidas deixam o estado da vaga desconhecido.
- **Telões:** exibem a disponibilidade geral ou por andar e ocultam contagens desatualizadas.
- **Análises:** comparam entradas, saídas, permanência e rotatividade por período, setor e categoria, com exportação em Excel e PDF.

Veja o [mapa no celular](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/mapa-mobile.png), o [telão](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-12%20-%20Telao%20ampliado/full-hd-piso.png) e o [painel de análises](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-25%20-%20Analises%20cores%20e%20leitura/desktop-light.png) na [galeria de evidências](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/%C3%8Dndice%20de%20evid%C3%AAncias.md).

## Tecnologias

![React](https://img.shields.io/badge/React-343231?logo=react&logoColor=FFE100&labelColor=171717)
![TypeScript](https://img.shields.io/badge/TypeScript-343231?logo=typescript&logoColor=FFE100&labelColor=171717)
![Vite](https://img.shields.io/badge/Vite-343231?logo=vite&logoColor=FFE100&labelColor=171717)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-343231?logo=tailwindcss&logoColor=FFE100&labelColor=171717)
![Node.js](https://img.shields.io/badge/Node.js-343231?logo=nodedotjs&logoColor=FFE100&labelColor=171717)
![Express](https://img.shields.io/badge/Express-343231?logo=express&logoColor=FFE100&labelColor=171717)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-343231?logo=postgresql&logoColor=FFE100&labelColor=171717)
![Prisma](https://img.shields.io/badge/Prisma-343231?logo=prisma&logoColor=FFE100&labelColor=171717)

O Render serve a interface e a API na mesma origem. A [arquitetura](./segunda-mente/Vaggu/Tecnologias/Tecnologias%20e%20arquitetura.md) detalha as bibliotecas e a hospedagem.

## Executar localmente

Com Node.js `>=22.12.0 <25`, npm e PostgreSQL, instale as dependências a partir da raiz:

```powershell
npm.cmd --prefix vaggu-backend ci
npm.cmd --prefix vaggu-frontend ci
```

Configure `vaggu-backend/.env` a partir de [`.env.example`](./vaggu-backend/.env.example), apontando para seu PostgreSQL. Preserve um `.env` existente. Depois, aplique o schema e crie o primeiro Admin somente se ele ainda não existir:

```powershell
npm.cmd --prefix vaggu-backend run db:setup
npm.cmd --prefix vaggu-backend run admin:create
```

Inicie a API e a interface em dois terminais:

```powershell
# Terminal 1 — API
npm.cmd --prefix vaggu-backend run dev
```

```powershell
# Terminal 2 — interface
npm.cmd --prefix vaggu-frontend run dev
```

Abra o endereço informado pelo Vite.

## Documentação

- [Visão geral do projeto](./segunda-mente/Vaggu/Vaggu.md)
- [Guia de configuração local](./segunda-mente/Vaggu/Documenta%C3%A7%C3%A3o/configuracao.md)
- [Documentação da API](./vaggu-backend/README.md)
- [Protótipo físico com ESP32](./hardware/esp32-3-vagas/README.md)
- [Ensaio local da bancada de três vagas](./segunda-mente/Vaggu/Documenta%C3%A7%C3%A3o/ensaio-fisico-esp32-2026-11-10.md)
