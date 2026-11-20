"use client";

import React from "react";
import {
  MetronomeIcon,
  PianoKeysIcon,
  WaveformIcon,
  LayersIcon,
  SlidersIcon,
  ActivityIcon,
} from "@/components/ui/Icons";

const musicalDimensions = [
  {
    title: "Rhythm",
    tag: "01 • TEMPO & GROOVE",
    description:
      "Understand the beat, tempo, time signature, rhythmic feel, and groove of a song. Trace how swing, syncopation, and polyrhythms shape the kinetic energy.",
    icon: <MetronomeIcon size={20} />,
    color: "text-accent-violet",
    bg: "bg-accent-violet/10 border-accent-violet/25",
    glow: "rgba(139, 92, 246, 0.22)",
    pillColor: "text-purple-300",
  },
  {
    title: "Harmony",
    tag: "02 • CHORDS & MODES",
    description:
      "Explore chords, chord progressions, harmonic relationships, and tonal context. Unpack how tension and resolution drive emotional momentum.",
    icon: <PianoKeysIcon size={20} />,
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10 border-accent-cyan/25",
    glow: "rgba(6, 182, 212, 0.22)",
    pillColor: "text-cyan-300",
  },
  {
    title: "Melody",
    tag: "03 • PITCH CONTOURS",
    description:
      "Understand melodic movement, pitch relationships, phrasing, and recurring motifs. Follow how vocal curves lift across chorus peaks and resolve into verses.",
    icon: <WaveformIcon size={20} />,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/25",
    glow: "rgba(168, 85, 247, 0.22)",
    pillColor: "text-purple-300",
  },
  {
    title: "Tonality",
    tag: "04 • SCALES & GRAVITY",
    description:
      "Explore the musical key, scale, tonal center, and relationship between notes. Trace how modal shifts inject subtle color changes into songs.",
    icon: <ActivityIcon size={20} />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/25",
    glow: "rgba(56, 189, 248, 0.22)",
    pillColor: "text-cyan-300",
  },
  {
    title: "Structure",
    tag: "05 • ARRANGEMENT FLOW",
    description:
      "Discover how a song is organized into sections such as intro, verse, chorus, bridge, and outro. Trace the arrangement timeline and energy dynamics.",
    icon: <LayersIcon size={20} />,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/25",
    glow: "rgba(99, 102, 241, 0.22)",
    pillColor: "text-indigo-300",
  },
  {
    title: "Instruments & Sound",
    tag: "06 • ACOUSTIC TEXTURES",
    description:
      "Explore the instruments, sound layers, textures, and musical elements that contribute to the song's sonic identity and acoustic space.",
    icon: <SlidersIcon size={20} />,
    color: "text-teal-400",
    bg: "bg-teal-500/10 border-teal-500/25",
    glow: "rgba(20, 184, 166, 0.22)",
    pillColor: "text-teal-300",
  },
];

export function MusicalDnaSection() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
            What you can discover{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              inside every song.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Every piece of music is an interconnected system of rhythm, harmony, and tone.
            Keynote deconstructs these dimensions into clear, intuitive insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicalDimensions.map((item) => (
            <div
              key={item.title}
              onMouseMove={handleMouseMove}
              className="group relative rounded-[22px] border border-white/15 bg-[#0a0c16]/75 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] cursor-pointer select-none transition-all duration-500 ease-out hover:scale-[1.04] active:scale-[0.96] active:rotate-[1.7deg] overflow-hidden"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${item.glow}, transparent 65%)`,
                }}
              />

              <div
                className="pointer-events-none absolute -inset-px rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(220px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.45), transparent 70%)`,
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  padding: "1px",
                }}
              />

              <span
                className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${item.bg} ${item.color} shadow-lg shadow-black/40 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      {item.icon}
                    </div>

                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-text-muted group-hover:border-white/25 transition-colors">
                      <span className={item.pillColor}>{item.tag}</span>
                      <div className="flex items-end gap-0.5 h-2.5 w-2">
                        <span className="w-0.5 bg-accent-violet rounded-full h-1.5 group-hover:h-2.5 transition-all duration-300" />
                        <span className="w-0.5 bg-accent-cyan rounded-full h-2.5 group-hover:h-1.5 transition-all duration-300" />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white group-hover:to-accent-cyan transition-all duration-300 mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-text-muted opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 group-hover:shadow-[0_0_8px_#34d399]" />
                    Analysis Ready
                  </span>
                  <span className="text-[11px] text-text-muted group-hover:text-white transition-colors">
                    Deconstruct →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
