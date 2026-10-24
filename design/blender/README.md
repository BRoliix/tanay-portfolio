# Blender assets

Each asset has its own folder holding its own `.blend` file and its own renders.
All models are original (no third-party or game assets). Colours match the site:
`#034694` Chelsea blue, `#22c55e` terminal green, white, graphite.
Blender 5.2, Cycles (Metal GPU).

| Folder | Blender file | Renders | Used on the site as |
|---|---|---|---|
| `loader-mark/` | `loader-mark.blend` | `renders/001.png` – `042.png` — voxel "TM" loop: streams in, assembles, screen-tears, smears out | `public/wd2/mark-strip.webp` → boot screen DECRYPT.EXE window (`app/components/wd2/BootLoader.tsx`) |
| `stack-matrix-matcaps/` | `stack-matrix-matcaps.blend` | `renders/white.png`, `blue.png`, `graphite.png`, `green.png` — lit with the same rig as the loader mark | `public/wd2/matcap-*.webp` → STACK_MATRIX three.js section (`app/components/wd2/stackScene.ts`) |

## Re-rendering

- **loader-mark:** open `loader-mark.blend` → Render › Render Animation (writes `renders/001-042.png`).
- **stack-matrix-matcaps:** open `stack-matrix-matcaps.blend` → Text Editor › `render_matcaps.py` › Run Script.

Then, from the repo root: `python3 design/blender/pack_sprites.py` (needs Pillow) to rebuild the files in `public/wd2/`.

## Adding a new asset

Make a new folder `design/blender/<asset-name>/` with `<asset-name>.blend`, set its render output to `//renders/`, and add a step for it in `pack_sprites.py`.
