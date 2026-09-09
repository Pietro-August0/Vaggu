# SSD VAGGU — especificação de produto e desenho do sistema

**Versão:** 1.0 • **Data:** 09/09/2026 • **Idioma:** português brasileiro.

**Objetivo:** oferecer ao Codex e à equipe uma base ampla, rastreável e utilizável para planejar, implementar e revisar a VAGGU. Esta especificação descreve o resultado esperado; o estado real da implementação deve ser verificado no repositório.

## Sumário

1. Contexto, fontes e autoridade
2. Escopo e decisões atuais
3. Perfis, permissões e acessos
4. Jornada comercial e WhatsApp
5. Implantação, estrutura e importações
6. Páginas e comportamento da interface
7. Mapa e telões
8. Placas, sensores e manutenção
9. Protocolo e processamento de telemetria
10. Histórico e métricas
11. Power BI
12. Arquitetura e modelo de dados
13. Contratos da API
14. Requisitos e qualidade
15. Decisões pendentes, riscos e referências

## 1. Contexto, fontes e autoridade

A VAGGU é o TCC de Desenvolvimento de Sistemas de uma equipe de seis integrantes: Pietro, Ana, Kamilly, Samuel, Juan e Elisa. A base anterior de organização indicava Pietro no fullstack, Ana no frontend e Scrum, Kamilly e Samuel no backend, Juan em frontend/UI e Elisa em frontend/UX. Esses papéis são contexto, não distribuição automática de tarefas. O horizonte informado é a apresentação até dezembro de 2026; não existe cronograma diário aprovado neste pacote.

O sistema recebe dados de sensores em vagas de estacionamento de shoppings, apresenta ocupação e disponibilidade por andar/setor, oferece mapa operacional e telões e preserva histórico para análise. A equipe VAGGU administra implantação, acessos e equipamentos; gerentes acompanham a operação.

### 1.1 Fontes usadas

| Fonte | Uso e limite |
| --- | --- |
| Decisões de Pietro nesta conversa, em 09/09 | Autoridade para mapa, WhatsApp, múltiplos gerentes, categorias, placas e Power BI. |
| `VAGGU_Documento_Mestre_Atualizado.docx`, revisão de 09/09, 17 páginas | Base consolidada de fluxos, regras, modelo proposto e planejamento. |
| Documento mestre de 03/09 e endpoints MVP de 02/09 | Contexto anterior. Regras conflitantes foram substituídas. |
| Figma VAGGU, arquivo `xKI9wjoiZ5CoXC3DXIJNmq`, nó `2022:2` | Referência de identidade e telas. Nova extração bloqueada por limite; detalhes no guia visual. |
| Documentação oficial OpenAI e Microsoft | Referência para arquivo de instruções e opções do Power BI; links ao final. |

Este pacote não atesta revisão completa do código no GitHub nem dos cartões do Trello. O quadro VAGGU não pôde ser lido na etapa anterior. Não inferir conclusão de tarefas pelo protótipo, por um documento ou pelo nome de um endpoint.

### 1.2 Como interpretar o texto

- **Confirmado:** decisão explícita do produto ou regra preservada no documento consolidado.
- **Proposta técnica:** solução recomendada a conciliar com código, hardware e infraestrutura.
- **Pendente:** informação ainda não verificada; não preencher com uma suposição apresentada como fato.
- **Implementado:** usar essa classificação somente após encontrar código e evidência do comportamento.

Em conflito, decisão recente explícita prevalece sobre documentação antiga. Figma define identidade, mas não restaura recursos retirados. Registrar mudanças relevantes com data e impacto; não modificar silenciosamente escopo para facilitar implementação.

## 2. Escopo e decisões atuais

| ID | Decisão obrigatória | Regra anterior substituída |
| --- | --- | --- |
| DEC01 | Mapa operacional com navegação entre andares. | “Sem mapa”, apenas lista/tabela. |
| DEC02 | Landing conduz ao WhatsApp, principal canal de atendimento e parceria. | Cadastro ou contratação pública pelo site. |
| DEC03 | Admin cria login individual após a parceria. | Gerente cria seu próprio acesso. |
| DEC04 | Um shopping pode ter vários gerentes. | Apenas uma conta de gerente por shopping. |
| DEC05 | Telões destacam PCD, idosos e elétricas, além da disponibilidade geral. | Inclusão de motos no protótipo. |
| DEC06 | Admin acompanha placas ESP32, comunicação e manutenção. | Apenas ocupação, sem visão dos controladores. |
| DEC07 | Power BI começa a ser implementado com dados reais recebidos. | Analytics externo apenas como ideia futura. |
| DEC08 | Confirmação inicial de ocupação em 30 segundos consistentes. | Confirmação antiga de um minuto. |

### 2.1 Entrega funcional planejada

Landing, login, troca de senha, bot de WhatsApp, administração de shoppings e acessos, estrutura/importação, mapa por andar, placas/sensores, ingestão, estados atuais, histórico, ocorrências, indicadores, exportação de resumos, páginas de telão e primeiro relatório funcional no Power BI.

### 2.2 Fora do escopo

Lotes comerciais, perfil de lojista/empresário, reservas, cobrança ou pagamento de estacionamento, identificação de veículos por câmera, leitura de placas de veículos, aplicativo nativo, chatbot de IA, navegação 3D, leitura automática de planta e editor CAD completo. Não reintroduzir esses itens por conta própria.

A maquete prevista tem oito vagas. A pequena tela física pode ser demonstrativa e não precisa consumir o sistema. As páginas web de telão devem poder ser demonstradas em monitor convencional. Instalação comercial em vários shoppings não é pré-requisito para demonstrar o TCC.

## 3. Perfis, permissões e acessos

### 3.1 Perfis

| Perfil | Escopo de acesso | Permissões |
| --- | --- | --- |
| Visitante | Landing | Conhecer o serviço, abrir WhatsApp e acessar login. |
| Admin VAGGU | Shoppings atendidos | Implantação, acessos, mapas, estrutura, equipamentos, manutenção, indicadores e suporte. |
| Gerente | Um shopping vinculado | Consultar mapa, vagas, indicadores, alertas operacionais e resumos; editar dados pessoais permitidos e senha. |
| Telão autorizado | Shopping/andar/setores configurados | Somente agregados de disponibilidade e validade dos dados. |
| Placa ESP32 | Sensores cadastrados nela | Enviar comunicação e estados autenticados. Não é usuário humano. |

