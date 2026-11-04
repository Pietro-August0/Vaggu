# Memorial VAGGU — Samuel

O memorial da equipe VAGGU foi organizado para acesso pelo QR code da apresentação do TCC. A rota `/memorial` apresenta o fluxo do sensor ao painel, um carrossel manual do projeto, retratos individuais, fotos em conjunto e depoimentos que abrem por nome. A página usa a identidade amarela e escura da landing, com entradas curtas e transições que respeitam a preferência por movimento reduzido.

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
- `src/interacoes/`: abertura de depoimentos por âncora, carrossel manual, ampliação da galeria e animações.
- `src/dados/acervo.js`: caminhos das mídias preservadas.
- `public/assets/`: fotografias, vídeos, marca VAGGU e fontes usadas pela página.
- `scripts/servidor.mjs`: servidor local leve para desenvolvimento.

O acervo reúne fotos selecionadas e capturas do mapa, do telão, da análise e do guia visual vindas da documentação. O logotipo em SVG recebe uma animação curta na seção de identidade. Os arquivos originais ficam preservados no repositório. Os depoimentos disponíveis foram preservados, incluindo o texto original de Pietro. O depoimento de Kamilly foi incluído com o texto enviado pela equipe.

A tipografia Poppins e a logo amarela foram reutilizadas dos recursos já usados no frontend VAGGU. Os arquivos da fonte vieram do pacote `@fontsource/poppins` instalado no projeto e acompanham sua licença SIL Open Font License. A página independente usa esses arquivos localmente, sem depender do build React do frontend.

No build principal, o Vite publica `index.html`, `src/` e `public/assets/` em `dist/memorial/`. Em desenvolvimento, os mesmos arquivos são servidos sob `/memorial/`. Os caminhos de fotos, vídeos, fontes e logo usam esse prefixo para não colidir com os recursos da landing.

Responsável de produto indicado pela equipe: Samuel. A autoria de commits deve refletir a conta e a pessoa que realmente os realizar.

## Memorial direto — 04/11/2026

Uma foto grande da equipe abre a página; o encerramento agradece SESI, SENAI e os tutores indicados. O carrossel responde aos botões e às setas do teclado, sem reprodução automática. A grade pessoal mostra um retrato por integrante seguido das fotos em conjunto. Textos completos dos relatos permanecem acessíveis por clique ou teclado.

Prévia local anonimizada (as fotos reais permanecem no site):

![Memorial no celular](../segunda-mente/Vaggu/Evidências%20visuais/2026-11-04%20-%20Edimar%20e%20titulo/celular-completo.png)

A abertura usa a logo SVG oficial e alinhamento central. A foto das três meninas e o retrato de Kamilly utilizam os originais enviados em 04/11/2026, sem edição; as miniaturas anteriores permanecem preservadas.
