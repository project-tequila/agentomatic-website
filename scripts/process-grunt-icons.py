"""Process grunt schedule/conversations icons: white stroke outlines, transparent fills."""
from __future__ import annotations

from collections.abc import Iterable
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
GRUNT = ROOT / "public" / "story" / "grunt"

# Pixels brighter than this (on white GIF matte) become fully transparent.
WHITE_MATTE_LUM = 245
# Dark line art becomes white outline strokes.
STROKE_LUM_MAX = 120
# Preserve teal/cyan accent fills from Flaticon palette.
TEAL_MAX_R = 90


def lum(r: int, g: int, b: int) -> float:
    return 0.299 * r + 0.587 * g + 0.114 * b


def is_teal(r: int, g: int, b: int) -> bool:
    # Bright Flaticon cyan (51, 204, 204) and darker handset teal (0, 150, 136).
    if r > TEAL_MAX_R:
        return False
    if g < 120 or b < 100:
        return False
    if g <= r + 40 or b <= r + 40:
        return False
    return abs(g - b) / max(g, b) < 0.35


def is_stroke(r: int, g: int, b: int) -> bool:
    return lum(r, g, b) <= STROKE_LUM_MAX and not is_teal(r, g, b)


def is_matte(r: int, g: int, b: int) -> bool:
    return lum(r, g, b) >= WHITE_MATTE_LUM


def process_frame(img: Image.Image) -> Image.Image:
    src = img.convert("RGBA")
    w, h = src.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sp = src.load()
    op = out.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = sp[x, y]
            if a < 8 or is_matte(r, g, b):
                continue
            if is_teal(r, g, b):
                op[x, y] = (r, g, b, 255)
            elif is_stroke(r, g, b):
                op[x, y] = (245, 242, 235, 255)
            # All other pixels (mid-gray fills, anti-aliased edges) → transparent.

    return out


def dilate_strokes(img: Image.Image, radius: int = 1) -> Image.Image:
    """Slightly thicken white strokes for legibility on dark UI."""
    r, g, b, a = img.split()
    stroke_mask = Image.new("L", img.size, 0)
    sp = img.load()
    mp = stroke_mask.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            pr, pg, pb, pa = sp[x, y]
            if pa > 200 and pr > 200 and pg > 200 and pb > 200:
                mp[x, y] = 255

    expanded = stroke_mask.filter(ImageFilter.MaxFilter(radius * 2 + 1))
    base = img.copy()
    bp = base.load()
    ep = expanded.load()
    for y in range(h):
        for x in range(w):
            if ep[x, y] > 0 and bp[x, y][3] < 200:
                bp[x, y] = (245, 242, 235, 255)
    return base


def save_png(png_path: Path) -> None:
    """Process a still PNG in place (e.g. call-routing handset icon)."""
    img = Image.open(png_path)
    frame = process_frame(img)
    frame = dilate_strokes(frame)
    frame.save(png_path, "PNG")
    print(f"wrote {png_path.name}")
    analyze(png_path)


def save_still(gif_path: Path, webp_path: Path) -> None:
    gif = Image.open(gif_path)
    gif.seek(0)
    frame = process_frame(gif)
    frame = dilate_strokes(frame)
    frame.save(webp_path, "WEBP", lossless=True)
    print(f"wrote {webp_path.name}")


def save_animated_gif(gif_path: Path, out_path: Path) -> None:
    gif = Image.open(gif_path)
    frames: list[Image.Image] = []
    durations: list[int] = []
    try:
        while True:
            frame = process_frame(gif.copy().convert("RGBA"))
            frame = dilate_strokes(frame)
            frames.append(frame)
            durations.append(gif.info.get("duration", 80))
            gif.seek(gif.tell() + 1)
    except EOFError:
        pass

    if not frames:
        raise RuntimeError(f"No frames in {gif_path}")

    frames[0].save(
        out_path,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        disposal=2,
        transparency=0,
        optimize=False,
    )
    print(f"wrote {out_path.name} ({len(frames)} frames)")


def analyze(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    total = w * h
    counts = {"transparent": 0, "white_stroke": 0, "teal": 0, "other": 0}
    sp = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = sp[x, y]
            if a < 10:
                counts["transparent"] += 1
            elif is_teal(r, g, b):
                counts["teal"] += 1
            elif r > 200 and g > 200 and b > 200:
                counts["white_stroke"] += 1
            else:
                counts["other"] += 1
    print(f"{path.name}: " + ", ".join(f"{k}={v/total*100:.1f}%" for k, v in counts.items()))


def main() -> None:
    save_png(GRUNT / "call-routing.png")

    pairs: Iterable[tuple[str, str]] = (
        ("scheduling.gif", "scheduling"),
        ("conversations.gif", "conversations"),
    )
    for gif_name, stem in pairs:
        gif_path = GRUNT / gif_name
        save_still(gif_path, GRUNT / f"{stem}.webp")
        save_animated_gif(gif_path, GRUNT / f"{stem}.gif")
        analyze(GRUNT / f"{stem}.webp")


if __name__ == "__main__":
    main()
