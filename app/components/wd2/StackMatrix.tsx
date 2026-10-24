"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";
import type { SceneApi } from "./stackScene";

// Voxel tower per skill group, one slab per tool. Safe to render from a Server
// Component page: three.js and the matcaps are only fetched once the section
// nears the viewport, and the panels hold their size until the scene is up.

const LABELS: Record<string, string> = {
  languages: "Languages",
  aiml: "AI / ML",
  backend: "Backend",
  data: "Data",
  devops: "DevOps",
  analytics: "Analytics",
};

const GROUPS = Object.entries(siteConfig.skills).map(([key, tools]) => ({
  key,
  label: LABELS[key] ?? key,
  tools,
  count: tools.length,
}));
const DEFAULT = Math.max(0, GROUPS.findIndex((g) => g.key === "aiml"));
const pad = (n: number) => String(n).padStart(2, "0");

export default function StackMatrix() {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SceneApi | null>(null);
  const [selected, setSelected] = useState(DEFAULT);
  const [hovered, setHovered] = useState<number | null>(null);
  // Tag positions change with the camera, so they're written to the DOM
  // directly instead of through React state.
  const labelEls = useRef<(HTMLButtonElement | null)[]>([]);
  const labelPts = useRef<{ x: number; y: number }[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "live" | "fallback">("idle");
  const [narrow, setNarrow] = useState(false); // small panels: only tag the selected tower

  const placeLabel = (i: number, el: HTMLButtonElement | null) => {
    labelEls.current[i] = el;
    const p = labelPts.current[i];
    if (!el) return;
    el.style.visibility = p ? "" : "hidden";
    if (p) { el.style.left = `${p.x}px`; el.style.top = `${p.y}px`; }
  };

  useEffect(() => {
    const host = hostRef.current!;
    let disposed = false;
    let mod: Promise<typeof import("./stackScene")> | null = null;
    const load = () => (mod ??= import("./stackScene"));

    // start fetching three.js before the section scrolls in
    const pre = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { load(); pre.disconnect(); }
    }, { rootMargin: "800px 0px" });
    pre.observe(host);

    const vis = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !apiRef.current) {
        setStatus("loading");
        load().then(({ createStackScene }) => {
          if (disposed || apiRef.current) return;
          apiRef.current = createStackScene(host, GROUPS, {
            reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            selected: DEFAULT,
            onPick: setSelected,
            onHover: setHovered,
            onLabels: (pts) => {
              labelPts.current = pts;
              labelEls.current.forEach((el, i) => placeLabel(i, el));
            },
          });
          setStatus("live");
        }).catch(() => {
          if (!disposed) setStatus("fallback"); // no WebGL or chunk failed; the tabs still work
        });
      }
      apiRef.current?.setVisible(e.isIntersecting);
    }, { threshold: 0.25 });
    vis.observe(host);

    const ro = new ResizeObserver(() => { apiRef.current?.resize(); setNarrow(host.clientWidth < 620); });
    ro.observe(host);

    return () => {
      disposed = true;
      pre.disconnect(); vis.disconnect(); ro.disconnect();
      apiRef.current?.dispose(); apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.select(selected);
  }, [selected]);

  const g = GROUPS[selected];

  return (
    <section className="bg-[#f9f9f9] px-4 md:px-6 pb-16 md:pb-24 relative z-20" aria-labelledby="stack-matrix-title">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-10 md:gap-16">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-0">
          <div className="flex flex-col gap-4 md:gap-6 max-w-[576px]">
            <h2 id="stack-matrix-title" className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-[40px] md:text-[56px] lg:text-[72px] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-3.6px] uppercase leading-[1]">
              Stack_Matrix
            </h2>
            <p className="font-sans font-medium text-[#5e5e5e] text-base md:text-lg leading-7">
              Every block is a tool in Tanay&apos;s stack.<br />
              Select a tower to inspect the group.
            </p>
          </div>
          <span className="font-mono font-bold text-[#1a1c1c] text-sm tracking-[1.4px] uppercase border-b-[4px] border-black pb-3 px-4 w-fit">
            {GROUPS.reduce((n, x) => n + x.count, 0)} tools · {GROUPS.length} groups
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <div className="md:col-span-8 relative bg-black border-[6px] border-black shadow-[8px_8px_0px_0px_black] h-[250px] sm:h-[380px] md:h-[460px] overflow-hidden">
            <div ref={hostRef} className="absolute inset-0 touch-pan-y" aria-hidden />

            {status === "live" && GROUPS.map((x, i) => (narrow && i !== selected && i !== hovered) ? null : (
              <button
                key={x.key}
                ref={(el) => placeLabel(i, el)}
                type="button"
                tabIndex={-1}
                onClick={() => setSelected(i)}
                className={`absolute -translate-x-1/2 -translate-y-full px-1.5 py-0.5 font-[family-name:var(--font-code)] text-[9px] md:text-[10px] tracking-[1px] uppercase whitespace-nowrap border ${
                  i === selected
                    ? "bg-[#034694] text-white border-[#034694]"
                    : i === hovered
                    ? "bg-white text-black border-white"
                    : "bg-black text-[#a3a3a3] border-[#262626]"
                }`}
              >
                {x.label} [{pad(x.count)}]
              </button>
            ))}

            <span className="absolute bottom-3 md:bottom-auto md:top-3 left-3 bg-black text-white font-[family-name:var(--font-code)] text-[10px] tracking-[1.6px] uppercase px-2 py-1 border border-[#262626]">
              stack_matrix.exe
            </span>
            {status !== "live" && (
              <span className="absolute inset-0 grid place-items-center font-[family-name:var(--font-code)] text-[11px] tracking-[2px] uppercase text-[#525252]">
                {status === "fallback" ? "3d view unavailable — use the tabs" : "loading_matrix..."}
              </span>
            )}
          </div>

          <div className="md:col-span-4 bg-[#e8e8e8] border-[6px] border-black shadow-[8px_8px_0px_0px_black] p-6 md:p-8 flex flex-col gap-5 md:h-[460px]">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Skill groups">
              {GROUPS.map((x, i) => (
                <button
                  key={x.key}
                  role="tab"
                  aria-selected={i === selected}
                  onClick={() => setSelected(i)}
                  className={`px-2.5 py-1 font-[family-name:var(--font-code)] text-[10px] tracking-[1px] uppercase border-[2px] border-black transition-colors ${
                    i === selected ? "bg-[#034694] text-white border-[#034694]" : "bg-transparent text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>

            <div key={selected} className="flex flex-col gap-4 min-h-0 flex-1" role="tabpanel">
              <div className="flex items-baseline justify-between border-b-[4px] border-black pb-3">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-3xl md:text-4xl tracking-[-1.5px] uppercase leading-none wd-blink-in">
                  {g.label}
                </h3>
                <span className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-sm tabular-nums">
                  {pad(selected + 1)}/{pad(GROUPS.length)}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5 overflow-auto">
                {g.tools.map((t, i) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 font-[family-name:var(--font-code)] text-sm text-[#1a1c1c] wd-blink-in"
                    style={{ animationDelay: `${i * 45}ms`, animationFillMode: "both" }}
                  >
                    <span className="text-[#737373] text-xs tabular-nums w-6">{pad(i + 1)}</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto font-[family-name:var(--font-code)] text-[10px] text-[#737373] uppercase tracking-[1.2px]">
                {pad(g.count)} tools // block height = tools in group
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
