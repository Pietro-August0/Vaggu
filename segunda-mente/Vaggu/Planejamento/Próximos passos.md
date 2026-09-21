# Próximos passos

Atualizado em 21/09/2026. Ordem de trabalho, sem promessa de datas.

## Antes de retomar a implementação

- [x] Revisar as alterações locais da reorganização interrompida em 10/09, preservando o trabalho existente.
- [x] Consolidar o mapa em `Vaggu/Documentação/mapa-do-projeto.md` e atualizar `AGENTS.md` para a fonte canônica.
- [x] Reconciliar configuração, README e planejamento; a referência inexistente a `ambiente-local.md` foi substituída pela configuração canônica.
- [x] Conferir runtime e conexão PostgreSQL disponíveis, sem transportar credenciais para o Obsidian.
- [x] Executar os checks exigidos pela reorganização antes de declarar sua conclusão.

## Entrega atual de produto: P05

Antes da validação de produto em outro computador, executar o roteiro Docker em [[Vaggu/Documentação/configuracao|configuração]]: validar Compose, construir imagens, subir serviços, conferir migrations, prontidão, proxy e persistência após reinício e `down`. Os arquivos estão preparados, mas os contêineres não foram executados no computador desta entrega por ausência de Docker. Depois criar o administrador e o banco de controle dedicado de teste. A execução npm permanece como alternativa.

Validar de ponta a ponta a importação CSV/XLSX da estrutura. Leitura, validação, persistência das prévias e confirmação idempotente já estão implementadas no backend e na interface; falta executar os cenários com PostgreSQL real e navegador autenticado.

Entrada: hierarquia e contratos entregues no P04, migration incremental, serviço de estrutura e interface administrativa.

Aceite: arquivo inválido não altera o banco; a prévia mostra erros por linha; a confirmação atualiza vagas identificadas sem apagar histórico nem registros ausentes. Cobrir CA13–CA14.

## Sequência preservada do backlog

| Ordem | Pacote |
| --- | --- |
| P01 | Base verificável — concluída no registro de 10/09 |
| P02 | Autenticação real do frontend — concluída em 11/09 |
| P03 | Admin, múltiplos gerentes e minha conta — concluído em 12/09 |
| P04 | Andares, setores, vagas e mapa — concluído em 12/09 |
| P05 | Importação CSV/XLSX com prévia — em andamento; validação integrada pendente |
| P06 | Telemetria, confirmação e expiração |
| P07 | Operação, manutenção e telões |
| P08 | Histórico, métricas e exportações |
| P09 | Relatório funcional Power BI |
| P10 | Contato/fluxos WhatsApp — trabalho independente com dependências externas |
| P11 | Revisão integrada para o TCC |

O estado diário técnico permanece em [[Vaggu/Documentação/planejamento-do-projeto|planejamento do projeto]], dentro da segunda mente. P04 e as melhorias de interação, gerentes e senha foram concluídos e validados com PostgreSQL real, frontend e navegador. O dia iniciado em 12/09 foi encerrado após a virada para 13/09.

## Atualização de 14/09

O P05 passou a aceitar CSV e XLSX, validar erros por linha, identificar vagas a criar ou atualizar e persistir as prévias no PostgreSQL com isolamento por shopping. A próxima ação é implementar a confirmação atômica; não há tela de importação no frontend. Ver [[Vaggu/Diário/2026-09-14]].

## Atualização de 21/09

A confirmação atômica e idempotente e a tela administrativa passaram a existir depois do registro histórico de 14/09. A retomada deve validar arquivo válido e inválido, concorrência, preservação de IDs/histórico e recarga da estrutura usando API, PostgreSQL e navegador reais.

## Histórico de 12/09

P04 entregou a hierarquia `Shopping → Andar → Setor → Vaga`, categorias, posições proporcionais, revisão concorrente e consulta isolada do gerente. Naquela data, a próxima ação era definir o contrato da importação e suas chaves de correspondência; essa etapa já foi concluída. Ver [[Vaggu/Documentação/arquitetura-estrutura-sensores-telao|arquitetura]] e [[Vaggu/Diário/2026-09-12|diário]].

## Histórico de 13/09

A troca obrigatória passou a exigir senha definitiva de 12–128 caracteres com minúscula, maiúscula, número, símbolo e sem espaços. A página mostra checklist, olhos independentes e erros por campo; a API aplica a mesma política com códigos específicos. A ação então planejada para o P05, criar contrato e parser, já foi concluída. Ver [[Vaggu/Diário/2026-09-13]].

Planejamento completo: [[Vaggu/Documentação/planejamento-do-projeto]].


## Atualização após implementação de 11/09

Autenticação integrada e testada. Mapa reconstruído e verificado; documentação de configuração reconciliada. Este registro é histórico: P02, P03 e P04 já foram concluídos. Veja [[Vaggu/Documentação/validacao-login-2026-09-11|evidências de validação]].
