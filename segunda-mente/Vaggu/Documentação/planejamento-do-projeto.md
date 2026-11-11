# VAGGU — planejamento e continuidade do projeto

## Comentários do navegador — 11/11/2026

Cinco ajustes solicitados após observação do site publicado: contraste das categorias com ícones/números coloridos; gráficos com alturas compatíveis sem lacuna externa e comparação abaixo; remoção de Cadastro atual do recorte; Filtros à esquerda junto ao período; pesquisa/filtros/diagnóstico antes dos andares no mapa. Sem alteração de métricas, API ou regras de disponibilidade. Roteamento UI/UX: Juan/Elisa como referências, sem atribuir participação real; integração na branch local `codex/fix/pendencias-tcc-pietro`, base `acfc4a76`, identidade Git existente preservada. Playwright usado porque o plugin Browser não está disponível nesta sessão. Capturas fictícias em três viewports nos dois temas e desktop amplo1625×884 nas análises. Comandos: build/lint frontend, scripts focados de composição e ordem do mapa em ambiente.local, verificador documental e diff check. Evidências e limites no índice; envio à main segue autorização vigente do usuário, sem inferir publicação Render.

## Fechamento para envio à main — 11/11/2026

Atualizações autorizadas pelo usuário para envio direto à main, partindo de `185c0bbc`. Build e lint frontend aprovados; backend: 100 testes aprovados e 12 integrações ignoradas por ausência de TEST_DATABASE_URL. A primeira execução isolada falhou por EACCES nas conexões locais; repetida fora do isolamento com sucesso. Revisão estática sem bloqueios ou padrões de credenciais; evidências visuais atuais com dados fictícios. Verificador documental e diff check aprovados. O envio ao Git não comprova implantação Render nem validação do site publicado. [Pendências vigentes](../Planejamento/Próximos%20passos.md#estado-vigente--11112026): versão publicada, evidência WhatsApp, limites da bancada e ensaio do TCC; dependências residuais em manutenção. Nenhuma coautoria ou aprovação da equipe foi atribuída.

## Alinhamento do resumo — 11/11/2026

Correção CSS da altura relativa de ícones, valores e títulos nos quatro indicadores, com região de apoio reservada e bordas uniformes. Sem mudança de API ou métricas. QA local `node ambiente.local/alinhamento-resumo-qa.cjs`: três viewports/dois temas, posições medidas, cobertura parcial/100%/ausente, estados/filtros/teclado/exportações. Comandos de build/lint frontend, verificador documental e diff check. Mesma branch local/base185c0bbc, alterações preservadas; sem commit/publicação.

## Cobertura no resumo — 11/11/2026

Aviso parcial movido do topo para apoio do indicador Ocupação média, com percentual e ressalva de tempo observado. [Registro](clareza-analises-2026-11-11.md). Validação local: build/lint, `node ambiente.local/cobertura-resumo-qa.cjs`, três viewports e dois temas, coberturas parcial/100%/ausente, ausência de observações e falha/recuperação; `node scripts/verificar-documentacao.mjs` e `git diff --check`. Mesma branch local/base185c0bbc, alterações anteriores preservadas, sem commit/publicação ou dados reais.

## Clareza das análises — continuação de 11/11/2026

[Decisões e limites](clareza-analises-2026-11-11.md): total fora da rosca, card sem esticar, explicações curtas e indicadores legíveis no celular. Sem leitura e indisponíveis mantidos separados conforme semântica do servidor. Mesma branch local/base, sem publicação e sem descartar alterações anteriores. Validação: build/lint frontend, seis combinações de viewport/tema, 42 PNGs, teclado/filtros/avançados/exportação Excel-PDF, ausência/falha/recuperação, sem overflow ou console inesperado; roteiro `node ambiente.local/clareza-analises-qa.cjs`. Conferência documental com `node scripts/verificar-documentacao.mjs` e `git diff --check`. Limite: fixtures locais, sem prova de publicação ou hardware.

## Painel e configurações — complemento de 11/11/2026

Atendida nova referência visual e a remoção da faixa superior solicitada pelo usuário. Configurações centraliza conta, claro/escuro, solicitar alterações (gerente) e saída; navegação operacional permanece limpa. Desktop sem faixa de contexto; celular/tablet com menu/config compactos. Conta na mesma janela, senha preexistente preservada e rotas legadas compatíveis. Análises com quatro cartões compactos, categorias discretas abaixo e gráfico principal maior. [Decisões e limites](configuracoes-e-painel-2026-11-11.md).

Build/lint frontend e QA de 12 combinações perfil/viewport/tema aprovados. 94 PNGs atuais, incluindo mapa/editor para atualizar README. Validado PATCH de conta simulado, senha sem preenchimento, modo claro/escuro, rotas de conta, foco e logout com falha/sucesso, sem envio ao contato externo ou conta real. Roteiros `ambiente.local/painel-configuracoes-qa.cjs` e `painel-configuracoes-prints.cjs`, ignorados pelo Git. Verificador documental e diff conferidos antes da entrega; build mantém aviso de chunks grandes. Revisão estática independente sem regressão bloqueadora; acrescentado H1 apenas acessível para preservar navegação por título sem reintroduzir faixa visual.

Mesma branch local e base, alterações anteriores preservadas; sem commit, push, publicação, credencial/banco real, backend ou hardware alterados. A conferência publicada e a avaliação com usuários permanecem separadas da prova local.

## Hierarquia das análises — ajuste de 11/11/2026

Usuário preferiu a composição anterior e pediu hierarquia em vez de ocultação extensa. [Revisão vigente](hierarquia-analises-2026-11-11.md): categorias em faixa neutra, resumo com ocupação média/entradas/tempo médio, evolução e fotografia da consulta, movimento e setores visíveis; técnicos em Dados avançados. Filtros em popup e atualização silenciosa preservados. Build/lint passaram; seis cenários de largura/tema com 36 PNGs, filtros, teclado, exportações e estados de ausência/falha aprovados com fixtures de navegador. README, mapa e galeria atualizados. Sem mudança de API, dependências, dados reais ou identidade Git; mesma branch local, sem commit/publicação. Limites e comandos completos no registro.

## Simplificação dos painéis — execução de 09/11, fechamento em 11/11/2026

Aplicado o brief profissional fornecido pelo usuário: mapa como principal, diagnóstico secundário e dados técnicos recolhidos, atualização saudável sem barra/horário piscando, análise com três indicadores principais e dois gráficos, filtros de mapa/diagnóstico/editor/telões/análise em popup e pesquisa visível. Admin abre no mapa; configuração e manutenção permanecem disponíveis. Sem mudanças de backend, autenticação, banco, firmware ou dados do produto.

[Diagnóstico em quatro classes, mudanças, preservação de capacidades e limites](simplificacao-paineis-2026-11-09.md). [Galeria da entrega](../Evidências%20visuais/2026-11-09%20-%20Simplificacao%20dos%20paineis/README.md): 114 PNGs, seis combinações desktop/tablet/celular e claro/escuro, com dados fictícios somente no navegador. Browser plugin ausente; Edge/Playwright autorizado fora do isolamento. O roteiro validou rascunhos/cancelamento/limpeza, filtros durante polling, busca em outro andar, diagnóstico/detalhes e retorno de foco, ausência de observação, consulta lenta/falha/recuperação, downloads Excel/PDF, manutenção e edição por teclado/desfazer/conflito. Inclui proteção de navegação do gerente, sem alegar novo ensaio de autorização do servidor.

Comandos aprovados: `npm.cmd --prefix vaggu-frontend run build`, `npm.cmd --prefix vaggu-frontend run lint`, `node ambiente.local/ux-simplificacao-qa.cjs`, `node scripts/verificar-documentacao.mjs` (1151 arquivos e 62 Markdown com links/âncoras válidos) e `git diff --check`. Build mantém aviso de chunks grandes. A revisão de código identificou e corrigiu feedback de salvamento oculto, foco após diagnóstico e sobreposição da exportação; os prints também levaram ao ajuste da largura da pesquisa e compactação de indicadores no celular. Nenhum erro inesperado de console ou overflow da página na matriz final; respostas 503/409 foram falhas deliberadas de QA. README aponta às novas experiências afetadas, preservando imagens anteriores.

Alterações anteriores preservadas na branch somente local `codex/fix/pendencias-tcc-pietro`, base `20205056`, sem troca de identidade ou branch. Elisa indicada para UX, Juan para UI, Pietro para integração e Ana para documentação, sem aprovação/coautoria atribuída. Sem commit, push, PR, publicação ou mensagens. A entrega exige conferência no ambiente de destino quando publicada e avaliação de uso com pessoas; não reabre o aceite histórico de 04/11 nem comprova hardware/produção.

## Correções de contato, dependências e apresentação — 09/11/2026

Continuação autorizada pelo usuário após a revisão de pendências. Branch somente local `codex/fix/pendencias-tcc-pietro`, base `20205056`; preservadas todas as alterações documentais anteriores. O nome inicial da continuação foi `codex/fix/contato-apresentacao-juan`; ajustado ao incluir backend. Responsável primário indicado: Pietro para integração; Juan para frontend, Kamilly/Samuel para revisão técnica de dependências/telemetria e Ana para documentação, sem aprovação ou coautoria atribuída. Identidade Git preservada; sem commit, PR, push ou publicação.

- **Contatos corrigidos:** a conferência no navegador ampliou o achado de dois para quatro links: hero, card, Sobre e operação. Quando o número é vazio/inválido, usam e-mail empresarial com rótulos, ícones e abertura coerentes. Número válido preserva o WhatsApp; rodapé/404 mantêm suas guardas. Os três TSX passaram por revisão independente sem achados acionáveis.
- **Apresentação:** o usuário informou duas possibilidades, **30/11 ou 03/12/2026**, e duração habitual de **10–20 minutos**. Data definitiva e horário seguem sem confirmação. [Canva utilizado](https://canva.link/pd7uk2f8llcr498) abriu no navegador como “TCC- Vaggu”; capa identificada, sem revisão integral ou edição dos slides. O [cenário](cenario-de-apresentacao.md) registra a referência e um roteiro proposto nos limites de 10/20 minutos, substituindo a antiga previsão de 20–25 minutos.
- **Backend:** lockfile atualiza body-parser 2.3.0→2.4.0, proxy-addr 2.0.7→2.0.8, fast-uri 3.1.7→3.1.9 e qs 6.16.0→6.17.1. Auditoria atual: **4→0 alertas**. Build aprovado; suíte sem variáveis de banco do processo: **100 testes aprovados, 12 integrações ignoradas, zero falhas**. WhatsApp **19/19**, incluindo seis opções e contratação demonstrativa, com persistência/transporte simulados. Não comprova banco ou Meta reais.
- **Frontend:** Vite 8.2.2→8.2.6, faixa mínima `^8.2.6`, e transitivos atualizados nas faixas permitidas, incluindo Zod principal 4.5.4→4.6.7. Auditoria atual: **31→17 alertas**, zero críticos, 2 altos, 14 moderados e 1 baixo. Restam cadeias de Zod3/shadcn, minimatch, deepmerge e uuid/ExcelJS; corrigir exige avaliação própria de versões principais ou dependência sem patch direto. Não aplicado `audit fix --force`, que propunha downgrades. Não equivale a 17 vulnerabilidades exploráveis no código publicado; o uso concreto e a cadeia precisam ser analisados.
- **Comandos e limites:** auditorias `npm audit --json`, atualizações dirigidas com `--ignore-scripts`, sem force/majors novos; build backend, `node --test dist/test/whatsapp.test.js`, suíte backend com conexões reais removidas do processo, `npm run build` e `npm run lint` frontend. Build/lint aprovados após atualizar dependências. Build mantém chunks de aproximadamente 757 kB (principal) e 929 kB (ExcelJS carregado sob demanda); isso é medida do artefato local, não ensaio de carga/latência em produção. Polling de 500 ms preservado; não alterado sem medição do destino.

**Verificação visual:** matriz de 18 cenários e capturas em [Contato sem WhatsApp](../Evidências%20visuais/2026-11-09%20-%20Contato%20sem%20WhatsApp/README.md). Browser plugin not available; Playwright/Edge autorizado fora do isolamento. A primeira inicialização do Edge falhou no isolamento e o Vite isolado ficou inacessível ao navegador externo. O cache compartilhado de três Vites gerou EPERM/504; configurações temporárias ESM com caches separados passaram a isolar cada cenário. Roteiros/configurações somente em `ambiente.local`, ignorados pelo Git. O aviso da biblioteca Motion sobre movimento reduzido é esperado. Nada desse diagnóstico foi tratado como falha de produção.

**Resultado final da continuação:** 18/18 cenários de contato aprovados com Vite 8.2.6, 72 PNGs atuais, três viewports e dois temas; destinos e Enter nos quatro contatos conferidos, sem links sem `href`, overflow, overlay ou erros inesperados. Prints representativos de celular, tablet e desktop inspecionados visualmente após concluir transições. `node scripts/verificar-documentacao.mjs` aprovado com 1034 arquivos cobertos e 60 documentos Markdown; `git diff --check` sem erros. Revisão estática independente dos TSX sem achados acionáveis. O README mantém capturas históricas do percurso com número válido, cuja experiência visível foi preservada.

**Continuidade:** conferir publicação das revisões recentes do WhatsApp e capturar o cliente real anonimizado quando houver sessão; ensaiar sensores físicos/piloto HTTPS e apresentação; avaliar alertas residuais e medir carga/polling no ambiente de destino. Nenhum envio real, alteração em banco, regravação de ESP32, publicação ou edição do Canva executados nesta rodada. Aceite web de 04/11, dispensa de backup e recorte demonstrativo permanecem preservados.

## Revisão de pendências — 09/11/2026

Revisão solicitada pelo usuário na branch local `docs/revisao-pendencias-ana`, criada da `origin/main` atualizada em `20205056`, com árvore inicial limpa. Ana Clara é a responsável documental indicada pelo roteamento; Samuel e Pietro são revisores sugeridos de escopo e integração, sem aprovação ou coautoria atribuída. Identidade Git preservada; sem commit, push ou publicação nesta revisão.

Este quadro prevalece sobre diagnósticos antigos. Conferimos documentação, scripts reais dos pacotes, código e testes versionados. O aceite web de 04/11 foi confirmado pelo usuário; não é uma nova execução em produção pelo agente. Nenhum serviço externo, banco, hardware ou conversa WhatsApp foi exercitado nesta revisão.

| Item encontrado | Estado confirmado e encaminhamento |
| --- | --- |
| Homologação geral do site / P07 e P08 | Encerrada pela confirmação do usuário em 04/11. Corrigidas tabelas que ainda a apresentavam aberta. Alterações posteriores exigem suas próprias evidências. |
| Equipamentos, manutenção, ocorrências, mapa/editor, filtros, métricas e exportações | Implementados. Históricos que os apresentavam ausentes não são backlog atual. Preservados os limites de snapshots legados e da capacidade histórica. |
| Figma e design | Site aprovado em 16/10; reprodução exata dispensada. Conciliação documental de tokens e conferência de contraste continuam melhorias específicas, sem reabrir aprovação visual. |
| P06 / ESP32 | Ensaio local inicial dos três canais registrado em 21/10. Permanecem ensaio sustentado, reinício/silêncio/retorno, tempos finais e comprovação ponta a ponta do piloto HTTPS. TLS já está implementado em `transporte.h`; corrigida afirmação contrária no guia. |
| Parâmetros da telemetria | Código: confirmação padrão 30000 ms, lacuna 15000 ms, timeouts de placa/sensor 120000 ms e job de expiração 30000 ms. Horário do servidor é a autoridade. Mapa tenta renovar a cada 500 ms; telão instalado usa 15 s e validade visual de 30 s. Ajustes históricos de bancada não comprovam configuração atual de produção. |
| WhatsApp / P10 | Conexão e percurso com imagem/site/recursos/retorno confirmados em 04/11. Código de 06/11 possui seis opções, incluindo contratação demonstrativa. Conferência publicada das mudanças de 05–06/11 e captura anonimizada continuam específicas; falta de sessão impede a captura real. Atendimento humano, coleta comercial e protocolos dispensados no TCC. |
| Backup, retenção e contingência | Procedimentos definidos em `operacao-dados-tcc.md`; backup dispensado expressamente no recorte TCC. Expurgo automático não implementado nem exigido. Implantação comercial exigiria revisão própria. |
| CTAs sem número válido | Corrigidos na continuação de 09/11: quatro contatos (hero, card, Sobre e operação) usam e-mail quando o número está vazio/inválido; rótulos e ícones acompanham o canal. Rodapé e 404 preservam suas guardas. Evidências e verificações registradas na continuação abaixo. |
| Desempenho, dependências e simplificação | Medir polling/chunks no destino; reavaliar auditoria de dependências antes de citar contagens antigas. Etapas restantes do plano de simplificação são propostas, não bloqueadores automaticamente aceitos. |
| P11 / apresentação e personas | Datas possíveis informadas em 09/11: 30/11 ou 03/12/2026; duração habitual de 10–20 minutos. Confirmar escolha/horário e ensaiar o hardware que for utilizado; instalação física de telão somente se adotada. Validação com representantes das personas não tem pesquisa registrada. |
| Power BI e evoluções | Publicação Power BI opcional. Reativação de shopping excluído e tela de atendimentos não implementadas; não são requisitos novos desta revisão. |
| “Pendente” no código | Troca obrigatória de senha, cadastro incompleto, estado candidato de sensor, comparação e requisições em voo são estados operacionais legítimos. Busca por marcadores TODO/FIXME/HACK/XXX não encontrou tarefas de implementação nesses formatos; não removemos esses estados. |

**Rotina abandonada removida:** excluídos os seis registros de `segunda-mente/Atualizações diárias/` e o modelo de diário geral, conforme pedido. Conteúdo VAGGU já representado nos diários técnicos foi mantido; contexto da criação da segunda mente e cancelamento da rotina incorporado aos diários de 11/09 e 06/11. Corrigidos índice, rotina, modelos, ideias, artigos e vínculos dos diários. Plugin de notas diárias desativado; sua configuração aponta para o diário VAGGU se for reativado manualmente, evitando recriar a pasta abandonada. Nenhum agendamento externo foi alterado nesta revisão.

**Verificações:** `git fetch origin`, inspeção de status/branch/diffs e busca com `rg` por pendências e sinônimos em documentação e fontes; leitura dirigida dos contratos, configuração, polling, CTAs e menu WhatsApp. Validação final: `node scripts/verificar-documentacao.mjs` e `git diff --check`. Alterações somente em documentação/configuração do cofre; builds, testes do produto e navegador não foram repetidos. Resultados de execuções anteriores permanecem datados, sem serem atribuídos a esta sessão.

**Continuidade atualizada:** contatos corrigidos na continuação abaixo; conferir mudanças recentes do WhatsApp no destino, fechar ensaio físico e preparar a apresentação de 10–20 minutos para 30/11 ou 03/12. Não reabrir aceite web, backup ou atendimento comercial dispensados.

**Resultado da validação de 09/11:** verificador aprovado com 961 arquivos cobertos e 59 documentos Markdown com links e âncoras locais válidos; `git diff --check` sem erros. JSONs do Obsidian válidos e ausência da pasta abandonada confirmada. Revisão documental independente do diff sem perda material de contexto identificada.

## Grades de Nossos momentos juntos — 06/11/2026

Cinco fotos e cinco vídeos organizados em duas grades, sem legendas visíveis nos players. Nomes acessíveis e controles nativos preservados. Validação local com node %TEMP%/vaggu-momentos-grid-qa.cjs, build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Publicação pendente.

## Plano de animação — Da vaga ao painel

**Objetivo.** Contar a história de um único carro e de um único dado. A mesma bolinha amarela percorre as três etapas. Um rótulo curto acompanha a ação em cada momento, sem exigir a leitura dos parágrafos.

| Momento | O que aparece | Texto de apoio |
| --- | --- | --- |
| 0–3 s · Detectar | Um carro entra na vaga. O sensor emite ondas e nasce um pacote amarelo. | O sensor detectou o carro |
| 3–6 s · Enviar | O pacote passa por um fio até a placa ESP32. Depois cruza o Wi-Fi até a API. O visto de chegada indica recebimento. | A placa enviou a leitura |
| 6–9 s · Confirmar | O sistema compara leituras consistentes antes de confirmar a ocupação. Um relógio marca uma leitura antiga que segue para indisponível. | O sistema confirmou a ocupação |
| 9–12 s · Visualizar | A mesma vaga muda no mapa. O painel de análises recebe a informação e o telão mostra disponibilidade agregada. | A informação aparece nas telas |

**Composição.** Manter os três títulos atuais. Enviar acontece dentro de Detectar, e os demais momentos seguem Confirmar e Visualizar. No desktop, o pacote percorre a linha da esquerda para a direita. No celular, os quadros empilham e a conexão segue de cima para baixo. Usar SVG e CSS para desenhar a vaga, o fio, o Wi-Fi e as telas. As três etapas estáticas continuam legíveis com movimento reduzido.

**Implementação proposta.** Validar primeiro os quatro quadros estáticos e os rótulos. Em seguida, sincronizar as transições numa única sequência de aproximadamente 12 segundos, iniciada quando a seção entrar na área visível. Testar uma ação curta para rever o percurso em toque e teclado, preservando a abertura sem botão de pausa visível.

**Aceite.** Em desktop, tablet, celular e a 320 px, o público deve conseguir apontar quem detecta o carro, quem transmite, quem confirma e onde o dado aparece. A animação precisa distinguir recebimento de confirmação, e a leitura antiga deve continuar indisponível. Conferir teclado, movimento reduzido, ausência de cortes e console. Registrar capturas antes da publicação.

**Status.** Primeira versão implementada. A trilha agora sincroniza as cenas em 12 segundos, preservando o fio até a placa, Wi-Fi até o sistema e estados de confirmação. Espaço pausa ou retoma com foco na lista. A ação dedicada para rever o percurso fica para uma rodada seguinte. Comandos: node %TEMP%/vaggu-percurso-qa.cjs, build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Publicação pendente.

## Faixa arrastável no memorial — 06/11/2026

A abertura usa rolagem horizontal nativa para toque e arraste com mouse. O avanço automático espera o fim da interação. Os players da daily e dos testes de design foram movidos do Acervo do projeto para Nossos momentos juntos. As setas navegam, e Espaço pausa ou retoma quando a faixa tem foco. Os botões de pausa saíram da abertura e da seção Da vaga ao painel. Espaço também controla os diagramas com foco na lista. Os vídeos do memorial desativam Picture-in-Picture no player. Com movimento reduzido, a faixa fica manual e os clipes ficam estáticos. Comandos: node %TEMP%/vaggu-faixa-arrastavel-qa.cjs, build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Publicação pendente.

## Vídeos na abertura do memorial — 06/11/2026

A faixa alterna cinco imagens e cinco vídeos em 80 segundos. Três clipes novos foram adicionados. Daily e testes de design reaproveitam os arquivos já presentes no acervo, pois os reenvios têm o mesmo conteúdo e resolução. Só os vídeos visíveis tocam, sem som, enquanto a faixa estiver ativa. O clipe de 40 segundos aparece em trechos ao passar pela faixa. O controle pausa tudo e o movimento reduzido inicia pausado. Comandos: node %TEMP%/vaggu-videos-faixa-inspecao.cjs, node %TEMP%/vaggu-videos-faixa-qa.cjs, build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Publicação pendente.

## Bancada e bastidores no memorial — 06/11/2026

Duas fotos fornecidas pelo usuário registram a montagem de três sensores ultrassônicos e uma placa ESP32 em bancada. Os vídeos mostram a troca de ideias da equipe na daily e os testes de design. Incluídos no acervo, com referência técnica no [guia da bancada](../../../hardware/esp32-3-vagas/README.md). As fotos documentam a montagem e não confirmam estabilidade ou funcionamento dos canais. Validação local com node %TEMP%/vaggu-bancada-acervo-qa.cjs, build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Push autorizado pelo usuário.

## Troca dos retratos de Kamilly e Elisa — 06/11/2026

Os JPEGs de 1200×1600 fornecidos pelo usuário foram copiados sem edição e ligados à grade, às miniaturas dos depoimentos e à ampliação pelo mapa do acervo. Os arquivos anteriores ficam preservados como histórico. Validação local com node %TEMP%/vaggu-troca-retratos-qa.cjs, build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Fotografias mascaradas nas evidências. Publicação pendente.

## Caminho da leitura no memorial — 06/11/2026

A cena Detectar passou a mostrar o carro entrando, o sensor percebendo sua presença, a leitura parando na placa ESP32 e seguindo por Wi-Fi até o sistema. O visto mostra recebimento, e a confirmação continua na cena seguinte. O ciclo de Detectar dura seis segundos. Comandos: node %TEMP%/vaggu-caminho-qa.cjs, build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Publicação pendente.

## Cenas em ciclo no memorial — 06/11/2026

As três cenas passaram a se repetir a cada quatro segundos. O sensor pulsa, o pacote percorre a conexão, o servidor sinaliza recepção, o visto é desenhado, o relógio gira e as três telas ganham destaque em sequência. O botão pausa ou retoma todos os diagramas e a preferência de movimento reduzido mantém os SVGs estáticos. Comandos: node %TEMP%/vaggu-etapas-loop-qa.cjs, build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Publicação pendente.

## Animações Da vaga ao painel — 06/11/2026

A seção usa três diagramas SVG com texto curto. Detectar mostra a leitura da vaga e o envio por Wi-Fi da placa ao servidor. Confirmar distingue leitura validada de leitura antiga e indisponível. Visualizar destaca mapa, análises e telão. O movimento é breve e a versão estática preserva as etapas. Validação local com node %TEMP%/vaggu-etapas-qa.cjs, build e lint do frontend, verificador documental e git diff --check. Playwright e Edge usados por indisponibilidade do plugin Browser. Capturas no índice de evidências. Publicação pendente.

## Acesso ao memorial pelo QR code — 06/11/2026

Removido o link do memorial do rodapé da landing. A rota direta continua servindo o QR code e pode ser aberta por quem conhecer o endereço. Comandos de validação: npm.cmd --prefix vaggu-frontend run dev, node %TEMP%/vaggu-rodape-sem-memorial-qa.cjs, build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Publicação pendente.

## Retratos, título e revisão dos depoimentos — 06/11/2026

As funções também aparecem nos retratos. As correções nos depoimentos preservam a voz e o conteúdo. A abertura alinha e centraliza o nome Memorial com a marca VAGGU. Validação local com node %TEMP%/vaggu-retratos-qa.cjs, build e lint do frontend, verificador documental e git diff --check. Playwright/Edge usado por indisponibilidade do plugin Browser. Capturas no índice de evidências. Publicação pendente.

## Funções da equipe no memorial — 06/11/2026

Os seis depoimentos agora mostram a função ao lado do nome, conforme o SSD-VAGGU. Validação local com o servidor do memorial e Playwright/Edge em três tamanhos, com retratos mascarados. Plugin Browser indisponível. Executados npm.cmd --prefix vaggu-memorial-samuel run dev, node %TEMP%/vaggu-funcoes-qa.cjs, build e lint do frontend, verificador documental e git diff --check. Evidências no [índice de capturas](../Evidências%20visuais/Índice%20de%20evidências.md). Publicação pendente.

## Limpeza aprovada e simplificação de telões — 06/11/2026

Retirados três assets públicos e quatro componentes sem consumidores identificados no repositório. A cópia documental do SVG de notebook tem o mesmo hash da cópia removida, e a landing mantém sua referência ao WebP. Os registros de setembro e de 06/11 ficam como histórico. O usuário decidiu encerrar a rotina diária pela fase final do projeto. O aplicativo confirmou a remoção do agendamento.

O serviço de telões passou a reutilizar os filtros de capacidade ativa e a regra de contagem de leituras válidas. Os grupos administrativos mantêm rotas separadas para preservar a origem do shopping e as políticas de cache. A próxima etapa do [plano](revisao-estrutura-e-simplificacao-2026-11-06.md) trata de telemetria e importação.

Comandos: `git status --short --branch`, `git diff`, `rg`, `Get-FileHash`, `npm.cmd --prefix vaggu-backend test`, `npm.cmd --prefix vaggu-frontend run build`, `npm.cmd --prefix vaggu-frontend run lint`, `node scripts/verificar-documentacao.mjs` e `git diff --check`. PostgreSQL descartável local com 140 testes aprovados e um cenário de dump e restauração pulado. Build e lint aprovados. O aviso de chunks grandes do Vite continua. Plugin Browser indisponível. Validação local com Playwright e Edge, `node %TEMP%/vaggu-limpeza-qa.cjs`, em três tamanhos e dois temas. Veja o [índice de evidências](../Evidências%20visuais/Índice%20de%20evidências.md).

## Revisão de estrutura e retomada dos diários — 06/11/2026

Inventário inicial de 852 arquivos rastreados em `main`, com alterações locais preservadas. A [revisão de estrutura](revisao-estrutura-e-simplificacao-2026-11-06.md) registra os candidatos a descarte, o motivo de manter fontes e evidências e a ordem de simplificação. Ajustamos a indentação de telões, reutilizamos o validador de corpo da rota e acrescentamos comentários sobre leituras válidas, credenciais, sequência de telemetria e tentativas de envio. Nenhum candidato foi excluído. A skill de roteamento VAGGU não foi localizada nas buscas locais, e nenhuma responsabilidade ou autoria foi atribuída.

Na primeira rodada foi criado um agendamento local para os diários. A decisão posterior acima cancelou a rotina e preservou as notas existentes.

Comandos de revisão e validação: `git status --short --branch`, `git ls-files`, `git diff`, buscas com `rg`, `npm.cmd --prefix vaggu-backend test`, `npm.cmd --prefix vaggu-frontend run build`, `npm.cmd --prefix vaggu-frontend run lint`, `node scripts/verificar-documentacao.mjs` e `git diff --check`. A suíte com PostgreSQL descartável local aprovou 140 testes e pulou um cenário de dump e restauração. O servidor temporário foi encerrado. Build e lint do frontend aprovados, com aviso do Vite sobre chunks acima de 500 kB. Sem mudanças de frontend nesta rodada, não foram produzidas novas capturas.

Próxima etapa: confirmar os consumidores externos dos assets candidatos e conferir o efeito da remoção no build e nas telas antes de seguir com a simplificação de domínio.

## Livro de documentação — 05/11/2026

Cópia local revisada do DOCX com sumário em três páginas, links para as seções e referências de página atualizáveis. A seção 10.5 foi movida para depois de Wireframes, com as figuras e legendas. A revisão de leitura identificou pontos de melhoria na numeração, nos títulos e na apresentação das evidências.

Conferência estrutural por extração OOXML com Python, além de `node scripts/verificar-documentacao.mjs` e `git diff --check`. A tentativa de renderização com `render_docx.py` ficou bloqueada pela ausência do LibreOffice. Paginação real e captura das páginas afetadas ficam pendentes.

A revisão editorial acrescentou os seis retratos do Memorial e as responsabilidades registradas no SSD-VAGGU. Também ajustou os títulos e a numeração de seções no sumário e no corpo, numerou 46 figuras e contextualizou as evidências. A conferência estrutural confirmou seis imagens na seção Equipe. A tentativa de renderização continua bloqueada pela ausência de LibreOffice.

## Curadoria da faixa do memorial — 05/11/2026

A faixa reúne a foto oficial, o modelo 3D, o logotipo amarelo em SVG, a visualização da sinalização e um momento espontâneo da equipe. A sequência passou a durar 40 segundos para preservar a velocidade de passagem. Os registros dos primeiros circuitos e da criação da marca ficam no acervo do projeto, com 18 itens.

Validação local por `node %TEMP%/vaggu-faixa-curadoria-qa.cjs`, build e lint do frontend, `node scripts/verificar-documentacao.mjs` e `git diff --check`. Playwright/Edge em desktop, tablet e celular, com sessão simulada e imagens fictícias nas evidências. A versão oficial da marca foi preservada nas capturas. Validação em produção pendente.

## Faixa contínua do memorial — 05/11/2026

Os três destaques formam uma faixa de borda a borda, sem espaçamento, que percorre uma sequência a cada 24 segundos. A repetição emenda o último destaque ao primeiro. O botão pausa no ponto atual e a preferência por movimento reduzido inicia a faixa parada.

Validação local por `node %TEMP%/vaggu-faixa-qa.cjs`, build e lint do frontend, `node scripts/verificar-documentacao.mjs` e `git diff --check`. Playwright/Edge conferiu as bordas, a continuidade no ponto de repetição e a pausa por teclado em três tamanhos. Sessão simulada e capturas fictícias. Validação de produção pendente.

## Carrossel e acervo do memorial — 05/11/2026

A abertura alterna a foto oficial, os primeiros circuitos e a criação da marca a cada cinco segundos, com pausa por teclado e início pausado para movimento reduzido. As 16 imagens secundárias do projeto passam para uma grade depois dos relatos, com ampliação e retorno de foco. Os arquivos de mídia foram preservados.

A troca dos destaques ganhou deslizamento da direita para a esquerda em 550 ms, inclusive na volta ao primeiro. Com movimento reduzido, a reprodução pode ser iniciada manualmente e a troca é instantânea. O roteiro local `node %TEMP%/vaggu-carrossel-lateral-qa.cjs` confere o deslocamento das duas fotos na metade da transição nos três tamanhos e gera capturas com imagens fictícias.

Validação local com `npm.cmd --prefix vaggu-frontend run dev -- --host 127.0.0.1 --port 5173`, `node %TEMP%/vaggu-carrossel-qa.cjs`, build e lint do frontend, `node scripts/verificar-documentacao.mjs` e `git diff --check`. Plugin Browser indisponível nesta sessão. Playwright/Edge confirmou a rotação completa, pausa e retomada, movimento reduzido, ampliação, navegação e retorno de foco em três viewports. O build conserva o aviso de chunks acima de 500 kB. Sessão simulada e capturas com fotos fictícias. Validação em produção e conferência do QR code publicado ficam pendentes. Skill de roteamento VAGGU não localizada no catálogo local consultado.

## Memorial direto para o QR code — 04/11/2026

Revisada a página sem descartar o trabalho local da main. Hero com uma única foto grande dos seis integrantes, conceito em três passos, carrossel manual com 18 imagens do projeto, grade única com um retrato de cada integrante e seis fotos em conjunto. Depoimentos originais preservados e recolhidos. Encerramento agradece SESI, SENAI, Matheus Zacaria, Giovanni Ribeiro, Edmar e Alex. Mantido Juan conforme identificação do acervo existente. Nenhum asset original removido.

Validação: `npm.cmd run build` e `npm.cmd run lint` no frontend; `node %TEMP%/vaggu-memorial-direto-qa.cjs`; `node scripts/verificar-documentacao.mjs`; `git diff --check`. Playwright/Edge em http://127.0.0.1:4173/memorial/, desktop 1440×1000, tablet 768×1024 e celular 390×844, tema escuro próprio do memorial e movimento reduzido. Carrossel por clique/setas, ampliação, Escape, ciclo de Tab e retorno de foco, depoimentos por teclado, carregamento das imagens e ausência de overflow aprovados. Corrigido erro 403 do favicon com referência à marca existente; rodada final sem erros de console. Build mantém aviso de chunks grandes. Quinze capturas anonimizadas no índice; fotografias reais verificadas quanto ao carregamento e proporções, sem capturar identidades. Evidências locais não comprovam produção nem hardware.

Browser plugin not available: usado Playwright instalado, sem novas dependências. Skill de roteamento VAGGU ausente no catálogo e nos caminhos locais consultados, como já registrado anteriormente; responsabilidade de produto Samuel preservada, sem simular autoria, revisão ou aprovação. Sem commit, push ou publicação. Publicação e conferência do QR code no ambiente de destino permanecem fora desta rodada.


## Responsividade dos canais oficiais — 04/11/2026

Removido o subtítulo “Links do projeto”; “Canais oficiais” ficou como único título da seção. Os nomes dos canais e o e-mail permanecem em uma linha. A grade mantém uma coluna até a largura XL e só então passa a duas colunas, preservando espaço para os rótulos.

Validação local no Edge em 1440×1000, 1280×900, 1024×900, 768×1024, 390×844 e 320×720: título único conferido, nenhum rótulo ou e-mail quebrou ou excedeu o cartão, sem overflow horizontal da página, foco de teclado visível, console sem erros e nenhuma resposta HTTP malsucedida. Visitante fictício; sem envio de mensagens ou publicação. Capturas no [índice de evidências visuais](../Evidências%20visuais/Índice%20de%20evidências.md).

## Ajuste dos contatos da landing — 04/11/2026

Removido o botão de WhatsApp redundante no lado esquerdo do rodapé; o WhatsApp permanece como canal oficial na grade à direita. Instagram e GitHub agora usam símbolos próprios, mantendo WhatsApp e e-mail com seus ícones correspondentes. Removidos os indicadores de link externo da grade.

Validação: build e lint do frontend aprovados; `git diff --check` e verificador documental aprovados. Capturas locais com Edge em desktop 1440×1000, tablet 768×1024 e celular 390×844; links e ícones conferidos, somente um destino wa.me no rodapé, nenhum indicador externo ou overflow horizontal, foco visível testado por teclado e sem erros de console ou respostas HTTP malsucedidas. Dados de visitante fictícios; sem publicação ou envio de mensagens. Ver capturas no [índice de evidências visuais](../Evidências%20visuais/Índice%20de%20evidências.md).

## Galeria por integrante — 04/11/2026

O filtro Equipe exibe todos os registros selecionados, com retratos lado a lado por integrante, duas fotos do trio dos meninos e quatro registros coletivos. Faltam originais em resolução adequada para completar Ana, Juan, Pietro, Kamilly e o trio das meninas. Validação local em três larguras e navegação por teclado. Executados build, lint, verificador documental e git diff --check.

## Abertura do projeto no memorial — 04/11/2026

A grade da abertura reúne a foto oficial dos seis integrantes, o logotipo e o mapa de vagas demonstrativo. O cartão do mapa leva à seção Da vaga ao painel. Validação local em três larguras com dados fictícios e navegação por teclado. Verificações com build, lint, verificador documental e git diff --check.

## Seleção da equipe no memorial — 04/11/2026

A abertura mostra a foto oficial em quadro único. A foto oficial aparece uma vez na galeria, junto a registros distintos da equipe. Cada integrante aparece em pelo menos duas fotos, contando retratos e registros coletivos. A miniatura do trio foi retirada da página por baixa resolução. Verificação local em três larguras e navegação por teclado. Executados build, lint, verificador documental e git diff --check.

## Montagem e sprints no memorial — 04/11/2026

A abertura reúne a foto oficial dos seis integrantes e a miniatura recebida do trio. O trio também aparece no filtro Equipe. O avatar do Juan usa o retrato individual centralizado. O filtro Projeto reúne as quatro sprints com evidência fotográfica vinculada ao planejamento, em ordem de 3 a 6. Capturas locais com dados fictícios em desktop, tablet e celular. Verificações com build, lint, verificador documental e git diff --check.

## Retratos no memorial — 04/11/2026

O retrato de perfil do Juan em resolução maior entrou no acervo. Um retrato individual da Kamilly substituiu o recorte do grupo nos relatos. As demais imagens coladas chegaram em tamanho de miniatura. Conferência local do acervo por teclado e capturas com dados fictícios. Verificações com build, lint, verificador documental e git diff --check.

## Projeto em destaque no memorial — 04/11/2026

A abertura leva ao projeto. Antes dos depoimentos, o memorial apresenta o fluxo do sensor ao painel, as tecnologias, três telas de demonstração, os ícones de categoria e o guia visual. A animação foi refeita em SVG e CSS, com duração de 3,2 segundos e respeito ao movimento reduzido. As evidências locais mostram desktop, tablet e celular. Verificações executadas com build, lint, verificador documental e git diff --check.

## Curadoria do memorial — 04/11/2026

Retirados os registros marcados, imagens sem vínculo claro com o TCC e o vídeo no carro. Adicionados mapa e telão de demonstração a partir das evidências de 21/10 e 17/10. A animação da marca ocupa o fundo do encerramento e pausa fora da tela. Capturas locais nos três tamanhos e pausa por teclado verificadas. Comandos executados: build e lint do frontend, verificador documental e git diff --check. Conferência em navegador local.

## Memorial para apresentação — 04/11/2026

Revisamos `/memorial` para a leitura pelo QR code da apresentação. A abertura mostra uma foto da equipe e um link para o acervo. O resumo do projeto cabe em dois parágrafos, os depoimentos abrem por nome e a galeria começa com oito miniaturas. As animações usam opacidade e deslocamento curto, com suporte à preferência por movimento reduzido. O texto demonstrativo de Kamilly deu lugar à indicação de depoimento pendente.

Build e lint aprovados com `npm.cmd run build --prefix vaggu-frontend` e `npm.cmd run lint --prefix vaggu-frontend`. Permanece o aviso conhecido do Vite sobre chunks acima de 500 kB. A conferência em `npm.cmd run dev --prefix vaggu-frontend -- --host 127.0.0.1 --port 5178 --strictPort` cobriu navegação por teclado, filtros, ampliação, retorno de foco e reprodução da animação da marca. Sem erros de console no fluxo verificado. Capturas com dados fictícios registradas no [índice de evidências visuais](../Evidências%20visuais/Índice%20de%20evidências.md). A validação foi local, com dimensões emuladas. O QR impresso e o endereço publicado ficam para a conferência da apresentação.

`node scripts/verificar-documentacao.mjs` aprovou 700 arquivos e 63 documentos Markdown. `git diff --check` passou.

## Landing e rota do memorial — 04/11/2026

Implementada a rota pública `/memorial`, que apresenta a página de equipe existente sem duplicar sua fonte ou acervo. O Vite serve a página e suas mídias sob `/memorial/` no desenvolvimento e copia somente HTML, scripts, estilos e assets para `dist/memorial/` no build. A landing removeu o mockup de celulares e passou a exibir links oficiais de WhatsApp, e-mail, Instagram `@vagguempresarial` e GitHub. O contato por e-mail usa a constante compartilhada com a página de privacidade. O memorial independente mantém execução própria.

Verificações concluídas em 04/11/2026: `npm.cmd run build --prefix vaggu-frontend` (TypeScript e Vite) e `npm.cmd run lint --prefix vaggu-frontend` passaram; o build publicou os arquivos do memorial em `dist/memorial/`. Build ainda emite o aviso já conhecido de chunks acima de 500 kB. O pacote do frontend não define script de testes. `node scripts/verificar-documentacao.mjs` aprovou 683 arquivos e 63 documentos Markdown; `git diff --check` passou.

Conferência local com Edge/DevTools e visitante fictício: landing e `/memorial` em 1440×1000, 768×1024 e 390×844; sete capturas incluem rodapé/contatos e menu móvel aberto. As larguras de rolagem coincidiram com as larguras úteis em todos os viewports, sem erros de console ou respostas HTTP malsucedidas. Link do memorial testado por teclado com foco visível, destinos de contato conferidos e menu móvel aberto. Evidências e limites no [índice de evidências visuais](../Evidências%20visuais/Índice%20de%20evidências.md). Sem validação em produção, envio de mensagens ou teste de hardware.

## Envio da revisão documental à main — 04/11/2026

Usuário solicitou expressamente commit e push das alterações pendentes à main e confirmou autoria elisagommes <elisagommes@outlook.com> para este commit. Entrega restrita à documentação, planejamento e 66 capturas locais com dados fictícios, acompanhadas de índice e resultados; nenhum código do produto alterado. git fetch origin executado; verificador documental aprovado (615 arquivos cobertos, 62 Markdown) e git diff --check sem falhas. Build backend e 19 testes WhatsApp aprovados na atualização imediatamente anterior. Stash de preservação mantido. Durante o preparo, origin/main avançou até bc85be4 com o memorial independente; commit local reaplicado por rebase sem conflitos. A validação detectou uma entrada skills/ sem arquivo correspondente, recebida do remoto; removida somente essa linha obsoleta do mapa. Commit documental usa marcadores de dispensa de CI/Render; não se declara novo deploy ou homologação nesta operação.


## Atualização do repositório local — 04/11/2026

A pedido do usuário, executados git fetch origin e git merge --ff-only origin/main: main avançou de 914ad62 para 206b38e, incorporando dois commits. Alterações locais e arquivos não rastreados preservados com git stash push --include-untracked e reaplicados com git stash apply; conflitos documentais conciliados em SSD, mapa, planejamento e processo WhatsApp. Código e testes locais do bot já coincidiam com o remoto. Stash mantido como cópia de segurança; alterações locais devolvidas ao estado sem staging, sem novo commit, push ou deploy. Conferência HEAD...origin/main: 0/0. Skill de roteamento VAGGU não localizada; nenhuma autoria atribuída. Verificação documental e git diff --check aprovados; suíte WhatsApp com 19 testes aprovados, usando simulações e sem envio real.


**Resultado da publicação — 04/11/2026:** commit funcional 0674a02 enviado à main; Render confirmou Deploy succeeded em 1m42s, deploy dep-dblilpon74is73a89kn0. Consulta pública GET /api/v1/health/ready retornou HTTP 200 e banco conectado. Opções 3–5 publicadas com anúncio demonstrativo de atendente em alguns instantes, sem pedido de e-mail. Nenhuma mensagem real enviada pelo agente; teste de recebimento e captura no WhatsApp permanecem separados. Autoria confirmada diretamente pelo usuário; trabalho local amplo preservado.

## Publicação retomada após confirmação de autoria — 04/11/2026

Usuário confirmou diretamente a autoria elisagommes <elisagommes@outlook.com>. Commit 0674a02 criado no checkout isolado codex/publicar-atendente-demonstrativa, contendo payload, testes e quatro registros relacionados; push HEAD:main aceito, origin/main avançou de 914ad62 para 0674a02. Restante da revisão documental e evidências locais preservado no checkout original. Build backend, 19 testes WhatsApp, verificador documental e diff aprovados antes do envio. Implantação Render concluída posteriormente com sucesso para 0674a02, conforme resultado acima. Nenhuma mensagem real enviada pelo agente.

## Publicação solicitada — pendência de autoria em 04/11/2026

Usuário autorizou publicar a atualização do bot. Preparado checkout isolado em evidencias.local/publicacao-bot, branch codex/publicar-atendente-demonstrativa, base origin/main 914ad62. Somente payload, testes e quatro registros relacionados compõem a entrega; revisão documental ampla e 66 capturas preservadas no checkout original. Build backend, 19 testes e verificador documental/diff aprovados.

Revisão automática rejeitou o comando de commit com identidade elisagommes/elisagommes@outlook.com por considerar autoria de terceiro sem confirmação direta; a máquina está sem user.name/user.email configurados. Solicitada confirmação explícita do usuário; não houve contorno, commit ou push. Render consultado em modo de leitura: serviço vaggu-tcc ainda Live na versão 7356e12. A publicação não foi realizada. Confirmação direta posterior recebida do usuário: “pode ser”, em resposta ao nome/e-mail apresentados. Autorizada autoria elisagommes <elisagommes@outlook.com> para este commit. Publicação retomada; registrar commit, push e resultado do deploy após execução.



## Publicação do atendimento demonstrativo — 04/11/2026

**Atualização de 04/11/2026 — atendimento demonstrativo:** por solicitação do usuário, opções 3 (demonstração), 4 (suporte) e 5 (equipe) deixam de pedir envio de e-mail e informam “Uma atendente entrará em contato com você em alguns instantes”. Trata-se de simulação para o TCC: não há fila, notificação ou atendimento real acionado. Botões de retorno, números digitados e proteção contra repetição permanecem. Contatos públicos de privacidade/exclusão não mudam. Versões e relatos anteriores abaixo preservam o comportamento anterior.

Publicação solicitada expressamente pelo usuário. Checkout isolado em codex/publicar-atendente-demonstrativa a partir de origin/main (914ad62), preservando a revisão documental ampla e as evidências locais ainda não commitadas. Build backend e 19 testes WhatsApp aprovados, com equivalência entre clique e número digitado e ausência de e-mail nas respostas 3–5. Meta/persistência simuladas; sem envio real. Comandos: npm.cmd run build --prefix vaggu-backend; node --test dist/test/whatsapp.test.js na pasta backend; node scripts/verificar-documentacao.mjs; git diff --check. Captura da interface real permanece bloqueada por ausência de sessão controlável de WhatsApp. Skill de roteamento VAGGU não localizada na revisão anterior; identidade Git mantém a autorização registrada, sem atribuição de coautoria. Commit/push/deploy e confirmação serão registrados após execução.

## Texto demonstrativo de atendente — 04/11/2026

A pedido do usuário, opções 3 (demonstração), 4 (suporte) e 5 (equipe) substituem o pedido de envio de e-mail por “Uma atendente entrará em contato com você em alguns instantes”. Preservados retorno ao menu, reconhecimento por número/clique e orientação de não enviar senhas/chaves no suporte. A frase integra a simulação do TCC; nenhum atendimento, fila ou envio real foi criado. Contato de privacidade/exclusão não foi alterado. Trabalho local, preservando alterações anteriores e sem commit/publicação. Skill de roteamento não localizada na revisão anterior; nenhuma autoria ou aprovação nova atribuída.

Validação: `npm.cmd run build --prefix vaggu-backend` aprovado; `node --test dist/test/whatsapp.test.js` na pasta do backend, 19 aprovados, zero falhas/ignorados. Testes verificam anúncio da atendente, ausência de e-mail e equivalência entre clique/número; mocks sem envio real. `node scripts/verificar-documentacao.mjs` e `git diff --check` executados no fechamento. Captura real da interface WhatsApp bloqueada por ausência de sessão controlável já verificada neste chat; não declarar revisão visual concluída. Nenhum frontend web foi alterado.


## Backup dispensado pelo usuário — 04/11/2026

O usuário esclareceu que não precisa de backup. Removida a exigência de criar cópias, manter duas cópias recentes ou executar recuperação como critério de entrega do TCC. Guias técnicos e ensaios anteriores permanecem como referência opcional e histórica; nenhum banco, dump ou arquivo foi apagado. Retenção de arquivos privados, proteção das evidências e contingência estática continuam documentadas. Os registros anteriores abaixo descrevem o planejamento antes desta decisão.

Atualizados guia de operação, guia opcional de backup, SSD, revisão consolidada, índice e mapa. Alteração somente documental; verificações: `node scripts/verificar-documentacao.mjs` e `git diff --check`.

## Aceite do usuário e fechamento demonstrativo — 04/11/2026

O usuário confirmou que já homologou completamente o site. A pendência de homologação web está encerrada por essa confirmação; não houve nova execução em produção pelo agente nem informação adicional do hash testado. A VAGGU segue para consolidação de evidências e preparação da apresentação, com o aceite físico sustentado dos sensores em etapa própria.

Por decisão expressa, WhatsApp demonstrativo não exige pessoa respondendo, coleta comercial ou protocolo. SSD/RF02 e CA03 foram ajustados ao recorte. O contato institucional existente não promete atendimento real.

Procedimentos de dados concluídos em [operação dos dados do TCC](operacao-dados-tcc.md): cópia manual antes de mudanças relevantes e fechamento, retenção de duas cópias válidas recentes, armazenamento privado, revisão de arquivos privados em até 30 dias após a última apresentação, restauração local separada, descarte restrito e contingência. Sem agendamento, dump novo ou limpeza de dados reais. Teste de proteção da restauração: 1 aprovado; ensaio PostgreSQL ignorado por ausência de TEST_DATABASE_URL/PG_BIN. Ensaio completo de 21/10 preservado como histórico.

Evidências novas de importação e exclusões: 66 PNGs em `Evidências visuais/2026-11-04 - Fechamento documental`, com galeria e resultados JSON por rota, perfil, viewport, tema, origem e estado. Vite 127.0.0.1:5186, Edge headless/Playwright 1.64.1, API interceptada e dados fictícios; seis combinações, processamento/prévias/confirmar/sucesso/falha, exclusão/cancelar/desfazer. Sem overflow da página, overlay ou erro JavaScript inesperado; 503 intencional. Prints não comprovam produção ou hardware. Captura real do WhatsApp indisponível após inventário de apps/abas não localizar sessão controlável. README público mantém imagens anteriores, pois não houve mudança visual da aplicação.

Comandos: `npm.cmd exec --yes --package=playwright -- playwright --version` (ferramenta temporária, sem mudança de manifests/lockfiles), `npm.cmd run dev --prefix vaggu-frontend -- --host 127.0.0.1 --port 5186 --strictPort`, `node evidencias.local/capturar.cjs`, `node --test dist/test/backup-postgresql.test.js` na pasta do backend, `node scripts/verificar-documentacao.mjs` e `git diff --check`. Browser plugin ausente. Edge no isolamento falhou e servidor isolado ficou inacessível ao navegador externo; captura executada fora do isolamento após liberação, com Vite próprio. Roteiro teve ajustes de foco, espera de fechamento, seletor real do botão e estado da fixture de exclusão; rodada final cobre as seis combinações. Scripts temporários em pasta `.local` ignorada; nenhum segredo copiado. Verificadores finais aprovados: `node scripts/verificar-documentacao.mjs`, 615 arquivos cobertos e 62 Markdown com links/âncoras válidos; `git diff --check`, sem falhas. Conferência dos resultados: 66 capturas existentes, seis combinações de viewport/tema, zero overflow ou erro inesperado. Inspeção visual amostral incluiu prévia inválida no celular escuro, confirmação no desktop claro e lista vazia após exclusão no tablet claro. Capturas antigas preservadas; nenhuma alteração de código, banco ou publicação. A revisão anterior fica preservada a seguir como diagnóstico anterior à confirmação do usuário.

## Revisão documental integrada — 04/11/2026

**Etapa atual: homologação integrada e preparação da entrega do TCC (P11/E6).** P01–P05, D01 e C01 estão concluídos nos registros locais. P06–P08 têm implementação e validações locais; P06 inclui ensaio físico inicial dos três canais. P10 tem conexão real, menu e apresentação confirmados, mas atendimento estruturado/operação ainda parciais. P09 publicado permanece opcional. O início previsto da Sprint 7 é 04/11, sem distribuição nova de tarefas confirmada.

A [revisão documental de 04/11](revisao-documental-2026-11-04.md) reúne a matriz dos pacotes, lacunas, critérios e prioridades. **Próxima ação:** homologar a versão de entrega em ambiente autorizado com dados conhecidos, conferindo isolamento, importação, sensores, manutenção, mapa, telão e exportações. Em seguida, fechar estabilidade dos três sensores/piloto HTTPS, backup/recuperação, retenção/exclusão, atendimento WhatsApp e ensaio do TCC. Capturas específicas de importação/exclusões e interface WhatsApp permanecem pendentes. Não há percentual de conclusão verificável.

Reconciliados índices, planos, produto, arquitetura, dados, fluxo, aceite, guias e mapa. Corrigidas referências vigentes ao WhatsApp adiado e ao hardware nunca testado; preservados registros datados. Mapa atual: polling de 500 ms com guarda da renovação automática pendente; telão instalado: 15 s; validade visual: 30 s. Confirmação do servidor: 30 s por padrão, distinta dos ajustes históricos de bancada. Dois CTAs ainda sem guarda para número explicitamente inválido são pendência de código, não corrigida nesta revisão.

Escopo somente documental. Checkout inicial main, 914ad62, árvore limpa. Não houve fetch, commit, push, publicação, mensagens ou acesso a banco/painéis externos. Skill de roteamento VAGGU não localizada após pesquisa no repositório, skills locais e cache de plugins; nenhuma responsabilidade, aprovação ou autoria nova atribuída. Evidências externas de 04/11 são registros anteriores, não nova aferição. Sem mudança de frontend/design, não foram produzidos prints novos.

**Comandos e resultados desta revisão:** conferência de branch/status/diffs/histórico, pesquisas com rg e leitura dos scripts reais; npm.cmd run build --prefix vaggu-backend, npm.cmd run build --prefix vaggu-frontend e npm.cmd run lint --prefix vaggu-frontend aprovados. Frontend mantém aviso de chunks acima de 500 kB. `node scripts/verificar-documentacao.mjs` aprovado: 546 arquivos cobertos, 60 Markdown com links/âncoras válidos; `git diff --check` aprovado. Testes selecionados: `node --test dist/test/confirmacao-estado.test.js dist/test/telemetria-contratos.test.js dist/test/metricas-ocupacao.test.js dist/test/importacao-csv.test.js dist/test/env.test.js`, na pasta `vaggu-backend`, 28 aprovados, zero falhas/ignorados. A primeira execução na raiz teve 26 aprovados e duas falhas ENOENT por caminho relativo das fixtures; corrigido o diretório e repetida a seleção inteira com sucesso, sem mudança de código. Uma tentativa de edição por Python falhou por indisponibilidade do executável; as edições foram realizadas com Node. A suíte completa PostgreSQL e os testes de navegador/hardware não foram repetidos; os 130 testes de 21/10 permanecem históricos.


**Confirmação do participante — 04/11/2026:** em resposta ao teste solicitado, participante confirmou o percurso Oi → Ver opções → Conhecer a VAGGU, com imagem e link do site, seguido de Ver recursos e Voltar ao menu. Validação funcional da nova apresentação concluída para esse percurso na versão 7356e12. Não comprova os demais caminhos individualmente nem substitui captura anonimizada da interface.

## Revisão de apresentação e contatos — 04/11/2026

Menu sem emojis, apresentação com site e imagem na opção 1, botões de continuidade e contato empresarial `vagguempresarial@outlook.com`. O mesmo e-mail substitui o contato pessoal nas páginas públicas de privacidade/exclusão, por autorização expressa; responsável e autoria Git permanecem os já autorizados. Ver [processo e operação](whatsapp-processo-e-operacao.md), que consolida o diagnóstico, correções, limites e pendências. O histórico abaixo não substitui esse estado atual.

**Validação desta revisão:** builds backend/frontend aprovados; 19 testes WhatsApp aprovados; lint frontend aprovado; verificador documental e `git diff --check` sem falhas. Arte JPEG 1200×675 revisada e seis capturas das páginas públicas em 1440×1000, 768×1024 e 390×844, sem overflow ou erro de página. Comandos: `npm.cmd run build --prefix vaggu-backend`, `node --test vaggu-backend/dist/test/whatsapp.test.js`, `npm.cmd run build --prefix vaggu-frontend`, `npm.cmd run lint --prefix vaggu-frontend`, `node scripts/verificar-documentacao.mjs`, `git diff --check`. Testes HTTP locais exigiram loopback fora do sandbox; Edge headless utilizado porque Browser plugin não está disponível. Vite mantém aviso de chunk acima de 500 kB. Skill de roteamento VAGGU não localizada; autoria permanece a identidade explicitamente autorizada, sem coautoria. Publicação e recebimento da nova apresentação confirmados posteriormente em 04/11; ver confirmação do participante acima.


### Menu clicável do WhatsApp — 04/11/2026

**Teste real confirmado pelo participante:** após publicação, usuário confirmou o percurso solicitado Oi → Ver opções → Conhecer a VAGGU → Voltar ao menu. Logs de produção registraram entrada `interactive` e eventos de status, sem novo erro de envio no recorte observado. As cinco escolhas e deduplicação foram cobertas pelos 18 testes locais; não afirmar que todas foram exercitadas individualmente em produção. Menu clicável funcional no número oficial; captura anonimizada da interface continua pendente por ausência de sessão controlável. Sem credenciais temporárias restantes.

**Publicação concluída posteriormente:** terceira tentativa de push foi aceita, enviando a implementação `317075a` e o registro `0c63291`. Render confirmou `Deploy succeeded|Live` para `0c63291` em 2m31s. Solicitado teste real Oi → Ver opções → Conhecer a VAGGU → Voltar ao menu. O bloqueio externo descrito abaixo é histórico; confirmação de clique real e captura permanecem etapas próprias.

**Publicação bloqueada externamente:** implementação registrada localmente em `317075a`, com build e 18 testes aprovados. Dois `git push origin main` retornaram `remote: Internal Server Error`; `git ls-remote origin refs/heads/main` confirmou remoto ainda em `e1eecf9`. [GitHub Status](https://www.githubstatus.com/) confirmou incidente de Git Operations/API/Actions em 04/11 (investigação desde 09:49 UTC; atualização às 11:11 UTC). Nenhum force-push ou alteração do bot publicado para contornar a falha. A conversa textual anterior está funcional, confirmada pelo participante; menu interativo permanece local até push, deploy e teste de clique real. Repetir o push após recuperação do serviço e aguardar Render Live antes de pedir `Oi`/Ver opções/Voltar ao menu.

Após confirmar o funcionamento do bot real, usuário solicitou opções clicáveis para melhorar a experiência. Implementada lista nativa da Cloud API com botão Ver opções, cinco escolhas com descrições e botão Voltar ao menu nas respostas. `Oi`, `Olá` e `MENU` abrem a lista; números 1–5 continuam válidos. Parser reconhece `interactive.list_reply` e `interactive.button_reply` pelo ID, sem usar títulos externos para decidir a opção. IDs desconhecidos e mídia não geram resposta. Cada entrada produz no máximo uma resposta interativa e preserva a deduplicação e os estados de envio incerto.

Build backend e 18 testes WhatsApp aprovados, incluindo contrato HTTP Meta, limites de títulos/descrições, cliques nas cinco opções, retorno, IDs inválidos e reentrega sem duplicação. A primeira execução apontou tipos incorretos no mock HTTP; corrigidos usando Response real antes de publicar. Sem dependência nova, mudança de schema ou de frontend web. Referência primária: [coleção oficial Meta — Send List Message](https://www.postman.com/meta/whatsapp-business-platform/request/r3ufenw/send-list-message).

Captura da interface real do WhatsApp pendente por ausência de sessão controlável do WhatsApp nesta conexão de navegador. Uma captura de configuração de permissão não mostrava o resultado e foi descartada antes de indexar. Não declarar revisão visual do menu concluída com base nos testes simulados. Publicação e clique real serão registrados após conferência pelo participante, sem armazenar conversa ou telefone pessoal.

### Retomada dos testes reais do WhatsApp — 04/11/2026

**Resultado confirmado:** Meta exibiu 1 ativo atribuído e a conta Vaggu passou a constar com acesso total para Employee. Envio técnico passou de HTTP 400/Authorization Error para HTTP 200 com mensagem aceita. Após novo teste de conversa, participante confirmou funcionamento; logs registraram texto recebido e eventos de status, sem novos erros de envio no recorte observado. Corrigida configuração externa, sem alterar token ou código para esse conserto. Credencial temporária ignorada foi removida. Essa confirmação conclui a conexão e o menu textual então existente; não conclui coleta estruturada de demonstração/suporte ou prazo de atendimento humano.

Estado local inicialmente limpo em `c71ccbe`; Render publicado em `e1eecf9`. Executado fetch e avanço fast-forward para preservar a atualização de equipamentos já publicada. Releitura do guia, planejamento, código e scripts reais; skill de roteamento VAGGU continua não localizada, sem nova atribuição de autoria ou responsabilidade. Build backend e 15 testes WhatsApp aprovados; verificador documental e diff sem erros.

Novo `Oi` do participante chegou como `text`, com texto e remetente presentes. Logs reais registraram `META_ENVIO_FALHOU:100`. Teste direto de envio ao número autorizado retornou HTTP 400, OAuthException 100, `Authorization Error`; nenhum texto de conversa foi registrado. Token inspecionado privadamente: válido, tipo SYSTEM_USER, app correto, sem expiração declarada e permissões de negócio/gestão/mensagens concedidas. Consulta do número confirmou Cloud API e correspondência com o contato público, mas leitura de metadados não comprovava autorização para envio.

No portfólio empresarial, usuário técnico Employee tinha acesso ao app VAGGU e apenas a Test Messaging Account. Conta real Vaggu ausente nos ativos atribuídos. Usuário confirmou explicitamente a atribuição da conta real pela opção Tudo, após explicação de que inclui gestão, usuários, informações de pagamento e mensagens. Revisão automática havia bloqueado a seleção antes dessa confirmação; nenhuma permissão foi concedida até a autorização real. Atribuição solicitada no painel. Sem criação ou troca de token, mudança de frontend ou envio de credenciais ao repositório. Resultado dos retestes deve ser registrado abaixo.

### Diagnóstico do primeiro Oi sem resposta — 28/10/2026

**Evento confirmado no banco de produção:** após relato de nova ausência de resposta, consulta somente de status/tipo/código/datas pela conexão real do Render encontrou um evento processado como `unsupported`, sem erro persistido. Não foi correlacionado conclusivamente à tentativa do participante. Acrescentado diagnóstico seguro de lotes e rejeições de assinatura em `routes.ts`, com extração sanitizada de códigos/resumo em `payload.ts`. Sem texto de mensagem, contato ou ID no novo resumo; teste específico contra vazamento aprovado junto dos testes existentes (15/15). Credenciais temporárias removidas; não há mudança de schema/frontend. Próximo deploy permitirá distinguir tipo/erro da Meta, rejeição HMAC e falha de envio. Homologação permanece pendente.

**Continuidade após segunda tentativa:** o número real estava `Conectado` no WhatsApp Manager, e o ID do Render correspondia à Meta. Encontrado outro bloqueio: `META_APP_SECRET` no Render divergente do app. Usuário realizou a confirmação de senha pessoalmente; comparação ocorreu em memória, sem impressão de credenciais. Corrigido o segredo no ambiente e confirmado deploy manual `dep-dbh36ad9fdbs73a4j6b0` como `Live`, fonte `ee779c9`. Token do Render validado por GET ao recurso do número (HTTP 200, correspondência booleana), sem mensagem enviada. Consulta de inscrição por API retornou código 100 e não foi considerada confirmação. Arquivo temporário ignorado, com credencial para consulta, foi removido. Host local de banco confirmado diferente do Render; resultado vazio da primeira consulta não representa produção. Rejeições de assinatura não aparecem nos logs atuais, portanto ausência de erro de envio não prova ausência de recebimento. Solicitado novo `Oi` após o deploy; homologação ainda depende da resposta real.

Participante enviou `Oi` e relatou ausência de resposta. Logs Render sem falha de envio; consulta SQL limitada a status/tipo/código/tentativas/datas retornou zero eventos no banco configurado, sem expor conteúdo ou contatos. Encontrada inscrição da conta WhatsApp no app desativada: switch **Assinar webhooks** na seção de registro do número estava desligado. Ativado e persistência confirmada após reload. Campo `messages` assinado no app, publicação e credenciais presentes não substituem essa inscrição. Número e ID do Render conferidos por comparação booleana com a Meta, sem divulgar valores privados; ID local difere e não foi usado para envio. Sem mudança de código/frontend ou necessidade de novos prints de produto. Próximo passo: repetir `Oi` e observar recebimento e resposta reais. Não declarar a conversa homologada com base apenas nas configurações.

### Páginas públicas e preparação do bot — 28/10/2026

**Resultado publicado:** commit funcional `90c92a0`, integrado à main remota por merge `d815547` após primeiro push recusado por avanço remoto. Conflitos documentais resolvidos preservando os dois registros, sem force-push. Build/lint, 14 testes WhatsApp e verificador documental (512 arquivos/58 documentos) aprovados novamente após integração. Render confirmou `Deploy succeeded|Live`; `/privacidade` e `/exclusao-de-dados` abertas no domínio público. URLs cadastradas na Meta e persistência conferida após reload; app publicado com status `Publicado`. Render recebeu `WHATSAPP_AUTO_REPLY_ENABLED=true` por salvamento e deploy autorizado. Teste público de saúde: HTTP 200/banco conectado. POST sem assinatura: HTTP 401 `ASSINATURA_INVALIDA`. Nenhuma mensagem enviada pelo agente; homologação de entrada e resposta reais aguarda o `Oi` do participante. Logs de produção devem ser conferidos nessa próxima interação, sem copiar conversas ou credenciais.

Usuário autorizou implementar, documentar, atualizar/publicar o sistema e preparar os testes para enviar `Oi` pessoalmente. Informou Elisa Gomes Teixeira e `elisagommes@outlook.com` como responsável/contato de privacidade; autorizou autoria Git `elisagommes <elisagommes@outlook.com>`. Não foi simulada identidade ou coautoria. Skill de roteamento VAGGU não localizada após busca no repositório e skills locais; nenhuma responsabilidade adicional atribuída.

Implementadas `/privacidade` e `/exclusao-de-dados` com links no rodapé, aviso compatível com registros técnicos do webhook, instruções de solicitação humana por e-mail e orientação da ANPD. Sem callback de exclusão automática, prazos inventados ou cópia integral de conversas no banco técnico. Blueprint passa a habilitar respostas automáticas, mantendo credenciais fora do código. Configuração do painel Render e publicação Meta devem ser verificadas separadamente.

Validação local: `npm.cmd run build --prefix vaggu-frontend`, `npm.cmd run lint --prefix vaggu-frontend`, `npm.cmd run build --prefix vaggu-backend` e `node --test vaggu-backend/dist/test/whatsapp.test.js` aprovados (14 testes, sem falhas/skips; Meta e persistência simuladas). Aviso conhecido de chunks grandes no frontend. Navegador integrado em 1440×1000, 768×1024 e 390×844 confirmou rotas públicas, e-mail correto sem envio, política → exclusão por Enter, volta à landing, novos links do rodapé, foco e ausência de overflow/erros; aviso de movimento reduzido esperado. Capturas indexadas em `2026-10-28 - Privacidade e exclusao`. README mostra somente abertura da landing, sem mudança visual nesse trecho. `node scripts/verificar-documentacao.mjs` e `git diff --check` executados; primeiro verificador identificou nova página fora da tabela do mapa, corrigida antes da entrega.

Estado externo observado antes de publicar: Meta com callback Render salvo e `messages` assinado em v26.0, mas aviso de produção indisponível sem publicação e URL de privacidade vazia; Render iniciou sem migrations pendentes, nomes das credenciais presentes e resposta automática `false`. Valores privados não foram expostos. Publicação e teste real não são comprovados por essa inspeção; resultados posteriores devem ser acrescentados abaixo.

### Retomada do WhatsApp e link da landing — 28/10/2026

**Continuidade com número confirmado:** após o responsável informar `+55 (11) 99380-7892`, configuramos `5511993807892` como padrão público em `vaggu-frontend/src/lib/constants.ts`, mantendo substituição por variável no build. Cinco links conferidos no DOM da landing com destino correto. Build e lint frontend aprovados; build mantém aviso conhecido de chunks grandes. Destino padrão também validado por execução isolada da constante. `npm.cmd ci --prefix vaggu-frontend --include=dev` executado com autorização, sem mudança de lockfile; primeira tentativa bloqueada por arquivo em uso, resolvida encerrando o servidor iniciado nesta revisão. Instalação reportou 17 vulnerabilidades nas dependências; nenhuma correção automática foi aplicada. Navegador integrado abriu a aplicação após liberar servidor local: desktop/tablet/celular sem overflow, navegação Tab e ativação Enter exercitadas, sem erros de console e com aviso de movimento reduzido. [Capturas e limites](../Evidências%20visuais/Índice%20de%20evidências.md). Abertura externa da conversa, conta WhatsApp ativa, publicação e resposta do bot continuam não comprovadas. Guardas para configuração explicitamente inválida permanecem no planejamento. Nenhuma mensagem enviada.

Atendendo à solicitação de retomada, criamos o [planejamento de conclusão do WhatsApp](planejamento-whatsapp-2026-10-28.md). Revisão na `main`, base `3e2841e`, sem alterações locais iniciais. Backend local com variáveis preenchidas e resposta automática habilitada; validade externa não verificada. Frontend sem número público localizado; Render versionado mantém resposta automática desligada. Planejados confirmação do número salvo, configuração no build, guarda uniforme dos CTAs, homologação real, atendimento humano e evidências visuais após implementação. Corrigida a descrição documental da proteção de envios incertos já presente no código. Registros anteriores de adiamento permanecem históricos.

Comandos: `git status --short`, `git branch --show-current`, `git diff --stat`, `git log`, pesquisas com `rg`, leitura dos scripts/configurações sem expor segredos, `npm.cmd run build --prefix vaggu-backend`, `node --test vaggu-backend/dist/test/whatsapp.test.js`, `node scripts/verificar-documentacao.mjs` e `git diff --check`. Build aprovado; 14 testes WhatsApp aprovados, sem falhas ou ignorados, com Meta/persistência simuladas. A primeira tentativa teve bloqueio de loopback `EACCES`; repetição fora do sandbox, autorizada, passou. Verificador documental aprovado com 355 arquivos cobertos e 55 documentos válidos; diff sem erros. Sem alteração funcional/frontend, publicação ou envio real. A skill de roteamento VAGGU não foi localizada; não houve atribuição de responsabilidade ou autoria.

### Velocidade e sensores laterais — 21/10/2026

- Upload rápido concluído e ESP32 reiniciada via RTS após BOOT liberado. Nova inicialização física esp32-c71d8480-e174198e-b8c9204e; Serial HTTP202. Intervalos saudáveis medidos em cerca de 1,1 s, com alguns atrasos de rede de até ~2,9 s no recorte. S02 confirmou ocupação de 16:27:15.205Z a 16:27:17.437Z (2,232 s); posteriormente os três sensores tiveram observação recente no mesmo lote às 16:27:28.358Z. Não garante estabilidade elétrica/acústica permanente; ausência de eco continua exigindo conferência física.

- Usuário relatou apenas vaga central mudando. Banco confirmou S01/S03 sem observação por dezenas de segundos e S02 atual; problema não era só frontend. Mapa reduzido para 500 ms sem sobreposição; Edge/Playwright registrou 15 consultas durante o ensaio, sem erros em desktop/mobile. Build/lint aprovados.
- Firmware compilado (935588 bytes; 48368 bytes RAM): espera final de 3 s reduzida para 100 ms, separação acústica de 65 ms preservada. Filtro aceita duas leituras próximas se terceira falhar, mas nunca sem eco ou par inconsistente; mediana mantida quando três válidas. Upload iniciado com BOOT manual; confirmar envio e intervalo real após gravação.

### Janela local de dois segundos — 21/10/2026

- A pedido do usuário, TELEMETRIA_CONFIRMACAO_MS local reduzida a 2000 ms e API reiniciada; polling permanece em 2 s. Lacuna de 4500 ms mantida para o firmware atual enviar aproximadamente a cada 4 s. Validação separa limite de continuidade (no mínimo referência 30 s) da janela curta para não reiniciar toda confirmação antes da próxima mensagem. Continua exigindo uma segunda observação válida; silêncio além da lacuna reinicia candidato. Padrão de 30 s preservado para ambientes sem ajuste.
- Build e 15 testes de ambiente, confirmação e persistência PostgreSQL aprovados, incluindo janela de 2 s com envio a 4 s e silêncio a 5 s recusado. Firmware não regravado; tempo ponta a ponta depende dos ciclos de envio e consulta.

### Aceite físico inicial e transição rápida — 21/10/2026

- Após posicionamento, os três sensores físicos enviaram leituras e o histórico por evento esp32 confirmou OCUPADA → LIVRE em A01/A02/A03; mapa gerente mostrou as três livres. Não houve simulador concorrente. Isto comprova o fluxo local inicial, não uma homologação de estacionamento real ou da versão publicada.
- Usuário pediu transição menor que 30 s: janela tornou-se configurável com padrão preservado de 30000 ms. Somente .env local configurado com 5000 ms e lacuna 4500 ms; API reiniciada. Mapa passou a consultar a cada 2 s e removeu texto fixo de 30 s. Com o firmware atual, expectativa de 8–12 s em leituras estáveis, podendo reiniciar diante de falha/lacuna/oscilação.
- Build backend/frontend e lint aprovados. Testes de configuração e núcleo temporal ampliados para janela rápida sem alterar o padrão; integração PostgreSQL verifica confirmação de 5 s após leituras em 0/4/8 s. Edge/Playwright confirmou cinco consultas de mapa em aproximadamente 6 s com dados físicos, detalhes e ausência de erro/transbordamento em desktop/mobile. Sem alteração de senhas reais e sem publicar ou fazer push.

### Integração da bancada local ao mapa — 21/10/2026

- Resultado físico posterior: diagnóstico apontou NO_AP_FOUND (201). A API WinRT do Windows confirmou hotspot Vaggu em 2,4 GHz configurado, porém Off; ativado sem alterar senha e apareceu um cliente. Firmware diagnóstico compilado (935500 bytes/48368 bytes RAM) e gravado com BOOT manual. Serial mostrou HTTP202 e inicialização esp32-d9f9adf2-dcba5a09-73f370ba persistida; S02 confirmou LIVRE após 30 s. S01 ainda sem leitura válida e S03 com leitura intermitente, mantendo indisponibilidade quando não confirmado.
- Verificação física no frontend: Edge/Playwright com gerente QA temporário em `/painel` mostrou A02 Livre, abriu detalhes e fez três consultas automáticas; desktop 1440×1000 e mobile 390×844 sem transbordamento/erros de console. Usuário QA e sessões removidos ao final; não foi alterada a senha do gerente da bancada. Evidências em Temp/vaggu-esp32-fisico-desktop.png e Temp/vaggu-esp32-fisico-mobile.png, fora do Git. Fluxo físico validado para S02; aceite dos três canais e mudanças livre/ocupada por objeto ainda requer posicionamento e ensaio.

- PostgreSQL portátil existente reiniciado em 127.0.0.1:55432; API em 0.0.0.0:3000 e Vite em 127.0.0.1:5173. Criados shopping próprio Bancada ESP32 — 3 vagas (não demonstrativo), três vagas/sensores, placa individual e gerente com troca obrigatória. Segredos somente em config.h/acesso.local ignorados; preparação repetida preservou registros e chave. Corrigida rotação zero nas posições recém-criadas da bancada.
- MapaAoVivo consulta estados a cada 5 s após resposta, pausa em aba oculta e oculta mapa antigo em falha; Admin usa somente na aba Visualizar mapa, gerente no mapa principal. Editor e rascunhos preservados. Aplicadas orientações de verificação de fluxo, React e componentes existentes.
- Build/lint frontend e build backend aprovados, seis testes de contrato/rotas/PostgreSQL aprovados sem skips. Browser plugin not available: Edge/Playwright em 1440×1000 e 390×844 comprovou mensagens HTTP sintéticas → confirmação real PostgreSQL → mapa Admin atualizado, detalhes e recuperação de 503, sem erros inesperados/transbordamento. Usuário QA/sessão temporários removidos; eventos sintéticos ficam apenas na bancada.
- Firmware alinhado a TRIG 27/26/25, ECHO 32/33/34, um LED GPIO13. Core ESP32 3.3.12 compilou (933692 bytes de programa; 48360 bytes de dados na revisão inicial). Upload COM3 bem-sucedido após BOOT manual; chip ESP32-D0WD-V3. API_BASE ajustada ao hotspot Windows 192.168.137.1 sem revelar Wi-Fi/chave.
- Primeira observação física: Serial aguarda Wi-Fi e banco permanece na inicialização QA, sem evento físico. Usuário confirmou hotspot Vaggu ligado em 2,4 GHz. Acrescentado diagnóstico de scan/motivo de desconexão e tentativas espaçadas de 15 s, em compilação. Envio físico, confirmação dos três sensores e exibição ao vivo permanecem pendentes até resolver a conexão; sucesso sintético não foi tratado como sucesso físico.

### Diagnóstico de LED no teste USB — 21/10/2026

- Usuário relatou leitura nos três sensores e falha do LED no programa combinado. Sketch USB atualizado com controle integrado do LED GPIO13 pelo S01 (2–15 cm), três piscadas ao iniciar e saída serial explícita; TRIG corrigido para 27/26/25 conforme fiação informada e ECHO mantido em 32/33/34. Manual/mapa alinhados com a revisão. A causa no programa gravado pelo usuário ainda não foi comprovada; compilação Arduino e ensaio físico pendentes.

Última atualização: **21/10/2026**, fuso **America/Sao_Paulo**. A revisão da landing e seu fechamento permanecem atribuídos a **09/09/2026**, conforme o registro original. Base de P01: `c127b5e`; registros das entregas na seção 7. Este documento registra evidências e orienta o trabalho diário; não substitui o [SSD](SSD-VAGGU.md) nem os [critérios de aceite](plano-e-aceite.md).

### Telão para apresentação — 21/10/2026

Implementamos o [protótipo funcional e sua validação](telao-apresentacao-2026-10-21.md): apresentação enxuta sem rolagem, tela cheia/Esc, visões geral/andar e gestão por instalação para o gerente. A alteração salva mantém ID/credencial e chega ao telão no polling sem encerrar fullscreen. Mais áreas alternam em páginas; dados indisponíveis permanecem “—”. Backend build e quatro testes focados passaram com PostgreSQL; frontend build/lint e fluxo no navegador passaram, com 20 prints. README, fluxo, regras visuais e mapa atualizados. Branch local `codex/feat/telao-apresentacao-elisa`, base publicada `1b7ae6fb`, identidade Git preservada; sem commit/push desta nova entrega. A revisão geral abaixo precede este protótipo e registra a suíte completa anterior.

### Estado verificado na revisão geral — 21/10/2026

Reconciliamos os resumos atuais com equipamentos/manutenção, polling, telões autorizados, filtros/métricas e snapshots implementados localmente. A suíte completa passou com **130 testes, zero falhas e zero ignorados**, incluindo PostgreSQL descartável e dump/restauração. Frontend build/lint passaram, com aviso conhecido de chunks. A revisão da análise no navegador agora cobre setor/categoria, período sem histórico, exportações, desktop/tablet/celular e tema escuro, com API e banco reais locais. O telão recebeu ajuste de grade/ícones e novos prints; a [revisão geral](revisao-geral-2026-10-21.md) concentra resultados, limites, arquivos removidos e a galeria atualizada. Homologação publicada e hardware físico continuam pendentes.

Consolidamos `CONTRIBUTING.md` no `AGENTS.md`, que exige prints após toda alteração de design ou frontend. Preservamos fontes e evidências históricas; removemos apenas cópias públicas redundantes e o utilitário de otimização sem uso atual. Mantivemos as alterações locais na branch existente, sem commit ou publicação.

Registramos a Sprint 7 em **04/11–11/11/2026** e a Sprint 8, última, em **16/11–26/11/2026**. Não atribuímos tarefas sem planejamento nem criamos sprints nos intervalos. Ver [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md).

Os registros datados abaixo preservam a informação disponível em cada etapa; pendências antigas já corrigidas não redefinem o estado atual acima.

Última atualização: **19/10/2026**, fuso **America/Sao_Paulo**. A revisão da landing e seu fechamento permanecem atribuídos a **09/09/2026**, conforme solicitado. Base de P01: `c127b5e`; registros das entregas na seção 7. Este documento registra evidências e orienta o trabalho diário; não substitui o [SSD](SSD-VAGGU.md) nem os [critérios de aceite](plano-e-aceite.md).

### Preparação da bancada ESP32 com três vagas — 19/10

- Usuário optou por iniciar sem LEDs e informou ter conferido as ligações. LEDs desativados por padrão no firmware de integração; acrescentado sketch independente de teste USB/Serial dos três sensores, sem credenciais ou backend. Guia atualizado com primeiro ensaio e diagnóstico. Compilação Arduino e leituras físicas permanecem pendentes; conferir documentação com o verificador do repositório.

- LEDs solicitados: sketch preparado com saídas 13/14/23 para ocupação detectada localmente, inicialização desligada e apagamento em leitura inválida, bloqueio ou Wi-Fi desconectado. ECHO ajustado a 32/33/34 conforme combinado. Guia alinhado aos divisores disponíveis (1 kΩ + 180 Ω / 2,2 kΩ); dois resistores de 1 kΩ restantes permitem dois LEDs, faltando mais um para o terceiro. Sem compilador Arduino disponível; gravação e ensaio de LED ainda pendentes.

- Montagem atual ajustada a pedido do usuário: alimentação somente pelo USB da DevKit V1, com VIN/5V para os sensores condicionado à conferência da tensão/esquema da variante; sem fonte externa ou suporte de pilhas. Diagrama e sequência de conferência atualizados; validação elétrica sob carga pendente.

- Usuário confirmou ESP32 DevKit V1 e futura alimentação por quatro Ni-MH de 4700 mAh declarados. Guia complementado com pack em série, regulação buck-boost a 5 V, diagrama, separação de fontes e cálculo ilustrativo de autonomia; capacidade e consumo reais ainda não medidos. Firmware preservado.

- Analisado o demo recebido em Downloads: servidor em memória, autenticação e payload incompatíveis com a API principal. Integração considerada viável mediante adaptação do firmware, aproveitando a telemetria persistente existente.
- Entregues [guia de bancada e diagramas](../../../hardware/esp32-3-vagas/README.md), sketch para ESP32 clássico WROOM-32/HC-SR04 e configuração de exemplo. Firmware usa Device, inicialização/sequência, mediana e histerese; omite leituras inválidas e preserva expiração individual. Nenhuma mudança de API ou banco necessária.
- Documentados HOST para rede local, provisionamento real, teste de contrato, divisores de ECHO, calibração, consulta manual do mapa e roteiro de falhas/recuperação. config.h local foi incluído no ignore para proteger credenciais.
- Conferência: contratos, rotas, provisão, sequência, confirmação e timeouts lidos no código; build TypeScript, cinco testes existentes de contrato/rotas e verificador documental aprovados. Testes HTTP aprovados após liberar loopback bloqueado inicialmente pelo ambiente (EACCES); PostgreSQL não foi reexercitado nesta entrega. Compilação Arduino, gravação, circuito e ensaio físico pendentes por ausência de toolchain e hardware conectado. Nenhum provisionamento ou alteração em banco real executado.

### Retomada e revisão da última entrega — 15/10

- Revisado o cenário fictício entregue em `294c1d0`. Corrigida a omissão de `cenario-apresentacao.test.ts` no comando `test:integracao`; o teste já era descoberto por `npm test`.
- Shopping Exemplo: criação automática na inicialização de produção pela conexão já configurada no site, sem botão ou rota de criação no painel. Contém 80 vagas, dois pisos, quatro setores, três gerentes e 15 dias de histórico fictício. A migration renomeia o cenário anterior pelo ID fixo sem alterar senhas ou histórico. O Admin pode emitir o acesso pela redefinição de senha já existente na ficha do gerente.
- PostgreSQL 17 portátil preparado exclusivamente para QA local. Suíte completa: 113 testes aprovados, zero falhas e zero skips, incluindo criação concorrente e preservação de acessos na reinicialização. Frontend: lint e build aprovados, com o aviso conhecido de chunks acima de 500 kB.
- Navegador: Edge headless com Playwright (plugin Browser ausente), API e PostgreSQL reais em `http://127.0.0.1:3102`. Login Admin, lista do exemplo e ausência do botão confirmados; login gerente e análise conferidos em 1440, 768 e 390 px sem transbordamento horizontal. Excel gerado e relido, PDF com assinatura válida; zero erros inesperados de console ou HTTP. Os 401 de `/auth/me` antes do login são esperados. Corrigida a política de imagens para permitir os gráficos locais `blob:` nos relatórios. Evidências e arquivos de QA ficaram fora do repositório.
- Publicação: autorizamos o push na `main` e registramos a atualização automática do site. A verificação autenticada no endereço publicado e o hardware ainda não foram executados.


**Publicação desta revisão:** `7356e12` enviado à main; Render confirmou `Deploy succeeded|Live` em 2m7s. JPEG público validado com HTTP 200, `image/jpeg`, assinatura JPEG e 121.573 bytes. Navegador confirmou contato empresarial nas duas páginas publicadas; captura de exclusão em produção registrada. Teste real da nova imagem, link e botões solicitado ao participante; aguarda confirmação. Avisos existentes de bundle e compatibilidade SSL do driver PostgreSQL não impediram o deploy.

## 1. Situação atual

**Seção histórica:** o título original foi preservado para manter a navegação. Os relatos e o resumo de lacunas abaixo descrevem as revisões datadas de setembro/outubro. O quadro de 09/11 no início deste documento registra o estado vigente.

### Auditoria documental e pendências — 15/10

- Revisados código, rotas, schema, sprints, índices, PRD/TRD/SSD e aceite sobre `c505b78`. Corrigidos os resumos que ainda listavam validade do mapa, seleção de período e Excel/PDF como ausentes, além da afirmação incorreta de atualização automática de leituras na tela.
- Reproduzida a pendência CA28: período somente indisponível retorna `temHistorico=true`, ocupação 0% e cobertura 0%; isso não equivale a ocupação zero medida. Registradas também CA30 (classificação histórica), atualização automática, hardware, manutenção, telões, filtros/métricas, Power BI, WhatsApp e homologação publicada. Não houve implementação dessas pendências nesta revisão.
- Verificador ampliado para todos os Markdown versionáveis, READMEs, destinos e âncoras locais. Ensaio negativo temporário comprovou detecção de erros e exclusão de exemplos em blocos de código; fixture removida. Oito PNGs e menção às 13 entidades Prisma conferidos. Links externos e integrações remotas não foram validados.
- Guia de configuração esclarece `CREATE DATABASE` fora de transação; login documenta cookie versus Bearer legado. CA31 foi alinhado ao SSD (PDF e planilha, com XLSX atual), sem criar obrigatoriedade de CSV. [Relatório completo e prioridades](auditoria-documental-2026-10-15.md).

### Editor visual, monitoramento e material de apresentação — 15/10

- O Admin edita posições por arraste, toque, clique no mapa ou setas, sem a tabela de X/Y. Controles de tamanho e rotação, desfazer, rascunho, confirmação ao trocar piso/aba, limites e bloqueio de sobreposição foram conferidos. O salvamento preserva a autorização, revisão concorrente e transação já existentes.
- A visualização de Admin e gerente ganhou monitoramento dos sensores com contagens, filtros e detalhes individuais, horários independentes de placa e sensor, estado confirmado e candidato pendente. A API usa projeção explícita sem chaves ou hashes.
- O exemplo recebe automaticamente quatro placas e 80 sensores persistidos, sem duplicação nem alteração de sensores existentes. O job de expiração ignora o shopping sintético, preservando a fotografia de apresentação. Nenhum hardware físico foi exercitado.
- Por decisão de produto, foram retirados do exemplo os avisos/selos de dados fictícios nas telas e nos relatórios. O isolamento técnico e a origem sintética permanecem documentados; não há nova alegação de transmissão ao vivo.
- Verificação: 114 testes PostgreSQL/backend aprovados, zero falhas/skips; lint e build frontend aprovados com o aviso conhecido de chunks. Edge/Playwright local com API e PostgreSQL reais confirmou mouse, teclado, persistência, desfazer, filtros, Admin/gerente, larguras de 1440/768/390 px, arraste e posicionamento por toque, proteção de sobreposição e temas. Sem erros de execução. Excel gerado/relido e PDF de quatro páginas com texto extraído: sem avisos no exemplo.
- Oito prints finais guardados no repositório, em `Evidências visuais/2026-10-15 - Editor e sensores`, e indexados na galeria. O [guia da entrega](edicao-visual-e-monitoramento.md) documenta uso, contratos, testes e limites. A publicação segue por push autorizado na `main`; a conferência autenticada remota continua pendente.

### Correção do mapa do Shopping Exemplo — 15/10

- Causa: os setores do mesmo piso receberam as mesmas coordenadas no seed; “Todos os setores” sobrepunha as vagas. Corrigidos seed e migration incremental para os exemplos existentes, usando uma faixa por setor no espaço do piso. Posições personalizadas, acessos e histórico são preservados; a revisão dos pisos corrigidos é incrementada.
- Verificação PostgreSQL: suíte completa com 114 testes aprovados, sem falhas ou skips, incluindo ausência de sobreposição, limites do mapa, preservação de posições editadas, isolamento de outros shoppings e repetição segura da migration.
- Navegador local com Edge/Playwright e API/PostgreSQL reais: 40 vagas clicáveis por piso em 1440 e 768 px, nenhuma sobreposição ou corte nos limites do mapa; filtro de setor com 20 vagas e retorno a 40 em “Todos os setores”; detalhes abrem e fecham pelo teclado. Celular de 390 px com 40 itens e sem transbordamento horizontal. Console sem erros inesperados. Evidências fora do repositório; endereço publicado ainda não conferido nesta correção.

A VAGGU já possui login real, troca de senha, gestão de shoppings e gerentes, importação, mapa compartilhado e conta pessoal. O gerente vê somente o próprio shopping. A base de sensores recebe leituras, confirma mudanças, ignora repetições, marca sensores sem resposta como indisponíveis e guarda o histórico; essa parte foi testada com PostgreSQL. O sistema também consulta esse histórico por período, mostra análises iniciais e gera exportações locais em Excel e PDF. Ainda faltam ESP32 real, cadastro/vínculo de equipamentos, comandos de manutenção e ocorrências, atualização automática de leituras nas telas, telões, filtros/métricas analíticas complementares, classificação histórica de estrutura/categoria, conferência da publicação e relatório Power BI funcional.

P01 foi concluído em 10/09 e P02 em 11/09, incluindo autenticação e acabamento visual. P03 foi concluído em 12/09 com gestão administrativa, vários gerentes e Minha conta. P04 foi concluído em 12/09 com estrutura e mapa validados no banco e no navegador. O P05 foi concluído em 21/09: a importação de CSV/XLSX mostra uma prévia, pode ser repetida sem duplicar o resultado e preserva os registros existentes. O fluxo foi conferido no computador e em tela de celular. A base local está verificável, mas o sistema ainda não está liberado para operação com clientes.

Registramos em 23/09 a hospedagem do frontend e da API no mesmo serviço Render, com banco PostgreSQL no Neon. O repositório contém o manifesto e o workflow de solicitação de deploy; URL pública, segredo do hook e resultado da última publicação não foram verificados nesta revisão documental. Veja [configuração](configuracao.md#hospedagem-no-render).

### Cenário fictício de apresentação — 14/10

- O comando `demo:create` prepara um shopping identificado como demonstração, três gerentes, 80 vagas e 15 dias de histórico sintético. Ele exige uma conexão explícita em `DEMO_DATABASE_URL`, não modifica outros shoppings e guarda as senhas provisórias fora do Git.
- Na entrega original, a marcação de demonstração fazia o mapa mostrar os estados sintéticos persistidos, e as telas/relatórios os identificavam. Os textos foram substituídos pela redação neutra solicitada em 15/10; a marcação interna permanece. A criação por botão desta entrega foi substituída pela inicialização automática de produção em 15/10, por decisão interna. Consulte [o procedimento atual](cenario-de-apresentacao.md).

### Revisão de código e relatórios — 14/10

- A API analítica aceita `inicio` e `fim` como datas civis UTC inclusivas, com limite de 31 dias, mantendo o shopping do gerente derivado da sessão. Sem filtro, mostra os últimos sete dias civis UTC. O período anterior de mesma duração serve à comparação inicial; os arquivos Excel/PDF registram o recorte aplicado e a comparação. Horas futuras do dia atual não entram como cobertura observada.
- A interface separa indicadores da situação atual das medições no período, usa escala estável de 0–100% e mostra ausência de medições sem inserir demonstração em um filtro escolhido. Revisão de UX: rótulos, legibilidade, estados vazios e uso em telas pequenas.
- O README da API foi alinhado à sessão atual por cookie. Comentários de módulo e trechos de formatação do Admin foram ajustados sem mudar as regras de negócio.
- Os arquivos Excel e PDF da análise passaram a incluir séries diárias, entradas e saídas, distribuição por tipo e setor e horários quando exibidos no painel. Cada seção separa fotografia atual, histórico confirmado e valores de demonstração. Ausência de medição de saídas ou horários é identificada; não se converte demonstração em histórico. O PDF preserva nomes longos de setores.
- A reentrega do webhook pode retomar, após dois minutos, um evento abandonado em `PROCESSANDO` por atualização condicional no banco. O envio à Meta continua sujeito a duplicação se houver queda depois do envio e antes da confirmação local; não há garantia de exatamente uma entrega.
- Verificações locais: lint e build do frontend aprovados, incluindo TypeScript; build do backend e suíte básica aprovados com 72 testes, nenhuma falha e quatro integrações PostgreSQL puladas sem `TEST_DATABASE_URL`; verificador documental aprovou 249 arquivos e os links internos. Abertura dos arquivos no Excel/leitor de PDF, navegador autenticado, Meta real e versão publicada ainda exigem conferência específica.

### Revisão documental e linguagem — 30/09

- A documentação foi comparada com o código, os testes e as mudanças do banco. P06 passou a aparecer como **em andamento com base validada no PostgreSQL**, e P08 como **iniciado com histórico e análise parcial**. Hardware, manutenção, validade no mapa, telões, exportações e relatório Power BI continuam pendentes.
- Foram corrigidas contradições sobre exclusões administrativas, sessão após recarregar a página, foto do login, tema escuro, movimento reduzido, rota do WhatsApp, hospedagem e documentos de shopping.
- Índices, regras e planos foram simplificados para privilegiar linguagem direta. Registros importados e rotinas internas que não pertenciam ao TCC foram removidos; nossos acordos úteis foram reunidos no `CONTRIBUTING.md`.
- Verificações desta revisão: mapa e links internos aprovados para 246 arquivos; `git diff --check`, lint e build da interface aprovados; testes básicos do servidor com 70 aprovações, nenhuma falha e quatro integrações puladas por falta de `TEST_DATABASE_URL`. O build mantém o aviso conhecido de arquivos acima de 500 kB.

### Análise demonstrativa no sistema — 30/09

- O painel do gerente ganhou a rota `/painel/analise`, inspirada no frame de referência do projeto: cartões de capacidade, gráfico de ocupação diária, distribuição por setor e tipo, entradas e saídas, ocupação por horário, resumo do período e tabela setorial. A composição usa preto, grafite, textos claros e amarelo VAGGU.
- A tela usa nome, capacidade, setores e tipos do shopping da sessão. Sem histórico, exibe dados de exemplo com o aviso `Dados genéricos · demonstração` e não grava esses exemplos no banco.
- Quando há histórico, ocupação, cobertura, entradas observadas, dias e setores usam dados confirmados. Entradas e saídas por dia, ocupação por horário, permanência e rotatividade ainda são demonstrações e precisam ser identificadas separadamente.
- A consulta cobre os últimos sete dias e nunca usa dados de outro shopping. Os testes básicos aprovaram 68 cenários; a execução com PostgreSQL aprovou 34/34, incluindo sensores e histórico. Ainda faltam seleção de período, exportação e uma nova conferência visual com login.

O relato de 19/10 situa a Sprint 1 no começo de agosto (brainstorming) e a Sprint 2 na criação da ideia no Figma até a Sprint 3, sem datas exatas. As fotografias recebidas em 19/10 confirmam a Sprint 3 em 09–16/09, a Sprint 4 em 23–30/09, a Sprint 5 em 05–19/10 e a Sprint 6 em 19–28/10/2026. Os ciclos têm duração variável e não devem ser retrocalculados. O registro consolidado está em [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md); essa numeração não corresponde aos pacotes técnicos P01–P11.

Classificações: **verificado** exige execução do comportamento indicado; **presente no código** significa inspeção estática; **parcial** identifica uma entrega incompleta; **ausente** indica que não foi encontrada implementação no escopo inspecionado. Um teste simulado não comprova banco, hardware ou serviço externo real.

### Experiência dos painéis — entrega de 24/09

- Por decisão interna, a navegação Admin foi separada em visão geral, estrutura/mapa e gerentes; o painel Gerente separa estacionamento de Minha conta. A sidebar agrupa itens globais e contextuais, fecha no celular após navegar e oferece alternância clara/escura com ícones de sol e lua.
- A área estrutural alterna configuração, mapa e posições. Importar e exportar abrem janelas. A exportação gera localmente um XLSX estilizado com abas Vagas e Resumo, filtro, primeira linha fixa, larguras legíveis e códigos textuais; não exporta histórico de ocupação nem usa uma rota nova da API.
- O ensaio visual nesta tarefa usou frontend local e uma API **simulada** em `127.0.0.1`; verificou rotas Admin/Gerente, andares, janelas, temas e ausência de transbordamento horizontal nas larguras inspecionadas. Não comprova o deploy, PostgreSQL ou autenticação com contas reais. A comparação exata com o Figma e a abertura do arquivo no Microsoft Excel ficam pendentes.
- Verificações: `npm.cmd run lint` e `npm.cmd run build` no frontend passaram; TypeScript foi conferido pelo build. O XLSX foi gerado e relido programaticamente, mas não aberto no Microsoft Excel. O navegador não registrou erros/avisos de console no ensaio. O build mantém aviso de chunk maior que 500 kB; ExcelJS carrega somente ao pedir o arquivo. O frontend não declara scripts `test` ou `typecheck` separados.
- A árvore original também continha mudanças de P06 (`confirmacao-estado` e documentação), além de alterações em `index.html` e no texto de restauração da ficha Admin. Foram preservadas. A UX foi commitada primeiro em branch própria, com Juan como responsável técnico indicado e Elisa/Ana como revisoras indicadas; a autoria Git permaneceu com quem executou o commit.

### Ajustes de leitura e rolagem móvel — 24/09

- A lista administrativa define texto preto no marcador amarelo “Abrir ficha”, inclusive no tema escuro. O formulário de shopping foi dividido em identificação, endereço e operação, com validação por etapa e preservação dos campos ao voltar. Na ficha, contatos aparecem em resumo e a edição fica recolhida até ser solicitada.
- O rodapé móvel da landing não repete a imagem de celulares usada no desktop. Passou a organizar marca, chamada e links já existentes em áreas separadas; o botão de WhatsApp do rodapé aparece somente quando o número oficial estiver configurado. O restante da landing ainda contém chamadas de WhatsApp sem a mesma guarda e precisa de revisão específica.
- A implementação foi feita na branch local `fix/admin-mobile-footer-juan`, a partir de `main` em `a000e7a`. Responsável técnico indicado: Juan; revisão de experiência indicada: Elisa; revisão documental indicada: Ana. Não representa autoria ou revisão efetivamente assinada por esses integrantes.
- Verificação técnica: as verificações do frontend e da documentação foram aprovadas. Naquela primeira conferência, apenas a versão para computador foi aberta; a validação em 390 px foi concluída logo depois e está registrada na seção seguinte. O fluxo Admin com login, celular físico e versão publicada ainda precisam de nova conferência.

### README e evidências reproduzíveis — 24/09

- O README da raiz agora orienta o visitante do GitHub por objetivo, mostra badges das tecnologias presentes, distingue entrega de backlog, explica por que `npm ci` isolado não inicia a aplicação e registra marcos por dia. Logos dos badges são servidas externamente por Shields.io com catálogo Simple Icons; a documentação textual não depende dessas imagens.
- Quatro capturas novas foram feitas em `http://127.0.0.1:5173/` com Chromium automatizado: landing e login em 390 px, rodapé em 390 e 1440 px. As animações foram aguardadas. Nas duas larguras, `document.documentElement.scrollWidth` não excedeu `innerWidth`; não houve erro JavaScript de página. O print móvel confirma visualmente que não há imagem de celulares no rodapé. A checagem inicial de visibilidade do elemento `img` foi inconclusiva por não considerar corretamente o ancestral oculto; a captura renderizada é a evidência desta afirmação.
- O índice de evidências separa prints locais atuais de P02–P04 históricos e corrige a afirmação antiga de que a exclusão reversível de gerente estaria ausente. As imagens públicas atuais não comprovam o fluxo Admin/Gerente autenticado, banco real, provedor externo ou deploy. A interface administrativa móvel atual ainda precisa de uma captura autenticada e de um teste de edição em etapas.
- Revisão editorial posterior: o README público foi transformado em apresentação atemporal da proposta, da experiência por perfil, das imagens comentadas e da stack, sem datas, “MVP” ou lista de pendências. Esta segunda mente preserva o cronograma, as ressalvas das evidências e os limites técnicos; a revisão não acrescenta funcionalidades ao produto.
- O Vite foi removido dos badges, da tabela e do diagrama do README para destacar as tecnologias centrais; permanece descrito na documentação técnica e na configuração onde seu papel de build importa. O Tailwind CSS ganhou badge e os estilos CSS próprios são mencionados na tabela da interface. A descrição do README no mapa do projeto foi revista e continua correta.

### Ajustes da landing móvel — 24/09

- A variante SVG branca da marca não aplica mais sombra desfocada, mantendo os contornos nítidos no cabeçalho móvel. O card claro de contato tem texto escuro explícito para continuar legível mesmo quando o tema escuro está salvo. As conexões do notebook começam quando 80% do painel está visível; as etapas anteriores conservam seu gatilho.
- Revisão visual local em Chromium/Edge nas larguras de 390 e 1440 px: texto do card escuro e visível mesmo com a classe `dark`, marca vetorial carregada, conexões ainda ocultas no início e completas após o painel entrar, sem erros JavaScript nem overflow horizontal. Não representa teste no celular físico nem confirmação do deploy. O mapa do projeto foi revisto para os arquivos modificados; as descrições que permaneceram corretas não foram reescritas.

### Revisão de sessão, shopping e vagas — 24/09

- Causa do logout no F5: o token anterior existia só em uma referência React e as rotas redirecionavam antes de uma consulta inicial. O login web passou a receber cookie HttpOnly, `SameSite=Strict` e `Secure` em produção; `/auth/me` restaura identidade e expiração antes da rota decidir. O backend ainda aceita Bearer para compatibilidade. Escritas por cookie exigem cabeçalho próprio contra CSRF; logout revoga a sessão e remove o cookie. A senha provisória permanece apenas em memória durante a troca.
- As listas do mapa compartilhado usam grid de colunas automáticas para reduzir rolagem sem esmagar códigos e estados. O fallback da foto usa ícone escuro no tema claro e claro no escuro; o cabeçalho da ficha libera uma linha para nome e endereço no celular e tablet. As descrições da situação da estrutura correspondem aos nove estados já existentes no backend; as cores diferenciam etapa, pendência, operação e inatividade sem chamar ativação de comprovação dos sensores. A auditoria do tom dourado no tema claro levou à troca dos textos e ícones comuns por neutro escuro, mantendo amarelo onde comunica seleção ou contrasta sobre fundo escuro.
- O formulário consulta ViaCEP após oito dígitos, com espera de 400 ms, cancelamento de consulta anterior e prazo de oito segundos; campos de endereço permanecem editáveis, e número/complemento continuam manuais. Formato inválido, CEP inexistente e indisponibilidade produzem mensagens distintas.
- Verificações desta revisão: frontend lint e build aprovados; backend `npm test` aprovou 50/53, com três cenários dependentes de PostgreSQL pulados; `npm run test:integracao` aprovou 32/32 em banco descartável. Navegador local com API simulada comprovou login/F5 em `/admin`, logout com retorno persistente ao login, CEP válido, inexistente e indisponível, 60 vagas em grid a 390, 768 e 1440 px, cabeçalho longo legível no tablet e fallback da foto legível no tema escuro, sem overflow nem erros de página. Isso não comprova upload Blob real nem autenticação em deploy. O mapa do projeto foi revisto; descrições não alteradas continuam válidas.

### Leitura operacional e CEP hospedado — 25/09

- A visão geral do Admin compactou as cinco contagens de vagas em grid de duas colunas no celular, três no tablet e cinco no desktop. Ícones diferentes identificam total, livres, ocupadas, indisponíveis e categorias especiais; os números continuam derivados da estrutura persistida, sem inferir disponibilidade de vaga sem leitura.
- O aviso de implantação do gerente recebeu superfície e textos legíveis no tema escuro. Rótulos do cadastro de shopping ganharam contraste no tema claro. A escolha de CSV/XLSX foi alinhada à margem esquerda da janela de importação.
- Causa identificada no build servido pelo Express, que corresponde à configuração versionada para hospedagem: o Helmet emitia `default-src 'self'` sem exceção de conexão para o ViaCEP. A chamada real retornou 200 quando feita pelo frontend local, mas era bloqueada pela política do Express. A API passou a declarar somente `connect-src 'self' https://viacep.com.br`; o contrato do formulário não mudou. A API oficial dos Correios exige contrato comercial e token, portanto não foi introduzida. O comportamento no endereço público ainda requer conferência após o deploy.
- Verificações: frontend lint/build aprovados; backend `npm test` aprovou 51/54 com três integrações PostgreSQL puladas nesta execução. Edge headless, com API administrativa simulada, confirmou cards a 320, 390, 768 e 1280 px, aviso escuro e modal de importação, sem overflow nem erros de página. Em build React servido pelo Express real, CEP `01001000` consultou o ViaCEP com resposta 200 e preencheu Praça da Sé, Sé, São Paulo e SP; o número permaneceu manual. O teste não comprova a publicação no Render nem acesso com conta real. As descrições não alteradas do mapa do projeto foram revistas e permanecem válidas.

### Remoção de imagem do cadastro de shopping — 25/09

- Por decisão interna, o cadastro de shopping não recebe nem apresenta imagem. Foram removidos seletor, prévia, fallback, contratos, rotas, adaptador de armazenamento, configuração de ambiente e dependência do provedor externo.
- O schema Prisma deixou de expor o campo e recebeu migration incremental para remover a coluna legada. As migrations anteriores permanecem imutáveis para conservar a sequência de bancos já atualizados.
- A documentação de produto, telas, configuração e arquitetura foi alinhada ao novo escopo. A remoção foi validada por typecheck e testes do backend, lint e build do frontend; a integração PostgreSQL aprovou 33/33 cenários em banco descartável.

## 2. O que foi implementado

**Inventário histórico:** esta tabela reúne o diagnóstico anterior às entregas de 19–21/10 e aos aceites de novembro. Itens nela descritos como ausentes ou parciais devem ser confrontados com a revisão de 09/11; não representam tarefas automaticamente abertas.

| Área | Estado atual | Evidência e limite |
| --- | --- | --- |
| Landing, marca, login separado e contato comercial | Verificado na interface; contato real pendente | [Landing](../../../vaggu-frontend/src/pages/landing-page.tsx). Número de exemplo removido em 11/09; ainda não dispomos de número oficial. Não foi enviada mensagem. |
| Seção Sobre | Verificado | [Componente](../../../vaggu-frontend/src/components/sobre-vaggu.tsx) e [estilos](../../../vaggu-frontend/src/components/sobre-vaggu.css): texto de apresentação, anéis, etapas, notebook e benefícios. |
| Movimento e responsividade da seção Sobre | Atualizado em 28/09 | Pontos percorrem os anéis automaticamente quando o movimento está habilitado. A versão atual respeita a preferência do usuário por menos movimento. Conexões das etapas e benefícios acompanham o layout. |
| Seção abaixo do Sobre | Verificado | [Operação VAGGU](../../../vaggu-frontend/src/components/operacao-vaggu.tsx): foto urbana, título, explicação, benefícios e contato. Conteúdo usa hierarquia mais leve e altura ajustada. |
| Remoção das legendas e do controle manual | Verificado novamente em 14/09 | Não há legenda visível do notebook, texto de pausa ou botão de controle das animações. O `alt` do notebook informa que é ilustração. |
| Login e destinos autenticados | Integração verificada e persistência revisada em 24/09 | API real, cookie HttpOnly restaurado por `/auth/me`, primeira senha e logout; sem contas locais. Troca exige seis critérios, mostra checklist, olhos independentes e erros por campo. Cadastro público não existe. |
| Estado sem sensores | Verificado novamente em 21/09 | O gerente recebe da API a situação de implantação do próprio shopping. Enquanto não estiver ativa, a interface apresenta o aviso e mantém a estrutura visível; vagas sem leitura confirmada permanecem indisponíveis. |
| Base Express e saúde | Verificado em 10/09 | `start` e `dev` iniciaram a saída compilada; health e readiness responderam 200 com PostgreSQL local. Processos de API usados na verificação encerrados. |
| Autenticação e conta na API | Verificado nos cenários de integração em 10/09 | [Runner](../../../vaggu-backend/test/integracao-acessos.test.ts): identidade, hash, sessão, primeira senha, conta, expiração, logout e escopo entre shoppings. Frontend integrado em 11/09; rotas de vagas usadas nos testes são exclusivas da suíte. |
| Shoppings e vários gerentes | Verificado no recorte entregue | Cadastro e exclusão lógica de shopping, dois gerentes, redefinição e bloqueio individual aprovados no PostgreSQL e na interface. O banco mantém apenas o hash da senha provisória; o Admin pode copiá-la somente na resposta imediata de criação ou redefinição. |
| Persistência PostgreSQL | Atualizações aplicadas e integração local verificada | Bancos de desenvolvimento e teste separados. Autenticação, importação, sensores, histórico e análise foram exercitados com PostgreSQL; isso não substitui o teste com hardware ou no ambiente publicado. |
| Webhook WhatsApp | Parcial | [WhatsApp](../../../vaggu-backend/src/whatsapp/service.ts): assinatura, distinção entre mensagens/status, deduplicação e cliente Meta. Conversa contém menu de teste; fluxos de demonstração/suporte não estão concluídos. |
| Andares, setores, tipos e mapa | Verificado em P04 e novamente em 21/09 | Estrutura por shopping, posições proporcionais, dois andares, categorias, filtros, seleção e busca entre andares aprovados. Admin e gerente usam o mesmo mapa; as alterações administrativas atualizam a tela automaticamente. O mapa usa base neutra; associação de planta ilustrada permanece uma evolução. |
| Importação CSV/XLSX | Verificado, P05 concluído em 21/09 | A API aceita CSV e XLSX, aponta erros por linha e campo, identifica criação ou atualização e guarda a prévia de cada shopping. Repetir a confirmação não duplica dados. Os testes comprovaram concorrência, preservação de registros e manutenção das vagas ausentes. |
| Navegação dos painéis e exportação estrutural | Interface verificada com API simulada em 24/09 | Admin e gerente têm rotas separadas, tema claro/escuro e janelas de importação/exportação. O XLSX estrutural é gerado no navegador a partir da árvore já autorizada; não contém histórico nem prova integração com o deploy. |
| ESP32, sensores, confirmação e expiração | Base implementada e testada com PostgreSQL em 30/09 | A placa possui credencial própria; o sistema controla a ordem, ignora repetições, confirma após 30 segundos e expira cada sensor separadamente. Validade na consulta e monitoramento individual estão implementados; faltam firmware real, valores definitivos, cadastro operacional, comandos/ocorrências de manutenção, atualização automática e homologação publicada. |
| Histórico e análises | Em andamento | O sistema consulta os últimos sete dias e calcula ocupação, cobertura e entradas sem misturar shoppings. Parte dos gráficos ainda usa exemplos. Período de até 31 dias, comparação e Excel/PDF estão implementados. Faltam filtros complementares, saídas/permanência/rotatividade, tratamento de cobertura zero (CA28) e classificação histórica (CA30). |
| Contagens e telões | Ausentes como fluxo funcional | Dependem da conclusão operacional do P06 e não podem tratar dado antigo como vaga livre. |
| Power BI | Protótipo sintético ampliado em 30/09 | O registro histórico de 30/09 relata `VAGGU — Relatório de ocupação sintética` no `Meu workspace`; essa existência externa não foi reconfirmada nesta auditoria. O protótipo descrito mantinha a prova controlada de seis intervalos e recebeu uma análise de 784 intervalos sintéticos com cartões, linha temporal, rosca por setor, barras por tipo e tabela setorial. Fundo preto e amarelo principal seguem a referência visual da VAGGU. Ainda não usa atualização automática nem distribuição isolada; portanto P09 permanece pendente. |

## 3. Revisão final — achados e prioridades

| ID | Prioridade | Evidência | Impacto e encaminhamento |
| --- | --- | --- | --- |
| R01 | Resolvido em P01 | `dev`/`start` apontam para `dist/src/server.js`. | Ambos iniciaram a API após build e responderam health/readiness com banco conectado. |
| R02 | Resolvido em P01 | Runner chama `runAuthCases` e `runAdminCases` em banco exclusivo. | 47 testes aprovados na suíte completa. CA04–CA06 cobertos na API; CA07 coberto nos cenários disponíveis, sem alegar validação de exportações/tempo real/frontend ausentes. Sem configuração, integração fica explicitamente pendente; banco inacessível falha. |
| R03 | Resolvido para o ambiente local de P01 | Node portátil 24.18.0 e npm 11.16.0 em `ambiente.local`; dependências instaladas pelo lockfile. | A versão global 26.7.0 foi observada naquela máquina em P01, não é requisito nem medição deste computador. Respeitar a faixa >=22.12.0 <25 do [guia local](configuracao.md). Engines e versões de dependências preservados. |
| R04 | Resolvido e atualizado em 24/09 | Login e consulta de identidade na API, sessão em cookie protegido e validação de perfil/primeira senha. | A sessão volta após recarregar a página; logout, bloqueio e expiração encerram o acesso. |
| R05 | Resolvido em P01 | Removido apenas o import `useMotionTemplate` sem uso. | Frontend `npm.cmd run lint` e `npm.cmd run build` aprovados; aviso de bundle permanece. |
| R06 | Concluído em 04/11/2026 | Número oficial +55 (11) 99380-7892 configurado na landing; conexão real e menu confirmados pelo participante. | Preservar possibilidade de override por VITE_WHATSAPP_NUMBER e testar após trocas. |
| R07 | Mitigado; revisão operacional permanece | Claim atômico e deduplicação; envio incerto fica em REVISAO, sem repetição automática. | Não há transação distribuída com a Meta; revisar eventos incertos antes de intervenção manual. |
| R08 | Resolvido em P03 e endurecido em 21/09 | A resposta administrativa informa `ativo` sem expor hash, senha definitiva ou token. A senha provisória em texto existe somente na resposta imediata de criação ou redefinição. | Listagem, bloqueio e reativação foram validados; a migration remove a cópia reversível e os testes asseguram que a listagem não reapresente a senha. |
| R09 | Média, evolução do backend | `tsconfig.json`: `strict` e `noImplicitAny` desativados; contratos de serviços incompletos. | Tipar fronteiras e módulos tocados progressivamente; evitar refatoração global junto da integração. |
| R10 | Baixa, acabamento | A regra antiga de `figcaption` já foi removida. O arquivo principal gerado do site ainda passa de 500 kB. | Avaliar a divisão por rotas quando isso trouxer ganho real. Não é falha de build. |
| R11 | Resolvido em C01 | A auditoria de 23/09 encontrou uma regressão na ficha nova: as ações de excluir shopping, excluir gerente e desfazer não estavam montadas. | A ficha voltou a chamar os contratos existentes, com confirmação, feedback, sete segundos para desfazer gerente e retorno à lista após excluir shopping. |
| R12 | Alta, consistência documental — resolvida no D01 | A auditoria encontrou Visão do produto e tecnologias descrevendo P05 como parcial; evidências visuais antigas apareciam sem aviso histórico. | Resumos corrigidos, novas evidências catalogadas e estados implementado, histórico e planejado separados em 23/09. |

Revisão visual: composição, tipografia, cores, imagens, conexões e comportamento em telas menores foram comparados com os anexos e com as revisões posteriores registradas. Não houve nova extração de medidas do Figma: a integração retornou erro de seleção na etapa anterior. Mantêm-se as pendências do [guia visual](regras-visuais.md).

## 4. Verificações executadas e limites

| Conferência | Resultado em 09/09/2026 |
| --- | --- |
| Frontend `npm.cmd run build` | Passou, código 0; aviso de bundle acima de 500 kB. |
| Frontend `npm.cmd run lint` | Falhou, código 1: R05. O lint direcionado aos componentes alterados havia passado na etapa anterior; isso não equivale ao lint geral. |
| Chrome em `http://127.0.0.1:5173/` | Landing identificada, imagens carregadas, ausência das duas legendas confirmada e nenhum erro registrado. Larguras 1440 e 360 px sem transbordamento nesta revisão. |
| Movimento/teclado, etapas anteriores da mesma sessão | Pausa/retomada por teclado, movimento reduzido, pausa fora da tela e larguras 320/360/768/1024/1440 px conferidas. Não constituem auditoria completa de acessibilidade. |
| Backend build/typecheck/test/Prisma | Não executados nesta revisão: dependências ausentes e Node fora da faixa declarada. A existência dos testes foi inspecionada, não apresentada como execução. |
| PostgreSQL, Meta e hardware reais | Não acessados/validados nesta revisão. Testes HTTP simulados e leitura de schema não comprovam essas integrações. |
| Git e diffs | Alterações preservadas e `git diff --check` aprovado. Após a revisão, autorizamos explicitamente commit e push na `main` ao invocar `$end`; publicação preparada neste fechamento. |

Os comandos acima são relativos ao diretório de cada pacote. Em PowerShell deste ambiente, usar `npm.cmd`, pois `npm.ps1` está bloqueado pela política de execução. Para outras máquinas, confirmar gerenciador e scripts atuais; não copiar comandos de migration para um banco sem identificar seu destino.

### 4.1 Verificações de P01 — 10/09/2026

| Diretório e comando/conferência | Resultado |
| --- | --- |
| `vaggu-frontend`: `npm.cmd run lint` e `npm.cmd run build` | Ambos código 0; bundle de aproximadamente 526 kB mantém o aviso já conhecido. Sem mudança de comportamento visual; não foi repetida a revisão de navegador/Figma. |
| `vaggu-backend`: `npm.cmd ci --cache ../.npm-cache --offline --no-audit --no-fund`, com Node 24.18.0/npm 11.16.0 | 257 pacotes instalados do lockfile. Scripts automáticos de Prisma não foram aprovados globalmente; geração executada explicitamente. |
| `vaggu-backend`: `npm.cmd run db:generate`, `npm.cmd run typecheck`, `npm.cmd run db:validate` e `npm.cmd run db:deploy` | Código 0; cliente Prisma 7.10.0 gerado, tipos/schema válidos e migration aplicada somente ao banco local `vaggu_local`. Geração exigiu acesso fora da sandbox ao cache do Prisma. |
| `vaggu-backend`: `npm.cmd test` sem `TEST_DATABASE_URL` | 24 aprovados e 1 skip com mensagem PENDENTE, comprovando ausência explícita da integração. |
| `vaggu-backend`: `npm.cmd run test:integracao` | 24 testes aprovados, sem skip, com PostgreSQL real e banco descartável. |
| `vaggu-backend`: `node --env-file=.env.teste.local ../ambiente.local/node-v24.18.0-win-x64/node_modules/npm/bin/npm-cli.js test`, com PATH portátil | Suíte completa: 47 aprovados, 0 falhas, 0 skips. |
| `vaggu-backend`: `node --test dist/test/integracao-acessos.test.js`, com URL de teste apontando para porta local inacessível | Código 1 e mensagem de impossibilidade de criar banco isolado conferidos; falha não convertida em skip. |
| Raiz: verificador temporário em `ambiente.local/verificar-inicio.mjs` | `npm run start` e `npm run dev` responderam health/readiness 200, portas 3051/3052. Encerramento das árvores de processos exigiu execução fora da sandbox e foi concluído. |
| Raiz: verificador temporário em `ambiente.local/verificar-preservacao.mjs` | Banco de controle sem tabelas de aplicação; desenvolvimento sem usuários/shoppings/sessões fictícios; nenhum banco descartável remanescente. |
| Raiz: `git diff --check` e `git check-ignore` dos arquivos locais | Sem erros de whitespace; `.env`, `.env.teste.local` e ferramentas/dados locais ignorados. Lockfile preservado. |

O PostgreSQL portátil escuta somente em `127.0.0.1:55432`. Configurações locais e ferramentas estão ignoradas pelo Git, sem segredos no planejamento. Meta, hardware, navegador autenticado e Power BI reais não foram validados. Os resultados de 09/09 acima permanecem como histórico daquela revisão.

## 5. Backlog ordenado

Estados do backlog: **pronto**, **em andamento**, **bloqueado**, **concluído**. Dependências ainda não entregues permanecem explícitas. A prioridade não é uma promessa de prazo.

Nossas sprints reais estão registradas em [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md). Os itens abaixo são pacotes técnicos e de correção; a numeração não deve ser confundida.

| ID | Entrega | Estado | Dependências | Critério para concluir |
| --- | --- | --- | --- | --- |
| D01 | Consolidar documentação, sprints e evidências após a auditoria de 23/09 | Concluído em 23/09 | Auditoria concluída e fontes visuais do projeto. | PRD, TRD, fluxo, modelo de dados, API, identidade, sprints, índices e mapa coerentes; verificador documental aprovado. |
| C01 | Corrigir divergências funcionais da interface atual | Concluído em 23/09 | D01 concluído; contratos administrativos existentes preservados. | Exclusões e desfazer reconciliados com o backend; estados e documentos atualizados; frontend lint/build e integração PostgreSQL aprovados. |
| P01 | Base local verificável: R01, R02, R03 e R05 | Concluído em 10/09 | Runtime compatível e PostgreSQL local preparados; evidências na seção 4.1. | API inicia pelo caminho gerado; frontend lint/build aprovados; cenários auth/admin executados em banco real isolado. |
| P02 | Integrar login, sessão, troca obrigatória e saída | Concluído em 11/09 | P01 concluído. Contratos `/api/v1/auth/login`, `/me`, `/change-password` e `/logout` integrados pelo proxy local; token fica apenas em memória. | Frontend consulta identidade da API; senha provisória restringe acesso, troca libera; expiração e logout revogam acesso. Fluxos validados no navegador/API. |
| P03 | Integrar Admin, vários gerentes e minha conta | Concluído em 12/09 | Contratos reais integrados; DTO informa situação ativa e bloqueio remove sessões na transação. | CA04, CA06 e o recorte disponível de CA07 aprovados em PostgreSQL real; fluxos principais aprovados no navegador. |
| P04 | Estrutura e implantação: andares, setores, vagas, categorias e mapa | Concluído em 12/09 | P03 concluído; migration e contratos incrementais entregues. | CA08–CA12 cobertos: estado de configuração, dois andares, filtros, seleção, busca entre andares, rejeição de vaga de outro andar, revisão concorrente e isolamento. |
| P05 | Importação CSV/XLSX com prévia e preservação de histórico | Concluído em 21/09 | Backend, PostgreSQL e interface Admin autenticada validados; confirmação concorrente e recarga da estrutura aprovadas. | CA13–CA14 cobertos sem alteração parcial, perda de ID/histórico ou remoção silenciosa de vaga ausente. |
| P06 | ESP32, sensores e estados confiáveis | Em andamento: base validada com PostgreSQL | Recepção, confirmação, repetição segura, ordem, expiração e histórico implementados; faltam ESP32 real, tempos finais, manutenção, validade no mapa e publicação. | Mudança após 30 segundos consistentes, mensagens repetidas sem duplicação e expiração individual. CA15–CA24. |
| P07 | Operação, manutenção, contagens e telões | Bloqueado por P06 | Observações confiáveis e ocorrências. | Contagens reconciliadas sem duplicar categorias; dado vencido não vira livre. CA23–CA26. |
| P08 | Histórico, métricas e exportações | Em andamento | Consulta e resumo dos últimos sete dias por padrão, filtro UTC de até 31 dias, comparação com período anterior e exportações locais iniciais implementados; métricas complementares e filtros de setor/categoria ainda faltam. | Cálculos reproduzem o conjunto de conferência; exportações respeitam shopping e filtro de datas. CA27–CA31 seguem parciais. |
| P09 | Primeiro relatório funcional Power BI | Bloqueado por P08 | Histórico disponível e decisão de distribuição/acesso. | Atualização funcional e métricas reconciliadas (CA32); isolamento de acesso (CA33) só concluído na distribuição efetiva. |
| P10 | Concluir fluxos comerciais WhatsApp | Parcial: conexão e menu reais confirmados | Caixa empresarial autorizada; definir operação humana, retenção e solicitações estruturadas. | CA01 atendido no percurso confirmado; CA02–CA03 exigem evolução além do menu informativo. |
| P11 | Revisão integrada para apresentação do TCC | Bloqueado pelas entregas utilizadas na demonstração | Fluxos completos, dados identificados e ambiente reproduzível. | Executar roteiro de `plano-e-aceite.md`, declarar limitações e validar CA34–CA36 conforme o escopo. |

Preservar os limites do produto: site responsivo, sem cadastro público de gerente, sem reservas, pagamentos ou reconhecimento de veículos. Power BI e hardware não podem ser declarados integrados a partir de imagens, dados de exemplo ou espaços reservados.

## 6. Trabalho atual e próxima implementação

- **Pacote documental concluído:** D01 — consolidação documental e das sprints, finalizada em 23/09/2026.
- **Pacote corretivo concluído:** C01 — exclusões administrativas e desfazer restaurados na ficha atual.
- **Prioridade atual definida em 25/09:** concluir a experiência do site antes de retomar integrações externas. WhatsApp, firmware ESP32 e ingestão de sensores permanecem no backlog, sem serem apresentados como funcionalidades prontas.
- **Pacote do site versionado na `main`:** a visão geral administrativa resume shoppings, gerentes ativos e estrutura cadastrada, indica cadastros incompletos e oferece atalhos para cada ficha. Carregamento, vazio e erro não inventam dados. A publicação no Render ainda não foi conferida nesta revisão.
- **Pacote do site concluído localmente:** Minha conta agora atende Admin e gerente, separa dados pessoais de segurança e oferece troca voluntária mediante a senha atual. A política visual é compartilhada com a primeira troca obrigatória; perfil, e-mail e vínculo não podem ser alterados pela tela.
- **Pacote do site em andamento em 28/09:** auditoria responsiva e acessível dos fluxos autenticados, priorizando navegação por teclado, foco, mensagens de erro, contrastes, cortes e estados vazios em Admin e gerente.
- **Primeira ação em execução:** inventário da ficha de shopping, estrutura/mapa, gerentes e importação; a tabela de posições recebeu nomes acessíveis por campo e o seletor de andar foi adaptado para telas estreitas.
- **Sequência web sugerida:** auditoria responsiva e acessível; correções encontradas; somente então retomar P06 e, depois, os fluxos de WhatsApp.
- **Base já validada:** P05 concluído no PostgreSQL e no navegador em 21/09; estrutura, IDs e histórico permanecem preservados durante importações. O mapa e o detalhe da vaga não devem alegar saúde do sensor antes do P06.
- **Comandos mínimos:** backend build/test/integração quando houver novo contrato; frontend lint/build e ensaio renderizado; `node scripts/verificar-documentacao.mjs` em toda entrega.
- **Estado desta anotação, substituído em 30/09:** P01–P05, D01 e C01 estavam concluídos. Depois dela, P06 recebeu recepção, confirmação, expiração e histórico testados no PostgreSQL; o pacote continua aberto pelas pendências de hardware e operação descritas no início deste documento.

### 14/09/2026 — PostgreSQL local instalado e configurado

- Instalador oficial EDB 17.11-3 com assinatura válida; instalação em `C:/Program Files/PostgreSQL/17`, fora do repositório. Serviço `postgresql-vaggu-17` automático e em execução, porta 5432; autenticação SCRAM restrita a loopback pelo pg_hba.
- Bancos `vaggu` e `vaggu_teste` com usuários separados. Usuário de desenvolvimento sem superusuário/CREATEDB; teste com CREATEDB para bancos descartáveis. Segredos somente em `.env`, `.env.teste.local` ignorados e credencial administrativa protegida pelo Windows no perfil local.
- Cinco migrations aplicadas ao novo banco `vaggu`. Suíte completa com `.env.teste.local`: 68 aprovados, zero falhas, zero skips; bancos descartáveis removidos pela suíte. API `/api/v1/health/ready` respondeu `status=ok`, `banco=conectado`.
- Comentários e mapa revisados; configuração descartável removida após uso. Pendência anterior de conexão resolvida; confirmação de importação continua pendente.

### 14/09/2026 — persistência inicial do P05 (Samuel)

- Migration incremental adiciona `importacoes_estrutura`, JSONB, vínculo ao shopping e restrições de formato; não modifica vagas ou histórico.
- Prévia gravada em transação Repeatable Read, com ID retornado e consulta administrativa por shopping/ID; shopping excluído não permite consulta.
- Na primeira verificação desta etapa, cliente Prisma, typecheck e build foram aprovados; 37 testes passaram e 2 integrações ficaram pendentes porque ainda não havia `TEST_DATABASE_URL` ou serviço detectado. A instalação e a validação posteriores estão registradas na entrada imediatamente anterior.
- Comentários e mapa revisados; schema, serviço e rotas documentam as novas responsabilidades. Sem confirmação de importação, política de retenção ou substituição de artefato ativo nesta etapa.

## 7. Registro diário

Cada entrada mantém: data local, estado do dia, pacote/objetivo, evidências de entrada, alterações, verificações e resultados, pendências/bloqueios, primeira ação da retomada e situação Git. Acrescentar entradas sem apagar dias anteriores. O resumo das seções 1–6 deve acompanhar o estado mais recente.

### 28/09/2026 — auditoria dos painéis e identidade da rolagem

- **Estado:** aberto.
- **Pacote e objetivo:** continuar a auditoria responsiva e acessível dos fluxos autenticados, começando pela ficha de shopping e pela edição de posições; alinhar a barra de rolagem global às cores da VAGGU sem reduzir sua visibilidade.
- **Situação de entrada:** `main` em `52839913`, com uma alteração local autorizada no comentário de `.github/workflows/publicar-render.yml`. Autorizamos sua incorporação ao pacote atual. A branch local `fix/auditoria-paineis-elisa` foi criada preservando esse diff.
- **Alterações iniciais:** a tabela de posições passou a expor legenda, cabeçalhos de coluna e linha e nome acessível para cada campo numérico. O seletor de andar deixou de depender de margem horizontal e se reorganiza em telas estreitas. Por decisão interna, a rolagem usa fundo preto e indicador no amarelo oficial da VAGGU em ambos os temas.
- **Verificações:** frontend `npm.cmd run lint` e `npm.cmd run build` aprovados após a definição final de fundo preto e indicador amarelo; o build mantém apenas o aviso conhecido de chunks maiores que 500 kB. O verificador documental cobriu 241 arquivos e aprovou os links internos. O ensaio anterior em 1280 × 720 e 390 × 844 confirmou ausência de rolagem horizontal, mas antecede a troca final da cor do trilho. O backend não foi iniciado nesse ensaio, portanto o proxy de `/auth/me` recusou conexão e a tabela autenticada de posições ainda precisa de validação renderizada com dados, embora sua legenda, cabeçalhos e nomes acessíveis tenham sido conferidos no código. As descrições dos arquivos alterados no mapa do projeto permanecem corretas.
- **Próxima ação:** validar teclado, nomes acessíveis, ausência de cortes e rolagens horizontal e vertical nas telas de estrutura e importação; corrigir os próximos bloqueios reproduzíveis.
- **Preparação analítica:** iniciado um recorte independente para o Power BI com seis intervalos confirmados sintéticos, cálculo de métricas e CSV versionado em `test/fixtures`. O conjunto reproduz 60% de ocupação, 83,33% de cobertura, uma entrada observada e 30 minutos de duração completa. Typecheck e suíte do backend foram aprovados: 58 testes, 55 aprovados, zero falhas e três integrações PostgreSQL puladas explicitamente sem `TEST_DATABASE_URL`. O material não grava dados no Neon nem substitui ingestão, confirmação ou expiração do P06; serve para reconciliar fórmulas e prototipar os gráficos antes do hardware.
- **Protótipo no Power BI:** criado no `Meu workspace` o modelo semântico `VAGGU — Ocupação sintética` e salvo o relatório `VAGGU — Relatório de ocupação sintética`. O primeiro gráfico apresenta contagem de intervalos por estado: livre 3 (50%), ocupada 2 (33,33%) e indisponível 1 (16,67%). A página identifica `DADOS SINTÉTICOS — DEMONSTRAÇÃO`; não houve compartilhamento, publicação, agendamento de atualização nem conexão com o PostgreSQL real.
- **Primeiro recorte operacional P06:** adicionados schema/migrations incrementais para sensor individual, inicialização da placa, sequência global e marcador persistente de evento; rotas `POST /api/v1/telemetria/heartbeat` e `/estados` autenticam com cabeçalho `Device`, rejeitam lote incompatível e usam o relógio do servidor. Confirmações atualizam vaga/histórico atomicamente; expiração por sensor grava `INDISPONIVEL` no instante efetivo e heartbeat não renova leitura. Provisionador e simulador percorrem a mesma API. A lacuna de 15 s e os timeouts de 120 s são padrões configuráveis provisórios até o ensaio do firmware. Schema Prisma, typecheck e suíte foram aprovados: 66 testes, 62 aprovados, zero falhas e quatro integrações PostgreSQL puladas sem `TEST_DATABASE_URL`; logo a persistência P06 ainda não está comprovada em banco executado.
- **Retomada em 30/09/2026:** PostgreSQL 17.11 local foi instalado fora do repositório em `%LOCALAPPDATA%`, restrito a `127.0.0.1:55432`, e o banco de controle `vaggu_teste` foi recriado vazio. As integrações P05/autenticação passaram 33/33 e a integração P06 passou 1/1, sem skips, comprovando migrations, confirmação, deduplicação e expiração em banco executado. A view `power_bi_intervalos_ocupacao` passa a oferecer intervalos confirmados no mesmo contrato de 11 colunas do conjunto sintético. No modelo semântico do Power BI foram salvas as medidas de tempo total, ocupado e conhecido, ocupação histórica, cobertura histórica e entradas observadas. O relatório mantém a página demonstrativa inicial e recebeu uma segunda página com fundo preto, cartões de 60,00%, 83,33% e 1, barras de tempo ocupado por tipo, rosca por setor e tabela de desempenho; os elementos foram redimensionados e verificados em modo de leitura. O relatório permanece identificado como demonstração; atualização direta do serviço contra localhost continua bloqueada até existir gateway ou origem cloud de leitura restrita.
- **Ampliação analítica em 30/09/2026:** criado um gerador determinístico e um CSV com 784 intervalos sintéticos, sete dias, dois andares, quatro setores, dezesseis vagas e todos os tipos previstos. O modelo semântico recebeu a tabela `demonstracao_ampliada` e seis medidas próprias. A terceira página do relatório apresenta cartões, evolução temporal, ocupação por setor, ocupação por tipo e desempenho setorial, com fundo preto e amarelo `#FFE000` como primeira cor dos dados. A prova controlada de seis linhas foi preservada para reconciliação; nenhum dado sintético foi gravado no PostgreSQL real ou apresentado como telemetria recebida.
- **Git:** responsável primária indicada: Elisa; revisão visual de Juan e documental de Ana. Nenhum commit, push, PR ou deploy solicitado.

### 25/09/2026 — revisão documental, código do mapa e detalhe da vaga

- **Escopo:** documentação canônica confrontada com os contratos e componentes atuais; revisão focal do mapa compartilhado e da interação de seleção. A solicitação não autorizou reescrever arquitetura nem introduzir telemetria simulada.
- **Correção:** o clique no mapa, na lista móvel e nas vagas sem posição agora abre um diálogo acessível. Ele mostra código, estado registrado, andar, setor, categoria e situação cadastral. Saúde do sensor, comunicação e última leitura aparecem como indisponíveis até o P06 fornecer observações individuais; heartbeat de placa não é tratado como prova de saúde.
- **Organização:** o componente do mapa foi formatado e dividido; o diálogo ganhou responsabilidade própria e os rótulos de categoria/estado foram centralizados. Funções e módulos tocados receberam comentários curtos de responsabilidade, sem comentários que apenas repetem sintaxe.
- **Documentação:** SSD, fluxo de telas, índice e mapa do projeto foram alinhados ao comportamento real. O próximo pacote passa a priorizar a visão geral administrativa do site; WhatsApp, ESP32 e ingestão ficam adiados sem serem descritos como implementados.
- **Verificações:** frontend lint e build aprovados; o build conserva o aviso conhecido de chunk maior que 500 kB. O verificador documental aprovou 238 arquivos e links internos. Ensaio renderizado local, com cenário temporário removido após o teste, confirmou clique, conteúdo, fechamento por `Esc`, console sem erros/avisos e ausência de overflow em 390 × 844; desktop também foi conferido. Não comprova telemetria, PostgreSQL ou deploy.
- **Git:** branch local `feat/detalhes-vaga-documentacao-pietro`, criada da `main` em `dcc792c`. Responsável primário indicado: Pietro; revisões recomendadas: Elisa em UX/QA, Juan no visual e Ana na documentação. Nenhum commit, push, PR ou deploy foi solicitado.

### 25/09/2026 — validação da produção e visão geral administrativa

- **Produção:** a jornada administrativa publicada foi conferida com o acesso de homologação. Foram criados um shopping e um gerente de teste; nenhum dado real foi usado. A criação e a listagem responderam sem erro no navegador. Credenciais não foram registradas na documentação.
- **Implementação local:** `/admin` passou a ser uma visão geral com indicadores derivados da API, pendências cadastrais e atalhos para as fichas. O cadastro foi separado em `/admin/cadastrar`; a navegação diferencia visão geral, cadastro e lista de shoppings.
- **Contrato:** a listagem administrativa informa totais ativos de andares, setores e vagas, além dos gerentes já disponíveis. Os agregados são calculados no backend e tratados no frontend sem inferir saúde de sensor ou telemetria.
- **Verificações:** typecheck, 51 testes unitários e 32 cenários de integração em PostgreSQL descartável foram aprovados no backend; lint e build do frontend também passaram. A revisão visual final da visão geral confirmou os cinco indicadores, pendências e atalhos em 1280 × 720 e 390 × 844, sem rolagem horizontal nem erros ou avisos no console.
- **Próxima ação:** revisar Minha conta e projetar a troca voluntária de senha com testes de autenticação, mantendo WhatsApp e ESP32 fora deste pacote.
- **Git:** mudanças permanecem locais na branch `feat/detalhes-vaga-documentacao-pietro`; nenhum commit, push, PR ou deploy foi solicitado.

### 25/09/2026 — Minha conta e troca voluntária de senha

- **Implementação:** Admin e gerente agora possuem Minha conta em rotas próprias. A tela separa dados pessoais de segurança e permite alterar a senha definitiva somente após confirmar a senha atual; e-mail, perfil e vínculo com shopping permanecem fora da edição pessoal.
- **Organização:** a conta e o formulário de segurança foram extraídos para componentes compartilhados. Requisitos e códigos de validação ficaram em um único serviço usado também pela primeira troca obrigatória, evitando duas políticas visuais divergentes.
- **Backend e segurança:** o contrato existente de `/auth/change-password` foi preservado. O serviço de conta deixou de usar `any` na fronteira e o cenário PostgreSQL agora comprova a troca voluntária, a rejeição da senha antiga e a continuidade da sessão autenticada.
- **Verificações:** backend com typecheck, 51 testes unitários e 33 cenários de integração aprovados; frontend com lint e build aprovados, mantendo somente o aviso conhecido de chunks acima de 500 kB. Admin e gerente foram conferidos localmente em desktop e 390 × 844, sem rolagem horizontal nem erros no console; o cenário temporário não integra o repositório.
- **Próxima ação:** iniciar a auditoria responsiva e acessível dos fluxos autenticados, registrando achados reproduzíveis antes das correções. WhatsApp, ESP32 e telemetria continuam fora deste pacote.
- **Git:** trabalho local na branch `feat/detalhes-vaga-documentacao-pietro`, base `dcc792c`; Pietro é responsável primário, com Samuel indicado para contrato, Elisa para UX/acessibilidade, Juan para visual e Ana para documentação. Nenhum commit, push, PR ou deploy foi solicitado.

### 25/09/2026 — auditoria transversal de acessibilidade e responsividade

- **Escopo:** primeiro recorte da auditoria dos fluxos autenticados, concentrado no shell compartilhado, navegação entre rotas, menu móvel, preferências de movimento e campos de conta. As fichas administrativas densas e cada estado de mapa/importação continuam no inventário seguinte.
- **Achados corrigidos:** a aplicação deixou de forçar animações quando o sistema solicita movimento reduzido; o painel ganhou atalho visível ao foco para o conteúdo principal; mudanças internas de rota agora focam o novo título sem roubar o foco no carregamento inicial; o e-mail somente leitura voltou a ser focável e copiável; o fallback sem foto passou a ter semântica de imagem.
- **Verificação renderizada:** em `127.0.0.1:5173`, o primeiro `Tab` alcançou “Ir para o conteúdo principal” e a navegação de `/admin` para `/admin/shoppings` focou o `h1` da nova rota. Desktop 1280 × 720 e celular 390 × 844 ficaram sem rolagem horizontal ou erros no console; o menu móvel manteve foco dentro do diálogo, fundo opaco e controles legíveis.
- **Próxima ação:** continuar a matriz por rota nas fichas de shopping, estrutura/mapa, gerentes e importação; registrar e corrigir bloqueios de teclado, foco, contraste, corte e mensagens. O cenário local temporário foi removido e não integra o projeto.
- **Git:** alterações locais preservadas na branch `feat/detalhes-vaga-documentacao-pietro`; nenhum commit, push, PR ou deploy foi solicitado.

### 24/09/2026 — consolidação para a main

- **Pedido e escopo:** documentar e integrar todas as alterações versionáveis pendentes: navegação/tema/exportação do frontend, ajustes de título e feedback, núcleo temporal P06 e documentação de hospedagem Render/Neon. Nenhum `.env`, build, cache ou fixture local integra a entrega.
- **Git e autoria:** `origin/main` permaneceu em `f1172fa` após `fetch`. O commit `08ba46e` contém UX e exportação; `449ed20` acrescenta o recorte P06 e os ajustes locais sobre ele; `dc84a26` contém a documentação de hospedagem. A integração foi preparada na `main` local com os dois registros diários preservados ao resolver o conflito do planejamento. Pietro é o integrador e autor Git efetivo; Juan, Elisa, Ana e Kamilly são responsáveis/revisoras indicados por área, sem atribuição fictícia de coautoria.
- **Verificações de código:** frontend `npm.cmd run lint` e `npm.cmd run build` aprovados; backend `npm.cmd run typecheck` aprovado e `npm.cmd test` com 49 aprovações, zero falhas e três integrações puladas por ausência de `TEST_DATABASE_URL`. O build do frontend ainda avisa sobre chunks acima de 500 kB, inclusive ExcelJS carregado somente ao exportar.
- **Limites e próxima ação:** o teste visual dos painéis foi feito com API local simulada, não no deploy. O P06 só calcula a confirmação em memória; contrato do ESP32, persistência, expiração, histórico e testes de integração em PostgreSQL continuam pendentes. Conferir a URL/saúde pública, o segredo e a execução do hook de deploy nos provedores antes de chamar a implantação de homologada. A comparação com Figma e a abertura do XLSX no Microsoft Excel permanecem pendentes.

### 23/09/2026 — atualização local e reconciliação da hospedagem

- **Pedido:** descartar as alterações não commitadas da auditoria interrompida, atualizar a `main` e documentar a hospedagem com o que o repositório comprova.
- **Entrada e Git:** 18 arquivos rastreados modificados e sete arquivos novos não commitados pertenciam à auditoria local interrompida. Após conferir a lista, as alterações foram removidas por decisão interna. `git pull --ff-only origin main` avançou de `4261b16` para `f1172fa`, sem conflito nem merge novo; `HEAD` e `origin/main` coincidiram e a árvore ficou limpa antes desta revisão. A documentação foi preparada em `docs/hospedagem-render-ana` a partir da `main` atualizada.
- **Commits recebidos:** `ee5b407` integrou mapa/foto; `ebcdaed` consolidou sprints/documentação; `c7773a7` configurou o serviço Render; `42ad219` corrigiu a ficha administrativa e a página 404; `480b01a` registrou o fechamento C01; `f1172fa` acrescentou o workflow de deploy. Esses commits estão na `main` remota, não são alterações pendentes da auditoria descartada.
- **Conferência técnica:** `render.yaml` descreve build e inicialização do único serviço; `app.ts` entrega o build React e `/api/v1` na mesma origem; `server.ts` recebe `FRONTEND_DIST_PATH`; o frontend chama `/api/v1` relativamente. O registro anterior informa PostgreSQL no Neon, com `DATABASE_URL` fora do Git. O workflow solicita deploy por hook, mas seu segredo e execuções não são visíveis no repositório.
- **Documentação:** guia de configuração, TRD, SSD, READMEs e índice reconciliados com a topologia recebida. Descrições do mapa de arquivos revisadas; responsabilidades e caminhos permanecem corretos.
- **Limites:** esta revisão não comprova a URL, a saúde atual do serviço, a conclusão do último deploy, a versão do PostgreSQL remoto, backup nem configuração real do Blob. Nenhuma credencial foi lida ou publicada. Telemetria e demais pacotes seguem seu estado anterior.
- **Verificações:** `node scripts/verificar-documentacao.mjs` aprovou 226 arquivos e os links internos; `git diff --check` não apontou erros. Os comandos de lint, build e testes de aplicação não foram repetidos, pois esta entrega alterou somente documentação. A branch documental permaneceu local nesta revisão.

### 23/09/2026 — retomada do P06 após o fechamento

- **Estado:** aberto; o fechamento anterior de C01 permanece preservado abaixo.
- **Pacote e objetivo:** P06, primeiro recorte: estabelecer o núcleo testável de confirmação temporal de estados de vaga, sem criar contrato HTTP, migration ou processamento de dados reais antes de conhecer o firmware.
- **Entrada:** `origin/main` em `f1172fa`, árvore limpa. A revisão documental de hospedagem permanece preservada no commit local `dc84a26` da branch `docs/hospedagem-render-ana`, ainda separada da `main`. Não havia código de telemetria operacional nem tabela `Sensor` no schema atual.
- **Roteamento:** Kamilly conduz backend/IoT; Samuel revisa dados e Pietro integra o fluxo. A branch local `feat/p06-confirmacao-estado-kamilly` parte de `origin/main`. O Git mantém a identidade de quem realmente executar eventual commit.
- **Dependência de contrato:** frequência das leituras, lacuna máxima, identidade de inicialização e sequência do ESP32 ainda precisam de confirmação interna. Enquanto isso, o cálculo temporal pode exigir esses valores como parâmetros explícitos e ser testado sem rede ou banco.
- **Aceite deste recorte:** CA16–CA17 para alternância, lacuna e leitura isolada. CA18–CA20 exigem deduplicação persistente e identidade de inicialização/ordem do firmware; não declarar CA15–CA24 ou P06 concluídos sem autenticação, persistência, expiração, hardware e integração.
- **Entrega deste recorte:** `src/telemetria/confirmacao-estado.ts` calcula a janela de 30 segundos somente com leituras contínuas, reinicia após alternância ou lacuna e nunca transforma silêncio em vaga livre; `test/confirmacao-estado.test.ts` cobre os casos com tempo determinístico. A lacuna de 15 segundos usada nos testes não define frequência nem configuração de produção. Sem API, migration, escrita no banco ou alteração de estado visível ao gerente.
- **Verificações:** compilação TypeScript aprovada com Node 24.18.0; seis testes novos aprovados; suíte básica do backend com 49 aprovações, zero falhas e três integrações pendentes sem `TEST_DATABASE_URL`. A primeira tentativa da suíte partiu incorretamente da raiz, onde os testes de migration não encontram caminhos relativos; a repetição no diretório `vaggu-backend` passou. Verificador documental cobriu 228 arquivos e validou os links internos; `git diff --check` não apontou erros.
- **Próxima ação:** confirmar internamente o contrato do ESP32 — frequência, lacuna permitida, identificadores de placa/sensor e inicialização/sequência — e só então projetar deduplicação persistente, autenticação, expiração e histórico transacional. Não usar o cálculo isolado como evidência de integração real.

### 23/09/2026 — consolidação das sprints e plano de correção

- **Estado:** D01 concluído; C01 planejado e pronto para implementação.
- **Pacote e objetivo:** corrigir contradições documentais encontradas na auditoria, incorporar o relato das Sprints 1–2 e as fotografias das Sprints 3–4 e ordenar a próxima correção funcional.
- **Situação de entrada:** P01–P05 constavam como concluídos, mas documentos ainda tratavam P05 como parcial, misturavam proposta com implementação e apresentavam ações administrativas históricas como se existissem no frontend atual.
- **Roteamento:** Ana como responsável principal pela documentação; Samuel revisa produto, API e dados; Juan revisa identidade; Elisa revisa jornada; Pietro revisa integração. A branch local `test/p05-integracao-samuel` foi preservada porque já continha trabalho e acompanha `origin/main`; não foi criada nova branch em árvore suja.
- **Entrega:** PRD e TRD consolidados; Sprints 1–4 registradas; paleta e Poppins catalogadas a partir da evidência fornecida; fluxo de telas, modelo de dados, inventário da API, decisões, matriz de rastreabilidade, índices e mapa atualizados. Capturas antigas de exclusão foram marcadas como históricas. O plano coloca C01 antes do P06.
- **Verificações:** `git diff --check` e `node scripts/verificar-documentacao.mjs` aprovados sobre o conjunto integrado. Não houve mudança funcional no frontend ou backend, portanto as suítes de código não foram repetidas nesta etapa documental.
- **Limites:** datas e divisão individual das Sprints 1–2, período da Sprint 4 e personas continuam como informação a ser fornecida. O Figma não foi alterado nem teve novos tokens atribuídos; a evidência de identidade é uma imagem de referência do projeto. PostgreSQL, navegador, Meta, hardware e Power BI não foram executados nesta etapa.
- **Próxima ação:** iniciar C01 revalidando a ficha Admin no navegador e restaurar os fluxos de exclusão de gerente, desfazer por sete segundos e exclusão de shopping conforme os contratos reais.
- **Git:** alterações locais, sem commit, push, PR ou deploy; a modificação preexistente em `vaggu-backend/.env.example` foi preservada.

### 23/09/2026 — correção do formulário administrativo

- **Estado:** C01 iniciado; correção de formulário concluída e persistência da foto diagnosticada.
- **Alterações:** removido o campo de fuso horário da interface e do contrato administrativo atual; o banco mantém a coluna nullable somente para compatibilidade. O seletor de arquivo passou a usar um rótulo controlado, com texto centralizado, nome do arquivo selecionado e foco de teclado visível.
- **Verificações:** frontend lint e build aprovados; backend typecheck e suíte básica aprovados (43 testes, 3 integrações pendentes quando executada sem variável de teste); suíte PostgreSQL oficial aprovada com 32/32 testes usando o banco portátil local.
- **Próxima ação:** manter o PostgreSQL portátil na porta 55432 para os testes e configurar o armazenamento Blob autorizado antes de validar a foto persistida no navegador.

### 23/09/2026 — página 404 animada

- **Estado:** implementação concluída; validação visual e técnica executada na rota curinga.
- **Roteamento:** Juan como responsável visual, Elisa como revisora de UX e acessibilidade; branch atual preservada por conter alterações locais anteriores ainda não publicadas.
- **Entrega:** URLs desconhecidas agora exibem uma página 404 própria. O carro inicia sobre o sensor vermelho e imediatamente faz uma ré em curva curta e leve para baixo e para a direita, aumentando progressivamente tanto o deslocamento lateral quanto o giro; ao terminar de girar, ainda avança um pouco mais para a direita em ré antes de seguir em linha reta para a esquerda. O sensor fica verde após a liberação. A sequência acelerada acontece uma vez por carregamento, sem atraso inicial ou pausa entre suas fases, e reaparece ao reiniciar a página. A vaga permanece centralizada nos eixos horizontal e vertical entre os dois algarismos, o sensor usa luz fosca sem volume esférico e a mensagem recebe espaçamento maior para não competir com a manobra.
- **Acessibilidade e responsividade:** conteúdo textual permanece semântico, links têm foco visível e WhatsApp só aparece quando configurado. Por decisão posterior do projeto, a animação permanece ativa independentemente da preferência de movimento do sistema. Layout adaptado para celular sem depender de asset raster novo.
- **Verificações:** frontend lint e build; inspeção da rota desconhecida em desktop e largura móvel; verificador documental e `git diff --check`.

### 23/09/2026 — C01 e fechamento do dia

- **Estado:** encerrado por decisão interna; C01 concluído sem iniciar o P06.
- **Pacote e objetivo:** corrigir as divergências funcionais confirmadas na ficha administrativa, concluir os ajustes de formulário e erro 404 e deixar a retomada de telemetria preparada.
- **Roteamento:** Pietro como responsável primário pela integração fullstack; Juan responsável pelos ajustes visuais; Elisa indicada para UX/QA; Samuel para contratos e dados. A branch `test/p05-integracao-samuel`, baseada em `origin/main`, foi preservada por já conter o conjunto integrado.
- **Entrega:** a ficha atual voltou a excluir gerente com confirmação e aviso de sete segundos para desfazer, e a excluir shopping com confirmação, encerramento dos acessos e retorno à lista. O formulário deixou de expor fuso horário. URLs desconhecidas exibem a página 404 animada da VAGGU.
- **Verificações:** frontend lint e build aprovados; backend typecheck aprovado; suíte básica com 43 aprovações e três integrações explicitamente pendentes sem variável de teste; integração PostgreSQL oficial com 32/32 cenários, incluindo exclusão/desfazer de gerente e exclusão de shopping; verificador documental e `git diff --check` aprovados. A página 404 foi inspecionada em desktop e largura móvel. A ficha autenticada não recebeu nova captura visual neste fechamento, portanto as evidências antigas permanecem históricas.
- **Decisões e limites:** exclusão de shopping não possui desfazer no contrato atual; exclusão de gerente mantém a janela de sete segundos. O aviso conhecido de bundle acima de 500 kB permanece. Nenhum deploy foi solicitado.
- **Próxima ação:** iniciar P06 consolidando o contrato de firmware e telemetria — autenticação da placa, identificação do sensor, sequência, frequência, confirmação de 30 segundos e expiração — antes de criar endpoints.
- **Git:** entrega funcional publicada na `main` no commit `42ad219a` (`feat: conclui correcoes administrativas e pagina 404`), preservando antes dela o commit remoto `c7773a7e` de configuração do Render. Nenhum deploy manual adicional foi solicitado.

### 21/09/2026 — retomada segura: mapa e acessos

- **Estado:** implementação e validação concluídas; o dia permanece aberto até solicitação explícita de fechamento.
- **Pacote e objetivo:** disponibilizar a visualização 2D compartilhada para Admin e gerente, corrigir a ocultação indevida do mapa do gerente, atualizar a interface após mutações e permitir copiar a senha provisória.
- **Situação de entrada:** `main` limpa e sincronizada com `origin/main` em `4261b16`. O commit mais recente já continha preview e endpoints preliminares de foto, mas persistia `BYTEA`, não enviava a seleção do formulário, não montava a foto nas telas e deixava um erro de lint. O Admin ainda usava somente a tabela de coordenadas; o Gerente recebia a estrutura correta da API, mas o frontend ocultava toda a árvore enquanto a implantação não fosse `ATIVO`.
- **Roteamento:** Pietro como responsável primário pelo escopo fullstack transversal; revisão indicada para Juan (visual), Elisa (jornada/QA) e Samuel (Prisma). Trabalho baseado em `main`/`origin/main` no commit `4261b16`.
- **Primeira ação:** estabilizar os contratos compartilhados do mapa e substituir a persistência binária da foto por uma referência de armazenamento externo, preservando a prévia local e deixando a ausência de configuração explícita.
- **Linha de base:** frontend build e backend typecheck aprovados; a suíte básica teve 43 aprovações e três integrações puladas. A primeira integração PostgreSQL falhou por cliente Prisma local desatualizado; após `db:generate`, aprovou 32/32 cenários. O Figma não retornou o nó `2022:2` por exigir seleção ativa, então os componentes e tokens existentes são a referência verificada desta retomada.
- **Entrega:** `VisualizacaoVagas` centraliza o mapa 2D responsivo de Admin e gerente; o wrapper do gerente não oculta mais a estrutura durante a implantação. A ficha Admin recarrega estrutura após mutações e oferece cópia com feedback para a credencial recém-emitida. O backend deixa de persistir cópia reversível da senha provisória.
- **Causa do bug do gerente:** `MapaEstacionamento` encerrava a renderização para qualquer `situacaoImplantacao` diferente de `ATIVO`, embora a API retornasse corretamente shopping, andares, setores, vagas e posições. A condição foi substituída por aviso não bloqueante acima da visualização compartilhada.
- **Verificações:** backend `typecheck` aprovado; suíte básica com 43 aprovações e três integrações puladas; integração PostgreSQL 32/32; migrations 9/9 aplicadas no banco local. Frontend lint e build aprovados, mantendo apenas o aviso conhecido de chunk acima de 500 kB. Navegador autenticado confirmou mapa no Admin e gerente, troca de andar, categorias/estados, nova vaga refletida sem refresh, clipboard igual à senha exibida, preview de imagem, desktop, tablet e celular; console sem avisos ou erros.
- **Documentação e comentários:** contratos de credencial, imagem, mapa, configuração e responsabilidades dos arquivos foram atualizados. A extração do Figma ficou indisponível por falta de seleção ativa; a validação visual usou os tokens e componentes existentes, sem declarar fidelidade não comparada.
- **Limites:** nenhuma publicação ou deploy foi autorizado. O dia permanece aberto até solicitação explícita de fechamento.
- **Git:** alterações locais na branch de trabalho do dia, sem commit, push, PR ou deploy solicitado.

### 21/09/2026 — retomada do P05: validação integrada

- **Estado:** aberto; pacote P05 concluído nesta retomada. O dia permanece aberto até solicitação explícita de fechamento.
- **Pacote e objetivo:** concluir o P05 validando a importação CSV/XLSX no PostgreSQL descartável e o fluxo administrativo autenticado contra a API real, sem declarar CA13–CA14 antes das evidências.
- **Situação de entrada:** implementação do backend e da interface já integrada à `origin/main`; árvore de trabalho limpa. A máquina possui artefatos locais ignorados de PostgreSQL, mas não há processo escutando nem `.env.teste.local` configurado no início da retomada.
- **Roteamento:** Samuel como responsável primário; revisões indicadas para Pietro, Ana Clara e Elisa. Branch local `test/p05-integracao-samuel`, baseada em `origin/main` no commit `e5cfcc84`.
- **Primeira ação:** conferir o runtime e o PostgreSQL locais sem expor credenciais, preparar uma conexão exclusiva terminada em `_teste` e executar a integração do backend.
- **Correções:** o advisory lock passou a converter o retorno `void` para texto antes da leitura pelo Prisma 7, preservando a serialização por shopping. A importação foi retirada do painel administrativo legado sem rota e montada na ficha Admin real; a área do gerente ficou somente com mapa e Minha conta. Grids e contêineres compartilhados foram restringidos para não ampliar a página em telas menores.
- **Verificações:** `npm.cmd run test:integracao` aprovou 32/32 cenários em PostgreSQL descartável. `npm.cmd test` aprovou 42 testes e manteve três integrações explicitamente puladas por não carregar `.env.teste.local` nesse comando. Frontend `npm.cmd run lint` e `npm.cmd run build` passaram; permanece apenas o aviso conhecido de bundle acima de 500 kB.
- **Navegador real:** Edge headless autenticou o Admin contra API e banco locais, cadastrou shopping, bloqueou confirmação de CSV inválido, confirmou CSV válido e mostrou a estrutura recarregada. Desktop e viewport móvel ficaram sem erro de console; a página móvel não apresentou transbordamento horizontal e as tabelas largas permaneceram em contêiner rolável.
- **Documentação e comentários:** responsabilidades revisadas nos arquivos tocados; o mapa foi atualizado somente onde a ficha Admin ganhou a importação. Índice, próximos passos, situação, backlog e próximo início foram reconciliados para P05 concluído e P06 pronto.
- **Limites:** XLSX foi coberto pelo leitor real e pelas rotas automatizadas, enquanto a jornada visual usou CSV. Meta, hardware, telemetria e Power BI não foram validados. O banco, credenciais, logs, capturas e scripts de verificação usados localmente permanecem ignorados pelo Git.
- **Próxima ação:** iniciar P06 estabilizando o contrato de firmware/telemetria e os testes CA15–CA24 antes da implementação.
- **Git:** alterações locais na branch `test/p05-integracao-samuel`, baseada em `origin/main` (`e5cfcc84`); nenhum commit, push, PR ou deploy solicitado.

### 21/09/2026 — banco local de testes de desenvolvimento

- **Decisão:** a proposta Docker da branch foi cancelada por decisão interna. Todos os arquivos e ajustes do commit `c957f349` foram revertidos sem reescrever o histórico; execução e instalação permanecem pelo fluxo npm/PostgreSQL anterior.
- **Documentação:** o guia canônico agora ensina cada integrante a criar o papel local `vaggu_teste_runner`, o banco de controle `vaggu_teste`, o arquivo ignorado `.env.teste.local` e executar `test:integracao`. Também explica isolamento, limpeza automática e diagnóstico sem expor credenciais.
- **Execução local da API:** o mesmo guia passou a diferenciar explicitamente produção, desenvolvimento e integração e inclui o fluxo Windows para criar `vaggu_local`, configurar o `.env`, aplicar migrations, iniciar a API e verificar os endpoints de saúde e prontidão.
- **Revisão de clareza:** `configuracao.md` foi reorganizado para parceiros novos, com pré-requisitos, primeira instalação, uso diário, resultados esperados, Prisma Studio, testes, encerramento, diagnóstico e distinção explícita entre o ambiente portátil desta máquina e uma instalação comum. O README da raiz agora aponta para esse guia como fonte única, sem duplicar uma configuração incompleta.
- **Evidência de execução:** PostgreSQL 17.11 iniciado em `127.0.0.1:55432`, banco `vaggu_p05_local` acessado, 7 migrations conferidas sem pendências, API iniciada em `127.0.0.1:3000` e endpoints `/health` e `/health/ready` aprovados.
- **Padrão documental:** `regras-de-codigo.md` agora exige instruções ordenadas, resultado verificável, separação entre instalação/uso/testes/produção e texto compreensível sem conversas anteriores ou arquivos ignorados.
- **Revisão do mapa:** as finalidades dos arquivos documentais e do README continuam corretas no mapa do projeto; nenhuma responsabilidade ou caminho estrutural mudou.
- **Segurança:** o banco de teste é local e separado de desenvolvimento/produção; o usuário possui `LOGIN` e `CREATEDB`, sem `SUPERUSER`. Nenhuma senha, banco ou arquivo local foi versionado.
- **Git:** correção preparada na mesma branch da proposta cancelada, com Juan como identidade executora e Pietro como coautor confirmado pela configuração local do projeto.

### 21/09/2026 — auditoria de documentação e estrutura

- **Objetivo:** confirmar que pastas e arquivos versionáveis possuem finalidade clara, reconciliar o estado atual e remover redundâncias sem uso.
- **Decisões:** removidos o painel demonstrativo sem rota e o recurso de animação nunca usado; também saíram tipos antigos e uma regra visual sem uso. A ponte `docs/` foi removida após confirmação interna, pois não possuía consumidor necessário.
- **Documentação:** o mapa passou a explicar as pastas principais e os 212 arquivos versionáveis; descrições genéricas foram corrigidas e o estado do P05 foi alinhado à implementação presente.
- **Verificação:** `node scripts/verificar-documentacao.mjs`, `npm.cmd run lint`, `npm.cmd run build` e `git diff --check` concluídos com código 0. O build mantém o aviso conhecido de chunk JavaScript acima de 500 kB.
- **Git:** trabalho local na branch `docs/auditoria-estrutura-ana`, criada a partir de `origin/main`; sem commit, push ou PR nesta sessão.

### 09/09/2026 — fechamento da revisão e preparação da continuidade

Por decisão interna, as alterações e verificações desta sessão pertencem ao dia de trabalho **09/09/2026**, embora tenham avançado pela madrugada de **10/09/2026** (America/Sao_Paulo). A correção documental foi solicitada via `$start` em 10/09 e constitui o escopo desta retomada; P01 permanece preparado para o próximo início. Os horários originais dos commits permanecem preservados.

- **Estado:** encerrado, referente ao dia de trabalho 09/09/2026; fechamento consolidado por `$end`, sem invocação prévia de `$start` nesta sessão. P01 preparado para o próximo início. Nenhuma etapa operacional adicional foi implementada nesta revisão.
- **Entrega da sessão:** refinamento da landing (Sobre, anéis, etapas e seção da foto), remoção das legendas por decisão interna e criação deste planejamento.
- **Verificação:** resultados e limites na seção 4. As verificações anteriores permanecem válidas para o mesmo código; não foram repetidas sem mudança correspondente.
- **Arquivos da entrega:** componentes `sobre-vaggu` e `operacao-vaggu` (TSX/CSS), `landing-page.tsx`, este planejamento, guia visual e índices README.
- **Ambiente local:** servidor Vite iniciado pela sessão em `http://127.0.0.1:5173/`; não foi encerrado pelo fechamento. Confirmar disponibilidade ao retomar.
- **Pendências preservadas:** R01–R10 e backlog P01–P11. Não há data prometida para uma implantação real.
- **Próxima retomada:** P01, começando pelos caminhos de inicialização e pela verificação de código. Este registro sozinho não inicia o trabalho.
- **Git:** entrega preparada sobre `368a774` na `main`, com commit e push autorizados no registro de fechamento. Este registro integra o commit de fechamento; consultar `git log` e a referência `origin/main` para identificar o hash publicado e conferir sincronização no próximo início. Não houve solicitação de deploy.

### 10/09/2026 — P01: base local verificável

- **Estado:** interrompido — fechamento não realizado; retomado em 11/09/2026.
- **Pacote e objetivo:** P01; corrigir inicialização da API, lint e descoberta dos cenários de autenticação/administração, preparando validação com PostgreSQL de teste isolado.
- **Entrada:** `c127b5e` na `main`, sincronizada com a referência local `origin/main`; preservadas alterações documentais de data no README, guia visual e neste planejamento. O fechamento anterior permanece atribuído a 09/09, conforme solicitado.
- **Ambiente identificado:** Node 26.7.0 fora da faixa do backend; dependências do frontend presentes e do backend ausentes. PostgreSQL e Docker não encontrados no PATH nem como serviços.
- **Entrega:** caminhos de `dev`/`start` corrigidos; import sem uso removido; runner de integração e preparação de banco exclusivo adicionados; helpers de casos tipados e atualização de senha limitada às fixtures; READMEs, exemplo de configuração e guia de ambiente atualizados.
- **Ambiente preparado:** Node 24.18.0/npm 11.16.0 e PostgreSQL 17.11 portáteis em `ambiente.local`, com bancos `vaggu_local` e `vaggu_teste` separados. Credenciais aleatórias salvas somente em arquivos ignorados; nenhum administrador real criado.
- **Processos ao concluir o pacote:** APIs temporárias encerradas e PostgreSQL parado normalmente, com dados preservados. Seguir o guia local para iniciar novamente; o estado diário permanece aberto.
- **Verificações:** seção 4.1; 47 testes aprovados com PostgreSQL real, lint/build do frontend e tipos/schema do backend aprovados. Health/readiness e descarte dos bancos de teste conferidos.
- **Resultado:** P01 concluído; dia permanece **aberto** até `$end`. P02 pronto para o próximo início, sem execução automática nesta entrega.
- **Pendências:** R04 e R06–R10; integração real do frontend, Meta, hardware e Power BI permanecem fora desta entrega. Aviso de bundle preservado.
- **Git:** mudanças locais sobre `c127b5e`, incluindo o ajuste de datas já solicitado. Sem commit, push ou deploy nesta retomada.

### 11/09/2026 — P02: login e autenticação real

- **Estado:** encerrado em 11/09, por solicitação de Pietro.
- **Objetivo:** primeiro corrigir o login conforme o Figma, retirar acessos demonstrativos e integrar/testar autenticação na API.
- **Entrada:** alterações locais da reorganização anterior preservadas; mapa de arquivos ausente. Nenhum resultado antigo comprova as alterações desta sessão.
- **Figma:** o frame 2580:30 foi localizado e visualizado; a consulta detalhada estava limitada pelo plano disponível.

- **Entrega de 11/09:** layout do login ajustado à composição observada no Figma; contas demonstrativas removidas; autenticação, primeira senha, verificação periódica e logout integrados. Número fictício removido após confirmação interna.
- **Verificações atuais:** 47/47 testes backend com PostgreSQL isolado, lint aprovado, build aprovado com aviso de tamanho; 12 cenários E2E aprovados e nenhum erro JavaScript não tratado. Detalhes em [validação](validacao-login-2026-09-11.md).
- **Acabamento visual:** Pietro enviou a foto recortada e o contorno do termo “vagas”; ambos foram aplicados e conferidos em computador e celular. Não houve nova extração de medidas do Figma por limite do plano.
- **Resultado:** P02 concluído. A autenticação real e o acabamento visual foram entregues dentro do escopo; telemetria, operação e Power BI permanecem fora deste pacote.
- **Próxima retomada:** P03, começando pela revisão dos contratos administrativos e do DTO de situação dos gerentes.
- **Documentação e Git:** mapa de arquivos reconstruído e verificado; diário geral e diário VAGGU atualizados. Alterações locais, sem commit, push ou deploy.

### 12/09/2026 — P03: Admin, vários gerentes e minha conta

- **Estado:** concluído; o dia técnico permanece aberto.
- **Pacote e objetivo:** P03; consolidar contratos e persistência PostgreSQL para shoppings, vários gerentes e minha conta, integrar a interface e validar permissões e isolamento.
- **Entrada:** P02 encerrado em 11/09; `c127b5e` permanece como HEAD, com as alterações locais documentadas de P01/P02 preservadas. Nenhum resultado anterior será atribuído às mudanças de P03 sem nova execução.
- **Primeira ação:** revisar o schema Prisma e os contratos atuais de `/shoppings`, gerentes e `/minha-conta`, resolvendo a situação administrativa do gerente antes da interface.
- **Aceite:** CA04, CA06 e CA07; dois gerentes independentes no mesmo shopping, bloqueio individual que invalida sessão, edição apenas de campos permitidos e isolamento por shopping.
- **Entrega:** DTO público passou a informar o estado ativo; bloquear um gerente remove suas sessões na mesma transação. O painel Admin cadastra shoppings, cria vários acessos individuais, lista situação, bloqueia/reativa e redefine senha. A área do gerente edita nome e telefone por `/minha-conta`, mantendo e-mail, perfil e shopping protegidos pelo backend.
- **Verificações:** backend com PostgreSQL real: 47/47 testes aprovados, incluindo CA04, CA06, campos permitidos e recorte de isolamento disponível em CA07. Frontend: lint e build aprovados, com aviso conhecido de chunk acima de 500 kB. Navegador Edge/Playwright: criação de shopping, dois gerentes, bloqueio, troca de senha, Minha conta, desktop 1440×1024 e celular 390×844 aprovados; nenhum erro JavaScript/console. `node scripts/verificar-documentacao.mjs` atualizou o mapa para 113 arquivos.
- **Resultado:** P03 concluído. P04 está pronto para a próxima retomada.
- **Limites:** CA07 ainda precisa ser reaplicado a exportações, downloads e tempo real quando esses canais existirem. Não houve deploy, conta real ou dados de produção. PostgreSQL e Vite temporários foram encerrados; bancos descartáveis do teste foram removidos pelo runner.
- **Git:** alterações locais preservadas, sem commit ou push.

### 12/09/2026 — P04: estrutura, implantação e mapa

- **Estado:** concluído; retomado e entregue após o P03 no mesmo dia. O dia técnico permanece aberto.
- **Pacote e objetivo:** P04; criar hierarquia de andares, setores e vagas, categorias especiais, situação de implantação e posições proporcionais com revisão concorrente do mapa.
- **Entrada:** P03 concluído e validado; PostgreSQL local disponível. Alterações locais anteriores preservadas, sem commit ou publicação.
- **Decisão documentada:** fluxo completo de configuração, sensores e telões em [arquitetura de estrutura, sensores e telões](arquitetura-estrutura-sensores-telao.md). P04 implementa estrutura/mapa; P05 importação; P06 telemetria; P07 operação/telões.
- **Primeira ação:** migration incremental compatível com vagas existentes, usando FKs compostas e índices por shopping/andar/setor.
- **Aceite:** CA08–CA12 e isolamento; nenhuma leitura simulada será apresentada como telemetria real.
- **Entrega:** migration incremental adicionou situação de implantação, andares, setores, categorias e posições proporcionais das vagas, mantendo compatibilidade com vagas legadas. A API permite configurar a estrutura e salvar uma revisão completa do mapa de forma transacional. O frontend Admin cadastra a hierarquia e posiciona vagas; a área do gerente usa somente o shopping autenticado, alterna andares, filtra por tipo, seleciona e busca vagas inclusive em outro andar.
- **Verificações:** migration aplicada ao banco persistente `vaggu_local`; suíte completa do backend com PostgreSQL real: 52/52 testes aprovados. Os cenários de P04 cobrem dois andares, tipos especiais, isolamento, rejeição de vaga de outro andar e conflito de revisão. Frontend: lint e build aprovados, com o aviso conhecido de chunk acima de 500 kB. Navegador/Playwright: criação de estrutura, salvamento de posições, ativação, troca de andar, busca entre andares e celular sem rolagem horizontal aprovados. Mapa de documentação: 122 arquivos cobertos; `git diff --check` sem erro.
- **Resultado:** P04 concluído. P05 está pronto para a próxima retomada.
- **Limites:** ainda não há importação CSV/XLSX, ingestão de sensores, atualização em tempo real ou telão. O mapa atual usa uma base neutra e posições proporcionais; uma planta ilustrada poderá ser associada depois. Nenhum dado exibido foi apresentado como leitura real de sensor.
- **Ambiente:** PostgreSQL local permanece iniciado para nosso uso; o Vite temporário de validação foi encerrado. O dia continua aberto até pedido de fechamento.
- **Git:** P01–P04 e a reorganização documental publicados na `main` no commit `dc316b2`. Nenhum deploy foi solicitado.

### 12–13/09/2026 — melhorias de interação, gerentes e senha

- **Estado:** encerrado por solicitação de Pietro; a implementação começou em 12/09 e o fechamento terminou após a virada para 13/09, no fuso America/Sao_Paulo.
- **Objetivo:** acrescentar resposta de clique aos cards, animar o rabisco em torno de “vagas”, permitir excluir um gerente com confirmação e sete segundos para desfazer e reforçar a criação da senha definitiva.
- **Decisão:** exclusão lógica preserva o ID e o estado anterior, encerra sessões imediatamente e oculta o acesso. O desfazer restaura o mesmo registro dentro da janela; depois dela, o e-mail pode ser cadastrado novamente sem duplicar a identidade.
- **Entrega presente no código:** migration incremental; rotas `DELETE /gerentes/:id` e `POST /gerentes/:id/desfazer-exclusao`; modal acessível; aviso Sonner com ação; microinterações de cards e rabisco SVG com movimento reduzido. A troca de senha agora exige 12–128 caracteres, minúscula, maiúscula, número, símbolo e ausência de espaços; possui olhos independentes, checklist vivo, confirmação e erros associados aos campos. A API é a autoridade e usa códigos distintos para cada requisito.
- **Verificações:** suíte completa 54/54 e integração PostgreSQL 29/29; os cenários cobrem sete falhas da política, repetição, senha atual incorreta e sucesso. Lint e build aprovados, com o aviso conhecido do bundle. Navegador aprovou rabisco, pressão do card, confirmação, encerramento do acesso, aviso e restauração do mesmo gerente; na troca de senha, aprovou os três olhos, checklist, confirmação, erros por campo, desktop 1440×1024 e viewport móvel, sem erros de console. A submissão válida pela interface não foi repetida porque a política de controle do navegador exige intervenção manual nesse passo; o mesmo contrato foi comprovado pela integração HTTP. Migration aplicada ao banco persistente `vaggu_local`; conta temporária e servidores de QA removidos. Mapa documental: 123 arquivos cobertos; `git diff --check` aprovado.
- **Evidências visuais:** três capturas guardadas em `Minha segunda mente/Vaggu/Evidências visuais/Melhorias - interações e gerentes`.
- **Resultado:** melhorias concluídas e dia encerrado; P05 continua sendo a próxima entrega planejada, sem início automático.
- **Próxima ação:** criar o contrato intermediário da importação e a prévia CSV sem escrita no banco, preparando a leitura XLSX sobre a mesma estrutura.
- **Git:** entrega funcional publicada na `main` em `c05d7e7` (`feat: reforca acessos e interacoes administrativas`); documentação final de fechamento publicada em seguida, com `main` e `origin/main` conferidas. Nenhum deploy foi solicitado.

### 13/09/2026 — exclusão de shopping, senha provisória e fechamento

- **Estado:** encerrado por solicitação de Pietro; não houve `start` específico para esta retomada.
- **Objetivo:** permitir ao Admin excluir um shopping, consultar a senha provisória do gerente até a primeira troca e remover o controle manual de pausa da animação da seção Sobre.
- **Decisões:** shopping usa exclusão lógica para preservar estrutura e histórico; a operação desativa seus gerentes, revoga sessões e apaga cópias provisórias. A senha provisória tem cópia cifrada disponível somente ao Admin enquanto a troca obrigatória estiver pendente; a senha definitiva permanece somente como hash. Os anéis da landing animam automaticamente quando visíveis, sem controle manual; a decisão mais recente mantém animações ativas independentemente da preferência de movimento do sistema.
- **Entrega:** migration `20260913000100_senha_provisoria_e_exclusao_shopping`; rota `DELETE /shoppings/:shoppingId`; estados visuais de senha provisória, redefinida ou antiga indisponível; confirmação de exclusão; chave `CREDENTIAL_ENCRYPTION_KEY` documentada; botão de pausa e estilos associados removidos.
- **Verificações:** migration aplicada ao PostgreSQL local; integração 30/30; suíte básica 26 aprovações e uma integração explicitamente pulada; lint e build do frontend aprovados, com aviso conhecido de chunk acima de 500 kB; landing e login carregaram sem overlay ou erros de console; ausência do controle de pausa confirmada no DOM; documentação e `git diff --check` aprovados, com 125 arquivos cobertos.
- **Limites:** contas provisórias criadas antes da migration não possuem cópia recuperável e precisam de redefinição administrativa. Importação, telemetria, telões e Power BI continuam pendentes. Nenhum deploy foi realizado.
- **Próxima ação:** P05, começando pelo contrato intermediário da importação e pela prévia CSV sem escrita no banco, preparando XLSX sobre a mesma estrutura. Validar com testes de parser, integração do endpoint, lint, build e fluxo de prévia no navegador.
- **Ambiente:** API, frontend e PostgreSQL locais encerrados ao concluir o dia.
- **Git:** entrega funcional publicada na `main` no commit `8cf06f0` (`feat: amplia controle administrativo de acessos`); este fechamento documental foi preparado em seguida. Nenhum deploy foi realizado.

### 14/09/2026 — segunda mente canônica e animações

- **Objetivo:** compartilhar o cofre pelo repositório, eliminar fontes documentais concorrentes e reativar as animações no ambiente atual.
- **Decisão histórica, substituída em 28/09:** `segunda-mente/Vaggu/Vaggu.md` tornou-se o índice principal. Naquele momento, as animações eram mantidas mesmo com a preferência por menos movimento; a versão atual passou a respeitar essa escolha do usuário.
- **Preservação:** 73 arquivos e 20.877.712 bytes foram copiados; `.obsidian/workspace.json` ficou de fora por ser estado local. Quatro deltas mais recentes de `docs` foram incorporados antes da remoção das cópias.
- **Verificações:** lint e build aprovados; mapa com 195 arquivos cobertos; localhost respondeu 200. No Edge, mesmo com `prefers-reduced-motion: reduce`, as três órbitas permaneceram em execução e mudaram de transformação entre duas medições; as conexões das etapas e do painel passaram de `100%` para `0%` ao entrar na tela. Nenhum controle de pausa ou animação foi encontrado no DOM.

### 15/09/2026 — revisão integral da segunda mente

- **Estado:** revisão documental concluída; não houve invocação de `$start` nem início de novo pacote de produto.
- **Objetivo:** conferir estrutura, navegação, fatos atuais, histórico, alinhamento com o código e utilidade do cofre compartilhado.
- **Entrega:** índices e resumos atualizados para o P05 parcial; decisões intermediárias sobre animações marcadas como substituídas; regra da senha provisória reconciliada; links corrompidos reparados; links de pastas substituídos por evidências reais; nota inicial transformada em guia; canvas vazio removido; verificador ampliado para links Obsidian e Markdown locais.
- **Verificações:** mapa com 206 arquivos e links internos válidos em Node 24.18.0; `git diff --check` aprovado; frontend lint/build aprovados com aviso conhecido de chunk; backend básico 38 aprovados e 2 integrações puladas; integração PostgreSQL 31/31 após sincronizar dependências e gerar o cliente Prisma.
- **Limites:** nenhuma nova validação visual, Figma, Meta, hardware ou Power BI. Registros antigos permanecem históricos; os resumos atuais são a referência de estado.
- **Próxima ação:** concluir P05 pela confirmação atômica e idempotente da prévia, preservando IDs e histórico, antes de criar a interface administrativa.
- **Git:** trabalho preparado em `docs/revisao-segunda-mente-ana`, baseada em `99125ef`; nenhuma publicação remota foi solicitada nesta revisão.
- **Limites:** o bundle principal ainda gera o aviso conhecido de tamanho acima de 500 kB. As mudanças estão locais e ainda não foram publicadas no remoto.

### 15/09/2026 — P05: confirmação backend da importação

- **Estado:** implementação backend em andamento na branch local `feat-p05-confirmacao-importacao-samuel`; responsável primário Samuel.
- **Entrega:** migration `20260915000100_confirmacao_importacao`; rota `POST /shoppings/:shoppingId/importacoes/:importacaoId/confirmar`; serviço idempotente que cria andares/setores ausentes, cria ou atualiza vagas pelo código do shopping, preserva IDs e histórico e não remove vagas ausentes da planilha. Um advisory lock transacional serializa confirmações estruturais por shopping e permite que uma repetição simultânea releia o resultado já confirmado.
- **Verificações:** cliente Prisma gerado com `DATABASE_URL` fictícia válida; `npm.cmd run typecheck` aprovado; `npm.cmd test` aprovado com 41 testes, 0 falhas e 3 skips explícitos por falta de `TEST_DATABASE_URL`; `git diff --check` aprovado. A suíte cobre parser, rota de confirmação, autorização e contrato SQL da migration, e o cenário de integração agora dispara duas confirmações concorrentes. O PostgreSQL 17 documentado em outra máquina não está instalado neste computador; o cenário real ficou pendente porque também não há `TEST_DATABASE_URL` nem `.env.teste.local` nesta retomada.
- **Limites:** ainda não há interface administrativa para importar/confirmar; a migration não foi aplicada ao banco local nesta sessão; telemetria, telões, histórico analítico e Power BI continuam fora deste pacote.
- **Próxima ação:** configurar `TEST_DATABASE_URL`, executar `npm.cmd run test:integracao`, aplicar `db:deploy` no banco local correto e validar a interface administrativa contra a API real.

### 15/09/2026 — P05: interface administrativa da importação — encerrado

- **Estado:** dia encerrado na branch local `feat-p05-confirmacao-importacao-samuel`; não houve invocação de `start`, então o fechamento foi reconstruído pelos commits, diff e verificações desta sessão. Integração multidisciplinar com Samuel responsável por dados/produto e revisão indicada para Pietro, Ana Clara e Elisa.
- **Entrega:** transporte autenticado de CSV/XLSX sem JSON; validação dos DTOs da API; seleção de arquivo com limites visíveis por formato; modelo CSV baixável com BOM UTF-8 e exemplos dos quatro tipos; resumo da prévia; tabelas de registros e erros; confirmação em modal; resumo do resultado e recarga da estrutura após aplicação. O cabeçalho autenticado também foi corrigido para não cortar o título no celular.
- **Verificações:** `npm.cmd run lint` e `npm.cmd run build` aprovados. O build mantém o aviso conhecido de bundle acima de 500 kB. Como o navegador integrado não estava disponível, o fallback Playwright validou com API simulada: login Admin, download `modelo-importacao-vaggu.csv` com conteúdo/BOM conferidos, upload CSV, prévias válida e inválida, erros por linha, bloqueio da confirmação inválida, modal, confirmação, resumo final, console com 0 erros/avisos e viewport de 360 px sem overflow horizontal. O `git fetch origin --prune` confirmou `origin/main` sem commits novos; a branch estava um commit à frente antes desta entrega. O `git pull` foi recusado pela camada de segurança por poder alterar o histórico, sem impacto porque não havia atualização remota a integrar.
- **Limites:** upload e confirmação reais ainda não foram executados no navegador porque este computador não possui PostgreSQL nem `TEST_DATABASE_URL`. A interface não conclui CA13–CA14 isoladamente.
- **Git:** entrega preparada para commit local com autoria individual de Samuel; nenhum push, PR, merge ou deploy autorizado neste fechamento.
- **Próxima ação:** seguir a seção “Próximo início”: validar migration e confirmação no PostgreSQL descartável, depois repetir no navegador com API real as prévias válida/inválida, a confirmação e a recarga da estrutura.
### 14/09/2026 — navegação e ficha administrativa de shoppings (Juan)

- **Objetivo:** iniciar o Admin pelo cadastro completo, separar a listagem de shoppings e reunir edição cadastral, vagas, estrutura e gerentes na ficha selecionada; evitar preenchimento automático do login e reaproveitar a senha provisória na troca obrigatória.
- **Entrega:** migration incremental compatível adiciona dados institucionais, endereço estruturado, horários e fuso. A API ganhou `GET/PATCH /shoppings/:id`. O frontend usa as rotas `/admin`, `/admin/shoppings` e `/admin/shoppings/:id`, com navegação responsiva, criação e edição de gerentes e resumo dos estados persistidos das vagas.
- **Segurança e dados:** a senha provisória digitada fica somente na memória da aba e é apagada ao trocar a senha, sair ou limpar a sessão. O login inicia vazio e não solicita autopreenchimento. Análises históricas continuam indisponíveis até existirem eventos reais; a ficha não exibe gráficos ou números inventados.
- **Verificações:** migration aplicada ao `vaggu_local`; integração PostgreSQL isolada 31/31; suíte básica do backend com 39 aprovações e duas integrações puladas quando executada sem `TEST_DATABASE_URL`; build backend, lint e build frontend aprovados. Capturas em 1440×1024 e 390×844 conferiram cadastro, lista e ficha completa; o fluxo real levou o gerente a `/trocar-senha` com a senha provisória já preenchida.
- **Limites:** documentos privados, telemetria e histórico analítico não foram implementados nesta entrega. O aviso conhecido de bundle acima de 500 kB permanece. Mudanças locais na branch `feat/admin-shoppings-juan`, sem commit, push ou deploy.

### 30/09/2026 — gráficos interativos e resumo analítico Admin

- **Entrega local:** os gráficos do gerente ganharam animação de entrada, detalhes em hover/foco e navegação por teclado. As superfícies, textos, grades e contrastes agora possuem estilos próprios nos temas claro e escuro, mantendo o amarelo VAGGU como destaque.
- **Admin:** a ficha do shopping passa a consultar o histórico pelo identificador autorizado e apresenta ocupação, cobertura e tendência em um cartão compacto. Na ausência de histórico, a série permanece explicitamente marcada como demonstração e não é persistida.
- **Acessibilidade:** animações respeitam `prefers-reduced-motion`; pontos e barras possuem nomes acessíveis, foco visível e tooltip.
- **Limite:** a interface não substitui a atualização do Power BI nem transforma dados sintéticos em telemetria real.
- **Ajuste de Minha conta:** dados pessoais usam duas colunas em telas maiores e a troca de senha deixou de ocupar um cartão vertical permanente; agora é aberta por botão em um diálogo acessível e continua linear no celular.

### 23/09/2026 — banco Neon e hospedagem pública

- **Responsável:** Samuel Santos (`mukinha01`).
- **Banco:** estrutura e dados existentes migrados para o PostgreSQL gratuito do Neon; a API usa a conexão somente por variável secreta do Render.
- **Hospedagem:** o serviço `vaggu-tcc` publica API e frontend na mesma origem, aplica migrations na inicialização e verifica o banco em `/api/v1/health/ready`.
- **Git:** o trabalho local da Sprint 4 foi preservado em `feat/p05-importacao-samuel`; depois, a `main` foi atualizada por avanço rápido e recebeu somente a adaptação de hospedagem compatível com a versão mais nova do sistema.
- **Verificações finais:** backend com 43 testes aprovados e três integrações puladas sem `TEST_DATABASE_URL`; frontend com lint e build aprovados; documentação com 223 arquivos cobertos e links internos válidos.
- **Limite do plano:** o serviço gratuito pode suspender por inatividade e demorar na primeira abertura seguinte; os dados permanecem persistidos no Neon.
- **Automação validada:** `.github/workflows/publicar-render.yml` solicita um deploy a cada push na `main`. Pietro cadastrou o segredo `RENDER_DEPLOY_HOOK_URL`; o disparo de teste foi aceito pelo GitHub Actions e o Render publicou o commit correspondente em estado `live`.
- **Automação preparada:** `.github/workflows/publicar-render.yml` solicita um deploy a cada push na `main`. Falta o administrador Pietro cadastrar no GitHub o segredo `RENDER_DEPLOY_HOOK_URL`; Samuel tem escrita, mas a API confirmou que não possui permissão administrativa para criar segredos ou webhooks neste repositório.

### Contraste da verificação de acesso — 15/10

Corrigidos carregamento e erro de sessão para usar fundo e texto do tema; botão amarelo mantém texto escuro e foco visível. Conferidos em Edge/Playwright local, com resposta 503 controlada para `/auth/me`, nos temas claro/escuro e larguras 1440, 768 e 390 px. Botão acionado por teclado realizou nova consulta; sem transbordamento ou erros JavaScript. Build e lint aprovados (aviso de bundle já conhecido). Plugin Browser ausente, utilizado Playwright. Capturas locais fora do repositório. Produção não validada nesta correção. Lacunas documentais adiadas por decisão interna, preservadas na auditoria documental.


### Calendário das sprints — 16/10

Registramos a Sprint 5 como em andamento e a transição para a Sprint 6 na quarta-feira, 21/10/2026. Calculados os ciclos semanais: Sprint 5 em 14–21/10 e Sprint 6 em 21–28/10, com retrocálculo até a Sprint 1 no [registro das sprints](../Planejamento/Sprints%20do%20projeto.md). Preservada a divergência da data histórica da Sprint 3, sem remapear entregas por suposição. Divisão de tarefas e conciliação das fontes permanecem pendentes. Conferência: intervalos de sete dias e marcos às quartas-feiras.


### Complementação documental — 16/10

Descritos no mapa sete assets otimizados e o script Pillow, com uso real ou condição de variante preservada. Consolidados o perfil original de Carlos e os perfis propostos Mariana/Rafael, com hipóteses e limites explícitos, no documento de personas e no PRD. Atualizado o índice principal. Nenhuma funcionalidade ou permissão foi alterada. Validação: verificador documental e revisão do diff; as decisões e fontes que exigem definição interna continuam abertas.


### Aprovação visual — 16/10

Aprovamos o site atual como evolução da proposta do Figma. Encerrada a pendência documental de aprovação visual e reprodução das medidas do protótipo. Atualizados identidade visual, regras permanentes e auditoria. Permanecem as verificações técnicas e demais decisões operacionais; nenhuma alteração na interface foi realizada. Conferência documental executada após a atualização.


### Formato da apresentação — 17/10

Registrada nossa decisão: slides próprios, WhatsApp funcionando em interação real e telões em demonstração breve por interação ou fotos. Chip e celular disponíveis segundo relato. Power BI aguarda confirmação do formato, e data/duração serão informadas. Atualizados cenário de apresentação, guia WhatsApp e auditoria; nenhuma integração foi configurada nesta atualização documental.


### Power BI na apresentação — esclarecimento de 17/10

Definimos que uma imagem dos modelos de gráficos nos slides é suficiente. Atualizado o cenário de apresentação, sem exigir demonstração ao vivo do Power BI nesse roteiro. Esta decisão não encerra P09 nem comprova integração funcional. Verificação documental executada após a atualização.


### Apresentação: site e maquete — 17/10

Definimos a navegação breve com site aberto, sensores na maquete e um deles acondicionado em caixa/carcaça de proteção a construir. Previsão: início de dezembro de 2026, duração habitual de 20–25 minutos; dia e limite final pendentes. Atualizados cenário e auditoria, sem assumir integração física concluída ou ligação dos sensores ao Shopping Exemplo. Verificação documental executada após a atualização.


### Retomada das definições dos sensores — 17/10

Kamilly é a responsável pelas informações dos sensores; os detalhes serão documentados posteriormente. Pendências técnicas mantidas abertas, com responsável registrado no cenário de apresentação e na auditoria. Nenhuma definição de hardware ou tempo foi presumida. Verificação documental executada após a atualização.


### Recálculo do calendário de sprints — 17/10

A fotografia do planejamento confirma Sprint 3 em 09–16/09. Recalculada a sequência semanal: Sprint 5 em 23–30/09; 21/10 inicia a Sprint 9. Isso diverge do relato de Sprint 5 terminando em 21/10. Registrar pausas, durações diferentes ou renumeração antes de fechar o calendário. Ver tabela e limites no registro das sprints. Validação documental executada após a atualização.


### Confirmação do calendário — pendente de confirmação interna

Em 17/10, registramos a necessidade de confirmar se houve pausas, sprints com outras durações ou alteração na numeração. Manter os cálculos como condicionais até a confirmação interna.


### Prévia funcional dos telões — 17/10

Implementadas telas autenticadas de disponibilidade por andar e setor para o gerente, com estados parciais/sem leitura, atualização a cada 30 segundos e aviso nos dados do shopping de demonstração. Ela usa o endpoint atual protegido e não altera o sistema de sensores. Instalação pública de telão, autorização própria, configuração do recorte e atualização por evento seguem pendentes. A prévia cobre a demonstração visual enquanto definimos o dispositivo físico; P07 não está concluído. Ver [fluxo de telas](fluxo-de-telas.md) e [arquitetura](arquitetura-estrutura-sensores-telao.md).

### Telões para motoristas — 17/10

Definimos que o telão é somente para exibição aos clientes que entram de carro. Removidos botões, links, navegação por andar e controle de tela cheia da superfície exibida. A atualização permanece automática. Cada endereço define entrada ou andar; a abertura e o modo kiosk ficam sob responsabilidade da operação do dispositivo.

### Visual do telão — 17/10/2026

Redesenhado o telão conforme referência visual do projeto: logo oficial, Poppins, preto e amarelo #ffe100 do site; total destacado, andares/setores centrais e faixa de categorias. Sem interação. Faixas provisórias de disponibilidade: até 20% de vagas livres, poucas vagas; até 50%, vagas disponíveis; acima, maior disponibilidade. Dados parciais usam estado neutro, sem recomendação. Build e validador documental aprovados; conferida renderização no navegador local em largura estreita.

### Análises — cobertura por setor e centro da rosca — 17/10/2026

O componente `analise-estacionamento.tsx` exibe cobertura histórica por setor à direita de Tipo de vaga, a partir de `porSetor.coberturaPercentual` da API, respeitando o período consultado (SSD §10.2). Sem histórico, mantém aviso de ausência de dados; Shopping Exemplo identifica histórico demonstrativo. Barras de 0–100% representam tempo conhecido, não disponibilidade de vagas. O CSS limita o texto central da rosca ao diâmetro interno e divide “ocupadas agora” em duas linhas. Build aprovado e composição conferida no navegador local a 1440 px.

### Consolidação com prints — 17/10/2026

Filtro de datas redistribuído após revisão interna, preservando campos e ações. Telão ajustado para caber em Full HD e 1366×768. Mudanças desta etapa e evidências atuais reunidas no [registro da entrega](entrega-teloes-analises-2026-10-17.md), com dependências e limites explícitos. Arquivos de ambiente/credenciais não entram no commit.


## Correção histórica das sprints — 19/10/2026

As quatro fotografias recebidas em 19/10 substituem a hipótese de calendário semanal usada nos registros anteriores: Sprint 3 em 09–16/09, Sprint 4 em 23–30/09, Sprint 5 em 05–19/10 e Sprint 6 em 19–28/10/2026. Nossa memória situa a Sprint 1 no começo de agosto (brainstorming) e a Sprint 2 na criação da ideia no Figma até a Sprint 3; não há fotografias nem datas exatas dessas duas etapas. Os registros anteriores permanecem como histórico da informação disponível, mas o retrocálculo e a transição antes citada em 21/10 deixaram de ser referência vigente. Datas variáveis, atribuições e fontes estão em [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md). Planejamento não comprova conclusão técnica e não altera a numeração P01–P11.

## Personas, slides e voz documental — 21/10/2026

Revisamos Mariana e Rafael contra as funcionalidades atuais: Mariana recebe a sinalização agregada do telão web; Rafael consulta monitoramento e encaminha falhas ao Admin VAGGU, que mantém os controles de equipamentos e manutenção. Preservamos Carlos e corrigimos a jornada de Rafael, o alcance dos agregados de categorias e a indicação de implantação física pendente. A revisão confirma coerência com o produto; entrevistas e testes com representantes dos públicos permanecem pendentes. Ver [Personas](../Especificações/Personas.md).

Refizemos os quatro slides em 1920×1080 para acompanhar a referência original de Carlos: Poppins, idade leve em amarelo, títulos e destaques no padrão original, retratos recortados e fundos com textura, retícula e estrelas. Conferimos os quatro slides visualmente e reunimos os seis na [visão geral](../Evidências%20visuais/Personas/personas-visao-geral.png). Assets, prompts e reprodução estão no [registro dos slides](../Evidências%20visuais/Personas/README.md).

Revisamos a documentação e os READMEs para usar voz interna ou neutra, substituindo relatos externos por referências aos nossos materiais e decisões. Mantivemos datas, atribuições, histórico e limites das evidências. A busca final não encontrou os padrões de narrador externo pesquisados; o verificador documental passou com 330 arquivos cobertos e 52 documentos com links/âncoras válidos. `git diff --check` passou.

Roteamento de responsabilidade: Ana para documentação, com revisão indicada de Elisa para UX e Juan para visual. Preservamos as alterações locais na branch `feat/landing-fotos-favicon-juan`, em `16383524`; não criamos branch, commit, push ou PR nesta revisão. A branch não possui referência homônima no `origin` localmente disponível; nenhum integrante recebeu autoria Git ou aprovação atribuída por esta revisão.


### 21/10 — ajustes após uso local dos telões

Ampliamos e centralizamos contagens por andar/setor, acrescentamos exclusão definitiva de telões ativos ou revogados com confirmação e corrigimos salvar conta sem mudanças. Conferência no navegador com PostgreSQL local, 14 prints, builds e lint aprovados; três testes focados passaram e um de banco descartável foi ignorado. Registro e limites em [Telão para apresentação](telao-apresentacao-2026-10-21.md). Mantivemos a branch local `codex/feat/telao-apresentacao-elisa`, base `1b7ae6fb`, identidade Elisa, sem commit/push. API 5185 e frontend 5173 permanecem disponíveis para teste.

## Piloto hospedado em 21/10/2026

Admin autenticado autorizou uso do Shopping Exemplo. Criado setor `Piloto físico ESP32` no Piso G1, com vagas P01/P02/P03. A importação corrigiu o setor das três vagas e preservou as 80 anteriores. Placa `VAGGU_ESP32_PILOTO_01` cadastrada com chave individual, guardada somente em config.h ignorado; sensores S01/S02/S03 vinculados respectivamente a P01/P02/P03. Este shopping continua classificado como demonstração; não usar seus indicadores agregados como validação de operação real.

Firmware HTTPS compilado e gravado na ESP32 em COM3, com validação de certificado e NTP obrigatório. A placa conecta ao hotspot, mas o relógio ainda não sincronizou: envio hospedado não validado. Não há contorno de TLS. Computador tem internet via rede local e Cloudflare WARP; compartilhamento do hotspot aguarda conferência pelo usuário.

Verificação local após integrar origin/main: builds backend/frontend e lint aprovados; 19 testes de configuração, confirmação e contrato/rotas aprovados; 2 testes PostgreSQL descartáveis de telemetria e isolamento do piloto aprovados. Revisão visual responsiva do polling após integração ainda pendente. Nenhum push ou deploy foi executado.

## Recuperação visual das análises — 23/10/2026

Identificada a mudança de composição no commit `1b7ae6f`, comparado a `5d6e3e0`: remoção das roscas e barras, maior destaque à tabela e apresentação de permanência apenas em minutos. Recuperamos a hierarquia gráfica sem reintroduzir estimativas sintéticas ou alterar o contrato da API: linha com preenchimento e lacunas, roscas da situação atual/categorias, barras diárias de entradas/saídas e cobertura por setor. Tabela histórica recolhida em controle nativo de detalhes; permanência em horas/minutos e percentuais principais sem decimais. Exportações mantêm precisão e unidade originais. Responsabilidade visual/frontend permanece conforme os acordos do projeto; skill de roteamento não encontrada no repositório ou nas skills locais pesquisadas, sem atribuição de autoria ou aprovação a integrantes.

Fluxo verificado: `/painel/analise` → consulta → seleção de ponto por teclado, abertura da tabela, aplicação de setor/categoria, ausência de observação e erro. Edge headless/Playwright, frontend em `127.0.0.1:5173`, dados inteiramente fictícios interceptados no navegador. Desktop 1440×1000, tablet 768×1024 e celular 390×844 em ambos os temas: sem overflow da página, cortes relevantes, tela vazia ou sobreposição de erro do framework; dez prints atuais no índice. Console sem erros inesperados; duas respostas 503 intencionais no cenário de falha. Não verifica banco, isolamento do servidor, produção, hardware ou downloads nesta rodada. Evidências históricas preservadas e referência de análise no README atualizada.

Comandos: `git status --short`, `git branch --show-current`, `git log`, `git show`, `npm run dev -- --host 127.0.0.1`, `npm run build` e `npm run lint` no frontend; script temporário de Playwright em `%TEMP%/vaggu-analises-qa.cjs`; nove verificações da função de duração com TypeScript/Node (ausência, zero, subminuto, arredondamento e horas); `node scripts/verificar-documentacao.mjs` e `git diff --check`. Build/lint aprovados; aviso conhecido de bundle acima de 500 kB. Uma tentativa de build na raiz falhou por ausência de package.json e foi corrigida para o diretório do frontend. Ajustados dois seletores/expectativas do roteiro de QA antes da execução aprovada. O verificador apontou um arquivo de hardware já existente sem descrição; incluída somente sua linha no mapa, sem editar firmware. Nenhum commit, push ou deploy executado.

### Categorias e carregamento das análises — complemento de 23/10/2026

Recolocadas no topo as contagens de vagas convencionais, PCD, idosos e elétricas, vinculadas ao recorte aplicado e à estrutura ativa. As contagens representam cadastro, não disponibilidade; desconhecida continua separada de livre. Mantidos os gráficos de categoria, situação atual e histórico. Campos receberam rótulos associados explicitamente; setores/andares inativos não entram no seletor.

Reproduzidos no navegador dois problemas anteriores: comparação lenta bloqueava todos os gráficos, e reaplicar filtros desmontava o conteúdo. Corrigidos com carga independente da comparação e preservação da última consulta válida enquanto atualiza ou após erro, com aviso próprio. A primeira carga tem placeholders na posição das categorias e dos gráficos; não informa mais “sem observação” antes da resposta. Botões Atualizar análise e Tentar novamente repetem o recorte aplicado; erros de exportação são limpos na próxima consulta. Respostas de consultas antigas são ignoradas. Exportações aguardam o término da comparação e seus módulos são importados somente no clique. Séries acima de dez dias ganham largura interna para evitar sobreposição dos alvos de toque.

Verificação complementar: roteiro temporário `%TEMP%/vaggu-analises-carregamento-antes.cjs` reproduziu ambos os problemas antes da edição. `%TEMP%/vaggu-analises-carregamento-qa.cjs` exercita entrada, comparação lenta, refresh, filtros, resposta fora de ordem, falha inicial, falha da comparação, falha ao atualizar, recuperação, ausência de observação, 31 dias e exportações. Dados fictícios interceptados no navegador, sem banco ou servidor de API reais. Prints atuais (16) no índice, desktop/tablet/celular em claro/escuro; página sem overflow, teclado funcional, sem overlay do framework ou erros JavaScript inesperados. Os erros HTTP 503 do roteiro são intencionais. Excel e PDF verificados por download; planilha aberta com ExcelJS e conferidas abas de tipos e histórico. A referência de análise no README aponta para a captura mais recente. Histórico anterior preservado.

Comandos finais: `npm run build` e `npm run lint` em `vaggu-frontend`, roteiros Node/Playwright acima, `node scripts/verificar-documentacao.mjs` e `git diff --check`. Build mantém aviso conhecido de chunks grandes. Corrigidos fechamentos JSX encontrados durante a edição; a tentativa de build na raiz sem package.json foi substituída pela execução no frontend. Nenhuma dependência, API, banco, autoria Git, publicação ou hardware foi alterado. A skill de roteamento permanece indisponível conforme busca já registrada; nenhuma aprovação foi atribuída. Validação do ambiente publicado e das latências reais permanece pendente.


## Fechamento e entrega — 24/10/2026

Consolidados o resultado das duas etapas de análise, as 26 capturas e os limites reais no [fechamento do dia](../Diário/2026-10-24.md). Atualizados índice principal e próximos passos. Código permanece na versão validada com build/lint e roteiro de navegador; nesta rodada documental foram conferidos branch, status, diffs e remoto com `git fetch origin`, além do verificador documental e `git diff --check`. Commit e push autorizados para `origin/codex/piloto-esp32-https`, preservando a identidade Git configurada. Não inclui merge na main ou publicação; a confirmação remota e o hash ficam na entrega.


## Integração na main — 24/10/2026

Merge autorizado de `codex/piloto-esp32-https` sobre a main atualizada (`688ce2a`), preservando telões/tema remotos e piloto/análises. Conflitos em mapa, planejamento e índice resolvidos mantendo ambas as documentações. Frontend build/lint aprovados; backend: 95 testes aprovados, 12 ignorados sem banco configurado, zero falhas. Roteiro Playwright da integração aprovado com 16 prints locais novos e exportações verificadas. Comandos: `git fetch origin`, `git checkout main`, `git merge --ff-only origin/main`, `git merge --no-ff --no-commit codex/piloto-esp32-https`, `npm test` no backend, `npm run build`/`npm run lint` no frontend, `node %TEMP%/vaggu-merge-main-qa.cjs`, verificador documental e diff check. Detalhes e limites no [diário de fechamento](../Diário/2026-10-24.md). Push para main autorizado; workflow do Render pode solicitar publicação, cuja conclusão não foi homologada nesta etapa.


## Experimento de animações das análises — 25/10/2026

Na branch local `codex/animacoes-analises`, implementadas contagens crescentes, linha por recorte SVG, barras por escala e roscas por escala/opacidade usando Motion existente. Entradas por viewport, valores acessíveis finais, largura reservada e interrupção em tempo real com preferência reduzida. Preservados ausência de observação, filtros, comparação independente, estados de erro e exportações. Experimento e comandos no [registro de testes](animacoes-analises-2026-10-25.md), com 23 PNGs e uma prévia GIF; provas locais fictícias, sem publicação ou aprovação atribuída. Build/lint, regressão do navegador, movimento normal/reduzido e verificadores documentais aprovados. Pendência: avaliar ritmo e homologar no ambiente de destino. Sem novas dependências, mudanças no backend, commit ou push.

## Banco local atualizado — 25/10/2026

Corrigida falha relatada como conexão no painel local. Frontend, API e SELECT 1 respondiam, mas `/estacionamento/estrutura` e `/estacionamento/analise` retornavam HTTP 500: o banco `vaggu_revisao_local` ainda não tinha as quatro migrações de 19/10 (erro P2022, coluna `sensores.em_manutencao` ausente). Login não era a causa.

Antes de atualizar o esquema, criado backup completo com pg_dump em `ambiente.local/backups/antes-migracoes-20261025-1792971066073.dump`, ignorado pelo Git. Conferidos os SQLs e aplicado `npm run db:deploy` no backend, sem reset ou exclusão do banco. As quatro migrações foram concluídas. Consultas autenticadas de estrutura e análise passaram a HTTP 200; painel recuperado no navegador do usuário, com sua sessão preservada, e análises abertas para teste. Não foi alterado código de autenticação, permissões ou credenciais. API, frontend e PostgreSQL locais permanecem ligados.


## Cores e leitura direta das análises — 25/10/2026

Ajustado o topo conforme print recebido: categorias amarelo/azul/verde/verde-esmeralda, fundos discretos e ícones com cor; indicadores com acentos amarelo/azul/verde/roxo, maior padding e valor separado do título. Removidas repetições de cadastro e explicações longas dos cards; definições e limite da cobertura preservados em “Como ler os indicadores”, expansível por teclado. Permanência sem ciclos usa travessão e “Sem ciclos completos”, sem converter ausência em zero. Filtros ficam em uma linha no desktop e reorganizam no tablet/celular. As animações e consultas existentes foram preservadas.

Verificações: `npm run build` e `npm run lint` no frontend aprovados (aviso conhecido de chunks grandes); `%TEMP%/vaggu-analises-cores-qa.cjs` aprovado com Playwright/Edge, dados fictícios interceptados, 17 capturas, temas claro/escuro e viewports 1440×1000, 768×1024 e 390×844. Teclado na ajuda/tabela/pontos, filtros, carga/comparação lenta, falhas, recuperação, resposta antiga, ausência de histórico, 31 dias e downloads Excel/PDF exercitados; sem overflow da página ou erro JavaScript inesperado. Dois seletores do roteiro foram delimitados após a inclusão do novo details. README, mapa, fluxo e índice atualizados; `node scripts/verificar-documentacao.mjs` e `git diff --check` executados. Sem novas dependências, commit, push ou publicação. Prints locais não comprovam produção.

## Entrega da revisão das análises — 26/10/2026

Commit e push autorizados para `origin/codex/animacoes-analises`, a partir da main `fad0851`. Consolidados animações de entrada, contagens acessíveis, cores por categoria/indicador, espaçamento, filtros compactos e ajuda expansível. Incluídos documentação, README, mapa e evidências de 25/10; preservados os registros da correção do banco local e o backup ignorado pelo Git. Nenhuma credencial, arquivo de ambiente ou cópia do banco integra a entrega.

Código permanece na versão aprovada nos comandos de build/lint e testes locais dos registros anteriores; não houve mudança de código nesta rodada. No fechamento: `git fetch origin`, revisão de status/diffs/identidade configurada, `node scripts/verificar-documentacao.mjs`, `git diff --check`, commit e `git push -u origin codex/animacoes-analises`. Hash e confirmação remota ficam na mensagem de entrega. Este envio não inclui merge na main ou deploy; validação do ambiente publicado permanece pendente. A indisponibilidade da skill de roteamento permanece registrada, sem atribuição de coautoria ou aprovação a integrantes.

## Retomada física no site hospedado — 28/10/2026

Firmware vaggu_3_vagas compilado com core ESP32 3.3.12 e gravado em COM3 com BOOT confirmado pelo usuário. Relógio ajustado via USB com sincronizar-relogio-usb.ps1; validação TLS preservada. ESP32 conectou ao hotspot e recebeu HTTP 202 PROCESSADO em https://vaggu-tcc.onrender.com/api/v1/telemetria: sequência 0 em 2026-10-28T16:34:18.814Z e sequências 1/2 posteriores. Os três sensores retornaram -1 cm nos ciclos iniciais: somente heartbeat, leituras vazias. Isto comprova transporte HTTPS autenticado e recebimento, não confirma estados das três vagas nem atualização do mapa. Conferência da montagem/alimentação solicitada ao usuário. Operação autônoma após reset permanece pendente quando NTP não responde.

Adicionado script de ajuste UTC por porta serial física, sem leitura de config.h, envio de chave ou reset da placa. Compilação aprovada: 1.100.332 bytes de programa, 48.936 bytes globais. Site /api/v1/health/ready respondeu status ok e banco conectado. Documentação e mapa atualizados; nenhuma mudança de frontend, publicação, commit ou push nesta retomada.

### Posições do piloto publicadas — 28/10/2026

A pedido do usuário, salvas pelo editor do site as posições P01/P02/P03 no Piso G1, setor Piloto físico ESP32. Organizadas lado a lado na faixa entre as alas existentes, com tamanho reduzido para evitar sobreposição. Rascunho conferido com as 40 vagas anteriores preservadas; site confirmou “Mapa salvo” e visualização foi conferida no recorte do piloto. Evidência no índice visual. Operação somente de configuração do mapa, sem alteração de código frontend ou deploy.

### Aceleração da telemetria hospedada — preparação em 28/10/2026

Medido intervalo de aproximadamente seis segundos entre HTTP 202 (sequências 181/182); mapa já consulta a cada 500 ms. Implementados HTTPClient e clientes persistentes com setReuse(true), fechamento de sockets em erro, Wi-Fi sem sleep para USB e duração de POST no log. Preservados TLS, sequência/idempotência, leituras novas, filtro e separação acústica. Compilação ESP32 aprovada (1.101.760 bytes, RAM global 49.344). Testes existentes de configuração/confirmacão: 14 aprovados. Upload solicitado ao usuário, ainda pendente; ganho real não medido. Render aberto no login; usuário informou poder entrar. Ajuste proposto de ambiente 2000 ms / lacuna 4500 ms ainda não aplicado. Nenhum deploy, commit ou push.

### Confirmação rápida aplicada no Render — 28/10/2026

Usuário autenticou no Render e autorizou ajuste solicitado. Adicionadas TELEMETRIA_CONFIRMACAO_MS=2000 e TELEMETRIA_LACUNA_MAXIMA_MS=4500 no serviço vaggu-tcc (srv-daq23d59fdbs73ek4u1g), preservadas as outras variáveis. Save and deploy reutilizou a versão já publicada ee779c9; deploy dep-dbh38md9el5s73alk9u0 confirmou Deploy succeeded | Live, gatilho Environment updated, duração 40,3 s. Não houve leitura/exposição de segredos. Ainda falta gravar firmware persistente HTTPS e validar latência física; placa perdeu Wi-Fi com motivos 201/36 durante conferência. Solicitados hotspot e BOOT ao usuário. Janela de dois segundos não garante transição total nesse prazo e exige amostras consistentes; não houve confirmação de ganho físico nesta etapa.

## Sincronização do Git — 04/11/2026

Trabalho local do piloto separado na branch de origem, codex/animacoes-analises. Conferidos status, diffs, scripts, identidade Git configurada e capturas do piloto. Validação com git fetch origin --prune, node scripts/verificar-documentacao.mjs e git diff --check. A skill de roteamento não foi localizada e a autoria segue a identidade Git configurada. As verificações físicas e de latência seguem conforme os registros de 28/10. Atualização da main local por git pull --ff-only.
## Clareza de equipamentos e manutenção — 28/10/2026

A área explica o que é uma placa ESP32 e sua relação com sensores/vagas; oferece exemplos nos campos, orienta correspondência dos códigos ao equipamento e substitui “Vaga disponível” por “Vaga sem sensor”. Ajuda expansível diferencia manutenção da placa e do sensor, renovação de credencial e desativação; diálogos explicitam uma vaga ou todas as vagas da placa. Ausência de placa ativa ou vaga elegível bloqueia associação com orientação. Cadastro não representa leitura válida nem funcionamento de todos os sensores. API e regras operacionais preservadas.

Roteamento: Elisa (usabilidade), Juan como revisão indicada, sem atribuir participação ou aprovação. Branch local `fix/equipamentos-clareza-elisa` criada da main `a87c3e1f`, sincronizada com a referência origin/main disponível. Árvore inicial limpa; nenhum commit, push, PR ou coautoria criados.

Validação: `npm run build` e `npm run lint` no frontend; `node ambiente.local/equipamentos-clareza-qa.cjs` com Edge/Playwright e fixtures; `node scripts/verificar-documentacao.mjs` e `git diff --check`. Desktop 1440×1000, tablet 768×1024 e celular 390×844 nos dois temas; ajuda por teclado, diálogos, associação e estados sem placa/vaga elegível. Capturas no índice. Build mantém aviso conhecido de chunks acima de 500 kB.

Limites: Browser plugin ausente; Edge no isolamento falhou ao iniciar e a primeira URL não era acessível fora do isolamento. Vite iniciado fora do isolamento em 5174 (5173 ocupada); QA executado com permissão de execução. Caminho temporário por processo não persistiu, e o roteiro foi recriado em ambiente.local, ignorado pelo Git. Uma tentativa de atualização documental por Node falhou por aspas; substituída por escrita literal PowerShell antes dos verificadores finais. Prints longos ocultam somente o cabeçalho/atalho externos à seção durante a captura. README não apresenta esta seção, portanto suas imagens foram preservadas. Sem banco, equipamento físico ou ambiente publicado envolvidos; teste com pessoas usuárias permanece pendente.

**Conferência pós-deploy de 04/11:** `/api/v1/health` e `/api/v1/health/ready` responderam HTTP 200, sem alteração de dados. O teste de funcionamento real da versão anterior continua válido para aquele percurso; a nova apresentação foi confirmada posteriormente pelo participante no percurso registrado no início deste documento.

## Ajustes comentados do memorial — 04/11/2026

Abertura centralizada com texto e botão alinhados à foto; título usa o SVG oficial com texto alternativo VAGGU. Quinta foto coletiva substituída pelo trio das meninas, sem remover originais. Retrato de Kamilly usa `retrato-kamilly.webp`, mais nítido que a miniatura anterior. A foto `trio-equipe.jpg` disponível tem apenas 72×54 px: substituição feita conforme pedido, mas a qualidade depende do original em maior resolução. Não foi inventado detalhe por IA.

Verificação local com `node %TEMP%/vaggu-memorial-comentarios-qa.cjs`, Playwright/Edge (Browser plugin ausente), em 1440×1000, 768×1024 e 390×844. Logo, centralização, fontes das fotos, carregamento, carrossel, teclado, foco e ausência de overflow conferidos. Capturas anonimizadas em `2026-11-04 - Ajustes comentados memorial`; tema escuro próprio. `node scripts/verificar-documentacao.mjs` e `git diff --check`. Mudança restrita a HTML/CSS e caminhos de imagens; sem dependências ou mudança de lógica. Sem publicação.

## Fotos originais do memorial — 04/11/2026

Recebidas e copiadas sem edição as fotos originais das três integrantes (1280×960) e de Kamilly (960×1280). `src/dados/acervo.js` aponta para `trio-original.jpg` e `kamilly-original.jpg`; arquivos anteriores preservados. A pendência de resolução das miniaturas está resolvida por estes arquivos fornecidos pelo usuário.

Rota http://127.0.0.1:4173/memorial/, visitante público, tema escuro. Playwright/Edge local, Browser plugin ausente. Roteiro `node %TEMP%/vaggu-memorial-originais-qa.cjs`: desktop 1440×1000, tablet 768×1024 e celular 390×844; carregamento, fontes de imagem, galeria, carrossel, ampliação, teclado e overflow. Evidências anonimizadas em `2026-11-04 - Fotos originais memorial/`: arquivos `desktop`, `tablet` e `celular`, cada qual com sufixos `-hero.png`, `-completo.png`, `-carrossel.png`, `-ampliacao.png` e `-depoimento.png`. Fonte das imagens reais: anexos autorizados; capturas usam substitutos fictícios. Sem publicação ou alteração de lógica. Verificadores: `node scripts/verificar-documentacao.mjs` e `git diff --check`.

## Tutores do memorial — 04/11/2026

A lista final foi atualizada conforme os nomes fornecidos pelo usuário: Alex Augusto de Mello Junior, Matheus da Costa Zacarias, Giovanni Ribeiro Pinto e Arthur Rosa Alves Andrade, identificados como nossos tutores. Instituições SESI e SENAI mantidas. Esta lista substitui a redação anterior com nomes abreviados.

Validação local: `node %TEMP%/vaggu-memorial-tutores-qa.cjs`, Playwright/Edge, rota `/memorial/`, visitante público, tema escuro, desktop 1440×1000, tablet 768×1024 e celular 390×844. Evidências anonimizadas em `2026-11-04 - Tutores memorial/`, arquivos por viewport com sufixos `-completo.png`, `-hero.png`, `-carrossel.png`, `-ampliacao.png` e `-depoimento.png`; nomes e fotos substituídos somente nas capturas. `node scripts/verificar-documentacao.mjs` e `git diff --check`. Alteração textual, sem mudança de lógica ou publicação.

## Lista de tutores — 04/11/2026

Os quatro nomes dos tutores agora aparecem em lista semântica, um por tópico, com espaçamento e marcadores amarelos. Conteúdo dos nomes preservado. Alterados `index.html` e `src/estilos.css` do memorial.

Validação: `node %TEMP%/vaggu-memorial-lista-qa.cjs`, Playwright/Edge local, visitante público em `/memorial/`, tema escuro, viewports desktop 1440×1000, tablet 768×1024 e celular 390×844. Evidências em `2026-11-04 - Lista de tutores/` com nomes/fotos fictícios somente nas capturas; `desktop-completo.png`, `tablet-completo.png` e `celular-completo.png` registram os agradecimentos. Carrossel, teclado, foco, carregamento e overflow verificados; sem publicação. Comandos finais: `node scripts/verificar-documentacao.mjs` e `git diff --check`.

## Edimar e título do memorial — 04/11/2026

`index.html`: Edimar Dantas da Silva Duarte incluído como quinto tutor; título da aba atualizado para Memorial Vaggu. Playwright/Edge (`node %TEMP%/vaggu-edimar-qa.cjs`): visitante público em `/memorial/`, tema escuro, 1440×1000, 768×1024 e 390×844. Capturas completas anonimizadas em `2026-11-04 - Edimar e titulo/`; título, carregamento, teclado e ausência de overflow conferidos. Validação local, sem publicação. Verificadores: `node scripts/verificar-documentacao.mjs` e `git diff --check`.

Em 04/11/2026, o memorial recebeu o depoimento completo da Kamilly. Revisão local em /memorial/ com Playwright/Edge (1440×1000, 768×1024 e 390×844), com abertura por teclado e capturas fictícias em 2026-11-04 - Depoimento Kamilly. Verificações: build e lint do frontend, node scripts/verificar-documentacao.mjs e git diff --check.

## Revisão do diálogo do WhatsApp — 05/11/2026

Feedback incorporado: recursos em três blocos curtos e caminhos distintos para roteiro de demonstração, ajuda e contato institucional. Removida a promessa de atendente em instantes; o bot continua demonstrativo. Mantidos os IDs, a seleção por número e o retorno ao menu. Sem alterações no frontend web, publicação ou envio real.

Verificação: `npm test --prefix vaggu-backend` compilou e aprovou 100 testes, com 12 ignorados, incluindo integrações dependentes de PostgreSQL de teste. Executados também `node scripts/verificar-documentacao.mjs` e `git diff --check`. A skill de roteamento não foi localizada no repositório nem nas skills instaladas. Captura anonimizada dos novos textos e botões pendente: testes locais simulam a Meta e não exibem a conversa no WhatsApp.

## Persona Mariana — 06/11/2026

Perfil do PDF e complemento de necessidades incorporados ao livro e à ficha de personas. Jornada inclui alternativa quando o telão mostra dados indisponíveis. Conferência por pdftoppm, leitura do DOCX e verificador documental. A renderização do livro permanece pendente por falta de LibreOffice.

## Retrato de Juan — 06/11/2026

Foto fornecida de 1200×1600 incorporada ao livro e ao Memorial. Validação local com Playwright/Edge via vaggu-juan-qa.cjs em três viewports, verificador documental e git diff --check. Renderização do DOCX pendente por ausência do LibreOffice.

## Sincronização do repositório e inventário da bancada — 10/11/2026

Executados `git fetch --all --prune` e `git merge --ff-only origin/main`. A main local já estava no mesmo commit do remoto (`2020505`) e sem alterações antes do registro. A main inclui a consolidação do piloto ESP32 (`fdc779c`, PR #23), fotos da bancada e vídeos no memorial (`ce5ca6a`), avanços na navegação e no acervo do memorial (`437f8df`) e contratação demonstrativa no WhatsApp (`70fa371`). Ramos remotos não integrados foram revisados sem incorporar trabalho paralelo automaticamente. Mudanças restritas a outras máquinas só podem ser comparadas após envio ao remoto.

Usuário confirmou ter os resistores necessários. Guia da bancada atualizado; firmware continua com um LED ativo no GPIO13. Não houve gravação, ensaio dos novos componentes, alteração do ambiente hospedado ou push nesta revisão.

### Ensaio da montagem de três sensores e seis LEDs

Montagem informada pelo usuário. Monitor serial em COM3 confirmou execução do teste USB anterior e leituras dos três canais, com ausência intermitente de eco, especialmente no S03. Nesse modo não há envio ao site. Atualizado o sketch de ensaio para testar os seis LEDs na partida e indicar ocupação por par de LEDs, preservando a pinagem dos sensores. Arduino CLI compile para esp32:esp32:esp32doit-devkit-v1 aprovado (272.916 bytes, RAM global 22.132). Tentativa de upload automático parou em modo 0x13 antes de gravar; solicitado BOOT para repetir. Validação visual dos LEDs e transições físicas pendente. Guia, mapa e verificador documental atualizados; git diff --check executado.
`teste_leds_usb`: preparado ensaio isolado dos seis LEDs em sequência; gravação e conferência visual pendentes.

### Ensaio local com sensores próximos

Montagem observada com três transdutores próximos. Firmware integrado mantém um disparo por vez, 120 ms de silêncio por tentativa, par coerente entre três amostras e LEDs vermelho/verde para cada canal, inclusive sem Wi-Fi. Separação não comprova eliminação de interferência. Cópia privada para ensaio local preserva config.h hospedado; identidade e chave da bancada verificadas contra PostgreSQL. Vite aberto em /painel, API via Vite e IP do hotspot respondendo /api/v1/health/ready. Build backend, dez testes de confirmação/rotas, compilação Arduino DevKit V1 (1.102.568 bytes), verificador documental e diff check executados. Aguardando BOOT para gravar e testar cada sensor com o alvo isolado. Nenhum deploy.

Gravação do firmware local em COM3 concluída e flash verificada pelo esptool. Serial confirmou leituras simultaneamente válidas S01 92,6 cm, S02 90,1 cm e S03 89,0 cm com indicação lógica verde. A aparência dos LEDs e reação isolada de cada vaga ainda precisam de conferência física. A ESP32 aguardava Wi-Fi (201/36), e o IPv4 do hotspot não estava ativo no computador durante a verificação. API local via Vite respondeu com banco conectado. Aguardando reativação do hotspot para validar envio e mapa.

### Confirmação mais rápida no Vaggu local — 10/11/2026

Reduzida TELEMETRIA_CONFIRMACAO_MS de 2000 para 1000 somente no `.env` local ignorado. Lacuna de 4500 ms, duas observações coerentes e consulta do mapa a cada 500 ms preservadas. Reiniciados backend e Vite; `/api/v1/health/ready` respondeu com banco conectado. Seis intervalos de eventos reais da ESP32 mediram 1520 a 1649 ms; banco registrou estados OCUPADA e LIVRE das três vagas após iniciar os serviços. Isso não mede o tempo exato entre mover um alvo e a atualização visual; teste isolado do S01 solicitado. Firmware, pausa acústica e Render não alterados nesta rodada.

### Aceite do teste local — 10/11/2026

Equipe confirmou o funcionamento do protótipo. Revisadas três fotos e os quadros dos dois vídeos de 11,73 s e 14 s. A gravação integrada mostra LEDs e mapa das três vagas livres → ocupadas → livres. Cinco originais preservados na pasta privada ignorada; referência no [registro do ensaio](ensaio-fisico-esp32-2026-11-10.md). Não houve publicação, alteração de firmware ou medição adicional de latência nesta etapa de documentação.


## Integração do repositório — 11/11/2026

Integrado `origin/main` de `20205056` até `185c0bbc` por fast-forward na branch local `codex/fix/pendencias-tcc-pietro`. O novo ensaio de bancada de 10/11 e os ajustes de firmware foram preservados junto às alterações locais de UX/documentação. Dois conflitos de inserção no índice de evidências e no índice VAGGU foram conciliados mantendo ambos os registros. Backup das alterações locais mantido no stash; sem commit ou publicação. O ensaio local aceito não comprova operação prolongada nem a última versão no ambiente hospedado.


## Limpeza das personas e ajustes de leitura — 11/11/2026

Removido, por autorização do usuário, o gerador auxiliar dos slides de personas em Python. A busca de consumo confirmou uso somente para gerar imagens estáticas, sem dependência de build, aplicação ou CI. Slides, visão geral e assets preservados; ficha de personas, registro dos assets e mapa atualizados. Nas análises, a revisão reduz explicações redundantes, recolhe a ajuda dos estados e usa cor somente nos ícones de categorias, mantendo os cards neutros. Evidências e validação registradas no documento de clareza das análises. Continuação na branch local `codex/fix/pendencias-tcc-pietro`, base `185c0bbc`; sem commit ou publicação.


## Preparação do envio à main — 11/11/2026

Usuário autorizou commit e push das atualizações à main. Revisão consolidada de UX, filtros em diálogo, Configurações, hierarquia das análises, contatos e dependências; rotina geral abandonada e gerador de personas removidos, com imagens preservadas. Roteamento técnico de integração: Pietro; autoria do commit mantém a identidade Git configurada, sem coautores ou aprovações atribuídas. Base remota conferida em `185c0bbc`; alterações locais e stash de segurança preservados. Pendências atuais consolidadas em [Próximos passos](../Planejamento/Próximos%20passos.md#estado-vigente--11112026). As várias pastas de prints preservam a evolução; o README aponta para as capturas finais. Validação de navegador local com dados fictícios não comprova publicação.
