# Como executar a VAGGU localmente

Este guia é para integrantes e parceiros que precisam testar o sistema em um computador próprio. Os comandos abaixo foram escritos para Windows e PowerShell.

Ao terminar, você terá:

- PostgreSQL executando no computador;
- API em `http://127.0.0.1:3000`;
- interface em `http://127.0.0.1:5173`;
- um banco persistente de desenvolvimento;
- um banco separado para testes automatizados.

## Antes de começar

Instale:

- Git;
- Node.js entre `22.12.0` e `24.x`;
- PostgreSQL;
- pgAdmin, normalmente incluído no instalador do PostgreSQL.

Confira o Node.js:

```powershell
node --version
npm.cmd --version
```

Não altere a política de execução do PowerShell. Neste guia usamos `npm.cmd` porque `npm.ps1` pode estar bloqueado no Windows.

## Entenda os dois bancos locais

| Banco | Finalidade | Pode ser apagado pelos testes? |
| --- | --- | --- |
| `vaggu_local` | Uso normal da API durante o desenvolvimento | Não |
| `vaggu_teste` | Controle dos testes automatizados | Não; o runner apaga somente bancos temporários criados por ele |

Nenhum deles é produção. O registro de 23/09 descreve um PostgreSQL no Neon para o serviço hospedado; as instruções abaixo continuam criando somente bancos locais independentes.

## Primeira configuração

Faça esta seção uma única vez em cada computador.

### 1. Obtenha o projeto

Abra o PowerShell na pasta em que deseja guardar o projeto e clone o repositório. Se recebeu um arquivo ZIP, extraia-o e abra o PowerShell na pasta `Vaggu`.

Os próximos comandos partem da raiz do projeto, que contém as pastas `vaggu-backend` e `vaggu-frontend`.

### 2. Inicie o PostgreSQL

Abra **Serviços** no Windows, localize o serviço cujo nome começa com `postgresql` e clique em **Iniciar**.

Se o serviço já estiver com o estado **Em execução**, siga para a próxima etapa.

### 3. Crie os bancos e usuários

1. Abra o pgAdmin.
2. Conecte-se ao servidor PostgreSQL local.
3. Selecione o banco `postgres`.
4. Abra **Tools → Query Tool**.
5. Troque as duas senhas de exemplo abaixo por senhas locais próprias.
6. Execute o SQL:

```sql
CREATE ROLE vaggu_local_usuario
  WITH LOGIN PASSWORD 'troque-por-uma-senha-local';

CREATE DATABASE vaggu_local
  WITH OWNER vaggu_local_usuario
  ENCODING 'UTF8'
  TEMPLATE template0;

CREATE ROLE vaggu_teste_runner
  WITH LOGIN CREATEDB PASSWORD 'troque-por-outra-senha-local';

CREATE DATABASE vaggu_teste
  WITH OWNER vaggu_teste_runner
  ENCODING 'UTF8'
  TEMPLATE template0;
```

Resultado esperado: o pgAdmin passa a mostrar `vaggu_local` e `vaggu_teste` em **Databases**.

Execute esse SQL somente uma vez. Se aparecer que o usuário ou o banco já existe, não tente recriá-lo: confirme no pgAdmin se ele pertence à instalação local da VAGGU.

O usuário `vaggu_local_usuario` não precisa de `SUPERUSER` nem de `CREATEDB`. Somente `vaggu_teste_runner` recebe `CREATEDB`, pois os testes criam bancos temporários isolados.

### 4. Configure a API

No PowerShell, partindo da raiz do projeto:

