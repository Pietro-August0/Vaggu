# Personas da VAGGU

Atualização: 21/10/2026. Definimos três personas: Carlos, Mariana e Rafael. Partimos dos dois slides originais de Carlos e complementamos os perfis a partir do contexto do produto.

## Fontes e condição de validação

Nossos slides originais `5.jpg` e `6.jpg` apresentam Carlos e suas necessidades. A composição usa fundo preto texturizado, amarelo de alto contraste, Poppins e retrato recortado, repetido nas páginas de perfil e necessidades. Preservamos os arquivos integrais abaixo. Os complementos de Carlos e as personas Mariana e Rafael são hipóteses de uso; ainda não temos entrevistas ou pesquisa de campo documentadas. Usamos nomes, idades e retratos para representar os perfis, sem comprovar pessoas reais ou vínculo com o shopping mencionado. Como não localizamos os retratos citados no registro de 16/10, criamos novas imagens ilustrativas para Mariana e Rafael.

Revisamos os quatro slides em 21/10 para acompanhar a referência de Carlos: formato 1920×1080, Poppins, idade em amarelo e peso leve, texto branco com destaques amarelos em negrito/itálico, retratos recortados e fundos com textura, retículas e estrelas. Os fundos foram reconstruídos a partir da referência com a ferramenta de imagem. Retiramos as notas de rodapé dos slides; o caráter ilustrativo dos retratos e a condição de validação dos perfis permanecem registrados neste documento. O script `scripts/gerar-slides-personas.py` reproduz a diagramação com os assets locais e as fontes instaladas no frontend.

![Slide original de Carlos: perfil](../Evidências%20visuais/Personas/carlos-perfil-original.jpg)

![Slide original de Carlos: necessidades](../Evidências%20visuais/Personas/carlos-necessidades-original.jpg)

## Carlos — gestão administrativa

**Dados do perfil original:** 45 anos, integrante do setor administrativo do Shopping Granja Vianna. Necessita controlar vagas, visualizar fluxo de veículos, administrar espaços disponíveis para lojas e receber contatos de empresários interessados.

**Contexto proposto:** acompanha a operação e reúne informações para apoiar decisões administrativas.

**Objetivos propostos:** consultar disponibilidade por andar e setor, comparar períodos de ocupação e compartilhar relatórios.

**Dificuldades propostas:** informações dispersas, coleta manual para relatórios e dificuldade de distinguir ocupação de falha de comunicação.

**Rotina e dispositivos propostos:** computador para análise e relatórios, celular para consultas durante deslocamentos. Familiaridade digital ainda não aferida.

**Cenário proposto:** consultar o histórico antes de um fim de semana movimentado e compartilhar informações para organizar a operação.

**Critérios de sucesso propostos:** localizar informações rapidamente, compreender a validade dos dados e exportar relatórios sem consolidação manual. Metas numéricas ainda não definidas.

**Relação com o produto:** consulta pelo perfil Gerente, restrita ao próprio shopping. A persona não amplia permissões de configuração. Gestão e locação de espaços comerciais estão fora do escopo atual; preservamos essa necessidade do perfil original sem criar um módulo de lojas. Nosso contato comercial atende à parceria com os shoppings, sem abranger atendimento a empresários interessados em locar lojas.

**Informação necessária proposta:** disponibilidade e validade por andar, setor e categoria; entradas, saídas e comparação de períodos; exportação que mostre lacunas de observação.

**Jornada proposta:** seleciona shopping autorizado e período → confere cobertura e setores → compara com período anterior → exporta e comunica os limites da leitura.

**Questões de validação:** Quais decisões dependem do fluxo? Quem recebe contatos de empresários? Quais campos são indispensáveis no relatório?

## Mariana — motorista

![Slide de perfil de Mariana, persona ilustrativa](../Evidências%20visuais/Personas/mariana-perfil-slide.png)

![Slide de necessidades de Mariana, hipóteses a validar](../Evidências%20visuais/Personas/mariana-necessidades-slide.png)

**Perfil fictício proposto:** 34 anos, frequenta o shopping para compras, alimentação e serviços.

**Contexto e objetivo propostos:** encontrar uma vaga adequada com rapidez, inclusive em visitas com pouco tempo disponível.

**Dificuldades propostas:** circular por setores lotados, interpretar sinalização e seguir indicações desatualizadas.

**Rotina e canais propostos:** observa telões e sinalização na chegada. Eventual consulta pelo celular ocorre com o veículo parado.

**Necessidades propostas:** disponibilidade por andar e setor, categorias e restrições compreensíveis, indicação de dado parcial ou indisponível e comunicação por texto e símbolos além das cores. As categorias são apresentadas como agregados; não pressupomos contagem de cada categoria em cada setor.

**Cenário proposto:** consultar o telão na entrada e seguir para um setor com disponibilidade.

**Critérios de sucesso propostos:** compreender rapidamente a indicação e encontrar uma situação compatível com ela, respeitando a categoria da vaga. Sem metas quantitativas aprovadas.

**Relação com o produto:** beneficiária do telão web disponível, com contagens agregadas e ocultação de números após perda de validade. A implantação física ainda está pendente. Não implica conta de motorista, aplicativo, reserva ou navegação 3D.

