# Diagnóstico do backend contra a especificação VAGGU

Data da revisão: 09/09/2026.

Este diagnóstico compara o backend em `vaggu-backend` com as regras da pasta `docs`. A documentação da especificação descreve o destino do produto; só marquei como implementado o que aparece no código e nos testes.

## Resumo executivo

O backend atual é uma base em TypeScript, Node.js, Express, Prisma 7 e PostgreSQL. Ele já protege autenticação humana, sessão, escopo por shopping em middleware, webhook do WhatsApp com assinatura da Meta e deduplicação de mensagens. Nesta revisão foi acrescentada a primeira parte administrativa da etapa E1: cadastro de shoppings, criação de múltiplos gerentes por shopping, senha provisória, troca obrigatória no primeiro acesso, redefinição administrativa e edição dos dados pessoais permitidos em minha conta.

A stack principal agora está alinhada à especificação. Ainda falta validar migrations contra um PostgreSQL real de desenvolvimento/CI e evoluir o domínio de estacionamento.

## Tecnologias

| Item | Estado | Evidência |
| --- | --- | --- |
| Node.js + Express | Implementado e verificado | `src/app.ts`, `src/server.ts`, testes HTTP em `test/app.test.ts`. |
| Prisma | Implementado e verificado | `prisma/schema.prisma`, migration PostgreSQL e teste de schema em `test/prisma-postgresql.test.ts`. |
| TypeScript | Implementado e verificado | Código próprio em `.ts`, `tsconfig.json`, `npm run typecheck` e build antes dos testes. |
| PostgreSQL | Parcial e verificado estaticamente | `provider = "postgresql"` e migration inicial PostgreSQL existem; falta banco real para `migrate deploy` em integração. |
| WhatsApp Cloud API | Parcial e verificado | Webhook assinado e envio de menu de teste em `src/whatsapp/*` e `test/whatsapp.test.ts`; fluxos de demonstração/suporte ainda não persistem pedidos. |

## Requisitos funcionais

| ID | Estado | Evidência e lacuna |
| --- | --- | --- |
| RF01 Landing | Ausente no backend | Não há frontend/landing neste diretório. |
| RF02 Bot WhatsApp | Parcial | Webhook assinado, menu de teste e deduplicação existem. Falta sessão estruturada do menu, demonstrações e chamados. |
| RF03 Admin cadastra shopping | Parcial | `POST /api/v1/shoppings` cria shopping. Falta documentos, etapa de implantação, andares e setores. |
| RF04 Múltiplos gerentes | Implementado e verificado | `POST /api/v1/shoppings/:shoppingId/gerentes`; teste cria dois gerentes no mesmo shopping. |
| RF05 Autenticação, troca, bloqueio e redefinição | Parcial e verificado | Login/logout/sessão, minha conta, senha provisória, troca obrigatória e redefinição existem. Falta política final de recuperação. |
| RF06 Mapa por andar | Ausente | Não há `Andar`, `Setor`, `MapaAndar` ou `PosicaoVaga`. |
| RF07 Configuração de mapas/estrutura | Ausente | Schema ainda está achatado em `Vaga` ligada direto a `Shopping`. |
| RF08 Importação CSV/XLSX | Ausente | Nenhum parser, prévia ou confirmação de importação. |
| RF09 Placas/sensores | Parcial | Existe `Dispositivo`, mas sensor está como `canalSensor` em `Vaga`; falta entidade `Sensor` separada. |
| RF10 Ingestão autenticada | Parcial | Há histórico e constraints básicas, mas não existe rota `/telemetria/*`, credencial de placa, confirmação de 30 segundos ou controle de sequência. |
| RF11 Expiração independente | Ausente | Não há tarefa de expiração nem indisponibilidade por perda de sensor/placa. |
| RF12 Manutenção de equipamentos | Ausente | Não há ocorrências técnicas. |
| RF13 Histórico | Parcial | `HistoricoVaga` preserva evento de vaga, mas falta contexto cadastral, falhas e intervalos. |
| RF14 Telões | Ausente | Não há endpoints agregados de telão. |
| RF15 Estatísticas/exportações | Ausente | Não há dashboard, histórico analítico, CSV ou PDF. |
| RF16 Power BI | Ausente | Não há views analíticas nem artefatos Power BI. |
| RF17 Isolamento por shopping | Parcial e verificado | Middleware `shoppingScope` e testes de isolamento existem; faltam endpoints reais de dashboard/exportação/Power BI para aplicar o recorte. |
| RF18 Desativação lógica | Parcial | `ativo` existe para shopping e usuário; falta desfazer, reativação estruturada e propagação para todos os domínios. |

## Endpoints atuais

| Método | Rota | Estado |
| --- | --- | --- |
| GET | `/api/v1/health` | Implementado. |
| GET | `/api/v1/health/ready` | Implementado. |
| POST | `/api/v1/auth/login` | Implementado. |
| GET | `/api/v1/auth/me` | Implementado. |
| POST | `/api/v1/auth/change-password` | Implementado nesta revisão. |
| POST | `/api/v1/auth/logout` | Implementado. |
| GET/PATCH | `/api/v1/minha-conta` | Implementado nesta revisão. |
| GET/POST | `/api/v1/shoppings` | Implementado nesta revisão para Admin. |
| GET/POST | `/api/v1/shoppings/:shoppingId/gerentes` | Implementado nesta revisão para Admin. |
| PATCH | `/api/v1/gerentes/:gerenteId` | Implementado nesta revisão para nome, telefone e bloqueio/reativação. |
| POST | `/api/v1/gerentes/:gerenteId/redefinir-senha` | Implementado nesta revisão. |
| GET/POST | `/api/v1/whatsapp/webhook` | Implementado. |

As rotas continuam usando `/auth` por compatibilidade com o backend existente. A especificação permite preservar contratos anteriores quando já houver consumidores.

## Principais lacunas técnicas

1. Adicionar PostgreSQL real no ambiente de desenvolvimento/CI e rodar `prisma migrate deploy`.
2. Endurecer gradualmente a tipagem, elevando `tsconfig` para `strict: true` quando os contratos estiverem estabilizados.
3. Modelar `Andar`, `Setor`, `MapaAndar`, `PosicaoVaga`, `Placa` e `Sensor`, separando sensor de vaga.
4. Criar protocolo `/telemetria/heartbeat` e `/telemetria/estados` com credencial de placa, deduplicação, sequência, confirmação de 30 segundos e expiração independente.
5. Implementar contagens atuais, telões e histórico analítico com indisponibilidade explícita.
6. Persistir pedidos de demonstração e chamados vindos do WhatsApp.
7. Criar views/consultas para Power BI somente depois de histórico e recorte por shopping estarem maduros.

## Verificação executada

Comando executado em Windows via `cmd /c` por bloqueio do PowerShell para `npm.ps1`:

```sh
cmd /c npm test
```

Resultado: typecheck passou, schema Prisma validou com URL PostgreSQL e 23 testes compilados passaram. Os testes cobrem health, readiness, configuração PostgreSQL, schema/migration Prisma e webhook do WhatsApp. A integração com banco PostgreSQL real ainda depende de `TEST_DATABASE_URL` ou CI com serviço de banco.
