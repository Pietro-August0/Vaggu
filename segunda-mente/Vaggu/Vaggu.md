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
- [[Vaggu/Planejamento/Sprints do projeto|Sprints do projeto]]
- [[Vaggu/Planejamento/Plano de correção e implementação|Plano de correção e implementação]]
- [[Vaggu/Planejamento/Próximos passos]]
- [[Vaggu/Documentação/planejamento-do-projeto|Registro diário e próximo trabalho]]
- [[Vaggu/Diário/2026-09-15|Diário histórico de 15/09]]

## Documentos do projeto

- [[Vaggu/Documentação/SSD-VAGGU|Especificação completa]]
- [[Vaggu/Documentação/plano-e-aceite|Plano e critérios de aceite]]
- [[Vaggu/Documentação/planejamento-do-projeto|Planejamento técnico e continuidade]]
- [[Vaggu/Documentação/fluxo-de-telas|Fluxo de telas atual e planejado]]
- [[Vaggu/Documentação/modelo-de-dados|Modelo de dados atual e evolução prevista]]
- [[Vaggu/Documentação/regras-de-codigo|Regras de código]]
- [[Vaggu/Documentação/regras-visuais|Regras visuais]]
- [[Vaggu/Documentação/configuracao|Configuração]]
- [[Vaggu/Documentação/whatsapp-webhook|Webhook WhatsApp]]
- [[Vaggu/Documentação/arquitetura-estrutura-sensores-telao|Estrutura, sensores e telões]]

O próprio cofre está versionado na pasta `segunda-mente/` do repositório VAGGU.

**Estado atual:** P01–P05, D01 e C01 estão concluídos. O sistema já possui login, gestão de shoppings e gerentes, importação, mapa compartilhado, histórico confirmado e painéis de análise. A base de sensores também já recebe eventos, evita repetições, confirma mudanças e marca como indisponível o sensor que parou de responder; os testes com PostgreSQL foram aprovados. Ainda faltam testar com o ESP32 real, criar as telas de equipamentos e manutenção, fazer o mapa considerar a validade de cada sensor, concluir telões e exportações e conferir a versão publicada. O Power BI ainda não está integrado ao produto. Ver [[Vaggu/Documentação/planejamento-do-projeto|planejamento]] e [[Vaggu/Documentação/fluxo-de-telas|fluxo de telas]].

**Hospedagem registrada em 23/09:** frontend e API são entregues pelo mesmo serviço Render, conectado ao PostgreSQL no Neon. Consulte [[Vaggu/Documentação/configuracao|configuração]] e [[Vaggu/Tecnologias/Tecnologias e arquitetura|arquitetura]] para o funcionamento versionado; endereço público e resultado das publicações devem ser conferidos no Render/GitHub.


**Atualização de 11/09:** autenticação real integrada e validada. A foto e o contorno do login foram fornecidos pela equipe e incorporados à tela. [[Vaggu/Documentação/validacao-login-2026-09-11|Ver resultados]].

**Atualização de 12/09:** P03 e P04 concluídos e validados. O mapa usa dois andares, setores, categorias e posições proporcionais; sensores e telões continuam em pacotes posteriores.

**Atualização de 13/09, substituída em 21/09 para a credencial:** o Admin pode excluir logicamente um shopping; a exclusão encerra os acessos e preserva estrutura e histórico. A senha provisória agora aparece somente na criação ou redefinição e não é armazenada de forma reversível.

**Atualização de 14/09:** a segunda mente passou a integrar o repositório. O P05 recebeu leitores CSV/XLSX, validação por linha, identificação de criação/atualização e persistência isolada das prévias no PostgreSQL.

**Atualização de 15/09 — registro histórico:** a confirmação do P05 já podia ser repetida sem duplicar dados e processava uma importação por vez em cada shopping. Naquela data ainda faltavam os testes completos; eles foram concluídos em 21/09.

**Atualização de 21/09:** P05 concluído após corrigir o advisory lock para o Prisma 7 e montar a importação na ficha administrativa correta. A integração PostgreSQL aprovou 32/32 cenários; o navegador autenticado confirmou o fluxo válido e inválido, a atualização da estrutura e a responsividade sem transbordamento da página.

**Atualização de 21/09 — mapa e acessos:** Admin e gerente passaram a compartilhar a visualização 2D responsiva. O gerente vê a estrutura mesmo antes da ativação, mutações administrativas recarregam o mapa sem refresh e a senha provisória pode ser copiada somente quando é emitida.

**Atualização de 24/09 — leitura e evidências:** o cadastro de shopping foi dividido em etapas, a ficha recolhe a edição e o rodapé móvel deixou de repetir a imagem de celulares. A [galeria de evidências](./Evidências%20visuais/Índice%20de%20evidências.md) identifica capturas públicas atuais e separa as imagens históricas. O [README da raiz](../../README.md) apresenta proposta, experiência, fotos comentadas e tecnologias; datas e limites permanecem nesta documentação interna.

**Atualização de 30/09 — sensores e análises:** a base de telemetria foi exercitada com PostgreSQL, e o painel passou a consultar o histórico confirmado dos últimos sete dias. Quando não há histórico, a interface mantém uma demonstração claramente identificada. Isso adianta partes de P06 e P08, mas não conclui hardware, manutenção, telões, exportações nem Power BI.
