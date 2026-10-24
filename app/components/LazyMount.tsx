"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

// Renders an empty box until it comes within `margin` of the viewport, then
// mounts its children. For decorative, below-the-fold pieces only.
export default function LazyMount({
  children,
  className,
  margin = "400px",
}: {
  children: ReactNode;
  className?: string;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setShow(true);
      io.disconnect();
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return <div ref={ref} className={className}>{show && children}</div>;
}
