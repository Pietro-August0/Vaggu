---
name: start
description: "Iniciar ou retomar um dia de desenvolvimento da VAGGU, revisar o planejamento e executar o pacote de trabalho preparado para o dia. Use quando a equipe pedir para começar o dia ou invocar $start no projeto VAGGU."
---

# Início do dia — VAGGU

Transforme o registro do último dia em trabalho concreto, sem perder alterações locais. Esta skill é específica da VAGGU; a palavra `start` em um comando de servidor não é pedido para iniciar este fluxo.

## Contexto obrigatório

Localize a raiz pelo diretório atual e pelo Git. Confirme `AGENTS.md`, `docs/SSD-VAGGU.md` e `docs/planejamento-do-projeto.md` da VAGGU. Todos os caminhos deste fluxo são relativos à raiz do projeto, não à pasta instalada da skill. Se estiver em outro projeto, peça a localização da VAGGU antes de editar.

Leia as instruções aplicáveis, o planejamento completo e as regras/critério de aceite da entrega selecionada. Compare `git status`, diff e histórico recente com o último registro: o documento pode estar desatualizado. Não confunda “presente no código” com comportamento testado.

Consulte `docs/mapa-do-projeto.md` para localizar o papel de cada arquivo. Em cada mudança, revise comentários e a descrição correspondente; atualize o mapa quando mudar finalidade, uso ou caminho e inclua/remova entradas junto dos arquivos. Antes de concluir, execute `node scripts/verificar-documentacao.mjs` e revise a clareza das descrições. Não recrie o ambiente portátil removido pela equipe; confira runtime e conexão PostgreSQL disponíveis conforme `docs/configuracao.md`.

## Abrir e executar o dia

1. Obtenha a data real em `America/Sao_Paulo`. Abra uma entrada no “Registro diário” com data, estado **aberto**, pacote, objetivo e situação de entrada. Se já existir um dia aberto na mesma data, retome-o; se estiver encerrado, registre retomada e altere seu estado para **aberto**, preservando o fechamento anterior nessa entrada. Não avance a data artificialmente.
2. Se faltar o fechamento de uma data anterior, inspecione as alterações, marque a entrada antiga como **interrompido — fechamento não realizado** e indique a entrada atual que continua o trabalho. Preserve a pendência e os testes desconhecidos, sem inventar o que aconteceu. Se o planejamento estiver ausente, reconstruir um resumo mínimo com evidências antes de escolher a entrega; não criar uma conclusão fictícia do dia anterior.
3. Use o pacote definido em “Próximo início”. Confira dependências e aceite no backlog. Se estiver concluído ou obsoleto, escolha a primeira entrega pronta coerente com as prioridades e registre o motivo da troca. Um impedimento externo não justifica pular uma dependência de segurança ou isolamento.
4. Anuncie brevemente o objetivo e execute o pacote. A invocação de `start` autoriza o trabalho local necessário a essa entrega; não pare apenas após ler ou apresentar um plano. Use skills específicas quando necessárias e confirme comandos/versões antes de executar.
5. Verifique proporcionalmente aos arquivos e comportamentos alterados. Continue correções dentro do pacote até satisfazer seu aceite. Se uma parte depender de informação ou acesso ausente, avance no trabalho independente e registre a parte bloqueada; não apresente teste simulado como integração real.
6. Atualize inventário, backlog e registro diário com arquivos e resultados reais. Entregue um resumo do que foi feito e do que resta. O dia permanece aberto até `end` ou pedido explícito de fechamento; não execute `end` automaticamente.

## Limites e continuidade

- Priorize o direcionamento atual da equipe sobre o plano antigo; documente a mudança de objetivo.
- Não resetar demonstrações, sobrescrever mudanças de colegas ou migrar hashes/senhas locais para contas reais.
- Preparação local reversível faz parte do pacote. Publicação, mensagens, alterações em serviços/banco reais e mudanças globais do ambiente seguem autorização e permissões da sessão; o documento não concede essas permissões.
- Ao concluir o pacote, prepare a indicação da próxima entrega. Não percorra todo o backlog por conta própria: encerre o trabalho desse início quando o pacote estiver aceito ou quando houver impedimento que exija decisão do usuário.
- Ao registrar testes, informe comando, diretório, resultado e limitações. Não use uma aprovação de outro dia para mudanças novas e não grave credenciais, tokens ou dados pessoais no planejamento.
