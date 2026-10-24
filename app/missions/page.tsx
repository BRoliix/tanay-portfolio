"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { siteConfig } from "@/lib/config";
import { useChatModal } from "../components/ChatProvider";
import GlitchText from "../components/wd2/GlitchText";

const ArrowIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const getImageStyle = (projectId: string) => {
  // Generate deterministic values based on project ID
  const hash = projectId.split('').reduce((h, c) => h + c.charCodeAt(0), 0);

  // Randomize position
  const positions = [
    "center",
    "top center",
    "bottom center",
    "left center",
    "right center",
    "top left",
    "top right",
    "bottom left",
    "bottom right",
  ];
  const position = positions[hash % positions.length];

  // Randomize color filters
  const filters = [
    "hue-rotate(15deg) saturate(1.2)",
    "hue-rotate(-20deg) saturate(0.9)",
    "saturate(1.3) brightness(1.05)",
    "hue-rotate(180deg) saturate(0.8)",
    "saturate(1.1) contrast(1.1)",
    "hue-rotate(25deg) saturate(1.1)",
    "brightness(1.1) saturate(1.2)",
    "hue-rotate(-10deg) contrast(1.05)",
    "saturate(0.95) hue-rotate(5deg)",
  ];
  const filter = filters[hash % filters.length];

  return { objectPosition: position, filter };
};


const FILTERS = ["Full_Portfolio", "Projects", "Hackathons", "Experience", "Club_Work"] as const;
type Filter = typeof FILTERS[number];

const lug = siteConfig.leadership[2];
const { projects, hackathonProjects } = siteConfig;

const COMPANY_IMAGES: Record<string, { src: string; w: number; h: number }> = {
  deriv: { src: "/Deriv.png", w: 3840, h: 2160 },
  esri:  { src: "/Esri.png",  w: 2129, h: 1200 },
  ymt:   { src: "/YMT.png",   w: 900,  h: 900 },
  kptac: { src: "/KPTAC.png", w: 225,  h: 225 },
};

