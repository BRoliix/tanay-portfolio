// Torn-poster strips for the boot screen. One canvas rather than a stack of
// full-screen clip-path layers: a single composited layer renders the same on
// Safari, Chrome and high-DPI screens.

type Pt = [number, number];
type Kind = "desk" | "tiles" | "dots" | "crest" | "paper";

const LEAN = 24; // % of width the tears drift left from top to bottom
const STRIPS: { kind: Kind; dir: 1 | -1 }[] = [
  { kind: "desk", dir: -1 },
  { kind: "tiles", dir: 1 },
  { kind: "dots", dir: -1 },
  { kind: "tiles", dir: 1 },
  { kind: "crest", dir: -1 },
  { kind: "paper", dir: 1 },
];
export const STRIP_COUNT = STRIPS.length;
const TOPS_DESKTOP = [-40, 12, 27, 47, 58, 94, 160];
const TOPS_MOBILE = [-60, 8, 22, 34, 44, 100, 200];

const CODE = [
  "$ ./takeover --target=tanay",
  "[*] payload: agent_core.py",
  "[*] langgraph.compile ... ok",
  "[+] pinecone :: linked",
  "[+] cfc.crest :: verified",
  "[*] tanya_bot pid 1905",
  "[!] blue flag: flying high",
  "$ _",
];

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function tearLine(top: number, seed: number): Pt[] {
  const r = rng(seed);
  const pts: Pt[] = [];
  for (let y = -4; y <= 104; y += 2.25) {
    let x = top - (LEAN * y) / 100 + (r() - 0.5) * 0.7;
    if (r() < 0.14) x += (r() - 0.5) * 3.2;
    pts.push([x, y]);
  }
  return pts;
}
function rimWidths(n: number, seed: number) {
  const r = rng(seed);
  return Array.from({ length: n }, () => 0.3 + r() * 1.2);
}
const GEOMETRY = {
  desktop: TOPS_DESKTOP.map((t, i) => tearLine(t, 101 + i * 17)),
  mobile: TOPS_MOBILE.map((t, i) => tearLine(t, 301 + i * 13)),
};
const RIMS = Array.from({ length: 7 }, (_, i) => rimWidths(60, 900 + i));

function dotPattern(ctx: CanvasRenderingContext2D, size: number, r: number, color: string, dpr: number) {
  const c = document.createElement("canvas");
  c.width = c.height = Math.round(size * dpr);
  const g = c.getContext("2d")!;
  g.fillStyle = color;
  g.beginPath();
  g.arc(c.width / 2, c.height / 2, r * dpr, 0, Math.PI * 2);
  g.fill();
  return ctx.createPattern(c, "repeat")!;
}

function greyscale(img: HTMLImageElement) {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext("2d")!;
  g.drawImage(img, 0, 0);
  try {
    const d = g.getImageData(0, 0, c.width, c.height);
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      let v = 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2];
      v = Math.max(0, Math.min(255, (v - 128) * 1.55 + 128 + 18));
      p[i] = p[i + 1] = p[i + 2] = v;
    }
    g.putImageData(d, 0, 0);
  } catch { /* tainted canvas: fall back to colour */ }
  return c;
}

