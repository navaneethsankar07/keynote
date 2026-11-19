import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon, TheoryBookIcon, SparklesIcon } from "@/components/ui/Icons";
import { MusicalVisualizer } from "./MusicalVisualizer";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32">
      {/* Subtle radial ambient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(139,92,246,0.15),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow badge */}
          <div className="mb-6 inline-flex items-center gap-2">
            <Badge variant="violet" size="md">
              <SparklesIcon size={12} className="text-accent-violet" />
              <span>Keynote Music Intelligence • Phase 1 Foundation</span>
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="font-display max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1]">
            Discover the music{" "}
            <span className="bg-gradient-to-r from-accent-violet via-purple-300 to-accent-cyan bg-clip-text text-transparent">
              behind the music.
            </span>
          </h1>

          {/* Supporting text */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed font-sans">
            Explore the rhythm, harmony, tempo, and musical ideas hidden inside
            the songs you love.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4">
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

          {/* Subtle note about current phase */}
          <p className="mt-4 text-xs font-mono text-text-muted">
            Phase 1 Foundation & Design System active • Architecture ready for audio engine
          </p>
        </div>

        {/* Hero Visual Element: Interactive Audio Spectrum Shell */}
        <div className="mt-14 sm:mt-16 lg:mt-20">
          <MusicalVisualizer />
        </div>
      </div>
    </section>
  );
}
