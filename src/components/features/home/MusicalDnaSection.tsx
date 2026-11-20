"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
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
    description:
      "Understand the beat, tempo, time signature, rhythmic feel, and groove of a song. Trace how swing, syncopation, and polyrhythms shape the kinetic energy.",
    icon: <MetronomeIcon size={20} />,
    color: "text-accent-violet",
    bg: "bg-accent-violet/10 border-accent-violet/20",
    hoverBorder: "hover:border-accent-violet/30",
  },
  {
    title: "Harmony",
    description:
      "Explore chords, chord progressions, harmonic relationships, and tonal context. Unpack how tension and resolution drive emotional momentum.",
    icon: <PianoKeysIcon size={20} />,
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10 border-accent-cyan/20",
    hoverBorder: "hover:border-accent-cyan/30",
  },
  {
    title: "Melody",
    description:
      "Understand melodic movement, pitch relationships, phrasing, and recurring motifs. Follow how vocal curves lift across chorus peaks and resolve into verses.",
    icon: <WaveformIcon size={20} />,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    hoverBorder: "hover:border-purple-500/30",
  },
  {
    title: "Tonality",
    description:
      "Explore the musical key, scale, tonal center, and relationship between notes. Trace how modal shifts inject subtle color changes into songs.",
    icon: <ActivityIcon size={20} />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    hoverBorder: "hover:border-cyan-500/30",
  },
  {
    title: "Structure",
    description:
      "Discover how a song is organized into sections such as intro, verse, chorus, bridge, and outro. Trace the arrangement timeline and energy dynamics.",
    icon: <LayersIcon size={20} />,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    hoverBorder: "hover:border-indigo-500/30",
  },
  {
    title: "Instruments & Sound",
    description:
      "Explore the instruments, sound layers, textures, and musical elements that contribute to the song's sonic identity and acoustic space.",
    icon: <SlidersIcon size={20} />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    hoverBorder: "hover:border-cyan-500/30",
  },
];

export function MusicalDnaSection() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge variant="cyan" size="md" className="mb-4">
            <LayersIcon size={13} className="text-accent-cyan" />
            <span>Musical DNA</span>
          </Badge>

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
              className={`rounded-3xl border border-white/10 bg-[#0c0d16]/90 p-6 sm:p-8 flex flex-col shadow-xl relative overflow-hidden group ${item.hoverBorder} transition-all duration-300`}
            >
              <div className="flex items-center gap-3.5 mb-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.bg} ${item.color}`}
                >
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {item.title}
                </h3>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
