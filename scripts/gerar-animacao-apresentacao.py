"""Renderiza o vídeo mudo da apresentação e extrai quadros para conferência."""
import argparse
from functools import lru_cache
from math import cos, degrees, pi, sin
from pathlib import Path
import subprocess

from PIL import Image, ImageDraw, ImageFont
from imageio_ffmpeg import get_ffmpeg_exe

WIDTH, HEIGHT, FPS, DURATION = 960, 540, 30, 31
BG, INK, PANEL, ROAD = "#171717", "#101012", "#343231", "#29292d"
YELLOW, CREAM, MUTE = "#ffe100", "#fff49d", "#939094"
GREEN, RED, WHITE = "#79e3a2", "#ff8282", "#fffdf3"
FRAMES = {
    "01-chegada": 1.7, "01b-procura": 2.5, "02-consulta": 3.9,
    "02b-cancela-aberta": 5.55, "02c-chegada-no-andar": 7.1, "02d-telao-do-andar": 8.85,
    "03-percurso": 12.7, "03b-curva": 14.2, "04-estacionamento": 15.8,
    "05-leitura": 19.33, "05b-eco": 19.58, "06-esp32": 22,
    "07-mapa-antes": 24.4, "08-mapa-atualizado": 26.1, "09-telao-atualizado": 29.8,
}
FONT = Path("C:/Windows/Fonts/arialbd.ttf")


def fraction(t, start, end):
    return min(1, max(0, (t - start) / (end - start)))


def motion(t, start, end):
    # Curva de movimento em tela da skill animate.
    x = fraction(t, start, end)
    if x in (0, 1):
        return x
    low, high = 0.0, 1.0
    for _ in range(18):
        u = (low + high) / 2
        curve_x = 3 * (1 - u)**2 * u * .77 + 3 * (1 - u) * u**2 * .175 + u**3
        if curve_x < x:
            low = u
        else:
            high = u
    return u**2 * (3 - 2 * u)


def lerp(a, b, p):
    return a + (b - a) * p


def move(t, start, end, a, b):
    return lerp(a, b, motion(t, start, end))


def box(d, xy, fill, radius=14, outline=None, width=1):
    d.rounded_rectangle(xy, radius, fill, outline, width)


def line(d, points, fill, width=4):
    d.line(points, fill, width, joint="curve")


def dot(d, x, y, r, fill, outline=None, width=1):
    d.ellipse((x-r, y-r, x+r, y+r), fill, outline, width)


@lru_cache
def font(size):
    return ImageFont.truetype(str(FONT), size)


def label(d, x, y, text, size, color):
    d.text((x, y), text, color, font(size), anchor="mm")


def arrow(d, x, y, color, size=24):
    line(d, [(x-size, y), (x+size, y)], color, 6)
    line(d, [(x+size-13, y-12), (x+size, y), (x+size-13, y+12)], color, 6)


def parking(d, x, y, size):
    box(d, (x-size, y-size, x+size, y+size), YELLOW, 10)
    label(d, x, y, "P", round(size*1.4), INK)


@lru_cache
def reference(directory, screen, occupied):
    state = "ocupada" if occupied else "livre"
    with Image.open(directory / f"referencia-{screen}-{state}.png") as source:
        return source.convert("RGB").resize((840, 472), Image.Resampling.LANCZOS)


@lru_cache
def placa_vagas(area, livres, destaque):
    image = Image.new("RGB", (840, 472), "#080808")
    d = ImageDraw.Draw(image)
    d.rectangle((0, 0, 839, 6), fill=YELLOW)
    label(d, 420, 80, "VAGAS LIVRES", 48, WHITE)
    label(d, 420, 220, str(livres), 180, YELLOW)
    box(d, (138, 327, 702, 429), "#191919", 12, YELLOW if destaque else "#484848", 4)
    label(d, 420, 378, area, 56, WHITE)
    return image


def billboard(occupied, highlight=False):
    return placa_vagas("SETOR A", 0 if occupied else 1, highlight)


def entrance_billboard(highlight):
    return placa_vagas("PISO G1", 1, highlight)


