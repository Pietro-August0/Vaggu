---
tags: [vaggu, evidencias, interface]
---
# Evidências visuais da VAGGU

## 28/10/2026 — privacidade e exclusão

Perfil visitante, aplicação local em `http://127.0.0.1:5183`, conteúdo institucional e contato público autorizados pelo usuário; nenhuma conta real de shopping ou conversa privada. Navegador integrado via Computer Use (plugin Browser ausente do catálogo e Playwright indisponível). Páginas com identidade escura fixa; temas não alteram essas páginas. Sem overlay ou erros de console; somente aviso de movimento reduzido do dispositivo. Links de e-mail conferidos sem envio. Navegação política → exclusão com Enter, volta à landing e novos links do rodapé conferidos. Sem overflow horizontal nos três viewports; capturas completas não comprovam publicação ou funcionamento real do bot.

| Rota | Viewport solicitado | Captura e resultado |
| --- | --- | --- |
| `/privacidade` | 1440×1000 / 768×1024 / 390×844 | [Desktop](2026-10-28%20-%20Privacidade%20e%20exclusao/privacidade-desktop.png) · [Tablet](2026-10-28%20-%20Privacidade%20e%20exclusao/privacidade-tablet.png) · [Celular](2026-10-28%20-%20Privacidade%20e%20exclusao/privacidade-celular.png). Texto e contato legíveis. |
| `/exclusao-de-dados` | 1440×1000 / 768×1024 / 390×844 | [Desktop](2026-10-28%20-%20Privacidade%20e%20exclusao/exclusao-desktop.png) · [Tablet](2026-10-28%20-%20Privacidade%20e%20exclusao/exclusao-tablet.png) · [Celular](2026-10-28%20-%20Privacidade%20e%20exclusao/exclusao-celular.png). Instruções e foco visível. |
| `/`, rodapé | 1440×1000 / 768×1024 / 390×844 | [Desktop](2026-10-28%20-%20Privacidade%20e%20exclusao/rodape-desktop.png) · [Tablet](2026-10-28%20-%20Privacidade%20e%20exclusao/rodape-tablet.png) · [Celular](2026-10-28%20-%20Privacidade%20e%20exclusao/rodape-celular.png). Retorno e links públicos disponíveis. |

Base de orientação sobre direitos: [ANPD](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares). Não há alegação de auditoria jurídica ou aprovação da Meta. Prints do README mostram somente a abertura da landing, que não mudou; anteriores preservados.

## 28/10/2026 — link WhatsApp da landing

Rota `/`, perfil visitante, origem `http://127.0.0.1:5183`, conteúdo público estático e imagens ilustrativas, sem conta autenticada ou dados de clientes. Número público autorizado pelo responsável. Cinco links renderizados apontam para `https://wa.me/5511993807892`. Capturas locais não comprovam publicação, conta ativa ou bot real.

| Viewport solicitado | Evidência | Resultado observado |
| --- | --- | --- |
| 1440×1000 | [Desktop](2026-10-28%20-%20WhatsApp%20landing/landing-desktop.png) | Página renderizada; cinco destinos iguais; sem overflow horizontal. |
| 768×1024 | [Tablet](2026-10-28%20-%20WhatsApp%20landing/landing-tablet.png) | Conteúdo e CTA visíveis, sem overflow horizontal. |
| 390×844 | [Celular](2026-10-28%20-%20WhatsApp%20landing/landing-celular.png) | Conteúdo e CTA visíveis, sem overflow horizontal. |

Navegador integrado via Computer Use; plugin Browser não disponível no catálogo da sessão, importação Playwright falhou e a primeira navegação local expirou. Após iniciar o servidor fora do sandbox com autorização, acesso e capturas funcionaram. Tab avançou do CTA inicial ao CTA intermediário; Enter foi exercitado no CTA do rodapé, mas abertura externa da conversa não foi comprovada. Console sem erros; aviso de movimento reduzido do dispositivo. Landing com identidade própria fixa, sem alteração de tema. Imagens completas após percorrer a página para acionar as animações; largura útil pode descontar a barra de rolagem. README preservado: layout/textos exibidos não mudaram, somente destino dos links.

## 21/10/2026 — interface atual e revisão geral

Capturas da aplicação local em `http://127.0.0.1:5183`, com API Express e PostgreSQL descartável reais. Usamos somente contas e dados fictícios do Shopping Exemplo; não interceptamos a API. Edge headless/Playwright foi utilizado porque o plugin Browser não está disponível. Os resultados, a limpeza e os limites estão na [revisão geral](../Documentação/revisao-geral-2026-10-21.md).

