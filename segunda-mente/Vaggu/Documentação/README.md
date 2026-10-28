# Documentação da VAGGU

Estrutura inicial de 09/09/2026 • revisão geral em 21/10/2026 • Português brasileiro

Esta pasta reúne as decisões de produto, o desenho técnico, os padrões de código e os critérios de aceite do projeto. “SSD” é o nome adotado para a especificação principal; a documentação descreve tanto o que já existe quanto o destino planejado da plataforma.

## Arquivos e finalidade

| Arquivo | O que contém |
| --- | --- |
| [telao-apresentacao-2026-10-21.md](telao-apresentacao-2026-10-21.md) | Protótipo funcional do telão, gestão pelo gerente, tela cheia/Esc e verificação visual. |
| [revisao-geral-2026-10-21.md](revisao-geral-2026-10-21.md) | Revisão atual: 130 testes, capturas reais locais, correção do telão, limpeza e regra de prints. |
| [AGENTS.md](../../../AGENTS.md) | Nossos acordos para desenvolver, documentar, verificar e usar Git. |
| [SSD-VAGGU.md](SSD-VAGGU.md) | Escopo, fluxos, permissões, dados, API proposta, telemetria, Power BI e decisões pendentes. |
| [regras-de-codigo.md](regras-de-codigo.md) | Português brasileiro, comentários, nomes, arquitetura, pastas, segurança e qualidade. |
| [regras-visuais.md](regras-visuais.md) | Identidade da VAGGU, componentes, mapa, telões, responsividade e conferência do Figma. |
| [plano-e-aceite.md](plano-e-aceite.md) | Etapas, cenários de teste e definição de pronto. |
| [planejamento-do-projeto.md](planejamento-do-projeto.md) | Inventário verificado, revisão final, backlog, diário e pacote para o próximo início. |
| [fluxo-de-telas.md](fluxo-de-telas.md) | Rotas e jornadas atuais por perfil, páginas planejadas e divergências encontradas entre interface e backend. |
| [edicao-visual-e-monitoramento.md](edicao-visual-e-monitoramento.md) | Edição direta das vagas, monitoramento individual, dados de apresentação, testes e evidências de 15/10. |
| [auditoria-documental-2026-10-15.md](auditoria-documental-2026-10-15.md) | Revisão do estado atual, divergências corrigidas, prioridades restantes e limites das verificações. |
| [modelo-de-dados.md](modelo-de-dados.md) | Entidades e relações implementadas no Prisma/PostgreSQL, limites atuais e evolução prevista para a telemetria. |
| [mapa-do-projeto.md](mapa-do-projeto.md) | Explica a estrutura do repositório e a responsabilidade de cada arquivo versionável. |
| [configuracao.md](configuracao.md) | Guia sequencial para um parceiro instalar, iniciar, verificar, testar e encerrar o sistema local sem publicar segredos. |
| [whatsapp-webhook.md](whatsapp-webhook.md) | Detalha configuração, segurança e limites do webhook da Meta. |
| [arquitetura-estrutura-sensores-telao.md](arquitetura-estrutura-sensores-telao.md) | Separa estrutura, telemetria, estados confiáveis e contagens dos telões. |
| [validacao-login-2026-09-11.md](validacao-login-2026-09-11.md) | Preserva a evidência datada da validação do login. |

Para continuar o desenvolvimento, consulte a situação atual e o próximo trabalho no [planejamento](planejamento-do-projeto.md). Ao encerrar uma sessão, registre resultados, verificações e limitações nesse mesmo documento.

## Como usar no projeto

1. Para executar ou testar o sistema, comece pelo [guia de configuração](configuracao.md).
2. Antes de alterar o projeto, leia o `AGENTS.md` da raiz.
3. Consulte o SSD para entender escopo, regras de negócio e decisões pendentes.
4. Use os guias de código e interface conforme a área modificada.
5. Relacione cada entrega aos cenários do plano de aceite.
6. Confira o código e os testes: documentação planejada não comprova implementação.

O `AGENTS.md` é o ponto de entrada para os acordos de trabalho. O SSD reúne as regras do produto, e as fontes externas usadas nele ficam nas [referências](SSD-VAGGU.md#referencias).

## O que está confirmado e o que depende de conferência

- O escopo considera as decisões de Pietro e o documento mestre revisado em 09/09/2026.
- Nossas regras de código e organização orientam as novas entregas.
- Modelos de dados, rotas e detalhes de infraestrutura marcados como **proposta** devem ser conciliados com o repositório.
- P01–P05 e C01 estão concluídos. O código atual inclui confirmação/expiração dos sensores, cadastro e vínculo de equipamentos, manutenção e ocorrências, mapa com atualização a cada 15 segundos e telões com credencial própria revogável. A análise oferece até 31 dias UTC, comparação, setor/categoria, entradas, saídas, permanência, rotatividade, cobertura e Excel/PDF. Os novos eventos preservam a classificação histórica; eventos legados sem fotografia confirmada continuam sinalizados. Hardware físico e homologação publicada seguem pendentes. Power BI publicado é opcional e a conexão real do WhatsApp foi adiada. O estado local e as verificações datadas estão na [conclusão do software](conclusao-software-2026-10-19.md).

- A referência visual é o [Figma VAGGU](https://www.figma.com/design/xKI9wjoiZ5CoXC3DXIJNmq/Vaggu?node-id=2022-2); esta revisão confere o repositório e não extrai novos tokens do Figma.
- Mudanças no Figma, Trello, produção ou repositório remoto só são registradas como realizadas quando houver evidência específica.

## Atualização do pacote

Uma nova decisão de produto deve registrar data, motivo, regra substituída e impacto em telas, API, banco e testes. Evitar cópias divergentes: especificação no SSD, regras de engenharia no guia de código, identidade no guia visual e cenários no plano de aceite.
