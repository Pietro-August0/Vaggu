# Contatos públicos — correção de 09/11/2026

Rota `/`, perfil visitante, origem local em `127.0.0.1:5185–5187`, Edge/Playwright. Dados de QA fictícios: número válido `5511999999999`, override vazio e texto inválido; sessão pública simulada sem usuário. Nenhum envio de WhatsApp/e-mail foi realizado. As capturas locais não comprovam produção ou hardware.

A correção cobre quatro contatos: hero, card, primeira etapa de Sobre e seção de operação. Sem número válido, todos abrem o e-mail empresarial, com rótulos/ícones correspondentes; número válido preserva WhatsApp em nova aba. O rodapé continua omitindo WhatsApp inválido.

Browser plugin not available: Playwright com Edge instalado. Edge não iniciou no isolamento e depois não alcançou o Vite isolado; os servidores e a execução de QA foram autorizados fora do isolamento. O cache compartilhado de três Vites gerou EPERM/504 após a atualização. Os cenários passaram a usar configurações temporárias ESM com caches separados, sem alterar a configuração versionada ou remover caches manualmente.

Matriz: três configurações × três viewports × dois temas = 18 cenários. Exercitados foco visível, Enter nos quatro links, destino/target, ausência de links sem href, overlay, overflow e erros inesperados de console. As navegações de contato são interceptadas após conferir o destino. Movimento reduzido habilitado; aviso informativo da biblioteca Motion é esperado e não contado como erro. Capturas aguardam as transições de opacidade terminarem.

| Configuração | Tema | Viewport | Hero | Card | Sobre | Operação |
| --- | --- | --- | --- | --- | --- | --- |
| vazio | claro | desktop 1440×1000 | [Print](vazio-desktop-light-inicio.png) | [Print](vazio-desktop-light-contato.png) | [Print](vazio-desktop-light-sobre.png) | [Print](vazio-desktop-light-operacao.png) |
| vazio | claro | tablet 768×1024 | [Print](vazio-tablet-light-inicio.png) | [Print](vazio-tablet-light-contato.png) | [Print](vazio-tablet-light-sobre.png) | [Print](vazio-tablet-light-operacao.png) |
| vazio | claro | celular 390×844 | [Print](vazio-celular-light-inicio.png) | [Print](vazio-celular-light-contato.png) | [Print](vazio-celular-light-sobre.png) | [Print](vazio-celular-light-operacao.png) |
| vazio | escuro | desktop 1440×1000 | [Print](vazio-desktop-dark-inicio.png) | [Print](vazio-desktop-dark-contato.png) | [Print](vazio-desktop-dark-sobre.png) | [Print](vazio-desktop-dark-operacao.png) |
| vazio | escuro | tablet 768×1024 | [Print](vazio-tablet-dark-inicio.png) | [Print](vazio-tablet-dark-contato.png) | [Print](vazio-tablet-dark-sobre.png) | [Print](vazio-tablet-dark-operacao.png) |
| vazio | escuro | celular 390×844 | [Print](vazio-celular-dark-inicio.png) | [Print](vazio-celular-dark-contato.png) | [Print](vazio-celular-dark-sobre.png) | [Print](vazio-celular-dark-operacao.png) |
| invalido | claro | desktop 1440×1000 | [Print](invalido-desktop-light-inicio.png) | [Print](invalido-desktop-light-contato.png) | [Print](invalido-desktop-light-sobre.png) | [Print](invalido-desktop-light-operacao.png) |
| invalido | claro | tablet 768×1024 | [Print](invalido-tablet-light-inicio.png) | [Print](invalido-tablet-light-contato.png) | [Print](invalido-tablet-light-sobre.png) | [Print](invalido-tablet-light-operacao.png) |
| invalido | claro | celular 390×844 | [Print](invalido-celular-light-inicio.png) | [Print](invalido-celular-light-contato.png) | [Print](invalido-celular-light-sobre.png) | [Print](invalido-celular-light-operacao.png) |
| invalido | escuro | desktop 1440×1000 | [Print](invalido-desktop-dark-inicio.png) | [Print](invalido-desktop-dark-contato.png) | [Print](invalido-desktop-dark-sobre.png) | [Print](invalido-desktop-dark-operacao.png) |
| invalido | escuro | tablet 768×1024 | [Print](invalido-tablet-dark-inicio.png) | [Print](invalido-tablet-dark-contato.png) | [Print](invalido-tablet-dark-sobre.png) | [Print](invalido-tablet-dark-operacao.png) |
| invalido | escuro | celular 390×844 | [Print](invalido-celular-dark-inicio.png) | [Print](invalido-celular-dark-contato.png) | [Print](invalido-celular-dark-sobre.png) | [Print](invalido-celular-dark-operacao.png) |
| valido | claro | desktop 1440×1000 | [Print](valido-desktop-light-inicio.png) | [Print](valido-desktop-light-contato.png) | [Print](valido-desktop-light-sobre.png) | [Print](valido-desktop-light-operacao.png) |
| valido | claro | tablet 768×1024 | [Print](valido-tablet-light-inicio.png) | [Print](valido-tablet-light-contato.png) | [Print](valido-tablet-light-sobre.png) | [Print](valido-tablet-light-operacao.png) |
| valido | claro | celular 390×844 | [Print](valido-celular-light-inicio.png) | [Print](valido-celular-light-contato.png) | [Print](valido-celular-light-sobre.png) | [Print](valido-celular-light-operacao.png) |
| valido | escuro | desktop 1440×1000 | [Print](valido-desktop-dark-inicio.png) | [Print](valido-desktop-dark-contato.png) | [Print](valido-desktop-dark-sobre.png) | [Print](valido-desktop-dark-operacao.png) |
| valido | escuro | tablet 768×1024 | [Print](valido-tablet-dark-inicio.png) | [Print](valido-tablet-dark-contato.png) | [Print](valido-tablet-dark-sobre.png) | [Print](valido-tablet-dark-operacao.png) |
| valido | escuro | celular 390×844 | [Print](valido-celular-dark-inicio.png) | [Print](valido-celular-dark-contato.png) | [Print](valido-celular-dark-sobre.png) | [Print](valido-celular-dark-operacao.png) |

Comando do roteiro temporário, ignorado pelo Git: `node ambiente.local/contato-apresentacao-qa.cjs`. Capturas anteriores do README permanecem como histórico da configuração válida; a identidade e o percurso padrão por WhatsApp foram preservados.

**Resultado final:** 18/18 cenários aprovados após atualizar dependências e separar caches; 72 capturas atuais, sem overflow ou erro inesperado de console. Representantes de desktop, tablet e celular foram abertos para revisão visual. O destino é validado e sua navegação interceptada: não se comprova entrega de e-mail/mensagem.