| Tela e perfil | Viewport | Captura |
| --- | --- | --- |
| Landing — público | 1440×1000 | [Abertura](2026-10-21%20-%20Revisao%20geral/landing-desktop.png) · [Página completa](2026-10-21%20-%20Revisao%20geral/landing-completa-desktop.png) |
| Landing — público | 390×844 | [Celular, página completa](2026-10-21%20-%20Revisao%20geral/landing-mobile.png) |
| Login — público | 1440×1000 / 390×844 | [Desktop](2026-10-21%20-%20Revisao%20geral/login-desktop.png) · [Celular](2026-10-21%20-%20Revisao%20geral/login-mobile.png) |
| Mapa `/painel` — Gerente | 1440×1000 / 390×844 | [Desktop](2026-10-21%20-%20Revisao%20geral/mapa-desktop.png) · [Celular](2026-10-21%20-%20Revisao%20geral/mapa-mobile.png) |
| Monitoramento `/painel` — Gerente | 1440×1000 | [Busca de sensor/vaga](2026-10-21%20-%20Revisao%20geral/monitoramento-desktop.png) |
| Análise `/painel/analise` — Gerente | 1440×1000 / 768×1024 / 390×844 | [Desktop](2026-10-21%20-%20Revisao%20geral/analise-desktop.png) · [Tablet](2026-10-21%20-%20Revisao%20geral/analise-tablet.png) · [Celular](2026-10-21%20-%20Revisao%20geral/analise-mobile.png) |
| Análise — Gerente, tema escuro | 1440×1000 | [Tema escuro](2026-10-21%20-%20Revisao%20geral/analise-escuro-desktop.png) |
| Análise — Gerente, setor e PCD | 1440×1000 | [Filtros aplicados](2026-10-21%20-%20Revisao%20geral/analise-filtros-desktop.png) |
| Análise — Gerente, período sem histórico | 1440×1000 | [Ausência de observação](2026-10-21%20-%20Revisao%20geral/analise-sem-observacao.png) |
| Shoppings `/admin/shoppings` — Admin | 1440×1000 | [Lista administrativa](2026-10-21%20-%20Revisao%20geral/admin-shoppings-desktop.png) |
| Estrutura `/admin/shoppings/:id/estrutura` — Admin | 1440×1000 | [Equipamentos](2026-10-21%20-%20Revisao%20geral/equipamentos-desktop.png) · [Instalações de telão](2026-10-21%20-%20Revisao%20geral/teloes-admin-desktop.png) |
| Editor na estrutura — Admin | 1440×1000 / 390×844 | [Desktop](2026-10-21%20-%20Revisao%20geral/editor-desktop.png) · [Celular](2026-10-21%20-%20Revisao%20geral/editor-mobile.png) |
| Telão `/telao/:id` — credencial própria | 1920×1080 / 1366×768 | [Full HD](2026-10-21%20-%20Revisao%20geral/telao-desktop.png) · [1366×768](2026-10-21%20-%20Revisao%20geral/telao-desktop-1366.png) |
| Telão — credencial própria | 768×1024 / 390×844 | [Tablet](2026-10-21%20-%20Revisao%20geral/telao-tablet.png) · [Celular](2026-10-21%20-%20Revisao%20geral/telao-mobile.png) |
| Telão — evento offline | 390×844 | [Contagens ocultadas](2026-10-21%20-%20Revisao%20geral/telao-offline-mobile.png) |

As imagens de análise, landing móvel e telão móvel/tablet incluem a página completa; o viewport indica a largura e altura de navegação usadas. A regra de manter prints após alterações de design/frontend está no [AGENTS.md](../../../AGENTS.md). As capturas abaixo de datas anteriores permanecem como histórico e não substituem esta rodada.

## Personas — material recebido e retratos ilustrativos (21/10/2026)

| Persona | Arquivo | Origem |
| --- | --- | --- |
| Carlos | [Perfil original](Personas/carlos-perfil-original.jpg) e [necessidades originais](Personas/carlos-necessidades-original.jpg) | Páginas `5.jpg` e `6.jpg` originais do projeto; mantidas integralmente. |
| Mariana | [Perfil](Personas/mariana-perfil-slide.png), [necessidades](Personas/mariana-necessidades-slide.png) e [retrato ilustrativo](Personas/mariana-retrato-ilustrativo.png) | Retrato gerado com ferramenta de imagem; slides diagramados a partir de hipóteses, sem representar usuária entrevistada. |
| Rafael | [Perfil](Personas/rafael-perfil-slide.png), [necessidades](Personas/rafael-necessidades-slide.png) e [retrato ilustrativo](Personas/rafael-retrato-ilustrativo.png) | Retrato gerado com ferramenta de imagem; slides diagramados a partir de hipóteses, sem representar operador entrevistado. |

