"use client";

import { useState } from "react";

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

interface VideoPlayerProps {
  videoUrl: string;
  projectTitle: string;
  projectTag: string;
}

export default function VideoPlayer({ videoUrl, projectTitle, projectTag }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;

  const statusLabel =
    projectTag === "progress" ? "IN_PROGRESS" : projectTag === "full" ? "DEPLOYED" : "ARCHIVED";

  // ── No video — styled placeholder ──────────────────────────────────────────
  if (!videoUrl) {
    return (
      <section
        className="w-full bg-black border-y-[6px] border-black mb-16"
        style={{
          backgroundImage:
            "linear-gradient(rgba(3,70,148,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(3,70,148,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div className="relative aspect-video max-h-[70vh] w-full flex items-center justify-center">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
            <span
              className="font-[family-name:var(--font-display)] font-bold uppercase text-white whitespace-nowrap select-none mx-auto"
              style={{ fontSize: "clamp(80px, 14vw, 200px)", opacity: 0.03, letterSpacing: "-0.05em" }}
            >
              {projectTitle}
            </span>
          </div>

          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-[#1a1a1a] border-[4px] border-[#333] flex items-center justify-center mx-auto opacity-40 cursor-not-allowed">
              <svg className="w-10 h-10 text-[#555]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="mt-4 font-[family-name:var(--font-data)] text-[#444] tracking-[0.3em] text-sm uppercase">
              NO_DEMO_REEL
            </div>
          </div>

          <div className="absolute top-6 left-6 font-[family-name:var(--font-data)] text-[#034694] bg-black/80 border-2 border-[#034694] px-3 py-1 text-xs uppercase tracking-widest">
            BUFFER: —
          </div>
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-[#555] rounded-full" />
            <span className="font-[family-name:var(--font-data)] text-[#555] text-xs uppercase tracking-widest">
              {statusLabel}
            </span>
          </div>
        </div>
      </section>
    );
  }

  // ── YouTube embed ───────────────────────────────────────────────────────────
  if (youtubeId) {
    const poster = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

    return (
      <section className="w-full bg-black border-y-[6px] border-black mb-16">
        <div className="relative aspect-video max-h-[70vh] w-full overflow-hidden">
          {playing ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* Poster */}
              {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnail; img.youtube.com is not in images.remotePatterns */}
              <img
                src={poster}
                alt={projectTitle}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40" />

              {/* Play button */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
                onClick={() => setPlaying(true)}
              >
                <div className="w-24 h-24 bg-[#034694] border-[4px] border-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-[6px_6px_0px_0px_black]">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="mt-4 font-[family-name:var(--font-data)] text-white tracking-[0.3em] font-bold uppercase text-sm">
                  DEMO_REEL
                </div>
              </div>

              {/* Overlays */}
              <div className="absolute top-6 left-6 font-[family-name:var(--font-data)] text-[#034694] bg-black/80 border-2 border-[#034694] px-3 py-1 text-xs uppercase tracking-widest">
                BUFFER: 100%
              </div>
              <div className="absolute bottom-6 right-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="font-[family-name:var(--font-data)] text-white text-xs uppercase tracking-widest">
                  ENCRYPTED_FEED
                </span>
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  // ── Direct video file ───────────────────────────────────────────────────────
  return (
    <section className="w-full bg-black border-y-[6px] border-black mb-16">
      <div className="relative aspect-video max-h-[70vh] w-full overflow-hidden">
        {playing ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            controls
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-black" />

            <div
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => setPlaying(true)}
            >
              <div className="w-24 h-24 bg-[#034694] border-[4px] border-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-[6px_6px_0px_0px_black]">
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="mt-4 font-[family-name:var(--font-data)] text-white tracking-[0.3em] font-bold uppercase text-sm">
                DEMO_REEL
              </div>
            </div>

            <div className="absolute top-6 left-6 font-[family-name:var(--font-data)] text-[#034694] bg-black/80 border-2 border-[#034694] px-3 py-1 text-xs uppercase tracking-widest">
              BUFFER: 100%
            </div>
            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="font-[family-name:var(--font-data)] text-white text-xs uppercase tracking-widest">
                ENCRYPTED_FEED
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
