---
aliases: [VAGGU, Vaggu]
tags: [vaggu, indice]
---
# VAGGU

Plataforma web responsiva para gestão de estacionamentos de shopping centers, desenvolvida como TCC.

![[Vaggu/Identidade visual/Assets/vaggu-logo-yellow.svg]]

## Comece aqui

- [[Vaggu/Especificações/Visão do produto]]
- [[Vaggu/Tecnologias/Tecnologias e arquitetura]]
- [[Vaggu/Identidade visual/Identidade visual]]
- [[Vaggu/Evidências visuais/Índice de evidências|Evidências visuais]]
- [[Vaggu/Planejamento/Próximos passos]]
- [[Vaggu/Skills/Skills e regras]]
- [[Vaggu/Fontes/Fontes e limites da importação]]
- [[Vaggu/Diário/2026-09-15|Diário mais recente]]

## Documentação completa recuperada

- [[Vaggu/Documentação/SSD-VAGGU|Especificação completa]]
- [[Vaggu/Documentação/plano-e-aceite|Plano e critérios de aceite]]
- [[Vaggu/Documentação/planejamento-do-projeto|Planejamento técnico e continuidade]]
- [[Vaggu/Documentação/regras-de-codigo|Regras de código]]
- [[Vaggu/Documentação/regras-visuais|Regras visuais]]
- [[Vaggu/Documentação/configuracao|Configuração]]
- [[Vaggu/Documentação/whatsapp-webhook|Webhook WhatsApp]]
- [[Vaggu/Documentação/arquitetura-estrutura-sensores-telao|Estrutura, sensores e telões]]

O próprio cofre está versionado na pasta `segunda-mente/` do repositório VAGGU.

**Estado atual:** P01–P04 concluídos. O P05 está em andamento: a API cria, persiste e consulta prévias CSV/XLSX sem alterar vagas; a confirmação atômica está implementada no backend, com validação PostgreSQL real e interface administrativa ainda pendentes. Autenticação, gestão administrativa, Minha conta, estrutura e mapa estão integrados. Ver [[Vaggu/Planejamento/Próximos passos]].


**Atualização de 11/09:** autenticação real integrada e validada. Foto original do login ainda pendente. [[Vaggu/Documentação/validacao-login-2026-09-11|Ver resultados]].

**Atualização de 12/09:** P03 e P04 concluídos e validados. O mapa usa dois andares, setores, categorias e posições proporcionais; sensores e telões continuam em pacotes posteriores.

**Atualização de 13/09:** o Admin pode excluir logicamente um shopping e consultar a senha provisória de cada gerente até a primeira troca. A exclusão encerra os acessos e preserva estrutura e histórico; depois da troca, a senha provisória é apagada e aparece apenas “senha redefinida”.

**Atualização de 14/09:** a segunda mente passou a integrar o repositório. O P05 recebeu leitores CSV/XLSX, validação por linha, identificação de criação/atualização e persistência isolada das prévias no PostgreSQL.

**Atualização de 15/09:** a confirmação backend do P05 foi implementada de forma idempotente e serializada por shopping para criar/atualizar estrutura sem apagar histórico; falta reexecutar integração PostgreSQL real nesta retomada e criar a tela administrativa.
