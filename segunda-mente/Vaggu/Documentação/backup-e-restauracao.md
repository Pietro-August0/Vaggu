# Backup e restauração do PostgreSQL

Implementado e ensaiado localmente em 21/10/2026. Não representa configuração de backup automático do banco publicado.

## Criar uma cópia

Na pasta `vaggu-backend`, defina `BACKUP_DATABASE_URL` para o banco escolhido e `PG_BIN` para a pasta dos utilitários oficiais do PostgreSQL. Use uma versão de `pg_dump` compatível com o servidor. As credenciais devem ficar no ambiente local, sem entrar no Git ou em comandos compartilhados.

```powershell
npm.cmd run build
node dist/scripts/backup-banco.js criar C:/pasta-protegida/vaggu.dump
```

A pasta de destino deve existir. O arquivo é criado em formato custom do PostgreSQL; um arquivo existente nunca é sobrescrito. Não há fallback para `DATABASE_URL`. A conexão é passada aos utilitários pelo ambiente, sem expor senha nos argumentos ou logs. O dump contém dados privados, hashes e credenciais protegidas do sistema: armazene-o com acesso restrito e proteção adequada. Ele não contém variáveis de ambiente nem arquivos externos ao banco.

## Ensaiar a recuperação

Defina `RESTORE_DATABASE_URL` para um nome **novo**, local, terminado em `_teste` ou `_test`. O usuário precisa de permissão `CREATEDB`. A restauração recusa bancos existentes, destinos remotos e parâmetros extras. Use somente cópias de origem confiável.

```powershell
node dist/scripts/backup-banco.js restaurar-local C:/pasta-protegida/vaggu.dump
```

O script verifica o cabeçalho do arquivo, cria o banco e executa `pg_restore` em uma transação, sem `--clean`. Falhas deixam o destino criado disponível para inspeção; não há descarte automático de banco. Este comando serve para ensaio local; recuperação de produção exige procedimento específico para o ambiente escolhido.

## Verificação executada

O teste `backup-postgresql.test.ts` cria bancos isolados, aplica todas as migrations, acrescenta um registro com acentos, gera dump e restaura em outro banco novo. Confere os dados, a quantidade de tabelas e a restrição de chave primária. Confere também a recusa de sobrescrita do arquivo e de restauração sobre um banco existente. As fixtures são descartáveis e removidas ao final.

Executado em 21/10 com utilitários oficiais e PostgreSQL local na porta 55439: ensaio de dump/restauração aprovado. Não foi acessado o banco de produção.

## Operação a definir antes de produção

Precisamos definir frequência, retenção, local protegido da cópia externa, responsável e prazo de recuperação. Confirmar backup oferecido pela hospedagem e repetir o ensaio periodicamente. A existência deste script não comprova cópia externa, agendamento ou recuperação do ambiente publicado. Sessões restauradas podem precisar de revogação antes de liberar uma instância recuperada.