Ver [[Vaggu/Especificações/Personas]] para fatos, hipóteses e questões de validação. Os retratos anteriores citados no documento de 16/10 não foram localizados.

Revisamos os quatro slides em 21/10 para acompanhar a referência original de Carlos: Poppins, retratos recortados, textura, retículas e destaques amarelos. A [visão geral dos seis slides](Personas/personas-visao-geral.png) permite comparar os conjuntos. O [registro dos assets](Personas/README.md) documenta origens, prompts de preparação e reprodução local.

Capturas geradas durante validações locais da interface e referências visuais do projeto. Elas documentam o estado observado ou planejado na data de origem; não comprovam sensores, serviços externos, produção nem a interface atual sem nova validação.

> [!important] Estado histórico
> As capturas de P02, P03, P04 e “Melhorias — interações e gerentes” são registros históricos de versões anteriores. O código atual pode divergir delas. A exclusão reversível de gerente está novamente implementada na ficha atual, mas os prints antigos não comprovam seu visual de hoje.

## 24/09/2026 — capturas públicas históricas

Capturadas no frontend local com Chromium/Playwright após aguardar as animações. A largura móvel foi 390 px e a desktop, 1440 px. Não havia sessão autenticada, banco ou deploy sob teste; portanto estas imagens **não** validam Admin, gerente, mapa ou produção.

| Área | Captura | O que mostra |
| --- | --- | --- |
| Landing móvel | ![[Vaggu/Evidências visuais/landing-mobile-2026-09-24.png]] | Hero e acesso ao login em 390 px. |
| Rodapé móvel | ![[Vaggu/Evidências visuais/rodape-mobile-2026-09-24.png]] | Marca, chamada e links, sem a imagem de celulares. |
| Rodapé desktop | ![[Vaggu/Evidências visuais/rodape-desktop-2026-09-24.png]] | Imagem de celulares preservada em 1440 px. |
| Login móvel | ![[Vaggu/Evidências visuais/login-mobile-2026-09-24.png]] | Formulário de entrada em 390 px, sem credenciais. |

No ensaio, o documento não apresentou transbordamento horizontal nas duas larguras e o navegador não registrou erros de página. A ausência de número oficial explica por que o rodapé não mostra botão de WhatsApp; outras chamadas da landing ainda precisam da mesma guarda.

## P02 — Login — histórico

Exemplo principal: ![[Vaggu/Evidências visuais/P02 - Login/login-desktop-final.png]]

- `login-desktop.png` e `login-mobile.png`: composição inicial validada.
- `login-desktop-com-assets.png` e `login-mobile-com-assets.png`: aplicação dos assets de referência do projeto.
- `login-desktop-final.png` e `login-mobile-final.png`: resultado final usado na validação do P02.

## P03 — Administração — histórico

Exemplo principal: ![[Vaggu/Evidências visuais/P03 - Administração/p03-admin-desktop.png]]

- `p03-admin-desktop.png`: gestão administrativa em desktop.
- `p03-admin-mobile.png`: responsividade da gestão administrativa.
- `p03-minha-conta.png`: edição permitida da conta do gerente.

## P04 — Estrutura e mapa — histórico

Exemplo principal: ![[Vaggu/Evidências visuais/P04 - Estrutura e mapa/p04-gerente.png]]

- `p04-admin.png`: configuração de andares, setores, vagas, categorias e posições.
- `p04-gerente.png`: mapa do shopping para o gerente.
- `p04-mobile.png`: mapa e controles em largura móvel, sem rolagem horizontal.

## Origem das capturas de validação

As capturas foram copiadas de pastas temporárias de validação em 12/09/2026. As cópias versionadas nesta área são as referências compartilháveis pelo time; caminhos externos registrados nos diários são apenas evidência histórica da máquina onde a validação ocorreu. Novas imagens da VAGGU devem ser guardadas aqui e citadas no diário correspondente.

## Melhorias — interações e gerentes — histórico

Exemplo principal: ![[Vaggu/Evidências visuais/Melhorias - interações e gerentes/confirmacao-excluir-gerente.png]]

- `login-rabisco-animado.png`: resultado final do contorno SVG desenhado em torno de “vagas”.
- `confirmacao-excluir-gerente.png`: modal de uma versão anterior; não representa necessariamente a ficha atual.
- `aviso-desfazer-exclusao.png`: aparência anterior da ação “Desfazer” durante sete segundos. O comportamento existe novamente, mas precisa de print atual para comparação visual.

## Planejamento e identidade — material de referência do projeto

Pasta de destino: `Vaggu/Evidências visuais/Planejamento/`.

