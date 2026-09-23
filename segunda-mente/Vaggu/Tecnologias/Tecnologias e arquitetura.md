# Tecnologias e arquitetura

**Tipo:** TRD resumido · **Atualização:** 23/09/2026 · **Fontes do estado real:** manifests, código, migrations e testes versionados.

Este documento apresenta as escolhas técnicas e separa o que está implementado do que continua planejado. Versões com `^` ou faixas reproduzem os manifests; não significam que produção ou hospedagem já foram homologadas.

## Tecnologias implementadas

| Tecnologia e versão declarada | Onde é usada | Finalidade | Motivo no projeto | Estado real |
| --- | --- | --- | --- | --- |
| React `^19.2.8`, React DOM `^19.2.8` | `vaggu-frontend` | Landing, autenticação, área Admin e painel do gerente. | Componentização e atualização declarativa da interface responsiva. | Implementado. |
| Vite `^8.2.2` | `vaggu-frontend` | Desenvolvimento, build e proxy local de `/api`. | Ciclo curto de desenvolvimento e bundle do frontend. | Implementado; destino Vercel ainda não equivale a produção homologada. |
| TypeScript `^6.0.3` no frontend e `^7.0.2` no backend | Ambos os pacotes | Contratos, validação estática e manutenção. | Reduzir ambiguidades entre interface, domínio e API. | Implementado nos manifests atuais. |
| React Router DOM `^7.18.3` | `vaggu-frontend/src/main.tsx` | Rotas públicas, troca de senha e áreas protegidas por perfil. | Centralizar navegação e separar jornadas de visitante, Admin e gerente. | Implementado. |
| Tailwind CSS `^4.3.3` | `vaggu-frontend` | Tema, layout e responsividade. | Reutilizar tokens e compor estilos sem criar outra camada de design. | Implementado. |
| Radix UI `^1.6.7`, shadcn `^4.20.1` e componentes Radix específicos | `vaggu-frontend/src/components/ui` | Diálogos, controles e composição acessível. | Oferecer primitivas reutilizáveis sem substituir a identidade VAGGU. | Implementado parcialmente conforme os componentes presentes. |
| Lucide React `^1.39.0`, Motion `^13.2.0`, Poppins e Geist `^5.3.0` | Interface e landing | Ícones, movimentos, tipografia e acabamento. | Sustentar a linguagem visual e respeitar preferência por movimento reduzido. | Implementado; medidas exatas ainda dependem de nova comparação com o Figma. |
| Node.js `>=22.12.0 <25` | `vaggu-backend` | Runtime da API, scripts e testes. | Compartilhar o ecossistema TypeScript e usar APIs nativas para segurança e testes. | Faixa obrigatória do backend. |
| Express `^5.1.0` | `vaggu-backend/src` | Rotas REST, middleware e webhook. | API HTTP direta e compatível com a escala do TCC. | Implementado. |
| Helmet `^8.1.0` | Montagem da API | Cabeçalhos HTTP de proteção. | Aplicar uma base segura sem espalhar configuração nas rotas. | Implementado; CORS e hospedagem de produção continuam pendentes. |
| `node:crypto` com scrypt | Módulo de autenticação | Hash de senhas, tokens e comparação segura. | Evitar senha reversível e manter a credencial provisória apenas na resposta imediata. | Implementado. |
| PostgreSQL + Prisma `7.10.0`, adaptador pg `^7.10.0` e pg `^8.23.0` | Schema, migrations, serviços e testes do backend | Persistência relacional, integridade, transações e isolamento por shopping. | As regras dependem de vínculos e operações atômicas que o banco deve garantir. | Implementado; ambiente local documentado em PostgreSQL 17.11, versão de produção pendente. |
| `read-excel-file` `^9.3.10` e leitor CSV próprio | Módulo de importação | Prévia e confirmação de arquivos CSV/XLSX. | Importar estrutura com validação por linha sem adicionar outra biblioteca para CSV. | P05 concluído em 21/09/2026, inclusive confirmação idempotente no PostgreSQL. |
| Vercel Blob `^2.8.0` | Fotos públicas dos shoppings | Guardar o arquivo fora do PostgreSQL e persistir somente a URL HTTPS. | Evitar binários no banco e separar foto pública dos documentos privados. | Adaptador implementado; uso depende de `BLOB_READ_WRITE_TOKEN`. |
| WhatsApp Cloud API, sem SDK versionado | Backend `whatsapp` e links do frontend | Webhook assinado, deduplicação, envio de texto e encaminhamento comercial. | Manter o WhatsApp como canal de parceria e suporte. | Parcial: infraestrutura e menu demonstrativo existem; fluxo P10 e número oficial estão pendentes. |
| ESLint `^10.9.1`, Node Test Runner e Supertest `^7.1.4` | Verificação dos pacotes | Lint, compilação e testes HTTP/unitários/integração. | Verificar contratos e regressões com poucas dependências adicionais. | Implementado. |

## Tecnologias e componentes planejados

