# Próximos passos

**Fechamento de 24/10/2026:** concluída a revisão visual e de carregamento das análises, com categorias no topo, estados de consulta, recuperação de falhas e novas evidências locais. Continuidade: homologação publicada com API/banco reais, conferência da integração com a main e validação de latências reais. O aviso de bundles grandes continua aberto. Ver [[Vaggu/Diário/2026-10-24|fechamento e verificações]].

**Revisão local concluída em 21/10/2026:** 130 testes do backend aprovados; análise com filtros, estado sem observação, exportações e responsividade conferidos com API e PostgreSQL descartável reais, além de novas capturas de mapa, monitoramento, editor, administração e telão. Ver [[Vaggu/Documentação/revisao-geral-2026-10-21]]. A continuidade se concentra na homologação publicada, decisões operacionais de backup e validação com públicos/hardware, respeitando o adiamento do WhatsApp real. Sprint 7: 04/11–11/11/2026; Sprint 8, última: 16/11–26/11/2026, sem distribuição automática de tarefas.

## Atualização de 21/10/2026 — oportunidades das personas

Os itens históricos abaixo devem ser lidos com o estado local atualizado em [[Vaggu/Documentação/conclusao-software-2026-10-19]]. A análise já oferece período, setor, categoria, entradas, saídas, permanência e rotatividade; os telões instalados e a operação de equipamentos também têm implementação local. A integração Power BI publicada é opcional e adiamos a conexão real do WhatsApp.

1. **Alta prioridade, baixo esforço — linguagem de ausência/parcialidade:** conferir, em análise, exportações e telão, se dados ausentes ou parciais são identificáveis por texto e não apenas cor. Aceite: ausência nunca aparece como zero; contagem parcial permanece explícita em desktop, tablet e celular.
2. **Alta prioridade, médio esforço — identificação operacional:** validar com operadores a localização de placa, sensor, vaga e ocorrência a partir de um identificador físico. Aceite: um caso controlado conduz à ocorrência correta sem expor outra unidade nem criar novo perfil de acesso.
3. **Média prioridade, médio esforço — contexto da exportação:** testar os arquivos de Carlos com recortes variados. Aceite: período, setor, categoria e condição de cobertura ficam claros em PDF e Excel, inclusive quando não há observação.

Essas propostas vêm de hipóteses de persona, não de entrevistas ou aprovação visual interna. A ligação física do hardware e a homologação em produção seguem etapas próprias.

Atualizado em 21/10/2026. Esta é a ordem de trabalho, sem promessa de datas.

As nossas sprints históricas e sua diferença em relação aos pacotes técnicos estão em [[Vaggu/Planejamento/Sprints do projeto]]. A ordem executável das correções está em [[Vaggu/Planejamento/Plano de correção e implementação]].

## Consolidação documental concluída em 23/09

Antes de abrir o P06, corrigimos as divergências documentais encontradas na auditoria de 23/09:

- registrar as Sprints 1 e 2 como descoberta, definição da ideia e planejamento inicial do Figma;
- transcrever as evidências reais das Sprints 3 e 4;
- consolidar PRD, TRD, fluxo de telas, modelo de dados e contratos atuais;
- separar claramente funcionalidade implementada, registro histórico e planejamento futuro;
- registrar a identidade visual de referência do projeto sem apresentá-la como nova extração do Figma;
- preparar a rastreabilidade e a divisão da próxima sprint sem inventar datas.

O D01 e o C01 foram concluídos com documentação e contratos reconciliados. A ficha atual voltou a oferecer exclusão lógica de gerente, sete segundos para desfazer e exclusão lógica de shopping.

## Antes de retomar a implementação

- [x] Revisar as alterações locais da reorganização interrompida em 10/09, preservando o trabalho existente.
- [x] Consolidar o mapa em `Vaggu/Documentação/mapa-do-projeto.md` e apontar o guia de contribuição para a fonte canônica.
- [x] Reconciliar configuração, README e planejamento; a referência inexistente a `ambiente-local.md` foi substituída pela configuração canônica.
- [x] Conferir runtime e conexão PostgreSQL disponíveis, sem transportar credenciais para o Obsidian.
- [x] Executar os checks exigidos pela reorganização antes de declarar sua conclusão.

