# Configuração e execução da VAGGU

Este é o guia canônico para executar a VAGGU com Docker ou diretamente com npm. O Compose prepara um banco próprio de desenvolvimento; a execução nativa usa a conexão PostgreSQL configurada pela equipe. Ferramentas, credenciais reais e dados não integram os arquivos versionados. O PostgreSQL portátil citado nos registros históricos não é requisito e não é montado no Docker.

## Executar com Docker

### Preparar o computador e iniciar

1. Instale Git e Docker Desktop. No Windows, habilite o backend WSL 2 solicitado pelo instalador e use contêineres Linux. No macOS, escolha a versão para Intel ou Apple Silicon. No Linux, Docker Engine com o plugin Compose também é uma alternativa ao Desktop.
2. Inicie o Docker e confira `docker version` e `docker compose version`. Use Compose v2 (mínimo 2.20), com o comando `docker compose`, sem hífen. Não é necessário instalar Node, npm ou PostgreSQL no host. O primeiro build precisa de internet para baixar imagens e dependências.
3. Clone e entre no repositório:

```sh
git clone https://github.com/Pietro-August0/Vaggu.git
cd Vaggu
docker compose up --build
```

Os comandos Docker deste guia funcionam no PowerShell e nos terminais Linux/macOS. Execute-os sempre na raiz, onde está `compose.yaml`. Mantenha o terminal aberto; alternativamente, use `docker compose up --build -d` para segundo plano.

Nenhum arquivo de ambiente é obrigatório para começar. Os valores padrão de banco e criptografia são públicos, exclusivos de desenvolvimento local. Não use dados de clientes nem credenciais externas neste ambiente. Para personalizar, copie `.env.example` para `.env` na raiz **somente se não existir**:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

No Linux/macOS: `test -f .env || cp .env.example .env`. Edite esse arquivo antes da primeira subida. Ele é ignorado pelo Git. O `.env` nativo de `vaggu-backend` não é lido nem montado pelo Compose.

### O que é automatizado

| Serviço | Responsabilidade e condição |
| --- | --- |
| `postgres` | PostgreSQL 17.9, banco e usuário `vaggu_dev`, volume persistente. Healthcheck TCP com `pg_isready`. |
| `migracoes` | Aguarda banco saudável e executa `npm run db:deploy` (`prisma migrate deploy`). Finaliza com código 0; não é servidor permanente. Falha impede a primeira subida da API. |
| `backend` | Aguarda banco saudável e migrations concluídas; gera Prisma, compila e observa os fontes TypeScript, reiniciando a API após mudanças compiladas. Prontidão consulta o banco. |
| `frontend` | Aguarda API pronta, inicia Vite com HMR e polling e encaminha `/api` para `http://backend:3000`. Seu healthcheck confere a página e a prontidão pelo proxy. |

O Compose instala dependências com `npm ci` dentro das imagens. `node_modules` e `dist` ficam no Linux do contêiner, sem copiar artefatos Windows. Os fontes são montados para leitura: edite no seu editor local. Polling do Vite e do TypeScript atende pastas compartilhadas do Docker Desktop; pode consumir mais CPU que observação nativa. Não há mudança de UI ou regras de negócio.

Versões escolhidas: imagens `node:24.14.0-bookworm-slim` nos dois pacotes (npm 11.9.0 incluído) e `postgres:17.9-bookworm`. Node 24.14.0 já é citado como compatível no backend e atende a faixa `>=22.12.0 <25`; o frontend não declara engines próprios, mas Vite 8.2.2 aceita essa versão. Locks v3 preservados: Prisma/client/adapter 7.10.0, TypeScript backend 7.0.2 e frontend 6.0.3. O PostgreSQL 17.11 citado no histórico pertence a outra instalação; o volume Docker novo usa a versão fixada acima, sem migrar aquele banco. Tags fixam versões de aplicação, mas imagens base podem receber reconstruções; não há promessa de imagem bit a bit imutável por digest.

