# Repasse do backend VAGGU

Este documento resume o estado atual do backend para instalar, testar e continuar a publicacao em outra maquina.

## Estado atual

O projeto e um backend TypeScript com Node.js, Express, Prisma 7 e PostgreSQL.

Ja existem rotas de saude, autenticacao e acessos administrativos:

- `GET /api/v1/health`
- `GET /api/v1/health/ready`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/change-password`
- `POST /api/v1/auth/logout`
- `GET /api/v1/minha-conta`
- `PATCH /api/v1/minha-conta`
- `GET /api/v1/shoppings`
- `POST /api/v1/shoppings`
- `GET /api/v1/shoppings/:shoppingId/gerentes`
- `POST /api/v1/shoppings/:shoppingId/gerentes`
- `PATCH /api/v1/gerentes/:gerenteId`
- `POST /api/v1/gerentes/:gerenteId/redefinir-senha`

Foi adicionada a infraestrutura do WhatsApp Cloud API:

- `GET /api/v1/whatsapp/webhook`: verificacao oficial do webhook da Meta.
- `POST /api/v1/whatsapp/webhook`: recebimento de eventos assinados.
- Validacao de `X-Hub-Signature-256` com HMAC SHA-256 usando `META_APP_SECRET`.
- Captura do corpo bruto somente na rota do WhatsApp.
- Separacao de mensagens recebidas e status de entrega.
- Deduplicacao persistente por `meta_message_id`.
- Resposta automatica de teste desligada por padrao.
- Cliente isolado para envio pela API oficial da Meta, sem endpoint publico para envio arbitrario.

## Arquivos principais alterados

- `src/app.ts`: registra a rota do WhatsApp antes do parser JSON global.
- `src/server.ts`: instancia servico de autenticacao, Prisma, WhatsApp e shoppings.
- `src/config/env.ts`: le configuracoes gerais e do WhatsApp.
- `src/conta/service.ts`: consulta e edicao dos dados pessoais permitidos.
- `src/conta/routes.ts`: rota autenticada de minha conta.
- `src/shoppings/service.ts`: regras de Admin para shopping, gerente, senha provisoria e redefinicao.
- `src/shoppings/routes.ts`: rotas administrativas protegidas por sessao, senha pronta e perfil VAGGU.
- `src/whatsapp/client.ts`: envio de texto pela Graph API.
- `src/whatsapp/payload.ts`: extracao e classificacao de payloads.
- `src/whatsapp/routes.ts`: GET/POST do webhook.
- `src/whatsapp/service.ts`: processamento, retry e deduplicacao.
- `src/whatsapp/signature.ts`: assinatura HMAC e comparacao segura.
- `prisma/schema.prisma`: usa provider PostgreSQL, UUIDs, `WhatsappEvento`, `WhatsappEventStatus`, telefone e troca obrigatoria de senha em usuarios.
- `prisma/migrations/20260909000300_inicial_postgresql/migration.sql`: schema inicial PostgreSQL.
- `test/whatsapp.test.ts`: testes do webhook simulando a Meta.
- `test/prisma-postgresql.test.ts`: verifica schema e migration PostgreSQL.
- `.env.example`: placeholders das variaveis.
- `docs/whatsapp-webhook.md`: guia operacional do webhook.
- `docs/diagnostico-vaggu-codex.md`: matriz de conformidade contra a especificacao.

## Instalar em outra maquina

Requisitos:

- Node.js compativel com `>=22.12.0 <25`.
- npm.
- Codigo completo do projeto, incluindo `prisma/migrations`.

No Windows, prefira `npm.cmd` se o PowerShell bloquear `npm.ps1`:

```sh
npm.cmd ci
npm.cmd run db:generate
npm.cmd run db:setup
npm.cmd test
npm.cmd run dev
```

No Linux/macOS:

```sh
npm ci
npm run db:generate
npm run db:setup
npm test
npm run dev
```

Servidor local padrao:

```txt
http://127.0.0.1:3000/api/v1/health
```

## Variaveis de ambiente

Crie um `.env` local a partir de `.env.example`. Nao envie segredos por chat e nao versione `.env`.

```dotenv
DATABASE_URL="postgresql://vaggu:vaggu@localhost:5432/vaggu"
PORT=3000
HOST=127.0.0.1
NODE_ENV=development

