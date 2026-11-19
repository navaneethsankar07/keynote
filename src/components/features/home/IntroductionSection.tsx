"use client";

import React from "react";
import Image from "next/image";
import { WaveformIcon, ActivityIcon } from "@/components/ui/Icons";

export function IntroductionSection() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#07080e] overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute top-1/4 left-0 w-96 h-96 rounded-full bg-accent-violet/5 blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-accent-cyan/5 blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          {/* Right Column: Classy Floating Grand Piano Image Melded with the Page */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-2 sm:py-6">
            {/* Ambient Radial Colored Light Behind Piano */}
            <div
              className="pointer-events-none absolute -inset-6 sm:-inset-10 rounded-full bg-gradient-to-tr from-accent-violet/30 via-indigo-600/20 to-accent-cyan/20 blur-3xl opacity-60 animate-piano-glow -z-10"
              aria-hidden="true"
            />

            {/* Seamless Melded Piano Stage - No borders, pure organic blend */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-w-2xl flex items-center justify-center animate-piano-float group">
              {/* Image Container with Radial Fade Mask */}
              <div className="relative w-full h-full overflow-hidden select-none [mask-image:radial-gradient(ellipse_94%_84%_at_50%_50%,#000_45%,rgba(0,0,0,0.85)_70%,transparent_98%)] [-webkit-mask-image:radial-gradient(ellipse_94%_84%_at_50%_50%,#000_45%,rgba(0,0,0,0.85)_70%,transparent_98%)]">
                <Image
                  src="/images/piano-classy.jpg"
                  alt="Classy concert grand piano keys with atmospheric violet lighting"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-105"
                  priority={false}
                />

                {/* Seamless Edge Gradient Melts so the image naturally melts into the section */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#07080e] via-[#07080e]/70 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07080e] via-[#07080e]/80 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#07080e] via-[#07080e]/80 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#07080e] via-[#07080e]/80 to-transparent"
                  aria-hidden="true"
                />

                {/* Elegant Ethereal Light Sheen Animation that sweeps across keys */}
                <div
                  className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="absolute -inset-full w-[250%] h-[200%] bg-gradient-to-r from-transparent via-violet-300/15 to-transparent -rotate-12 animate-piano-sheen mix-blend-screen" />
                </div>
              </div>

              {/* Floating musical glow pulse */}
              <div
                className="pointer-events-none absolute -bottom-6 left-1/4 right-1/4 h-12 bg-accent-violet/30 blur-2xl rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-700 -z-10"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scoped CSS Keyframe Animations */}
      <style>{`
        @keyframes pianoFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(0.35deg);
          }
        }
        @keyframes pianoGlow {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.96);
          }
          50% {
            transform: scale(1.04);
            opacity: 0.8;
          }
        }
        @keyframes pianoSheen {
          0% {
            transform: translateX(-150%) skewX(-20deg);
            opacity: 0;
          }
          15% {
            opacity: 0.45;
          }
          35%, 100% {
            transform: translateX(250%) skewX(-20deg);
            opacity: 0;
          }
        }
        .animate-piano-float {
          animation: pianoFloat 8s ease-in-out infinite;
        }
        .animate-piano-glow {
          animation: pianoGlow 6s ease-in-out infinite;
        }
        .animate-piano-sheen {
          animation: pianoSheen 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
