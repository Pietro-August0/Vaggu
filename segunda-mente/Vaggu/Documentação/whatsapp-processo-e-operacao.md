# WhatsApp — processo de implantação e operação

**Revisão local — 05/11/2026:** o menu diferencia roteiro de demonstração, ajuda para problemas comuns e contato institucional. Esta revisão remove a promessa de retorno humano da versão publicada em 04/11. Confira o fluxo abaixo; publicação e captura no WhatsApp ainda estão pendentes.

**Resultado da publicação — 04/11/2026:** commit funcional 0674a02 enviado à main; Render confirmou Deploy succeeded em 1m42s, deploy dep-dblilpon74is73a89kn0. Consulta pública GET /api/v1/health/ready retornou HTTP 200 e banco conectado. Opções 3–5 publicadas com anúncio demonstrativo de atendente em alguns instantes, sem pedido de e-mail. Nenhuma mensagem real enviada pelo agente; teste de recebimento e captura no WhatsApp permanecem separados. Autoria confirmada diretamente pelo usuário; trabalho local amplo preservado.

**Atualização de 04/11/2026 — atendimento demonstrativo:** por solicitação do usuário, opções 3 (demonstração), 4 (suporte) e 5 (equipe) deixam de pedir envio de e-mail e informam “Uma atendente entrará em contato com você em alguns instantes”. Trata-se de simulação para o TCC: não há fila, notificação ou atendimento real acionado. Botões de retorno, números digitados e proteção contra repetição permanecem. Contatos públicos de privacidade/exclusão não mudam. Versões e relatos anteriores abaixo preservam o comportamento anterior.

**Decisão de escopo e aceite — 04/11/2026:** o usuário confirmou a homologação completa do site. O aceite web está encerrado por essa confirmação, sem nova execução em produção pelo agente nem hash de deploy adicional informado. O WhatsApp será demonstrativo: atendimento humano real, coleta comercial e protocolos deixam de ser requisitos desta entrega. Procedimentos de dados definidos em [operação do TCC](operacao-dados-tcc.md); hardware físico mantém aceite próprio.

**Confirmação do participante — 04/11/2026:** em resposta ao teste solicitado, participante confirmou o percurso Oi → Ver opções → Conhecer a VAGGU, com imagem e link do site, seguido de Ver recursos e Voltar ao menu. Validação funcional da nova apresentação concluída para esse percurso na versão 7356e12. Não comprova os demais caminhos individualmente nem substitui captura anonimizada da interface.

Atualizado em 04/11/2026. Este documento consolida o resultado atual; os registros datados do planejamento preservam as tentativas e evidências anteriores.

## Canais e responsabilidade

- Número público: +55 (11) 99380-7892; contato da landing: https://wa.me/5511993807892.
- Site: https://vaggu-tcc.onrender.com.
- Atendimento, demonstração, suporte, privacidade e exclusão: **vagguempresarial@outlook.com**, autorizado pelo responsável em 04/11. Substitui o e-mail pessoal nas páginas públicas; a autoria Git previamente autorizada não muda.
- Responsável pelo aviso de privacidade: Elisa Gomes Teixeira. Não foi atribuída nova responsabilidade individual de atendimento.

## Processo realizado

1. Revisamos a landing, configuração Meta, ambiente Render e webhook existente. O número público foi definido como padrão no frontend, preservando a possibilidade de configurar outro pelo ambiente.
2. Criamos as páginas públicas `/privacidade` e `/exclusao-de-dados` e os links no rodapé. Os endereços foram cadastrados na Meta e o aplicativo foi publicado. A exclusão é analisada por e-mail; não há callback que apague dados automaticamente.
3. Habilitamos a resposta automática no Render e no blueprint. A assinatura do campo `messages` do aplicativo não bastava: ativamos também a inscrição da conta real nos webhooks.
4. Após confirmação pessoal de autenticação na Meta, corrigimos o segredo do aplicativo no Render sem expô-lo. O ambiente foi republicado. Consultas ao banco local não foram usadas como comprovação do recebimento em produção.
5. Acrescentamos diagnóstico por quantidade, tipo e presença de texto/remetente, sem incluir conteúdo da conversa ou contatos nos novos resumos. O envio real ainda falhava com código 100 e `Authorization Error`.
6. Verificamos que o token era válido e tinha os escopos necessários. Conseguir consultar o número não comprovava permissão para enviar mensagens. O usuário técnico Employee tinha o aplicativo e a conta de teste, mas faltava a conta real Vaggu.
7. Com autorização explícita do responsável para a opção ampla “Tudo” oferecida pela Meta, atribuímos a conta real ao usuário técnico. Não geramos outro token. O envio passou de erro para aceitação pela API; o participante confirmou o recebimento e o funcionamento do bot.
8. Substituímos o menu textual por lista nativa de cinco opções, mantendo os números digitados. As respostas passaram a oferecer retorno clicável. Foram aprovados 18 testes locais, incluindo deduplicação e contrato HTTP. Após duas falhas internas de push durante incidente do GitHub, a terceira tentativa foi aceita; o Render publicou `0c63291`, contendo a implementação `317075a`.
9. O participante confirmou o percurso real “Oi → Ver opções → Conhecer a VAGGU → Voltar ao menu”. Isso comprova esse percurso; não equivale a testar individualmente todas as opções em produção.
10. Na revisão atual, removemos o emoji da saudação, apresentamos o site na opção 1, adicionamos uma imagem ilustrativa da marca e botões de continuidade. Os contatos de demonstração, suporte, atendimento e privacidade passaram a usar o e-mail empresarial autorizado. Publicação em 7356e12 e teste real de imagem, link, Ver recursos e retorno foram registrados no planejamento em 04/11; demais caminhos e operação seguem pendentes.

