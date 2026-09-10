---
name: end
description: "Encerrar um dia de desenvolvimento da VAGGU, documentar alterações e verificações e preparar a primeira entrega do próximo início. Use quando a equipe pedir o fechamento do dia ou invocar $end no projeto VAGGU."
---

# Fechamento do dia — VAGGU

Deixe uma passagem de trabalho que permita ao próximo `start` continuar sem depender da memória da conversa. Esta skill não inicia a implementação do próximo pacote.

## Reconstruir o dia com evidências

Localize e confirme a raiz da VAGGU a partir do diretório atual/Git. Leia `AGENTS.md` e `docs/planejamento-do-projeto.md`; os caminhos são relativos à raiz, não à instalação da skill. Consulte as regras e critérios da entrega quando necessário. Em outro repositório, peça a localização correta antes de editar.

Use a data real em `America/Sao_Paulo`, a entrada aberta, a conversa, `git status`, diffs e commits do período para identificar o que mudou. Inclua arquivos não rastreados relevantes. Diferencie alterações já existentes, trabalho desta sessão e origem desconhecida; não atribua automaticamente todo o diff ao trabalho do dia.

Feche a entrada iniciada ou retomada na sessão atual. Se houver entradas antigas abertas, preserve-as como **interrompido — fechamento não realizado** e registre o vínculo com a retomada; não atribua testes de hoje a dias antigos. A entrada da sessão pode ter data anterior se o trabalho atravessou a meia-noite sem um novo `start`.

Se não houve `start`, crie a entrada de fechamento com essa observação e reconstrua apenas o que as evidências sustentam. Se a data virou durante o trabalho, preserve a data de abertura e registre data/hora de fechamento sem atribuir a mudança a um dia inventado.

## Documentar e preparar a retomada

1. Confira as verificações já realizadas contra o diff atual. Execute somente as verificações relevantes que faltarem; não repita uma bateria que já passou sobre o mesmo código. Registre falhas e verificações não executadas com o motivo. Fechamento não transforma pendência em aprovação.
2. Atualize o inventário do planejamento e os estados do backlog. Marque **concluído** somente com o aceite satisfeito; código parcial ou validação externa pendente permanece **em andamento** ou **bloqueado**, conforme o impedimento.
3. Complete a entrada do dia com objetivo, alterações e arquivos, verificações/resultados, decisões, pendências, bloqueios, situação Git e primeira ação de retomada. Preserve entradas anteriores. Em um segundo `end` no mesmo dia, atualize o fechamento existente, registrando apenas novidades.
4. Atualize “Próximo início” com um pacote concreto: ID/prioridade, objetivo, primeira ação, arquivos de entrada, dependências, critérios de aceite e comandos de validação a confirmar. Continuidade incompleta tem precedência quando ainda é a próxima dependência útil. Não planeje uma integração como pronta antes de sua base.
5. Atualize documentos afetados por decisões reais para evitar divergências, mantendo o planejamento como fonte única de estado diário. Não transforme o diário em cópia do SSD. Se fontes das skills foram alteradas, registre se a instalação também foi sincronizada; não reinstale automaticamente por encerrar o dia.
6. Marque a entrada como **encerrado**, incluindo trabalho incompleto de forma explícita, e entregue resumo curto com link do planejamento, resultados e próxima ação. Não chame `start` nem comece o próximo pacote.

## Limites do fechamento

- `end` autoriza revisão, verificações pertinentes e atualização documental. Novas implementações ou refatorações identificadas no fechamento entram no plano, salvo se já estiverem autorizadas na sessão e forem necessárias para terminar a entrega corrente.
- Não fazer commit, push, merge, deploy, enviar mensagens ou alterar serviços/banco reais apenas por ser o fim do dia. Informe se as alterações ainda estão locais.
- Registre serviços locais iniciados pela sessão que continuem relevantes. Não encerre processos desconhecidos nem processos de colegas; respeite preferências anteriores para o servidor de desenvolvimento.
- Não guardar senhas, hashes de senha, tokens, conexões privadas ou dados pessoais no documento. Inclua nomes de variáveis e passos de obtenção, sem seus valores.
- Quando não houve mudança, registre isso com as verificações efetivamente feitas. Um dia sem entrega não exige inventar trabalho nem reiniciar automaticamente tarefas bloqueadas.
