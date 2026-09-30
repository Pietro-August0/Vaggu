# Visão do produto

**Atualização:** 30/09/2026 · **Produto:** VAGGU — plataforma web responsiva para gestão de estacionamentos de shopping centers.

Este documento apresenta a direção do produto sem repetir os contratos detalhados do [[Vaggu/Documentação/SSD-VAGGU|SSD-VAGGU]]. O SSD continua sendo a referência para regras de negócio, permissões, API proposta e decisões pendentes; o estado real da entrega é acompanhado em [[Vaggu/Documentação/planejamento-do-projeto|planejamento e continuidade]].

## Origem e evolução da ideia

As Sprints 1 e 2 foram dedicadas ao brainstorming, à revisão de problemas e à escolha de uma ideia que a equipe pudesse transformar em TCC. Depois dessa descoberta inicial, a equipe começou a construir a VAGGU, confrontou as ideias com as necessidades do produto, manteve o que funcionava, descartou hipóteses inadequadas e planejou a experiência no Figma antes de ampliar a implementação.

Esse histórico explica a evolução do escopo, mas não reativa propostas antigas. As decisões atuais descritas abaixo e no SSD prevalecem sobre rascunhos, protótipos ou cronogramas anteriores.

## Problema e oportunidade

Estacionamentos de shopping precisam conhecer a disponibilidade real das vagas, localizar problemas de comunicação ou manutenção e oferecer uma leitura clara da operação. Sem uma fonte confiável, a equipe pode tratar dado antigo como disponibilidade, somar categorias de forma duplicada ou expor informações de um shopping a outro.

A VAGGU reúne cadastro do shopping, acessos, mapa, leitura dos sensores, histórico e análises em uma única experiência. O valor não está apenas em mostrar vagas: a informação precisa ser atual, não pode misturar shoppings diferentes e deve permitir entender o que aconteceu ao longo do tempo.

## Público e usuários

O público institucional são shopping centers que desejam acompanhar seus estacionamentos. A parceria é conduzida pela equipe VAGGU; não há contratação nem cadastro público de gerente no site.

| Usuário ou ator | Necessidade principal | Limite de atuação |
| --- | --- | --- |
| Visitante | Entender o serviço e iniciar contato | Acessa landing, WhatsApp e login. |
| Admin VAGGU | Implantar e acompanhar os shoppings | Configura estrutura, acessos, equipamentos e operação. |
| Gerente | Consultar a operação do próprio shopping | Não configura estrutura, mapas nem equipamentos. |
| Telão autorizado | Exibir disponibilidade agregada | Não recebe dados pessoais ou credenciais. |
| Placa ESP32 | Enviar comunicação e observações de sensores | Não é usuário humano e só atua no escopo autenticado. |

Um shopping pode ter vários gerentes. Cada gerente possui login individual e o backend deve determinar seu shopping pela sessão, sem confiar em um identificador enviado pelo navegador.

## Objetivo do produto

Entregar uma plataforma web responsiva que permita à equipe VAGGU configurar um shopping, disponibilizar acesso individual aos gerentes e transformar observações autenticadas dos sensores em estados operacionais, histórico, contagens, telões e análises confiáveis.

Para atingir esse objetivo, o produto deve:

- conduzir o visitante da landing ao atendimento pelo WhatsApp;
- permitir que o Admin cadastre shoppings, gerentes, andares, setores, vagas e mapas;
- dar ao gerente uma visão isolada e compreensível do próprio shopping;
- distinguir tipo de vaga de estado operacional;
- nunca interpretar dado expirado ou desconhecido como vaga livre;
- preservar histórico e isolamento em API, arquivos, exportações, tempo real e Power BI;
- manter a operação disponível mesmo se a camada analítica estiver indisponível.

## Experiência principal

1. O visitante conhece a VAGGU na landing e abre o WhatsApp.
2. A equipe apresenta a solução, realiza a reunião e confirma a parceria.
3. O Admin cadastra o shopping, prepara a estrutura e cria acessos individuais.
4. O gerente recebe uma senha provisória, troca-a no primeiro login e entra no painel do seu shopping.
5. O Admin importa ou configura andares, setores, vagas e posições; Admin e gerente usam a mesma representação 2D.
6. A base de sensores já recebe e confirma leituras em ambiente de teste. O próximo passo é ligá-la ao ESP32 real e levar a validade dessas leituras ao mapa.
7. Telões, indicadores, exportações e Power BI consumirão dados confirmados, sem duplicar categorias especiais.

Os passos 1 a 5 estão implementados em P01–P05. P06 já possui uma base funcional de sensores e P08 já começou com histórico e análises dentro do sistema. Esses pacotes continuam incompletos: faltam o hardware real, manutenção, validade no mapa, exportações e outras consultas. Telões e Power BI permanecem por fazer. O fluxo estruturado do WhatsApp está parcial.

## Metas verificáveis

Não há metas comerciais de aquisição, latência ou volume aprovadas. O sucesso do produto é verificado pelos comportamentos e evidências abaixo; os cenários completos estão em [[Vaggu/Documentação/plano-e-aceite|plano e aceite]].

