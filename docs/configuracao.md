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

Ctrl+C encerra a API. O backend não cria administrador real automaticamente; o procedimento está no [README do backend](../vaggu-backend/README.md).

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
