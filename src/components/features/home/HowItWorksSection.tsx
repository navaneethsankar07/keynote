import React from "react";
import { Badge } from "@/components/ui/Badge";
import { WaveformIcon, SlidersIcon, TheoryBookIcon } from "@/components/ui/Icons";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Choose a song",
      description:
        "Start with a song you love. Search for a track or eventually provide audio for analysis.",
      icon: <WaveformIcon size={22} className="text-accent-violet" />,
      accentColor: "#a78bfa",
      visual: (
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Input Track</span>
            <span className="text-accent-violet">Lossless Audio</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-accent-violet/20 border border-accent-violet/30 flex items-center justify-center text-accent-violet shrink-0">
              <WaveformIcon size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Reckoner • Radiohead</div>
              <div className="text-[10px] text-text-muted">In Rainbows • 4m 50s</div>
            </div>
          </div>
          {/* Waveform graphic */}
          <div className="flex items-center gap-0.5 h-6 pt-1">
            {[40, 65, 80, 50, 90, 75, 45, 60, 95, 85, 70, 55, 90, 100, 80, 60, 45, 70, 85, 60].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-full bg-accent-violet/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      step: "02",
      title: "Explore its musical DNA",
      description:
        "Discover its rhythm, tempo, harmony, melody, structure, and other musical characteristics.",
      icon: <SlidersIcon size={22} className="text-accent-cyan" />,
      accentColor: "#22d3ee",
      visual: (
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Deconstruction Engine</span>
            <span className="text-accent-cyan">Multi-Layer</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-text-muted block text-[10px]">Tempo</span>
              <span className="text-white font-bold">103.5 BPM</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-text-muted block text-[10px]">Tonal Center</span>
              <span className="text-accent-cyan font-bold">B Minor / Dorian</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-text-muted block text-[10px]">Meter</span>
              <span className="text-white font-bold">4/4 Polymeter</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-text-muted block text-[10px]">Harmony</span>
              <span className="text-accent-violet-light font-bold">Cmaj7 - D - Em</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: "03",
      title: "Understand the music",
      description:
        "Explore the findings with clear explanations, visualizations, and musical context that help you understand why the song sounds the way it does.",
      icon: <TheoryBookIcon size={22} className="text-purple-400" />,
      accentColor: "#c084fc",
      visual: (
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Musical Context</span>
            <span className="text-purple-300">Why It Works</span>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-text-secondary leading-relaxed">
            <span className="text-white font-medium block mb-1">Descending Voice Leading:</span>
            The emotional lift in the chorus comes from an ambiguous major 7th resolve against an insistent minor ostinato.
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-text-muted pt-1">
            <span>Theory Link: Modal Mixture</span>
            <span className="text-accent-cyan">Read Note →</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#07080e]/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <Badge variant="violet" size="md" className="mb-4">
            <span>Process & Architecture</span>
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
            How Keynote works.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            From intuitive curiosity to deep musical appreciation in three connected steps.
          </p>
        </div>

        {/* Connected 3-Step Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Connecting Line (Desktop) */}
          <div
            className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-accent-violet via-accent-cyan to-purple-400 opacity-20 -z-0"
            aria-hidden="true"
          />

          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative z-10 flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0c0d16]/90 p-6 sm:p-8 shadow-xl hover:border-white/20 transition-all duration-300 group"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-white/20 group-hover:text-white/40 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                  {item.description}
                </p>
              </div>

              {/* Illustrative Micro-Visual */}
              <div className="mt-auto pt-4 border-t border-white/5">
                {item.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
