import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon, TheoryBookIcon, SparklesIcon } from "@/components/ui/Icons";
import { SoundscapeBackground } from "./SoundscapeBackground";
import { MusicalVisualizer } from "./MusicalVisualizer";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
      {/* Living Musical Soundscape Background Animation */}
      <SoundscapeBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* 1. Intro label / Eyebrow badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 hero-enter-slide"
            style={{ animationDelay: "0ms" }}
          >
            <Badge variant="violet" size="md">
              <SparklesIcon size={12} className="text-accent-violet" />
              <span>Keynote Music Intelligence • Phase 2 Animated Hero</span>
            </Badge>
          </div>

          {/* 2. Headline with subtle upward movement */}
          <h1
            className="font-display max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] hero-enter-slide"
            style={{ animationDelay: "60ms" }}
          >
            Discover the music{" "}
            <span className="bg-gradient-to-r from-accent-violet via-purple-300 to-accent-cyan bg-clip-text text-transparent">
              behind the music.
            </span>
          </h1>

          {/* 3. Supporting text */}
          <p
            className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed font-sans hero-enter-slide"
            style={{ animationDelay: "120ms" }}
          >
            Explore the rhythm, harmony, tempo, and musical ideas hidden inside
            the songs you love.
          </p>

          {/* 4. Call to Action buttons */}
          <div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 hero-enter-slide"
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

          {/* 5. Subtle note about Phase 2 */}
          <p
            className="mt-4 text-xs font-mono text-text-muted hero-enter-fade"
            style={{ animationDelay: "240ms" }}
          >
            Ambient Soundscape Engine active • Acoustic signal field synthesized via code
          </p>
        </div>

        {/* 6. Hero Visual Element: Interactive Audio Spectrum & Deconstruction */}
        <div
          className="mt-14 sm:mt-16 lg:mt-20 hero-enter-fade"
          style={{ animationDelay: "280ms" }}
        >
          <MusicalVisualizer />
        </div>
      </div>
    </section>
  );
}
