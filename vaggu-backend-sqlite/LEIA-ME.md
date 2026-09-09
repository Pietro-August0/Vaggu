# Prisma corrigido — Vaggu, compatível com o backend 0.3.0

Este pacote corrige a pasta Prisma que você enviou. Não é o backend completo: mantenha os arquivos JavaScript e o package.json 0.3.0 já instalados.

## O que foi corrigido

- Schema completo com os seis modelos: Shopping, Usuario, Sessao, Dispositivo, Vaga e HistoricoVaga.
- Relações de Usuario e Sessao em uma única linha, com sintaxe válida.
- Migration inicial restaurada com o mesmo conteúdo e checksum registrados no banco enviado.
- Migration de sessões separada: cria somente a tabela sessoes e seus índices.
- Migration lock continua configurado para SQLite. 

A pasta enviada estava sem a migration inicial, e a pasta de sessões continha também o SQL de criação das tabelas antigas. Isso tentaria recriar tabelas que já existem.

## Instalar na pasta atual

1. Pare a API com Ctrl+C e feche o Prisma Studio.
2. Guarde um backup da pasta atual com a API parada.
3. Extraia este ZIP numa pasta separada.
4. Copie a pasta prisma deste ZIP para a raiz do seu projeto, no mesmo nível de package.json. Aceite MESCLAR pastas e SUBSTITUIR arquivos de mesmo nome. Não crie prisma/prisma.
5. Não apague sua pasta prisma nem o arquivo prisma/dev.db. Preserve também seu .env.

Este ZIP NÃO inclui dev.db: seu banco local deve continuar onde está. O banco original enviado não foi alterado; a verificação foi feita em uma cópia.

Na pasta principal do projeto, execute um comando por vez:

```sh
node -p "require('./package.json').version"
npm run db:validate
npm run db:setup
npm test
```

A versão deve ser 0.3.0. db:setup regenera o cliente Prisma e aplica a migration de sessões sem reset. Não basta executar os testes sem regenerar o cliente.

Se algum comando apresentar erro, pare nele e envie a mensagem. Não execute reset, não apague o banco e não altere o histórico de migrations manualmente.

Se os testes passarem, crie o administrador somente se ainda não tiver uma conta:

```sh
npm run admin:create
npm run dev
```

Guarde a senha gerada sem enviar prints ou compartilhá-la. O script não redefine senhas de administradores existentes.

## Estrutura esperada

| Caminho | Conteúdo |
| --- | --- |
| prisma/schema.prisma | Schema completo atualizado. |
| prisma/migrations/migration_lock.toml | Provider SQLite. |
| prisma/migrations/20260902000200_inicial_sqlite/migration.sql | Cinco tabelas iniciais, sem alterações em relação à migration aplicada. |
| prisma/migrations/20260902000300_sessoes/migration.sql | Apenas a nova tabela de sessões. |

Se o banco local tiver recebido novas alterações depois do envio deste ZIP, não force uma migration que falhar. Envie o erro para conferirmos o estado atual.

## Verificações realizadas

- Schema formatado e validado com Prisma 7.10.0.
- Cliente Prisma regenerado com o modelo Sessao.
- Migration aplicada em uma cópia do banco enviado, sem alterar o original.
- Todos os registros das cinco tabelas existentes comparados antes/depois e preservados.
- 43 testes do backend 0.3.0 passaram em Linux com esta pasta Prisma corrigida. A execução no Windows ainda deve ser confirmada.
