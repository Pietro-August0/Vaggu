# Assets e slides das personas

Revisão: 21/10/2026. Preservamos os dois slides originais de Carlos e usamos sua composição como referência para os quatro slides de Mariana e Rafael. Os novos retratos são ilustrativos e os perfis continuam como hipóteses de uso, conforme [Personas](../../Especificações/Personas.md).

- `carlos-perfil-original.jpg` e `carlos-necessidades-original.jpg`: nossos slides originais, sem alteração.
- `mariana-retrato-ilustrativo.png` e `rafael-retrato-ilustrativo.png`: retratos gerados anteriormente.
- `mariana-recorte.png` e `rafael-recorte.png`: versões com transparência preparadas com a ferramenta de imagem.
- `fundo-perfil.png` e `fundo-necessidades.png`: fundos reconstruídos a partir dos slides de Carlos, com remoção de texto e retrato pela ferramenta de imagem. São aproximações da arte original.
- `mariana-perfil-slide.png`, `mariana-necessidades-slide.png`, `rafael-perfil-slide.png` e `rafael-necessidades-slide.png`: slides finais em 1920×1080, com Poppins e texto diagramado.
- `personas-visao-geral.png`: folha de comparação dos seis slides, com os originais na primeira linha.

## Reprodução e conferência

O script [gerar-slides-personas.py](../../../../scripts/gerar-slides-personas.py) usa Pillow e os arquivos Poppins de `vaggu-frontend/node_modules/@fontsource/poppins/files`. Execute `python scripts/gerar-slides-personas.py` na raiz, com Pillow disponível. O script recria os quatro slides e a visão geral a partir dos assets locais; não solicita geração de imagens ou conexão externa. Os prompts abaixo registram a preparação dos assets com a ferramenta de imagem integrada, sem uso do modo CLI/API.

Conferimos visualmente os quatro slides com a referência de Carlos: posição dos títulos e retratos, textura, retículas, tamanho e peso da tipografia, destaques, leitura integral e ausência de sobreposição entre texto e sujeito. Retiramos as notas de rodapé dos quatro slides; o caráter ilustrativo dos retratos e a condição de validação permanecem na documentação. A conferência do conteúdo com o código está registrada no documento de personas; não equivale a entrevistas ou pesquisa de campo.

## Prompts de preparação dos assets

### Fundo do perfil

```text
Use case: precise-object-edit. This image is an existing 1920x1080 VAGGU persona slide. Produce the EMPTY BACKGROUND TEMPLATE ONLY. Remove the man completely and remove all typography (Carlos, age, subtitle). Inpaint the removed regions naturally with the existing black distressed paper texture and yellow halftone behind the man. Preserve exactly the overall black textured background, the yellow halftone glow on the far right, the clipped black starburst on the right edge, and the yellow starburst at bottom around x630. Match original composition and aspect 16:9. No person, no letters, no new decorations. This will be reused behind separately composed slides.
```

### Recorte de Mariana

```text
Use case: background-extraction. Remove ONLY the background of this existing fictional persona portrait. Preserve the woman exactly, including facial identity, hair curls and wisps, skin tone, clothes, pose and hands. Return the complete woman as a photorealistic clean cutout on a genuinely transparent background, no yellow glow, no scenery, no added shadows, no text. Maintain the waist-up full subject from the source, include top of head and both body edges. Do not beautify or change expression.
```

### Recorte de Rafael

```text
Use case: background-extraction. Remove ONLY the background of this existing fictional persona portrait. Preserve the man exactly, including facial identity, hair, skin tone, black polo clothes and pose. Return the complete man as a photorealistic clean cutout on a genuinely transparent background, no yellow glow, no scenery, no added shadows, no text. Maintain the waist-up full subject from the source, include top of head and both body edges. Do not beautify or change expression.
```

### Fundo das necessidades

```text
Use case: precise-object-edit. Produce EMPTY BACKGROUND TEMPLATE of this exact existing VAGGU needs slide. Remove the man entirely and all typography including heading, bullets and body. Inpaint only removed areas. Keep the original charcoal black scratched paper texture across the canvas, large yellow halftone glow at right behind where the man stood, and the large clipped yellow starburst in the bottom left corner. Preserve original composition, 16:9. NO people, no text, no bullets, no logos, no new decorative elements. Empty black textured area at left and center ready for separately typeset content.
```
