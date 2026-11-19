import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon, TheoryBookIcon, SparklesIcon } from "@/components/ui/Icons";

export function FinalCtaSection() {
  return (
    <section className="relative py-28 sm:py-36 border-t border-white/5 bg-[#06070c] overflow-hidden">
      {/* Background radial atmospheric bloom */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] max-w-[130vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12)_0%,rgba(6,182,212,0.04)_45%,transparent_75%)] blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Decorative subtle harmonic wave rings */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.03] -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.04] -z-10"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="violet" size="md" className="mb-6 inline-flex">
          <SparklesIcon size={13} className="text-accent-violet" />
          <span>Begin Your Musical Journey</span>
        </Badge>

        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-[1.12]">
          Your favorite songs have{" "}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            more to reveal.
          </span>
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
          Explore the rhythm, harmony, melodies, and musical ideas behind the songs you love.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href="/analyze"
            variant="primary"
            size="lg"
            icon={<ArrowRightIcon size={18} />}
            iconPosition="right"
          >
            Start exploring
          </Button>

          <Button
            href="/learn"
            variant="secondary"
            size="lg"
            icon={<TheoryBookIcon size={18} />}
            iconPosition="left"
          >
            Browse music theory
          </Button>
        </div>

        {/* Subtle System Status Ticker */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-text-muted">
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