O usuário ainda instala/inicia Docker, clona o código, cria o administrador e configura integrações autorizadas quando necessário. WhatsApp automático permanece desativado e nenhuma credencial Meta é repassada. Não são criados shoppings, gerentes, vagas ou fixtures na subida.

### Endereços e personalização

| Acesso no computador | Padrão | Opção no `.env` da raiz |
| --- | --- | --- |
| Aplicação | `http://localhost:5173` | `PORTA_FRONTEND=5173` |
| API pronta | `http://localhost:3000/api/v1/health/ready` | `PORTA_BACKEND=3000` |
| PostgreSQL, por cliente externo | `localhost:5433`, banco/usuário `vaggu_dev` | `PORTA_POSTGRES=5433` |

As três portas são publicadas apenas em `127.0.0.1`. Nos contêineres, as portas continuam 5173, 3000 e 5432; mudar a porta do computador não altera proxy ou conexão interna. O navegador usa `/api/v1` na origem do Vite, sem depender de CORS entre portas. A rede bridge `interna` é criada para o projeto e resolve `postgres`/`backend` por nome; não é rede de produção nem usa IP fixo. Ela permite saída para internet, mas a configuração não habilita integrações externas.

`DATABASE_URL` é montada pelo Compose com host `postgres`, nunca `localhost`. Não aceita a URL nativa ou de produção por herança. O usuário e banco de desenvolvimento são fixos. Para senha personalizada em `POSTGRES_PASSWORD`, use letras, números, `_` e `-`, pois o valor entra diretamente na URL. A chave `CREDENTIAL_ENCRYPTION_KEY` deve ser longa e estável quando personalizada.

Não altere a senha apenas no `.env` depois de criar o volume: a imagem PostgreSQL não atualiza contas existentes dessa forma. Mantenha o valor original ou faça a rotação explícita no banco e na configuração. Não altere a chave de criptografia enquanto houver senhas provisórias pendentes; cópias antigas deixam de ser recuperáveis e precisarão ser redefinidas pelo Admin.

O projeto se chama `vaggu`; o volume padrão é `vaggu_dados-postgres`. Para outra cópia isolada, defina `COMPOSE_PROJECT_NAME` e portas diferentes antes de iniciar. Trocar esse nome seleciona outro volume, não transfere nem apaga os dados anteriores. Mantenha o mesmo nome nos comandos futuros.

### Criar o primeiro administrador

Após a subida, em outro terminal na raiz:

```sh
docker compose exec backend npm run admin:create
```

O comando interativo pergunta nome e e-mail e mostra uma senha gerada uma única vez. Guarde-a em gerenciador de senhas e use-a no login da aplicação. Não redirecione essa saída para logs, documentação ou capturas compartilhadas. O comando recusa outro administrador, mesmo desativado, e não substitui contas. A criação de gerentes continua sendo feita pelo Admin após a parceria.

### Saúde, logs e diagnóstico

```sh
docker compose ps -a
docker compose logs --tail=100 postgres migracoes backend frontend
docker compose logs -f backend frontend
docker compose exec postgres pg_isready -h 127.0.0.1 -U vaggu_dev -d vaggu_dev
docker compose exec backend npm exec -- prisma migrate status
```

Resultado esperado: PostgreSQL, backend e frontend `healthy`, e `migracoes` como `Exited (0)`. A prontidão usa `SELECT 1`; confirme também `prisma migrate status` e os logs das migrations. `unhealthy` não provoca reinício automático por si só; investigue os logs. `restart: unless-stopped` recupera processos encerrados inesperadamente, sem apagar dados.

Abra `/api/v1/health/ready` também pela porta **5173** para confirmar frontend → API → banco. Um 503 da API indica banco indisponível; 502/erro de proxy sugere que o backend não está acessível. Se o build falhar ao baixar imagens/pacotes, confira conexão, proxy corporativo e espaço do Docker, preservando o volume.

