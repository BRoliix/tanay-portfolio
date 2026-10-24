import Header from "./components/Header";
import Footer from "./components/Footer";
import TypewriterText from "./components/TypewriterText";
import TerminalTrigger from "./components/TerminalTrigger";
import TerminalLauncher from "./components/TerminalLauncher";
import SlideUpSection from "./components/SlideUpSection";
import HeroContent from "./components/HeroContent";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import BentoGrid from "./components/BentoGrid";
import Link from "next/link";
import LazyMount from "./components/LazyMount";
import GlitchText from "./components/wd2/GlitchText";

const ArrowIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function Home() {
  return (
    <div className="bg-[#f9f9f9] flex flex-col min-h-screen">
      <Header />

      {/* ── Hero Section ── */}
      <section className="bg-black border-b-[6px] border-black pt-[48px] pb-[86px] px-4 md:px-6 relative overflow-hidden sticky top-0 z-10 min-h-screen">
        <div className="max-w-[1440px] mx-auto mb-4 md:mb-6 relative z-10">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-white text-[96px] sm:text-[80px] md:text-[120px] lg:text-[160px] tracking-[-4px] sm:tracking-[-4px] md:tracking-[-6px] lg:tracking-[-8px] uppercase leading-[1]">
            <GlitchText>Hey, I&apos;m <span className="text-[#034694]">Tanay</span></GlitchText>
          </h2>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <PixelatedCanvas
            src="/hero-pixel.webp"
            width={960}
            height={540}
            cellSize={4}
            dotScale={0.9}
            shape="square"
            backgroundColor="#000000"
            dropoutStrength={0.1}
            sampleAverage
            interactive={false}
            fill
          />
        </div>
        <HeroContent>

          {/* Typography Block */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-4">
              <span className="bg-white px-3 py-1 font-[family-name:var(--font-display)] font-bold text-black text-xs tracking-[1.2px] uppercase">
                V.01_STABLE
              </span>
              <div className="bg-white flex-1 h-1" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] font-bold text-[#034694] text-[56px] sm:text-[80px] md:text-[104px] lg:text-[128px] tracking-[-2px] sm:tracking-[-3px] md:tracking-[-5px] lg:tracking-[-6.4px] uppercase leading-[1]">
              AI_<TypewriterText words={["STUDENT", "ENGINEER"]} />
            </h1>
            <p className="font-sans font-light text-[#d4d4d4] text-base md:text-xl lg:text-2xl leading-7 md:leading-8 max-w-[512px] pt-2 md:pt-4">
              Hello! I&apos;m Tanay, an aspiring AI Engineer with a passion for building agentic systems! <br/> Glad to have you here. Dive in to explore my work, or just ask <TerminalTrigger />
            </p>
          </div>

        </HeroContent>

      </section>

      {/* ── Featured Projects / Bento Grid ── */}
      <SlideUpSection className="bg-[#f9f9f9] px-4 md:px-6 py-16 md:py-24 relative z-20">
        <LazyMount className="absolute inset-0">
          <BackgroundRippleEffect />
        </LazyMount>
        <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col gap-10 md:gap-16">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-0">
            <div className="flex flex-col gap-4 md:gap-6 max-w-[576px]">
              <h2 className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-[40px] md:text-[56px] lg:text-[72px] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-3.6px] uppercase leading-[1]">
                Active_Dossiers
              </h2>
              <p className="font-sans font-medium text-[#5e5e5e] text-base md:text-lg leading-7">
                Featured projects from the Agent_OS ecosystem.<br />
                Each mission represents real engineering in production.
              </p>
            </div>
            <Link href="/missions" className="flex gap-4 items-center border-b-[4px] border-black pb-3 px-4 w-fit">
              <span className="h-4 w-5 text-black"><ArrowIcon /></span>
              <span className="font-mono font-bold text-[#1a1c1c] text-sm tracking-[1.4px] uppercase">
                View All Projects
              </span>
            </Link>
          </div>

          <BentoGrid />
        </div>
      </SlideUpSection>

      {/* ── CTA Section — Terminal Focus Zone ── */}
      <section className="bg-black px-4 md:px-6 py-16 md:py-24 overflow-hidden sticky top-0 z-30 min-h-screen flex items-center">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col items-center">

          <div className="mb-4 md:mb-6">
            <span className="font-mono font-bold text-[#034694] text-xs md:text-sm tracking-[3px] md:tracking-[5.6px] uppercase">
              System_Override_Module
            </span>
          </div>

          {/* Desktop heading — absolute positioned layout */}
          <div className="hidden md:block relative w-full max-w-[896px] h-[208px] mb-12">
            <div className="absolute left-1/2 -translate-x-1/2 top-[8px] font-[family-name:var(--font-display)] font-bold text-white text-[96px] tracking-[-4.8px] uppercase leading-[96px] whitespace-nowrap">
              Ready to Chat
            </div>
            <div
              className="absolute top-[-7px] flex items-center justify-center"
              style={{ left: "calc(50% + 32px)", width: "404px" }}
            >
              <div className="-rotate-2">
                <div className="bg-[#034694] px-4 py-2">
                  <span className="font-[family-name:var(--font-display)] font-bold text-white text-[96px] tracking-[-4.8px] uppercase leading-[96px]">
                    with
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-[112px] font-[family-name:var(--font-display)] font-bold text-white text-[96px] tracking-[-4.8px] uppercase leading-[96px] whitespace-nowrap">
              Tanya Bot?
            </div>
          </div>

          {/* Mobile heading — simple stacked */}
          <div className="flex flex-col items-center gap-2 mb-10 md:hidden">
            <span className="font-[family-name:var(--font-display)] font-bold text-white text-[44px] tracking-[-2px] uppercase leading-[1]">
              Ready to Chat
            </span>
            <div className="-rotate-1">
              <div className="bg-[#034694] px-4 py-1">
                <span className="font-[family-name:var(--font-display)] font-bold text-white text-[44px] tracking-[-2px] uppercase leading-[1]">
                  with
                </span>
              </div>
            </div>
            <span className="font-[family-name:var(--font-display)] font-bold text-white text-[44px] tracking-[-2px] uppercase leading-[1]">
              Tanya Bot?
            </span>
          </div>

          {/* Input + Button */}
          <TerminalLauncher />

        </div>
      </section>

      <div className="relative z-40">
        <Footer />
      </div>

    </div>
  );
}
