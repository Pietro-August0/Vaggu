# Plano de correção e implementação

Atualizado em 23/09/2026. Este plano começa pelos problemas comprovados na auditoria e mantém os pacotes técnicos P01–P11 como referência de produto. Não cria datas ou infraestrutura ainda não aprovadas.

## Objetivo

Alinhar documentação, interface, API e evidências antes de iniciar a telemetria. O projeto deve voltar a ter uma descrição única e verificável do que existe, do que regrediu e do que ainda será construído.

## Resultado da auditoria de 23/09/2026

Os estados abaixo descrevem o conjunto depois da consolidação D01. Quando a documentação está completa, isso não significa que todos os módulos planejados já foram implementados.

### 1. O que já temos

| Área | Estado | Evidência atual |
| --- | --- | --- |
| Visão geral e PRD | Completo para o escopo conhecido | Problema, público, objetivo, experiência, metas, MVP, posterior e fora do escopo estão em `Visão do produto.md`; personas aguardam o conteúdo já criado pela equipe. |
| TRD e arquitetura | Completo para o estado atual | Tecnologias implementadas e planejadas, versões relevantes, motivos e diagramas estão em `Tecnologias e arquitetura.md`. |
| Banco de dados | Completo para o schema atual | Entidades, campos, relações, uso e limites do P06 estão em `modelo-de-dados.md`. |
| API existente | Completo para as rotas atuais | O inventário do backend foi reconciliado no `vaggu-backend/README.md`. |
| Decisões e histórico técnico | Completo para as decisões encontradas | Decisões datadas ficam no SSD; entregas e verificações ficam no planejamento canônico. |
| Configuração local | Completo para o fluxo documentado | Guia de configuração, exemplos de ambiente sem segredos e scripts reais permanecem documentados. |

### 2. O que está incompleto

| Área | Estado | O que falta |
| --- | --- | --- |
| Design | Parcial | Extrair ou confirmar no Figma tamanhos, espaçamentos, sombras, estados e componentes; a paleta e Poppins vieram da evidência fornecida pela equipe. |
| Evidências atuais da interface | Parcial | Gerar novas capturas da ficha Admin, importação, mapa, erros e larguras menores depois de C01. |
| Sprints históricas | Parcial | Informar datas e divisão individual das Sprints 1–2 e o período da Sprint 4. |
| Personas | Parcial por dependência da equipe | Inserir no PRD as personas já desenvolvidas, sem criar substitutas. |
| WhatsApp comercial | Parcial | Confirmar número e ambiente Meta e concluir o P10. |

### 3. O que estava desatualizado

- PRD e TRD apresentavam o P05 como parcial mesmo após sua validação de 21/09; corrigido no D01.
- Capturas antigas de exclusão de gerente apareciam sem aviso de que o frontend atual regrediu; corrigido no catálogo e no fluxo de telas.
- Resumos colocavam P06 como retomada imediata sem registrar a correção C01; a ordem foi atualizada.
- A documentação da API e dos dados continha diferenças em relação às rotas e ao schema atuais; o inventário e o modelo foram reconciliados.

### 4. O que ainda não existe

- Na interface atual: exclusão de gerente, desfazer por sete segundos e exclusão de shopping, embora existam contratos correspondentes no backend.
- Como páginas próprias: visão geral administrativa, equipamentos, atendimentos, análises, conta completa e telões.
- Como produto operacional: telemetria confiável, manutenção, contagens para telões, histórico analítico, exportações e relatório Power BI funcional.
- Como decisão confirmada: contrato final entre ESP32, sensores e backend, retenção operacional e distribuição do Power BI.

Essas ausências não autorizam a criação imediata de todas as páginas. C01 corrige regressões comprovadas; P06–P11 continuam sujeitos às dependências e aos critérios do backlog.

### 5. Estrutura documental preservada

Não foi criada uma pasta `docs/` paralela. A segunda mente já era a fonte canônica e continua organizada por finalidade:

- `Especificações/`: visão geral e PRD;
- `Tecnologias/`: TRD e arquitetura resumida;
- `Documentação/`: SSD, fluxo, dados, API relacionada, regras, aceite, configuração e continuidade;
- `Planejamento/`: sprints, correções e próximos passos;
- `Identidade visual/` e `Evidências visuais/`: referência visual, capturas e fontes;
- `Diário/`: histórico datado, sem substituir o estado atual.

### 6. Ordem de ação

1. D01 — consolidar documentação e evidências: concluído em 23/09.
2. C01 — reconciliar a interface administrativa: próxima implementação.
3. P06 — implementar telemetria confiável depois do contrato de hardware.
4. P07–P09 — operação, telões, métricas e Power BI sobre dados confiáveis.
5. P10–P11 — concluir WhatsApp e preparar a apresentação integrada conforme dependências.

### 7. Divisão inicial da próxima sprint

| Integrante | Papel base | Responsabilidade inicial |
| --- | --- | --- |
| Pietro | Fullstack | Integrar C01 e revisar o contrato transversal do P06. |
| Ana | Frontend e Scrum Master | Acompanhar a sprint, documentação e navegação da ficha Admin. |
| Kamilly | Backend | Preparar e revisar regras de servidor e integração com o hardware. |
| Samuel | Backend e dados | Validar isolamento, persistência, API e evolução do modelo. |
| Juan | Frontend e UI | Implementar e conferir os controles visuais e a responsividade. |
| Elisa | Frontend e UX | Revisar jornada, acessibilidade, mensagens e cenários de uso. |