```powershell
Set-Location .\vaggu-backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Abra `vaggu-backend/.env` em um editor e ajuste:

```dotenv
DATABASE_URL="postgresql://vaggu_local_usuario:SUA_SENHA_LOCAL@127.0.0.1:5432/vaggu_local"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_TOKEN_DO_PROJETO"
HOST="127.0.0.1"
PORT="3000"
NODE_ENV="development"
```

Use a senha definida na etapa anterior. Se o PostgreSQL estiver em outra porta, substitua `5432` pela porta correta.

`BLOB_READ_WRITE_TOKEN` é necessário somente para salvar ou remover a foto representativa de um shopping. Obtenha-o no armazenamento Blob vinculado ao projeto Vercel e mantenha-o apenas no ambiente do backend. Sem essa variável, o restante do cadastro funciona e a tentativa de alterar a foto falha explicitamente; não use pasta local como substituto em produção. A imagem fica no Vercel Blob e o PostgreSQL guarda somente sua URL HTTPS.

Não compartilhe nem envie `.env` ao Git. Se a senha possuir `@`, `:`, `/`, `?`, `#` ou `%`, esses caracteres precisam ser codificados para URL. Para um ambiente local, uma senha alfanumérica longa evita esse problema.

### 5. Configure os testes

Ainda em `vaggu-backend`, crie o arquivo `.env.teste.local`:

```dotenv
TEST_DATABASE_URL="postgresql://vaggu_teste_runner:SUA_SENHA_DE_TESTE@127.0.0.1:5432/vaggu_teste"
```

O nome do banco deve terminar em `_teste` ou `_test`. Nunca use aqui o banco `vaggu_local` ou um banco de produção.

Os arquivos `.env` e `.env.teste.local` são locais e ignorados pelo Git.

### 6. Prepare o backend e o banco

Execute um comando de cada vez:

```powershell
npm.cmd ci
npm.cmd run db:generate
npm.cmd run db:validate
npm.cmd run db:deploy
npm.cmd run build
```

Resultado esperado:

- o Prisma informa que o schema é válido;
- `db:deploy` aplica as migrations ou informa `No pending migrations to apply`;
- o build termina sem erro.

`db:deploy` altera o banco indicado por `DATABASE_URL`. Antes de executá-lo, confira sempre se o `.env` aponta para o banco local correto.

### 7. Crie o primeiro administrador

```powershell
npm.cmd run admin:create
```

Informe nome e e-mail quando solicitado. O comando mostra uma senha apenas uma vez. Guarde-a em local seguro e não envie capturas de tela.

Não existe administrador padrão nem cadastro público. Se o banco já possuir um administrador, o comando recusará a criação de outro.

### 8. Instale o frontend

Abra outro PowerShell na raiz do projeto:

```powershell
Set-Location .\vaggu-frontend
npm.cmd ci
npm.cmd run build
```

Resultado esperado: o build termina sem erro. Um aviso sobre o tamanho do arquivo JavaScript pode aparecer; ele é conhecido e não impede o teste local.

## Como abrir o sistema diariamente

Depois da primeira configuração, use três etapas.

### 1. Confirme que o PostgreSQL está iniciado

Abra **Serviços** no Windows e confirme que o serviço `postgresql` está **Em execução**.

### 2. Inicie a API

No primeiro PowerShell, a partir da raiz:

```powershell
Set-Location .\vaggu-backend
npm.cmd run build
npm.cmd start
```

Mantenha esse terminal aberto. A mensagem esperada contém:

```text
Vaggu API: http://127.0.0.1:3000/api/v1/health
```

### 3. Inicie a interface

No segundo PowerShell, a partir da raiz:

```powershell
Set-Location .\vaggu-frontend
npm.cmd run dev
```

Abra o endereço mostrado pelo Vite, normalmente `http://127.0.0.1:5173`.

O frontend envia chamadas `/api` para `http://127.0.0.1:3000`. Sem a API, o login apresentará erro; não existe acesso demonstrativo local.

## Como confirmar que está funcionando