Manter dois perfis humanos autenticados: Admin e gerente. Uma conta Admin inicial atende à base do MVP, sem exigir gestão avançada de vários administradores. Não criar permissões de edição estrutural para gerentes.

### 3.2 Credenciais

1. Admin cadastra nome, e-mail de login, telefone e shopping de cada gerente.
2. E-mail identifica a conta; o sistema não cria uma caixa postal.
3. Sistema emite senha provisória individual, armazenada como hash e exibida apenas na emissão.
4. Equipe entrega o acesso pelo processo de atendimento no WhatsApp.
5. Primeiro login deve exigir troca de senha. Backend bloqueia acesso operacional até concluir.
6. Recuperação é solicitada à equipe; Admin verifica o solicitante e redefine o acesso com nova senha provisória.
7. Bloqueio de conta deve interromper acesso também com sessão previamente emitida.

Vários gerentes compartilham o recorte do shopping, não a senha. Suspender um gerente não suspende o shopping nem os demais. No MVP, cada gerente pertence a um único shopping. Não tornar `shoppingId` único na tabela de usuários.

### 3.3 Isolamento

O servidor deriva perfil e shopping de uma sessão validada. Aplicar o recorte a consultas, busca por ID, arquivos, exportação, tempo real e Power BI. Um parâmetro `shoppingId` enviado pelo navegador não concede autoridade. Admin pode escolher recorte; gerente não pode ultrapassar o seu.

Telão não recebe sessão administrativa nem dados pessoais. Credencial de equipamento não acessa rotas humanas. Evitar divulgar existência de registros de outro shopping em mensagens de erro.

## 4. Jornada comercial e WhatsApp

Fluxo confirmado: **landing → WhatsApp → apresentação e reunião → fechamento da parceria → cadastro do shopping e acessos pelo Admin → configuração → operação**.

### 4.1 Menu do bot preservado

| Opção | Comportamento |
| --- | --- |
| Conhecer a VAGGU | Explica o serviço e permite seguir para funcionalidades ou demonstração. |
| Ver funcionalidades | Apresenta mapa, ocupação por andar/setor, categorias, indicadores, histórico e telões. |
| Solicitar demonstração | Coleta nome, shopping, cargo, e-mail e telefone; registra solicitação e encaminha. |
| Solicitar suporte | Coleta categoria, descrição inicial e local afetado; gera protocolo e encaminha. |
| Falar com a equipe | Organiza o assunto e encaminha ao atendimento humano. |

Suporte deve contemplar painel, dados incorretos, sensor/placa, telão, acesso e outros. Opção inválida explica como voltar. Horário de atendimento só deve ser informado a partir da configuração real; não inventar disponibilidade humana.

Guardar sessão mínima do menu, contato, etapa, datas, demonstração ou chamado. Não é requisito copiar todas as conversas para a VAGGU. A conversa humana e a negociação permanecem no WhatsApp. Não criar chat comercial interno.

**Proposta técnica:** deduplicar mensagens pelo identificador do provedor; separar mensagens recebidas de eventos de entrega/falha. Mensagens de status não devem iniciar conversa nem duplicar cadastro. Assinatura, confirmação e envio devem seguir a API e a versão efetivamente configuradas pela equipe.

O Admin trata pedidos de demonstração e suporte no painel, mas credenciais não são emitidas automaticamente apenas porque alguém preencheu o menu. A parceria e a validação continuam sendo etapas humanas.

## 5. Implantação, estrutura e importações

### 5.1 Dados do shopping

Nome, identificação institucional pertinente, endereço, contato, responsável, situação da implantação, fuso e horários de operação. Documentos e planta chegam principalmente pelo WhatsApp e são associados pelo Admin. Guardar metadados e referência de armazenamento privado persistente; não colocar documentos no bundle público.

Etapas de implantação preservadas como base a conciliar: novo atendimento, em análise, documentação pendente, aprovado, em configuração, aguardando instalação, ativo, rejeitado e inativo. Não confundir etapa com suspensão de um gerente. Entrada inválida numa etapa deve retornar erro compreensível.

Antes de ativar, verificar estrutura, mapas, posições, vínculos, usuários e chegada de dados. Gerente pode entrar antes e ver “Seu estacionamento está em configuração”, com estados vazios honestos.

### 5.2 Hierarquia

**Shopping → Andar → Setor → Vaga.** Placa pertence ao shopping e possui sensores; sensor associa uma vaga. Mapa pertence a um andar e referencia posições de suas vagas.

| Regra | Aplicação |
| --- | --- |
| Código de vaga único por shopping | Dois shoppings podem usar `P1-A-001`. |
| Uma vaga, no máximo um sensor ativo | Impedir duas fontes simultâneas sem regra definida. |
| Um sensor, no máximo uma vaga ativa | Impedir contagem repetida. |
| Mesma pertença ao shopping | Placa, sensor, vaga, setor e mapa precisam ser compatíveis. |
| Identificadores estáveis | Substituir sensor, mapa ou importação não recria os IDs das vagas. |

### 5.3 Importação

Formatos previstos: CSV e XLSX. Campos mínimos: código de vaga, andar, setor e tipo. Sensor e coordenadas podem ser opcionais. Prever prévia, erros por linha/campo e confirmação explícita da importação no painel.

Tipos aceitos: `COMUM`, `PCD`, `IDOSO`, `ELETRICA`. Rejeitar motos, categoria inválida, código duplicado no shopping, referências incompatíveis e coordenadas fora do contrato. Definir modelo e delimitadores no arquivo de exemplo do sistema quando implementado.

**Proposta técnica:** processamento inicial gera uma prévia sem alterar a estrutura; confirmação aplica os registros válidos em transação ou estratégia atômica equivalente. Se houver erro bloqueante, nada é confirmado. Usar revisão/identificador para não confirmar duas vezes a mesma prévia.

