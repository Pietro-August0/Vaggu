# VAGGU — plano de implementação e critérios de aceite

Versão 1.0 • 09/09/2026

Este plano organiza dependências e evidências. Não é um registro de funcionalidades já concluídas. Cada etapa deve ser conciliada com o código existente; não recriar o que estiver implementado e validado.

## 1. Diagnóstico inicial do Codex

Inspecionar repositório, instruções locais, scripts, dependências, schema, migrations, autenticação, frontend, serviços, hardware disponível e testes. Produzir uma tabela com requisito, estado e evidência:

| Classificação | Evidência exigida |
| --- | --- |
| Implementado e verificado | Código localizado e comportamento conferido por execução/teste adequado. |
| Parcial | Parte existe, com comportamento faltante identificado. |
| Ausente | Inspeção do escopo relevante não encontrou implementação correspondente. |
| Não verificado | Acesso, execução ou evidência insuficiente. |

Não usar “concluído” porque uma tela existe no Figma ou um cartão está marcado. Relacionar cada achado a arquivos/contratos e cenários. Não instalar ou publicar nada só para produzir esse diagnóstico.

## 2. Etapas e entregas

| Etapa | Escopo | Dependência | Evidência de conclusão |
| --- | --- | --- | --- |
| E0 — Base | Diagnóstico, convenções, divergências e configuração de desenvolvimento | Repositório correto | Inventário com evidências, comandos reais e próxima entrega definida. |
| E1 — Contato e acessos | Landing/WhatsApp, bot, shopping, vários gerentes, sessão, troca e bloqueio | E0 | Jornada testada; dois gerentes no mesmo shopping e isolamento contra outro. |
| E2 — Estrutura e mapa | Andares, setores, vagas, importação, mapas e posições | E1 | Dois andares navegáveis e importação sem perda de IDs. |
| E3 — Equipamentos | Placa/sensor, protocolo, ingestão, expiração, ocorrências e manutenção | E1/E2 e contrato de firmware | Maquete ou simulador identificado demonstra estados, falhas e retorno. |
| E4 — Operação e histórico | Indicadores, telões, filtros, eventos, comparações e exportação | E2/E3 | Contagens reconciliadas e histórico com indisponibilidade explícita. |
| E5 — Power BI | Views, medidas, relatório e atualização | E4 | Relatório funcional com números iguais ao conjunto controlado. |
| E6 — Integração | Fluxo completo, responsividade, permissões e preparação de apresentação | E1–E5 | Roteiro completo reproduzível e limitações declaradas. |

O fluxo comercial pode ser testado com atendimento demonstrativo. Dados simulados devem estar identificados. Quando houver hardware real, conferir ingestão e interrupção física de comunicação; não chamar um simulador de integração física.

## 3. Organização dos agentes

Usar agentes quando a tarefa e o ambiente autorizarem, com divisão que produza trabalho independente. Os papéis abaixo são responsabilidades possíveis, não agentes instalados ou nomes que precisam ser criados.

| Papel | Escopo | Limite |
| --- | --- | --- |
| Coordenador | Plano, contratos, dependências, integração e comunicação | Responsável final; confere evidências dos demais. |
| Produto/contratos | Divergências, critérios e desenho de API | Não decide sozinho mudanças de escopo confirmadas. |
| Frontend/visual | Interface, componentes e mapa | Respeita tokens; não muda API compartilhada sem acordo. |
| Backend/dados | Casos de uso, autorização e migrations | Dono único de schema e contratos comuns durante a entrega. |
| Telemetria | Firmware/protocolo, sequência, confirmação e offline | Implementa sobre contrato estabilizado com backend. |
| Análises | Views, medidas e Power BI | Usa fatos validados; não inventa dados de sensores. |
| Revisão | Testes, isolamento, riscos e comparação visual | Informa evidência e impacto; não aprova por aparência. |

Não usar todos em cada tarefa. Uma alteração pequena pode ser concluída pelo agente principal. Para uma etapa ampla, começar com poucas frentes; aumentar somente se existirem entregas independentes. Número e modelo dependem das capacidades disponíveis, sem impor modelos premium ou inventar configurações.

### Contrato de delegação

