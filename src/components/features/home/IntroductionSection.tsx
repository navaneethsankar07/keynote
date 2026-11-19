"use client";

import React from "react";
import Image from "next/image";
import { WaveformIcon, ActivityIcon } from "@/components/ui/Icons";

export function IntroductionSection() {
  return (
    <section className="relative py-28 sm:py-36 lg:py-40 border-t border-white/5 bg-[#07080e] overflow-hidden">
      {/* 1. Classy Grand Piano - Melted seamlessly across the entire section background */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
        {/* Piano image positioned on the right and center */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[68%] xl:w-[62%] h-full">
          <Image
            src="/images/piano-classy.jpg"
            alt="Classy Grand Piano Keys"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover object-[62%_45%] opacity-80 lg:opacity-95"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 82% 76% at 65% 50%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.65) 52%, rgba(0,0,0,0) 84%)",
              maskImage:
                "radial-gradient(ellipse 82% 76% at 65% 50%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.65) 52%, rgba(0,0,0,0) 84%)",
            }}
          />
        </div>

        {/* Seamless edge blending overlays - melts into #07080e on all sides */}
        {/* Left feather gradient: protects text contrast while allowing the keys to emerge */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#07080e] via-[#07080e]/95 lg:via-[#07080e]/90 to-transparent z-[1]" />

        {/* Top fade gradient: smooth seamless melt with the hero above */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-[#07080e] via-[#07080e]/70 to-transparent z-[1]" />

        {/* Bottom fade gradient: smooth seamless melt with the section below */}
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-[#07080e] via-[#07080e]/70 to-transparent z-[1]" />

        {/* Right edge fade */}
        <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#07080e] to-transparent z-[1]" />
      </div>

      {/* 2. Section Atmospheric Lighting & Ambient Animations (applied across the section, not to the image) */}
      {/* Violet acoustic aurora glow */}
      <div
        className="pointer-events-none absolute -top-28 right-1/4 w-[540px] h-[540px] rounded-full bg-accent-violet/15 blur-[140px] animate-section-glow"
        aria-hidden="true"
      />

      {/* Cyan harmonic resonance glow */}
      <div
        className="pointer-events-none absolute -bottom-24 right-1/3 w-[460px] h-[460px] rounded-full bg-accent-cyan/10 blur-[130px] animate-section-glow"
        style={{ animationDelay: "3s" }}
        aria-hidden="true"
      />

      {/* Left counter-balance indigo aura */}
      <div
        className="pointer-events-none absolute top-1/3 -left-36 w-[420px] h-[420px] rounded-full bg-indigo-500/10 blur-[120px] animate-section-glow"
        style={{ animationDelay: "5s" }}
        aria-hidden="true"
      />

      {/* Subtle floating acoustic dust motes across the section */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-[2]" aria-hidden="true">
        <div
          className="absolute top-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-accent-violet/50 blur-[0.5px] animate-float-mote"
          style={{ animationDuration: "7s", animationDelay: "0s" }}
        />
        <div
          className="absolute top-2/3 right-1/5 w-2 h-2 rounded-full bg-accent-cyan/40 blur-[1px] animate-float-mote"
          style={{ animationDuration: "9s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 right-1/2 w-1 h-1 rounded-full bg-white/40 blur-[0.5px] animate-float-mote"
          style={{ animationDuration: "8s", animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-1/4 right-2/5 w-1.5 h-1.5 rounded-full bg-purple-300/40 blur-[0.5px] animate-float-mote"
          style={{ animationDuration: "10s", animationDelay: "1s" }}
        />
      </div>

      {/* Subtle animated harmonic frequency curve along the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-25 overflow-hidden z-[2]" aria-hidden="true">
        <svg
          className="w-full h-full text-accent-violet/40"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M 0,60 C 150,20 350,100 600,60 C 850,20 1050,100 1200,60"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="animate-wave-flow"
          />
        </svg>
      </div>

      {/* 3. Section Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typographic & Editorial Storytelling */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
              Every song has a story{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                beyond its sound.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans max-w-xl">
              Discover the musical structure hiding beneath the melodies you love.
              Explore rhythm, harmony, instruments, tonal relationships, and the musical
              ideas that bring songs to life.
            </p>

            {/* Editorial Feature Highlights */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-white/10 backdrop-blur-md transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-accent-violet/5 group">
                <div className="flex items-center gap-2 text-accent-violet text-sm font-semibold mb-1 group-hover:text-accent-violet-light transition-colors">
                  <WaveformIcon size={16} />
                  <span>Hidden Architecture</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Uncover structural cadence, chord transitions, and modal anchors hidden inside familiar hooks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-white/10 backdrop-blur-md transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-accent-cyan/5 group">
                <div className="flex items-center gap-2 text-accent-cyan text-sm font-semibold mb-1 group-hover:text-cyan-300 transition-colors">
                  <ActivityIcon size={16} />
                  <span>Sonic Anatomy</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Decompose complex musical mixes into separate frequency overtones, rhythm grooves, and harmonic layers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Open spatial area where the piano keys emerge from the shadows */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 min-h-[360px] pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Scoped CSS Keyframe Animations for the section */}
      <style>{`
        @keyframes sectionGlow {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.06);
          }
        }
        @keyframes floatMote {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-16px) translateX(10px);
            opacity: 0.8;
          }
        }
        @keyframes waveFlow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }
        .animate-section-glow {
          animation: sectionGlow 8s ease-in-out infinite;
        }
        .animate-float-mote {
          animation: floatMote 8s ease-in-out infinite;
        }
        .animate-wave-flow {
          animation: waveFlow 18s linear infinite;
        }
      `}</style>
    </section>
  );
}