export default function MissionsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Full_Portfolio");
  const [selectedExp, setSelectedExp] = useState<typeof siteConfig.experience[number] | null>(null);
  const [selectedHackathon, setSelectedHackathon] = useState<typeof siteConfig.hackathonProjects[number] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => window.dispatchEvent(new Event("filterChanged")), 50);
    return () => clearTimeout(id);
  }, [activeFilter]);

  return (
    <div className="bg-[#f9f9f9] flex flex-col min-h-screen">
      <Header />

      <main className="pt-28 md:pt-32 pb-20 px-4 md:px-6 max-w-[1280px] mx-auto w-full">

        {/* ── Hero ── */}
        <div className="flex flex-col md:grid md:grid-cols-12 md:gap-8 mb-10 md:mb-14">
          <div className="md:col-span-8 flex flex-col gap-4 justify-end">
            <div className="bg-[#034694] px-3 py-1 w-fit">
              <span className="font-[family-name:var(--font-data)] text-white text-xs tracking-[1.2px] uppercase">
                {siteConfig.education.institution.split(",")[0]} · {siteConfig.education.period}
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] font-bold text-black text-[56px] sm:text-[80px] md:text-[104px] lg:text-[128px] tracking-[-2px] sm:tracking-[-3px] md:tracking-[-5px] lg:tracking-[-6.4px] uppercase leading-[1]">
              <GlitchText>Active_<br />Missions</GlitchText>
            </h1>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end pl-0 md:pl-1 mt-4 md:mt-0">
            <p className="font-sans text-[#434751] text-base md:text-lg leading-7 md:text-right">
              {siteConfig.name}&apos;s engineering portfolio.<br />
              {siteConfig.focus[0]}, {siteConfig.focus[1]},<br />
              and {siteConfig.focus[2]}.<br />
              All systems operational.
            </p>
          </div>
        </div>

        {/* ── Filter Toolbar ── */}
        <div className="border-b-[4px] border-black pb-6 md:pb-9 mb-8 md:mb-10 overflow-x-auto">
          <div className="flex gap-2 md:gap-4 items-center min-w-max">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 md:px-8 py-3 md:py-4 font-sans font-bold text-xs md:text-sm tracking-[1.4px] uppercase transition-colors border-[4px] border-black whitespace-nowrap ${
                  activeFilter === f
                    ? "bg-black text-white"
                    : "bg-transparent text-[#1a1c1c] hover:bg-black hover:text-white"
                }`}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* ── Full Portfolio ── */}
        {activeFilter === "Full_Portfolio" && (
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-10">

            {projects.slice(0, 3).map((p) => {
              const { objectPosition, filter } = getImageStyle(p.id);
              return (
              <Link key={p.id} href={`/missions/${p.id}`} className="block group">
                <div className="bg-white border-[4px] border-black flex flex-col shadow-[8px_8px_0px_0px_black] p-1 isolate group-hover:shadow-[12px_12px_0px_0px_black] transition-shadow">
                  <div className="relative border-b-[4px] border-black overflow-hidden bg-[#e8e8e8]">
                    <div className="h-[180px] md:h-[207px] relative">
                      {p.image ? (
                        <Image
                          alt={p.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                          style={{ objectPosition, filter }}
                          src={p.image}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4d4d4] to-[#a3a3a3] flex items-center justify-center">
                          <span className="font-[family-name:var(--font-code)] text-[#737373] text-xs uppercase text-center">Image Coming Soon</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 left-4 bg-black px-2 py-1">
                      <span className="font-[family-name:var(--font-data)] font-bold text-[#034694] text-xs uppercase">{p.sector}</span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-data)] font-bold text-[#5e5e5e] text-xs tracking-[-0.6px] uppercase">{p.ref}</span>
                      <div className={`${p.dotColor} size-3 shrink-0`} />
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl md:text-[30px] tracking-[-1px] md:tracking-[-1.5px] uppercase leading-tight">{p.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {p.stack.slice(0, 3).map((t) => (
                        <span key={t} className="font-[family-name:var(--font-data)] text-[#5e5e5e] text-[10px] border border-[#d4d4d4] px-1.5 py-0.5 uppercase">{t}</span>
                      ))}
                    </div>
                    <div className="border-t-[4px] border-black pt-5 md:pt-7 flex items-center justify-between mt-auto">
                      <span className="font-[family-name:var(--font-data)] font-bold text-[#1a1c1c] text-xs tracking-[1.2px] uppercase">{p.meta}</span>
                      <span className="size-4 text-[#1a1c1c]"><ArrowIcon /></span>
                    </div>
                  </div>
                </div>
              </Link>
            );
            })}

            {/* Current role card */}
            <div className="md:col-span-2 bg-black border-[4px] border-black shadow-[8px_8px_0px_0px_black] flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center p-8 md:p-11">
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-[#034694] px-3 py-1 w-fit">
                  <span className="font-[family-name:var(--font-data)] text-white text-[10px] tracking-[2px] uppercase">Current_Role</span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[32px] md:text-[48px] tracking-[-1.5px] md:tracking-[-2.4px] uppercase leading-tight">
                  <span className="text-white">{siteConfig.experience[0].org}</span><br />
                  <span className="text-[#034694]">{siteConfig.experience[0].title}</span>
                </h2>
                <a href={siteConfig.contact.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-white border-b-[8px] border-r-[8px] border-[#034694] flex gap-4 items-center pl-8 md:pl-10 pr-10 md:pr-12 pt-3 md:pt-4 pb-5 md:pb-6 w-fit">
                  <span className="font-sans font-bold text-black text-sm md:text-base uppercase">View_Profile</span>
                  <span className="h-5 w-4 text-black"><ExternalLinkIcon /></span>
                </a>
              </div>
              <div className="bg-[#171717] border-[4px] border-[#034694] w-full md:w-[233px] md:h-full md:min-h-[280px] relative overflow-hidden flex flex-col">
                <div className="bg-white">
                  <Image alt="Deriv" className="w-full h-auto object-cover" src="/Deriv.png" width={3840} height={2160} sizes="(min-width: 768px) 233px, 100vw" />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {[
                    { text: ">> ROLE_VITALS",       color: "text-white"     },
                    { text: "ORG: DERIV",            color: "text-[#034694]" },
                    { text: "ROLE: AI_ENGINEER_INTERN", color: "text-[#034694]" },
                    { text: "LOCATION: DUBAI_UAE",   color: "text-[#034694]" },
                    { text: "SINCE: JUL.2026",        color: "text-[#034694]" },
                    { text: "STATUS: ACTIVE",         color: "text-[#034694]" },
                    { text: "> _",                    color: "text-[#034694]" },
                  ].map(({ text, color }, i) => (
                    <p key={i} className={`font-[family-name:var(--font-data)] text-xs leading-4 ${color}`}>{text}</p>
                  ))}
                </div>
              </div>
            </div>

            {(() => {
              const { objectPosition, filter } = getImageStyle(projects[7].id);
              return (
              <Link href={`/missions/${projects[7].id}`} className="block group">
                <div className="bg-white border-[4px] border-black flex flex-col shadow-[8px_8px_0px_0px_black] p-1 isolate group-hover:shadow-[12px_12px_0px_0px_black] transition-shadow h-full">
                  <div className="relative border-b-[4px] border-black overflow-hidden bg-[#e8e8e8]">
                    <div className="h-[180px] md:h-[207px] relative">
                      {projects[7].image ? (
                        <Image
                          alt={projects[7].title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                          style={{ objectPosition, filter }}
                          src={projects[7].image}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4d4d4] to-[#a3a3a3] flex items-center justify-center">
                          <span className="font-[family-name:var(--font-code)] text-[#737373] text-xs uppercase text-center">Image Coming Soon</span>
                        </div>
                      )}
                    </div>
                  <div className="absolute top-4 left-4 bg-black px-2 py-1">
                    <span className="font-[family-name:var(--font-data)] font-bold text-[#034694] text-xs uppercase">{projects[7].sector}</span>
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-data)] font-bold text-[#5e5e5e] text-xs tracking-[-0.6px] uppercase">{projects[7].ref}</span>
                    <div className={`${projects[7].dotColor} size-3 shrink-0`} />
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl md:text-[30px] tracking-[-1px] md:tracking-[-1.5px] uppercase leading-tight">{projects[7].title}</h3>
                  <div className="flex flex-wrap gap-1">
                    {projects[7].stack.slice(0, 3).map((t) => (
                      <span key={t} className="font-[family-name:var(--font-data)] text-[#5e5e5e] text-[10px] border border-[#d4d4d4] px-1.5 py-0.5 uppercase">{t}</span>
                    ))}
                  </div>
                  <div className="border-t-[4px] border-black pt-5 md:pt-7 flex items-center justify-between mt-auto">
                    <span className="font-[family-name:var(--font-data)] font-bold text-[#1a1c1c] text-xs tracking-[1.2px] uppercase">{projects[7].meta}</span>
                    <span className="size-4 text-[#1a1c1c]"><ArrowIcon /></span>
                  </div>
                </div>
              </div>
            </Link>
            );
            })()}

            {/* LUG row */}
            <div className="md:col-span-3 bg-black border-[4px] border-black shadow-[8px_8px_0px_0px_black] p-8 md:p-11 flex flex-col md:flex-row md:items-center gap-4 md:gap-16">
              <div className="bg-[#034694] px-3 py-1 w-fit shrink-0">
                <span className="font-[family-name:var(--font-data)] text-white text-[10px] tracking-[2px] uppercase">Club_Work</span>
              </div>
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-white text-2xl md:text-[36px] tracking-[-1px] md:tracking-[-1.8px] uppercase leading-tight">
                  {lug.title} — {lug.org}
                </h3>
              </div>
            </div>

          </div>
        )}

        {/* ── Projects ── */}
        {activeFilter === "Projects" && (
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-10">
            {projects.map((p) => {
              const { objectPosition, filter } = getImageStyle(p.id);
              return (
              <Link key={p.id} href={`/missions/${p.id}`} className="block group">
                <div className="bg-white border-[4px] border-black flex flex-col shadow-[8px_8px_0px_0px_black] p-1 isolate group-hover:shadow-[12px_12px_0px_0px_black] transition-shadow">
                  <div className="relative border-b-[4px] border-black overflow-hidden bg-[#e8e8e8]">
                    <div className="h-[180px] md:h-[207px] relative">
                      {p.image ? (
                        <Image
                          alt={p.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                          style={{ objectPosition, filter }}
                          src={p.image}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4d4d4] to-[#a3a3a3] flex items-center justify-center">
                          <span className="font-[family-name:var(--font-code)] text-[#737373] text-xs uppercase text-center">Image Coming Soon</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 left-4 bg-black px-2 py-1">
                      <span className="font-[family-name:var(--font-data)] font-bold text-[#034694] text-xs uppercase">
                        {p.sector}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-data)] font-bold text-[#5e5e5e] text-xs tracking-[-0.6px] uppercase">
                        {p.ref}
                      </span>
                      <div className={`${p.dotColor} size-3 shrink-0`} />
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl md:text-[30px] tracking-[-1px] md:tracking-[-1.5px] uppercase leading-tight">
                      {p.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {p.stack.slice(0, 3).map((t) => (
                        <span key={t} className="font-[family-name:var(--font-data)] text-[#5e5e5e] text-[10px] border border-[#d4d4d4] px-1.5 py-0.5 uppercase">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
            })}
          </div>
        )}

        {/* ── Hackathons ── */}
        {activeFilter === "Hackathons" && (
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-10">
            {hackathonProjects.map((p) => (
              <button key={p.id} onClick={() => setSelectedHackathon(p)} className="block group text-left">
                <div className="bg-white border-[4px] border-black flex flex-col shadow-[8px_8px_0px_0px_black] p-1 isolate group-hover:shadow-[12px_12px_0px_0px_black] transition-shadow">
                  <div className="relative border-b-[4px] border-black overflow-hidden bg-[#e8e8e8]">
                    <div className="h-[180px] md:h-[207px] relative">
                      {p.image ? (
                        <Image
                          alt={p.projectTitle}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                          src={p.image}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4d4d4] to-[#a3a3a3] flex items-center justify-center">
                          <span className="font-[family-name:var(--font-code)] text-[#737373] text-xs uppercase text-center">Image Coming Soon</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 left-4 bg-black px-2 py-1">
                      <span className="font-[family-name:var(--font-data)] font-bold text-[#f59e0b] text-xs uppercase">
                        {p.sector}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-data)] font-bold text-[#5e5e5e] text-xs tracking-[-0.6px] uppercase">
                        {p.ref}
                      </span>
                      <div className={`${p.dotColor} size-3 shrink-0`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-[family-name:var(--font-data)] text-[#737373] text-xs uppercase tracking-[0.5px]">
                        {p.hackathonName}
                      </p>
                      <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl md:text-[30px] tracking-[-1px] md:tracking-[-1.5px] uppercase leading-tight">
                        {p.projectTitle}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.stack.slice(0, 3).map((t) => (
                        <span key={t} className="font-[family-name:var(--font-data)] text-[#5e5e5e] text-[10px] border border-[#d4d4d4] px-1.5 py-0.5 uppercase">{t}</span>
                      ))}
                    </div>
                    <div className="border-t-[4px] border-black pt-5 md:pt-7 flex items-center justify-between mt-auto">
                      <span className="font-[family-name:var(--font-data)] font-bold text-[#1a1c1c] text-xs tracking-[1.2px] uppercase">
                        {p.meta}
                      </span>
                      <span className="size-4 text-[#1a1c1c]"><ArrowIcon /></span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Experience ── */}
        {activeFilter === "Experience" && (
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-10">
            <button onClick={() => setSelectedExp(siteConfig.experience[0])} className="md:col-span-2 text-left bg-black border-[4px] border-black shadow-[8px_8px_0px_0px_black] flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center p-8 md:p-11 hover:shadow-[12px_12px_0px_0px_black] transition-shadow">
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-[#034694] px-3 py-1 w-fit">
                  <span className="font-[family-name:var(--font-data)] text-white text-[10px] tracking-[2px] uppercase">
                    Current_Role
                  </span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[32px] md:text-[48px] tracking-[-1.5px] md:tracking-[-2.4px] uppercase leading-tight">
                  <span className="text-white">{siteConfig.experience[0].org}</span><br />
                  <span className="text-[#034694]">{siteConfig.experience[0].title}</span>
                </h2>
              </div>
              <div className="bg-[#171717] border-[4px] border-[#034694] w-full md:w-[233px] md:h-full md:min-h-[280px] relative overflow-hidden flex flex-col">
                <div className="bg-white">
                  <Image alt="Deriv" className="w-full h-auto object-cover" src="/Deriv.png" width={3840} height={2160} sizes="(min-width: 768px) 233px, 100vw" />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {[
                    { text: ">> ROLE_VITALS",       color: "text-white"     },
                    { text: "ORG: DERIV",            color: "text-[#034694]" },
                    { text: "ROLE: AI_ENGINEER_INTERN", color: "text-[#034694]" },
                    { text: "LOCATION: DUBAI_UAE",   color: "text-[#034694]" },
                    { text: "SINCE: JUL.2026",        color: "text-[#034694]" },
                    { text: "STATUS: ACTIVE",         color: "text-[#034694]" },
                    { text: "> _",                    color: "text-[#034694]" },
                  ].map(({ text, color }, i) => (
                    <p key={i} className={`font-[family-name:var(--font-data)] text-xs leading-4 ${color}`}>
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </button>

            <div className="flex flex-col gap-4 md:gap-6">
              {siteConfig.experience.slice(1).map((exp) => (
                <button key={exp.id} onClick={() => setSelectedExp(exp)} className="text-left bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_black] p-5 md:p-6 flex flex-col gap-3 hover:shadow-[12px_12px_0px_0px_black] transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-[family-name:var(--font-data)] font-bold text-[#034694] text-[10px] tracking-[2px] uppercase">{exp.org}</span>
                    <span className="font-[family-name:var(--font-data)] text-[#a3a3a3] text-[10px] uppercase shrink-0">{exp.period}</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-lg uppercase tracking-tight leading-tight">
                    {exp.title}
                  </h3>
                  <p className="font-[family-name:var(--font-data)] text-[#737373] text-xs uppercase">{exp.location}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Club Work ── */}
        {activeFilter === "Club_Work" && (
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-10">
            {siteConfig.leadership.map((l) => (
              <div key={l.title} className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_black] p-6 md:p-8 flex flex-col gap-4">
                <div className="bg-black px-2 py-1 w-fit">
                  <span className="font-[family-name:var(--font-data)] font-bold text-[#034694] text-[10px] tracking-[2px] uppercase">
                    {l.org}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl uppercase tracking-tight leading-tight">
                  {l.title}
                </h3>
                <p className="font-sans text-[#5e5e5e] text-sm leading-5">{l.desc}</p>
              </div>
            ))}
          </div>
        )}

      </main>

      {selectedExp && (
        <ExperiencePopup exp={selectedExp} onClose={() => setSelectedExp(null)} />
      )}

      {selectedHackathon && (
        <HackathonPopup hackathon={selectedHackathon} onClose={() => setSelectedHackathon(null)} />
      )}

      <Footer />
    </div>
  );
}

function ExperiencePopup({
  exp,
  onClose,
}: {
  exp: typeof siteConfig.experience[number];
  onClose: () => void;
}) {
  const { openWithCommand } = useChatModal();

  function handleTanyaBot() {
    onClose();
    openWithCommand(`Tell me about Tanay's experience at ${exp.org}`);
  }

  return (
    <div
      className="fixed inset-0 z-[90] bg-[rgba(0,0,0,0.6)] backdrop-blur-[2px] flex items-center justify-center p-4 md:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_black] w-full max-w-[560px] flex flex-col max-h-[90vh] overflow-y-auto">

        <div className="bg-black px-6 md:px-8 py-4 md:py-5 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#034694] px-2 py-0.5">
              <span className="font-[family-name:var(--font-data)] text-white text-[10px] tracking-[2px] uppercase">{exp.org}</span>
            </div>
            <span className="font-[family-name:var(--font-data)] text-[#737373] text-[10px] uppercase">{exp.period}</span>
          </div>
          <button onClick={onClose} className="font-[family-name:var(--font-data)] text-[#737373] text-xs hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          {COMPANY_IMAGES[exp.id] && (
            <div className="bg-black border-[3px] border-black overflow-hidden w-1/2 mx-auto">
              <Image alt={exp.org} className="w-full h-auto object-cover" src={COMPANY_IMAGES[exp.id].src} width={COMPANY_IMAGES[exp.id].w} height={COMPANY_IMAGES[exp.id].h} sizes="(min-width: 768px) 320px, 50vw" />
            </div>
          )}
          <div>
            <h3 className="font-[family-name:var(--font-display)] font-bold text-black text-2xl md:text-[28px] tracking-[-1px] md:tracking-[-1.4px] uppercase leading-tight">
              {exp.title}
            </h3>
            <p className="font-[family-name:var(--font-data)] text-[#737373] text-xs uppercase mt-1">{exp.location}</p>
          </div>

          <ul className="flex flex-col gap-3">
            {exp.bullets.map((b, i) => (
              <li key={i} className="font-sans text-[#434751] text-sm leading-5 pl-4 border-l-[3px] border-[#034694]">
                {b}
              </li>
            ))}
          </ul>

          <button
            onClick={handleTanyaBot}
            className="bg-black text-white border-[4px] border-black px-8 py-4 font-[family-name:var(--font-display)] font-bold text-base uppercase tracking-[1.6px] shadow-[6px_6px_0px_0px_#034694] hover:bg-[#1a1a1a] transition-colors w-full mt-2"
          >
            Talk to Tanya_Bot →
          </button>
        </div>

      </div>
    </div>
  );
}

