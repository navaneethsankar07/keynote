"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, TheoryBookIcon } from "@/components/ui/Icons";

// Dynamically import 3D TubesSoundscape with ssr: false to guarantee clean client-only WebGL mounting
const TubesSoundscape = dynamic(
  () => import("./TubesSoundscape").then((mod) => mod.TubesSoundscape),
  { ssr: false }
);

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center overflow-hidden py-16 sm:py-24">
      {/* 3D Interactive Neon Tubes Musical Soundscape */}
      <TubesSoundscape />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 my-auto">
        <div className="flex flex-col items-center text-center">
          {/* 1. Headline with subtle upward movement */}
          <h1
            className="font-display max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] hero-enter-slide pointer-events-auto select-none"
            style={{ animationDelay: "0ms" }}
          >
            Discover the music{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              behind the music.
            </span>
          </h1>

          {/* 3. Supporting text */}
          <p
            className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed font-sans hero-enter-slide pointer-events-auto"
            style={{ animationDelay: "120ms" }}
          >
            Explore the rhythm, harmony, tempo, and musical ideas hidden inside
            the songs you love.
          </p>

          {/* 4. Call to Action buttons */}
          <div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 hero-enter-slide pointer-events-auto"
            style={{ animationDelay: "180ms" }}
          >
            <Button
              href="/analyze"
              variant="primary"
              size="lg"
              icon={<ArrowRightIcon size={18} />}
              iconPosition="right"
            >
              Analyze a song
            </Button>

            <Button
              href="/learn"
              variant="secondary"
              size="lg"
              icon={<TheoryBookIcon size={18} />}
              iconPosition="left"
            >
              Explore music theory
            </Button>
          </div>

          {/* 5. Interactive hint */}
          <p
            className="mt-8 text-xs font-mono text-text-muted hero-enter-fade pointer-events-auto"
            style={{ animationDelay: "240ms" }}
          >
            Move cursor to guide 3D neon tubes • Click background to change animation colors
          </p>
        </div>
      </div>
    </section>
  );
}
