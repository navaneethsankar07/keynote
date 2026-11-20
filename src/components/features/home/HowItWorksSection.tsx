import React from "react";
import { Badge } from "@/components/ui/Badge";
import { WaveformIcon, SlidersIcon, TheoryBookIcon } from "@/components/ui/Icons";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Choose a song",
      description:
        "Start with a song you love. Search for a track or provide audio for instant deep analysis.",
      icon: <WaveformIcon size={22} className="text-accent-violet" />,
    },
    {
      step: "02",
      title: "Explore its musical DNA",
      description:
        "Discover its rhythm, tempo, harmony, melody, structure, and underlying musical characteristics.",
      icon: <SlidersIcon size={22} className="text-accent-cyan" />,
    },
    {
      step: "03",
      title: "Understand the music",
      description:
        "Explore findings with clear explanations, tonal relationships, and musical insights that reveal how the song works.",
      icon: <TheoryBookIcon size={22} className="text-purple-400" />,
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#07080e]/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-white/20 group-hover:text-white/40 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
