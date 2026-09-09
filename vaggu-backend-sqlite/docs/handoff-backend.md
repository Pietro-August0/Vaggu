# Repasse do backend VAGGU

Este documento resume o estado atual do backend para instalar, testar e continuar a publicacao em outra maquina.

## Estado atual

O projeto e um backend Node.js com Express, Prisma 7 e SQLite local. A API usa JavaScript com ES Modules, sem etapa TypeScript.

Ja existem rotas de saude e autenticacao:

- `GET /api/v1/health`
- `GET /api/v1/health/ready`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`

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

- `src/app.js`: registra a rota do WhatsApp antes do parser JSON global.
- `src/server.js`: instancia servico de autenticacao, Prisma e WhatsApp.
- `src/config/env.js`: le configuracoes gerais e do WhatsApp.
- `src/whatsapp/client.js`: envio de texto pela Graph API.
- `src/whatsapp/payload.js`: extracao e classificacao de payloads.
- `src/whatsapp/routes.js`: GET/POST do webhook.
- `src/whatsapp/service.js`: processamento, retry e deduplicacao.
- `src/whatsapp/signature.js`: assinatura HMAC e comparacao segura.
- `prisma/schema.prisma`: inclui `WhatsappEvento` e `WhatsappEventStatus`.
- `prisma/migrations/20260909000100_whatsapp_eventos/migration.sql`: migration aditiva da tabela tecnica.
- `test/whatsapp.test.js`: testes do webhook simulando a Meta.
- `.env.example`: placeholders das variaveis.
- `docs/whatsapp-webhook.md`: guia operacional do webhook.

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
DATABASE_URL="file:./prisma/dev.db"
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

- `npm.cmd run db:validate`
- `npm.cmd run db:generate`
- `node --test test\whatsapp.test.js`

Resultado do teste completo:

- `npm.cmd test`: 23 de 24 testes passaram.
- A falha restante ocorreu em `test/database.test.js`, no comando `prisma migrate deploy` contra SQLite temporario vazio.
- O erro retornado pelo Prisma foi somente `Schema engine error:`, sem detalhe SQL.
- As migrations SQL foram executadas diretamente com `prisma db execute` em banco temporario, incluindo a migration do WhatsApp.
- O teste de upgrade que aplica migrations pendentes sobre uma base antiga passou e confirmou a tabela `whatsapp_eventos`.

Na nova maquina, rode `npm test` novamente. Se o mesmo erro do Prisma aparecer, investigue o schema engine do Prisma 7 no ambiente antes de publicar.

## Publicacao

O backend ainda nao foi publicado em producao. A tentativa de usar Vercel parou porque a CLI estava deslogada.

Para Vercel:

```sh
npm.cmd exec --yes --package vercel -- vercel login
```

Depois configure variaveis de ambiente no painel da Vercel ou pela CLI autenticada. O conector disponivel nesta sessao nao expunha ferramenta para gravar secrets.

Atencao: SQLite local nao e ideal para Vercel/serverless porque o disco nao deve ser tratado como armazenamento duravel. Para teste publico simples, a API pode subir, mas login, sessoes e deduplicacao precisam de persistencia confiavel. Para producao real, prefira um ambiente Node com disco persistente ou migre o banco para um servico persistente.

## Configurar webhook na Meta

Depois que a API estiver em HTTPS:

1. Use callback: `https://SEU-DOMINIO/api/v1/whatsapp/webhook`.
2. Em "Verificar token", coloque exatamente o valor de `WHATSAPP_VERIFY_TOKEN`.
3. Salve/verifique o webhook.
4. Assine o campo `messages`.
5. Mantenha `WHATSAPP_AUTO_REPLY_ENABLED=false` ate querer testar envio real.
6. Para teste de menu, ative `WHATSAPP_AUTO_REPLY_ENABLED=true` somente quando `WHATSAPP_ACCESS_TOKEN` e `WHATSAPP_PHONE_NUMBER_ID` estiverem configurados.

## Proximas atualizacoes recomendadas

1. Corrigir/investigar o erro de `prisma migrate deploy` em SQLite temporario vazio no Windows.
2. Escolher hospedagem compativel com persistencia: VPS/Render/Railway/Fly com volume, ou migrar para banco gerenciado.
3. Configurar variaveis de ambiente no provedor sem expor segredos.
4. Aplicar migrations no ambiente escolhido com backup previo.
5. Validar `GET /api/v1/health` e `GET /api/v1/health/ready` no dominio HTTPS.
6. Validar o GET do webhook no painel da Meta.
7. Enviar payload POST assinado de teste antes de ativar resposta automatica.
8. Criar rotina operacional para logs e monitoramento de erros de envio.
9. Implementar fluxos reais do menu somente depois da infraestrutura estar estavel.

## O que ainda nao foi implementado

- Consultas de vagas pelo WhatsApp.
- Bot completo ou IA.
- Autenticacao de gerentes via WhatsApp.
- Campanhas ou mensagens proativas.
- Abertura real de chamados, agendamento de demonstracao ou transferencia para atendente.
- Publicacao em producao.
- Cadastro de numero ou envio real de mensagem.

## Observacao sobre erro 130497

O codigo trata `130497` como restricao de envio informada pela Meta. Nao ha tentativa de contornar esse erro, nem promessa de que trocar token, numero ou codigo resolva. A entrega real deve ser validada no painel da Meta e nos logs da API.
