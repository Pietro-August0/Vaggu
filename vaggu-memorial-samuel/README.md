# Memorial VAGGU — Samuel

O memorial da equipe VAGGU foi organizado para acesso pelo QR code da apresentação do TCC. A rota `/memorial` apresenta o fluxo do sensor ao painel, destaques em rotação automática, retratos individuais, fotos em conjunto, depoimentos que abrem por nome e um acervo do projeto. A página usa a identidade amarela e escura da landing, com entradas curtas e transições que respeitam a preferência por movimento reduzido.

## Executar localmente

Requer Node.js 20 ou mais recente. Não há dependências externas.

```powershell
npm.cmd run dev
```

Em outros terminais, `npm run dev` também inicia o servidor. Abra `http://127.0.0.1:4173`. Para trocar a porta, defina a variável `PORT` antes de iniciar o servidor.

## Estrutura

- `index.html`: conteúdo e estrutura semântica das seções.
- `src/estilos.css`: identidade visual, responsividade e movimento reduzido.
- `src/main.js`: inicialização das interações.
- `src/interacoes/`: abertura de depoimentos por âncora, carrossel automático, ampliação da galeria e animações.
- `src/dados/acervo.js`: caminhos das mídias preservadas.
- `public/assets/`: fotografias, vídeos, marca VAGGU e fontes usadas pela página.
- `scripts/servidor.mjs`: servidor local leve para desenvolvimento.

O acervo reúne fotos selecionadas e capturas do mapa, do telão, da análise e do guia visual vindas da documentação. O logotipo em SVG recebe uma animação curta na seção de identidade. Os arquivos originais ficam preservados no repositório. Os depoimentos disponíveis foram preservados, incluindo o texto original de Pietro. O depoimento de Kamilly foi incluído com o texto enviado pela equipe.

A tipografia Poppins e a logo amarela foram reutilizadas dos recursos já usados no frontend VAGGU. Os arquivos da fonte vieram do pacote `@fontsource/poppins` instalado no projeto e acompanham sua licença SIL Open Font License. A página independente usa esses arquivos localmente, sem depender do build React do frontend.

No build principal, o Vite publica `index.html`, `src/` e `public/assets/` em `dist/memorial/`. Em desenvolvimento, os mesmos arquivos são servidos sob `/memorial/`. Os caminhos de fotos, vídeos, fontes e logo usam esse prefixo para não colidir com os recursos da landing.

Responsável de produto indicado pela equipe: Samuel. A autoria de commits deve refletir a conta e a pessoa que realmente os realizar.

## Abertura e acervo — 05/11/2026

A foto oficial, o modelo 3D, o logotipo amarelo, a visualização da sinalização e uma foto espontânea da equipe formam uma faixa contínua de borda a borda, da direita para a esquerda. O controle de reprodução funciona por teclado e a preferência por movimento reduzido inicia o carrossel pausado. Depois dos relatos, o acervo do projeto reúne 18 imagens em grade com ampliação por teclado. A grade pessoal mostra um retrato por integrante seguido das fotos em conjunto. Textos completos dos relatos permanecem acessíveis por clique ou teclado.

Prévia local anonimizada (as fotos reais permanecem no site):

![Faixa contínua no celular](../segunda-mente/Vaggu/Evidências%20visuais/2026-11-05%20-%20Curadoria%20da%20faixa%20do%20memorial/celular.png)

![Acervo no celular](../segunda-mente/Vaggu/Evidências%20visuais/2026-11-05%20-%20Curadoria%20da%20faixa%20do%20memorial/celular-acervo.png)

A abertura usa a logo SVG oficial e alinhamento central. A foto das três integrantes usa o original enviado em 04/11/2026. Os retratos atuais de Kamilly e Elisa foram fornecidos em 06/11/2026 e são usados sem edição na grade, nos depoimentos e na ampliação. As versões anteriores permanecem no acervo.

A função de cada integrante aparece abaixo do nome na legenda do retrato e no título do depoimento. As atribuições seguem o [SSD-VAGGU](../segunda-mente/Vaggu/Documentação/SSD-VAGGU.md).

O acervo inclui duas fotos da bancada com ESP32 e três sensores. Em Nossos momentos juntos, cinco fotos e cinco vídeos aparecem em grades separadas. Os vídeos têm nomes acessíveis, controles próprios e começam pausados. Na abertura, a faixa alterna cinco imagens e cinco vídeos em um ciclo de 80 segundos. Os clipes visíveis tocam sem som. É possível deslizar no celular, arrastar com o mouse ou usar as setas. Com foco na faixa, Espaço pausa ou retoma. Os vídeos do memorial desativam Picture-in-Picture no player.

“Da vaga ao painel” ilustra a leitura do sensor, a confirmação e as formas de visualizar a disponibilidade. As três cenas compartilham um ciclo de 12 segundos. A trilha acompanha o envio, a confirmação e a chegada da informação às telas. Com foco na lista de etapas, Espaço pausa ou retoma as três cenas. Com movimento reduzido, os diagramas ficam estáticos.
