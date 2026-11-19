"use client";

import React from "react";
import Image from "next/image";
import { WaveformIcon, ActivityIcon } from "@/components/ui/Icons";

export function IntroductionSection() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-36 border-t border-white/5 bg-[#07080e] overflow-hidden">
      {/* Ambient animated atmospheric lighting across the entire section */}
      <div
        className="pointer-events-none absolute -top-32 right-1/4 w-[520px] h-[520px] rounded-full bg-accent-violet/15 blur-[130px] animate-pulse"
        style={{ animationDuration: "7s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-1/3 w-[460px] h-[460px] rounded-full bg-accent-cyan/10 blur-[120px] animate-pulse"
        style={{ animationDuration: "9s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-32 w-[420px] h-[420px] rounded-full bg-accent-violet/10 blur-[110px] animate-pulse"
        style={{ animationDuration: "8s" }}
        aria-hidden="true"
      />

      {/* Subtle floating stage dust & ambient light motes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-accent-violet/50 blur-[1px] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-2/3 right-1/5 w-2 h-2 rounded-full bg-accent-cyan/40 blur-[1px] animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute top-1/3 right-1/2 w-1 h-1 rounded-full bg-white/40 blur-[0.5px] animate-pulse"
          style={{ animationDuration: "5s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-purple-300/40 blur-[1px] animate-pulse"
          style={{ animationDuration: "7s" }}
        />
      </div>

      {/* Subtle background harmonic resonance wave */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 opacity-20 overflow-hidden" aria-hidden="true">
        <svg
          className="w-full h-full text-accent-violet/30"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M 0,60 C 150,15 350,105 600,60 C 850,15 1050,105 1200,60"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typographic & Editorial Storytelling */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
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
              <div className="p-4 rounded-2xl bg-surface/40 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 text-accent-violet text-sm font-semibold mb-1">
                  <WaveformIcon size={16} />
                  <span>Hidden Architecture</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Uncover structural cadence, chord transitions, and modal anchors hidden inside familiar hooks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface/40 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 text-accent-cyan text-sm font-semibold mb-1">
                  <ActivityIcon size={16} />
                  <span>Sonic Anatomy</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Decompose complex musical mixes into separate frequency overtones, rhythm grooves, and harmonic layers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Classy Grand Piano - Seamlessly Melted with the Section */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Backlight Halo behind the piano keys */}
            <div
              className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-accent-violet/30 via-indigo-500/15 to-accent-cyan/20 blur-3xl rounded-full scale-105"
              aria-hidden="true"
            />

            {/* Seamless Borderless Piano Image Container */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[5/4] xl:aspect-[4/3] flex items-center justify-center select-none">
              <Image
                src="/images/piano-classy.jpg"
                alt="Classy Grand Piano Keys"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center pointer-events-none"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,1) 28%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 78%)",
                  maskImage:
                    "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,1) 28%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 78%)",
                }}
              />

              {/* Edge fade gradients ensuring flawless melting into section background */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#07080e] via-[#07080e]/40 to-transparent"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07080e] via-[#07080e]/40 to-transparent"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#07080e] via-[#07080e]/40 to-transparent"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#07080e] via-[#07080e]/40 to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
