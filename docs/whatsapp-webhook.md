# Webhook WhatsApp Cloud API

## Como o código se organiza

- `vaggu-backend/src/app.ts`: registra `/api/v1/whatsapp/webhook` antes do `express.json`, usando `express.raw` somente nessa rota.
- `vaggu-backend/src/server.ts`: cria o cliente e o serviço WhatsApp com a configuração do ambiente.
- `vaggu-backend/src/config/env.ts`: lê variáveis do WhatsApp sem exigir credenciais de envio para inicializar.
- `vaggu-backend/src/whatsapp/*`: valida assinatura, extrai eventos, deduplica mensagens e encapsula o envio pela API oficial.
- `vaggu-backend/prisma/schema.prisma` e a migration inicial `20260909000300_inicial_postgresql`: tabela técnica `whatsapp_eventos`.
- `vaggu-backend/test/whatsapp.test.ts`: testes HTTP e de processamento simulando a Meta.

## Variáveis

```dotenv
WHATSAPP_VERIFY_TOKEN="valor-ficticio-para-validacao-do-webhook"
META_APP_SECRET="app-secret-ficticio"
WHATSAPP_ACCESS_TOKEN="token-de-acesso-ficticio"
WHATSAPP_PHONE_NUMBER_ID="phone-number-id-ficticio"
WHATSAPP_API_VERSION="v23.0"
WHATSAPP_AUTO_REPLY_ENABLED=false
```

`WHATSAPP_VERIFY_TOKEN` é um segredo criado por você e repetido no campo "Verificar token" da Meta para validar o GET. `META_APP_SECRET` é o segredo do aplicativo Meta usado para HMAC do POST. `WHATSAPP_ACCESS_TOKEN` é o token usado somente no header `Authorization` para envio de mensagens.

## Executar o backend

```sh
npm.cmd ci
npm.cmd run db:setup
npm.cmd test
npm.cmd run dev
```

Os comandos acima são executados em `vaggu-backend`, após configurar PostgreSQL conforme [configuração](configuracao.md).

Callback local: `http://127.0.0.1:3000/api/v1/whatsapp/webhook`.

Callback hospedado: `https://SEU-DOMINIO/api/v1/whatsapp/webhook`.

## Gerar payload assinado de teste

Use segredo fictício fora de produção:

```js
import { createHmac } from 'node:crypto';

const body = Buffer.from(JSON.stringify({ object: 'whatsapp_business_account', entry: [] }));
const signature = `sha256=${createHmac('sha256', 'app-secret-ficticio').update(body).digest('hex')}`;
console.log(signature);
```

Envie o corpo exatamente igual ao assinado. Alterar espaços, ordem serializada ou conteúdo muda a assinatura.

## Configurar na Meta

No painel do app Meta, configure o callback com a URL hospedada e coloque em "Verificar token" o mesmo valor de `WHATSAPP_VERIFY_TOKEN`. Depois de verificar e salvar o webhook, assine o campo `messages` do WhatsApp Business Account.

A validação do endpoint é o GET com challenge. O recebimento de eventos é o POST assinado. Entrega real no WhatsApp só ocorre se `WHATSAPP_AUTO_REPLY_ENABLED=true` e as credenciais de envio estiverem configuradas.

O erro 130497 é tratado como restrição de envio informada pela Meta. O código registra apenas código e contexto mínimo; não tenta contornar a restrição nem assume que trocar token, número ou código resolve.

## Limites

A deduplicação usa `meta_message_id` único no PostgreSQL. Se uma tentativa de envio falhar, o evento fica como `FALHOU` e uma nova entrega legítima do mesmo webhook pode tentar novamente. Se ocorrer timeout depois que a Meta recebeu o pedido de envio, o resultado é incerto; a integração evita processamento duplicado normal, mas não promete entrega exatamente uma vez.