WHATSAPP_VERIFY_TOKEN="crie-um-token-forte"
META_APP_SECRET="app-secret-da-meta"
WHATSAPP_ACCESS_TOKEN="token-de-acesso-da-meta"
WHATSAPP_PHONE_NUMBER_ID="phone-number-id-da-meta"
WHATSAPP_API_VERSION="v23.0"
WHATSAPP_AUTO_REPLY_ENABLED=false
```

Diferenças importantes:

- `WHATSAPP_VERIFY_TOKEN`: valor criado por voce e informado no campo "Verificar token" da Meta.
- `META_APP_SECRET`: segredo do app Meta usado para validar assinatura dos POSTs.
- `WHATSAPP_ACCESS_TOKEN`: token de acesso usado no `Authorization` para envio real.

## Testes ja executados nesta maquina

Passaram:

- `cmd /c npm run typecheck`
- `DATABASE_URL=postgresql://... npm run db:validate`
- `cmd /c npm test`

Resultado do teste completo:

- 23 testes passaram, 0 falharam.
- A suite atual cobre HTTP, configuracao PostgreSQL, schema/migration Prisma e webhook do WhatsApp.
- Testes de integracao com PostgreSQL real precisam de um `TEST_DATABASE_URL` ou servico de CI para validar migrations contra banco executando.

Na nova maquina, rode `npm test` novamente antes de publicar.

## Publicacao

O backend ainda nao foi publicado em producao. A tentativa de usar Vercel parou porque a CLI estava deslogada.

Para Vercel:

```sh
npm.cmd exec --yes --package vercel -- vercel login
```

Depois configure variaveis de ambiente no painel da Vercel ou pela CLI autenticada. O conector disponivel nesta sessao nao expunha ferramenta para gravar secrets.

Atencao: configure um PostgreSQL persistente antes de publicar. Em ambientes serverless, use pooling/conexao compativel com o provedor para evitar excesso de conexoes.

## Configurar webhook na Meta

Depois que a API estiver em HTTPS:

1. Use callback: `https://SEU-DOMINIO/api/v1/whatsapp/webhook`.
2. Em "Verificar token", coloque exatamente o valor de `WHATSAPP_VERIFY_TOKEN`.
3. Salve/verifique o webhook.
4. Assine o campo `messages`.
5. Mantenha `WHATSAPP_AUTO_REPLY_ENABLED=false` ate querer testar envio real.
6. Para teste de menu, ative `WHATSAPP_AUTO_REPLY_ENABLED=true` somente quando `WHATSAPP_ACCESS_TOKEN` e `WHATSAPP_PHONE_NUMBER_ID` estiverem configurados.

## Proximas atualizacoes recomendadas

1. Adicionar teste de integracao com PostgreSQL real em CI ou ambiente local controlado.
2. Modelar Andar, Setor, Vaga tipada, MapaAndar, PosicaoVaga, Placa e Sensor separado.
3. Criar telemetria autenticada com heartbeat, estados de sensores, confirmacao de 30 segundos, sequencia e expiracao independente.
4. Escolher hospedagem compativel com persistencia: VPS/Render/Railway/Fly com volume, ou banco gerenciado.
5. Configurar variaveis de ambiente no provedor sem expor segredos.
6. Aplicar migrations no ambiente escolhido com backup previo.
7. Validar `GET /api/v1/health` e `GET /api/v1/health/ready` no dominio HTTPS.
8. Validar o GET do webhook no painel da Meta.
9. Enviar payload POST assinado de teste antes de ativar resposta automatica.
10. Persistir pedidos reais de demonstracao/suporte vindos do WhatsApp.

## O que ainda nao foi implementado

- Consultas de vagas pelo WhatsApp.
- Bot completo ou IA.
- Autenticacao de gerentes via WhatsApp.
- Mapa por andar, setores, importacao CSV/XLSX e posicoes de vagas.
- Telemetria real de placas/sensores, confirmacao de estados e expiracao.
- Telao, dashboard, exportacoes e Power BI.
- Campanhas ou mensagens proativas.
- Abertura real de chamados, agendamento de demonstracao ou transferencia para atendente.
- Publicacao em producao.
- Cadastro de numero ou envio real de mensagem.

## Observacao sobre erro 130497

O codigo trata `130497` como restricao de envio informada pela Meta. Nao ha tentativa de contornar esse erro, nem promessa de que trocar token, numero ou codigo resolva. A entrega real deve ser validada no painel da Meta e nos logs da API.