Cada subtask deve receber:

1. Objetivo e requisito associado.
2. Fontes/arquivos que precisa ler.
3. Arquivos ou diretório sob sua responsabilidade.
4. Limites: o que precisa preservar e quais contratos não pode alterar sozinho.
5. Entrada pronta e resultado esperado.
6. Cenários e comandos de verificação reais.
7. Formato de retorno: alterações, evidências, riscos e dependências.

Exemplo: um agente revisa a autorização em modo leitura enquanto outro implementa os estados visuais do mapa usando contrato pronto. Evitar dois agentes editando simultaneamente `schema.prisma`, cliente HTTP, token global ou lockfile.

Quando uma alteração afeta contrato compartilhado, coordenador resolve a dependência primeiro. Não integrar apenas com base no resumo do agente: revisar diffs e executar os cenários relevantes após a integração. Worktrees podem isolar mudanças quando forem necessários e houver ferramenta disponível; não são exigência para toda tarefa.

## 4. Escolha de skills

Conferir o catálogo do ambiente e ler a skill antes de aplicar. Os nomes abaixo são referências disponíveis nesta preparação ou capacidades equivalentes; sua instalação no Codex do repositório deve ser confirmada.

| Necessidade | Skill/capacidade a procurar | Aplicação |
| --- | --- | --- |
| Ler uma tela do Figma | `figma-design-to-code` | Contexto, captura, assets e adaptação ao código existente. |
| Alterar o arquivo Figma | `figma-use` e skill específica da ação | Somente quando a tarefa autorizar escrita no design. |
| Ajustar/testar interface | `frontend-testing-debugging`, skill React pertinente | Erro visual, responsividade, renderização e comportamento. |
| Revisar PostgreSQL | `supabase-postgres-best-practices` ou equivalente PostgreSQL | Índices, consultas e transações aplicáveis; não implica migrar para Supabase. |
| Git e PRs | `git-github-professional` ou equivalente | Revisão de diff, commits, descrição e integração conforme autorização. |
| Verificar fluxo completo | `verification`, navegador ou testes existentes | Percorrer interface, API e banco com evidências. |
| Consultar integração | Documentação oficial e ferramentas do provedor | Confirmar versão e requisitos reais. |

Não carregar skills de pagamento, app nativo ou geração de imagem apenas porque existem. Não criar skills fictícias para Power BI: usar a documentação e ferramentas disponíveis. Não omitir pré-requisito de uma skill para “ganhar tempo”. Se faltar capacidade, informar a limitação e fazer o que for possível com evidência.

## 5. Critérios de aceite rastreáveis

