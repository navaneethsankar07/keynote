"use client";

import React from "react";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TheoryBookIcon } from "@/components/ui/Icons";
import { TubesSoundscape } from "./TubesSoundscape";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-24">
      <TubesSoundscape />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 my-auto">
        <div className="flex flex-col items-center text-center">
          <h1
            className="font-display max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] hero-enter-slide pointer-events-auto select-none"
            style={{ animationDelay: "0ms" }}
          >
            Discover the music{" "}
            <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              behind the music.
            </span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed font-sans hero-enter-slide pointer-events-auto"
            style={{ animationDelay: "120ms" }}
          >
            Explore the rhythm, harmony, tempo, and musical ideas hidden inside
            the songs you love.
          </p>

          <div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 hero-enter-slide pointer-events-auto"
            style={{ animationDelay: "180ms" }}
          >
            <InteractiveHoverButton href="/analyze">
              Analyze a song
            </InteractiveHoverButton>

            <Link
              href="/learn"
              className="relative cursor-pointer py-3.5 px-8 text-center inline-flex items-center justify-center text-base font-medium text-text-primary rounded-xl overflow-hidden group transition-all duration-300 ease-in-out bg-surface-elevated/80 hover:bg-surface-hover backdrop-blur-md shadow-sm active:scale-[0.98]"
            >
              <span className="relative z-20 flex items-center gap-2.5">
                <TheoryBookIcon size={18} className="shrink-0" />
                <span>Explore music theory</span>
              </span>

              <span
                className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="w-1/2 transition-all duration-300 block border-white/25 absolute h-[20%] rounded-tl-xl border-l-2 border-t-2 top-0 left-0 pointer-events-none group-hover:border-accent-violet/80"
                aria-hidden="true"
              />
              <span
                className="w-1/2 transition-all duration-300 block border-white/25 absolute group-hover:h-[90%] h-[60%] rounded-tr-xl border-r-2 border-t-2 top-0 right-0 pointer-events-none group-hover:border-accent-violet/80"
                aria-hidden="true"
              />
              <span
                className="w-1/2 transition-all duration-300 block border-white/25 absolute h-[60%] group-hover:h-[90%] rounded-bl-xl border-l-2 border-b-2 left-0 bottom-0 pointer-events-none group-hover:border-accent-violet/80"
                aria-hidden="true"
              />
              <span
                className="w-1/2 transition-all duration-300 block border-white/25 absolute h-[20%] rounded-br-xl border-r-2 border-b-2 right-0 bottom-0 pointer-events-none group-hover:border-accent-violet/80"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