**Jornada proposta:** chega à entrada → lê o telão → identifica setor e categoria adequados → segue a sinalização física → verifica a vaga.

**Questões de validação:** O texto é legível à distância? A contagem parcial é compreensível sem depender só da cor? Qual recorte é útil na entrada?

## Rafael — operação do estacionamento

![Slide de perfil de Rafael, persona ilustrativa](../Evidências%20visuais/Personas/rafael-perfil-slide.png)

![Slide de necessidades de Rafael, hipóteses a validar](../Evidências%20visuais/Personas/rafael-necessidades-slide.png)

**Perfil fictício proposto:** 39 anos, acompanha a operação e coordena o atendimento a problemas do estacionamento.

**Objetivo proposto:** manter a informação de disponibilidade confiável e acompanhar a resolução de falhas.

**Dificuldades propostas:** localizar sensores sem comunicação e acompanhar ocorrências sem perder o histórico.

**Rotina e dispositivos propostos:** alterna entre sala de operação e setores, consultando computador e celular.

**Necessidades propostas:** consultar estado e última comunicação dos equipamentos, localizar vaga/andar/setor, distinguir falha, manutenção e ocupação e acompanhar o retorno à operação.

**Cenário proposto:** localizar um sensor sem comunicação, encaminhar a verificação ao Admin VAGGU e conferir o retorno de leituras válidas.

**Critérios de sucesso propostos:** identificar o equipamento e acompanhar sua recuperação sem apresentar falha como vaga livre. Sem metas quantitativas aprovadas.

**Relação com o produto:** descreve uma atividade operacional, sem criar um novo perfil de acesso. Com uma conta Gerente do próprio shopping, Rafael consulta monitoramento, estados e última leitura. A busca existente permite localizar placa, sensor e vaga. O Admin VAGGU cadastra equipamentos, consulta ocorrências e registra ou encerra manutenção; esses controles não estão no painel do Gerente. A conexão física permanece futura.

**Jornada proposta:** detecta contagem parcial → consulta monitoramento → localiza placa, sensor e vaga → encaminha o problema ao Admin VAGGU → confere o retorno de novas leituras antes de considerar a vaga disponível.

**Questões de validação:** Quem registra e encerra manutenção? Os identificadores físicos coincidem com o cadastro? Quem confirma a recuperação?

## Matriz de oportunidades

| Prioridade | Necessidade | Funcionalidade existente | Dificuldade a validar | Melhoria e aceite propostos |
| --- | --- | --- | --- | --- |
| Alta, baixo esforço | Carlos distingue ausência de zero | Análise e exportações | Rótulos ambíguos | Revisar estados vazios: ausência nunca deve aparecer como ocupação zero. |
| Alta, baixo esforço | Mariana entende dado parcial | Telão web disponível; implantação física pendente | Leitura à distância | Texto e contraste devem identificar parcialidade sem depender só da cor. |
| Alta, médio esforço | Rafael localiza falha | Monitoramento com busca por placa/sensor/vaga; ocorrências no Admin | Correlação entre identificador e localização física | Testar a utilidade da busca existente e o encaminhamento ao Admin com representantes da operação. |
| Média, médio esforço | Carlos compartilha análise | Filtros, Excel e PDF | Recorte pode se perder no arquivo | Período, setor, categoria e cobertura devem constar da exportação. |

Estas propostas não representam pesquisa ou requisito aprovado; avaliaremos os itens maiores no backlog antes de alterar o produto.

## Revisão de coerência — 21/10/2026

Conferimos os dois perfis com as telas e permissões implementadas. Mariana representa o público que recebe a informação do telão; Rafael representa quem consulta o monitoramento e encaminha falhas. São públicos distintos de Carlos, que acompanha indicadores e relatórios administrativos. Ajustamos a jornada de Rafael para não atribuir permissões de manutenção ao Gerente e esclarecemos os agregados de categorias e a implantação física pendente no caso de Mariana.

Referências da conferência: [telão web](../../../vaggu-frontend/src/pages/telao-instalado-page.tsx), [monitoramento e busca](../../../vaggu-frontend/src/components/monitoramento-sensores.tsx), [operações administrativas de equipamentos](../../../vaggu-frontend/src/components/equipamentos-admin.tsx) e [permissões de manutenção](../../../vaggu-backend/src/equipamentos/routes.ts). Esta revisão documental confirma aderência ao produto e consistência dos perfis; a validação com representantes dos públicos ainda precisa ser realizada.

## Validações que faltam

- Validar os complementos de Carlos e os perfis de Mariana e Rafael com representantes dos públicos.
- Registrar entrevistas, observações ou questionários quando forem realizados, preservando os resultados e evitando dados pessoais desnecessários.
- Confirmar rotina, dispositivos, principais dificuldades e critérios de sucesso; testar leitura do telão e identificação de sensores com os perfis correspondentes.
- Conciliar a necessidade comercial original de Carlos com o escopo aprovado, sem prometer locação de lojas.

Referências: [[Vaggu/Especificações/Visão do produto]], [[Vaggu/Documentação/fluxo-de-telas]] e [[Vaggu/Documentação/plano-e-aceite]].