| Tecnologia ou componente | Onde entrará | Finalidade | Motivo no projeto | Estado |
| --- | --- | --- | --- | --- |
| ESP32 + firmware | Maquete e instalação | Autenticar o controlador, ler sensores e enviar sequência/reinicialização. | Controlador acessível para a demonstração e capaz de agrupar sensores. | P06; contrato ainda precisa ser estabilizado. |
| Sensores ultrassônicos + Wi-Fi | Vagas e comunicação local | Observar ocupação e transmitir leituras. | Base física prevista para a maquete do TCC. | Planejado; topologia e frequências dependem de ensaio. |
| Serviço de confirmação e expiração | Backend | Confirmar mudança após 30 segundos consistentes, ordenar/deduplicar eventos e invalidar dados antigos. | Dado ausente ou expirado não pode virar vaga livre. | P06, não implementado. |
| Atualização operacional por polling controlado ou transporte a confirmar | API e frontend | Atualizar mapa e telões sem recarga manual. | Separar o contrato de estado do transporte e adequá-lo à hospedagem disponível. | Decisão pendente; Socket.IO não está instalado. |
| Telões web | Frontend + API agregada | Mostrar vagas livres por andar/setor e categorias especiais sem duplicação. | Reutilizar a fonte confiável do mapa em monitores convencionais. | P07, não implementado. |
| Views PostgreSQL + Power BI Desktop | Camada analítica | Métricas, histórico e primeiro relatório funcional. | Manter análise separada da operação e reconciliar números com conjunto controlado. | P09, não implementado; modo Importação é a proposta inicial. |

## Arquitetura atual

```mermaid
flowchart LR
    U[Visitante, Admin ou gerente] --> N[Navegador]
    N --> F[React + Vite]
    F -->|API / JSON e arquivos| A[API Express]
    A --> AU[Autenticação e autorização]
    A --> D[Serviços de domínio]
    D --> P[Prisma]
    P --> B[(PostgreSQL)]
    D -->|foto pública, quando configurado| V[Vercel Blob]
    M[WhatsApp Cloud API] -->|webhook assinado| A
    A -->|respostas habilitadas| M
```

O backend é a autoridade das permissões e deriva o shopping da sessão do gerente. O frontend não concede acesso ao ocultar controles. A base atual cobre autenticação, administração, estrutura, mapa, importação e uma integração parcial com o WhatsApp.

P01–P05 estão concluídos. Embora o schema já contenha `Dispositivo`, estado atual e `HistoricoVaga`, isso não comprova ingestão operacional: telemetria, confirmação, expiração, ocorrências, telões e análise continuam ausentes.

## Arquitetura planejada para a operação

```mermaid
flowchart LR
    S[Sensores] --> E[ESP32]
    E -->|evento autenticado| I[API de telemetria]
    I --> C[Validação, ordem, deduplicação e confirmação]
    C --> X[Estado atual e expiração]
    C --> H[(Histórico PostgreSQL)]
    X --> H
    X --> Q[Consultas operacionais]
    Q --> G[Painel e mapa]
    Q --> T[Telões agregados]
    H --> W[Views de leitura]
    W --> BI[Power BI Desktop]
```

A arquitetura planejada conserva dois caminhos: operação e análise. Mapa e telões usam o estado confirmado e sua validade; Power BI usa histórico e views restritas. Falha no relatório não pode interromper a leitura operacional.

## Decisões técnicas vigentes

- Uma API REST centraliza autenticação, autorização e regras de domínio.
- PostgreSQL é a fonte persistente única; migrations são incrementais e não se reseta banco real.
- Toda consulta do gerente precisa manter o recorte por shopping também em arquivos, exportações, atualização e análise.
- Senhas, hashes, credenciais de placas e conexão de banco nunca chegam ao frontend ou ao Power BI.
- A senha provisória aparece somente na resposta imediata de criação ou redefinição; apenas o hash permanece no banco.
- A confirmação da importação P05 é serializada por shopping e idempotente; vagas ausentes não são removidas silenciosamente.
- O transporte de atualização do P06/P07 ainda não foi escolhido. Polling é uma proposta compatível com o MVP; Socket.IO exige infraestrutura para conexão persistente.
- Vercel é o destino previsto do frontend e o Blob já possui adaptador, mas hospedagem da API, banco, CORS, backup e monitoramento de produção ainda precisam de decisão.
- Power BI começa pelo Desktop e por histórico controlado; publicação, incorporação e segurança por linha dependem da forma de distribuição aprovada.

## Sequência técnica

1. **P06:** fechar contrato de firmware, autenticação, sequência, reinicialização, frequência e expiração antes dos endpoints definitivos.
2. **P07:** consumir apenas estados confiáveis para contagens, painel e telões.
3. **P08:** consolidar histórico, métricas e exportações com isolamento.
4. **P09:** criar views e primeiro relatório funcional no Power BI.
5. **P10:** concluir o fluxo do WhatsApp em trabalho independente quando número e ambiente Meta estiverem disponíveis.
6. **P11:** integrar e reproduzir o roteiro final do TCC.

## Referências

- Produto e escopo: [[Vaggu/Especificações/Visão do produto|visão do produto]].
- Regras e contratos: [[Vaggu/Documentação/SSD-VAGGU|SSD-VAGGU]].
- Arquitetura de estrutura, sensores e telões: [[Vaggu/Documentação/arquitetura-estrutura-sensores-telao]].
- Configuração local: [[Vaggu/Documentação/configuracao|configuração]].
- Critérios de aceite: [[Vaggu/Documentação/plano-e-aceite|plano e aceite]].
- Estado real e backlog: [[Vaggu/Documentação/planejamento-do-projeto|planejamento e continuidade]].