Manter somente a última importação como artefato ativo do MVP, sem apagar histórico operacional. Conciliar por código no shopping, preservando IDs. Registro ausente em uma nova planilha não deve ser apagado silenciosamente; eventual desativação precisa aparecer na prévia.

### 5.4 Desativação

Desativação lógica com “Desfazer” por cerca de oito segundos e reativação posterior pelo Admin. Histórico continua disponível. Ações em cascata devem mostrar impacto e preservar integridade; não deixar vaga ativa com pai desativado sem regra explícita.

## 6. Páginas e comportamento da interface

| Área | Página | Resultado esperado |
| --- | --- | --- |
| Pública | Landing | Serviço, funcionalidades, CTA WhatsApp e acesso ao login. |
| Acesso | Login/troca de senha | Autenticação, validação e direcionamento por perfil. |
| Admin | Visão geral | Situação dos shoppings e falhas que exigem atenção. |
| Admin | Shoppings | Buscar, cadastrar e abrir ficha. |
| Admin | Ficha do shopping | Dados, documentos, gerentes, andares, setores, mapa, vagas, importação e implantação. |
| Admin | Equipamentos | Placas, sensores, comunicação e ocorrências. |
| Admin | Atendimentos | Demonstrações e suporte, com continuidade no WhatsApp. |
| Gerente | Estacionamento | Indicadores, mapa por andar, filtros, busca e detalhes. |
| Gerente | Análises e relatórios | Histórico, comparação, resumos e análises disponibilizadas. |
| Usuário | Minha conta | Dados pessoais permitidos e senha. |
| Telão | Entrada/andar | Agregados legíveis em tela cheia. |

Interface precisa tratar carregamento, ausência de registros, ausência de observações, configuração, erro, desconexão e dados antigos. Distinguir zero medido de valor desconhecido. Mostrar escopo e última atualização. Regras visuais completas em [regras-visuais.md](regras-visuais.md).

## 7. Mapa e telões

### 7.1 Mapa

Mapa é funcionalidade obrigatória. Selecionar andar carrega sua base e vagas, com código, categoria, estado e detalhe. Busca por vaga de outro andar navega e destaca a posição. Filtros por setor, tipo e estado devem ter comportamento visível; não misturar total do shopping com total filtrado sem rótulo.

**Proposta técnica do MVP:** representação 2D simples por andar, base visual e coordenadas normalizadas. Posição usa `x`/`y` do canto superior esquerdo e largura/altura em relação às dimensões da base; rotação em graus, com âncora documentada. Definir validação de limites, inclusive elemento rotacionado. A proposta evita depender de coordenadas absolutas de um único monitor.

Mapas só são editados pelo Admin. Cada posição referencia uma vaga do mesmo andar; uma vaga não pode aparecer duas vezes no mapa atual. Salvar revisão do mapa e impedir sobreposição de gravações concorrentes. Sobreposição visual entre vagas deve ser detectada na revisão de configuração.

Interface atualiza estados sem recarga manual; o transporte precisa ser validado na infraestrutura. No celular, preservar proporções, navegação e seleção legível; uma lista acessível complementa a experiência.

### 7.2 Tipos e estados

| Informação | Valores |
| --- | --- |
| Tipo/categoria principal | Comum, PCD, idoso, elétrica |
| Estado operacional | Livre, ocupada, indisponível |
| Manutenção de equipamento | Informação técnica separada do estado da vaga |

Uma vaga PCD ocupada continua do tipo PCD, mas não entra no número de PCD livres. Para o MVP, uma categoria principal por vaga evita dupla contagem. Categorias combinadas exigem decisão e modelagem posterior.

### 7.3 Telões

Entrada mostra vagas livres por andar; telão de andar mostra vagas livres por setor. Admin escolhe o recorte exibido. Mostrar PCD, idosos e elétricas, sem motos. Os destaques especiais fazem parte do total geral.

Contagens usam a mesma fonte e validade do mapa. Dados expirados devem ser sinalizados e não mantidos como disponibilidade ao vivo. Resposta pública/autorizada contém agregados, não detalhes de gerentes ou credenciais. A forma de autorizar cada instalação do telão é uma decisão técnica pendente.

## 8. Placas, sensores e manutenção

“Placa” é o ESP32. A primeira versão monitora comunicação comprovável, não a saúde física completa do hardware.

### 8.1 Evidências na tela Admin

Código da placa, shopping, sensores vinculados, andares/setores afetados, último contato válido, tempo sem resposta, sensores sem leitura, ocorrência aberta, observações, responsável e conclusão de manutenção.

| Apresentação | Evidência |
| --- | --- |
| Aguardando conexão | Cadastro sem mensagem válida recebida. |
| Respondendo | Comunicação recente e sensores esperados com observação válida. |
| Atenção | Placa responde, mas existe sensor ativo com falha/sem observação válida. |
| Sem resposta | Tempo sem contato ultrapassou o limite. |
| Em manutenção | Intervenção administrativa aberta; mostrar também comunicação atual. |

Heartbeat não valida leitura de todos os sensores. Uma placa pode responder enquanto uma vaga está indisponível. Não inventar uma porcentagem genérica de saúde. Firmware, RSSI, reinicializações e tempo ligado podem ser adicionados se o equipamento enviar esses dados; não são pré-requisitos do primeiro monitoramento.

### 8.2 Ocorrências

Abrir ocorrência de falha sem duplicar uma ocorrência equivalente que já esteja ativa. Falha da placa identifica todas as vagas afetadas; falha isolada de sensor afeta somente sua vaga. Relacionar causas para não apresentar múltiplas falhas independentes quando o controlador inteiro caiu.

Retorno de contato encerra a falha de comunicação correspondente, mas o histórico da ocorrência permanece. Uma manutenção manual só é concluída pela ação do Admin. Heartbeat retornando não confirma ocupação: sensores precisam recuperar leituras válidas.

## 9. Protocolo e processamento de telemetria

Esta seção é **proposta técnica** de contrato e algoritmo. Deve ser conciliada com o firmware existente e implementada com testes de tempo, concorrência e reinicialização.