def sign_zoom(image, source, zoom, left, top, width):
    image.paste(Image.blend(image, Image.new("RGB", image.size, INK), zoom*.8))
    width = round(lerp(width, WIDTH, zoom))
    xy = round(lerp(left, 0, zoom)), round(lerp(top, 0, zoom))
    image.paste(source.resize((width, round(width * 9 / 16)), Image.Resampling.LANCZOS), xy)


def barrier(d, opening):
    x, y = 647, 397
    angle = opening * pi * .48
    for segment in range(8):
        start, end = segment * 10, (segment + 1) * 10
        points = [(x-r*cos(angle), y-r*sin(angle)) for r in (start, end)]
        line(d, points, WHITE if segment % 2 == 0 else "#f45b5b", 12)
    box(d, (x-11, 388, x+11, 465), "#55515a", 5)
    dot(d, x, y, 5, GREEN if opening >= .98 else RED)


def side_car(d, x, y, eyes):
    d.ellipse((x-111, y+34, x+116, y+54), "#1b1b1e")
    box(d, (x-111, y-16, x+111, y+35), YELLOW, 22)
    d.polygon([(x-80, y-9), (x-57, y-55), (x+20, y-55), (x+61, y-14)], fill=YELLOW)
    box(d, (x-53, y-45, x+23, y-14), "#b6d8d8", 10)
    dot(d, x+4, y-34, 10, "#ad623e")
    d.pieslice((x-7, y-48, x+15, y-26), 180, 355, fill=INK)
    dot(d, x+7+eyes, y-34, 1.5, INK)
    box(d, (x+99, y-7, x+111, y+6), WHITE, 4)
    box(d, (x-110, y-6, x-99, y+6), RED, 4)
    for offset in (-64, 66):
        dot(d, x+offset, y+31, 23, INK)
        dot(d, x+offset, y+31, 10, "#838083")


def arrival(image, d, t, directory):
    dot(d, 153, 115, 50, "#484039")
    for x, y in [(235, 79), (80, 64), (843, 99), (893, 68), (742, 49)]:
        dot(d, x, y, 2, CREAM)
    box(d, (238, 153, 687, 380), "#424046", 25)
    box(d, (318, 103, 594, 388), "#55515a", 27)
    box(d, (333, 119, 579, 172), YELLOW, 13)
    label(d, 456, 146, "SHOPPING", 27, INK)
    for x in [258, 608]:
        for y in [191, 257]:
            box(d, (x, y, x+57, y+40), "#a69872", 7)
    box(d, (348, 193, 564, 386), "#26262b", 16)
    box(d, (362, 204, 550, 252), INK, 9)
    label(d, 456, 227, "ESTACIONAMENTO", 17, WHITE)
    box(d, (373, 265, 536, 380), "#19191c", 8)
    line(d, [(389, 281), (523, 281)], "#e1ce83", 4)
    d.rectangle((0, 382, WIDTH, HEIGHT), ROAD)
    d.rectangle((0, 372, WIDTH, 386), "#6e6867")
    for x in range(33, WIDTH, 111):
        box(d, (x, 486, x+65, 493), "#666365", 4)
    box(d, (774, 260, 795, 372), "#575458", 7)
    box(d, (748, 359, 821, 373), PANEL, 6)
    box(d, (656, 133, 932, 290), INK, 9, YELLOW, 2)
    image.paste(entrance_billboard(False).resize((264, 148), Image.Resampling.LANCZOS), (662, 138))
    barrier(d, motion(t, 6.65, 7.5))
    x = move(t, 0, 4.1, -122, 458)
    x = move(t, 7.3, 9, 458, 1080) if t >= 7.3 else x
    looking = 2.35 <= t < 4.15
    eyes = (-2 if int(t * 4) % 2 else 1) if looking else 2
    side_car(d, x, 423, eyes)
    if looking:
        bubble_y = move(t, 2.35, 2.7, 319, 302)
        d.polygon([(x+4, bubble_y+22), (x+18, bubble_y+35), (x+19, bubble_y+19)], fill=CREAM)
        dot(d, x+6, bubble_y, 26, CREAM)
        label(d, x+6, bubble_y, "?", 35, INK)
    if 4.2 <= t < 7.4:
        zoom = min(motion(t, 4.2, 5.05), 1 - motion(t, 6.6, 7.4))
        sign_zoom(image, entrance_billboard(t >= 5.4), zoom, 662, 138, 264)


