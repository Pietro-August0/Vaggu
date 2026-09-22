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

**Estado atual:** P01–P05 concluídos. A importação CSV/XLSX foi validada no PostgreSQL real e na interface Admin autenticada, incluindo prévia inválida, confirmação concorrente, preservação de IDs/histórico e recarga da estrutura. Autenticação, gestão administrativa, Minha conta, estrutura e mapa estão integrados. O próximo pacote é o P06, de telemetria e estados confiáveis. Ver [[Vaggu/Planejamento/Próximos passos]].


**Atualização de 11/09:** autenticação real integrada e validada. Foto original do login ainda pendente. [[Vaggu/Documentação/validacao-login-2026-09-11|Ver resultados]].

**Atualização de 12/09:** P03 e P04 concluídos e validados. O mapa usa dois andares, setores, categorias e posições proporcionais; sensores e telões continuam em pacotes posteriores.

**Atualização de 13/09, substituída em 21/09 para a credencial:** o Admin pode excluir logicamente um shopping; a exclusão encerra os acessos e preserva estrutura e histórico. A senha provisória agora aparece somente na criação ou redefinição e não é armazenada de forma reversível.

**Atualização de 14/09:** a segunda mente passou a integrar o repositório. O P05 recebeu leitores CSV/XLSX, validação por linha, identificação de criação/atualização e persistência isolada das prévias no PostgreSQL.

**Atualização de 15/09:** a confirmação backend do P05 foi implementada de forma idempotente e serializada por shopping; a tela Admin envia CSV/XLSX, oferece modelo CSV, apresenta prévia/erros e confirma a aplicação. Falta reexecutar integração PostgreSQL real e validar o fluxo autenticado contra a API real.

**Atualização de 21/09:** P05 concluído após corrigir o advisory lock para o Prisma 7 e montar a importação na ficha administrativa correta. A integração PostgreSQL aprovou 32/32 cenários; o navegador autenticado confirmou o fluxo válido e inválido, a atualização da estrutura e a responsividade sem transbordamento da página.

**Atualização de 21/09 — mapa e foto:** Admin e gerente passaram a compartilhar a visualização 2D responsiva. O gerente vê a estrutura mesmo antes da ativação, mutações administrativas recarregam o mapa sem refresh, a senha provisória pode ser copiada somente quando é emitida e a foto do shopping usa referência HTTPS do Vercel Blob em vez de binário no PostgreSQL.