### 9.1 Parâmetros

| Parâmetro | Valor/situação |
| --- | --- |
| Janela de confirmação | 30 segundos de observações consistentes, preservado da base. |
| Limite sem resposta | Inicialmente 120 segundos, preservado da base e sujeito a ensaio físico. |
| Heartbeat da placa | Proposta inicial de 30 segundos. |
| Frequência de leitura/envio dos sensores | Pendente de validar com firmware. Deve permitir observar consistência durante a janela. |
| Lacuna máxima entre observações para confirmação | Pendente; menor que o timeout offline e compatível com a frequência real. |
| Frequência da tarefa de expiração | Pendente da hospedagem; atraso e instante efetivo devem ser documentados. |
| Tolerância do relógio do equipamento | Pendente; não confiar cegamente em timestamp do ESP32. |

Não preencher a frequência desconhecida com um valor apresentado como aprovado. A janela de confirmação não pode ser validada por uma única mensagem seguida de silêncio.

### 9.2 Mensagem proposta de estados

```json
{
  "placaCodigo": "PLACA-001",
  "inicializacaoId": "identificador-unico-desta-inicializacao",
  "sequencia": 42,
  "capturadoEm": "2026-09-09T12:00:00Z",
  "leituras": [
    {"sensorCodigo": "SENSOR-001", "estadoDetectado": "OCUPADA"},
    {"sensorCodigo": "SENSOR-002", "estadoDetectado": "LIVRE"}
  ]
}
```

Credencial vai em cabeçalho de autenticação, nunca no JSON de exemplo nem em URL. Timestamp pode ser opcional se o hardware não possuir relógio confiável; o contrato final deve definir isso. Distância ultrassônica não precisa ser enviada. Sensor com leitura inválida não deve enviar “livre” como substituto.

Heartbeat usa identidade de placa, inicialização e sequência, sem inventar leituras. Se existir sequência global para os dois tipos de mensagem, documentar essa escolha; a chave de deduplicação precisa ser consistente em ambos.

### 9.3 Ordem de processamento

1. Autenticar a placa, verificar status e validar tamanho/formato do payload.
2. Conferir sensores efetivamente vinculados à placa e ao mesmo shopping; rejeitar sensor desconhecido ou cruzado.
3. Registrar hora de recebimento confiável no servidor.
4. Deduplicar por identidade de placa/inicialização/sequência ou identificador equivalente persistente.
5. Verificar ordenação por sensor e contexto de inicialização. Mensagem antiga não substitui o estado novo.
6. Atualizar comunicação apenas com evento novo e válido; reenvio antigo não estende artificialmente validade.
7. Atualizar última observação dos sensores presentes e válidos; ausência no lote não é nova leitura.
8. Atualizar candidato de ocupação e confirmar somente com observações consistentes por toda a janela admitida.
9. Persistir mudança atual e evento na mesma transação.
10. Publicar/servir estado já confirmado para mapa, indicadores e telões.

**Proposta para simplificar a primeira versão:** rejeitar o lote inteiro se houver erro estrutural ou sensor incompatível, com resposta clara. Não gravar parcialmente sem contrato explícito. A política de retentativa do firmware deve respeitar erros permanentes, evitando reenvio infinito de um lote inválido.

### 9.4 Confirmação e recuperação

A vaga começa `INDISPONIVEL`. Registrar candidato, início e última observação consistente. Se a leitura alternar, reiniciar candidato. Se houver lacuna maior que o limite de consistência, reiniciar a janela. Duplicatas não contam como novas observações.

Ao completar a janela com evidência suficiente, confirmar no instante da confirmação e registrar o motivo. Não retroagir a mudança para o primeiro candidato sem uma decisão específica. A primeira observação confiável estabelece estado inicial; não representa automaticamente chegada de veículo naquele instante.

Após offline, descartar candidato anterior e exigir nova sequência válida. Observação de erro do sensor, se prevista no protocolo, torna a vaga indisponível sem convertê-la em livre.

### 9.5 Expiração

Rotina independente detecta ausência de mensagens. Ao ultrapassar o limite, marcar equipamento sem resposta, vagas afetadas indisponíveis e registrar ocorrência/evento. Horário efetivo da indisponibilidade é derivado da última observação válida mais o limite, mesmo se a rotina executar depois.

O timeout da placa considera contato válido; o timeout do sensor considera sua própria observação. Heartbeat sozinho não renova sensores. Consultas devem aplicar validade também na leitura, evitando mostrar vagas livres expiradas enquanto a rotina não rodou. A persistência dos eventos continua sendo responsabilidade do serviço de expiração, não apenas do frontend.

### 9.6 Reinicialização e concorrência

Sequência reiniciada exige identificador de inicialização novo, para não colidir com eventos anteriores. Definir como uma inicialização passa a ser corrente e como mensagens atrasadas da anterior são rejeitadas; timestamp de equipamento sozinho não resolve essa ordenação.

Usar marcador de deduplicação persistente, chave única e transação/controle de concorrência. Não confiar apenas em um `Set` na memória do processo. Não é necessário guardar cada heartbeat para sempre; retenção da deduplicação e proteção contra replay precisam ser explícitas e compatíveis com retentativas reais.

Métricas de duração e disponibilidade dependem desses eventos. Não considerar ingestão concluída enquanto reenvio, lacuna, reinício e perda de comunicação não forem testados.

## 10. Histórico e métricas

### 10.1 Dados que precisam permanecer

Estados confirmados com origem, instante efetivo, recebimento e motivo; intervalos de indisponibilidade; períodos de atividade dos cadastros; mudanças de categoria/estrutura/vínculo relevantes à análise. O estado atual serve à consulta rápida e não substitui eventos históricos.

**Proposta temporal:** usar intervalos semiabertos `[início, fim)`, em UTC, convertendo a exibição ao fuso do shopping. Consultar o estado anterior ao início do período quando necessário para reconstruir um intervalo. Cortar intervalos nas bordas do período, da hora e da vigência cadastral. Não prolongar indefinidamente o último estado conhecido por um período sem comunicação.

### 10.2 Definições únicas