## Correção concluída: C01

A ficha administrativa foi reconciliada com os contratos reais: exclusão lógica de gerente, desfazer por sete segundos e exclusão lógica de shopping. Frontend e integração PostgreSQL foram aprovados; as capturas autenticadas de editor, mapa, monitoramento e análise estão na galeria de 15/10. Exclusões, importação e outros fluxos mantêm evidências históricas e precisam de nova captura específica.

## Trabalho atual: concluir o P06

A base que recebe as leituras dos sensores já foi criada e testada com PostgreSQL. Ela reconhece a placa, mantém a ordem das mensagens, evita repetições, espera leituras consistentes e torna indisponível a vaga cujo sensor parou de responder.

Para concluir o pacote, precisamos testar com o ESP32 real, definir os tempos finais e homologar o fluxo no ambiente publicado. Cadastro/vínculo operacional de equipamentos, manutenção/ocorrências e atualização periódica das leituras já existem no software. A validade por sensor já é aplicada quando a estrutura é consultada; o monitoramento individual e o editor visual estão entregues. Uma leitura isolada ou o simples contato da placa não podem tornar uma vaga livre.

Os cenários completos continuam em CA15–CA24. A parte de PostgreSQL foi aprovada; o hardware e a homologação publicada do fluxo operacional ainda precisam de evidência.

## Trabalho já iniciado depois do P06

O histórico confirmado e a análise por período de até 31 dias UTC estão implementados, com padrão dos últimos sete dias, comparação anterior, setor/categoria, entradas, saídas, permanência, rotatividade e cobertura. Sem medições no filtro, a tela apresenta estado vazio; o Shopping Exemplo mantém dados sintéticos identificados. Excel/PDF levam período e contexto do recorte. Novos eventos preservam a classificação histórica; registros legados sem fotografia confirmada continuam sinalizados. A preparação dos dados para Power BI existe; relatório/publicação é evolução opcional. O próximo passo é conferir esses fluxos no ambiente publicado com dados conhecidos e registrar evidências, sem transformar o código local em comprovação de produção.

## Sequência preservada do backlog

| Ordem | Pacote |
| --- | --- |
| P01 | Base verificável — concluída no registro de 10/09 |
| P02 | Autenticação real do frontend — concluída em 11/09 |
| P03 | Admin, múltiplos gerentes e minha conta — concluído em 12/09 |
| P04 | Andares, setores, vagas e mapa — concluído em 12/09 |
| P05 | Importação CSV/XLSX com prévia — concluída em 21/09 |
| C01 | Correções da interface administrativa — concluídas em 23/09 |
| P06 | Sensores, confirmação, expiração e cadastro/vínculo implementados; ensaio físico e homologação pendentes |
| P07 | Operação, manutenção/ocorrências e telões com credencial própria implementados localmente; homologação pendente |
| P08 | Histórico, período/comparação, setor/categoria, métricas, cobertura e Excel/PDF implementados; fotografia nos novos eventos e limites legados identificados; homologação pendente |
| P09 | Dados preparados; relatório/publicação Power BI como evolução opcional |
| P10 | Conexão real do WhatsApp adiada; retomada depende de número e ambiente Meta |
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


## Calendário do projeto corrigido em 19/10/2026

O [registro das sprints](Sprints%20do%20projeto.md) passa a usar as quatro fotos recebidas em 19/10: Sprint 3 em 09–16/09, Sprint 4 em 23–30/09, Sprint 5 em 05–19/10 e Sprint 6 em 19–28/10. A Sprint 6 registra gerenciamento, apresentação do TCC, documentação e integração do WhatsApp, além da conexão física de hardware fora do escopo atual. A ordem técnica continua subordinada às dependências e verificações descritas em [Conclusão do software](Conclus%C3%A3o%20do%20software.md). Não inferir conclusão ou novas datas pelo encerramento de uma sprint.
