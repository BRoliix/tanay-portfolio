"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
}

export default function TypewriterText({
  words,
  className,
  typingSpeed = 210,
  deletingSpeed = 180,
  pauseMs = 2800,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "deleting">("typing");

  useEffect(() => {
    const current = words[wordIndex];
    const advance = () => {
      setWordIndex((i) => (i + 1) % words.length);
      setPhase("typing");
    };

    if (phase === "typing") {
      if (displayed.length < current.length) {
        const t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          typingSpeed
        );
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(
          () => (displayed.length > 0 ? setPhase("deleting") : advance()),
          pauseMs
        );
        return () => clearTimeout(t);
      }
    }

    if (phase === "deleting") {
      const t = setTimeout(() => {
        const next = displayed.slice(0, -1);
        setDisplayed(next);
        if (next.length === 0) advance();
      }, deletingSpeed);
      return () => clearTimeout(t);
    }
  }, [displayed, phase, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse">_</span>
    </span>
  );
}
