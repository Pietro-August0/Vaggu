# Memorial VAGGU — Samuel

Site independente que combina duas partes: o memorial da equipe VAGGU, com sua história, fotografias e depoimentos, e uma apresentação informativa do sistema de gestão de estacionamentos. Ele fica separado da landing comercial e da aplicação operacional.

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
- `src/interacoes/`: menu, galeria, vídeos e animações da página.
- `src/dados/acervo.js`: caminhos das mídias preservadas.
- `public/assets/`: fotografias, vídeos, marca VAGGU e fontes usadas pela página.
- `scripts/servidor.mjs`: servidor local leve para desenvolvimento.

As fotos e os dois vídeos vieram do HTML recebido. Os relatos marcados no conteúdo como demonstrativos ainda precisam ser confirmados pelos respectivos integrantes antes de uma publicação final.

A tipografia Poppins e a logo amarela foram reutilizadas dos recursos já usados no frontend VAGGU. Os arquivos da fonte vieram do pacote `@fontsource/poppins` instalado no projeto e acompanham sua licença SIL Open Font License. A página independente usa esses arquivos localmente, sem depender do build React do frontend.

Responsável de produto indicado pela equipe: Samuel. A autoria de commits deve refletir a conta e a pessoa que realmente os realizar.
