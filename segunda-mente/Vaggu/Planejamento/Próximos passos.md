# Próximos passos

Atualizado em 30/09/2026. Esta é a ordem de trabalho, sem promessa de datas.

As sprints históricas da equipe e sua diferença em relação aos pacotes técnicos estão em [[Vaggu/Planejamento/Sprints do projeto]]. A ordem executável das correções está em [[Vaggu/Planejamento/Plano de correção e implementação]].

## Consolidação documental concluída em 23/09

Antes de abrir o P06, a equipe corrigiu as divergências documentais encontradas na auditoria de 23/09:

- registrar as Sprints 1 e 2 como descoberta, definição da ideia e planejamento inicial do Figma;
- transcrever as evidências reais das Sprints 3 e 4;
- consolidar PRD, TRD, fluxo de telas, modelo de dados e contratos atuais;
- separar claramente funcionalidade implementada, registro histórico e planejamento futuro;
- registrar a identidade visual fornecida pela equipe sem apresentá-la como nova extração do Figma;
- preparar a rastreabilidade e a divisão da próxima sprint sem inventar datas.

O D01 e o C01 foram concluídos com documentação e contratos reconciliados. A ficha atual voltou a oferecer exclusão lógica de gerente, sete segundos para desfazer e exclusão lógica de shopping.

## Antes de retomar a implementação

- [x] Revisar as alterações locais da reorganização interrompida em 10/09, preservando o trabalho existente.
- [x] Consolidar o mapa em `Vaggu/Documentação/mapa-do-projeto.md` e apontar o guia de contribuição para a fonte canônica.
- [x] Reconciliar configuração, README e planejamento; a referência inexistente a `ambiente-local.md` foi substituída pela configuração canônica.
- [x] Conferir runtime e conexão PostgreSQL disponíveis, sem transportar credenciais para o Obsidian.
- [x] Executar os checks exigidos pela reorganização antes de declarar sua conclusão.

## Correção concluída: C01

A ficha administrativa foi reconciliada com os contratos reais: exclusão lógica de gerente, desfazer por sete segundos e exclusão lógica de shopping. Frontend e integração PostgreSQL foram aprovados; falta apenas substituir as capturas históricas por novas evidências visuais autenticadas.

## Trabalho atual: concluir o P06

A base que recebe as leituras dos sensores já foi criada e testada com PostgreSQL. Ela reconhece a placa, mantém a ordem das mensagens, evita repetições, espera leituras consistentes e torna indisponível a vaga cujo sensor parou de responder.

Para concluir o pacote, a equipe precisa testar com o ESP32 real, definir os tempos finais, criar a gestão de equipamentos e manutenção e fazer o mapa considerar a validade de cada sensor. Uma leitura isolada ou o simples contato da placa não podem tornar uma vaga livre.

Os cenários completos continuam em CA15–CA24. A parte de PostgreSQL foi aprovada; hardware e fluxo operacional ainda precisam de evidência.

## Trabalho já iniciado depois do P06

O histórico confirmado e a análise dos últimos sete dias já funcionam no sistema quando existem leituras. Sem histórico, o painel mostra uma demonstração identificada. Essa entrega adianta uma parte do P08, mas ainda faltam exportações, métricas complementares e a conferência completa do fluxo. A preparação dos dados para Power BI também existe, porém o relatório funcional ainda não foi entregue.

## Sequência preservada do backlog

| Ordem | Pacote |
| --- | --- |
| P01 | Base verificável — concluída no registro de 10/09 |
| P02 | Autenticação real do frontend — concluída em 11/09 |
| P03 | Admin, múltiplos gerentes e minha conta — concluído em 12/09 |
| P04 | Andares, setores, vagas e mapa — concluído em 12/09 |
| P05 | Importação CSV/XLSX com prévia — concluída em 21/09 |
| C01 | Correções da interface administrativa — concluídas em 23/09 |
| P06 | Sensores, confirmação e expiração — em andamento; base e testes PostgreSQL prontos |
| P07 | Operação, manutenção e telões |
| P08 | Histórico, métricas e exportações — iniciado; histórico e painel parcial prontos |
| P09 | Relatório funcional Power BI — dados preparados, relatório pendente |
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
