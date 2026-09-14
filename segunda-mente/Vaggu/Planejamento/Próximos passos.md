# Próximos passos

Atualizado em 13/09/2026. Ordem de trabalho, sem promessa de datas.

## Antes de retomar a implementação

- [x] Revisar as alterações locais da reorganização interrompida em 10/09, preservando o trabalho existente.
- [x] Consolidar o mapa em `Vaggu/Documentação/mapa-do-projeto.md` e atualizar `AGENTS.md` para a fonte canônica.
- [x] Reconciliar configuração, README e planejamento; a referência inexistente a `ambiente-local.md` foi substituída pela configuração canônica.
- [ ] Conferir runtime e conexão PostgreSQL disponíveis, sem transportar credenciais para o Obsidian.
- [ ] Executar os checks exigidos pela reorganização antes de declarar sua conclusão.

## Próxima entrega de produto: P05

Implementar importação CSV/XLSX da estrutura com prévia, erros por linha e confirmação atômica, preservando IDs e histórico.

Entrada: hierarquia e contratos entregues no P04, migration incremental, serviço de estrutura e interface administrativa.

Aceite: arquivo inválido não altera o banco; a prévia mostra erros por linha; a confirmação atualiza vagas identificadas sem apagar histórico nem registros ausentes. Cobrir CA13–CA14.

## Sequência preservada do backlog

| Ordem | Pacote |
| --- | --- |
| P01 | Base verificável — concluída no registro de 10/09 |
| P02 | Autenticação real do frontend — concluída em 11/09 |
| P03 | Admin, múltiplos gerentes e minha conta — concluído em 12/09 |
| P04 | Andares, setores, vagas e mapa — concluído em 12/09 |
| P05 | Importação CSV/XLSX com prévia |
| P06 | Telemetria, confirmação e expiração |
| P07 | Operação, manutenção e telões |
| P08 | Histórico, métricas e exportações |
| P09 | Relatório funcional Power BI |
| P10 | Contato/fluxos WhatsApp — trabalho independente com dependências externas |
| P11 | Revisão integrada para o TCC |

O estado diário técnico permanece em [[Vaggu/Documentação/planejamento-do-projeto|planejamento do projeto]], dentro da segunda mente. P04 e as melhorias de interação, gerentes e senha foram concluídos e validados com PostgreSQL real, frontend e navegador. O dia iniciado em 12/09 foi encerrado após a virada para 13/09.

## Atualização de 12/09

P04 entregou a hierarquia `Shopping → Andar → Setor → Vaga`, categorias, posições proporcionais, revisão concorrente e consulta isolada do gerente. Próxima ação: definir o contrato da importação e suas chaves de correspondência antes de gravar dados. Ver [[Vaggu/Documentação/arquitetura-estrutura-sensores-telao|arquitetura]] e [[Vaggu/Diário/2026-09-12|diário]].

## Atualização de 13/09

A troca obrigatória agora exige senha definitiva de 12–128 caracteres com minúscula, maiúscula, número, símbolo e sem espaços. A página mostra checklist, olhos independentes e erros por campo; a API aplica a mesma política com códigos específicos. Próxima ação do P05: criar os tipos do contrato e o parser de prévia CSV sem persistência, preparando XLSX sobre a mesma representação. Ver [[Vaggu/Diário/2026-09-13]].

Planejamento completo: [[Vaggu/Documentação/planejamento-do-projeto]].


## Atualização após implementação de 11/09

Autenticação integrada e testada. Mapa reconstruído e verificado; documentação de configuração reconciliada. Este registro é histórico: P02, P03 e P04 já foram concluídos. Veja [[Vaggu/Documentação/validacao-login-2026-09-11|evidências de validação]].
