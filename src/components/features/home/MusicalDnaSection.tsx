"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { LayersIcon } from "@/components/ui/Icons";

const musicalDimensions = [
  {
    title: "Rhythm",
    description:
      "Understand the beat, tempo, time signature, rhythmic feel, and groove of a song. Trace how swing, syncopation, and polyrhythms shape the kinetic energy.",
    image3d: "/images/3d/metronome.png",
    imageAlt: "3D Metronome",
    bgClass: "bg-[#e32832]",
    textTitleClass: "text-[#171717]",
    textDescClass: "text-[#171717]/85",
    shadowClass: "shadow-[0_20px_50px_-10px_rgba(227,40,50,0.35)]",
    imgWrapClass: "bottom-0 right-2 sm:right-4 w-[140px] sm:w-[180px] md:w-[200px] h-[160px] sm:h-[200px] md:h-[220px]",
  },
  {
    title: "Harmony",
    description:
      "Explore chords, chord progressions, harmonic relationships, and tonal context. Unpack how tension and resolution drive emotional momentum.",
    image3d: "/images/3d/piano.png",
    imageAlt: "3D Piano",
    bgClass: "bg-[#171717] border border-white/10 hover:border-white/20",
    textTitleClass: "text-white",
    textDescClass: "text-white/70",
    shadowClass: "shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]",
    imgWrapClass: "bottom-0 right-2 sm:right-4 w-[150px] sm:w-[190px] md:w-[210px] h-[150px] sm:h-[190px] md:h-[210px]",
  },
  {
    title: "Melody",
    description:
      "Understand melodic movement, pitch relationships, phrasing, and recurring motifs. Follow how vocal curves lift across chorus peaks and resolve into verses.",
    image3d: "/images/3d/microphone.png",
    imageAlt: "3D Studio Microphone",
    bgClass: "bg-[#171717] border border-white/10 hover:border-white/20",
    textTitleClass: "text-white",
    textDescClass: "text-white/70",
    shadowClass: "shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]",
    imgWrapClass: "bottom-0 right-4 sm:right-8 w-[110px] sm:w-[140px] md:w-[160px] h-[160px] sm:h-[210px] md:h-[230px]",
  },
  {
    title: "Tonality",
    description:
      "Explore the musical key, scale, tonal center, and relationship between notes. Trace how modal shifts inject subtle color changes into songs.",
    image3d: "/images/3d/tonality.png",
    imageAlt: "3D Circle of Fifths Tonal Wheel",
    bgClass: "bg-[#2873ec]",
    textTitleClass: "text-[#171717]",
    textDescClass: "text-[#171717]/85",
    shadowClass: "shadow-[0_20px_50px_-10px_rgba(40,115,236,0.35)]",
    imgWrapClass: "bottom-0 right-2 sm:right-4 w-[150px] sm:w-[190px] md:w-[210px] h-[150px] sm:h-[190px] md:h-[210px]",
  },
  {
    title: "Structure",
    description:
      "Discover how a song is organized into sections such as intro, verse, chorus, bridge, and outro. Trace the arrangement timeline and energy dynamics.",
    image3d: "/images/3d/structure-blocks.png",
    imageAlt: "3D Structure Blocks",
    bgClass: "bg-[#171717] border border-white/10 hover:border-white/20",
    textTitleClass: "text-white",
    textDescClass: "text-white/70",
    shadowClass: "shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]",
    imgWrapClass: "bottom-0 right-2 sm:right-4 w-[150px] sm:w-[190px] md:w-[210px] h-[140px] sm:h-[175px] md:h-[195px]",
  },
  {
    title: "Instruments & Sound",
    description:
      "Explore the instruments, sound layers, textures, and musical elements that contribute to the song's sonic identity and acoustic space.",
    image3d: "/images/3d/headphones.png",
    imageAlt: "3D Studio Headphones",
    bgClass: "bg-[#171717] border border-white/10 hover:border-white/20",
    textTitleClass: "text-white",
    textDescClass: "text-white/70",
    shadowClass: "shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]",
    imgWrapClass: "bottom-0 right-2 sm:right-4 w-[140px] sm:w-[180px] md:w-[200px] h-[160px] sm:h-[200px] md:h-[220px]",
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {musicalDimensions.map((item) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-[28px] p-7 sm:p-8 md:p-9 min-h-[220px] sm:min-h-[240px] md:min-h-[260px] flex flex-col justify-between transition-all duration-500 ease-out hover:scale-[1.02] cursor-pointer ${item.bgClass} ${item.shadowClass}`}
            >
              <div className="relative z-10 max-w-[62%] sm:max-w-[60%] flex flex-col justify-start">
                <h3
                  className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${item.textTitleClass}`}
                >
                  {item.title}
                </h3>

                <p
                  className={`mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed font-sans ${item.textDescClass}`}
                >
                  {item.description}
                </p>
              </div>

              <div
                className={`absolute pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1.5 flex items-end justify-end ${item.imgWrapClass}`}
              >
                <Image
                  src={item.image3d}
                  alt={item.imageAlt}
                  width={240}
                  height={240}
                  className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
