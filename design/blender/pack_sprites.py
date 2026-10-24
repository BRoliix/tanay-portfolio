"""Pack each Blender asset's renders into web-ready files in public/wd2.

Every asset lives in its own folder with its own .blend and renders:
    design/blender/loader-mark/           loader-mark.blend          + renders/001-042.png
    design/blender/stack-matrix-matcaps/  stack-matrix-matcaps.blend + renders/{white,blue,graphite,green}.png

Run from the repo root (needs Pillow):
    python3 design/blender/pack_sprites.py
"""
from PIL import Image
import glob

B, O = 'design/blender', 'public/wd2'


def union_bbox(frames):
    bb = None
    for f in frames:
        b = f.getchannel('A').point(lambda a: 255 if a > 6 else 0).getbbox()
        if b is None:
            continue
        bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
    return bb


def on_black(f):
    bg = Image.new('RGBA', f.size, (0, 0, 0, 255)); bg.alpha_composite(f); return bg.convert('RGB')


def sheet(frames, w, cols):
    h = round(frames[0].height * w / frames[0].width)
    rows = -(-len(frames) // cols)
    s = Image.new('RGB', (w * cols, h * rows))
    for i, f in enumerate(frames):
        s.paste(f.resize((w, h), Image.LANCZOS), ((i % cols) * w, (i // cols) * h))
    return s, w, h


# 1. loader-mark → mark-strip.webp (42 frames, one row; composited on black and
#    shown with mix-blend-mode: screen — ~5x lighter than alpha WebP)
fr = [Image.open(p).convert('RGBA') for p in sorted(glob.glob(f'{B}/loader-mark/renders/*.png'))]
bb = union_bbox(fr); fr = [on_black(f.crop(bb)) for f in fr]
s, w, h = sheet(fr, 380, len(fr)); s.save(f'{O}/mark-strip.webp', quality=80, method=6)
print('mark-strip', len(fr), 'frames', w, 'x', h, s.size)

# 2. stack-matrix-matcaps → matcap-*.webp (three.js MeshMatcapMaterial)
for key in ('white', 'blue', 'graphite', 'green'):
    Image.open(f'{B}/stack-matrix-matcaps/renders/{key}.png').convert('RGB').save(f'{O}/matcap-{key}.webp', quality=88)
    print('matcap', key)

# 3. light copy of the hero art for the pixel canvas + boot-screen poster
im = Image.open('public/hero.png').convert('RGB')
im.resize((960, round(im.height * 960 / im.width)), Image.LANCZOS).save('public/hero-pixel.webp', quality=82, method=6)
print('hero-pixel', im.size)
