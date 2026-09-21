# Configuração e execução da VAGGU

Este guia explica como executar o código usando um PostgreSQL configurado pela equipe. Ferramentas e bancos não integram os arquivos versionados. Em 11/09, a pasta local ignorada ambiente.local ainda existia e foi reutilizada nos testes; a remoção descrita anteriormente não estava efetivada. Nenhum ambiente novo foi criado nesta retomada.

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

### Criar o banco local de testes

Cada integrante deve criar seu próprio banco de controle no PostgreSQL local. Ele não substitui o banco de desenvolvimento configurado em `DATABASE_URL`, não recebe dados da aplicação e nunca deve apontar para produção. O runner conecta nesse banco somente para criar e remover bancos descartáveis com nomes aleatórios.

1. Instale o PostgreSQL local. No Windows, use o instalador oficial e mantenha o serviço PostgreSQL iniciado; o pgAdmin incluído pode executar o SQL abaixo. No Linux ou macOS, use o pacote PostgreSQL da sua distribuição ou gerenciador e confirme que o serviço está em execução.
2. Abra o **Query Tool** do pgAdmin conectado ao banco `postgres` como administrador local. Quem usa terminal pode abrir `psql -U postgres -d postgres`.
3. Escolha uma senha local própria, sem reutilizar credenciais reais, e execute:

```sql
CREATE ROLE vaggu_teste_runner
  WITH LOGIN CREATEDB PASSWORD 'troque-por-uma-senha-local';

CREATE DATABASE vaggu_teste
  WITH OWNER vaggu_teste_runner
  ENCODING 'UTF8'
  TEMPLATE template0;
```

O nome `vaggu_teste` é obrigatório neste exemplo porque o runner aceita apenas bancos terminados em `_teste` ou `_test`. `CREATEDB` também é necessário: cada execução cria um banco `vaggu_teste_<identificador>`, aplica as migrations e remove somente esse banco descartável ao concluir. O banco de controle `vaggu_teste` permanece vazio e não é apagado.

Se o papel ou banco já existir, não repita o comando às cegas. Confira no pgAdmin ou com `\du vaggu_teste_runner` e `\l vaggu_teste`; reutilize-os somente se forem locais e exclusivos dos testes VAGGU. Nunca conceda `SUPERUSER`, nunca use uma conexão de produção e não aponte os testes para o banco normal de desenvolvimento.

4. Na pasta `vaggu-backend`, crie o arquivo ignorado `.env.teste.local`:

```dotenv
TEST_DATABASE_URL="postgresql://vaggu_teste_runner:troque-por-uma-senha-local@127.0.0.1:5432/vaggu_teste"
```

Não copie essa senha para `.env.example`, documentação, commit ou mensagem. Se a senha contiver `@`, `:`, `/`, `?`, `#` ou `%`, codifique esses caracteres para URL ou escolha uma senha local alfanumérica longa para evitar erro de conexão. A URL de teste não aceita parâmetros ou fragmentos adicionais.

5. Confira a conexão sem expor a senha no terminal. No PowerShell, carregue a variável do arquivo apenas no processo atual:

```powershell
Set-Location vaggu-backend
$linhaTeste = Get-Content .env.teste.local | Where-Object { $_ -match '^TEST_DATABASE_URL=' }
$env:TEST_DATABASE_URL = ($linhaTeste -replace '^TEST_DATABASE_URL=', '').Trim('"')
psql $env:TEST_DATABASE_URL -c 'SELECT current_database(), current_user;'
Remove-Item Env:TEST_DATABASE_URL
```

Se `psql` não estiver no `PATH` no Windows, use o **SQL Shell (psql)** instalado com o PostgreSQL ou confirme a conexão pelo pgAdmin. Não altere a política do PowerShell para executar o projeto; use `npm.cmd` quando necessário.

6. Instale as dependências pelo lockfile, gere o cliente Prisma e execute a integração:

```powershell
npm.cmd ci
$env:DATABASE_URL='postgresql://geracao:geracao@127.0.0.1:5432/geracao'
npm.cmd run db:generate
Remove-Item Env:DATABASE_URL
npm.cmd run test:integracao
```

A URL temporária de `db:generate` precisa apenas ter formato PostgreSQL; esse comando não conecta ao endereço ilustrativo. `test:integracao` lê `.env.teste.local`, compila o backend e executa os cenários reais de autenticação, administração e importação. Um resultado aprovado não deixa fixtures no banco de controle.

No Linux ou macOS, depois de criar o mesmo `.env.teste.local`, use `npm ci`, execute `DATABASE_URL='postgresql://geracao:geracao@127.0.0.1:5432/geracao' npm run db:generate` e depois `npm run test:integracao`.

### Diagnosticar a conexão de teste

- `ECONNREFUSED`: confirme que o serviço PostgreSQL está iniciado e escuta em `127.0.0.1:5432`. No Windows, confira em **Serviços**; no Linux, use `systemctl status postgresql`; no macOS com Homebrew, `brew services list`.
- Falha de autenticação: revise usuário e senha no arquivo local. Não envie a URL completa em capturas ou mensagens.
- “banco terminado em `_teste` ou `_test`”: remova parâmetros da URL e use exatamente o banco de controle dedicado.
- “permissão CREATEDB”: conectado como administrador local, execute `ALTER ROLE vaggu_teste_runner CREATEDB;` somente para esse usuário de testes.
- Banco descartável remanescente após interrupção forçada: identifique exatamente o nome `vaggu_teste_<identificador>`, confirme que nenhuma conexão o utiliza e remova apenas esse banco pelo pgAdmin. Não faça limpeza ampla nem apague `vaggu_teste`.
- Porta diferente de 5432: ajuste apenas a porta em `.env.teste.local` conforme sua instalação local.

Para testar a persistência, mantenha `.env.teste.local` com a variável `TEST_DATABASE_URL` e a conexão própria criada acima. Se o PostgreSQL local não permitir criação de bancos, essa limitação precisa ser resolvida antes de declarar a integração validada.

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
