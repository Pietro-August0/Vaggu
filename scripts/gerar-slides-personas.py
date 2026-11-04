"""Diagrama os quatro slides a partir dos fundos e recortes locais revisados.

Requer Pillow e os arquivos Poppins instalados com o frontend. Os recortes e
fundos são assets preparados com a ferramenta de imagem; este script compõe
esses assets e o texto, sem tentar refazer a remoção de fundo das fotografias.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "segunda-mente/Vaggu/Evidências visuais/Personas"
FONTS = ROOT / "vaggu-frontend/node_modules/@fontsource/poppins/files"
W, H = 1920, 1080
YELLOW, WHITE = "#ffe100", "#ffffff"


def font(size, weight=400, italic=False):
    style = "italic" if italic else "normal"
    return ImageFont.truetype(str(FONTS / f"poppins-latin-{weight}-{style}.woff"), size)


def text_run(canvas, xy, pieces, size, weight=300):
    """Cada trecho pode ter cor, peso e itálico próprios, como no original."""
    draw = ImageDraw.Draw(canvas)
    x, y = xy
    for text, emphasis in pieces:
        face = font(size, 700 if emphasis else weight, emphasis)
        draw.text((x, y), text, font=face, fill=YELLOW if emphasis else WHITE, anchor="lt")
        x += draw.textlength(text, font=face)
    if x > 1230:
        raise ValueError(f"Texto ultrapassa a área segura: {pieces}")


def background(kind):
    return Image.open(OUT / f"fundo-{kind}.png").convert("RGBA").resize((W, H), Image.Resampling.LANCZOS)


def portrait(canvas, slug, side):
    cutout = Image.open(OUT / f"{slug}-recorte.png").convert("RGBA")
    # A caixa do sujeito é medida pelo alfa para ignorar a margem transparente.
    bounds = cutout.getchannel("A").point(lambda a: 255 if a > 128 else 0).getbbox()
    if bounds is None:
        raise ValueError(f"Recorte vazio: {slug}")
    left, top, right, bottom = bounds
    cutout = cutout.crop((max(0, left - 8), max(0, top - 8), min(cutout.width, right + 8), bottom))
    height = 1160 if side == "left" else 1110
    cutout = cutout.resize((round(cutout.width * height / cutout.height), height), Image.Resampling.LANCZOS)
    position = (-240, 30) if side == "left" else (1210, 65)
    canvas.alpha_composite(cutout, position)


def profile(name, age, slug, lines):
    canvas = background("perfil")
    portrait(canvas, slug, "left")
    d = ImageDraw.Draw(canvas)
    d.text((490, 286), name, font=font(76, 700), fill=WHITE, anchor="lt")
    age_x = 490 + d.textlength(name, font=font(76, 700)) + 20
    d.text((age_x, 284), f"{age} anos", font=font(86, 200, True), fill=YELLOW, anchor="lt")
    for index, pieces in enumerate(lines):
        text_run(canvas, (495, 404 + index * 43), pieces, 30, 400)
    canvas.convert("RGB").save(OUT / f"{slug}-perfil-slide.png", optimize=True)


def needs(slug, bullets):
    canvas = background("necessidades")
    portrait(canvas, slug, "right")
    d = ImageDraw.Draw(canvas)
    for x in (139, 175):
        d.line([(x, 244), (x + 22, 266), (x, 288)], fill=YELLOW, width=9, joint="curve")
    d.text((220, 238), "Necessidades", font=font(61, 700, True), fill=YELLOW, anchor="lt")
    for i, pieces in enumerate(bullets):
        y = 443 + i * 59
        d.ellipse((143, y + 11, 158, y + 26), fill=WHITE)
        text_run(canvas, (180, y), pieces, 41)
    canvas.convert("RGB").save(OUT / f"{slug}-necessidades-slide.png", optimize=True)


def overview():
    """Folha de comparação visual: referência original e quatro slides atuais."""
    canvas = Image.new("RGB", (1920, 1620), "#171717")
    names = [
        "carlos-perfil-original.jpg", "carlos-necessidades-original.jpg",
        "mariana-perfil-slide.png", "mariana-necessidades-slide.png",
        "rafael-perfil-slide.png", "rafael-necessidades-slide.png",
    ]
    for index, name in enumerate(names):
        thumbnail = Image.open(OUT / name).convert("RGB").resize((960, 540), Image.Resampling.LANCZOS)
        canvas.paste(thumbnail, ((index % 2) * 960, (index // 2) * 540))
    canvas.save(OUT / "personas-visao-geral.png", optimize=True)


def main():
    profile("Mariana", 34, "mariana", [
        [("Motorista", True), (" que frequenta o shopping", False)],
        [("para compras, alimentação e serviços.", False)],
    ])
    needs("mariana", [
        [("Encontrar um andar ou setor com ", False), ("vagas.", True)],
        [("Compreender ", False), ("categorias e restrições.", True)],
        [("Identificar dados ", False), ("parciais ou indisponíveis.", True)],
        [("Ler a sinalização com ", False), ("clareza e rapidez.", True)],
    ])
    profile("Rafael", 39, "rafael", [
        [("Acompanha a ", False), ("operação", True), (" do", False)],
        [("estacionamento do shopping.", False)],
    ])
    needs("rafael", [
        [("Consultar a situação e a ", False), ("última leitura.", True)],
        [("Localizar sensores por ", False), ("vaga, andar e setor.", True)],
        [("Distinguir ", False), ("ocupação, falha e manutenção.", True)],
        [("Encaminhar problemas e conferir ", False), ("novas leituras.", True)],
    ])
    overview()


if __name__ == "__main__":
    main()
