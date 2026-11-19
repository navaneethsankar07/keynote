"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { WaveformIcon } from "@/components/ui/Icons";

const EQUALIZER_BARS = [
  { duration: 1.2, delay: 0.1 },
  { duration: 0.9, delay: 0.3 },
  { duration: 1.4, delay: 0.0 },
  { duration: 1.1, delay: 0.5 },
  { duration: 1.3, delay: 0.2 },
  { duration: 0.8, delay: 0.4 },
  { duration: 1.5, delay: 0.1 },
  { duration: 1.0, delay: 0.6 },
  { duration: 1.2, delay: 0.3 },
  { duration: 0.9, delay: 0.2 },
  { duration: 1.4, delay: 0.5 },
  { duration: 1.1, delay: 0.0 },
  { duration: 1.3, delay: 0.4 },
  { duration: 0.8, delay: 0.2 },
  { duration: 1.5, delay: 0.5 },
  { duration: 1.0, delay: 0.1 },
  { duration: 1.2, delay: 0.3 },
  { duration: 0.9, delay: 0.6 },
  { duration: 1.4, delay: 0.2 },
  { duration: 1.1, delay: 0.4 },
  { duration: 1.3, delay: 0.1 },
  { duration: 1.0, delay: 0.5 },
];

export function IntroductionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-28 sm:py-36 lg:py-44 border-t border-white/5 bg-[#07080e] overflow-hidden"
    >
      {/* 1. Full-Section Cinematic Moving Piano Image (Ken Burns Drift) */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
        {/* Continuous cinematic camera drift wrapper */}
        <div className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] animate-ken-burns">
          <Image
            src="/images/piano-classy.jpg"
            alt="Classy Grand Piano Keys"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_40%] opacity-85"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 95% 85% at 68% 50%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 95%)",
              maskImage:
                "radial-gradient(ellipse 95% 85% at 68% 50%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 95%)",
            }}
          />
        </div>

        {/* Seamless Edge Melting Overlays - Fades into #07080e across all boundaries */}
        {/* Left deep editorial gradient: ensures perfect contrast for typography */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#07080e] via-[#07080e]/95 lg:via-[#07080e]/85 to-transparent z-[1]" />

        {/* Top seamless transition to the hero */}
        <div className="absolute inset-x-0 top-0 h-40 sm:h-52 bg-gradient-to-b from-[#07080e] via-[#07080e]/75 to-transparent z-[1]" />

        {/* Bottom seamless transition to the next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-52 bg-gradient-to-t from-[#07080e] via-[#07080e]/75 to-transparent z-[1]" />

        {/* Right edge softening */}
        <div className="absolute inset-y-0 right-0 w-28 sm:w-44 bg-gradient-to-l from-[#07080e] to-transparent z-[1]" />
      </div>

      {/* 2. Interactive Cursor Torch Spotlight (Follows mouse across the entire section) */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] transition-opacity duration-700"
        style={{
          opacity: mousePos ? 1 : 0,
          background: mousePos
            ? `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(167, 139, 250, 0.16), rgba(34, 211, 238, 0.05) 45%, transparent 75%)`
            : "none",
        }}
        aria-hidden="true"
      />

      {/* 3. Luxury Analog Film Grain Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay z-[3]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* 4. Ambient Atmospheric Section Aura */}
      <div
        className="pointer-events-none absolute top-1/4 right-1/4 w-[550px] h-[550px] rounded-full bg-accent-violet/15 blur-[150px] animate-aurora"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/3 w-[450px] h-[450px] rounded-full bg-accent-cyan/10 blur-[130px] animate-aurora"
        style={{ animationDelay: "4s" }}
        aria-hidden="true"
      />

      {/* 5. Editorial Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Modern Editorial Storytelling */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start space-y-7">
            {/* Minimalist Live Tracking Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-violet opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-violet" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-text-secondary">
                Acoustic Architecture // 01
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.12]">
              Every song has a story{" "}
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                beyond its sound.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans max-w-xl">
              Discover the musical structure hiding beneath the melodies you love.
              Explore rhythm, harmony, instruments, tonal relationships, and the musical
              ideas that bring songs to life.
            </p>

            {/* Live Studio Frequency Visualizer Panel */}
            <div className="w-full p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <WaveformIcon size={14} className="text-accent-violet" />
                  <span className="font-mono text-xs text-text-primary font-medium tracking-wide">
                    Harmonic Decomposition
                  </span>
                </div>
                <span className="font-mono text-[11px] text-text-muted">
                  44.1 kHz • 22-Band Polyphony
                </span>
              </div>

              {/* Rhythmic Equalizer Spectrum Bars */}
              <div className="pt-4 flex items-end justify-between gap-1 sm:gap-1.5 h-12 sm:h-14 px-1">
                {EQUALIZER_BARS.map((bar, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-gradient-to-t from-accent-violet via-indigo-400 to-accent-cyan opacity-75 group-hover:opacity-100 transition-opacity origin-bottom animate-eq-bar"
                    style={{
                      height: "100%",
                      animationDuration: `${bar.duration}s`,
                      animationDelay: `${bar.delay}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 3 Modern Discovery Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-1">
              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm hover:border-accent-violet/40 hover:bg-white/[0.05] transition-all duration-300 group">
                <div className="font-mono text-[11px] text-accent-violet font-semibold mb-1">
                  01. CADENCE
                </div>
                <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
                  Chord progressions & modal resolution
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm hover:border-accent-cyan/40 hover:bg-white/[0.05] transition-all duration-300 group">
                <div className="font-mono text-[11px] text-accent-cyan font-semibold mb-1">
                  02. TONAL GRAVITY
                </div>
                <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
                  Key centers & harmonic tension
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm hover:border-indigo-400/40 hover:bg-white/[0.05] transition-all duration-300 group">
                <div className="font-mono text-[11px] text-indigo-300 font-semibold mb-1">
                  03. TIMBRE
                </div>
                <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
                  Acoustic layering & instrument textures
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Open spatial view of the moving piano keys */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 min-h-[460px] pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Modern GPU-accelerated Keyframe Animations */}
      <style>{`
        @keyframes kenBurnsPiano {
          0% {
            transform: scale(1.02) translate(0%, 0%);
          }
          50% {
            transform: scale(1.08) translate(-1.5%, -1%);
          }
          100% {
            transform: scale(1.03) translate(1%, -0.5%);
          }
        }
        @keyframes eqBarMotion {
          0% {
            transform: scaleY(0.2);
          }
          50% {
            transform: scaleY(1);
          }
          100% {
            transform: scaleY(0.35);
          }
        }
        @keyframes auroraBreathe {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.06);
          }
        }
        .animate-ken-burns {
          animation: kenBurnsPiano 28s ease-in-out infinite alternate;
          will-change: transform;
        }
        .animate-eq-bar {
          animation: eqBarMotion 1.2s ease-in-out infinite alternate;
          will-change: transform;
        }
        .animate-aurora {
          animation: auroraBreathe 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