Com a API aberta, execute em outro PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/v1/health
Invoke-RestMethod http://127.0.0.1:3000/api/v1/health/ready
```

Os dois comandos devem retornar `status` igual a `ok`.

- `/health` confirma que a API iniciou.
- `/health/ready` confirma que a API conseguiu consultar o PostgreSQL.

Se `/health` funcionar e `/health/ready` falhar, o problema está na conexão indicada por `DATABASE_URL`.

## Como ver as tabelas e os dados

Na pasta `vaggu-backend`, execute:

```powershell
npm.cmd run db:studio
```

O Prisma Studio abrirá um endereço local no navegador. Use-o somente para consultar dados durante o desenvolvimento. Não altere manualmente hashes, sessões ou relacionamentos que normalmente são controlados pela API.

Use `Ctrl+C` no terminal para encerrar o Prisma Studio.

## Como executar os testes com PostgreSQL

Confirme que `.env.teste.local` existe e execute na pasta `vaggu-backend`:

```powershell
npm.cmd run test:integracao
```

O runner:

1. conecta em `vaggu_teste`;
2. cria um banco temporário `vaggu_teste_<identificador>`;
3. aplica as migrations;
4. cria somente dados fictícios do cenário;
5. executa os testes;
6. remove o banco temporário.

Ele não limpa `vaggu_local` nem usa `DATABASE_URL` como alternativa. Uma interrupção forçada pode deixar um banco temporário; remova somente o banco cujo nome completo começa com `vaggu_teste_`, depois de confirmar que nenhum teste o utiliza.

Para executar também os testes que não dependem do banco:

```powershell
npm.cmd run typecheck
npm.cmd test
```

## Como encerrar

- API: pressione `Ctrl+C` no terminal do backend.
- Frontend: pressione `Ctrl+C` no terminal do frontend.
- Prisma Studio: pressione `Ctrl+C` no terminal correspondente.
- PostgreSQL instalado como serviço pode continuar ligado. Se desejar pará-lo, use **Serviços** do Windows.

## Ambiente portátil usado nesta máquina da equipe

Esta máquina possui uma instalação portátil e ignorada pelo Git em `ambiente.local`. Ela não acompanha o repositório e não deve ser copiada como requisito para parceiros.

Em 21/09/2026, a validação local usou:

- PostgreSQL `17.11`;
- banco `vaggu_p05_local`;
- endereço `127.0.0.1:55432`;
- API em `127.0.0.1:3000`;
- 9 migrations aplicadas, sem pendências;
- `/health` e `/health/ready` com resposta `ok`.

Nesta máquina específica, o PostgreSQL portátil é iniciado, a partir da raiz, com:

```powershell
.\ambiente.local\postgresql\pgsql\bin\pg_ctl.exe start `
  -D ".\ambiente.local\dados" `
  -l ".\ambiente.local\postgresql.log" `
  -o "-p 55432" `
  -w
```

Para encerrá-lo de forma segura:

```powershell
.\ambiente.local\postgresql\pgsql\bin\pg_ctl.exe stop `
  -D ".\ambiente.local\dados" `
  -m fast `
  -w
```

Parceiros devem seguir a instalação normal deste guia e usar a porta `5432`, salvo se a própria instalação do PostgreSQL informar outra porta.

## Problemas comuns

### `ECONNREFUSED` ou conexão recusada

- Confirme que o serviço PostgreSQL está iniciado.
- Confira a porta no `.env`.
- Confirme que o nome do banco existe no pgAdmin.

### Falha de autenticação do PostgreSQL

- Confira usuário e senha no `.env`.
- Não envie a URL completa em mensagens ou capturas.
- Se alterou a senha, atualize somente o arquivo local correspondente.

### `db:deploy` não conecta

- Teste primeiro `/health/ready` se a API já estiver aberta.
- Confira `DATABASE_URL`.
- Não use `prisma migrate reset`: esse comando apaga dados.

### Porta `3000` já está em uso

Encerre a API antiga com `Ctrl+C`. Se realmente precisar usar outra porta, altere `PORT` no `.env` e configure o destino correspondente no frontend por meio de `API_PROXY_TARGET`.

### O frontend abre, mas o login falha

- Confirme `/api/v1/health` e `/api/v1/health/ready`.
- Confirme que o primeiro administrador foi criado.
- Use o e-mail e a senha gerados por `admin:create`.