A divisão detalhada, dependências e critérios permanecem em [Sprints do projeto](Sprints%20do%20projeto.md) e nas seções seguintes.

## Concluído em 23/09/2026 — D01: consolidação documental

**Responsável principal:** Ana.

**Revisores:** Samuel para produto e dados, Juan para identidade visual, Elisa para fluxo e experiência e Pietro para integração.

### Trabalho

- Registrar as Sprints 1–4 e separar sprint de pacote técnico.
- Consolidar PRD e TRD sem duplicar o SSD.
- Documentar fluxo de telas e modelo de dados atuais.
- Corrigir o inventário real da API.
- Registrar a paleta e a tipografia fornecidas pela equipe.
- Marcar capturas antigas como históricas e catalogar as novas evidências.
- Atualizar decisões, rastreabilidade, índices e mapa do projeto.
- Corrigir os resumos que ainda apresentavam P05 como parcial.

### Aceite

- Nenhum documento atual afirma que a confirmação do P05 está ausente.
- Funcionalidades históricas ou planejadas não aparecem como implementação atual.
- Personas permanecem como `INFORMAÇÃO A SER FORNECIDA`.
- Sprints 1 e 2 preservam somente o que a equipe confirmou.
- `node scripts/verificar-documentacao.mjs` conclui sem erro.

**Resultado:** documentos e evidências foram reconciliados e o verificador foi aprovado sobre o conjunto integrado. Campos que dependem de confirmação da equipe continuam explicitamente pendentes.

## Próximo — C01: reconciliar a interface administrativa

**Responsável principal:** Pietro, por atravessar frontend e backend.

**Especialistas:** Juan em UI, Elisa em jornada/QA, Samuel nas regras persistentes e Ana na documentação.

### Problemas comprovados

1. O backend possui exclusão lógica de shopping e gerente, mas o frontend atual não apresenta essas ações.
2. O frontend não apresenta o desfazer da exclusão de gerente, embora o backend ofereça a rota.
3. Evidências antigas mostram ações que não existem no checkout atual.
4. A ficha administrativa reúne muitos blocos numa página longa e precisa de navegação mais clara.
5. Alguns estados selecionados não expõem estado acessível equivalente; o mapa não oferece nova tentativa após erro.
6. CTAs do WhatsApp podem ficar visualmente ativos sem destino quando o número oficial não está configurado.

### Ordem de implementação

1. Revalidar manualmente a ficha Admin no navegador e registrar o comportamento atual.
2. Restaurar exclusão de gerente com confirmação, bloqueio durante o envio, mensagem de sucesso e ação de desfazer por sete segundos.
3. Restaurar exclusão de shopping com confirmação de impacto, sem inventar desfazer ou reativação ainda ausentes no backend.
4. Recarregar lista/ficha após cada ação e tratar falha sem perder o contexto do usuário.
5. Melhorar navegação interna da ficha e estados acessíveis dos controles tocados.
6. Tratar o CTA de WhatsApp sem número oficial com mensagem clara, sem link vazio.
7. Criar evidências atuais e substituir apenas referências que deixaram de representar a tela.

### Aceite

- Fluxos administrativos usam as rotas reais e não expõem senha ou hash.
- Outro shopping ou gerente não é afetado por uma ação fora do seu alvo.
- Exclusão e desfazer preservam IDs e histórico conforme CA34.
- Frontend lint e build aprovados.
- Fluxos verificados em desktop e celular, incluindo teclado, confirmação, erro e sucesso.
- Documentação e evidências atualizadas na mesma entrega.

## Depois — P06: telemetria confiável

**Responsáveis principais:** Kamilly para backend/Arduino e Samuel para dados; Pietro integra o fluxo completo.

Antes de criar endpoints, a equipe precisa confirmar:

- credencial e identidade da placa;
- código e vínculo dos sensores;
- identificador de inicialização e sequência;
- frequência real das leituras;
- lacuna máxima entre observações;
- timeout de placa e de sensor;
- comportamento após reinicialização e mensagem atrasada.

O aceite permanece CA15–CA24. Uma leitura isolada ou heartbeat não pode tornar uma vaga livre.

## Mais tarde

| Ordem | Entrega | Dependência principal |
| --- | --- | --- |
| P07 | Operação, manutenção, contagens e telões | P06 |
| P08 | Histórico, métricas e exportações | P06/P07 |
| P09 | Primeiro relatório funcional Power BI | P08 |
| P10 | Fluxos comerciais WhatsApp | Número oficial e ambiente Meta; pode avançar em paralelo |
| P11 | Integração e apresentação do TCC | Entregas usadas na demonstração |

## Riscos controlados

- Não iniciar telas de telão com contagens simuladas antes de existir estado confiável.
- Não usar capturas antigas como prova do checkout atual.
- Não transformar propostas do SSD em tabelas ou rotas sem dependência demonstrada.
- Não renumerar os pacotes técnicos para fazê-los coincidir com as sprints históricas.
- Não publicar, commitar ou alterar o Figma como consequência automática deste plano.
