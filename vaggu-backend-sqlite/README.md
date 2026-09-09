# Vaggu Backend — 0.5.0

TypeScript + Node.js + Express + Prisma 7 + PostgreSQL. Esta etapa acrescenta acessos administrativos à base que já tinha autenticação e webhook do WhatsApp.

## Atualizar a pasta atual

1. Pare a API com Ctrl+C e feche o Prisma Studio.
2. Com a API parada, copie sua pasta como backup.
3. Extraia o ZIP separadamente e copie TODO o conteúdo para a pasta atual, onde está package.json. Aceite substituir arquivos e mesclar pastas. Não apague a pasta prisma.
4. Preserve seu `.env`. O ZIP não contém banco, credenciais, `node_modules` ou build. Preserve alterações próprias antes de substituir arquivos.
5. Execute os comandos abaixo, um por vez:

~~~sh
npm ci
npm run db:setup
npm run build
npm test
npm run admin:create
npm run dev
~~~

O cabeçalho deve mostrar vaggu-backend@0.5.0. Node 24.14.0 é compatível. No PowerShell com bloqueio de npm.ps1, use npm.cmd, sem alterar a política de segurança.

db:setup gera o cliente e aplica migrations pendentes no PostgreSQL configurado em `DATABASE_URL`. Não use reset em banco real.

## Primeiro administrador

npm run admin:create pergunta nome e e-mail, cria uma conta VAGGU e gera uma senha forte. A senha aparece uma única vez no terminal. Guarde-a num gerenciador de senhas: não envie prints nem compartilhe a senha.

Não há senha padrão, cadastro público ou conta real criada automaticamente. O comando recusa a criação se já existir um administrador VAGGU, mesmo desativado, e nunca redefine contas. Usuários SHOPPING são criados pelo Admin nas rotas de gerentes e recebem senha provisória individual.

## Conferir servidor e banco

Deixe npm run dev aberto e acesse:

- http://127.0.0.1:3000/api/v1/health — servidor ativo.
- http://127.0.0.1:3000/api/v1/health/ready — consulta ao PostgreSQL; retorna {"status":"ok","banco":"conectado"}.

Readiness testa conectividade, não todas as tabelas. Execute db:setup antes.

## Endpoints de autenticação

Base: http://127.0.0.1:3000/api/v1

| Método | Rota | Entrada | Resultado |
| --- | --- | --- | --- |
| POST | /auth/login | JSON com email e senha | 200: token, validade e usuário. |
| GET | /auth/me | Header Authorization: Bearer TOKEN | 200: usuário da sessão. |
| POST | /auth/change-password | Header Authorization e JSON com senhaAtual/novaSenha | 200: usuário com troca concluída. |
| POST | /auth/logout | Mesmo header, sem corpo | 204 sem corpo: sessão revogada. |

## Minha conta

| Método | Rota | Entrada | Resultado |
| --- | --- | --- | --- |
| GET | /minha-conta | Header Authorization | 200: dados públicos do usuário autenticado. |
| PATCH | /minha-conta | nome e/ou telefone | 200: dados pessoais atualizados. |

Campos enviados como `perfil`, `shoppingId`, `email`, `senhaHash` ou `ativo` são ignorados nessa rota; alterações sensíveis ficam sob controle do backend e do Admin.

No Postman ou outro cliente de API, crie uma requisição POST para /auth/login, selecione corpo JSON e informe seu e-mail e a senha gerada:

~~~json
{
  "email": "seu-email@example.com",
  "senha": "SUBSTITUA_PELA_SENHA_GERADA"
}
~~~

Esses valores são placeholders, não credenciais válidas. A resposta contém token, tipo (Bearer), expiraEm (data ISO) e usuario (id, nome, email, perfil e shoppingId).

Copie o token apenas para o campo Bearer Token da requisição GET /auth/me. Depois faça POST /auth/logout com o mesmo token; repetir /auth/me deve retornar 401. Não coloque token na URL nem compartilhe coleções contendo credenciais reais. Acessar /auth/me pela barra do navegador retorna 401 porque não envia o header.

Respostas: 400 para entrada inválida, 401 para credenciais/sessão inválidas, 429 para excesso de tentativas e 500 genérico para falha interna. Os middlewares de perfil usam 403 para conta autenticada sem permissão.

## Endpoints administrativos

Todas as rotas abaixo exigem `Authorization: Bearer TOKEN`, perfil `VAGGU` e senha já trocada quando houver senha provisória.

| Método | Rota | Entrada | Resultado |
| --- | --- | --- | --- |
| GET | /shoppings | Sem corpo | Lista shoppings, situação e total de gerentes. |
| POST | /shoppings | JSON com nome e endereço opcional | Cria shopping. |
| GET | /shoppings/:shoppingId/gerentes | Sem corpo | Lista gerentes do shopping. |
| POST | /shoppings/:shoppingId/gerentes | nome, email e telefone opcional | Cria gerente SHOPPING e retorna senha provisória uma única vez. |
| PATCH | /gerentes/:gerenteId | nome, telefone e/ou ativo | Edita cadastro permitido ou bloqueia/reativa gerente. |
| POST | /gerentes/:gerenteId/redefinir-senha | Sem corpo | Revoga sessões do gerente e retorna nova senha provisória. |

