# Conclusão do software — implementação de 19/10/2026

> **Fechamento local posterior — 21/10/2026:** a [revisão geral](revisao-geral-2026-10-21.md) aprovou a suíte completa com **130 testes, zero falhas e zero ignorados**, incluindo dump/restauração. A conferência no navegador com API e PostgreSQL locais reais cobriu filtros, ausência de observação, PDF/Excel, análise em desktop/tablet/celular, monitoramento e telão. O bloqueio local mencionado nos registros abaixo foi contornado para esta rodada. Há novas capturas e uma correção de grade/espaçamento no telão web. Produção e hardware físico continuam pendentes; os resultados 127/129/9 abaixo preservam as rodadas anteriores.

### Primeira verificação adicional de 21/10/2026 — histórico

Nesta retomada, o backend compilou e nove testes focados em cálculos analíticos passaram; um deles é novo e verifica cobertura indisponível quando o período contém histórico, mas a capacidade atual é zero. A consulta agora identifica setores pelo andar e nome, evitando somar homônimos de andares distintos. Frontend build e lint passaram; o build manteve aviso de chunks acima de 500 kB. O verificador documental cobriu 319 arquivos e validou links/âncoras de 51 documentos. `git diff --check` passou. A suíte completa não foi repetida: as rotas de teste que abrem portas locais receberam `EACCES` neste ambiente, então esses casos não são relatados como aprovados nesta retomada. As 129 aprovações mencionadas abaixo pertencem à execução integrada anterior. A inspeção visual completa de filtros, estados vazios e responsividade da análise ainda depende de navegador com acesso ao localhost; exportações e tela foram exercitadas na rodada anterior com dados fictícios.

> **Atualização de 21/10/2026 (posterior ao registro histórico abaixo):** após incorporação na pasta principal, o backend passou com **129 testes, zero falhas e zero ignorados**, incluindo PostgreSQL descartável, migrations e dump/restauração; frontend build e lint passaram, com aviso de tamanho de chunks no build. O verificador documental anterior cobriu 315 arquivos e validou links/âncoras de 51 documentos. No navegador com dados fictícios, telão desktop/mobile, aviso de saída do editor e abertura/exportação de análise foram conferidos; PDF e Excel foram abertos para inspeção. A rodada posterior encontrou bloqueio de localhost no navegador integrado: filtros, estados vazios e responsividade completos da análise ainda exigem conferência visual. Em 21/10, uma revisão corrigiu agregação de setores homônimos em andares diferentes e cobertura sem capacidade atual. Nenhuma migration foi aplicada em produção. A conexão real do WhatsApp foi adiada; Power BI publicado permanece opcional.

## Situação desta revisão

Implementação local na branch `feat/conclusao-software-pietro`, iniciada a partir de `origin/main` em `69692606`. O checkout isolado preserva as alterações da landing na pasta original. A validação integrada está em andamento. Há verificação local restrita do telão no navegador, descrita abaixo; não comprova execução em produção, conexão física de sensores, publicação Power BI ou atendimento real pela Meta.

A sequência e os aceites estão em [Conclusão do software](../Planejamento/Conclus%C3%A3o%20do%20software.md). As sprints reais estão em [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md); não se confundem com os pacotes P01–P11.

## Atualização operacional e edição

O hook compartilhado consulta a estrutura a cada 15 segundos, evita sobreposição do ciclo automático e oferece atualização manual. Uma resposta posterior a outra consulta não substitui o resultado mais recente. O prazo de 30 segundos começa no início da requisição: ao vencer, perder conexão ou falhar a consulta, as leituras deixam de indicar disponibilidade válida. O retorno à aba invalida os dados até nova consulta. Essa proteção complementa a expiração individual dos sensores no servidor.

Mapa, resumo operacional e prévia de telão utilizam a estrutura atualizada. A configuração administrativa suspende o ciclo automático durante operações de edição. O editor de mapa possui confirmação ao navegar com rascunho e alerta ao sair da página; o roteador passou a suportar bloqueio de navegação. O funcionamento dessas interações ainda precisa de verificação no navegador.

## Análises e relatórios

