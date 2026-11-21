"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SlidersIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";

export function AudioLabPreviewSection() {
  const tools = [
    {
      id: "bpm-tapper",
      title: "BPM Tapper",
      description:
        "Tap along to any song in real time to calculate exact tempo with millisecond averaging.",
      image: "/images/tools/bpm-tapper.jpg",
      badge: "Real-Time",
      tags: ["Tempo", "Rhythm", "Averaging"],
      accent: "#8B5CF6",
      href: "/audio-lab",
    },
    {
      id: "metronome",
      title: "Metronome",
      description:
        "Visual timekeeping with customizable subdivision clicks, swing accents, and time signatures.",
      image: "/images/tools/metronome.jpg",
      badge: "Precision",
      tags: ["Timekeeping", "Subdivision", "Meter"],
      accent: "#06B6D4",
      href: "/audio-lab",
    },
    {
      id: "pitch-explorer",
      title: "Pitch & Note Explorer",
      description:
        "Calibrate and explore frequency to note conversions from sub-bass to hypersonic overtones.",
      image: "/images/tools/pitch-explorer.jpg",
      badge: "Frequency",
      tags: ["Tuning", "440 Hz", "Harmonics"],
      accent: "#C084FC",
      href: "/audio-lab",
    },
    {
      id: "scale-explorer",
      title: "Scale Explorer",
      description:
        "Interactive diatonic, pentatonic, and exotic scale generator with instant step formulas.",
      image: "/images/tools/scale-explorer.jpg",
      badge: "Modal Theory",
      tags: ["Scales", "Modes", "Voicings"],
      accent: "#818CF8",
      href: "/audio-lab",
    },
    {
      id: "interval-explorer",
      title: "Interval Explorer",
      description:
        "Calculate semitone spans, inverted intervals, and psychoacoustic consonance rankings.",
      image: "/images/tools/interval-explorer.jpg",
      badge: "Acoustics",
      tags: ["Intervals", "Consonance", "Harmony"],
      accent: "#22D3EE",
      href: "/audio-lab",
    },
    {
      id: "waveform-visualizer",
      title: "Waveform Visualizer",
      description:
        "High-definition time-domain waveforms and spectral overtone waterfalls for visual inspection.",
      image: "/images/tools/waveform-visualizer.jpg",
      badge: "Spectral FFT",
      tags: ["Waveform", "Spectrogram", "Audio FFT"],
      accent: "#34D399",
      href: "/audio-lab",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#07080e]/60 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <Badge variant="cyan" size="md" className="mb-4">
            <SlidersIcon size={13} className="text-accent-cyan" />
            <span>Interactive Tools</span>
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
            Explore music{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              beyond the song.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Experiment with musical ideas, discover relationships between notes, and
            explore sound through interactive tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <NotchedProjectCard
              key={tool.id}
              href={tool.href}
              title={tool.title}
              description={tool.description}
              image={tool.image}
              badge={tool.badge}
              tags={tool.tags}
              accent={tool.accent}
              surface="#07080e"
            />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            href="/audio-lab"
            variant="secondary"
            size="lg"
            icon={<ArrowRightIcon size={18} />}
            iconPosition="right"
          >
            Explore Audio Lab
          </Button>
        </div>
      </div>
    </section>
  );
}
