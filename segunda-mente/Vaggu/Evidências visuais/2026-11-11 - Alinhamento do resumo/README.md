# Alinhamento do resumo — 11/11/2026

Gerente fictício em http://127.0.0.1:5190/painel/analise; Shopping QA Fictício com fixtures interceptadas apenas no navegador. Sem banco, sensor ou publicação.

Desktop1440×1000, tablet768×1024 e celular390×844 em claro/escuro. Ícones e valores têm coordenadas relativas conferidas nos quatro cards. Linhas explícitas e região de apoio reservada alinham os conjuntos sem texto fictício; espessura das bordas foi uniformizada. Cobertura parcial no apoio permanece, estados/avançados recolhidos e cores discretas dos ícones preservados.

Roteiro node ambiente.local/alinhamento-resumo-qa.cjs: resumo recortado, tela completa, estados/filtros/avançados, cobertura100%, cobertura ausente, ausência de observação e falha/recuperação. Teclado, filtros/cancelamento/aplicação e downloads Excel/PDF também exercitados. Edge/Playwright autorizado fora do isolamento; Browser plugin/skill ausentes.

Comandos: npm.cmd --prefix vaggu-frontend run build; npm.cmd --prefix vaggu-frontend run lint; node scripts/verificar-documentacao.mjs; git diff --check. Provas locais não substituem teste com usuários ou ambiente publicado. Aviso conhecido de chunks grandes permanece; prints anteriores preservados.

[Resumo desktop](desktop-light-resumo.png) · [Tela completa](desktop-light-completa.png) · [Resumo celular](celular-light-resumo.png).

Seis combinações aprovadas, 66 PNGs. Valores e ícones com offsets idênticos nos quatro cards em cada viewport. Build/lint aprovados; verificador documental1508arquivos/73Markdown e diff check sem erros. Recorte desktop inspecionado visualmente. Sem overflow ou console inesperado.
