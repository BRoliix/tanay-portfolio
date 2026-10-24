"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatModal } from "./ChatProvider";
import GlitchText from "./wd2/GlitchText";

const navLinks = [
  { href: "/missions", label: "Missions" },
  { href: "/dossier", label: "Dossier" },
];

export default function Header() {
  const pathname = usePathname();
  const { toggle } = useChatModal();
  const isHome = pathname === "/";
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const visible = !isHome || scrolledPastHero;
  // Remembers which page the menu was opened on, so it closes on navigation.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolledPastHero(window.scrollY > window.innerHeight * 0.65);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#fafafa] border-b-[4px] border-black transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] font-bold text-xl md:text-2xl text-black tracking-[-1.2px] uppercase"
        >
          <GlitchText mode="hover">TANAY MATTA</GlitchText>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`font-[family-name:var(--font-display)] font-bold text-base tracking-[-0.8px] uppercase transition-colors ${
                  active
                    ? "text-[#034694] border-b-[4px] border-[#034694] pb-2"
                    : "text-black"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggle}
          className="hidden md:block bg-[#034694] border-[4px] border-black px-7 py-3 font-[family-name:var(--font-display)] font-bold text-base text-white tracking-[-0.8px] uppercase shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          Chat with Tanya_Bot
        </button>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggle}
            className="bg-[#034694] border-[3px] border-black px-3 py-2 font-[family-name:var(--font-display)] font-bold text-xs text-white tracking-[-0.5px] uppercase"
          >
            Chat
          </button>
          <button
            onClick={() => setMenuPath((p) => (p === pathname ? null : pathname))}
            className="border-[3px] border-black p-2 flex flex-col gap-1.5 justify-center items-center w-10 h-10"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-black transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-black transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-black transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#fafafa] border-t-[4px] border-black">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`block px-6 py-4 font-[family-name:var(--font-display)] font-bold text-base tracking-[-0.8px] uppercase border-b-[2px] border-black transition-colors ${
                  active ? "bg-black text-white" : "text-black hover:bg-black hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