- `sprint-03-planejamento-09-09-2026.jpeg`: quadro da Sprint 3, com período de 09/09 a 16/09, divisão inicial de tarefas para API/banco, Arduino, login e landing page e resumo do planejamento.
- `sprint-04-divisao-equipe.jpeg`: folha da Sprint 4 com divisão de documentação, cronogramas, prototipação de Arduino, pesquisa de Power BI, banco de dados e preparação de novo pitch.
- `guia-identidade-visual-vaggu.png`: guia de referência do projeto com logotipo, Poppins e paleta `#ffe100`, `#ffeb54`, `#fff49d`, `#343231`, `#171717`, `#000000` e `#ffffff`. É referência visual do projeto; não foi extraída do Figma.

Esses três arquivos registram planejamento e direção visual; não comprovam a conclusão das tarefas citadas nem fidelidade das telas ao Figma.

Ver [[Vaggu/Diário/2026-09-12]] e [[Vaggu/Vaggu]].

## 15/10/2026 — editor visual e monitoramento

Capturas locais com Edge/Playwright, API e PostgreSQL reais exclusivos de QA. Usam contas de ensaio e o Shopping Exemplo; não são capturas da publicação remota nem evidência de ESP32 físico. Decidimos preservar as capturas no repositório. O [registro da entrega](../Documenta%C3%A7%C3%A3o/edicao-visual-e-monitoramento.md) descreve contratos, testes e limites.

| Captura | O que comprova |
| --- | --- |
| [Editor desktop](2026-10-15%20-%20Editor%20e%20sensores/editor-desktop.png) | Seleção direta, controles de tamanho/rotação, mapa e salvamento sem tabela de X/Y. |
| [Editor escuro](2026-10-15%20-%20Editor%20e%20sensores/editor-escuro.png) | Mesmos controles no tema escuro. |
| [Editor mobile](2026-10-15%20-%20Editor%20e%20sensores/editor-mobile.png) | Controles adaptados à largura de 390 px, mapa navegável internamente. |
| [Monitoramento desktop](2026-10-15%20-%20Editor%20e%20sensores/monitoramento-desktop.png) | Contagens por situação, filtros e cartões de sensores/placas. |
| [Monitoramento mobile](2026-10-15%20-%20Editor%20e%20sensores/monitoramento-mobile.png) | Organização do monitoramento em tela pequena. |
| [Confirmação pendente](2026-10-15%20-%20Editor%20e%20sensores/sensor-confirmacao.png) | Sensor, placa, horários e transição pendente no detalhe de N-03. |
| [Sensor sem resposta](2026-10-15%20-%20Editor%20e%20sensores/sensor-sem-resposta.png) | Falha individual com o registro de contato da placa preservado. |
| [Análise para apresentação](2026-10-15%20-%20Editor%20e%20sensores/analise-apresentacao.png) | Indicadores do exemplo sem os antigos selos de origem sintética, conforme solicitado. |

## Telões e análises — 17/10/2026

O [registro da entrega](../Documentação/entrega-teloes-analises-2026-10-17.md) reúne os oito prints atuais, resoluções, origem local, mudanças, verificações e limites. Inclui telão de entrada/setores, rosca corrigida, cobertura por setor e filtro responsivo nos temas claro e escuro.


## Planejamento — fotografias recebidas em 19/10/2026

Quatro arquivos originais copiados das imagens originais do planejamento, preservados sem edição. As cópias antigas acima continuam como histórico. Os horários nos nomes de origem identificam os anexos, não a realização das sprints.

| Arquivo em Planejamento/ | Anexo de origem | Período escrito na folha |
| --- | --- | --- |
| [Sprint 3](Planejamento/sprint-03-09-a-16-09-2026.jpeg) | WhatsApp Image 2026-10-19 at 15.59.19.jpeg | 09/09–16/09/2026 |
| [Sprint 4](Planejamento/sprint-04-23-a-30-09-2026.jpeg) | WhatsApp Image 2026-10-19 at 15.59.31.jpeg | 23/09–30/09 |
| [Sprint 5](Planejamento/sprint-05-05-a-19-10-2026.jpeg) | WhatsApp Image 2026-10-19 at 16.04.39.jpeg | 05/10–19/10 |
| [Sprint 6](Planejamento/sprint-06-19-a-28-10-2026.jpeg) | WhatsApp Image 2026-10-19 at 16.04.49.jpeg | 19/10–28/10 |

O contexto do conjunto é 2026; o ano está explícito na folha da Sprint 3. A transcrição completa, responsáveis e limites estão em [[Vaggu/Planejamento/Sprints do projeto]]. As Sprints 1–2 têm somente o registro de memória do projeto. As fotografias comprovam o planejamento registrado, não a entrega ou homologação dos componentes.
