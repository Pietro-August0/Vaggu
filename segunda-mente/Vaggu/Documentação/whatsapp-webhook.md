# Integração com o WhatsApp

## Publicação e operação — retomada de 28/10/2026

**Diagnóstico após primeiro `Oi` sem resposta:** nenhum erro de envio encontrado nos logs recentes; consulta somente de metadados no banco configurado retornou zero eventos, sem ler mensagens ou telefones. Na etapa de registro do número, a conta `Vaggu` estava com o switch **Assinar webhooks** desligado, embora o campo `messages` já estivesse assinado na configuração do app. São duas inscrições distintas. Ativada a inscrição da conta no app e conferido `[checked]` após recarregar a página. Número público corresponde ao informado e o `WHATSAPP_PHONE_NUMBER_ID` do Render corresponde ao recurso exibido pela Meta; valores privados não foram registrados. A configuração local desse ID diverge da produção e não foi usada para enviar mensagens. Teste real deve ser repetido após a correção; não presumir reentrega do `Oi` anterior.

**Segunda tentativa sem resposta:** comparação privada após o usuário confirmar pessoalmente a senha na Meta revelou `META_APP_SECRET` do Render diferente do segredo real do app VAGGU. Corrigido diretamente no Render, sem copiar valores para prints, documentação ou Git; deploy manual `dep-dbh36ad9fdbs73a4j6b0`, fonte `ee779c9`, confirmado `Deploy succeeded|Live`. Token de envio de produção consultou o recurso do número via Graph API v23.0 com HTTP 200 e telefone correspondente. Consulta adicional de inscrição da conta por API retornou HTTP 400/código 100 (acesso/recurso não disponível ao token); não substitui o estado inscrito conferido no painel. Credencial temporária usada somente na consulta foi criada em arquivo ignorado e removida em seguida. Nenhuma mensagem enviada pelo agente.

**Limite da consulta de banco:** confirmado que o host do `.env` local difere do host de produção observado no Render. Portanto, o resultado vazio mencionado acima refere-se ao banco configurado localmente e não comprova ausência de eventos em produção. Logs de aplicação não registram rejeições 401 por assinatura; ausência de erro de envio não prova ausência de requisição. Reteste real solicitado somente após o deploy da correção. Não enfraquecer HMAC nem aceitar webhook sem assinatura para contornar configuração incorreta.

**Diagnóstico em produção e observabilidade:** consulta posterior usando a conexão efetiva do Render, apenas para leitura, encontrou um evento `PROCESSADO`, tipo `unsupported`, sem código de erro persistido. Não comprova que esse evento seja o `Oi` do participante nem comprova resposta enviada. Credencial temporária removida após consulta. Acrescentado resumo seguro aos logs do webhook: quantidades, tipos, presença de texto/remetente e códigos numéricos de erro Meta, sem corpo, contato ou ID da mensagem. Rejeições de assinatura passam a registrar somente o código. Mensagens não suportadas continuam sem resposta automática; não se inventa conteúdo ausente. Build e 15 testes WhatsApp passaram, incluindo garantia de que o resumo não contém texto, contato, ID ou detalhe de erro privado. Nenhuma alteração de frontend ou schema.

Inspeção autenticada dos painéis: callback Meta salvo em `https://vaggu-tcc.onrender.com/api/v1/whatsapp/webhook`; campo `messages` assinado em v26.0. A interface informa que eventos de produção dependem de publicação do app. Tela de publicação estava bloqueada pela URL de privacidade ausente. Render iniciou sem migrations pendentes, com os cinco nomes de variáveis privadas presentes e `WHATSAPP_AUTO_REPLY_ENABLED=false`; valores privados não foram revelados. Presença não equivale a credencial válida.

Com autorização para configurar/publicar/testar, adicionamos páginas públicas `/privacidade` e `/exclusao-de-dados`, com Elisa Gomes Teixeira e `elisagommes@outlook.com`, informados pelo usuário. Após deploy e conferência HTTP, cadastrar respectivamente `https://vaggu-tcc.onrender.com/privacidade` e `https://vaggu-tcc.onrender.com/exclusao-de-dados` em Configurações básicas da Meta. Exclusão é solicitação humana por e-mail; não existe callback automático de exclusão. O blueprint habilita resposta automática; conferir também o valor salvo no painel Render e aguardar deploy antes do teste real.

Teste final: participante envia `Oi` do próprio WhatsApp para `+55 (11) 99380-7892`; conferir entrada e resposta sem duplicação, depois `MENU` e opções 1–5. Não gerar mensagem em nome do participante, não registrar corpo de conversa ou token nas evidências. Sucesso de webhook de teste não comprova a conversa real. Registrar resultado de publicação e envio real no planejamento; até esse registro, não considerar homologado.

**Revisão de 28/10/2026:** retomada solicitada para concluir o contato da landing e a configuração real. O [planejamento de conclusão](planejamento-whatsapp-2026-10-28.md) registra configuração local, lacunas, sequência e critérios de aceite. Credenciais preenchidas localmente não comprovam funcionamento na Meta ou no ambiente publicado.

Esta integração está parcial. O endereço abaixo recebe avisos e mensagens enviados pela Meta, ignora mensagens repetidas e sustenta um menu de demonstração. Os links públicos que abrem o WhatsApp não dependem dele. Número oficial, ambiente Meta e fluxos completos de demonstração e suporte ainda precisam ser configurados.

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

A deduplicação usa `meta_message_id` único no PostgreSQL. Falhas definitivas ficam como `FALHOU` e podem ser retomadas por reentrega legítima. Um evento `PROCESSANDO` há mais de dois minutos também pode ser retomado por uma única reentrega; a tentativa antiga não pode sobrescrever a nova. Antes da chamada externa, o serviço marca `ENVIANDO`. Timeout ou resultado incerto levam a `REVISAO`; um `ENVIANDO` abandonado também vai para revisão na reentrega, sem repetir automaticamente o envio. É necessário procedimento de conferência humana. A integração não promete entrega exatamente uma vez e `PROCESSADO` não comprova entrega ao destinatário.

O menu já responde às opções 1–5, além de OI/OLÁ/MENU. As instruções para demonstração, suporte e equipe são textuais: ainda não coletam etapas, persistem solicitações nem encaminham atendimento humano.


## Demonstração definida para a apresentação — 17/10/2026

Definimos o funcionamento real do bot como requisito na apresentação, com interação entre cliente e robô. Chip já comprado e celular disponível, conforme registro interno. Ativação do número, ambiente Meta, fluxos finais e homologação ainda não foram comprovados. Data e duração da apresentação serão informadas. O formato e as dependências estão no [cenário de apresentação](cenario-de-apresentacao.md).
