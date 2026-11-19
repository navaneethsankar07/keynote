import React from "react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { TheoryBookIcon, SparklesIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Music Theory Hub (Preview) — Keynote",
  description:
    "Learn music theory through interactive visual concepts, scale modes, chord structures, and real-world song examples.",
};

export default function LearnPage() {
  const plannedCapabilities = [
    "Interactive Circle of Fifths with relative minor & modal rings",
    "Scale mode explorer (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian)",
    "Voice leading and chord substitution visualizer",
    "Ear training modules linked directly to popular musical passages",
    "Harmonic tension and resolution mapping across cadences",
    "Rhythmic polyrhythm and syncopation masterclasses",
  ];

  const mockPreview = (
    <div className="space-y-6">
      {/* Theory Module Cards Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#121524]/95 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-accent-cyan font-bold">MODULE 01</span>
            <span className="text-[10px] font-mono rounded-full bg-accent-cyan/10 px-2 py-0.5 text-accent-cyan border border-accent-cyan/30">
              7 Lessons
            </span>
          </div>
          <h4 className="font-display text-sm font-bold text-text-primary mt-3">
            Modal Harmony & Color
          </h4>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            Discover the emotional sonic fingerprint of Dorian, Lydian, and Phrygian modes.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121524]/95 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-accent-violet-light font-bold">MODULE 02</span>
            <span className="text-[10px] font-mono rounded-full bg-accent-violet/10 px-2 py-0.5 text-accent-violet-light border border-accent-violet/30">
              5 Lessons
            </span>
          </div>
          <h4 className="font-display text-sm font-bold text-text-primary mt-3">
            Harmonic Tension & Voice Leading
          </h4>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            Secondary dominants, tritone substitutions, and deceptive cadences in modern music.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121524]/95 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-400 font-bold">MODULE 03</span>
            <span className="text-[10px] font-mono rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/30">
              6 Lessons
            </span>
          </div>
          <h4 className="font-display text-sm font-bold text-text-primary mt-3">
            Time, Meter & Polyrhythms
          </h4>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            Deconstructing 7/8 grooves, 5/4 signatures, African hemiolas, and syncopation.
          </p>
        </div>
      </div>

      {/* Circle of Fifths Concept Preview */}
      <div className="rounded-2xl border border-white/10 bg-[#090b12]/95 p-6 text-center shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <SparklesIcon size={16} className="text-accent-cyan" />
          <span className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
            Harmonic Circle of Fifths Matrix
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          {[
            { major: "C", minor: "Am", sharps: "0#" },
            { major: "G", minor: "Em", sharps: "1#" },
            { major: "D", minor: "Bm", sharps: "2#" },
            { major: "A", minor: "F#m", sharps: "3#" },
            { major: "E", minor: "C#m", sharps: "4#" },
            { major: "B", minor: "G#m", sharps: "5#" },
            { major: "F#", minor: "D#m", sharps: "6#" },
            { major: "Db", minor: "Bbm", sharps: "5b" },
            { major: "Ab", minor: "Fm", sharps: "4b" },
            { major: "Eb", minor: "Cm", sharps: "3b" },
            { major: "Bb", minor: "Gm", sharps: "2b" },
            { major: "F", minor: "Dm", sharps: "1b" },
          ].map((item) => (
            <div
              key={item.major}
              className="rounded-xl border border-white/10 bg-[#141829] px-3.5 py-2 text-center hover:border-accent-violet hover:bg-[#1a2036] transition-all cursor-pointer group"
            >
              <span className="font-display text-xs font-bold text-text-primary block group-hover:text-accent-cyan">
                {item.major}
              </span>
              <span className="font-mono text-[10px] text-accent-violet-light block">
                {item.minor}
              </span>
              <span className="font-mono text-[9px] text-text-muted block">
                {item.sharps}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-text-muted mt-5">
          Interactive Harmonic Wheel with audio stem reference playback
        </p>
      </div>
    </div>
  );

  return (
    <PlaceholderPage
      title="Music Theory Learning Hub"
      badge="Phase 4 Curriculum"
      badgeVariant="cyan"
      phase="Phase 4"
      description="Connect the musical patterns you hear to formal music theory concepts: scale modes, chord substitutions, cadences, harmonic tension, and voice leading."
      icon={<TheoryBookIcon size={24} />}
      plannedFeatures={plannedCapabilities}
      mockPreview={mockPreview}
    />
  );
}
