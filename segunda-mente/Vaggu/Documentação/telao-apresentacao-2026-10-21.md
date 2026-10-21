# Telão para apresentação — 21/10/2026

## Resultado local

O protótipo funcional usa a mesma apresentação na prévia autenticada e no telão instalado: shopping, visão geral/andar, total de vagas livres, distribuição por andar/setor e categorias PCD, idoso e elétrica. Removemos horários de atualização, avisos de dados parciais, badges de ocupação e explicações técnicas da tela apresentada. O exemplo fictício mantém a identificação de demonstração.

A apresentação ocupa `100dvh`, com tamanhos e grades adaptáveis, sem esconder transbordamento da página. Até quatro áreas aparecem por página; telas estreitas ou baixas mostram até duas. Áreas excedentes alternam automaticamente a cada oito segundos. A grade e as categorias cabem integralmente nos tamanhos verificados. O botão de tela cheia usa a API nativa do navegador; Esc encerra a apresentação. Controles ficam discretos em tela cheia, reaparecendo ao passar o mouse ou pelo foco de teclado.

Sem leitura confirmada, conexão ou consulta válida, mostramos “—”; não transformamos desconhecimento em zero nem anunciamos lotação com cobertura incompleta. As informações de monitoramento continuam no painel operacional. Nenhuma contagem histórica passa a ser disponibilidade atual.

## Escolha de tela pelo gerente

O menu **Telões** abre `/painel/teloes`. A página reúne prévias da visão geral e de cada andar, cadastro de instalações e seleção da tela apresentada em cada uma. O gerente escolhe a visão e confirma em **Salvar exibição**; a seleção pendente não altera o rótulo da configuração salva. A instalação recebe a alteração na próxima consulta, nominalmente em até 15 segundos quando visível e conectada. ID e credencial permanecem iguais, e a troca de recorte preserva o elemento em tela cheia.

O Admin mantém a configuração na estrutura do shopping e recebe o mesmo controle. Os filtros legados por setor continuam respeitados até salvar explicitamente uma visão geral/andar. A credencial aparece uma vez na emissão e não entra na URL, nos prints ou na documentação. A instalação a guarda apenas na própria aba.

As novas rotas de gerente são `GET/POST /api/v1/estacionamento/teloes` e `PATCH/DELETE /api/v1/estacionamento/teloes/:id`. O servidor obtém o shopping da sessão, rejeita instalação alheia/revogada e valida se o andar pertence ao shopping e está ativo. Um andar inexistente não amplia a consulta para o estacionamento inteiro. A edição administrativa também ganhou PATCH, sem migration adicional.

## Verificação

Ambiente: `http://127.0.0.1:5184`, Edge headless com Playwright porque o plugin Browser não está disponível; Express e PostgreSQL locais reais, com cluster exclusivo e dados fictícios do Shopping Exemplo. Nenhuma API foi interceptada. A fotografia do exemplo usa timeout ampliado somente no processo de QA; isso não altera as regras operacionais versionadas.

| Conferência | Resultado |
| --- | --- |
| Backend build e testes focados | Build aprovado; quatro testes aprovados, sem falhas ou ignorados, incluindo PostgreSQL e autorização HTTP. |
| Frontend build e lint | Aprovados; permanece o aviso conhecido de chunks acima de 500 kB. |
| Apresentação sem rolagem/cortes | Conferida em 1920×1080, 1366×768, 1024×600, 768×1024, 390×844, 320×568 e 844×390. Dimensões da página e limites dos blocos/números comparados à janela. |
| Tela cheia e Esc | Entrada pelo botão, permanência após troca remota de andar, saída por Esc e retorno ao layout normal aprovados. |
| Gestão e persistência | Lista, seleção pendente, salvamento, atualização da tela instalada, criação, ocultação da emissão e revogação exercitados. |
| Isolamento e credenciais | Testes recusam recortes alheios/inativos e instalações alheias/revogadas; PATCH preserva a credencial/hash. |
| Ausência de dados/conexão | Offline oculta todas as contagens; reconexão recupera consulta. Andar inexistente mantém “—” sem listar outros andares. |
| Muitos andares | Sete andares reais no banco de QA: alternância de páginas observada sem rolagem. Andares adicionais vazios permanecem “—”. |
| Gestão responsiva | Desktop 1440×1000, tablet 768×1024 e celular 390×844; temas claro e escuro, sem transbordamento horizontal. A gestão pode rolar; a apresentação não. |
| Renderização | Conteúdo significativo, ausência de overlay e de erros inesperados de console/HTTP. Os 401 de sessão antes da autorização e os eventos de rede offline são esperados. |

Os quatro testes focados não representam nova execução da suíte completa de 130 testes registrada na revisão geral anterior. Hardware físico, resolução e navegador de cada televisão, funcionamento em produção e navegadores sem suporte à API Fullscreen seguem fora desta rodada. Sem suporte, a interface orienta usar a opção do navegador.

## Evidências e entrega

As 20 capturas estão no [índice de evidências](../Evidências%20visuais/Índice%20de%20evidências.md#21102026--telão-para-apresentação), com perfil, rota, viewport e origem. A imagem do telão no README foi atualizada; as anteriores permanecem como histórico.

Trabalho local na branch `codex/feat/telao-apresentacao-elisa`, base `1b7ae6fb`, com identidade Git mantida em Elisa. Revisão estática independente não apontou bloqueadores. Não houve commit, push ou publicação desta entrega. O ambiente descartável e as credenciais de QA são removidos após a conferência.


## Ajustes após a conferência local

Ampliamos os números por andar/setor e centralizamos título, número e “livres” em cada card. Incluímos “Excluir telão” para cadastros ativos e revogados, com confirmação. A exclusão remove definitivamente o cadastro e invalida a credencial; a revogação continua preservando o cadastro.

Novos contratos: `DELETE /estacionamento/teloes/:id/cadastro` e `DELETE /shoppings/:shoppingId/teloes/:id/cadastro`. O primeiro usa o shopping da sessão e o segundo exige Admin VAGGU. O serviço exclui por ID e shopping juntos, recusando cadastro alheio ou inexistente com 404. A edição da própria conta habilita salvar somente quando nome ou telefone diferem dos valores atuais após remover espaços nas bordas; o submit também protege contra envio sem mudança.

Conferimos com API e PostgreSQL reais locais: salvar conta, espaços sem mudança, botão após sucesso, cancelar e confirmar exclusão de ativos e revogados e apresentação em seis resoluções. Removemos somente os registros temporários criados para esta conferência. Builds frontend/backend e lint aprovados. Testes focados: três aprovados; o teste de banco descartável ficou ignorado nesta rodada por ausência de TEST_DATABASE_URL. A exclusão foi exercitada no PostgreSQL local pelo navegador. As 14 novas capturas estão no índice de evidências e o README usa a imagem atual dos cards. Não houve commit ou push.