| ID | Requisito | Cenário | Resultado esperado |
| --- | --- | --- | --- |
| CA01 | RF01 | Visitante aciona CTA da landing | Abre o contato WhatsApp configurado, com contexto correto; não solicita cadastro no site. |
| CA02 | RF02 | Menu recebe opção inválida e depois válida | Orienta retorno e segue o fluxo correto sem perder estado indevidamente. |
| CA03 | RF02 | Mesma mensagem de demonstração reenviada | Não duplica pedido; evento de status não é tratado como texto do cliente. |
| CA04 | RF03/RF04 | Admin cria shopping e dois gerentes | Contas distintas, e-mails únicos, mesmo shopping e senhas individuais. |
| CA05 | RF05 | Gerente entra com senha provisória | Backend permite apenas ações necessárias à troca antes do painel operacional. |
| CA06 | RF05 | Admin bloqueia um gerente já logado | A sessão perde acesso; outro gerente do shopping continua operando. |
| CA07 | RF17 | Gerente A tenta ID, filtro, exportação ou download de shopping B | Nenhum dado de B é retornado. Testar também o canal de atualização escolhido. |
| CA08 | RF03 | Gerente entra antes da ativação | Aviso “em configuração”; ausência de leituras não aparece como estacionamento vazio. |
| CA09 | RF06 | Alternar entre dois andares rapidamente | Mapa, dados e seleção correspondem ao último andar escolhido, sem corrida de respostas. |
| CA10 | RF06 | Buscar vaga de outro andar | Navega ao andar correto e destaca a vaga. |
| CA11 | RF07 | Salvar posição de vaga incompatível | Rejeita vínculo com andar/shopping errado ou duplicação da vaga. |
| CA12 | RF07 | Dois Admins/sessões gravam revisões do mapa | Política de revisão impede sobrescrita silenciosa. |
| CA13 | RF08 | CSV/XLSX com duplicata e categoria inválida | Prévia informa linha/campo; confirmação bloqueada sem alteração parcial. |
| CA14 | RF08/RF13 | Nova importação contém vaga já existente | Preserva ID, vínculo e histórico; ausência de registro na planilha não apaga silenciosamente. |
| CA15 | RF09/RF17 | Placa tenta enviar sensor de outra placa/shopping | Rejeita sem atualizar estado nem último contato dos sensores indevidos. |
| CA16 | RF10 | Estado alterna antes de 30 segundos | Reinicia candidato; não confirma a mudança interrompida. |
| CA17 | RF10 | Uma leitura seguida de silêncio | Não confirma apenas porque o relógio avançou. |
| CA18 | RF10/RF13 | Reenviar evento já confirmado | Não duplica evento nem prolonga validade usando mensagem antiga. |
| CA19 | RF10 | Mensagem antiga chega após mensagem nova | Não regride estado, sequência nem período atual de confirmação. |
| CA20 | RF10 | ESP32 reinicia e sequência volta ao início | Identidade de inicialização evita colisões; mensagens da inicialização antiga não dominam a nova. |
| CA21 | RF11 | Nenhuma mensagem chega após limite de comunicação | Rotina marca indisponibilidade e registra instante efetivo; mapa/telão não mantêm livre expirado. |
| CA22 | RF09/RF11 | Heartbeat continua e um sensor para de enviar | Placa pode seguir em contato; somente sensor/vaga afetados expiram. |
| CA23 | RF11/RF12 | Toda a placa para de responder | Identifica impacto nas vagas vinculadas e evita ocorrências repetidas a cada verificação. |
| CA24 | RF10/RF12 | Comunicação retorna durante manutenção aberta | Contato atualiza; manutenção manual segue aberta; ocupação exige novas observações consistentes. |
| CA25 | RF14 | PCD ocupada e elétrica livre no recorte | PCD não entra em PCD livre; elétrica integra seu destaque e total apenas uma vez. |
| CA26 | RF14 | Telão perde atualização | Mostra condição desatualizada/indisponível sem vender contagem antiga como atual. |
| CA27 | RF13/RF15 | Período contém tempo sem dados | Ocupação exclui tempo desconhecido e exibe cobertura. |
| CA28 | RF15 | Todas as vagas estão indisponíveis | Percentual sem dados, não 0% nem divisão inválida. |
| CA29 | RF13/RF15 | Ciclo inicia antes da primeira observação ou atravessa offline | Não aparece como duração completa inventada. |
| CA30 | RF13 | Vaga muda de categoria/andar | Relatório antigo preserva a classificação do período observado. |
| CA31 | RF15 | Gerente exporta período e categoria filtrados | PDF/CSV contém apenas o recorte permitido, com filtros e atualização. |
| CA32 | RF16 | Atualizar relatório Power BI com conjunto controlado | Medidas coincidem com resultados esperados e data de atualização muda corretamente. |
| CA33 | RF17 | Abrir relatório como usuários de shoppings distintos | RLS/forma de distribuição impede cruzamento; gerente não recebe relatório técnico Admin. |
| CA34 | RF18 | Desativar, desfazer e reativar posteriormente | IDs/histórico permanecem; visibilidade atual muda conforme a ação. |
| CA35 | RNF visual | Navegar por teclado e em telas menores | Foco, textos, mapa e controles utilizáveis; nenhum corte ou sobreposição não intencional. |
| CA36 | Regras de código | Revisar diff de uma entrega | Português consistente, comentários úteis, assets descritivos e módulos organizados. |

CA33 só pode ser declarado concluído após implementar a forma de publicação/acesso. Enquanto a demonstração ficar apenas no Desktop, registrar a incorporação como pendente; não fingir teste de RLS no portal.

## 6. Conjunto controlado para reconciliar métricas

### Cenário analítico de duas vagas durante uma hora