def floor_arrival(image, d, t, directory):
    d.rectangle((0, 83, WIDTH, 401), fill="#3c3940")
    d.rectangle((0, 366, WIDTH, 540), fill=ROAD)
    for x in (108, 432, 879):
        d.rectangle((x, 83, x+44, 373), fill="#625f65")
        d.rectangle((x, 336, x+44, 355), fill=YELLOW)
    for x in (185, 475, 765):
        box(d, (x, 93, x+80, 100), CREAM, 3)
    parking(d, 237, 215, 31)
    label(d, 237, 271, "PISO G1", 27, WHITE)
    box(d, (538, 131, 854, 314), INK, 9, "#6c686d", 3)
    image.paste(billboard(False).resize((304, 171), Image.Resampling.LANCZOS), (544, 137))
    for x in range(45, WIDTH, 120):
        box(d, (x, 488, x+62, 493), "#686568", 3)
    x = move(t, 0, 1.15, -120, 460)
    if t >= 2.55:
        x = move(t, 2.55, 4, 460, 1080)
    side_car(d, x, 425, 2)
    if 1.03 <= t < 3.2:
        zoom = min(motion(t, 1.03, 1.6), 1 - motion(t, 2.63, 3.2))
        sign_zoom(image, billboard(False, t >= 1.6), zoom, 544, 137, 304)
    if t >= 3.2:
        arrow(d, 807, 447, CREAM, 35)


def top_car(image, x, y, angle, fill=YELLOW):
    sprite = Image.new("RGBA", (108, 108))
    d = ImageDraw.Draw(sprite)
    box(d, (29, 9, 83, 102), "#141416", 19)
    for offset in (20, 74):
        box(d, (offset, 24, offset+12, 43), INK, 4)
        box(d, (offset, 70, offset+12, 89), INK, 4)
    box(d, (25, 7, 83, 99), fill, 18)
    box(d, (32, 27, 76, 48), "#aec9cb", 7)
    box(d, (35, 69, 73, 82), "#656570", 6)
    for offset in (35, 72):
        dot(d, offset, 17, 4, WHITE)
        dot(d, offset, 90, 3, RED)
    sprite = sprite.rotate(angle, Image.Resampling.BICUBIC)
    image.paste(sprite, (round(x-54), round(y-54)), sprite)


def parking_pose(t):
    radius = 74
    straight = 727 - radius - 19
    arc = pi * radius / 2
    entry = 336 - radius - 181
    progress = fraction(t, 9, 16.5)
    # Reduz a velocidade somente na aproximação final, já dentro da vaga.
    braking = max(0, progress - .88)
    distance = (straight + arc + entry) * (progress - braking**2 / .24) / .94
    if distance <= straight:
        return 19 + distance, 336, -90
    if distance <= straight + arc:
        turn = (distance - straight) / radius
        return 727-radius + radius*sin(turn), 336-radius + radius*cos(turn), degrees(turn)-90
    return 727, 336-radius - (distance-straight-arc), 0


