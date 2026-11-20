import React from "react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "1",
      title: "Enter your track",
      description:
        "Search for any release across global catalogs or upload audio files to instantly check acoustic characteristics.",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      bullets: [
        "Smart search understands artist names, song titles, and fuzzy queries",
        "Support for lossless WAV, FLAC, AIFF, and standard MP3 audio",
        "Instant acoustic ingestion with audio waveform rendering",
      ],
    },
    {
      step: "2",
      title: "Deconstruct musical DNA",
      description:
        "Keynote separates the track into core musical layers, analyzing rhythm, harmony, and melodic contour.",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
      ),
      bullets: [
        "Groove grid analysis with dynamic tempo and swing detection",
        "Harmonic chord progression mapping and Roman numeral analysis",
        "Tonal center identification, key modulation, and scale degrees",
      ],
    },
    {
      step: "3",
      title: "Understand why it works",
      description:
        "Transform raw acoustic features into clear music theory insights that explain emotion, tension, and flow.",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      bullets: [
        "Detailed voice leading, cadence, and tension-resolution explanations",
        "Arrangement timeline tracking energy build-ups and breakdowns",
        "Actionable songwriting and production insights for creators",
      ],
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#07080e]/60 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            How it works
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Keynote deconstructs any audio track into clear, interactive musical
            elements using advanced acoustic analysis and music theory.
          </p>
        </div>

        <div className="relative mb-12 hidden md:block">
          <div
            className="absolute top-1/2 left-[16.666%] right-[16.666%] h-px bg-white/15 -translate-y-1/2"
            aria-hidden="true"
          />
          <div className="grid grid-cols-3 gap-6 lg:gap-8">
            {steps.map((item, idx) => (
              <div key={idx} className="flex justify-center">
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#111217] border border-white/20 text-xs font-semibold text-white shadow-lg">
                  {item.step}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-[26px] bg-[#111217] border border-white/[0.08] p-7 sm:p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.8),0_0_35px_rgba(139,92,246,0.12)] overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute inset-0 rounded-[26px] bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-white/90 group-hover:scale-105 group-hover:bg-accent-violet/15 group-hover:border-accent-violet/40 group-hover:text-accent-cyan transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="md:hidden flex h-7 w-7 items-center justify-center rounded-full bg-[#181922] border border-white/15 text-xs font-semibold text-white">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl sm:text-[22px] font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>

                <ul className="mt-auto space-y-3.5 pt-6 border-t border-white/[0.06]">
                  {item.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-3 text-sm text-zinc-300/90 leading-snug"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 flex-shrink-0 group-hover:bg-accent-cyan group-hover:shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-all duration-300" />
                      <span>{bullet}</span>
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
