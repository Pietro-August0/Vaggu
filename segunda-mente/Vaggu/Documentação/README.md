# Documentação da VAGGU

Estrutura inicial de 09/09/2026 • revisão de uso em 23/09/2026 • Português brasileiro

Esta pasta reúne as decisões de produto, o desenho técnico, os padrões de código e os critérios de aceite do projeto. “SSD” é o nome adotado para a especificação principal; a documentação descreve tanto o que já existe quanto o destino planejado da plataforma.

## Arquivos e finalidade

| Arquivo | O que contém |
| --- | --- |
| [AGENTS.md](../../../AGENTS.md) | Instruções centrais de trabalho para o Codex e seus agentes. |
| [SSD-VAGGU.md](SSD-VAGGU.md) | Escopo, fluxos, permissões, dados, API proposta, telemetria, Power BI e decisões pendentes. |
| [regras-de-codigo.md](regras-de-codigo.md) | Português brasileiro, comentários, nomes, arquitetura, pastas, segurança e qualidade. |
| [regras-visuais.md](regras-visuais.md) | Identidade da VAGGU, componentes, mapa, telões, responsividade e conferência do Figma. |
| [plano-e-aceite.md](plano-e-aceite.md) | Etapas, testes concretos, trabalho com agentes e definição de pronto. |
| [planejamento-do-projeto.md](planejamento-do-projeto.md) | Inventário verificado, revisão final, backlog, diário e pacote para o próximo início. |
| [fluxo-de-telas.md](fluxo-de-telas.md) | Rotas e jornadas atuais por perfil, páginas planejadas e divergências encontradas entre interface e backend. |
| [modelo-de-dados.md](modelo-de-dados.md) | Entidades e relações implementadas no Prisma/PostgreSQL, limites atuais e evolução prevista para a telemetria. |
| [mapa-do-projeto.md](mapa-do-projeto.md) | Explica a estrutura do repositório e a responsabilidade de cada arquivo versionável. |
| [configuracao.md](configuracao.md) | Guia sequencial para um parceiro instalar, iniciar, verificar, testar e encerrar o sistema local sem publicar segredos. |
| [whatsapp-webhook.md](whatsapp-webhook.md) | Detalha configuração, segurança e limites do webhook da Meta. |
| [arquitetura-estrutura-sensores-telao.md](arquitetura-estrutura-sensores-telao.md) | Separa estrutura, telemetria, estados confiáveis e contagens dos telões. |
| [validacao-login-2026-09-11.md](validacao-login-2026-09-11.md) | Preserva a evidência datada da validação do login. |

Para continuar o desenvolvimento, use `$start` no início do dia e `$end` no fechamento. As fontes versionadas estão em [skills/start](../../../skills/start/SKILL.md) e [skills/end](../../../skills/end/SKILL.md); a forma de instalação e o comportamento diário estão no planejamento.

## Como usar no projeto

1. Para executar ou testar o sistema, comece pelo [guia de configuração](configuracao.md).
2. Antes de alterar o projeto, leia o `AGENTS.md` da raiz.
3. Consulte o SSD para entender escopo, regras de negócio e decisões pendentes.
4. Use os guias de código e interface conforme a área modificada.
5. Relacione cada entrega aos cenários do plano de aceite.
6. Confira o código e os testes: documentação planejada não comprova implementação.

O `AGENTS.md` funciona como ponto de entrada para as instruções do projeto. O SSD é uma referência explicitamente indicada por ele, não um arquivo que depende de reconhecimento automático pelo nome. As fontes externas usadas na especificação estão nas [referências](SSD-VAGGU.md#referencias).

## Prompt inicial para copiar

```text
Leia o AGENTS.md aplicável ao repositório e os arquivos canônicos em segunda-mente/Vaggu/Documentação. Responda e documente em português brasileiro.

Primeiro inspecione o projeto existente: estrutura, package.json, lockfile, schema e migrations, autenticação, telas, testes e integrações. Produza um diagnóstico com evidências por arquivo: implementado e verificado, parcial, ausente ou não verificado. Não considere a documentação uma prova de implementação.

Considere as decisões atuais: mapa com navegação entre andares; landing levando ao WhatsApp; parceria e criação dos acessos pelo Admin; vários gerentes por shopping; telões com comuns, PCD, idosos e elétricas, sem motos; monitoramento das placas ESP32; Power BI alimentado por histórico confiável.

Planeje a próxima entrega de menor escopo útil, respeitando as dependências de plano-e-aceite.md. Se esta sessão já autoriza implementação, execute a etapa solicitada até concluir e validar. Se o pedido for somente análise, entregue o diagnóstico e o plano.

Use as skills disponíveis que se aplicam à tarefa, lendo suas instruções. Use subagentes quando houver subtarefas independentes e autorização no ambiente; defina arquivos responsáveis e critérios de aceite. Integre e confira os resultados. Não afirme ter usado agentes, ferramentas ou testes que não executou.

Mantenha comentários explicativos por módulo, função de domínio e trecho não trivial. Use nomes brasileiros descritivos para novos assets, arquivos de domínio e identificadores, preservando os contratos e nomes obrigatórios das ferramentas. Reaproveite o que já existe.

Antes de uma alteração visual, consulte regras-visuais.md e o nó correspondente do Figma. Se faltar acesso, preserve os tokens existentes e informe exatamente o que não pôde conferir. Não invente cores hexadecimais ou fontes como se tivessem sido extraídas.

Ao finalizar, relate o que mudou, quais cenários foram verificados, limitações reais e a próxima dependência. Atualize apenas a documentação afetada pela entrega.
```

## O que está confirmado e o que depende de conferência

- O escopo considera as decisões de Pietro e o documento mestre revisado em 09/09/2026.
- Regras de código e de organização foram elaboradas para este pedido e passam a orientar novas entregas.
- Modelos de dados, rotas e detalhes de infraestrutura marcados como **proposta** devem ser conciliados com o repositório.
- P01–P05 e C01 estão concluídos. A importação CSV/XLSX foi validada no PostgreSQL real e na interface Admin autenticada; exclusões administrativas e desfazer foram restaurados na ficha atual. P06 é a próxima entrega de produto.
- A referência visual é o [Figma VAGGU](https://www.figma.com/design/xKI9wjoiZ5CoXC3DXIJNmq/Vaggu?node-id=2022-2). A consulta atual atingiu o limite da integração; não houve nova extração dos tokens. Os valores exatos a confirmar estão registrados no guia visual.
- A documentação não contém credenciais. Mudanças no Figma, Trello ou repositório remoto só podem ser afirmadas quando houver evidência registrada na sessão correspondente.

## Atualização do pacote

Uma nova decisão de produto deve registrar data, motivo, regra substituída e impacto em telas, API, banco e testes. Evitar cópias divergentes: especificação no SSD, regras de engenharia no guia de código, identidade no guia visual e cenários no plano de aceite.