def lot(image, d, t):
    box(d, (65, 53, 895, 485), ROAD, 30, "#575359", 4)
    parking(d, 117, 106, 25)
    label(d, 117, 168, "A", 39, CREAM)
    for i, x in enumerate((244, 480, 727), start=1):
        free = i == 3 and t < 17.7
        color = GREEN if free else RED
        box(d, (x-70, 102, x+70, 273), "#233931" if free else "#333337", 13, color, 3)
        label(d, x, 252, f"A0{i}", 17, WHITE)
        box(d, (x-18, 85, x+18, 104), "#8d8993", 5)
        for offset in (-8, 8):
            dot(d, x+offset, 94, 5, INK, CREAM)
        dot(d, x+49, 120, 6, color)
    for x, color in [(244, "#a8a2b4"), (480, "#b88f78")]:
        top_car(image, x, 181, 0, color)
    if t < 16.3:
        line(d, [(712, 182), (723, 194), (744, 171)], GREEN, 6)
    for x in range(159, 696, 76):
        box(d, (x, 407, x+35, 412), "#625e60", 2)
    for i, x in enumerate((294, 437, 580)):
        arrow(d, x, 326, CREAM if int(t*4) % 3 == i else "#757066", 16)
    top_car(image, *parking_pose(t))
    if t >= 16.3:
        for i in range(2):
            p = fraction(t, 16.5+i*.42, 17.8+i*.42)
            if 0 < p < 1:
                d.arc((697, 95, 757, 95+60*p), 15, 165, YELLOW, 3)


def sensor(d, x, y, scan):
    box(d, (x-54, y-30, x+54, y+34), "#8d8993", 15)
    for shift in (-24, 24):
        dot(d, x+shift, y+2, 19, INK, CREAM, 3)
        dot(d, x+shift, y+2, 8, "#5c5961")
    if 0 < scan < 1:
        outgoing = scan <= .5
        reach = 1 - abs(2*scan - 1)
        wave_y = y + 39 + 31*reach
        color = YELLOW if outgoing else "#91c9ff"
        start, end = (15, 165) if outgoing else (195, 345)
        for offset in (0, 7):
            cy = wave_y - offset if outgoing else wave_y + offset
            d.arc((x-24, cy-8, x+24, cy+8), start, end, color, 3)


def board(d, x, y):
    box(d, (x-59, y-57, x+59, y+57), "#406657", 13)
    for i in range(8):
        box(d, (x-64, y-40+i*11, x-53, y-36+i*11), CREAM, 2)
        box(d, (x+53, y-40+i*11, x+64, y-36+i*11), CREAM, 2)
    box(d, (x-39, y-46, x+39, y-22), "#274339", 5)
    line(d, [(x-26, y-30), (x-26, y-40), (x-14, y-40), (x-14, y-30),
             (x-2, y-30), (x-2, y-40), (x+10, y-40)], CREAM, 2)
    box(d, (x-37, y-13, x+37, y+23), INK, 6)
    label(d, x, y+5, "ESP32", 18, WHITE)
    box(d, (x-13, y+37, x+13, y+60), "#a5a4a6", 3)


def monitor(d, x, y, occupied):
    box(d, (x-15, y+30, x+15, y+58), "#65616a", 6)
    box(d, (x-38, y+52, x+38, y+63), "#65616a", 5)
    box(d, (x-67, y-49, x+67, y+37), "#8b858d", 12)
    box(d, (x-59, y-41, x+59, y+29), INK, 7)
    for i in range(3):
        slot = x - 28 + i * 28
        free = i == 2 and not occupied
        box(d, (slot-10, y-15, slot+10, y+11), GREEN if free else RED, 5)
        if free:
            line(d, [(slot-6, y-3), (slot-1, y+2), (slot+6, y-7)], INK, 3)
        else:
            line(d, [(slot-6, y-3), (slot+6, y-3)], INK, 3)


def packet(d, points, progress):
    lengths = [abs(bx-ax) + abs(by-ay) for (ax, ay), (bx, by) in zip(points, points[1:])]
    distance = progress * sum(lengths)
    for (ax, ay), (bx, by), length in zip(points, points[1:], lengths):
        if distance <= length:
            p = distance / length
            dot(d, lerp(ax, bx, p), lerp(ay, by, p), 10, CREAM, INK, 2)
            return
        distance -= length