| Indicador | Definição |
| --- | --- |
| Capacidade ativa | Vagas ativas no recorte. |
| Livres/ocupadas/indisponíveis | Contagens por estado cuja soma corresponde à capacidade ativa. |
| Ocupação atual | `ocupadas / (ocupadas + livres) × 100`. Denominador zero produz ausência de dado, não 0%. |
| Ocupação histórica | `segundos-vaga ocupados / segundos-vaga conhecidos × 100`. |
| Cobertura histórica | `segundos-vaga conhecidos / segundos-vaga ativos × 100`. |
| Duração média | Média de ciclos completos com início/fim confirmados e sem falha intermediária. |
| Rotatividade observada | Transições confirmadas de livre para ocupada por vaga no período, com exposição informada. |
| Horário de pico | Intervalo com maior ocupação no recorte, acompanhado da cobertura. |
| Disponibilidade de comunicação | Tempo com comunicação válida dividido pelo tempo monitorado, com exclusões explícitas. |

Não calcular ocupação média pela quantidade de eventos nem pela média simples de percentuais de andares com capacidades diferentes. Somar numeradores e denominadores no mesmo recorte. Evitar duplicação por joins entre vagas, sensores e ocorrências.

Sensores não identificam carros/pessoas: não prometer “clientes únicos”, “placas atendidas” ou tempo individual de permanência. Uma ocupação inicial sem entrada observada e um ciclo atravessado por falha não entram como duração completa. Informar se um relatório conta ciclos iniciados, encerrados ou integralmente contidos no período; **proposta inicial para duração:** incluir ciclos completos encerrados no período, com duração total observada e critério descrito no relatório.

### 10.3 Relatórios e insights

Filtros de período, andar, setor e categoria. Exportação em PDF e planilha de resumo; CSV pode atender a planilha do MVP, devendo estar identificado no botão/contrato. Incluir filtros, fuso, atualização e cobertura. Exportar somente dados autorizados e neutralizar células textuais interpretáveis como fórmulas em formatos tabulares quando aplicável.

Insights são frases derivadas de regras e métricas conferíveis. Exemplo: “O andar 2 apresentou maior ocupação no período selecionado”, somente se os dados sustentarem a comparação. Não há chat analítico de IA. No caso de cobertura insuficiente, informar limitação em vez de produzir conclusão forte.

## 11. Power BI

### 11.1 Primeira entrega

Power BI faz parte do planejamento de implementação. **Proposta inicial:** relatório no Power BI Desktop, em modo Importação, alimentado por views do PostgreSQL. O conector oficial suporta Importação e DirectQuery [R2]; escolher Importação inicialmente simplifica a validação para o TCC. Essa escolha é recomendação de implementação, não indicação de licença já contratada.

Entregar um PBIX funcional ou o formato de projeto compatível adotado pela equipe, com dados, medidas e atualização verificadas. Uma tela com iframe vazio ou botão sem relatório não satisfaz o requisito. Não é necessário servir cada gráfico por uma rota REST.

### 11.2 Modelo analítico proposto

| Conjunto | Granularidade |
| --- | --- |
| Dimensões | Shopping, andar, setor, vaga, categoria e calendário. |
| FatoOcupacaoHora | Uma vaga por intervalo de hora: segundos ocupados, livres, indisponíveis e ativos. |
| FatoCicloOcupacao | Um ciclo observado: início, fim, duração, situação completa/interrompida. |
| FatoComunicacao | Um equipamento por intervalo analisado: tempo respondendo, sem resposta e monitorado. |

Incluir IDs estáveis e recorte do shopping. Preservar classificação histórica por vigência ou fotografia no fato. Não unir fatos diretamente de modo a multiplicar medidas. Calcular percentuais a partir da soma dos tempos, usando a mesma semântica do backend. Separar dados não monitorados de falha efetivamente observada.

### 11.3 Páginas do relatório

1. Ocupação: evolução por hora/dia, comparação por andar/setor/categoria e cobertura.
2. Uso das vagas: ciclos completos, duração e rotatividade observada.
3. Equipamentos: comunicação e ocorrências para Admin.

Na disponibilização a gerentes, usar relatório gerencial separado do técnico. Ocultar uma página não é controle de acesso. Todas as medidas precisam de descrição em português com unidade, denominador, tratamento de ausência e período.

### 11.4 Acesso e atualização

Criar usuário de leitura restrito às views necessárias, sem senhas de pessoas, credenciais de placas ou documentos. Credenciais ficam na configuração segura da origem, não no frontend. Atualização manual inicial é aceitável para o TCC; Importação não atualiza o modelo a cada leitura da maquete. Agendamento e gateway dependem da conectividade e do ambiente [R3].

Publicação e incorporação no portal continuam pendentes. A opção de incorporação para clientes permite integrar autenticação da aplicação, mas envolve configuração e capacidade apropriadas em produção [R4]. Não prometer que login VAGGU sozinho concede acesso a qualquer relatório.

Se um relatório reúne vários shoppings, definir RLS e identidade autorizada no servidor. Um filtro no navegador não protege os dados [R5]. Testar pelo menos dois shoppings antes de liberar relatórios a gerentes.

“Publicar na Web” torna o relatório acessível publicamente; não usar para dados internos [R6]. Para o TCC, demonstrar no Desktop é um caminho enquanto a equipe define publicação. Revisar dados importados antes de compartilhar o PBIX.

## 12. Arquitetura e modelo de dados

### 12.1 Componentes

| Componente | Responsabilidade |
| --- | --- |
| React + TypeScript + Tailwind | Interface responsiva, mapa, painéis e telões. |
| Node.js + Express + TypeScript | Sessões, autorização, regras, ingestão e API. |
| Prisma + PostgreSQL | Persistência, transações, schema e migrations numa única base. |
| Serviço de expiração | Detectar perda de comunicação mesmo sem novas mensagens. |
| Integração WhatsApp | Menu, registros estruturados e encaminhamento humano. |
| Firmware ESP32 | Leitura local, envio autenticado e recuperação de comunicação. |
| Views + Power BI | Análise histórica, sem depender do relatório para operar o estacionamento. |

