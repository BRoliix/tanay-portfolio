"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, input, textarea, select, label, [role='button'], [tabindex]";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) {
      el.style.display = "none";
      return;
    }

    let raf: number;

    // Position — rAF-throttled, no style reads
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    };

    // Pointer state — only fires on element boundary crossings, not every px
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(INTERACTIVE)) {
        el.setAttribute("data-pointer", "1");
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.relatedTarget as Element | null;
      if (!target?.closest(INTERACTIVE)) {
        el.setAttribute("data-pointer", "0");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout",  onOut,  { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      data-pointer="0"
      className="fixed top-0 left-0 z-[10001] pointer-events-none select-none"
      style={{ willChange: "transform" }}
    >
      <svg
        id="cursor-arrow"
        width="28" height="28" viewBox="0 0 28 28" fill="none"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d="M4 2 L4 22 L9 16 L13.5 25 L16.5 23.5 L12 14.5 L19 14.5 Z"
          fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round"
        />
      </svg>

      {/* Standard OS-style pointer hand */}
      <svg
        id="cursor-pointer"
        width="28" height="28" viewBox="0 0 28 28" fill="none"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d="M10 13V5.5a1.5 1.5 0 0 1 3 0V12h.5V4a1.5 1.5 0 0 1 3 0v8h.5V6a1.5 1.5 0 0 1 3 0v6h.5v-3a1.5 1.5 0 0 1 3 0v7c0 4-2.5 6.5-6.5 6.5h-1C12 22.5 9 20 8 16.5L6.2 12a1.6 1.6 0 0 1 2.4-2L10 12v1Z"
          fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