def transmission(image, d, t):
    for i, x in enumerate((162, 392, 622)):
        start = 19.5 + i*1.65
        sent = t >= start + 1.55
        tint = (YELLOW, "#91c9ff", "#b7e997")[i]
        box(d, (x-87, 43, x+87, 264), "#252527", 17,
            tint if start <= t else "#504b50", 2)
        label(d, x, 56, f"A0{i+1}", 19, WHITE)
        top_car(image, x, 210, 0, ("#a8a2b4", "#b88f78", YELLOW)[i])
        sensor(d, x, 99, fraction(t, start, start+.85))
        channel_x = 448+i*32
        y = 276+i*20
        points = [(x, 264), (x, y), (channel_x, y), (channel_x, 369)]
        line(d, points, INK, 10)
        line(d, points, tint if sent else "#6f686d", 4)
        if start+.85 < t < start+1.55:
            packet(d, points, fraction(t, start+.85, start+1.55))
        dot(d, x+65, 240, 7, RED if sent else "#706a71")
    board(d, 480, 424)
    for i, color in enumerate((YELLOW, "#91c9ff", "#b7e997")):
        dot(d, 448+i*32, 369, 5, color)
    monitor(d, 800, 423, False)
    points = [(545, 424), (729, 424)]
    arrow(d, 638, 424, YELLOW if t >= 26 else "#6c666d", 81)
    if 26 < t < 29.8:
        for delay in (0, .42, .84):
            p = fraction(t, 26+delay, 28.9+delay)
            if 0 < p < 1:
                packet(d, points, p)


def parking_map(image, t, directory):
    source = reference(directory, "mapa", t >= 32)
    zoom = motion(t, 30.65, 31.8)
    if 31.65 < t < 33.5:
        source = source.copy()
        padding = move(t, 31.65, 33.5, 3, 10)
        box(ImageDraw.Draw(source), (619-padding, 379-padding, 753+padding, 428+padding),
            None, 9, "#a88a00", 3)
    crop = (round(lerp(0, 143, zoom)), round(lerp(0, 161, zoom)), 840, 472)
    source = source.crop(crop)
    width = round(lerp(840, 902, zoom))
    height = round(lerp(472, 403, zoom))
    image.paste(source.resize((width, height), Image.Resampling.LANCZOS),
                ((WIDTH-width)//2, (HEIGHT-height)//2))


def frame(t, directory):
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    d = ImageDraw.Draw(image)
    if 6.5 <= t < 10.5:
        floor_arrival(image, d, t - 6.5, directory)
        return image
    if t >= 10.5:
        t -= 4
    # Mantém a ordem dos eventos e ajusta a duração de cada cena.
    start = 0
    for end, original_start, original_end in (
        (6.5, 0, 9), (12.5, 9, 19), (20, 19, 30), (23.5, 30, 35), (27, 35, 40),
    ):
        if t < end:
            t = lerp(original_start, original_end, fraction(t, start, end))
            break
        start = end
    if t < 9:
        arrival(image, d, t, directory)
    elif t < 19:
        lot(image, d, t)
    elif t < 30:
        transmission(image, d, t)
    elif t < 35:
        parking_map(image, t, directory)
    else:
        occupied = t >= 36
        highlight = occupied and t < 37.5
        image.paste(billboard(occupied, highlight), (60, 34))
    return image


def render(output):
    output.mkdir(parents=True, exist_ok=True)
    for occupied in (False, True):
        reference(output, "mapa", occupied)
    ffmpeg = get_ffmpeg_exe()
    video = output / "vaggu-do-shopping-ao-telao.mp4"
    command = [
        ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo",
        "-pixel_format", "rgb24", "-video_size", f"{WIDTH}x{HEIGHT}", "-framerate",
        str(FPS), "-i", "-", "-vf", "scale=1920:1080:flags=lanczos",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-an", "-sn",
        "-movflags", "+faststart", str(video),
    ]
    with subprocess.Popen(command, stdin=subprocess.PIPE) as process:
        assert process.stdin is not None
        for index in range(DURATION * FPS):
            process.stdin.write(frame(index / FPS, output).tobytes())
        process.stdin.close()
        if process.wait():
            raise RuntimeError("Falha ao codificar o vídeo.")

    for name, t in FRAMES.items():
        subprocess.run([
            ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-ss", str(t),
            "-i", str(video), "-frames:v", "1", str(output / f"{name}.png"),
        ], check=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destino", type=Path)
    render(parser.parse_args().destino)
