# Documentação da VAGGU

Estrutura inicial de 09/09/2026 • revisão de uso em 30/09/2026 • Português brasileiro

Esta pasta reúne as decisões de produto, o desenho técnico, os padrões de código e os critérios de aceite do projeto. “SSD” é o nome adotado para a especificação principal; a documentação descreve tanto o que já existe quanto o destino planejado da plataforma.

## Arquivos e finalidade

| Arquivo | O que contém |
| --- | --- |
| [CONTRIBUTING.md](../../../CONTRIBUTING.md) | Acordos da equipe para desenvolver, documentar, verificar e usar Git. |
| [SSD-VAGGU.md](SSD-VAGGU.md) | Escopo, fluxos, permissões, dados, API proposta, telemetria, Power BI e decisões pendentes. |
| [regras-de-codigo.md](regras-de-codigo.md) | Português brasileiro, comentários, nomes, arquitetura, pastas, segurança e qualidade. |
| [regras-visuais.md](regras-visuais.md) | Identidade da VAGGU, componentes, mapa, telões, responsividade e conferência do Figma. |
| [plano-e-aceite.md](plano-e-aceite.md) | Etapas, cenários de teste e definição de pronto. |
| [planejamento-do-projeto.md](planejamento-do-projeto.md) | Inventário verificado, revisão final, backlog, diário e pacote para o próximo início. |
| [fluxo-de-telas.md](fluxo-de-telas.md) | Rotas e jornadas atuais por perfil, páginas planejadas e divergências encontradas entre interface e backend. |
| [modelo-de-dados.md](modelo-de-dados.md) | Entidades e relações implementadas no Prisma/PostgreSQL, limites atuais e evolução prevista para a telemetria. |
| [mapa-do-projeto.md](mapa-do-projeto.md) | Explica a estrutura do repositório e a responsabilidade de cada arquivo versionável. |
| [configuracao.md](configuracao.md) | Guia sequencial para um parceiro instalar, iniciar, verificar, testar e encerrar o sistema local sem publicar segredos. |
| [whatsapp-webhook.md](whatsapp-webhook.md) | Detalha configuração, segurança e limites do webhook da Meta. |
| [arquitetura-estrutura-sensores-telao.md](arquitetura-estrutura-sensores-telao.md) | Separa estrutura, telemetria, estados confiáveis e contagens dos telões. |
| [validacao-login-2026-09-11.md](validacao-login-2026-09-11.md) | Preserva a evidência datada da validação do login. |

Para continuar o desenvolvimento, consulte a situação atual e o próximo trabalho no [planejamento](planejamento-do-projeto.md). Ao encerrar uma sessão, registre resultados, verificações e limitações nesse mesmo documento.

## Como usar no projeto

1. Para executar ou testar o sistema, comece pelo [guia de configuração](configuracao.md).
2. Antes de alterar o projeto, leia o `CONTRIBUTING.md` da raiz.
3. Consulte o SSD para entender escopo, regras de negócio e decisões pendentes.
4. Use os guias de código e interface conforme a área modificada.
5. Relacione cada entrega aos cenários do plano de aceite.
6. Confira o código e os testes: documentação planejada não comprova implementação.

O `CONTRIBUTING.md` é o ponto de entrada para os acordos de trabalho. O SSD reúne as regras do produto, e as fontes externas usadas nele ficam nas [referências](SSD-VAGGU.md#referencias).

## O que está confirmado e o que depende de conferência

- O escopo considera as decisões de Pietro e o documento mestre revisado em 09/09/2026.
- Regras de código e de organização foram elaboradas para este pedido e passam a orientar novas entregas.
- Modelos de dados, rotas e detalhes de infraestrutura marcados como **proposta** devem ser conciliados com o repositório.
- P01–P05 e C01 estão concluídos. P06 está em andamento, com recepção e confirmação de leituras já testadas no PostgreSQL. P08 também começou com histórico e análises dos últimos sete dias. Hardware real, manutenção, telões, exportações e Power BI funcional continuam pendentes.
- A referência visual é o [Figma VAGGU](https://www.figma.com/design/xKI9wjoiZ5CoXC3DXIJNmq/Vaggu?node-id=2022-2). A consulta atual atingiu o limite da integração; não houve nova extração dos tokens. Os valores exatos a confirmar estão registrados no guia visual.
- A documentação não contém credenciais. Mudanças no Figma, Trello ou repositório remoto só podem ser afirmadas quando houver evidência registrada na sessão correspondente.

## Atualização do pacote

Uma nova decisão de produto deve registrar data, motivo, regra substituída e impacto em telas, API, banco e testes. Evitar cópias divergentes: especificação no SSD, regras de engenharia no guia de código, identidade no guia visual e cenários no plano de aceite.
