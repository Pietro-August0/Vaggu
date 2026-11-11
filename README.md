<p align="center"><img src="./vaggu-frontend/public/assets/vaggu-logo-yellow.svg" alt="VAGGU" width="210"></p>
<p align="center"><strong>Gestão de estacionamentos, da visão do shopping à vaga individual.</strong></p>

A VAGGU é uma plataforma web responsiva desenvolvida como TCC em Desenvolvimento de Sistemas. Reunimos estrutura do estacionamento, monitoramento de sensores, mapa 2D, telões e análises em uma interface para Admin VAGGU e gerentes de shopping.

Cada gerente consulta somente seu shopping. Categorias de vaga — comum, PCD, idoso e elétrica — são separadas do estado operacional; falha de comunicação ou ausência de leitura não significa vaga livre.

![Mapa do Shopping Exemplo, com andares, filtros e disponibilidade das vagas](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-11%20-%20Pesquisa%20antes%20dos%20andares/desktop-light-inicio.png)

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
    <td width="50%"><img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/landing-desktop.png" alt="Página de apresentação da VAGGU com a identidade preta e amarela"></td>
    <td width="50%"><img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Ajustes%20teloes%20e%20conta/cards-1920.png" alt="Telão autorizado com contagens por andar e categorias especiais"></td>
  </tr>
  <tr>
    <td><strong>Apresentação.</strong> Proposta do serviço e contato para parceria.</td>
    <td><strong>Orientação.</strong> Disponibilidade agregada para quem chega ao estacionamento.</td>
  </tr>
</table>

Veja também [análise](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-11%20-%20Composicao%20das%20analises/desktop-light-completa.png), [editor e filtros](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-11%20-%20Painel%20e%20configuracoes/admin-editor-desktop-light.png), [mapa no celular](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-11-11%20-%20Pesquisa%20antes%20dos%20andares/celular-light-inicio.png) e [login no celular](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/login-mobile.png). A [galeria de evidências](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/%C3%8Dndice%20de%20evid%C3%AAncias.md) registra rotas, resoluções, verificações e limites de cada captura.

## Tecnologias

| Camada | Stack |
| --- | --- |
| Interface | React 19, TypeScript, Vite, Tailwind CSS, Radix UI e Lucide |
| API | Node.js, Express e TypeScript |
| Dados | PostgreSQL e Prisma |
| Relatórios | ExcelJS e jsPDF |
| Publicação configurada | Render, com frontend e API na mesma origem |

## Executar localmente

Requisitos: Node.js `>=22.12.0 <25`, npm e PostgreSQL. O [guia de configuração](./segunda-mente/Vaggu/Documenta%C3%A7%C3%A3o/configuracao.md) explica a instalação do banco, variáveis e criação dos acessos.

Na primeira instalação, a partir da raiz:

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

Abra o endereço informado pelo Vite. O proxy encaminha `/api` à API local em `127.0.0.1:3000`; `/api/v1/health/ready` confirma a conexão com o banco. Encerre cada terminal com `Ctrl+C`.

## Documentação

- [Visão geral do projeto](./segunda-mente/Vaggu/Vaggu.md)
- [Guia de configuração local](./segunda-mente/Vaggu/Documenta%C3%A7%C3%A3o/configuracao.md)
- [Documentação da API](./vaggu-backend/README.md)
- [Protótipo físico com ESP32](./hardware/esp32-3-vagas/README.md)
