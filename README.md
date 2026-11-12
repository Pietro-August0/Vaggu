<p align="center"><img src="./vaggu-frontend/public/assets/vaggu-logo-yellow.svg" alt="VAGGU" width="210"></p>
<p align="center"><strong>Gestão de estacionamentos de shopping centers</strong></p>

A VAGGU é uma plataforma web responsiva desenvolvida como TCC em Desenvolvimento de Sistemas. O Admin VAGGU configura os estacionamentos, e cada gerente acompanha as vagas, os sensores e os indicadores do próprio shopping.

![Mapa do Shopping Exemplo, com andares, filtros e disponibilidade das vagas](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-12%20-%20Mapa%20sem%20faixa/desktop-light.png)

*Captura local de 11/11/2026, com dados fictícios interceptados no navegador; não comprova produção ou sensores físicos.*

## Funcionalidades

- **Acessos por shopping:** logins individuais, troca de senha provisória e isolamento dos dados.
- **Estrutura e mapa:** andares, setores, vagas, importação CSV/XLSX com prévia e editor de posições por arraste, toque ou teclado.
- **Monitoramento:** vínculo entre placas ESP32, sensores e vagas; confirmação de leituras, expiração, manutenção e ocorrências.
- **Disponibilidade atualizada:** consultas automáticas do mapa a cada 500 ms e do telão instalado a cada 15 segundos, atualização silenciosa e invalidação dos dados antigos, com nova tentativa em caso de falha.
- **Análises e relatórios:** período, setor e categoria; comparação, entradas, saídas, permanência, rotatividade e exportações Excel/PDF.
- **Telões web autorizados:** credencial por instalação, visão geral ou andar escolhida pelo gerente, tela cheia com Esc e apresentação sem rolagem. Contagens ficam ocultas quando a consulta perde validade.

## Interface

<table>
  <tr>
    <td width="50%"><img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-11%20-%20Revisao%20da%20landing/abertura-desktop.png" alt="Página de apresentação da VAGGU com a identidade preta e amarela"></td>
    <td width="50%"><img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-12%20-%20Telao%20ampliado/full-hd-piso.png" alt="Telão autorizado com contagens por andar e categorias especiais"></td>
  </tr>
  <tr>
    <td><strong>Apresentação.</strong> Proposta do serviço e contato para parceria.</td>
    <td><strong>Orientação.</strong> Disponibilidade agregada para quem chega ao estacionamento.</td>
  </tr>
</table>

Veja também [análise](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-12%20-%20Analises%20integradas/desktop-light-historico.png), [editor e filtros](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-11%20-%20Painel%20e%20configuracoes/admin-editor-desktop-light.png), [mapa no celular](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-12%20-%20Mapa%20sem%20faixa/celular-light.png) e [login no celular](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/login-mobile.png). A [galeria de evidências](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/%C3%8Dndice%20de%20evid%C3%AAncias.md) registra rotas, resoluções, verificações e limites de cada captura.

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