Porta ocupada: confira `docker compose ps -a` e os demais programas. No Windows, `Get-NetTCPConnection -State Listen -LocalPort 5173,3000,5433`; Linux: `ss -ltnp`; macOS: `lsof -nP -iTCP -sTCP:LISTEN`. Altere somente a opção `PORTA_*` em conflito no `.env` e execute `docker compose up --build -d`; não encerre processos de outra pessoa. Use o novo endereço no navegador.

Para falha de montagem no Desktop, confira compartilhamento/permissões da pasta clonada. No Windows, o checkout dentro do filesystem WSL pode melhorar desempenho; não é necessário mover um checkout existente. Se a edição não aparecer, acompanhe os logs de compilação; arquivos de configuração não montados e dependências exigem reconstrução. Erro de TypeScript pode manter a última versão compilada; corrija o erro antes de validar a alteração.

### Migrations e atualização

Na primeira subida, o serviço `migracoes` aplica **somente** migrations versionadas. Não usa `migrate reset`, não importa bancos existentes e não insere fixtures. Confira a conexão/destino antes de usar comandos fora deste Compose.

Após receber novas migrations ou alterar schema/dependências, pare os serviços preservando o banco e suba novamente. Isso garante que a migration termine antes de iniciar a nova API:

```sh
docker compose down
docker compose up --build
```

Para aplicar explicitamente migrations com a API parada, mas mantendo o banco iniciado:

```sh
docker compose stop frontend backend
docker compose run --rm migracoes
docker compose up --build -d
```

Falha de migration exige inspecionar logs e corrigir a causa, preservando o banco. Não marque migration como aplicada nem use reset para contornar o erro. O SQL e schema montados são somente leitura. Para **criar** uma nova migration, use o fluxo nativo `db:migrate` em banco próprio de desenvolvimento ou monte explicitamente `prisma` para escrita em um contêiner de trabalho; a subida normal apenas aplica arquivos já revisados.

Alterações em `src` e assets aparecem pelo watcher. Alterações em `package.json`, lockfiles, Dockerfiles ou configurações copiadas exigem o ciclo `down` / `up --build`; dependências não ficam em volumes antigos. Para atualizar dependências sem Node no computador, use um contêiner temporário montando apenas os dois manifestos para escrita; os módulos instalados ficam no contêiner descartável. Exemplo para o frontend, substituindo NOME e VERSAO pelo pacote aprovado:

```sh
docker compose run --rm --no-deps --user 0 -v ./vaggu-frontend/package.json:/aplicacao/package.json -v ./vaggu-frontend/package-lock.json:/aplicacao/package-lock.json frontend npm install NOME@VERSAO
```

O usuário 0 é usado somente nesse comando explícito de manutenção dos manifestos montados, não nos servidores. Para backend, substitua os nomes `frontend`/`vaggu-frontend` por `backend`/`vaggu-backend`. Revise `package.json` e lockfile e reconstrua; não rode esse exemplo literalmente com NOME/VERSAO. Para atualizar a base já fixada, `docker compose build --pull`; `--no-cache` fica reservado ao diagnóstico de cache. Mudanças de versão principal do PostgreSQL exigem backup e migração próprios, nunca reutilização cega do diretório de dados.

### Parar, retomar e remover dados

Ctrl+C para a execução em primeiro plano. `docker compose stop` para os serviços; `docker compose start` retoma os contêineres existentes. Para remover contêineres e rede preservando o banco, use `docker compose down`. A retomada recomendada, que também verifica migrations, é `docker compose up --build`.

**Destrutivo e opcional:** `docker compose down --volumes` apaga o volume PostgreSQL deste projeto, incluindo administrador, shoppings e histórico locais. Só execute se decidir descartar esses dados e já tiver backup do que precisa. Isso não foi executado nesta entrega. Não use limpeza global de volumes. Sem `--volumes`, o banco é preservado.

### Roteiro de validação em uma máquina com Docker

Este roteiro permanece pendente nesta entrega: Docker não está instalado/disponível no computador usado. Parsing YAML, builds npm e testes locais não substituem execução de contêineres.

