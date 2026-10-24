import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { siteConfig } from "@/lib/config";
import mePortrait from "../../public/me.png";

const SkillCheckIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const { experience, education, skillTiles, contact, achievements, certifications } = siteConfig;

export default function DossierPage() {
  return (
    <div className="bg-[#f9f9f9] flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-col gap-14 md:gap-20 pt-28 md:pt-32 pb-20 px-4 md:px-6 max-w-[1280px] mx-auto w-full">

        {/* ── Header Section ── */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#034694] px-3 py-1 w-fit">
            <span className="font-[family-name:var(--font-code)] text-white text-xs tracking-[1.4px] uppercase">
              Subject_ID: {siteConfig.subjectId} {"//"} STATUS: FINAL_YEAR
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-[36px] sm:text-[64px] md:text-[96px] lg:text-[128px] tracking-[-1px] sm:tracking-[-2px] md:tracking-[-4px] lg:tracking-[-6.4px] uppercase leading-[1] break-words">
            THE<br />ACADEMIC_<br className="sm:hidden" />DOSSIER
          </h1>
          <p className="font-sans font-normal text-[#434751] text-sm md:text-xl leading-6 md:leading-7">
            {siteConfig.name} — {education.degree}.<br />
            {education.institution}.<br />
            CGPA: {education.cgpa} · {education.location}.
          </p>
        </div>

        {/* ── Main Content Block ── */}
        <div className="bg-white border-[6px] md:border-[8px] border-black p-6 sm:p-10 md:p-[72px] flex flex-col gap-16 md:gap-24 relative overflow-hidden">
          <span className="hidden md:block absolute top-4 right-4 font-[family-name:var(--font-code)] text-[#a3a3a3] text-xs">
            RESTRICTED_ACCESS // LEVEL_4
          </span>
          <div className="absolute bottom-4 left-4 bg-[#034694] h-1 w-24" />

          {/* 00_ME */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="border-b-[4px] border-black pb-3">
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-[28px] md:text-[36px] tracking-[-1.4px] md:tracking-[-1.8px] uppercase leading-10">
                  00_ME
                </h2>
              </div>
              <div className="flex flex-col font-[family-name:var(--font-code)] text-[#034694] text-sm leading-[17.5px]">
                <p>SUBJECT: {siteConfig.name.toUpperCase()}</p>
                <p>HANDLE: {siteConfig.handle}</p>
                <p>CLEARANCE: {siteConfig.clearance}</p>
              </div>
            </div>
            <div className="md:col-span-8 flex justify-center">
              <div className="bg-[#e2e2e2] border-[6px] border-black shadow-[8px_8px_0px_0px_black] overflow-hidden w-full sm:w-[70%] md:w-[55%]">
                <Image
                  alt="Subject Portrait"
                  className="w-full h-auto"
                  src={mePortrait}
                  sizes="(min-width: 768px) 55vw, (min-width: 640px) 70vw, 100vw"
                />
              </div>
            </div>
          </div>

          {/* 01_ORIGIN */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4 flex flex-col gap-6 md:pb-36">
              <div className="border-b-[4px] border-black pb-3">
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-[28px] md:text-[36px] tracking-[-1.4px] md:tracking-[-1.8px] uppercase leading-10">
                  01_ORIGIN
                </h2>
              </div>
              <div className="flex flex-col font-[family-name:var(--font-code)] text-[#034694] text-sm leading-[17.5px] break-words">
                <p>STATUS: {siteConfig.status}</p>
                <p>CLEARANCE: {siteConfig.clearance}</p>
                <p className="break-all">VECTOR: {siteConfig.vector.toUpperCase()}</p>
              </div>
            </div>
            <div className="md:col-span-8 flex flex-col gap-8">
              <p className="font-sans font-medium text-[#1a1c1c] text-lg md:text-2xl leading-8 md:leading-[33px]">
                Building at the frontier of {siteConfig.focus[0]} and {siteConfig.focus[1]}.
                Specializing in {siteConfig.focus[2]} with a focus on production-ready systems
                and high-tension real-time inference pipelines.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                {[
                  { label: "CORE_OBJECTIVE", value: siteConfig.focus[0] },
                  { label: "PRIMARY_STACK",  value: "Python · Golang · TS" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#f3f3f3] border-l-[8px] border-[#034694] pl-6 md:pl-8 pr-4 md:pr-6 py-5 md:py-6 flex flex-col gap-2">
                    <span className="font-[family-name:var(--font-code)] text-[#737373] text-sm md:text-base leading-6">{label}</span>
                    <span className="font-[family-name:var(--font-code)] font-bold text-[#1a1c1c] text-base md:text-lg leading-7">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 02_HISTORY */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
              <div className="border-b-[4px] border-black pb-3">
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-[28px] md:text-[36px] tracking-[-1.4px] md:tracking-[-1.8px] uppercase leading-10">
                  02_HISTORY
                </h2>
              </div>
            </div>
            <div className="md:col-span-8 flex flex-col gap-10 md:gap-12">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl md:text-[30px] tracking-[-0.75px] uppercase leading-9">
                    {education.degree}
                  </h3>
                  <span className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-sm md:text-base shrink-0">
                    [{education.period}]
                  </span>
                </div>
                <p className="font-[family-name:var(--font-code)] text-[#737373] text-sm tracking-[-0.7px] uppercase leading-5 break-words">
                  {education.institution} {"//"} {education.location}
                </p>
                <p className="font-sans text-[#434751] text-base leading-6">
                  CGPA: {education.cgpa}. Specializing in AI engineering, neural architectures, and applied machine learning systems.
                </p>
              </div>

              {experience.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h3 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl md:text-[30px] tracking-[-0.75px] uppercase leading-9">
                      {exp.title}
                    </h3>
                    <span className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-sm md:text-base shrink-0">
                      [{exp.period}]
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-code)] text-[#737373] text-sm tracking-[-0.7px] uppercase leading-5 break-words">
                    {exp.org} {"//"} {exp.location}
                  </p>
                  <ul className="flex flex-col gap-2 max-w-[672px]">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="font-sans text-[#434751] text-base leading-6 pl-4 border-l-2 border-[#034694]">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 03_MODS */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
              <div className="border-b-[4px] border-black pb-3">
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-[28px] md:text-[36px] tracking-[-1.4px] md:tracking-[-1.8px] uppercase leading-10">
                  03_MODS
                </h2>
              </div>
            </div>
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-1">
              {skillTiles.map(({ label, bg, text, border }) => (
                <div
                  key={label}
                  className={`${bg} ${border ? "border-[4px] border-black p-5 md:p-7" : "p-4 md:p-6"} flex flex-col items-start justify-between min-h-[160px] md:min-h-[233px]`}
                >
                  <span className="h-[22px] md:h-[28px] w-[22px] md:w-[28px] text-[#034694]"><SkillCheckIcon /></span>
                  <div className={`font-[family-name:var(--font-display)] font-bold ${text} text-base md:text-xl uppercase leading-5`}>
                    {label.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 04_WINS */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
              <div className="border-b-[4px] border-black pb-3">
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-[28px] md:text-[36px] tracking-[-1.4px] md:tracking-[-1.8px] uppercase leading-10">
                  04_WINS
                </h2>
              </div>
            </div>
            <div className="md:col-span-8 flex flex-col gap-6 md:gap-8">
              {achievements.map((a) => (
                <div key={a.title} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-[#e2e2e2] pb-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-base md:text-lg uppercase tracking-[-0.5px]">{a.title}</span>
                    <span className="font-[family-name:var(--font-code)] text-[#737373] text-xs uppercase tracking-wider">{a.org} · {a.location}</span>
                    <span className="font-[family-name:var(--font-code)] text-[#034694] text-sm">{a.detail}</span>
                  </div>
                  <span className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-sm shrink-0">{a.date}</span>
                </div>
              ))}
              {certifications.map((c) => (
                <div key={c.title} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-[#e2e2e2] pb-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-base md:text-lg uppercase tracking-[-0.5px]">{c.title}</span>
                    <span className="font-[family-name:var(--font-code)] text-[#737373] text-xs uppercase tracking-wider">{c.org}</span>
                  </div>
                  <span className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-sm shrink-0">{c.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Terminal Output Section ── */}
        <div className="bg-black border-l-[6px] md:border-l-[8px] border-[#034694] pl-6 md:pl-10 pr-4 md:pr-8 py-6 md:py-8 flex flex-col gap-6 shadow-[8px_8px_0px_0px_black]">
          <div className="flex gap-2 items-center">
            <div className="bg-[#ef4444] rounded-full size-3" />
            <div className="bg-[#eab308] rounded-full size-3" />
            <div className="bg-[#22c55e] rounded-full size-3" />
            <span className="font-[family-name:var(--font-code)] text-[#737373] text-xs uppercase ml-4">
              system_log.txt
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-[family-name:var(--font-code)] text-[#034694] text-sm md:text-base leading-6">
              &gt; EXECUTING TALENT_SCAN for {siteConfig.name.toUpperCase()}...
            </p>
            <p className="font-[family-name:var(--font-code)] text-[#a3a3a3] text-sm md:text-base leading-6">
              ANALYZING ACADEMIC_TRAJECTORY... CGPA {education.cgpa} CONFIRMED.
            </p>
            <p className="font-[family-name:var(--font-code)] text-white text-sm md:text-base leading-6">
              &gt; [OK] {achievements[0].title.toUpperCase()} — {achievements[0].detail}
            </p>
            <p className="font-[family-name:var(--font-code)] text-white text-sm md:text-base leading-6">
              &gt; [OK] {experience[0].org.toUpperCase()} {"//"} {experience[0].title.toUpperCase()} — ACTIVE
            </p>
            <div className="flex items-center gap-2">
              <p className="font-[family-name:var(--font-code)] text-white text-sm md:text-base leading-6 break-all">
                Dossier verified. Recruitment channels open. Contact: {contact.email}
              </p>
              <div className="bg-[#034694] w-2 h-5 shrink-0" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6 pt-2">
            <a
              href={`mailto:${contact.email}`}
              className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-sm tracking-[1.4px] uppercase hover:text-white transition-colors"
            >
              Contact_Secure_Line
            </a>
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-sm tracking-[1.4px] uppercase hover:text-white transition-colors"
            >
              View_Github
            </a>
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-sm tracking-[1.4px] uppercase hover:text-white transition-colors"
            >
              View_LinkedIn
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
