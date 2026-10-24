import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import LazyMount from "./LazyMount";

const HERO_IMG = "/hero-pixel.webp";

export default function Footer() {
  const { contact } = siteConfig;
  return (
    <footer className="bg-black border-t-[6px] border-black pt-[6px] relative overflow-hidden">
      <LazyMount className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <PixelatedCanvas
          src={HERO_IMG}
          width={1920}
          height={200}
          cellSize={4}
          dotScale={0.9}
          shape="square"
          backgroundColor="#000000"
          dropoutStrength={0.1}
          interactive={false}
          sampleAverage
          fill
        />
      </LazyMount>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 relative z-10">
        <span className="font-[family-name:var(--font-code)] text-white text-xs tracking-[1.2px] uppercase">
          THANKS_FOR_COMING!
        </span>
        <div className="flex flex-wrap gap-4 md:gap-8 items-center">
          <Link href={contact.githubUrl} target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-code)] text-[#a3a3a3] text-xs tracking-[1.2px] uppercase hover:text-white transition-colors">
            GITHUB
          </Link>
          {contact.twitter && (
            <Link href={contact.twitter} target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-code)] text-[#a3a3a3] text-xs tracking-[1.2px] uppercase hover:text-white transition-colors">
              TWITTER
            </Link>
          )}
          <Link href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-code)] text-[#a3a3a3] text-xs tracking-[1.2px] uppercase hover:text-white transition-colors">
            LINKEDIN
          </Link>
          <span className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-xs tracking-[1.2px] uppercase">
            STATUS: ACTIVE
          </span>
        </div>
      </div>
    </footer>
  );
}
