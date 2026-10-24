"use client";

import { useEffect, useRef, useState } from "react";
import { createPoster, STRIP_COUNT } from "./poster";

// Plays on every full page load; the root layout stays mounted across client
// navigations, so it doesn't replay there.

declare global {
  interface Window { __wdBooted?: boolean }
}

export const BOOT_EVENT = "wd:booted";

const MARK = "/wd2/mark-strip.webp";
const ART = "/hero-pixel.webp";
const MIN_MS = 2200;
const MAX_MS = 7000;
const SEGMENTS = 20;

const LOG = [
  { at: 0, text: "establishing uplink" },
  { at: 18, text: "routing through stamford bridge node" },
  { at: 38, text: "decrypting dossier [TANAY_MATTA]" },
  { at: 58, text: "mounting active_missions" },
  { at: 78, text: "waking tanya_bot" },
  { at: 96, text: "access granted" },
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const clockText = () => new Date().toTimeString().slice(0, 8);

export default function BootLoader() {
  const [phase, setPhase] = useState<"boot" | "exit" | "done">("boot");
  const [filled, setFilled] = useState(0);
  const [step, setStep] = useState(0);
  const [markReady, setMarkReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  // The percentage and clock change every frame/second, so they're written to
  // the DOM directly; React only re-renders when a segment or log line changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduce ? 600 : MIN_MS;
    const start = performance.now();
    const poster = createPoster(canvas);
    const jolt = new Array<number>(STRIP_COUNT).fill(0);
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
    };

    let sig = "";
    const redraw = () => { sig = ""; };

    const art = loadImage(ART);
    const tasks: Promise<unknown>[] = [
      document.fonts.ready,
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener("load", r, { once: true })),
      loadImage(MARK).then((img) => { if (img) setMarkReady(true); }),
      art,
    ];
    let loaded = 0;
    tasks.forEach((t) => t.then(() => { loaded += 1; }));
    art.then((img) => { if (img) { poster.setArt(img); redraw(); } });
    document.fonts.ready.then(redraw);

    const onResize = () => { poster.resize(); redraw(); };
    window.addEventListener("resize", onResize);

    const tickClock = () => { if (clockRef.current) clockRef.current.textContent = clockText(); };
    tickClock();
    const clock = setInterval(tickClock, 1000);

    let raf = 0;
    const stop = () => {
      cancelAnimationFrame(raf);
      clearInterval(clock);
      timers.forEach(clearTimeout);
      timers.clear();
      window.removeEventListener("resize", onResize);
    };

    const finish = () => {
      stop();
      setPhase("done");
      root.classList.remove("wd-booting");
      root.classList.add("wd-booted");
      window.__wdBooted = true;
      window.dispatchEvent(new Event(BOOT_EVENT));
    };

    let shown = 0;
    let exitAt: number | null = null;

    const progress = (now: number) => {
      const elapsed = now - start;
      const target = elapsed > MAX_MS ? 1 : Math.min(loaded / tasks.length, elapsed / minMs, 1);
      if (target * 100 <= shown) return;
      shown = Math.min(100, shown + Math.max(1, Math.round((target * 100 - shown) * 0.16)));
      if (pctRef.current) pctRef.current.textContent = String(shown).padStart(3, "0");
      setFilled(Math.floor((shown / 100) * SEGMENTS));
      let s = LOG.length - 1;
      while (LOG[s].at > shown) s--;
      setStep(s);
      if (shown === 100) {
        // hold a beat on 100% with OK pressed, then rip it away
        later(() => {
          exitAt = performance.now();
          setPhase("exit");
          later(finish, reduce ? 150 : 1000);
        }, reduce ? 0 : 260);
      }
    };

    const frame = (now: number) => {
      if (shown < 100) progress(now);
      const W = window.innerWidth;
      const offs = poster.dirs.map((d, i) => {
        let o = 0;
        if (!reduce) {
          const pin = Math.floor(clamp01((now - start - i * 85) / 460) * 5) / 5; // steps(5)
          o = d * -1.35 * W * (1 - pin);
          if (exitAt !== null) {
            const pout = Math.floor(clamp01((now - exitAt - 140 - i * 55) / 560) * 6) / 6; // steps(6)
            o += d * 1.35 * W * pout;
          }
        }
        return Math.round(o + jolt[i]);
      });
      const next = offs.join(",");
      if (next !== sig) { poster.render(offs); sig = next; }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const doJolt = () => {
      if (exitAt !== null) return;
      if (!document.hidden) {
        const a = Math.floor(Math.random() * STRIP_COUNT);
        const b = Math.floor(Math.random() * STRIP_COUNT);
        const dx = (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 14);
        jolt[a] = dx; jolt[b] = -dx * 0.5;
        later(() => { jolt[a] = 0; jolt[b] = 0; }, 70 + Math.random() * 60);
      }
      later(doJolt, 380 + Math.random() * 700);
    };
    if (!reduce) later(doJolt, 1000);

    return stop;
  }, []);

  if (phase === "done") return null;

  const complete = filled === SEGMENTS;

  return (
    <div
      id="wd-boot"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${(filled * 100) / SEGMENTS}%`}
      style={{ position: "fixed", inset: 0, zIndex: 10000, color: "#fff", background: "#000" }}
    >
      <canvas ref={canvasRef} aria-hidden />

      <div className="wd-ui top-0 inset-x-0 flex items-start justify-between px-3 md:px-6 pt-3 md:pt-5 font-[family-name:var(--font-code)] text-[10px] md:text-xs tracking-[1.6px] uppercase">
        <span className="bg-black text-white px-2 py-1 font-bold border border-white">TANAY_OS <span className="text-[#22c55e]">v1.0</span></span>
        <span ref={clockRef} className="bg-black text-white px-2 py-1 tabular-nums border border-white" suppressHydrationWarning>--:--:--</span>
      </div>

      <div className="wd-ui wd-win wd-win--decrypt">
        <div className="wd-win__bar">
          <span>decrypt.exe</span>
          <span className="wd-win__btns"><i /><i /><i /></span>
        </div>
        <div className="wd-win__body bg-black">
          <div className={`wd-mark ${markReady ? "is-ready" : ""}`} />
          <div className="flex items-center justify-between px-3 pb-2 font-[family-name:var(--font-code)] text-[10px] tracking-[2px] uppercase">
            <span className="text-[#737373]">ai_engineer // agent_os</span>
            <span className="text-[#22c55e]">cfc</span>
          </div>
        </div>
      </div>

      <div className="wd-ui wd-win wd-win--dialog">
        <div className="wd-win__bar">
          <span>tanay_os takeover</span>
          <span className="wd-win__btns"><i /></span>
        </div>
        <div className="wd-win__body wd-win__body--grey">
          <div className="flex gap-3 md:gap-4 items-start">
            <span className="wd-info" aria-hidden>i</span>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-[family-name:var(--font-display)] font-bold text-black text-sm md:text-base uppercase leading-tight">
                Tales of code &amp; agents
              </span>
              <span className="font-[family-name:var(--font-code)] text-[#1a1c1c] text-[10px] md:text-[11px] uppercase tracking-[0.5px] truncate">
                &gt; {LOG[step].text}{complete ? " ..... ok" : <span className="wd-caret">_</span>}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="wd-sunken flex-1 flex gap-[2px] p-[3px] h-5">
              {Array.from({ length: SEGMENTS }, (_, i) => (
                <span key={i} className="flex-1" style={{ background: i < filled ? "#034694" : "transparent" }} />
              ))}
            </div>
            <span ref={pctRef} className="font-[family-name:var(--font-code)] font-bold text-black text-xs tabular-nums w-[4ch] text-right">000</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="font-[family-name:var(--font-code)] text-[10px] text-[#525252] uppercase tracking-[1.5px]">KTBFFH</span>
            <span className={`wd-btn ${complete ? "is-pressed" : ""}`}>OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