export function createPoster(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  let art: HTMLImageElement | null = null;
  let artGrey: HTMLCanvasElement | null = null;
  let W = 0, H = 0, dpr = 1;
  let patDark: CanvasPattern, patGrey: CanvasPattern;
  const rootStyle = getComputedStyle(document.documentElement);
  const fam = (v: string, fb: string) => rootStyle.getPropertyValue(v).trim() || fb;
  const DISPLAY = fam("--font-space-grotesk", "Arial, sans-serif");
  const CODEF = fam("--font-jetbrains-mono", "monospace");

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    patDark = dotPattern(ctx, 7, 1.5, "#000", dpr);
    patGrey = dotPattern(ctx, 6, 1.1, "#262626", dpr);
  }

  const px = (pt: Pt): Pt => [(pt[0] / 100) * W * dpr, (pt[1] / 100) * H * dpr];

  function bandPath(a: Pt[], b: Pt[]) {
    ctx.beginPath();
    a.forEach((p, i) => { const [x, y] = px(p); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
    [...b].reverse().forEach((p) => { const [x, y] = px(p); ctx.lineTo(x, y); });
    ctx.closePath();
  }
  function rimPath(line: Pt[], widths: number[]) {
    ctx.beginPath();
    line.forEach((p, i) => { const [x, y] = px(p); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
    [...line].map((p, i) => [p[0] + widths[i % widths.length], p[1]] as Pt).reverse()
      .forEach((p) => { const [x, y] = px(p); ctx.lineTo(x, y); });
    ctx.closePath();
  }

  function drawContent(kind: Kind, mobile: boolean) {
    const w = W * dpr, h = H * dpr;
    if (kind === "dots") {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = patGrey; ctx.fillRect(0, 0, w, h);
      return;
    }
    if (kind === "desk") {
      ctx.fillStyle = "#d9d9d9"; ctx.fillRect(0, 0, w, h);
      if (artGrey) ctx.drawImage(artGrey, 0, 0, h * 1.791, h);
      ctx.globalAlpha = 0.32; ctx.fillStyle = patDark; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1;
      return;
    }
    if (kind === "crest") {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = patGrey; ctx.fillRect(0, 0, w, h);
      if (art) {
        // crest (≈84% across, 45% down the art) centred in its strip
        const ah = mobile ? h * 0.5 : h, aw = ah * 1.791;
        const ax = mobile ? 0.6 * w - 0.84 * aw : 0.64 * w - 0.84 * aw;
        const ay = mobile ? 0.275 * h : 0;
        ctx.fillStyle = "#f4f4f1";
        const o = 5 * dpr;
        ctx.fillRect(ax - o, ay - o, aw + 2 * o, ah + 2 * o);
        ctx.drawImage(art, ax, ay, aw, ah);
      }
      return;
    }
    if (kind === "tiles") {
      ctx.fillStyle = "#034694"; ctx.fillRect(0, 0, w, h);
      const tw = 104 * dpr, th = 50 * dpr, fs = 21 * dpr;
      ctx.font = `700 ${fs}px ${DISPLAY}`;
      ctx.textBaseline = "top";
      let i = 0;
      for (let y = -24 * dpr; y < h; y += th) {
        for (let x = -24 * dpr; x < w; x += tw, i++) {
          ctx.fillStyle = i % 6 === 2 ? "#fff" : "#000";
          if (i % 7 === 3) {
            ctx.save();
            ctx.beginPath(); ctx.rect(x - 10 * dpr, y, tw, fs * 0.5); ctx.clip();
            ctx.fillText("TANAY", x - 6 * dpr, y);
            ctx.restore();
            ctx.fillText("MATTA", x + 12 * dpr, y + fs * 0.88);
          } else {
            ctx.fillText("TANAY", x, y);
            ctx.fillText("MATTA", x + 7 * dpr, y + fs * 0.88);
          }
        }
      }
      return;
    }
    // paper
    ctx.fillStyle = "#e9e9e6"; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.12; ctx.fillStyle = patDark; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1;
    if (mobile) return;
    const right = w - 0.025 * W * dpr;
    ctx.fillStyle = "#111";
    ctx.font = `400 ${10.5 * dpr}px ${CODEF}`;
    ctx.textBaseline = "top";
    const codeW = Math.max(...CODE.map((l) => ctx.measureText(l).width));
    CODE.forEach((l, k) => ctx.fillText(l, right - codeW, 0.58 * h + k * 17 * dpr));
    // poster stack, bottom-right, right-aligned
    ctx.textAlign = "right"; ctx.textBaseline = "alphabetic";
    let y = h - 0.05 * H * dpr;
    ctx.font = `700 ${30 * dpr}px ${DISPLAY}`;
    const bw = ctx.measureText("ONLINE").width + 16 * dpr, bh = 34 * dpr;
    ctx.fillStyle = "#000"; ctx.fillRect(right - bw - 4 * dpr, y - bh - 4 * dpr, bw + 8 * dpr, bh + 8 * dpr);
    ctx.fillStyle = "#fff"; ctx.fillRect(right - bw, y - bh, bw, bh);
    ctx.fillStyle = "#000"; ctx.fillText("ONLINE", right - 8 * dpr, y - 6 * dpr);
    y -= bh + 12 * dpr;
    ctx.font = `700 ${22 * dpr}px ${DISPLAY}`; ctx.fillText("ARE", right, y); y -= 22 * dpr;
    ctx.font = `700 ${64 * dpr}px ${DISPLAY}`; ctx.fillStyle = "#034694"; ctx.fillText("BLUES", right, y); y -= 58 * dpr;
    ctx.font = `700 ${22 * dpr}px ${DISPLAY}`; ctx.fillStyle = "#000"; ctx.fillText("THE", right, y);
    ctx.textAlign = "left";
  }

  // offsets: horizontal shift per strip, in CSS px
  function render(offsets: number[]) {
    const mobile = W < 768;
    const lines = mobile ? GEOMETRY.mobile : GEOMETRY.desktop;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    STRIPS.forEach((s, i) => {
      const off = offsets[i];
      if (Math.abs(off) > W * 1.3) return;
      ctx.save();
      ctx.translate(off * dpr, 0);
      ctx.save();
      bandPath(lines[i], lines[i + 1]);
      ctx.clip();
      drawContent(s.kind, mobile);
      ctx.restore();
      if (i > 0) { rimPath(lines[i], RIMS[i]); ctx.fillStyle = "#f4f4f1"; ctx.fill(); }
      ctx.restore();
    });
  }

  function setArt(img: HTMLImageElement) {
    art = img;
    artGrey = greyscale(img);
  }

  resize();
  return { resize, render, setArt, dirs: STRIPS.map((s) => s.dir) };
}