O frontend tem Vercel como destino definido. Hospedagem da API, banco e arquivos deve ser verificada antes da implantação. **Proposta de atualização:** polling controlado pode servir ao MVP; Socket.IO requer suporte a conexões persistentes. Manter a experiência sem recarga manual, informando atualidade. Não colocar uma rotina crítica apenas em timer de função efêmera.

Separar consulta operacional de análise. Falha do Power BI não interrompe leitura das vagas. Organizar módulos conforme [regras-de-codigo.md](regras-de-codigo.md), conciliando com o repositório existente.

### 12.2 Entidades propostas

Não são um schema Prisma pronto. Tipos, índices e campos precisam ser conciliados com as migrations existentes.

| Entidade | Campos essenciais e finalidade |
| --- | --- |
| Usuario | ID, nome, e-mail único, telefone, senhaHash, perfil, ativo, trocarSenhaObrigatoria, shoppingId quando gerente, datas. |
| Shopping | ID, dados institucionais, endereço, contato, fuso, horários, etapa, ativo e datas. |
| Andar | ID, shoppingId, código, nome, ordem e ativo. |
| Setor | ID, andarId, código, nome e ativo. |
| Vaga | ID, setorId, código, tipo, estado, candidato, início/última observação do candidato, ativo. |
| MapaAndar | ID, andarId, referência visual, dimensões, revisão e situação atual. |
| PosicaoVaga | mapaId, vagaId, x, y, largura, altura e rotação. |
| Placa | ID, shoppingId, código único, credencial protegida, último contato válido, inicialização corrente, ativo. |
| Sensor | ID, placaId, código, vagaId opcional, última observação válida, comunicação e ativo. |
| EventoOcupacao | ID, vagaId, estados anterior/novo, efetivoEm, recebidoEm, origem, motivo e vínculo de evento. |
| EventoEquipamento | ID, placaId ou sensorId, mudança, efetivoEm, recebidoEm e motivo. Exatamente um alvo por evento. |
| OcorrenciaTecnica | ID, equipamento, tipo de falha, abertura, retorno, responsável, observações e conclusão de manutenção. |
| DocumentoShopping | shoppingId, tipo, nome, referência privada, tamanho, situação e datas. |
| Importacao | shoppingId, arquivo, estado de processamento, resumo, revisão e confirmação. |
| ErroImportacao | importacaoId, linha, campo, motivo e severidade. |
| SessaoWhatsApp | Identificação de contato, etapa, última interação e situação; mínimo necessário. |
| PedidoDemonstracao | Contato, shopping informado, cargo, situação, datas e shopping criado opcional. |
| ChamadoSuporte | Protocolo, contato, categoria, descrição inicial, shopping quando identificado, situação e datas. |
| LogAcao | Autor, shopping/objeto, ação, instante e metadados mínimos sem segredos. |
| ControleEventoRecebido | Chave persistente de deduplicação, origem e resultado/instante; proposta para processamento idempotente. |

Autenticação pode precisar de entidade de sessão/revogação conforme solução existente. Histórico de vínculos ou vigência cadastral pode usar tabelas próprias. Evitar transformar entidades auxiliares propostas em obrigação de criar um número fixo de tabelas.

### 12.3 Relacionamentos

| Origem | Cardinalidade | Destino |
| --- | --- | --- |
| Shopping | 1:N | Usuários gerentes |
| Shopping | 1:N | Andares |
| Andar | 1:N | Setores |
| Setor | 1:N | Vagas |
| Andar | 1:0..1 atual | Mapa vigente, preservando revisões se adotadas |
| Mapa | 1:N | Posições, uma por vaga no mapa |
| Shopping | 1:N | Placas |
| Placa | 1:N | Sensores |
| Vaga | 1:0..1 ativo | Sensor vinculado |
| Vaga | 1:N | Eventos de ocupação |
| Equipamento | 1:N | Eventos/ocorrências |
| Shopping | 1:N | Documentos, chamados e registros auxiliares |

Um campo de shopping redundante na vaga, se necessário para restrição composta e consultas, deve ser mantido consistente com o setor/andar. Não confiar que copiar o ID em várias tabelas garante isolamento.

### 12.4 Migrações prioritárias

1. Corrigir unicidade de shopping no gerente, preservando contas existentes.
2. Introduzir mapa e posições associados a vagas existentes.
3. Separar placa e sensor, preservando vínculos/leituras já existentes.
4. Unificar tipos/estados com mapeamento dos enums antigos.
5. Garantir eventos, intervalos de falha, deduplicação e índices necessários.
6. Introduzir views analíticas e permissões de leitura com validação dos resultados.

Cada migração precisa declarar pré-condições, compatibilidade com a API, backfill quando necessário e estratégia de recuperação. Não resetar dados reais.

## 13. Contratos da API

### 13.1 Convenções

As rotas seguintes são uma **proposta funcional**, não inventário do que está implementado. A documentação anterior usa nomes como `/auth/login`, `/auth/change-password`, `/gerentes/:id/reset-password` e `/teloes/andares/:id`. Se já existem consumidores, manter compatibilidade e documentar a correspondência. Não criar duas rotas equivalentes apenas para traduzir inglês.

Novos contratos próprios devem priorizar português e termos claros, com exceções de protocolo. HTTP usa semântica consistente: consulta GET, criação POST, atualização parcial PATCH, substituição integral PUT. Desativação lógica tem ação explícita; não fazer DELETE físico de dados históricos.

### 13.2 Cobertura proposta

