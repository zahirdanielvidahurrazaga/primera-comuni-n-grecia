#!/usr/bin/env python3
"""
Genera el ícono de la app (public/icon.png) con la estética de la invitación:
marfil, inicial caligráfica en rosa palo y un aro delgado de plata.

    python3 scripts/make-icon.py
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

SIZE       = 512
MARFIL     = (247, 242, 234)
ROSA_PALO  = (140, 111, 99)
PLATA      = (165, 162, 156)
INICIAL    = "G"
FUENTE     = "/System/Library/Fonts/SnellRoundhand.ttc"   # caligráfica de macOS

out = Path(__file__).resolve().parent.parent / "public" / "icon.png"
out.parent.mkdir(parents=True, exist_ok=True)

img = Image.new("RGB", (SIZE, SIZE), MARFIL)
d = ImageDraw.Draw(img)

# Aro de plata
m = 34
d.ellipse([m, m, SIZE - m, SIZE - m], outline=PLATA + (0,), width=3)

# Inicial caligráfica, centrada ópticamente por su caja real
font = ImageFont.truetype(FUENTE, 300, index=2)   # index 2 = Bold/Black del .ttc
box = d.textbbox((0, 0), INICIAL, font=font)
w, h = box[2] - box[0], box[3] - box[1]
d.text((SIZE / 2 - w / 2 - box[0], SIZE / 2 - h / 2 - box[1] - 6),
       INICIAL, font=font, fill=ROSA_PALO)

# Crucecita bajo la inicial
cx, cy, alto, brazo = SIZE // 2, int(SIZE * 0.845), 30, 20
d.line([cx, cy - alto // 2, cx, cy + alto // 2], fill=PLATA, width=3)
d.line([cx - brazo // 2, cy - alto // 6, cx + brazo // 2, cy - alto // 6], fill=PLATA, width=3)

img.save(out, "PNG")
print(f"✅ {out}  ({out.stat().st_size // 1024} KB)")