Trata-se de um conjunto sintético identificado para testar o cálculo sobre **intervalos já confirmados**, não um roteiro que dispensa o teste de telemetria.

| Vaga | Intervalos em minutos, desde o início da hora |
| --- | --- |
| A | Livre `[0,15)`; ocupada `[15,45)`; livre `[45,60)`. |
| B | Ocupada inicial `[0,30)`; indisponível `[30,50)`; livre `[50,60)`. |

As duas vagas permanecem ativas por toda a hora. A vaga B não teve entrada observada e atravessou falha.

Resultados esperados:

- Tempo ativo: **120 minutos-vaga**, ou 7.200 segundos-vaga.
- Tempo ocupado: **60 minutos-vaga**, ou 3.600 segundos-vaga.
- Tempo livre: **40 minutos-vaga**, ou 2.400 segundos-vaga.
- Tempo indisponível: **20 minutos-vaga**, ou 1.200 segundos-vaga.
- Tempo conhecido: **100 minutos-vaga**, ou 6.000 segundos-vaga.
- Ocupação no período: **60%**.
- Cobertura: **83,333…%**.
- Duração completa observável: **30 minutos**, somente ciclo da vaga A.
- Entradas observadas: **uma**, na vaga A. O estado inicial da vaga B não inventa uma entrada.
- Ao final, as duas vagas estão livres: ocupação atual **0%**, diferente da ocupação histórica de 60%.

A taxa individual da A é 50%, e a da B é 75%. A média simples de 62,5% estaria errada para o conjunto; a ponderação pelos tempos conhecidos produz 60%. Backend, views e Power BI devem reproduzir o mesmo resultado.

## 7. Execução dos testes

Preferir ferramentas já adotadas no projeto. Usar testes unitários para cálculos e máquina de estados, testes de integração para autorização/transações e testes de interface para fluxos e responsividade. Escolher por risco, não por quantidade.

Timers devem ser controláveis nos testes; evitar esperar minutos reais em cada teste automatizado. Não alterar relógio de produção. Usar eventos com sequência, inicialização, observações válidas e lacunas definidas, conforme o contrato de firmware aprovado.

Para cada resultado, registrar cenário, comando real, ambiente de teste, resultado esperado/obtido e evidência. Falha de uma ferramenta não significa teste aprovado. Não declarar “todos os testes passaram” se apenas build ou inspeção estática foi executado.

## 8. Definição de pronto por entrega

- [ ] Requisito e recorte da entrega identificados.
- [ ] Comportamento funciona com dados pertinentes e autorização correta.
- [ ] Erros, vazio e falhas relevantes tratados.
- [ ] Código em português, com comentários explicativos e organização coerente.
- [ ] Mudança não quebra isolamento, histórico, contagem ou validade dos dados.
- [ ] Migrations e contratos documentados quando alterados.
- [ ] Interface comparada à referência disponível e responsividade verificada.
- [ ] Testes proporcionais executados com resultados reais.
- [ ] Documentação do comportamento atualizada.
- [ ] Limitações declaradas; tarefa não marcada como pronta por existir apenas a tela.
- [ ] Commit/PR/publicação feitos apenas quando fazem parte da autorização atual.

## 9. Roteiro da demonstração do TCC

1. Mostrar a landing e explicar o encaminhamento ao WhatsApp.
2. Demonstrar cadastro de shopping e dois gerentes pelo Admin após a parceria.
3. Entrar como gerente, trocar senha provisória e navegar pelo mapa de dois andares.
4. Demonstrar oito vagas da maquete, com categorias e observações identificadas.
5. Alterar uma vaga e mostrar confirmação, mapa, indicadores e telão coerentes.
6. Interromper comunicação, mostrar indisponibilidade e manutenção no Admin.
7. Recuperar comunicação e explicar por que uma nova leitura é necessária.
8. Consultar histórico, exportar resumo e atualizar o relatório Power BI.
9. Mostrar cobertura de dados e comprovar isolamento entre dois shoppings de teste.

Dois andares podem ser lógicos no cenário de demonstração, se isso for identificado. Não afirmar que a maquete tem dois pavimentos físicos ou vários controladores sem essa montagem existir.
