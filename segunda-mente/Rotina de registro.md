# Rotina de registro

Definida por Pietro em 11/09/2026, fuso America/Sao_Paulo.

1. Registrar assuntos discutidos, ideias, decisões, alterações, verificações e pendências em `Atualizações diárias/AAAA-MM-DD.md`.
2. Para assuntos da VAGGU, acrescentar os detalhes em `Vaggu/Diário/AAAA-MM-DD.md` e ligar as duas notas.
3. Atualizar a nota temática afetada quando uma decisão mudar. Preservar a decisão anterior no histórico, explicando sua substituição.
4. Em código, registrar arquivos e verificações reais. Testes de outra sessão são evidência histórica, não validação da alteração atual.
5. Separar fatos confirmados, propostas, dúvidas e trabalho pendente. Não inventar conteúdo de anexos inacessíveis.
6. Acrescentar ao registro do dia, sem apagar anotações manuais nem duplicar blocos já salvos.
7. Guardar artigos em Artigos, com título, autoria, fonte, data, resumo e vínculo ao projeto. Guardar novas ideias em Ideias antes de decidir seu destino.
8. Não copiar senhas, tokens, arquivos .env ou links de convite com segredo.

## Como a continuidade funciona

As instruções em `AGENTS.md`, na raiz do repositório VAGGU, orientam agentes que trabalham nesta árvore de pastas a manter estes registros. A execução acontece durante as sessões em que essas instruções forem carregadas e houver acesso ao cofre.

Isso não captura automaticamente todas as conversas de ChatGPT ou tarefas em outros computadores. Históricos só são importados quando acessíveis. O registro diário é uma síntese fiel do conteúdo e das ações; transcrições recuperadas ficam em Fontes.

A segunda mente dentro do repositório é a fonte canônica de produto, decisões, documentação e continuidade. As skills `start` e `end` continuam a controlar o dia técnico no planejamento canônico em `Vaggu/Documentação`; os diários preservam o histórico sem criar outra versão das decisões atuais.