| Meta | Evidência de aceite | Estado em 23/09/2026 |
| --- | --- | --- |
| Converter interesse em contato | CTA abre o WhatsApp configurado sem criar cadastro público. | Base implementada; número oficial ainda depende de configuração. |
| Controlar acessos com segurança | Dois gerentes do mesmo shopping usam logins próprios e um gerente não acessa outro shopping. | Implementado em P02–P03. |
| Configurar a estrutura sem perder identidade | Importação mostra prévia e erros, confirma uma vez, preserva IDs/histórico e não apaga vaga ausente silenciosamente. | P05 concluído em 21/09/2026. |
| Consultar o estacionamento em diferentes telas | Admin e gerente navegam por andares, filtros, busca e seleção sem transbordamento horizontal. | Base do mapa concluída em P04 e refinada em P05. |
| Confiar no estado da vaga | Mudança exige 30 segundos de leituras consistentes; mensagens repetidas ou antigas não alteram o resultado; sensor sem resposta deixa a vaga indisponível. | Base implementada e testada com PostgreSQL; hardware real e uso no mapa ainda pendentes. |
| Exibir contagens reconciliadas | Mapa, API e telão usam a mesma validade; PCD, idoso e elétrica integram o total sem duplicação. | Planejado para P07. |
| Preservar histórico e análises | O sistema guarda mudanças confirmadas e calcula ocupação, cobertura e entradas dos últimos sete dias sem misturar shoppings. | Parte de P08 implementada; exportações e evolução das métricas ainda pendentes. |
| Demonstrar análise funcional | Primeiro relatório Power BI atualiza com números iguais aos dados controlados e sem exposição entre shoppings. | A preparação dos dados existe; o relatório Power BI funcional ainda está pendente. |

## Escopo do MVP

O MVP-alvo do TCC inclui:

- landing, login, troca obrigatória de senha e Minha conta;
- atendimento pelo WhatsApp com menu funcional e encaminhamento humano;
- administração de shoppings e vários gerentes por shopping;
- configuração e importação de estrutura, mapa 2D por andar e posições de vagas;
- cadastro e acompanhamento de placas ESP32 e sensores;
- ingestão autenticada, confirmação, expiração e estado operacional;
- mapa do gerente, indicadores, ocorrências e manutenção;
- histórico, resumos e exportações;
- telões web com agregados por andar ou setor;
- primeiro relatório funcional no Power BI baseado no histórico.

P01–P05 e a correção de interface C01 estão concluídos. P06 e P08 já começaram e possuem partes funcionais, mas ainda não atendem todo o aceite. O trabalho imediato é fechar P06 com o hardware e a operação real, concluir P07 e ampliar histórico e exportações antes do relatório Power BI.

## Posterior ao MVP

Não existe um pacote pós-MVP formalmente aprovado. Escala comercial, metas de desempenho, retenção, backup, disponibilidade de produção, publicação/incorporação do Power BI e melhorias derivadas de uso real exigem decisões próprias antes de se tornarem compromisso do produto.

Itens apenas aventados ou dependentes dessas decisões não devem ser apresentados como entrega confirmada.

## Fora do escopo

- lotes comerciais ou perfil de lojista/empresário;
- reservas e pagamentos de estacionamento;
- reconhecimento de veículos ou leitura de placas de veículos;
- aplicativo nativo;
- motos como categoria de vaga;
- navegação 3D;
- leitura automática de planta e editor CAD completo.

## Personas — INFORMAÇÃO A SER FORNECIDA

A equipe ainda não forneceu pesquisa, entrevistas ou dados suficientes para criar personas sem suposição. Quando essas informações existirem, registrar para cada persona: contexto, objetivos, dificuldades, rotina, dispositivos usados, decisões que toma e evidências que sustentam o perfil.

Até lá, usar somente os papéis confirmados de visitante, Admin VAGGU e gerente. Não transformar esses papéis em personas fictícias.

## Decisões atuais que não devem regredir

- O produto é web responsivo, sem aplicativo nativo.
- A landing direciona ao WhatsApp; a equipe conduz reunião e fechamento.
- O Admin cria os acessos depois da parceria.
- O mapa operacional existe e permite navegar entre andares.
- Tipos são comum, PCD, idoso e elétrica; estados do produto são livre, ocupada e indisponível. Leitura desconhecida ou expirada deve resultar em indisponibilidade, nunca em vaga livre.
- “Placa” significa o controlador eletrônico ESP32, não a placa de um veículo.
- Heartbeat da placa não comprova o funcionamento individual dos sensores.
- Power BI só conta como integração quando houver relatório funcional baseado no histórico real.

## Referências

- Regras, contratos e decisões: [[Vaggu/Documentação/SSD-VAGGU|SSD-VAGGU]].
- Critérios verificáveis: [[Vaggu/Documentação/plano-e-aceite|plano e aceite]].
- Estado e sequência de implementação: [[Vaggu/Documentação/planejamento-do-projeto|planejamento e continuidade]].
- Identidade e pendências de interface: [[Vaggu/Documentação/regras-visuais|regras visuais]].
- Base tecnológica: [[Vaggu/Tecnologias/Tecnologias e arquitetura|tecnologias e arquitetura]].