| Método | Rota de referência | Acesso | Finalidade/justificativa |
| --- | --- | --- | --- |
| POST | `/autenticacao/login` | Público limitado | Emitir sessão e indicar troca obrigatória. |
| GET | `/autenticacao/sessao` | Usuário | Recuperar identidade e permissões atuais. |
| POST | `/autenticacao/sair` | Usuário | Encerrar/revogar sessão conforme o mecanismo. |
| POST | `/autenticacao/trocar-senha` | Usuário autenticado | Troca inicial ou regular, com regras adequadas. |
| GET/PATCH | `/minha-conta` | Usuário | Consultar/editar campos pessoais permitidos. |
| GET/POST | `/shoppings` | Admin | Listar/cadastrar clientes. |
| GET/PATCH | `/shoppings/:id` | Admin | Ficha e alterações institucionais. |
| PATCH | `/shoppings/:id/implantacao` | Admin | Atualizar etapa com validação de pré-condições. |
| GET/POST | `/shoppings/:id/gerentes` | Admin | Listar/criar vários logins no mesmo shopping. |
| PATCH | `/gerentes/:id` | Admin | Editar cadastro, suspender ou reativar. |
| POST | `/gerentes/:id/redefinir-senha` | Admin | Emitir senha provisória individual. |
| GET/POST | `/shoppings/:id/documentos` | Admin | Listar/enviar arquivos da implantação. |
| GET/PATCH | `/documentos/:id` | Admin | Acesso privado e revisão de metadados/situação. |
| GET/POST | `/shoppings/:id/andares` | Consulta autorizada/Admin escrita | Estrutura de andares do recorte. |
| GET/PATCH | `/andares/:id` | Consulta autorizada/Admin escrita | Detalhe e manutenção do andar. |
| GET/POST | `/andares/:id/setores` | Consulta autorizada/Admin escrita | Estrutura dos setores. |
| GET/PATCH | `/setores/:id` | Consulta autorizada/Admin escrita | Detalhe e manutenção do setor. |
| GET/POST | `/vagas` | Consulta autorizada/Admin escrita | Buscar/filtrar/paginar e cadastrar vagas. |
| GET/PATCH | `/vagas/:id` | Consulta autorizada/Admin escrita | Detalhe e configuração; estado não editável livremente. |
| GET/PUT | `/andares/:id/mapa` | Consulta autorizada/Admin escrita | Carregar/salvar revisão e posições do mapa. |
| POST | `/shoppings/:id/importacoes` | Admin | Enviar arquivo e gerar prévia sem aplicar estrutura. |
| GET | `/importacoes/:id` | Admin | Consultar prévia, erros e situação. |
| POST | `/importacoes/:id/confirmar` | Admin | Confirmar revisão validada uma única vez. |
| GET/POST | `/placas` | Admin | Listar/cadastrar controladores. |
| GET/PATCH | `/placas/:id` | Admin | Diagnóstico e configuração do controlador. |
| GET/POST | `/sensores` | Admin | Listar/cadastrar sensores e vínculos. |
| GET/PATCH | `/sensores/:id` | Admin | Detalhar/reconfigurar associação compatível. |
| POST | `/telemetria/heartbeat` | Placa | Confirmar comunicação do controlador. |
| POST | `/telemetria/estados` | Placa | Receber observações dos sensores. |
| GET | `/equipamentos/ocorrencias` | Admin | Consultar falhas/manutenções com filtros. |
| POST | `/equipamentos/ocorrencias` | Admin | Registrar intervenção manual. |
| PATCH | `/ocorrencias/:id` | Admin | Registrar acompanhamento e conclusão. |
| GET | `/alertas` | Admin/gerente no recorte | Consultar impacto operacional sem expor segredos técnicos. |
| GET | `/dashboard` | Admin/gerente no recorte | Contagens atuais, validade e cobertura. |
| GET | `/historico` | Admin/gerente no recorte | Séries e métricas no período. |
| GET | `/comparacoes` | Admin/gerente no recorte | Comparar períodos usando as mesmas definições. |
| GET | `/exportacoes/pdf` | Admin/gerente no recorte | Resumo em PDF. |
| GET | `/exportacoes/csv` | Admin/gerente no recorte | Resumo tabular para planilha. |
| GET | `/teloes/entrada` | Telão autorizado | Agregados por andar. |
| GET | `/teloes/andares/:id` | Telão autorizado | Agregados por setor. |
| GET/POST | `/webhooks/whatsapp` | Provedor validado | Verificação e recebimento conforme protocolo externo. |
| GET/PATCH | `/demonstracoes` e `/demonstracoes/:id` | Admin | Acompanhar contatos e situação; escrita parcial na rota por ID. |
| POST | `/demonstracoes/:id/converter` | Admin | Criar/vincular shopping após validação comercial. |
| GET/PATCH | `/suporte` e `/suporte/:id` | Admin | Acompanhar protocolos; escrita parcial na rota por ID. |

A criação de demonstrações e chamados pelo bot pode chamar o serviço interno; não precisa de endpoint público genérico. Suspensão, reativação, substituição de documentos e configuração do telão podem ser campos/ações das rotas administrativas existentes, sem criar endpoints redundantes.

Incorporação do Power BI poderá exigir endpoint autenticado para emissão de acesso ao relatório. Só adicionar quando o modo de publicação estiver escolhido; servidor determina identidade, relatório e shopping.

### 13.3 Payloads de referência

Criar gerente, **proposta**:

```json
{
  "nome": "Gerente de demonstração",
  "email": "gerente.exemplo@example.com",
  "telefone": "contato de teste validado"
}
```

Shopping vem da rota administrativa validada. Sistema gera a senha provisória. Não retornar hash; senha provisória não reaparece em GETs futuros. O exemplo não define formato final de telefone nem credencial real.

Resposta conceitual do mapa:

```json
{
  "andarId": "andar-de-teste",
  "revisao": 1,
  "atualizadoEm": "2026-09-09T12:00:00Z",
  "vagas": [
    {
      "id": "vaga-de-teste",
      "codigo": "P1-A-001",
      "tipo": "PCD",
      "estado": "OCUPADA",
      "posicao": {"x": 0.1, "y": 0.2, "largura": 0.05, "altura": 0.1},
      "ultimaObservacaoValidaEm": "2026-09-09T12:00:00Z"
    }
  ]
}
```

A resposta real também precisa da base/dimensões do mapa, recorte autorizado e política de validade escolhida. O exemplo ilustra nomes e separação entre categoria, estado e posição, não é schema completo.

Erro proposto:

```json
{
  "erro": {
    "codigo": "VINCULO_INCOMPATIVEL",
    "mensagem": "O sensor não pode ser associado a esta vaga.",
    "campos": [{"campo": "sensorId", "mensagem": "Verifique o shopping e a placa vinculados."}]
  }
}
```

