<p align="center"><img src="./vaggu-frontend/public/assets/vaggu-logo-yellow.svg" alt="VAGGU" width="210"></p>
<p align="center"><strong>Gestão de estacionamentos, da visão do shopping à vaga individual.</strong></p>

A VAGGU é uma plataforma web responsiva desenvolvida como TCC em Desenvolvimento de Sistemas. Reunimos estrutura do estacionamento, monitoramento de sensores, mapa 2D, telões e análises em uma interface para Admin VAGGU e gerentes de shopping.

Cada gerente consulta somente seu shopping. Categorias de vaga — comum, PCD, idoso e elétrica — são separadas do estado operacional; falha de comunicação ou ausência de leitura não significa vaga livre.

![Mapa do Shopping Exemplo, com andares, filtros e disponibilidade das vagas](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/mapa-desktop.png)

*Captura local de 21/10/2026, com API real, PostgreSQL descartável e dados fictícios do Shopping Exemplo.*

## Funcionalidades

- **Acessos por shopping:** logins individuais, troca de senha provisória e isolamento dos dados.
- **Estrutura e mapa:** andares, setores, vagas, importação CSV/XLSX com prévia e editor de posições por arraste, toque ou teclado.
- **Monitoramento:** vínculo entre placas ESP32, sensores e vagas; confirmação de leituras, expiração, manutenção e ocorrências.
- **Disponibilidade atualizada:** consultas automáticas a cada 15 segundos, atualização manual e invalidação dos dados antigos.
- **Análises e relatórios:** período, setor e categoria; comparação, entradas, saídas, permanência, rotatividade e exportações Excel/PDF.
- **Telões web autorizados:** credencial por instalação, recorte por andar/setor e contagens agregadas ocultadas quando a consulta perde validade.

## Interface

<table>
  <tr>
    <td width="50%"><img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/landing-desktop.png" alt="Página de apresentação da VAGGU com a identidade preta e amarela"></td>
    <td width="50%"><img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/telao-desktop.png" alt="Telão autorizado com contagens por andar e categorias especiais"></td>
  </tr>
  <tr>
    <td><strong>Apresentação.</strong> Proposta do serviço e contato para parceria.</td>
    <td><strong>Orientação.</strong> Disponibilidade agregada para quem chega ao estacionamento.</td>
  </tr>
</table>

Veja também [análise](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-23%20-%20Categorias%20e%20carregamento/desktop-light.png), [editor](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/editor-desktop.png), [mapa no celular](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/mapa-mobile.png) e [login no celular](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/2026-10-21%20-%20Revisao%20geral/login-mobile.png). A [galeria de evidências](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/%C3%8Dndice%20de%20evid%C3%AAncias.md) registra rotas, resoluções, verificações e limites de cada captura.

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

## Estado e verificações

Em 21/10/2026, a suíte do backend aprovou **130 testes**, incluindo PostgreSQL descartável e ensaio de dump/restauração. A revisão no navegador exercitou filtros, estado sem observação, exportações, monitoramento e telão, com capturas em computador, tablet e celular. Os [resultados e limites](./segunda-mente/Vaggu/Documenta%C3%A7%C3%A3o/revisao-geral-2026-10-21.md) estão documentados.

A implementação foi validada localmente com dados fictícios. A homologação da versão publicada e a integração com hardware físico seguem pendentes; a conexão real do WhatsApp está adiada e Power BI publicado é uma evolução opcional.

## Documentação

- [Índice do projeto](./segunda-mente/Vaggu/Vaggu.md): produto, arquitetura e continuidade.
- [Configuração](./segunda-mente/Vaggu/Documenta%C3%A7%C3%A3o/configuracao.md): instalação e execução completas.
- [API](./vaggu-backend/README.md): contratos, scripts e testes.
- [Backup e restauração](./segunda-mente/Vaggu/Documenta%C3%A7%C3%A3o/backup-e-restauracao.md): procedimentos e proteções.
- [Acordos de desenvolvimento](./AGENTS.md): regras do projeto e prints obrigatórios após alterações de design ou frontend.
- [Protótipo físico com três vagas](./hardware/esp32-3-vagas/README.md): análise do demo ESP32, firmware compatível, diagramas elétricos e roteiro de bancada.
- [Segunda mente VAGGU](./segunda-mente/Vaggu/Vaggu.md): índice de produto e documentação.
- [Fluxo de telas](./segunda-mente/Vaggu/Documentação/fluxo-de-telas.md): jornadas de Admin, gerente e visitante.
- [Tecnologias e arquitetura](./segunda-mente/Vaggu/Tecnologias/Tecnologias%20e%20arquitetura.md): decisões técnicas e integrações.
- [README da API](./vaggu-backend/README.md): comandos, contratos e testes do backend.