- Dados ausentes deixam indicadores sem observação; não são substituídos por séries fictícias.
- Ocupação usa tempo ocupado dividido pelo tempo conhecido (`LIVRE` + `OCUPADA`). Quando não há tempo conhecido, retorna `null`, e não zero.
- Cobertura informa a proporção de tempo conhecido em relação à capacidade de referência. A capacidade é a estrutura atualmente ativa no recorte; não é uma reconstrução histórica da capacidade instalada. Mudanças de cadastro precisam ser consideradas ao interpretar comparações.
- Entradas são transições observadas de livre para ocupada. Saídas são encerramentos observados de ocupada para livre no período.
- Permanência média considera somente ciclos completos encerrados no período UTC, com duração total observada, inclusive início anterior ao período. Ciclos abertos ou interrompidos por ausência de leitura não equivalem a permanência zero.
- Rotatividade observada é entradas do período divididas pelas vagas atualmente ativas no filtro; sem capacidade de referência, retorna `null`.
- O recorte por setor/categoria aplica-se às consultas, à comparação com período anterior e aos relatórios Excel/PDF. Tipos aceitos: `COMUM`, `PCD`, `IDOSO`, `ELETRICA`.

### Histórico congelado e limite do legado

A migração `20261019000100_classificacao_historica` acrescenta snapshots de andar, setor, código e categoria da vaga. Um trigger captura a classificação em novas inserções; edições posteriores do cadastro não reclassificam esses eventos.

Eventos que já existiam são preenchidos com o cadastro disponível no momento da migração, com `classificacao_confirmada=false`. Isso não recupera nem comprova a classificação original. A view `power_bi_intervalos_ocupacao` expõe essa marca, IDs do recorte e saída observada. Indicadores que incluem o legado continuam sujeitos a esse limite; não os apresentar como reconstrução perfeita. O congelamento ocorre na inserção do evento, não por uma reconstrução do cadastro na data de uma leitura atrasada.

## Equipamentos, comunicação e manutenção

O Admin VAGGU pode cadastrar placa, alterar nome/ativação, gerar nova chave, vincular sensor a vaga ativa e registrar/encerrar manutenção. O servidor valida o shopping, o vínculo placa/sensor/vaga e conflitos de códigos. As chaves são armazenadas como hash e retornadas em texto apenas na criação ou rotação; a listagem não expõe hash nem chave.

Desativar placa ou abrir manutenção invalida as leituras afetadas. Encerrar manutenção exige conclusão registrada e novas leituras confirmadas antes de recuperar disponibilidade. Um heartbeat não encerra a manutenção manual nem transforma vaga em livre.

Ocorrências de comunicação são deduplicadas por equipamento. A perda da placa agrupa falhas dos sensores associados; observação individual e contato da placa têm recuperação distinta. Shopping de demonstração é excluído da geração automática de ocorrências de comunicação. Após a correção da revisão final, a lista retorna todas as ocorrências abertas e até 100 encerradas recentes. Gerente tem consulta ao próprio shopping; operações administrativas exigem perfil VAGGU.

## Telões instalados

Uma instalação possui nome, recorte opcional de andar/setor e credencial própria revogável. O setor precisa pertencer ao andar e ao shopping escolhidos. A consulta usa `Authorization: Telao <chave>` e retorna somente agregados, grupos, categorias, horário e validade, sem contas ou credenciais.

A página `/telao/:telaoId` recebe a chave por formulário; ela não integra a URL. Depois de autenticar, a chave fica em `sessionStorage` da aba, ou em memória se o armazenamento não estiver disponível. A página consulta a cada 15 segundos e oculta contagens vencidas após 30 segundos. Credencial revogada é removida ao receber 401. As categorias especiais são subconjuntos e não devem ser somadas novamente ao total. `parcial` indica que nem toda capacidade tem leitura válida.

## Contratos HTTP acrescentados ou ampliados

Todos os caminhos abaixo usam o prefixo `/api/v1`. Rotas administrativas exigem sessão, senha regularizada e perfil VAGGU. Consultas e respostas com credenciais usam `Cache-Control: no-store`.

