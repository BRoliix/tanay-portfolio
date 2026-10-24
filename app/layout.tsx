import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, JetBrains_Mono, Roboto_Mono } from "next/font/google";
import "./globals.css";
import "./components/wd2/wd2.css";
import ChatProvider from "./components/ChatProvider";
import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";
import BootLoader from "./components/wd2/BootLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Event name must match BOOT_EVENT in BootLoader (a client module, so it can't be imported here).
const BOOT_LOCK = `(function(){var r=document.documentElement;r.classList.add('wd-booting');setTimeout(function(){if(!r.classList.contains('wd-booting'))return;r.classList.remove('wd-booting');r.classList.add('wd-booted');window.__wdBooted=true;window.dispatchEvent(new Event('wd:booted'));},10000);})()`;

export const metadata: Metadata = {
  title: "TANAY MATTA",
  description: "Portfolio of Tanay Matta, an aspiring AI Engineer and Software Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <head>
        {/* Locks scroll from first paint; BootLoader clears it (max ~8.3s). The
            10s timeout is a fallback so scroll never stays locked if it fails. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_LOCK }} />
        <noscript><style>{"#wd-boot{display:none}"}</style></noscript>
      </head>
      <body className="min-h-full flex flex-col cursor-none"><BootLoader /><SmoothScroll /><ChatProvider><CustomCursor />{children}</ChatProvider></body>
    </html>
  );
}
