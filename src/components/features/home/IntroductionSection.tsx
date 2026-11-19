"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { WaveformIcon, ActivityIcon, SparklesIcon } from "@/components/ui/Icons";

export function IntroductionSection() {
  const [activeHarmonic, setActiveHarmonic] = useState<number>(1);

  const harmonics = [
    {
      num: 1,
      label: "Fundamental (f₀)",
      note: "C3",
      freq: "130.8 Hz",
      role: "Root acoustic weight & tonal anchor",
      waveColor: "#a78bfa",
      path: "M 0 50 Q 50 15, 100 50 T 200 50 T 300 50 T 400 50",
    },
    {
      num: 2,
      label: "2nd Harmonic (2f₀)",
      note: "C4",
      freq: "261.6 Hz",
      role: "Perfect octave reinforcement",
      waveColor: "#818cf8",
      path: "M 0 50 Q 25 22, 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50",
    },
    {
      num: 3,
      label: "3rd Harmonic (3f₀)",
      note: "G4",
      freq: "392.0 Hz",
      role: "Perfect fifth harmonic tension",
      waveColor: "#22d3ee",
      path: "M 0 50 Q 16.6 28, 33.3 50 T 66.6 50 T 100 50 T 133.3 50 T 166.6 50 T 200 50 T 233.3 50 T 266.6 50 T 300 50 T 333.3 50 T 366.6 50 T 400 50",
    },
    {
      num: 4,
      label: "4th Harmonic (4f₀)",
      note: "C5",
      freq: "523.2 Hz",
      role: "Double octave sonic shimmer & air",
      waveColor: "#38bdf8",
      path: "M 0 50 Q 12.5 32, 25 50 T 50 50 T 75 50 T 100 50 T 125 50 T 150 50 T 175 50 T 200 50 T 225 50 T 250 50 T 275 50 T 300 50 T 325 50 T 350 50 T 375 50 T 400 50",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#07080e]/60 overflow-hidden">
      {/* Background ambient radial gradients */}
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
            <Badge variant="violet" size="md">
              <SparklesIcon size={13} className="text-accent-violet" />
              <span>Acoustic Deconstruction</span>
            </Badge>

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

          {/* Right Column: Interactive Acoustic Harmonic Resonance Canvas */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-white/10 bg-[#0a0c14]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
              {/* Subtle top studio grid lines */}
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"
                aria-hidden="true"
              />

              {/* Panel Header */}
              <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-accent-cyan animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                    Harmonic Series Inspector
                  </span>
                </div>
                <span className="font-mono text-xs text-accent-violet-light bg-accent-violet/10 border border-accent-violet/20 px-2.5 py-0.5 rounded-full">
                  A = 440 Hz Standard
                </span>
              </div>

              {/* Waveform Oscilloscope Display */}
              <div className="relative z-10 my-6 h-36 w-full rounded-2xl bg-[#06070a] border border-white/5 flex items-center justify-center overflow-hidden px-4">
                {/* Horizontal center guide line */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10 border-dashed" />

                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {harmonics.map((h) => {
                    const isSelected = activeHarmonic === h.num;
                    return (
                      <path
                        key={h.num}
                        d={h.path}
                        fill="none"
                        stroke={h.waveColor}
                        strokeWidth={isSelected ? "2.5" : "1"}
                        strokeOpacity={isSelected ? "1" : "0.2"}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>

                {/* Floating frequency readout overlay */}
                <div className="absolute bottom-2.5 right-3 font-mono text-[11px] text-text-muted flex items-center gap-2 bg-[#06070a]/80 px-2 py-0.5 rounded-md border border-white/5">
                  <span>{harmonics[activeHarmonic - 1].note}</span>
                  <span>•</span>
                  <span className="text-white">{harmonics[activeHarmonic - 1].freq}</span>
                </div>
              </div>

              {/* Interactive Overtone Selector Tabs */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {harmonics.map((h) => {
                  const isSelected = activeHarmonic === h.num;
                  return (
                    <button
                      key={h.num}
                      type="button"
                      onClick={() => setActiveHarmonic(h.num)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-accent-violet/50 bg-white/10 shadow-lg shadow-accent-violet/10 text-white"
                          : "border-white/5 bg-white/[0.02] text-text-secondary hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="text-[10px] font-mono text-text-muted">
                        Part {h.num}
                      </span>
                      <span className="text-xs font-semibold mt-0.5" style={{ color: isSelected ? h.waveColor : undefined }}>
                        {h.note}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted mt-0.5">
                        {h.freq}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Musical Context Description */}
              <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-text-muted font-mono">
                <span className="text-text-secondary">Function:</span>
                <span className="text-text-primary text-right font-sans font-medium">
                  {harmonics[activeHarmonic - 1].role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
