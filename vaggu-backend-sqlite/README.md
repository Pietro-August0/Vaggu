# Vaggu Backend — 0.3.0

JavaScript + Node.js + Express + Prisma 7 + SQLite local. Esta etapa acrescenta autenticação à base que já estava funcionando. Não precisa instalar um servidor de banco.

## Atualizar a pasta SQLite atual

1. Pare a API com Ctrl+C e feche o Prisma Studio.
2. Com a API parada, copie sua pasta como backup.
3. Extraia o ZIP separadamente e copie TODO o conteúdo para a pasta atual, onde está package.json. Aceite substituir arquivos e mesclar pastas. Não apague a pasta prisma.
4. Preserve seu .env e prisma/dev.db. O ZIP não contém banco, credenciais, node_modules ou cliente gerado. Preserve alterações próprias antes de substituir arquivos.
5. Execute os comandos abaixo, um por vez:

~~~sh
npm ci
npm run db:setup
npm test
npm run admin:create
npm run dev
~~~

O cabeçalho deve mostrar vaggu-backend@0.3.0. Node 24.14.0 é compatível. No PowerShell com bloqueio de npm.ps1, use npm.cmd, sem alterar a política de segurança.

db:setup gera o cliente e aplica migrations pendentes. A nova migration apenas acrescenta a tabela sessoes, seus índices e relação com usuários. Não apaga tabelas nem dados existentes. Não use reset ou misture as migrations da pasta PostgreSQL antiga.

## Primeiro administrador

npm run admin:create pergunta nome e e-mail, cria uma conta VAGGU e gera uma senha forte. A senha aparece uma única vez no terminal. Guarde-a num gerenciador de senhas: não envie prints nem compartilhe a senha.

Não há senha padrão, cadastro público ou conta real criada automaticamente. O comando recusa a criação se já existir um administrador VAGGU, mesmo desativado, e nunca redefine contas. Usuários SHOPPING serão criados com o cadastro do shopping na próxima etapa. Recuperação/troca de senha ainda não está implementada.

## Conferir servidor e banco

Deixe npm run dev aberto e acesse:

- http://127.0.0.1:3000/api/v1/health — servidor ativo.
- http://127.0.0.1:3000/api/v1/health/ready — consulta ao SQLite; retorna {"status":"ok","banco":"conectado"}.

Readiness testa conectividade, não todas as tabelas. Execute db:setup antes.

## Endpoints de autenticação

Base: http://127.0.0.1:3000/api/v1

| Método | Rota | Entrada | Resultado |
| --- | --- | --- | --- |
| POST | /auth/login | JSON com email e senha | 200: token, validade e usuário. |
| GET | /auth/me | Header Authorization: Bearer TOKEN | 200: usuário da sessão. |
| POST | /auth/logout | Mesmo header, sem corpo | 204 sem corpo: sessão revogada. |

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

## Segurança e frontend

- Senhas: scrypt com sal aleatório por senha; somente hash no banco.
- Sessões: tokens opacos aleatórios de 256 bits; somente SHA-256 do token no banco. Não é JWT e não exige JWT_SECRET.
- Validade fixa de 8 horas. Logout apaga apenas a sessão atual. Sessões expiradas são recusadas imediatamente e removidas no próximo login bem-sucedido.
- Perfil, vínculo e status ativo são lidos do banco em cada requisição autenticada, nunca dos campos enviados pelo cliente.
- Usuário ou shopping desativado não faz login nem usa sessão existente. Reativação pode tornar uma sessão ainda não expirada utilizável novamente; revogação administrativa permanente ficará para outra etapa.
- Limite de 10 chamadas de login por IP a cada 15 minutos, incluindo sucessos e corpos inválidos. Máximo de quatro verificações de senha simultâneas. Proteção local em memória, reiniciada com o processo.
- Frontend: mantenha token em memória nesta etapa, envie no header Authorization e descarte no logout. Recarregar a página exigirá novo login. Não grave tokens/senhas em código ou URLs.
- Não usa cookies de autenticação e não implementa refresh token. CORS entre origens ainda não foi configurado: cliente desktop de API funciona, mas frontend em outra porta precisará de configuração explícita.
- Para publicar: HTTPS obrigatório, origens permitidas, proxies confiáveis, limites compartilhados, recuperação de conta e revisão de segurança. Não habilite trust proxy indiscriminadamente. API escuta em 127.0.0.1 por padrão.

## Perfis e isolamento

requireAuth valida a sessão. requirePerfil('VAGGU') está pronto para proteger cadastro/listagem de shoppings. shoppingScope fornece res.locals.shoppingId a partir do usuário autenticado: futuras consultas da dashboard devem usar esse filtro Prisma, nunca IDs enviados pelo cliente.

Os testes montam rotas exclusivas de teste para demonstrar bloqueio administrativo e isolamento das vagas entre dois shoppings. Essas rotas NÃO são expostas pela aplicação. Cadastro/listagem de shoppings, dashboard e IoT ainda retornam 404: não estão implementados nesta entrega.

## Banco e configuração

Funciona sem .env. Configuração opcional:

~~~dotenv
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
HOST=127.0.0.1
NODE_ENV=development
~~~

Não copie conexão postgresql:// da versão antiga. CLI e API resolvem o mesmo arquivo local, inclusive com espaços. npm run db:studio permite inspecionar tabelas; não preencha senha_hash manualmente. Prefira pasta fora do OneDrive para evitar conflitos de sincronização. Faça backup com a API parada.

Modelos de negócio preservados: Shopping, Usuario, Dispositivo, Vaga e HistoricoVaga. Sessao é a nova tabela técnica. Permanecem restrições de perfis, estados, vínculo da placa com shopping, código/canal únicos e histórico de eventos. CHECKs estão no SQL e devem ser preservados em futuras migrations.

## Organização

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| src/auth/password.js | Hash e verificação de senha. |
| src/auth/service.js | Login, sessão e logout. |
| src/auth/middleware.js | Autenticação, perfis, escopo e limite. |
| src/auth/routes.js | Três rotas HTTP de autenticação. |
| src/auth/bootstrap.js | Criação do primeiro administrador. |
| scripts/create-admin.js | Comando interativo do administrador. |
| src/app.js e src/server.js | Express e inicialização. |
| src/config/ e src/lib/ | Configuração e Prisma. |
| prisma/ | Schema e migrations versionadas. |
| test/ e test-support/ | Testes HTTP, SQLite, autenticação e atualização. |

## Verificação e limites

npm test usa bancos temporários fictícios, nunca prisma/dev.db. O teste de atualização reproduz o schema 0.2.1 e aplica a migration verificando a preservação de registros. No Windows, a limpeza tenta novamente se o arquivo estiver em uso; se continuar bloqueado, emite Limpeza pendente com a pasta temporária. Isso não esconde falhas nas verificações.

Testado em Linux com Node 24; confirme no Windows. Prisma e adapter fixados em 7.10.0. Overrides anteriores mantidos. Revise npm audit antes de publicar; não execute npm audit fix --force automaticamente. Nenhuma dependência nova foi adicionada.

Próxima etapa: cadastro/listagem de shoppings pela Vaggu, com criação do usuário SHOPPING e validação de entrada. Esta entrega não altera a landing page nem o Arduino.
