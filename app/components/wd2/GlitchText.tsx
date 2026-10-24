"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { BOOT_EVENT } from "./BootLoader";

const DURATION = 460;

// Slice glitch: two aria-hidden copies of the children, clipped into bands and
// offset with stepped keyframes. "idle" fires once after boot, then every
// 5-10s while on screen; "hover" only fires on hover/focus.
export default function GlitchText({
  children,
  mode = "idle",
  colors = ["#22c55e", "#034694"],
  className = "",
}: {
  children: ReactNode;
  mode?: "idle" | "hover";
  colors?: [string, string];
  className?: string;
}) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const offTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fire = () => {
    if (offTimer.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
    offTimer.current = setTimeout(() => { setOn(false); offTimer.current = undefined; }, DURATION);
  };
  useEffect(() => () => clearTimeout(offTimer.current), []);

  useEffect(() => {
    if (mode !== "idle") return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (ref.current) io.observe(ref.current);

    let first: ReturnType<typeof setTimeout>;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(() => {
        if (visible && !document.hidden) fire();
        loop();
      }, 5000 + Math.random() * 5000);
    };
    const start = () => { first = setTimeout(fire, 260); loop(); };
    if (window.__wdBooted) start();
    else window.addEventListener(BOOT_EVENT, start, { once: true });

    return () => {
      clearTimeout(first);
      clearTimeout(timer);
      io.disconnect();
      window.removeEventListener(BOOT_EVENT, start);
    };
  }, [mode]);

  // The copies are positioned inline so they can never show as duplicate text,
  // even with a stale stylesheet; the CSS only adds the animation.
  const layer = { position: "absolute", inset: 0, pointerEvents: "none" } as const;
  return (
    <span
      ref={ref}
      className={`wd-glitch ${className}`}
      data-on={on ? "1" : "0"}
      onMouseEnter={fire}
      onFocus={fire}
      style={{ position: "relative", display: "inline-block", ["--wd-ga" as string]: colors[0], ["--wd-gb" as string]: colors[1] }}
    >
      <span className="wd-glitch__base">{children}</span>
      {on && <span className="wd-glitch__layer wd-glitch__layer--a" aria-hidden style={layer}>{children}</span>}
      {on && <span className="wd-glitch__layer wd-glitch__layer--b" aria-hidden style={layer}>{children}</span>}
    </span>
  );
}
