<p align="center"><img src="./vaggu-frontend/public/assets/vaggu-logo-yellow.svg" alt="Logotipo da VAGGU" width="210"></p>

<h1 align="center">VAGGU</h1>
<p align="center">Uma visão clara do estacionamento, do shopping inteiro à vaga individual.</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-343231?logo=react&logoColor=FFE100&labelColor=171717">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-343231?logo=typescript&logoColor=FFE100&labelColor=171717">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-343231?logo=tailwindcss&logoColor=FFE100&labelColor=171717">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-343231?logo=nodedotjs&logoColor=FFE100&labelColor=171717">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-343231?logo=postgresql&logoColor=FFE100&labelColor=171717">
</p>

<p align="center"><img src="./vaggu-frontend/public/assets/hero-vaggu.png" alt="Apresentação visual da VAGGU com movimento urbano" width="900"></p>

## O projeto

A VAGGU é uma plataforma web responsiva para organizar estacionamentos de shopping centers. A equipe administrativa cadastra shoppings, gerentes e a estrutura do estacionamento; cada gerente acessa apenas o shopping ao qual está vinculado. A experiência une configuração, mapa 2D e consulta de vagas em uma interface pensada para computador e celular.

O projeto foi desenvolvido como trabalho de conclusão de curso em Desenvolvimento de Sistemas. Seu desenho separa tipo de vaga — comum, PCD, idoso ou elétrica — de estado — livre, ocupada ou indisponível. Quando não existe uma leitura confirmada, a interface não apresenta a vaga como livre.

## Da configuração à visualização

### Administração por shopping

O painel Admin reúne a ficha do shopping, os acessos individuais dos gerentes e a estrutura do estacionamento. A configuração segue a hierarquia **shopping → andar → setor → vaga**. O cadastro de shopping é dividido em etapas, e sua ficha destaca os dados essenciais antes da edição.

Para preparar uma estrutura maior, a equipe pode importar CSV ou XLSX, revisar a prévia e confirmar a aplicação. A exportação XLSX reúne vagas e resumo da estrutura. Essas ações permanecem no contexto do shopping selecionado.

### Mapa para Admin e gerente

Admin e gerente usam a mesma visualização 2D de vagas. O mapa permite navegar pelos andares, localizar setores, buscar uma vaga e distinguir categorias e estados. O gerente consulta somente o shopping associado à sua sessão; alterações estruturais ficam sob responsabilidade administrativa.

### Acesso e identidade

Os acessos são criados pela equipe VAGGU, sem cadastro público de gerente. Cada gerente possui credenciais próprias. A senha provisória é exibida ao Admin somente quando é emitida e precisa ser trocada no primeiro acesso; o banco mantém o hash, não a senha em texto puro. Os painéis oferecem navegação por seção e modo claro/escuro.

## Imagens da experiência

As imagens abaixo apresentam a interface pública. Os painéis protegidos exigem uma sessão autorizada e são descritos no [fluxo de telas](./segunda-mente/Vaggu/Documentação/fluxo-de-telas.md).

<table>
  <tr>
    <td width="50%"><img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/landing-mobile-2026-09-24.png" alt="Landing da VAGGU em uma tela móvel" width="280"></td>
    <td width="50%"><img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/login-mobile-2026-09-24.png" alt="Tela de acesso da VAGGU em uma tela móvel" width="280"></td>
  </tr>
  <tr>
    <td><strong>Apresentação.</strong> A landing introduz a proposta da VAGGU e separa a conversa comercial do acesso ao sistema.</td>
    <td><strong>Entrada.</strong> O login único direciona Admin e gerente à experiência correspondente ao próprio perfil.</td>
  </tr>
</table>

<p align="center"><img src="./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/rodape-desktop-2026-09-24.png" alt="Rodapé da landing VAGGU em tela ampla" width="900"></p>

O rodapé mantém a identidade amarela e escura da marca. Em telas menores, prioriza mensagem e navegação sem repetir a imagem de celulares. A [galeria da segunda mente](./segunda-mente/Vaggu/Evid%C3%AAncias%20visuais/%C3%8Dndice%20de%20evid%C3%AAncias.md) guarda as demais imagens com a origem de cada registro.

## Tecnologias

| Camada | Tecnologias e papel |
| --- | --- |
| Interface | React e TypeScript para as telas; Tailwind CSS e estilos CSS próprios para identidade visual e responsividade; Radix UI e Lucide para componentes e ícones. |
| API | Node.js, Express e TypeScript para autenticação, autorização e regras administrativas. |
| Dados | PostgreSQL e Prisma para persistência, relações entre shoppings e migrations. |
| Integrações e publicação | WhatsApp Cloud API no backend; Render para servir frontend e API na mesma origem. |

```text
Navegador React ── /api/v1 ──> Express ──> Prisma ──> PostgreSQL
```

Os ícones dos badges usam [Simple Icons](https://github.com/simple-icons/simple-icons) por meio do [Shields.io](https://shields.io/docs/logos). Eles apenas apresentam a stack; não são dependências do sistema.

## Estrutura do repositório

```text
Vaggu/
├── vaggu-frontend/   interface React
├── vaggu-backend/    API, Prisma e testes
├── segunda-mente/    produto, arquitetura e evidências visuais
├── scripts/          verificações do repositório
├── skills/           rotinas de continuidade da equipe
└── README.md
```

## Executar localmente

Use Node.js `>=22.12.0 <25`, npm e PostgreSQL. O [guia de configuração](./segunda-mente/Vaggu/Documentação/configuracao.md) cobre a primeira instalação, variáveis de ambiente, migrations e criação do acesso Admin. Depois dessa preparação, inicie em dois terminais a partir da raiz:

```powershell
# API
Set-Location .\vaggu-backend
npm.cmd run build
npm.cmd start
```

```powershell
# Interface
Set-Location .\vaggu-frontend
npm.cmd run dev
```

A API usa `/api/v1`; o comando de desenvolvimento informa o endereço local do frontend ao iniciar. Para encerrar, use `Ctrl+C` em cada terminal.

## Leia também

- [Segunda mente VAGGU](./segunda-mente/Vaggu/Vaggu.md): índice de produto e documentação.
- [Fluxo de telas](./segunda-mente/Vaggu/Documentação/fluxo-de-telas.md): jornadas de Admin, gerente e visitante.
- [Tecnologias e arquitetura](./segunda-mente/Vaggu/Tecnologias/Tecnologias%20e%20arquitetura.md): decisões técnicas e integrações.
- [README da API](./vaggu-backend/README.md): comandos, contratos e testes do backend.