## Comportamento atual do código

`Oi`, `Olá` e `MENU` abrem “Ver opções”. Números 1–6 e IDs nativos de seleção usam a mesma resposta. Todas as opções oferecem “Voltar ao menu”.

1. **Conhecer a VAGGU:** imagem, site e botões de recursos e demonstração.
2. **Ver funcionalidades:** três blocos curtos sobre vagas, monitoramento e análises, com botão para a demonstração.
3. **Ver demonstração:** roteiro do painel e link da apresentação pública. O painel exige acesso autorizado.
4. **Ajuda com a plataforma:** dicas para acesso e mapa desatualizado, orientação para não compartilhar credenciais e botão de contato.
5. **Contato da equipe:** indica os canais oficiais no rodapé do site e explica que o bot não encaminha mensagens.
6. **Contratar a VAGGU** simula o início da contratação com uma mensagem de retorno da equipe. O fluxo dispensa coleta de dados comerciais e acionamento de atendimento.

Textos livres não abrem solicitações automaticamente; IDs desconhecidos e mídia são ignorados. O bot não agenda, abre chamados ou promete retorno.

A lista principal tem cabeçalho textual. A imagem fica em uma mensagem de botões, enviada como única resposta daquela entrada. Não acrescentamos um segundo envio que tornasse ambígua a recuperação após timeout. O serviço preserva deduplicação por identificador e revisão manual dos envios de resultado incerto; não há garantia universal de entrega exatamente uma vez.

A imagem usa foto ilustrativa e marca já presentes no projeto, sem dados operacionais ou conversas. Fonte: Poppins; cores da identidade amarela/escura. `scripts/gerar-apresentacao-whatsapp.mjs` exporta o JPEG com Sharp disponível na máquina de autoria (`VAGGU_SHARP_PATH` pode apontar ao módulo). Não é dependência nova de execução ou build. Arquivo público: `/assets/apresentacao-whatsapp-vaggu.jpg`.

## Verificação e diagnóstico

1. Conferir Render Live para o commit esperado e acesso HTTP às páginas públicas e ao JPEG com `image/jpeg`.
2. De outro número, enviar nova mensagem “Oi”; abrir opções, selecionar 1 e conferir imagem, link, recursos, demonstração e retorno. Exercitar também 4 e 5.
3. Observar entrada de texto/interactive e status nos logs. Não copiar tokens, corpos de conversa ou números pessoais para relatórios.
4. Sem entrada: conferir número destinatário, inscrição da conta e campo `messages`, callback HTTPS e assinatura. Com entrada e falha de envio: conferir código, token, conta atribuída e permissões reais. HTTP 200 de consulta de metadados não prova autorização de envio.
5. Em falha ou timeout, verificar o estado salvo antes de repetir. Envios incertos exigem revisão; não limpar registros para forçar resposta.

Credenciais ficam no Render. Arquivos temporários de diagnóstico devem ser ignorados pelo Git e removidos ao terminar; não registrar valores ou prints de segredos. A configuração local pode diferir de produção.

## Pendências reais

| Item | Situação |
| --- | --- |
| Número na landing, publicação Meta, assinatura da conta e autorização de envio | Concluídos e confirmados na implantação anterior |
| Menu nativo e retorno | Percurso real confirmado pelo participante |
| Nova imagem, textos e e-mail empresarial | Publicados em 7356e12; JPEG e contatos públicos verificados. Imagem, link, Ver recursos e retorno confirmados pelo participante em 04/11 |
| Captura anonimizada da interface WhatsApp | Pendente: não há sessão controlável disponível; confirmação funcional não substitui captura |
| Sessão guiada, coleta estruturada e protocolo | Fora do escopo demonstrativo por decisão expressa do usuário em 04/11; caminhos orientam contato por e-mail |
| Operação da caixa empresarial e prazo de atendimento | Não exigidos no TCC demonstrativo; não há promessa de resposta humana |
| Retenção e exclusão | Procedimento definido em operação-dados-tcc.md; sem eliminação automática |

O aceite de P10 passa a considerar o recorte demonstrativo autorizado em 04/11; a coleta estruturada e a operação humana não são mais bloqueadores. Hardware físico, Power BI publicado e demais pacotes não são homologados por este teste.

## Resultado da revisão

Builds backend/frontend, lint frontend e 19 testes WhatsApp aprovados. Verificador documental e diff sem falhas. Render Live para `7356e12` em 2m7s. JPEG público HTTP 200/image/jpeg, 121.573 bytes; contato empresarial conferido no navegador em privacidade e exclusão. Seis capturas locais responsivas e uma de produção preservadas no índice de evidências. O frontend local sem API apresentou 502 somente em `/api/v1/auth/me`; não houve erro de página ou overflow nas rotas conferidas. Confirmação funcional da nova imagem, link e botões recebida do participante em 04/11. Captura anonimizada continua pendente.
