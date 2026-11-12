# Revisão documental e situação do projeto — 04/11/2026

**Leitura histórica:** resultados e pendências pertencem à data registrada. Para decisões posteriores, consulte a [revisão de pendências de 09/11](planejamento-do-projeto.md#revisão-de-pendências--09112026); o aceite web de 04/11, a dispensa de backup e o recorte demonstrativo do WhatsApp prevalecem.

## Em que etapa estamos

A VAGGU está na **consolidação das evidências e preparação da apresentação do TCC (P11/E6)**. Em 04/11/2026, o usuário confirmou explicitamente que já homologou completamente o site. Esse aceite encerra a pendência web; não representa nova rodada de produção executada pelo agente, e o hash da versão testada não foi informado. O aceite físico sustentado dos sensores permanece separado.

O usuário também definiu que o WhatsApp é demonstrativo, sem necessidade de atendimento humano real. Coleta comercial e protocolos não bloqueiam a entrega. Os procedimentos de dados foram concluídos para esse recorte em [operação dos dados do TCC](operacao-dados-tcc.md).

Pelo calendário registrado, 04/11 é o início previsto da Sprint 7 (04–11/11); a Sprint 8, última, está prevista para 16–26/11. Isso não confirma início operacional, tarefas distribuídas ou responsáveis novos. As propostas abaixo não substituem o acordo da equipe.

## Base da revisão e limites

- Checkout inicial na `main`, commit `914ad62`, sem alterações locais; branch, status, diffs, histórico e scripts dos dois `package.json` conferidos.
- Revisão das fontes de produto, arquitetura, dados, configuração, aceites, planejamento, sprints, evidências, bancada e operação do WhatsApp, confrontadas com código e testes versionados.
- Fontes de execução anteriores: [revisão local de 21/10](revisao-geral-2026-10-21.md), [planejamento técnico](planejamento-do-projeto.md), [guia da bancada](../../../hardware/esp32-3-vagas/README.md) e [operação do WhatsApp](whatsapp-processo-e-operacao.md).
- Publicação `7356e12` e teste real do WhatsApp são evidências registradas em sessão anterior de 04/11, incluindo confirmação do participante. Não houve nova inspeção de Render, Meta, Neon, Figma ou Trello nesta revisão; disponibilidade atual externa não foi aferida.
- A skill de roteamento VAGGU não foi localizada no repositório, nas skills locais ou no cache de plugins pesquisado. Responsabilidades históricas permanecem como referência; nenhuma nova atribuição, aprovação ou identidade Git foi criada.
- Mudanças somente documentais: sem mudança de frontend, API, schema, credenciais ou firmware; sem publicação, mensagens ou alterações em banco. Capturas adicionais de interface são locais, com fixtures fictícias; as antigas continuam preservadas.

## Situação por pacote

| Pacote | Estado verificável | O que falta para encerrar |
| --- | --- | --- |
| P01–P05, D01 e C01 | Base, autenticação, Admin/gerentes, estrutura/mapa, importação e correções concluídos nos registros locais | Aceite web concluído conforme confirmação do usuário; capturas locais de importação/exclusões renovadas na continuidade |
| P06 — sensores | Ingestão autenticada, ordem, confirmação, expiração e isolamento implementados; bancada física de três vagas teve transições ocupado/livre registradas em 21/10 | Ensaio sustentado dos três canais; reinicialização, silêncio, retorno e mensagens atrasadas; tempos finais e fluxo HTTPS publicado comprovados |
| P07 — operação e telões | Equipamentos, vínculo, manutenção, ocorrências e telão web com credencial revogável implementados e validados localmente | Aceite web concluído conforme confirmação do usuário; instalação física continua separada se usada na entrega |
| P08 — análises e exportações | Até 31 dias UTC, comparação, setor/categoria, métricas, cobertura, snapshots novos e PDF/XLSX implementados; testes e evidências locais | Aceite web concluído conforme confirmação do usuário; preservar indicação de dados legados/parciais |
| P09 — Power BI | Views, fixtures e preparação histórica disponíveis | Relatório final, acesso, atualização e isolamento somente se a evolução opcional for adotada; não bloqueia os gráficos do site |
| P10 — WhatsApp | Número público, conexão real, menu nativo e apresentação publicados; participante confirmou imagem, site, Ver recursos e retorno | Escopo demonstrativo autorizado: operação humana, coleta e protocolo retirados do aceite. Captura real do WhatsApp indisponível sem sessão; não fabricar evidência |
| P11 — entrega integrada | Roteiro e evidências locais disponíveis; consolidação documental atualizada | Homologação web confirmada pelo usuário; preparar apresentação, preservar evidências e limites e conferir ensaio físico que for utilizado |

## Pendências em ordem de execução

| Prioridade | Ação concreta | Critério de conclusão e evidência |
| --- | --- | --- |
| Concluído | Homologação completa do site | Confirmada expressamente pelo usuário em 04/11; não reabrir como bloqueador nem atribuir ao agente uma execução em produção |
| 1 | Fechar ensaio de bancada e piloto publicado do P06 | Registrar configuração efetiva sem segredos, três sensores independentes, ocupado/livre, ausência de eco, queda de rede, reinício e retorno; contato da ESP32 não comprova seus três sensores; eventos aceitos na API pública precisam aparecer no histórico/mapa correspondente |
| Definido no recorte TCC | Proteção de dados e contingência | [Procedimentos definidos](operacao-dados-tcc.md); backup dispensado expressamente pelo usuário, sem pendência de implementação |
| Recorte definido | WhatsApp demonstrativo | Sem exigência de resposta humana, coleta comercial ou protocolo. Captura real permanece limitada à disponibilidade de sessão; a confirmação funcional anterior é preservada |
| 2 | Resolver pendência funcional dos CTAs com configuração inválida | `constants.ts` retorna URL ausente para número inválido, mas dois links da landing ainda são renderizados sem guarda; padronizar comportamento e testar vazio/inválido sem criar link inerte. A revisão documental não altera esse código |
| Evidências locais renovadas | Importação e exclusões | Capturas responsivas nos dois temas com dados fictícios; teclado e estados exercitados. Não equivalem a entrevistas ou validação das personas |
| 2 | Preparar fechamento do TCC e contingência | Ensaiar roteiro, separar dados sintéticos de físicos e publicados, registrar o que depende de rede/hardware e alinhar tarefas das Sprints 7–8 com a equipe |
| 3 | Tratar desempenho e dependências | Medir impacto do polling de 500 ms no ambiente de destino e dos chunks grandes. O registro de instalação de 28/10 reportou 17 vulnerabilidades: reavaliar severidade/alcance com auditoria atual antes de decidir correções; quantidade histórica não é diagnóstico atual |
| Opcional | Publicar Power BI | Se adotado, conferir medidas, atualização, licenciamento/distribuição e isolamento; sem publicação pública de dados privados |

## Correções documentais realizadas

- Resumos vigentes deixam de apresentar a conexão WhatsApp como adiada ou a apresentação como aguardando o teste que já foi confirmado.
- Ensaio físico inicial dos três canais é reconhecido, sem convertê-lo em homologação sustentada ou do piloto HTTPS publicado.
- Intervalos reconciliados com o código: mapa Admin/gerente usa tentativa automática a cada 500 ms, com bloqueio de renovação automática enquanto há consulta pendente e pausa em aba oculta; telão instalado usa 15 s; validade visual é 30 s. Isso não equivale à frequência de medição nem garante latência ponta a ponta.
- Confirmação padrão do servidor permanece 30 s; lacuna padrão 15 s e timeout padrão de sensor/placa 120 s. Ajustes locais de 5 s e depois 2 s pertencem ao histórico da bancada; configuração efetiva de produção não foi consultada.
- Aceite web confirmado pelo usuário e WhatsApp recortado para demonstração em 04/11; não exigir operação comercial para concluir o TCC.
- Índices, mapa, planejamento, visão de produto, arquitetura, dados, fluxo e critérios de aceite apontam para o mesmo estado. Registros antigos de testes, calendários e responsabilidades são preservados como históricos.

## Complementação de evidências e procedimentos

[Galeria complementar](../Evidências%20visuais/2026-11-04%20-%20Fechamento%20documental/README.md): 66 capturas locais de importação e exclusões, desktop/tablet/celular nos dois temas, com metadados e fixtures fictícias. A interface real WhatsApp não pôde ser capturada por ausência de sessão disponível; não foi substituída por simulação do mensageiro. Procedimentos de dados concluídos para o TCC em [operação dos dados](operacao-dados-tcc.md).

## Verificações desta revisão

Builds backend/frontend e lint frontend aprovados; o build frontend mantém aviso de chunks acima de 500 kB. Seleção de 28 testes de confirmação, configuração, contratos de telemetria, importação e métricas aprovada, sem falhas/ignorados, executada na pasta do backend. Verificador documental final aprovado com 615 arquivos cobertos e 62 Markdown com links/âncoras válidos; git diff --check aprovado. Capturas complementares: 66, sem overflow da página ou erro inesperado nos seis cenários de viewport/tema. Teste de proteção de restauração aprovado; ensaio de dump/restore não repetido (1 teste ignorado por ausência de ambiente PostgreSQL/utilitários configurados).

Resultados e comandos finais estão no [registro da revisão no planejamento](planejamento-do-projeto.md#revisão-documental-integrada--04112026). Builds e lint aferem o checkout local; não substituem navegador, suíte PostgreSQL, ensaio físico ou homologação de produção. A suíte completa de 130 testes de 21/10 continua sendo resultado histórico, não execução desta revisão.
