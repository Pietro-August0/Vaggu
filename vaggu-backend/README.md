# Vaggu Backend — 0.5.0

TypeScript + Node.js + Express + Prisma 7 + PostgreSQL. A base inclui autenticação, administração de shoppings e gerentes, estrutura do estacionamento e webhook do WhatsApp.

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
| GET | /shoppings/:shoppingId/estrutura | Sem corpo | Lista situação, andares, setores, vagas e revisão do mapa. |
| POST | /shoppings/:shoppingId/andares | nome, ordem e código opcional | Cria um andar no shopping. |
| POST | /andares/:andarId/setores | nome e código | Cria um setor no andar. |
| POST | /setores/:setorId/vagas | código, tipo e posição opcional | Cria uma vaga vinculada ao setor e ao andar. |
| PATCH | /andares/:andarId/mapa | revisão esperada e posições das vagas | Salva o mapa de forma atômica; revisão desatualizada retorna 409. |
| PATCH | /shoppings/:shoppingId/implantacao | situação | Atualiza a etapa de implantação do shopping. |

O gerente não cria sua própria conta e não escolhe `shoppingId`; o vínculo vem da rota administrativa validada.

## Estrutura consultada pelo gerente

`GET /estacionamento/estrutura` exige perfil `SHOPPING`. O backend deriva o shopping da sessão autenticada e não aceita um `shoppingId` enviado pelo cliente. A resposta contém a situação de implantação e a hierarquia `andar → setor → vaga`. Tipos de vaga: `COMUM`, `PCD`, `IDOSO` e `ELETRICA`.

As posições do mapa usam valores proporcionais de 0 a 1 (`x`, `y`, largura e altura), para que a mesma configuração funcione em telas diferentes. O salvamento de um andar exige a revisão atual e ocorre em transação serializável; vagas de outro andar são recusadas. A migration mantém `andarId` e `setorId` opcionais para registros legados, mas novos cadastros pela API sempre criam o vínculo completo.

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

requireAuth valida a sessão. requirePasswordReady bloqueia senha provisória fora das rotas necessárias à troca. requirePerfil('VAGGU') protege cadastro/listagem de shoppings, gerentes e estrutura. shoppingScope fornece res.locals.shoppingId a partir do usuário autenticado; a consulta do mapa do gerente usa esse filtro Prisma, nunca IDs enviados pelo cliente.

Os testes montam rotas exclusivas para complementar a demonstração de isolamento entre dois shoppings. Cadastro/listagem de shoppings e gerentes e configuração da estrutura estão expostos para Admin; a consulta do mapa está exposta para o gerente. Telemetria, telões, exportações e Power BI ainda não estão implementados.

## Banco e configuração

`DATABASE_URL` é obrigatória; pode vir do ambiente ou do `.env`. Exemplo de configuração:

~~~dotenv
DATABASE_URL="postgresql://vaggu:vaggu@localhost:5432/vaggu"
PORT=3000
HOST=127.0.0.1
NODE_ENV=development
~~~

Configure `DATABASE_URL` com um PostgreSQL acessível pelo backend. `npm run db:studio` permite inspecionar tabelas; não preencha `senha_hash` manualmente. Faça backup antes de migrations em ambiente compartilhado.

Modelos de negócio: Shopping, Andar, Setor, Vaga, Usuario, Dispositivo e HistoricoVaga. Sessao e WhatsappEvento são tabelas técnicas. Usuario guarda telefone e troca obrigatória de senha. Permanecem restrições de perfis, estados, vínculo da placa com shopping, código/canal únicos, hierarquia interna e histórico de eventos. CHECKs estão no SQL e devem ser preservados em futuras migrations.

## Organização

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| src/auth/password.ts | Hash e verificação de senha. |
| src/auth/service.ts | Login, sessão, troca de senha e logout. |
| src/auth/middleware.ts | Autenticação, senha provisória, perfis, escopo e limite. |
| src/auth/routes.ts | Rotas HTTP de autenticação. |
| src/auth/bootstrap.ts | Criação do primeiro administrador. |
| src/shoppings/ | Shoppings, gerentes, senha provisória e redefinição administrativa. |
| src/estrutura/ | Hierarquia do estacionamento, mapa, revisão concorrente e escopo do gerente. |
| scripts/create-admin.ts | Comando interativo do administrador. |
| src/app.ts e src/server.ts | Express e inicialização. |
| src/config/ e src/lib/ | Configuração e Prisma. |
| prisma/ | Schema e migrations versionadas. |
| test/ e test-support/ | Testes HTTP, configuração, PostgreSQL/Prisma e WhatsApp. |

## Verificação e limites

`npm test` compila o TypeScript e executa os testes HTTP/configuração/schema e o runner de autenticação/gerentes. Sem `TEST_DATABASE_URL`, a integração aparece explicitamente como **PENDENTE/skip**; isso não comprova CA04–CA07. Gere o cliente antes do primeiro build com `npm run db:generate`, usando uma `DATABASE_URL` de desenvolvimento configurada (a geração não conecta ao banco).

Para integração local, crie `.env.teste.local` (ignorado pelo Git) contendo `TEST_DATABASE_URL` e execute `npm run test:integracao`. Esse comando falha se o arquivo não existir. Em CI, configure `TEST_DATABASE_URL` no ambiente e use `npm test`. Uma URL presente mas inválida ou inacessível falha, sem converter o erro em skip.

A conexão deve apontar para um banco de controle dedicado, cujo nome termine em `_teste` ou `_test`, sem parâmetros na URL. O usuário precisa de `CREATEDB`. Cada execução cria `vaggu_teste_<uuid>`, aplica as migrations SQL versionadas em ordem e prepara usuários/shoppings fictícios. Os cenários executam sequencialmente, e o encerramento remove somente esse banco gerado, inclusive quando um cenário falha. O runner nunca usa `DATABASE_URL` como alternativa nem limpa tabelas do banco de controle. Se o processo for encerrado à força, o banco descartável pode permanecer para inspeção; não há limpeza ampla automática.

Os cenários verificam múltiplos gerentes, primeira senha, bloqueio individual, sessões, dois andares, categorias de vaga, revisão do mapa e isolamento. Isso não valida exportação, tempo real, hardware ou telões. Consulte também [ambiente local no Windows](../docs/ambiente-local.md) e a [arquitetura de estrutura, sensores e telões](../docs/arquitetura-estrutura-sensores-telao.md).

Testado no Windows com Node compatível: `npm run typecheck`, `DATABASE_URL=postgresql://... npm run db:validate` e `cmd /c npm test` passaram. Prisma fixado em 7.10.0. Revise npm audit antes de publicar; não execute npm audit fix --force automaticamente.

P04 concluído em 12/09/2026: migration aplicada, estrutura e mapa integrados, 52 testes aprovados com PostgreSQL real e fluxo principal validado no navegador. A próxima entrega é P05: importação CSV/XLSX com prévia e preservação de histórico, conforme o [planejamento](../docs/planejamento-do-projeto.md).