### Teste pede banco terminado em `_teste` ou `_test`

Confira se `TEST_DATABASE_URL` aponta exatamente para `vaggu_teste`, sem parâmetros ou fragmentos adicionais.

### Teste informa falta de `CREATEDB`

No Query Tool, conectado como administrador local, execute somente para o usuário de testes:

```sql
ALTER ROLE vaggu_teste_runner CREATEDB;
```

## Regras de segurança

- Nunca publique `.env` ou `.env.teste.local`.
- Nunca execute testes contra produção.
- Nunca use `prisma migrate reset` em banco com dados importantes.
- Nunca envie senha, token ou URL completa do banco em prints.
- Antes de migrations em ambiente compartilhado, faça backup e confirme o destino.
- Dados fictícios devem permanecer apenas nos bancos locais e temporários.

## Hospedagem no Render

O [registro de hospedagem](planejamento-do-projeto.md) informa que a equipe colocou o PostgreSQL no Neon e publicou a VAGGU no serviço `vaggu-tcc` do Render. O `render.yaml` versionado descreve um único serviço web no plano gratuito: ele instala as dependências, gera o cliente Prisma, compila backend e frontend, aplica migrations com `db:deploy` e inicia a API. O endereço público exato e o painel do provedor não estão no repositório; esta revisão não realizou uma requisição ao serviço hospedado.

O manifesto define `HOST=0.0.0.0`, `NODE_ENV=production` e `FRONTEND_DIST_PATH=../vaggu-frontend/dist`. O Express entrega o build React e as rotas `/api/v1` na mesma origem, sem CORS amplo; o cliente usa caminhos relativos. A plataforma usa `/api/v1/health/ready` como verificação de prontidão, incluindo a conexão ao banco. `DATABASE_URL` é solicitada como segredo do serviço, sem valor no Git. `BLOB_READ_WRITE_TOKEN` não consta do manifesto: a foto só persiste quando a equipe a configura no backend. Não executar o banco de testes contra a conexão do Neon.

O manifesto ainda gera `CREDENTIAL_ENCRYPTION_KEY`, embora o código atual não a leia após remover a cópia reversível da senha provisória. É uma configuração sem uso a limpar em uma revisão de infraestrutura; não reutilizá-la para guardar credenciais.

O plano gratuito pode suspender a instância após inatividade; a primeira abertura seguinte pode demorar. O banco do Neon é externo ao processo web. Antes de afirmar que uma nova versão está no ar, conferir o deploy correspondente no Render e abrir a aplicação e `/api/v1/health/ready` no endereço fornecido pelo painel.

### Publicação automática pela `main`

O histórico da equipe registra que o serviço foi criado a partir da URL pública do repositório e não recebia os eventos de push do GitHub. O workflow `.github/workflows/publicar-render.yml` está commitado e solicita o deploy pelo hook quando recebe push na `main` ou disparo manual. Ele falha explicitamente se `RENDER_DEPLOY_HOOK_URL` não existir; o commit do workflow não comprova que o segredo já foi cadastrado ou que cada publicação terminou com sucesso.

O administrador do repositório deve concluir uma única configuração:

1. No serviço `vaggu-tcc` do Render, abrir **Settings**, localizar **Deploy Hook** e copiar a URL secreta.
2. No GitHub, abrir **Settings → Secrets and variables → Actions → New repository secret**.
3. Criar o segredo `RENDER_DEPLOY_HOOK_URL` com a URL copiada. Não registrar essa URL em arquivos, mensagens ou capturas.
4. Abrir **Actions → Publicar main no Render → Run workflow** e conferir o resultado no GitHub e no Render. Com o segredo configurado, cada push na `main` solicita uma nova publicação; conferir também o resultado do build e da prontidão.

Somente administradores de `Pietro-August0/Vaggu` podem cadastrar esse segredo. A conta de Samuel possui permissão de escrita, mas não de administração do repositório.