| Método e caminho | Contrato |
| --- | --- |
| `GET /estacionamento/analise` | Shopping da sessão; `inicio` e `fim` civis UTC inclusivos, até 31 dias; opcionais `setorId` e `tipo`. |
| `GET /shoppings/:shoppingId/analise` | Mesmo recorte analítico, para o Admin. |
| `GET /shoppings/:shoppingId/equipamentos` | Placas/sensores sem segredos e ocorrências recentes. |
| `POST /shoppings/:shoppingId/equipamentos` | `{ codigo, nome }`; retorna placa e chave uma única vez. |
| `PATCH /shoppings/:shoppingId/equipamentos/:id` | `{ nome?, ativo? }`. |
| `POST /shoppings/:shoppingId/equipamentos/:id/chave` | Rotaciona credencial; chave anterior deixa de autenticar. |
| `POST /shoppings/:shoppingId/equipamentos/:id/sensores` | `{ codigo, vagaId }`; vínculo exclusivo com vaga do shopping. |
| `POST /shoppings/:shoppingId/equipamentos/:id/manutencao` | `{ motivo, sensorId? }`; sem sensor, afeta a placa. |
| `POST /shoppings/:shoppingId/ocorrencias/:id/encerrar` | `{ conclusao }`; encerra manutenção manual. |
| `GET /estacionamento/ocorrencias` | Consulta autenticada de ocorrências no shopping da sessão. |
| `GET /shoppings/:shoppingId/teloes` | Lista instalações, sem chaves. |
| `POST /shoppings/:shoppingId/teloes` | `{ nome, andarId?, setorId? }`; retorna instalação e chave uma vez. |
| `DELETE /shoppings/:shoppingId/teloes/:id` | Revoga instalação; não remove o histórico do cadastro. |
| `GET /teloes/:id/disponibilidade` | Credencial própria no header; sem necessidade de sessão administrativa. Limite de 180 requisições por minuto na configuração atual. |

## WhatsApp: orientação e proteção contra duplicidade

O menu responde a saudações e `MENU`; opções 1–5 orientam sobre produto, funcionalidades, demonstração, suporte e contato com nosso atendimento. Respostas não reconhecidas e mídia não disparam esse menu. O fluxo não constitui sistema de tickets, agendamento confirmado ou garantia de atendimento humano. Não foram enviadas mensagens reais como parte desta documentação.

Antes da chamada externa, o evento passa de `PROCESSANDO` para `ENVIANDO`. Sucesso confirmado permite `PROCESSADO`. Uma rejeição explícita da Meta ou falta de configuração pode resultar em `FALHOU`, permitindo retomada na reentrega. Timeout ou erro de resultado incerto depois de iniciar envio resulta em `REVISAO`, sem reenvio automático.

Se o processo parar durante `ENVIANDO`, uma reentrega após dois minutos marca `REVISAO` com `RESULTADO_ENVIO_INCERTO`; enquanto recente, não assume novo envio. A revisão precisa confrontar o resultado na Meta antes de qualquer ação manual. Não redefinir o status para provocar reenvio sem essa conferência. A migração `20261019000400_whatsapp_envio_incerto` acrescenta os dois estados ao enum persistido. A política evita repetição automática incerta; não promete entrega exatamente uma vez em sistemas externos.

## Renovação explícita do cenário de apresentação

Executar a partir de `vaggu-backend`, com dependências instaladas e schema atualizado no ambiente de demonstração escolhido. A variável `DEMO_DATABASE_URL` é obrigatória; o script não usa `DATABASE_URL` como fallback. Configurar a conexão fora do histórico versionado.

```powershell
# Prévia (dry run): não grava eventos nem altera estado de vagas.
npm.cmd run demo:renovar

# Aplicação explícita no cenário de demonstração selecionado.
npm.cmd run demo:renovar -- --apply
```

O script exige o ID fixo `d3a09b29-7e5a-4b7e-8c42-8f371d0a0001`, `demonstracao=true` e shopping não excluído. Planeja transições sintéticas recentes de até 14 dias e acrescenta apenas eventos posteriores ao último de cada vaga; preserva contas, IDs, estrutura e sensores. Estado atual e histórico avançam na mesma transação. Repetição para a mesma referência temporal não deve duplicar transições. A prévia obtém travas transacionais, mas não grava os dados. Esse procedimento não é rotina de coleta real nem recuperação de backup.