```sh
docker compose config --quiet
docker compose build
docker compose up -d
docker compose ps -a
docker compose logs migracoes
docker compose exec postgres pg_isready -h 127.0.0.1 -U vaggu_dev -d vaggu_dev
docker compose exec backend npm exec -- prisma migrate status
docker compose exec backend node -e "fetch('http://127.0.0.1:3000/api/v1/health/ready').then(async r=>{console.log(r.status,await r.text());process.exit(r.ok?0:1)})"
docker compose exec frontend node -e "Promise.all(['/', '/api/v1/health/ready'].map(async p=>{const r=await fetch('http://127.0.0.1:5173'+p);console.log(p,r.status);if(!r.ok)process.exitCode=1}))"
docker compose exec backend npm run typecheck
docker compose exec backend npm test
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
```

Aguarde a prontidão antes dos `exec`. Sem `TEST_DATABASE_URL`, `npm test` pula as integrações explicitamente. Depois crie o administrador pelo comando acima, entre no navegador e confira uma chamada autenticada da aplicação à API. Anote o ID do administrador pela consulta abaixo (não revela credenciais), execute `docker compose restart postgres backend frontend`, aguarde a prontidão e consulte novamente. Repita com `docker compose down` / `docker compose up -d`: deve retornar o mesmo ID e permitir o mesmo login.

```sh
docker compose exec postgres psql -U vaggu_dev -d vaggu_dev -c "SELECT id FROM usuarios WHERE shopping_id IS NULL;"
```

Edite um texto de teste no frontend e um comentário no backend; confira HMR e recompilação nos logs e desfaça apenas essas edições de teste. Verifique também a parada sem encerramento forçado. Essa validação de Docker Desktop/Windows, Linux ou macOS ainda não foi executada.

Para os testes PostgreSQL isolados no Docker, crie explicitamente um banco de controle vazio **uma vez** e execute a suíte com a URL de teste construída a partir das mesmas credenciais locais. O nome termina em `_teste`, como exige o runner:

```sh
docker compose exec postgres createdb -U vaggu_dev vaggu_teste
docker compose exec backend sh -c 'export TEST_DATABASE_URL="${DATABASE_URL%/*}/vaggu_teste"; npm test'
```

Se `createdb` indicar que já existe, confira que é o banco de controle vazio antes de continuar; não o remova. O runner cria fixtures somente nos bancos aleatórios próprios e remove esses bancos ao concluir. Não use o banco da aplicação como banco de controle. Não foi executado nesta entrega.

### Desenvolvimento e produção

Este Compose usa servidores de desenvolvimento, portas locais, credenciais ilustrativas e o usuário administrativo do PostgreSQL restrito a esta instância local. Produção exige segredos privados, usuário de banco com permissões apropriadas, TLS, backup, hospedagem e processo de migrations revisado. Docker aqui não resolve nem substitui essas decisões. O fluxo npm abaixo permanece disponível.

