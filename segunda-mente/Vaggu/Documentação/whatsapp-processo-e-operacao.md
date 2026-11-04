# WhatsApp — processo de implantação e operação

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
10. Na revisão atual, removemos o emoji da saudação, apresentamos o site na opção 1, adicionamos uma imagem ilustrativa da marca e botões de continuidade. Os contatos de demonstração, suporte, atendimento e privacidade passaram a usar o e-mail empresarial autorizado. A publicação e os testes desta revisão devem ser registrados no planejamento antes de considerar a nova versão homologada.

## Comportamento atual do código

`Oi`, `Olá` e `MENU` abrem “Ver opções”. Há cinco caminhos: conhecer a VAGGU, funcionalidades, demonstração, suporte e equipe. Números 1–5 e IDs nativos de seleção usam a mesma resposta. A opção 1 inclui o site e um cabeçalho JPEG, com “Ver recursos”, “Pedir demonstração” e “Voltar ao menu”. As demais mantêm retorno ao menu. Textos livres não abrem solicitações automaticamente; IDs desconhecidos e mídia são ignorados. Não existe promessa de atendimento imediato.

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
| Sessão guiada, coleta estruturada, protocolo de demonstração/suporte | Não implementados; os caminhos atuais orientam contato por e-mail |
| Operação da caixa empresarial, responsáveis e prazo de atendimento | Acordo operacional pendente; nenhum envio de e-mail foi realizado neste trabalho |
| Política operacional de retenção e rotina de exclusão | Definir e validar; a página não promete eliminação automática |

Não encerrar P10 integralmente com base no menu. Hardware físico, Power BI publicado e demais pacotes não são homologados por este teste.

## Resultado da revisão

Builds backend/frontend, lint frontend e 19 testes WhatsApp aprovados. Verificador documental e diff sem falhas. Render Live para `7356e12` em 2m7s. JPEG público HTTP 200/image/jpeg, 121.573 bytes; contato empresarial conferido no navegador em privacidade e exclusão. Seis capturas locais responsivas e uma de produção preservadas no índice de evidências. O frontend local sem API apresentou 502 somente em `/api/v1/auth/me`; não houve erro de página ou overflow nas rotas conferidas. Confirmação funcional da nova imagem, link e botões recebida do participante em 04/11. Captura anonimizada continua pendente.
