import React from "react";
import { Search, Layers, Zap } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      title: "Choose a song",
      description:
        "Start with a song you love. Search our catalog of millions of tracks or provide audio for deep musical analysis.",
      icon: <Search className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />,
      bullets: [
        "Search catalog of popular and timeless tracks",
        "High-fidelity 30s audio previews with real-time sync",
        "Instant stem and acoustic profile retrieval",
      ],
    },
    {
      title: "Explore its musical DNA",
      description:
        "Discover rhythm, tempo, harmony, melody, and structure deconstructed into intuitive visual dimensions.",
      icon: <Layers className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />,
      bullets: [
        "Real-time BPM, meter, and groove grid analysis",
        "Chord progressions and roman numeral harmony",
        "Vocal pitch contour arcs and tonal centers",
      ],
    },
    {
      title: "Understand the music",
      description:
        "Learn why the song works with clear music theory explanations, tonal relationships, and harmonic context.",
      icon: <Zap className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />,
      bullets: [
        "Harmonic tension, cadence, and voice leading",
        "Modal shifts and key signature modulation",
        "Interactive audio lab tools and spectral insights",
      ],
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#08090d] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            How it works
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#8e93a0] leading-relaxed max-w-2xl font-sans">
            Keynote combines audio signal processing and music theory to deconstruct any song into intuitive musical elements.
          </p>
        </div>

        <div className="relative mb-10 sm:mb-12 max-w-6xl mx-auto">
          <div
            className="hidden md:block absolute top-1/2 -translate-y-1/2 left-[16.666%] right-[16.666%] h-px bg-[#262833]"
            aria-hidden="true"
          />
          <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
            <div className="flex justify-center">
              <div className="relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#14151b] border border-[#2b2d38] text-xs font-semibold text-white/90 shadow-md">
                1
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#14151b] border border-[#2b2d38] text-xs font-semibold text-white/90 shadow-md">
                2
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#14151b] border border-[#2b2d38] text-xs font-semibold text-white/90 shadow-md">
                3
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-between max-w-[240px] mx-auto relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-px bg-[#262833]" aria-hidden="true" />
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#14151b] border border-[#2b2d38] text-xs font-semibold text-white/90">
              1
            </div>
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#14151b] border border-[#2b2d38] text-xs font-semibold text-white/90">
              2
            </div>
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#14151b] border border-[#2b2d38] text-xs font-semibold text-white/90">
              3
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#121318] p-7 sm:p-8 shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_0_35px_rgba(255,255,255,0.03)] overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:scale-105 transition-all duration-300 mb-6">
                  {item.icon}
                </div>

                <h3 className="font-display text-xl sm:text-[22px] font-bold text-white mb-2.5 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-sm text-[#8e93a0] leading-relaxed mb-6 font-sans">
                  {item.description}
                </p>

                <ul className="space-y-3">
                  {item.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#9da1b4] font-sans"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#525666] mt-1.5 shrink-0 group-hover:bg-[#8e93a0] transition-colors duration-300" />
                      <span className="leading-snug group-hover:text-zinc-200 transition-colors duration-300">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
