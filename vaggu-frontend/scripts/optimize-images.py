"""Generate lossless WebP assets (requires Pillow); verify decoded RGBA pixels."""
import base64
import io
import re
from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parents[1] / "public" / "assets"


def compress(source):
    original = Image.open(io.BytesIO(source))
    output = io.BytesIO()
    original.save(output, format="WEBP", lossless=True, exact=True, method=6,
                  **{key: original.info[key] for key in ("icc_profile", "exif") if key in original.info})
    encoded = output.getvalue()
    decoded = Image.open(io.BytesIO(encoded))
    assert original.size == decoded.size
    assert original.convert("RGBA").tobytes() == decoded.convert("RGBA").tobytes()
    return encoded


for path in ASSETS.glob("*.png"):
    source = path.read_bytes()
    encoded = compress(source)
    if len(encoded) < len(source):
        path.with_suffix(".webp").write_bytes(encoded)
        print(f"{path.name}: {len(source):,} -> {len(encoded):,} bytes; identical pixels")

# Keep the notebook's vector geometry, replacing only its embedded raster image.
path = ASSETS / "mockup-laptop-vaggu.svg"
source = path.read_text(encoding="utf-8")


def replace_image(match):
    original = base64.b64decode(match[1])
    encoded = compress(original)
    if len(encoded) >= len(original):
        return match[0]
    return "data:image/webp;base64," + base64.b64encode(encoded).decode("ascii")


optimized = re.sub(r'data:image/png;base64,([^"\s]+)', replace_image, source)
if optimized != source:
    path.with_name("mockup-laptop-vaggu-optimized.svg").write_text(optimized, encoding="utf-8")
    print(f"{path.name}: {len(source):,} -> {len(optimized):,} bytes; identical embedded pixels")
