# Acordos de desenvolvimento da VAGGU

## Antes de alterar

- Leia `segunda-mente/Vaggu/Vaggu.md`, o planejamento e os documentos da área.
- Confira branch, status, diffs e scripts reais dos `package.json`; preserve o trabalho local.
- Use a skill de roteamento VAGGU para responsabilidades e autoria real. Não simule identidades Git.
- Prefira mudanças incrementais, arquitetura simples e dependências mínimas.

## Produto e implementação

- A VAGGU é web responsiva; preserve a identidade amarela/escura, teclado e foco visível.
- Separe categoria de vaga de estado operacional. Dado antigo ou desconhecido nunca vira vaga livre.
- Cada gerente consulta somente seu shopping; autorização e isolamento ficam no servidor.
- Placa é o ESP32; seu contato não comprova funcionamento de todos os sensores.
- Senhas definitivas, hashes e chaves de equipamentos não entram em telas, prints ou relatórios.
- Senhas provisórias e chaves aparecem somente na emissão autorizada, sem prints desse momento.
- Escreva textos e documentação em português brasileiro, usando nossa voz ou redação neutra.
- Diferencie carregamento, vazio, erro, sucesso e desatualização; não invente números.
- Fora do escopo atual: reservas, pagamentos, gestão de lojas, conta de motorista e navegação 3D.
- Power BI publicado é opcional; WhatsApp real e hardware físico seguem etapas próprias.

## Regra obrigatória de prints para design e frontend

- Toda alteração de design ou frontend precisa gerar prints atuais das telas e estados afetados.
- Inclua mudanças em componentes, CSS, temas, responsividade, navegação, textos, imagens e assets.
- Capture desktop, tablet e celular quando o layout for responsivo; confira ambos os temas se afetados.
- Exercite a interação alterada, confira teclado, ausência de cortes, overflow e erros de console.
- Salve os prints em `segunda-mente/Vaggu/Evidências visuais/<data> - <assunto>/`, com nomes claros.
- Registre no índice de evidências: data, rota, perfil, viewport, origem dos dados e resultado observado.
- Use somente dados fictícios ou anonimizados. Prints locais não comprovam produção ou hardware real.
- Atualize os prints do README quando a experiência ali exibida mudar; mantenha os anteriores como histórico útil.
- Para slides e outras peças de design, exporte a imagem final e confira com a referência.
- Se a captura estiver bloqueada, registre o motivo e a pendência; não declare a revisão visual concluída.

## Documentação e entrega

- Ao mudar comportamento, contrato, arquivo ou responsabilidade, atualize o documento correspondente e o mapa.
- Registre no planejamento o resultado, os comandos executados, limites e pendências reais.
- Execute `node scripts/verificar-documentacao.mjs` e `git diff --check` antes de concluir.
- Execute build, lint e testes configurados conforme o risco; build não substitui conferência no navegador.
- Antes de remover arquivos, confira consumo, links e necessidade de reproduzir assets ou preservar evidências.
- Não apague bancos reais nem use force-push, hard reset ou limpeza ampla sem garantir preservação do trabalho.
- Não publique, envie mensagens ou atribua aprovações e coautoria sem autorização real.
