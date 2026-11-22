"use client";

import React from "react";
import Image from "next/image";

const musicalDimensions = [
  {
    title: "Rhythm",
    description:
      "Understand the beat, tempo, time signature, rhythmic feel, and groove of a song. Trace how swing, syncopation, and polyrhythms shape the kinetic energy.",
    image3d: "/images/3d/metronome.png",
    imageAlt: "3D Metronome",
    bgClass: "bg-[#e32832]",
    textTitleClass: "text-white",
    textDescClass: "text-white/85",
    shadowClass: "hover:shadow-[0_20px_50px_rgba(227,40,50,0.35)]",
  },
  {
    title: "Harmony",
    description:
      "Explore the chords, progressions, voice leading, and harmonic movement that create emotional depth, tension, and resolution across every measure.",
    image3d: "/images/3d/piano.png",
    imageAlt: "3D Grand Piano",
    bgClass: "bg-[#16171d] border border-white/10",
    textTitleClass: "text-white",
    textDescClass: "text-zinc-400",
    shadowClass: "hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]",
  },
  {
    title: "Melody",
    description:
      "Trace the vocal or lead contours, pitch movements, motifs, and expressive phrasing that make hooks memorable, singable, and emotionally resonant.",
    image3d: "/images/3d/microphone.png",
    imageAlt: "3D Vintage Microphone",
    bgClass: "bg-[#16171d] border border-white/10",
    textTitleClass: "text-white",
    textDescClass: "text-zinc-400",
    shadowClass: "hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]",
  },
  {
    title: "Tonality",
    description:
      "Identify the musical key, tonic center, modal color, and harmonic stability. Observe how modulations shift mood from major hope to minor introspection.",
    image3d: "/images/3d/guitar.png",
    imageAlt: "3D Electric Guitar",
    bgClass: "bg-[#2563eb]",
    textTitleClass: "text-white",
    textDescClass: "text-white/85",
    shadowClass: "hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)]",
  },
  {
    title: "Structure",
    description:
      "Map how a track transitions through intro, verse, pre-chorus, hook, bridge, drop, and outro to build dramatic arc, pacing, and dynamic release.",
    image3d: "/images/3d/headphones.png",
    imageAlt: "3D Studio Headphones",
    bgClass: "bg-[#16171d] border border-white/10",
    textTitleClass: "text-white",
    textDescClass: "text-zinc-400",
    shadowClass: "hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]",
  },
  {
    title: "Instruments & Sound",
    description:
      "Identify the core instrumentation, synthesizer textures, acoustic timbres, and spatial production techniques that craft the track's distinctive sonic identity.",
    image3d: "/images/3d/violin.png",
    imageAlt: "3D Classical Violin",
    bgClass: "bg-[#e32832]",
    textTitleClass: "text-white",
    textDescClass: "text-white/85",
    shadowClass: "hover:shadow-[0_20px_50px_rgba(227,40,50,0.35)]",
  },
];

export function MusicalDnaSection() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
            What you can discover{" "}
            <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
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
                  className={`mt-3 text-xs sm:text-sm leading-relaxed font-sans line-clamp-3 sm:line-clamp-4 ${item.textDescClass}`}
                >
                  {item.description}
                </p>
              </div>

              <div className="absolute right-0 bottom-0 top-0 w-[42%] sm:w-[40%] flex items-center justify-center p-3 sm:p-4 overflow-hidden pointer-events-none">
                <div className="relative w-full h-full max-h-[190px] sm:max-h-[210px] transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1">
                  <Image
                    src={item.image3d}
                    alt={item.imageAlt}
                    fill
                    className="object-contain object-right-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
                    sizes="(max-width: 768px) 40vw, 25vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