Referências oficiais usadas para as escolhas: [ordem e condições de inicialização do Compose](https://docs.docker.com/compose/how-tos/startup-order/), [redes do Compose](https://docs.docker.com/reference/compose-file/networks/), [Node 24.14.0 e npm incluído](https://nodejs.org/en/blog/release/v24.14.0).

## Executar sem Docker

## O que instalar e configurar

- Node.js compatível com `>=22.12.0 <25` (Node 24 foi usado na verificação de P01) e npm.
- Uma conexão PostgreSQL de desenvolvimento, obtida com a equipe ou no provedor escolhido.
- Uma conexão separada de teste para executar os cenários com persistência real.

Confira `node --version` no terminal. Dependências são instaladas dentro de cada pacote com `npm ci`; `node_modules` é gerado pelo npm e não deve ser enviado ao Git. No PowerShell, use `npm.cmd` se `npm.ps1` estiver bloqueado.

## Interface web

Na raiz do projeto:

```powershell
Set-Location vaggu-frontend
npm.cmd ci
npm.cmd run dev
```

Use o endereço informado pelo Vite. O frontend autentica pela API. O proxy /api aponta para http://127.0.0.1:3000; use API_PROXY_TARGET para outro destino local. Sem API disponível, o login apresenta erro e não oferece acesso demonstrativo. A sessão fica em memória: recarregar exige nova entrada. Configure VITE_WHATSAPP_NUMBER somente quando houver número oficial; atualmente os links não têm destinatário.

Para verificar uma alteração, na mesma pasta:

```powershell
npm.cmd run lint
npm.cmd run build
```

`dist` é a saída gerada do build e pode ser recriada. Faça alterações em `src`, nunca em `dist`.

## API e PostgreSQL

Na pasta `vaggu-backend`, instale dependências e crie sua configuração caso ainda não exista:

```powershell
npm.cmd ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Edite `.env` e preencha `DATABASE_URL` com a conexão de desenvolvimento fornecida pela equipe. O exemplo contém apenas valores ilustrativos. As variáveis `HOST` e `PORT` controlam o endereço da API; mantenha o envio automático do WhatsApp desativado enquanto não estiver testando essa integração autorizada.

Defina também `CREDENTIAL_ENCRYPTION_KEY` com um segredo aleatório e estável. Essa chave protege a cópia temporária das senhas provisórias que o Admin pode consultar antes da primeira troca. Não altere a chave enquanto houver senhas provisórias pendentes: os valores antigos deixam de ser legíveis e precisarão ser redefinidos. Para compatibilidade local, a API usa `DATABASE_URL` como alternativa quando a chave não foi configurada, mas ambientes compartilhados devem usar uma chave exclusiva.

Com o destino do banco conferido:

```powershell
npm.cmd run db:generate
npm.cmd run db:validate
npm.cmd run db:deploy
npm.cmd run build
npm.cmd start
```

`db:generate` gera o cliente Prisma a partir do schema. `db:deploy` aplica migrations pendentes ao banco indicado por `DATABASE_URL`; não o execute em outro ambiente por engano. `start` executa `dist/src/server.js`. `dev` compila uma vez e observa o JavaScript gerado; edições no TypeScript precisam ser recompiladas.

Com a porta padrão, consulte:

- `http://127.0.0.1:3000/api/v1/health`: a API está respondendo.
- `http://127.0.0.1:3000/api/v1/health/ready`: a API consegue consultar o PostgreSQL.

Ctrl+C encerra a API. O backend não cria administrador real automaticamente; o procedimento está no [README do backend](../../../vaggu-backend/README.md).

## Testes com e sem banco

Na pasta `vaggu-backend`, após gerar o cliente:

```powershell
npm.cmd run typecheck
npm.cmd test
```

Sem `TEST_DATABASE_URL` no ambiente, a suíte marca a integração como **PENDENTE/skip**. Os demais testes HTTP/configuração rodam, mas isso não comprova a persistência real.

Para testar a persistência, crie `.env.teste.local` com a variável `TEST_DATABASE_URL` e uma conexão própria de teste. O nome do banco de controle deve terminar em `_teste` ou `_test`, sem parâmetros extras na URL; o usuário precisa de `CREATEDB`. Se o provedor não permitir criação de bancos, essa limitação precisa ser resolvida antes de declarar a integração validada.

```powershell
npm.cmd run test:integracao
```

O runner cria um banco exclusivo com nome aleatório, aplica as migrations versionadas, cria dados fictícios e remove somente esse banco ao concluir. Não reutiliza `DATABASE_URL`, não limpa o banco de controle e não testa contra produção. Arquivo de configuração ausente causa erro no comando específico; conexão presente mas inválida/inacessível também falha.

Para executar toda a suíte com a configuração de teste:

```powershell
npm.cmd run build
node --env-file=.env.teste.local --test 'dist/test/**/*.test.js'
```

## Documentação em cada alteração

Na raiz do repositório:

```powershell
node scripts/verificar-documentacao.mjs
```

Esse comando confere se todo arquivo versionável está explicado no [mapa do projeto](mapa-do-projeto.md). Revise também os comentários e as descrições quando mudar o papel de um arquivo. Não registre credenciais nos documentos.