O gerente não cria sua própria conta e não escolhe `shoppingId`; o vínculo vem da rota administrativa validada.

## Segurança e frontend

- Senhas: scrypt com sal aleatório por senha; somente hash no banco.
- Sessões: tokens opacos aleatórios de 256 bits; somente SHA-256 do token no banco. Não é JWT e não exige JWT_SECRET.
- Primeiro acesso: gerentes criados ou redefinidos pelo Admin recebem `trocarSenhaObrigatoria=true`; rotas protegidas por `requirePasswordReady` recusam acesso até a troca.
- Validade fixa de 8 horas. Logout apaga apenas a sessão atual. Sessões expiradas são recusadas imediatamente e removidas no próximo login bem-sucedido.
- Perfil, vínculo e status ativo são lidos do banco em cada requisição autenticada, nunca dos campos enviados pelo cliente.
- Usuário ou shopping desativado não faz login nem usa sessão existente. Reativação pode tornar uma sessão ainda não expirada utilizável novamente; revogação administrativa permanente ficará para outra etapa.
- Limite de 10 chamadas de login por IP a cada 15 minutos, incluindo sucessos e corpos inválidos. Máximo de quatro verificações de senha simultâneas. Proteção local em memória, reiniciada com o processo.
- Frontend: mantenha token em memória nesta etapa, envie no header Authorization e descarte no logout. Recarregar a página exigirá novo login. Não grave tokens/senhas em código ou URLs.
- Não usa cookies de autenticação e não implementa refresh token. CORS entre origens ainda não foi configurado: cliente desktop de API funciona, mas frontend em outra porta precisará de configuração explícita.
- Para publicar: HTTPS obrigatório, origens permitidas, proxies confiáveis, limites compartilhados, recuperação de conta e revisão de segurança. Não habilite trust proxy indiscriminadamente. API escuta em 127.0.0.1 por padrão.

## Perfis e isolamento

requireAuth valida a sessão. requirePasswordReady bloqueia senha provisória fora das rotas necessárias à troca. requirePerfil('VAGGU') protege cadastro/listagem de shoppings e gerentes. shoppingScope fornece res.locals.shoppingId a partir do usuário autenticado: futuras consultas da dashboard devem usar esse filtro Prisma, nunca IDs enviados pelo cliente.

Os testes montam rotas exclusivas de teste para demonstrar isolamento das vagas entre dois shoppings. Cadastro/listagem de shoppings e gerentes estão expostos para Admin. Dashboard, mapa, telemetria, telões e Power BI ainda retornam 404: não estão implementados nesta entrega.

## Banco e configuração

Funciona sem .env. Configuração opcional:

~~~dotenv
DATABASE_URL="postgresql://vaggu:vaggu@localhost:5432/vaggu"
PORT=3000
HOST=127.0.0.1
NODE_ENV=development
~~~

Configure `DATABASE_URL` com um PostgreSQL acessível pelo backend. `npm run db:studio` permite inspecionar tabelas; não preencha `senha_hash` manualmente. Faça backup antes de migrations em ambiente compartilhado.

Modelos de negócio preservados: Shopping, Usuario, Dispositivo, Vaga e HistoricoVaga. Sessao e WhatsappEvento são tabelas técnicas. Usuario agora guarda telefone e troca obrigatória de senha. Permanecem restrições de perfis, estados, vínculo da placa com shopping, código/canal únicos e histórico de eventos. CHECKs estão no SQL e devem ser preservados em futuras migrations.

## Organização

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| src/auth/password.ts | Hash e verificação de senha. |
| src/auth/service.ts | Login, sessão, troca de senha e logout. |
| src/auth/middleware.ts | Autenticação, senha provisória, perfis, escopo e limite. |
| src/auth/routes.ts | Rotas HTTP de autenticação. |
| src/auth/bootstrap.ts | Criação do primeiro administrador. |
| src/shoppings/ | Shoppings, gerentes, senha provisória e redefinição administrativa. |
| scripts/create-admin.ts | Comando interativo do administrador. |
| src/app.ts e src/server.ts | Express e inicialização. |
| src/config/ e src/lib/ | Configuração e Prisma. |
| prisma/ | Schema e migrations versionadas. |
| test/ e test-support/ | Testes HTTP, configuração, PostgreSQL/Prisma e WhatsApp. |

## Verificação e limites

npm test compila o TypeScript e roda testes HTTP/configuração/schema sem depender de um PostgreSQL local ativo. Testes de integração com banco real devem ser adicionados quando houver `TEST_DATABASE_URL` ou serviço PostgreSQL de CI.

Testado no Windows com Node compatível: `npm run typecheck`, `DATABASE_URL=postgresql://... npm run db:validate` e `cmd /c npm test` passaram. Prisma fixado em 7.10.0. Revise npm audit antes de publicar; não execute npm audit fix --force automaticamente.

Próxima etapa recomendada: modelar Andar, Setor, Vaga tipada, MapaAndar e Sensor separado de placa, preparando o caminho para mapa, telemetria e telões.
