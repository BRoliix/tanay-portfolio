"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { BOOT_EVENT } from "./wd2/BootLoader";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 2.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
    });

    const onBooted = () => lenis.start();
    if (document.documentElement.classList.contains("wd-booting")) {
      lenis.stop();
      window.addEventListener(BOOT_EVENT, onBooted, { once: true });
    }

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleResize = () => lenis.resize();
    const timers: ReturnType<typeof setTimeout>[] = [];
    const handleFilterChange = () => {
      timers.push(setTimeout(() => lenis.resize(), 100));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("filterChanged", handleFilterChange);

    timers.push(
      setTimeout(() => lenis.resize(), 300),
      setTimeout(() => lenis.resize(), 800),
    );

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("filterChanged", handleFilterChange);
      window.removeEventListener(BOOT_EVENT, onBooted);
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
