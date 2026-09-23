# Próximos passos

Atualizado em 23/09/2026. Ordem de trabalho, sem promessa de datas.

As sprints históricas da equipe e sua diferença em relação aos pacotes técnicos estão em [[Vaggu/Planejamento/Sprints do projeto]]. A ordem executável das correções está em [[Vaggu/Planejamento/Plano de correção e implementação]].

## Consolidação documental concluída em 23/09

Antes de abrir o P06, a equipe corrigiu as divergências documentais encontradas na auditoria de 23/09:

- registrar as Sprints 1 e 2 como descoberta, definição da ideia e planejamento inicial do Figma;
- transcrever as evidências reais das Sprints 3 e 4;
- consolidar PRD, TRD, fluxo de telas, modelo de dados e contratos atuais;
- separar claramente funcionalidade implementada, registro histórico e planejamento futuro;
- registrar a identidade visual fornecida pela equipe sem apresentá-la como nova extração do Figma;
- preparar a rastreabilidade e a divisão da próxima sprint sem inventar datas.

O D01 foi concluído com o verificador documental aprovado. A implementação atual passa ao C01: revalidar e restaurar na interface os fluxos administrativos de exclusão e desfazer já suportados pelo backend, além dos ajustes de clareza e acessibilidade descritos no plano.

## Antes de retomar a implementação

- [x] Revisar as alterações locais da reorganização interrompida em 10/09, preservando o trabalho existente.
- [x] Consolidar o mapa em `Vaggu/Documentação/mapa-do-projeto.md` e atualizar `AGENTS.md` para a fonte canônica.
- [x] Reconciliar configuração, README e planejamento; a referência inexistente a `ambiente-local.md` foi substituída pela configuração canônica.
- [x] Conferir runtime e conexão PostgreSQL disponíveis, sem transportar credenciais para o Obsidian.
- [x] Executar os checks exigidos pela reorganização antes de declarar sua conclusão.

## Próxima correção: C01

Reconciliar a ficha administrativa com os contratos reais: exclusão lógica de gerente, desfazer por sete segundos e exclusão lógica de shopping. A validação inclui desktop, celular, teclado, estados de erro/sucesso, lint e build.

## Próxima entrega de produto após C01: P06

Implementar a base confiável de telemetria para placas ESP32 e sensores, preservando o isolamento por shopping e o histórico operacional.

Entrada: estrutura e importação concluídas no P04–P05, entidades iniciais de placa/sensor e decisões registradas na arquitetura de sensores e telões.

Aceite: autenticar a origem, rejeitar vínculos de outro shopping, deduplicar e ordenar eventos, confirmar mudanças somente após 30 segundos consistentes e nunca converter dado expirado em vaga livre. Cobrir CA15–CA24.

## Sequência preservada do backlog

| Ordem | Pacote |
| --- | --- |
| P01 | Base verificável — concluída no registro de 10/09 |
| P02 | Autenticação real do frontend — concluída em 11/09 |
| P03 | Admin, múltiplos gerentes e minha conta — concluído em 12/09 |
| P04 | Andares, setores, vagas e mapa — concluído em 12/09 |
| P05 | Importação CSV/XLSX com prévia — concluída em 21/09 |
| C01 | Correções da interface administrativa — próxima implementação |
| P06 | Telemetria, confirmação e expiração — próxima entrega de produto após C01 |
| P07 | Operação, manutenção e telões |
| P08 | Histórico, métricas e exportações |
| P09 | Relatório funcional Power BI |
| P10 | Contato/fluxos WhatsApp — trabalho independente com dependências externas |
| P11 | Revisão integrada para o TCC |

O estado diário técnico permanece em [[Vaggu/Documentação/planejamento-do-projeto|planejamento do projeto]], dentro da segunda mente. P04 e as melhorias de interação, gerentes e senha foram concluídos e validados com PostgreSQL real, frontend e navegador. O dia iniciado em 12/09 foi encerrado após a virada para 13/09.

## Registro histórico de 14/09 — substituído pela atualização de 21/09

Naquele momento, o P05 aceitava CSV e XLSX, validava erros por linha, identificava vagas a criar ou atualizar e persistia as prévias no PostgreSQL com isolamento por shopping. A confirmação atômica e a tela ainda não existiam em 14/09. Esse estado foi substituído pela conclusão registrada em 21/09. Ver [[Vaggu/Diário/2026-09-14]].

## Atualização de 21/09

A confirmação atômica e idempotente foi validada em PostgreSQL descartável, inclusive com duas requisições concorrentes. A jornada Admin autenticada cobriu arquivo inválido, arquivo válido, confirmação e recarga da estrutura em desktop e viewport móvel. P05 foi concluído naquela retomada; a auditoria posterior de 23/09 inseriu C01 antes do contrato de telemetria do P06.

## Histórico de 12/09

P04 entregou a hierarquia `Shopping → Andar → Setor → Vaga`, categorias, posições proporcionais, revisão concorrente e consulta isolada do gerente. Naquela data, a próxima ação era definir o contrato da importação e suas chaves de correspondência; essa etapa já foi concluída. Ver [[Vaggu/Documentação/arquitetura-estrutura-sensores-telao|arquitetura]] e [[Vaggu/Diário/2026-09-12|diário]].

## Histórico de 13/09

A troca obrigatória passou a exigir senha definitiva de 12–128 caracteres com minúscula, maiúscula, número, símbolo e sem espaços. A página mostra checklist, olhos independentes e erros por campo; a API aplica a mesma política com códigos específicos. A ação então planejada para o P05, criar contrato e parser, já foi concluída. Ver [[Vaggu/Diário/2026-09-13]].

Planejamento completo: [[Vaggu/Documentação/planejamento-do-projeto]].


## Atualização após implementação de 11/09

Autenticação integrada e testada. Mapa reconstruído e verificado; documentação de configuração reconciliada. Este registro é histórico: P02, P03 e P04 já foram concluídos. Veja [[Vaggu/Documentação/validacao-login-2026-09-11|evidências de validação]].
