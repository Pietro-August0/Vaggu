# Conclusão do software

> **Fechamento local de 21/10/2026:** a suíte completa aprovou **130 testes**, zero falhas e zero ignorados, com PostgreSQL descartável e dump/restauração. Build e lint do frontend passaram. A rodada no navegador com API e banco reais locais conferiu filtros, estados sem observação, exportações, análise em desktop/tablet/celular, monitoramento e telão. O corte das categorias no telão foi corrigido e documentado com novos prints. Os resultados 127/129 abaixo são históricos. Power BI publicado permanece opcional; WhatsApp real, hardware físico e homologação publicada seguem etapas próprias. Ver [[Vaggu/Documentação/revisao-geral-2026-10-21]].

Iniciado em 19/10/2026, por solicitação de concluir as pendências sem a conexão física do hardware, em etapas das menores para as maiores.

## Contexto

- Branch local: `feat/conclusao-software-pietro`, criada da `origin/main` em `69692606`.
- Checkout isolado para preservar alterações locais da landing na pasta original.
- Responsável técnico indicado: Pietro. Revisores indicados: Elisa (UX/QA), Samuel (dados), Kamilly (backend), Juan (visual) e Ana (documentação). Isso não atribui autoria de commits a quem não participou.
- Os achados de 15/10 são a referência inicial, não prova do estado da versão publicada.

## Sequência e aceite

| Etapa | Entrega | Critério de encerramento | Estado |
| --- | --- | --- | --- |
| 1 | Renovação explícita do cenário de apresentação | Prévia sem escrita; aplicação apenas no exemplo; IDs e acessos preservados; execução repetida segura | Implementado localmente; validação em andamento |
| 2 | Estados vazios e proteção de edição | Nenhuma métrica genérica substitui falta de histórico; saída do editor alerta sobre rascunho | Implementado localmente; validação em andamento |
| 3 | Atualização de mapa, monitoramento e telão | Consulta periódica sem sobreposição, retorno da conexão, invalidação de dado antigo e atualização manual | Implementado localmente; validação em andamento |
| 4 | Análise e relatórios | Cobertura zero não vira ocupação zero; filtros de setor/categoria; saídas, permanência e rotatividade com regras verificáveis | Implementado localmente; validação em andamento |
| 5 | Preservação histórica | Alterações futuras do cadastro não reclassificam eventos anteriores; limites dos registros legados explícitos | Implementado localmente; validação em andamento |
| 6 | Equipamentos e manutenção | Cadastro, vínculo, chave protegida, ocorrência e fechamento com isolamento por shopping | Implementado localmente; validação em andamento |
| 7 | Telões instalados | Recorte administrativo e credencial própria; somente agregados públicos autorizados | Implementado localmente; validação em andamento |
| 8 | Power BI e WhatsApp | Artefatos/fluxos reproduzíveis; configuração externa e homologação comprovadas | WhatsApp implementado localmente; validação em andamento. Power BI e homologação externa pendentes |
| 9 | Entrega integrada | Testes, navegador, documentação e validação autenticada do ambiente publicado | Documentação, 127 testes backend, build e lint frontend aprovados localmente; telão verificado com API interceptada; demais jornadas e produção não homologadas |

## Registro de retomada

- A revisão inicial foi somente de código e documentação; não houve homologação de produção.
- Três agentes foram interrompidos por limite de uso. Os arquivos parciais foram preservados; nenhum deles é considerado concluído sem revisão e testes.
- A primeira instalação de dependências falhou por rede restrita. Nova instalação solicitada pelo mecanismo de permissões para executar as verificações locais.

## Dependências externas

Publicação no Power BI, homologação Meta e testes autenticados em produção dependem dos acessos reais disponíveis. Preparar e testar código localmente não encerra esses aceites. Nenhuma migration deve ser executada em banco real durante os testes locais.


## Retomada de 19/10 — implementação local

Foram implementadas as etapas 1–7 e a proteção de envio incerto/respostas de orientação do WhatsApp. Isso registra presença de código; os aceites só serão encerrados após resultados finais das verificações. A cobertura de navegador e os resultados locais estão registrados abaixo; não há homologação de produção.

O [registro técnico](../Documenta%C3%A7%C3%A3o/conclusao-software-2026-10-19.md) documenta endpoints, regras de métricas, snapshots legados, manutenção, telões, estados ENVIANDO/REVISAO e comandos de renovação em prévia/aplicação. O mapa registra os arquivos novos e sua responsabilidade. As migrações são artefatos locais e não representam alteração no banco publicado.

A revisão do calendário incorporou as fotos e responsáveis das Sprints 3–6; a regra passou a usar durações reais variáveis, sem retrocálculo. Sprint 1 e Sprint 2 preservam somente o relato fornecido. Ver [Sprints do projeto](Sprints%20do%20projeto.md).


## Verificações locais confirmadas em 19/10

- Backend: 127 testes passaram, zero falhas e zero ignorados; PostgreSQL descartável em `127.0.0.1:55439`, com todas as migrações.
- Frontend: build aprovado e lint aprovado sem avisos.
- Documentação: verificador aprovado, com 313 arquivos cobertos e 50 documentos Markdown com links/âncoras locais válidos.
- Navegador: telão aprovado em Edge headless, desktop 1366×900 e mobile 390×844, com fixture de API interceptada. Quatro livres/parcial após autorização; offline oculta contagens; zero pageerrors e overflow mobile. Isso não comprova integração ponta a ponta. Editor e analítico ainda não verificados no navegador.
- Produção, Meta e Power BI continuam com aceites externos em aberto.

- Revisão final: códigos compatíveis com telemetria, ocorrências abertas sempre acessíveis e cobertura estimada indisponível quando incompatível com capacidade atual. Editor passou no navegador com fixture; homologação externa continua pendente por falta de dados autorizados nesta etapa.

- Escopo esclarecido: Power BI foi usado para projetar gráficos; integração publicada é opcional. WhatsApp autorizado para conexão, mas número ainda sem configuração e função remetente/destinatário a confirmar. Não confundir autorização com conexão concluída.