### 13.4 Regras transversais

Validar autenticação, autorização, tipos, vínculos, limites e datas. Listagens grandes têm paginação. Intervalo inválido retorna erro; taxa sem observação retorna nulo/estado sem dados. Não mascarar falha do backend com array vazio que parece resultado legítimo.

Usar `400` para entrada inválida, `401` para ausência/sessão inválida, `403` para operação vedada conforme política de não divulgação, `404` para recurso não acessível/encontrado, `409` para conflito de revisão/unicidade e códigos adequados para excesso/tamanho. Padronizar conforme API existente. Não usar HTTP 200 indiscriminadamente para erros.

## 14. Requisitos e qualidade

### 14.1 Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF01 | Landing apresenta serviço e encaminha ao WhatsApp. |
| RF02 | Bot executa menu e registra demonstração/suporte com encaminhamento humano. |
| RF03 | Admin cadastra shopping, documentos, etapa e estrutura. |
| RF04 | Admin cria vários gerentes com logins individuais por shopping. |
| RF05 | Autenticação por perfil, troca provisória, bloqueio e redefinição. |
| RF06 | Mapa permite andares, busca, filtros e seleção. |
| RF07 | Admin configura mapas, posições, andares, setores e vagas. |
| RF08 | Importação CSV/XLSX com prévia, erros e preservação dos IDs. |
| RF09 | Cadastro de placas/sensores e comunicação individual observável. |
| RF10 | Ingestão autenticada, confirmação e atualização operacional. |
| RF11 | Expiração independente e vagas afetadas indisponíveis. |
| RF12 | Admin registra acompanhamento e manutenção de equipamentos. |
| RF13 | Histórico preserva ocupação, falhas e contexto cadastral. |
| RF14 | Telões agrupam disponibilidade e categorias sem duplicação. |
| RF15 | Estatísticas, comparações e exportações resumidas com recorte. |
| RF16 | Dados analíticos e primeiro relatório funcional no Power BI. |
| RF17 | Isolamento por shopping também em análises e incorporação. |
| RF18 | Desativação lógica, desfazer e reativação sem apagar histórico. |

### 14.2 Requisitos não funcionais

Responsividade e acessibilidade; autorização efetiva no servidor; HTTPS e segredos protegidos; integridade sob concorrência/reenvio; expiração coerente; atualização sem recarga manual; rastreabilidade; privacidade; manutenção do código em português e migrations versionadas.

Não há meta de latência/carga contratada. Medir com o cenário da maquete e um conjunto maior de teste identificado; registrar volume, transporte e resultado antes de prometer escala comercial. Requisitos de retenção, backup, disponibilidade de produção e limites de importação devem ser definidos antes de operar dados reais de clientes.

Para engenharia e comentários, seguir [regras-de-codigo.md](regras-de-codigo.md). Para entrega e cenários, seguir [plano-e-aceite.md](plano-e-aceite.md).

## 15. Decisões pendentes e controle de mudanças

| Pendência | Evidência necessária | Não impede |
| --- | --- | --- |
| Cores, fontes, espaçamentos e assets exatos | Leitura do Figma/tokens do repositório | Especificar comportamentos e manter estilos existentes. |
| Estado real do código | Arquivos, execução e testes no repositório correto | Planejar a verificação inicial. |
| Placas/sensores e topologia final | Montagem da maquete | Modelar placa 1:N sensores. |
| Frequências, lacuna e relógio do firmware | Ensaio de mensagens e reinicialização | Escrever testes parametrizados. |
| API, rotina de expiração e atualização web | Hospedagem e capacidade verificadas | Separar contratos do transporte. |
| Formato e edição do mapa | Planta/base por andar e interação aprovada | Manter IDs e posições como entidades. |
| Publicação/licenciamento Power BI | Conta, conectividade e forma de acesso | Criar relatório Desktop com dados de teste. |
| Autorização dos telões | Modelo de instalação e acesso | Definir resposta agregada sem dados pessoais. |
| Volumes, retenção e arquivos | Requisitos reais de implantação | Desenvolver MVP com limites documentados. |

Riscos principais: perda de comunicação interpretada como vaga livre; isolamento apenas visual; duplicação de eventos; histórico reclassificado incorretamente após edição cadastral; mapa dessincronizado do andar; integração Power BI apenas aparente; tokens visuais inventados; refatoração ampla que dificulta a equipe.

Toda decisão relevante registra: identificador, data, contexto, escolha, alternativa descartada, impacto e cenários de aceite. Se a equipe alterar uma regra, atualizar as referências afetadas em vez de manter duas “versões oficiais”.

## Referencias

Fontes do projeto: decisões da conversa e documento mestre de 09/09/2026. O documento antigo é histórico; não deve reinstalar as regras “sem mapa” e “um gerente”.

- **R1 — OpenAI:** [Instruções com AGENTS.md](https://developers.openai.com/codex/guides/agents-md). Base para organizar um arquivo de entrada curto apontando à documentação extensa.
- **R2 — Microsoft:** [Conector PostgreSQL](https://learn.microsoft.com/pt-br/power-query/connectors/postgresql). Modos suportados e conexão.
- **R3 — Microsoft:** [Atualização de dados](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-data). Atualização e conectividade ao serviço.
- **R4 — Microsoft:** [Visão geral de incorporação](https://learn.microsoft.com/en-us/power-bi/developer/embedded/embedded-analytics-power-bi). Modelos de acesso e publicação.
- **R5 — Microsoft:** [Segurança por linha na incorporação](https://learn.microsoft.com/en-us/power-bi/developer/embedded/cloud-rls). Identidade e isolamento.
- **R6 — Microsoft:** [Publicar na Web](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web). Natureza pública desse recurso.
- **Design:** [Figma VAGGU](https://www.figma.com/design/xKI9wjoiZ5CoXC3DXIJNmq/Vaggu?node-id=2022-2).

Referências técnicas consultadas em 09/09/2026. Conferir novamente requisitos de versão e infraestrutura quando a integração for implementada.
