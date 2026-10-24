"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

const ArrowIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const DataStreamIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
    <circle cx="5" cy="12" r="2" />
  </svg>
);

const item = (delay: number) => ({
  hidden:  { y: 32, opacity: 0 },
  visible: { y: 0,  opacity: 1, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const } },
});

const viewport = { once: true, amount: 0.15 };

export default function BentoGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {/* Large Feature — Samsung Innovation Campus */}
      <motion.div variants={item(0)} className="md:col-span-8 relative bg-black border-[6px] border-black overflow-hidden p-[6px] shadow-[8px_8px_0px_0px_black] isolate min-h-[360px] md:min-h-0 md:h-[411px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-[1]">
          <Image alt="Samsung Innovation Campus" className="object-cover" src="/SIC.png" fill sizes="(min-width: 768px) 66vw, 100vw" loading="eager" />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Content */}
        <div className="absolute inset-[6px] bg-black/50 z-[2] p-6 md:p-10 flex flex-col justify-between backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:gap-4">
            <span className="font-mono font-bold text-[#034694] text-sm tracking-[2.8px] uppercase">
              Achievement
            </span>
            <h3 className="font-[family-name:var(--font-display)] font-bold text-white text-2xl md:text-[36px] tracking-[-1px] md:tracking-[-1.8px] uppercase leading-tight md:leading-10">
              Samsung Innovation<br />Campus Graduate<br />2024
            </h3>
            <p className="font-sans font-light text-[#a3a3a3] text-sm md:text-base leading-6">
              Final Score: 92/100
            </p>
          </div>
        </div>
      </motion.div>

      {/* Small Block 1 — project[1]: CrackIt */}
      <motion.div variants={item(0.12)} className="md:col-span-4 bg-[#e8e8e8] border-[6px] border-black p-8 md:p-[38px] shadow-[8px_8px_0px_0px_black] flex flex-col justify-between md:h-[411px]">
        <div className="flex flex-col gap-3">
          <div className="bg-black size-12 flex items-center justify-center shrink-0 text-white">
            <DataStreamIcon />
          </div>
          <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl tracking-[-0.6px] uppercase mt-2">
            {siteConfig.projects[1].title}
          </h3>
          <p className="font-sans font-normal text-[#5e5e5e] text-sm leading-5">
            {siteConfig.projects[1].desc.slice(0, 80)}…
          </p>
        </div>
        <div className="pt-4">
          <a href={`/missions/${siteConfig.projects[1].id}`} className="flex gap-2 items-center">
            <span className="font-mono font-bold text-[#034694] text-xs tracking-[1.2px] uppercase">
              Inspect_Code
            </span>
            <span className="size-[10.5px] text-[#034694]"><ArrowIcon /></span>
          </a>
        </div>
      </motion.div>

      {/* Small Block 2 — project[2]: KanGL */}
      <motion.div variants={item(0.22)} className="md:col-span-4 min-h-[220px] md:min-h-0 md:h-[275px]">
        <Link href={`/missions/${siteConfig.projects[2].id}`} className="block h-full">
          <div className="h-full bg-[#034694] border-[6px] border-black p-8 md:p-[38px] shadow-[8px_8px_0px_0px_black] flex flex-col justify-between hover:shadow-[12px_12px_0px_0px_black] transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="bg-black px-2 py-1 w-fit">
                <span className="font-sans font-bold text-white text-[10px] tracking-[3px] uppercase">
                  {siteConfig.projects[2].sector}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] font-bold text-white text-2xl tracking-[-0.6px] uppercase">
                {siteConfig.projects[2].title}
              </h3>
              <p className="font-sans font-normal text-[rgba(255,255,255,0.8)] text-sm leading-5">
                {siteConfig.projects[2].desc.slice(0, 80)}…
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between">
              <span className="h-[34.5px] w-9 text-white"><GlobeIcon /></span>
              <span className="font-mono font-bold text-white text-xs">ACT_LINK: ON</span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Medium Block — Currently at Deriv */}
      <motion.div variants={item(0.32)} className="md:col-span-8 bg-[#f9f9f9] border-[6px] border-black overflow-hidden shadow-[8px_8px_0px_0px_black] flex flex-col md:flex-row md:h-[275px]">
        <div className="relative bg-black h-[160px] md:hidden shrink-0 border-b-[6px] border-black">
          <Image alt="Deriv" className="object-cover" src="/Deriv.png" fill sizes="100vw" />
        </div>
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#034694] px-2 py-0.5 font-mono font-bold text-white text-[10px] tracking-[2px] uppercase">
              Live
            </span>
            <span className="font-mono text-[#5e5e5e] text-[10px] tracking-[1px] uppercase">
              {siteConfig.experience[0].period}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl md:text-[30px] tracking-[-1px] md:tracking-[-1.5px] uppercase leading-tight md:leading-9">
              Interning at Deriv
            </h3>
            <p className="font-sans font-normal text-[#5e5e5e] text-sm leading-5">
              {siteConfig.experience[0].title} · {siteConfig.experience[0].org} · {siteConfig.experience[0].location}
            </p>
          </div>
        </div>
        <div className="relative hidden md:block bg-black w-[266px] shrink-0 border-l-[6px] border-black">
          <Image alt="Deriv" className="object-cover" src="/Deriv.png" fill sizes="266px" />
        </div>
      </motion.div>

    </motion.div>
  );
}
