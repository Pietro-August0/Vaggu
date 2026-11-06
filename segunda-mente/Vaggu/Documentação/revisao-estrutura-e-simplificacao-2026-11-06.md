# Revisão da estrutura e plano de simplificação — 06/11/2026

O inventário inicial na `main` encontrou 852 arquivos rastreados. O [mapa do projeto](mapa-do-projeto.md) é o catálogo por arquivo. A revisão cruzou os caminhos do Git, imports, referências de assets e documentos, scripts npm, build, configuração de publicação e arquivos locais ignorados. Foi uma varredura estrutural de todo o repositório, com leitura dirigida dos fluxos abaixo. A análise de referências locais não confirma consumo por URL fora do repositório.

## Onde encontrar cada coisa

| Área | Fonte de referência |
| --- | --- |
| API, regras, persistência e testes | `vaggu-backend/`. O servidor monta as rotas em `src/app.ts` e os serviços ficam por domínio. |
| Aplicação web | `vaggu-frontend/`. Rotas em `src/main.tsx`, páginas em `src/pages/`, UI em `src/components/` e comunicação com a API em `src/servicos/`. |
| Memorial | `vaggu-memorial-samuel/`. O Vite lê a pasta para servir e publicar `/memorial/`. |
| ESP32 | `hardware/esp32-3-vagas/`. Firmware principal, diagnóstico, teste serial e guia de bancada. |
| Operação do repositório | `.github/workflows/`, `render.yaml` e `scripts/`. Publicação, verificação documental e reprodução de peças. |
| Conhecimento, evidências e continuidade | `segunda-mente/`. Entre pelo [índice da documentação](README.md). Use o mapa para caminhos, o planejamento para decisões e próximos passos e os diários para fatos datados. |

## Arquivos retirados e candidatos locais

| Arquivo ou pasta | Resultado da revisão |
| --- | --- |
| `vaggu-frontend/public/assets/phones-vaggu.webp` | Removido. O rodapé usa a grade de canais. A fonte em PNG e as capturas históricas ficam no cofre. |
| `vaggu-frontend/public/assets/vaggu-circulado.webp` | Removido. A revisão não encontrou consumidores de execução. |
| `vaggu-frontend/src/components/ui/{alert,avatar,field,tooltip}.tsx` | Removidos. A busca por caminhos de import e símbolos exportados encontrou apenas as definições. |
| `vaggu-frontend/public/assets/mockup-laptop-vaggu.svg` | Removido do catálogo público. A landing usa o WebP e a cópia documental do SVG tem o mesmo hash. |
| `vaggu-backend/dist/` e `vaggu-frontend/dist/` | Saídas ignoradas e recriadas pelo build. Podem ser limpas quando nenhum servidor depende delas. |
| `node_modules/` dos dois pacotes e `vaggu-backend/src/generated/`, quando existir | Dependências e saídas geradas, recuperáveis pelos lockfiles e pelo comando de geração correspondente. Vale limpar para liberar espaço ou corrigir uma instalação. |
| `ambiente.local/esp32-build/`, `esp32-diagnostico-build/` e `esp32-https-build/` | Diretórios locais de compilação. Conferir se o binário do ensaio tem registro e pode ser reproduzido antes de descartar. |
| `ambiente.local/qa-20261015/postgres.zip` | Candidato local se for o instalador reobtível. A mesma pasta guarda diretórios de dados. Conferir a origem do ZIP e excluir somente o arquivo específico. |

A remoção aprovada abrangeu sete arquivos do frontend. As referências externas por URL não são observáveis pelo inventário local. O memorial, as migrations, as fontes de reprodução e as evidências foram preservados. Os artefatos locais de build e QA permanecem para reprodução e testes. Os diários ficam como histórico e o agendamento diário foi cancelado.

## Ordem das mudanças de código

| Etapa | Mudança | Critério de aceite |
| --- | --- | --- |
| 1. Telões e documentação | Aplicado nesta revisão. Normalizar a indentação do serviço e das rotas, separar os blocos por perfil e reutilizar a validação de corpo já existente. Explicar recorte, validade e emissão de chave. | Mesmas rotas, códigos de resposta, escopo de acesso e formato da consulta. |
| 2. Limpeza do frontend | Aplicado. Retirados três assets públicos e quatro componentes sem consumidores identificados. Manter `components/ui/` para primitivos compartilhados. | Build, lint e comparação das telas afetadas em desktop, tablet e celular, com foco visível e console limpo. |
| 3. API de telões | Aplicado. O serviço compartilha os filtros de capacidade ativa e a contagem por recorte. As rotas seguem separadas porque o escopo e a política de cache diferem por perfil. | Gerente restrito à sessão, Admin autorizado pela rota própria, revogação concorrente respeitada e leitura expirada fora das livres. Rodar integração de telões em PostgreSQL descartável. |
| 4. Telemetria e importação | Em `telemetria/service.ts`, separar regras puras de sequência e confirmação das escritas, mantendo a transação e o bloqueio por placa. Em `importacao/service.ts`, revisar o trecho que confirma a prévia e separar a preparação das linhas da persistência onde isso preservar a atomicidade. | Reentregas idempotentes, inicializações antigas rejeitadas, telemetria expirada indisponível, confirmação concorrente sem duplicar dados e isolamento por shopping. |
| 5. WhatsApp | Em `whatsapp/service.ts`, tornar explícitas as transições de evento e a distinção entre falha confirmada e envio incerto. Revisar tipos na fronteira com a Meta antes de remover duplicações nas condições de escrita. | Reenvio só quando permitido, tentativa antiga sem poder concluir uma nova e clique equivalente à opção digitada. Usar testes simulados. |
| 6. Análises e editor | Em `analise-estacionamento.tsx`, começar por separar filtro, consulta e exportação da renderização dos gráficos onde houver fronteiras claras. Em `editor-mapa-vagas.tsx`, explicar a conversão de coordenadas e extrair cálculos puros compartilhados apenas onde houver duplicação real. Agrupar arquivos por funcionalidade conforme forem editados. | Preservar estados de carregamento, vazio, erro e dados antigos, unidades e filtros das exportações, limites do mapa, mouse, toque e teclado. Gerar evidências nos tamanhos e temas afetados. |

Para cada etapa, revisar primeiro os imports e as referências no mapa. Separar reorganização mecânica de mudanças de regra. Nos comentários, explicar o motivo de uma decisão, a origem dos dados ou o efeito de uma condição. Usar dois espaços nos módulos TypeScript alterados e preservar o estilo do restante do arquivo quando for consistente. Atualizar os documentos da área e o planejamento na mesma entrega.