function HackathonPopup({
  hackathon,
  onClose,
}: {
  hackathon: typeof siteConfig.hackathonProjects[number];
  onClose: () => void;
}) {
  const { openWithCommand } = useChatModal();

  function handleTanyaBot() {
    onClose();
    openWithCommand(`Tell me about Tanay's hackathon project: ${hackathon.projectTitle}`);
  }

  return (
    <div
      className="fixed inset-0 z-[90] bg-[rgba(0,0,0,0.6)] backdrop-blur-[2px] flex items-center justify-center p-4 md:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_black] w-full max-w-[560px] flex flex-col max-h-[90vh] overflow-y-auto">

        <div className="bg-black px-6 md:px-8 py-4 md:py-5 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#f59e0b] px-2 py-0.5">
              <span className="font-[family-name:var(--font-data)] text-black text-[10px] tracking-[2px] uppercase">{hackathon.meta}</span>
            </div>
          </div>
          <button onClick={onClose} className="font-[family-name:var(--font-data)] text-[#737373] text-xs hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div>
            <h3 className="font-[family-name:var(--font-display)] font-bold text-black text-2xl md:text-[28px] tracking-[-1px] md:tracking-[-1.4px] uppercase leading-tight">
              {hackathon.hackathonName}
            </h3>
            <p className="font-[family-name:var(--font-data)] text-[#034694] text-sm uppercase mt-2 font-bold">Project: {hackathon.projectTitle}</p>
          </div>

          <div>
            <p className="font-sans text-[#434751] text-sm leading-6">
              {hackathon.desc}
            </p>
          </div>

          <div>
            <div className="font-[family-name:var(--font-data)] text-[10px] font-bold uppercase border-b-2 border-black/10 inline-block mb-3">
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {hackathon.stack.map((t) => (
                <span key={t} className="font-[family-name:var(--font-data)] text-[#034694] border-2 border-[#034694] bg-[#034694]/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.5px]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {hackathon.github && (
              <a
                href={hackathon.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black border-[4px] border-black px-6 py-3 font-[family-name:var(--font-display)] font-bold text-sm uppercase shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2 hover:bg-[#f0f0f0] transition-all"
              >
                GITHUB_SOURCE ↗
              </a>
            )}
            {hackathon.deployment && (
              <a
                href={hackathon.deployment}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#034694] text-white border-[4px] border-black px-6 py-3 font-[family-name:var(--font-display)] font-bold text-sm uppercase shadow-[6px_6px_0px_0px_#f59e0b] flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              >
                VIEW_DEPLOYMENT ↗
              </a>
            )}
          </div>

          <button
            onClick={handleTanyaBot}
            className="bg-black text-white border-[4px] border-black px-8 py-4 font-[family-name:var(--font-display)] font-bold text-base uppercase tracking-[1.6px] shadow-[6px_6px_0px_0px_#f59e0b] hover:bg-[#1a1a1a] transition-colors w-full"
          >
            Talk to Tanya_Bot →
          </button>
        </div>

      </div>
    </div>
  );
}
