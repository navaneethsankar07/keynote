"use client";

import React from "react";
import { GetStartedButton } from "@/components/ui/get-started-button";
import { ShinyButton } from "@/components/ui/shiny-button";

export function FinalCtaSection() {
  return (
    <section className="relative py-28 sm:py-36 border-t border-white/5 bg-[#06070c] overflow-hidden">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] max-w-[130vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12)_0%,rgba(6,182,212,0.04)_45%,transparent_75%)] blur-3xl -z-10"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.03] -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.04] -z-10"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">


        <div className="group relative cursor-pointer inline-block mx-auto mb-6">
          <div className="flex flex-col items-center">
            <h2 className="relative text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.12] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <span className="block overflow-hidden">
                <span className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[8%]">
                  Your favorite songs
                </span>
              </span>
              <span className="block overflow-hidden mt-1">
                <span className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75 group-hover:-translate-y-[8%]">
                  <span className="bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                    have more to reveal.
                  </span>
                </span>
              </span>
            </h2>
          </div>

          <div className="absolute -left-12 sm:-left-20 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
            <div className="h-px w-8 sm:w-14 bg-white/15 transition-all duration-500 group-hover:scale-x-150 group-hover:bg-white/40" />
          </div>
          <div className="absolute -right-12 sm:-right-20 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
            <div className="h-px w-8 sm:w-14 bg-white/15 transition-all duration-500 group-hover:scale-x-150 group-hover:bg-white/40" />
          </div>
        </div>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed font-sans mb-10">
          Explore the rhythm, harmony, melodies, and musical ideas behind the songs you love.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <GetStartedButton
            href="/analyze"
            label="Start exploring"
          />

          <ShinyButton
            href="/learn"
            label="Explore music theory"
          />
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-text-muted">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Lossless Audio Precision</span>
          </div>
          <span>•</span>
          <div>12 Diatonic Modes</div>
          <span>•</span>
          <div>Full Stem Separation Ready</div>
        </div>
      </div>
    </section>
  );
}