## Migrações e verificação restante

Além de snapshots e estados WhatsApp, as migrações `20261019000200_operacao_equipamentos` e `20261019000300_teloes` criam manutenção/ocorrências e instalações com vínculos consistentes por shopping. A presença dos arquivos não significa aplicação em banco publicado.

Foram acrescentados testes de analytics, equipamentos e telões com PostgreSQL isolado e testes de planejamento da renovação. A suíte final do backend passou com **127 testes, zero falhas e zero ignorados**, após correção do acesso a sensor nulo. Usou PostgreSQL descartável em `127.0.0.1:55439` com todas as migrações. O frontend passou em **build e lint, sem avisos de lint**, após ajuste do encerramento do hook. Esses resultados locais não substituem homologação de produção. O telão instalado foi verificado no navegador com API interceptada, conforme a cobertura abaixo. Editor validado depois, conforme registro abaixo; analítico ainda sem teste no navegador.

Pendências externas: homologação Meta com conta autorizada, validação autenticada do ambiente publicado e conexão física de hardware (fora do escopo solicitado). Backups/restauração e políticas operacionais devem ser verificados antes de declarar entrega integrada.


### Validação documental

`node scripts/verificar-documentacao.mjs` passou: 313 arquivos cobertos pelo mapa e 50 documentos Markdown com links e âncoras locais válidos. Resultado registrado antes de quaisquer arquivos posteriores desta implementação.


### Navegador — cobertura restrita do telão

Executado em Edge headless via Playwright, em `localhost:5179`, nas resoluções 1366×900 e 390×844. Foi usado Playwright porque o plugin Browser não estava disponível. A API foi interceptada com fixture controlada; portanto, esta etapa verifica a interface e não a integração ponta a ponta com o backend real.

A autorização exibiu quatro vagas livres e indicação parcial. O evento offline ocultou a contagem. Não ocorreram `pageerrors` nem overflow horizontal no mobile. Foram produzidas `outputs/telao-desktop.png` e `outputs/telao-mobile.png` na pasta desta tarefa, fora do repositório; a captura mobile foi inspecionada. O editor também foi validado, conforme registro abaixo; o analítico ainda não.

### Revisão final e editor

Revisão independente encontrou três falhas corrigidas: códigos de placa/sensor incompatíveis com telemetria; manutenção aberta oculta por limite dos últimos 100 registros; cobertura superior a 100% depois de alteração de capacidade. O cadastro valida códigos compatíveis, a consulta inclui todas as ocorrências abertas mais 100 encerradas recentes e a cobertura é explicitamente estimada sobre a capacidade atual. Quando o tempo observado excede essa referência, retorna null (indisponível), sem limitar artificialmente a 100%. Ainda não existe versionamento da capacidade ativa para reconstruir um denominador histórico exato.

O editor foi testado no Edge headless, 1366×900, com API interceptada: alteração da vaga por teclado → navegação para Shoppings → aviso de rascunho → continuar preserva a tela → descartar permite navegação. Zero pageerrors. Isso não comprova persistência ponta a ponta.

O retorno inicial não forneceu os dados de configuração externa. Em esclarecimento posterior, registramos um número ainda não configurado e a decisão de conectá-lo; falta distinguir se será remetente do bot ou destinatário de teste. A homologação externa permanece pendente; nenhum envio real foi feito. O código está na branch local de conclusão, sem publicação ou migration em produção. Build apresenta aviso de tamanho de chunks, sem falha de compilação.

### Escopo esclarecido em 19/10/2026

Registramos que o Power BI foi usado até aqui para projetar os gráficos. Os gráficos do site são renderizados pela aplicação. Publicar/incorporar relatório Power BI é uma evolução opcional, não um requisito para concluir os gráficos existentes. Não considerar a ausência de workspace um bloqueio do escopo atual. O número de WhatsApp previsto para a integração ainda não está configurado para testes; a autorização para conectar não comprova registro na Meta nem envio realizado. O telefone não é gravado no repositório.
