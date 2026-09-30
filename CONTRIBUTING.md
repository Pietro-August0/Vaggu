# Como contribuir com a VAGGU

Este guia reúne os acordos de trabalho da equipe. A segunda mente em `segunda-mente/Vaggu` é a fonte principal para produto, decisões, planejamento e continuidade.

## Antes de alterar

1. Leia `segunda-mente/Vaggu/Vaggu.md` e os documentos indicados para a tarefa.
2. Confira a branch atual, `git status`, scripts do projeto e arquivos relacionados.
3. Preserve alterações de outras pessoas e prefira mudanças pequenas e fáceis de revisar.
4. Não troque arquitetura, bibliotecas ou contratos sem necessidade demonstrada.

## Produto

- A VAGGU é um site responsivo para estacionamentos de shoppings; não é aplicativo nativo.
- A landing direciona ao WhatsApp. A equipe conduz reunião, parceria e criação dos acessos.
- Cada gerente possui login próprio e vê somente o shopping ao qual pertence.
- O mapa permite navegar entre andares, filtrar e selecionar vagas.
- Tipos de vaga: comum, PCD, idoso e elétrica. Estados: livre, ocupada e indisponível.
- Dado antigo ou desconhecido nunca pode aparecer como vaga livre.
- Placa significa o controlador ESP32. O contato da placa não comprova que todos os sensores funcionam.
- Histórico, arquivos, atualizações e análises devem manter os shoppings separados.
- Não fazem parte do escopo: lotes, reservas, pagamentos, reconhecimento de veículos, motos e navegação 3D.

## Código e interface

- Escreva documentação, comentários, mensagens e nomes do domínio em português brasileiro.
- Use nomes claros, funções curtas e responsabilidades bem separadas.
- Valide dados ao entrar no sistema e mantenha as regras de permissão no servidor.
- Nunca envie senhas, hashes, chaves de placas ou conexão do banco para a interface ou relatórios.
- Crie mudanças incrementais no banco e nunca apague um banco real para facilitar uma atualização.
- Preserve a identidade amarela e escura da VAGGU, a responsividade, o foco visível e a navegação por teclado.
- Diferencie carregamento, vazio, erro, sucesso e dados desatualizados sem inventar números.

## Documentação

Ao mudar comportamento, contrato, caminho ou responsabilidade de um arquivo:

- atualize o documento de produto afetado;
- revise a descrição correspondente em `segunda-mente/Vaggu/Documentação/mapa-do-projeto.md`;
- registre no planejamento o que foi feito, como foi conferido e o que ainda falta;
- execute `node scripts/verificar-documentacao.mjs` antes de concluir.

## Verificação e Git

- Descubra os comandos reais em `package.json`; não presuma scripts inexistentes.
- Execute verificações proporcionais ao risco: compilação, lint, testes, banco e navegador quando aplicável.
- Em mudanças visuais, confira computador, tablet e celular, teclado e ausência de conteúdo cortado.
- Antes de commit ou publicação, revise status, diff, branch, arquivos acidentais e possíveis segredos.
- Não use force-push, hard reset, limpeza ampla ou outra ação destrutiva sem garantir que nenhum trabalho será perdido.
- Commits e pull requests devem explicar o objetivo, a mudança, a validação e as limitações reais.
