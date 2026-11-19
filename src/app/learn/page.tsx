import React from "react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { TheoryBookIcon } from "@/components/ui/Icons";

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
        <div className="rounded-xl border border-border bg-surface-elevated/70 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-accent-cyan">Module 01</span>
            <span className="text-[10px] font-mono text-text-muted">7 Lessons</span>
          </div>
          <h4 className="font-display text-sm font-semibold text-text-primary mt-2">
            Modal Harmony & Color
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            Understanding why Dorian sounds soulful and Lydian sounds bright.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-elevated/70 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-accent-violet-light">Module 02</span>
            <span className="text-[10px] font-mono text-text-muted">5 Lessons</span>
          </div>
          <h4 className="font-display text-sm font-semibold text-text-primary mt-2">
            Chord Progressions & Tension
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            Secondary dominants, tritone substitutions, and deceptive cadences.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-elevated/70 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-400">Module 03</span>
            <span className="text-[10px] font-mono text-text-muted">6 Lessons</span>
          </div>
          <h4 className="font-display text-sm font-semibold text-text-primary mt-2">
            Time, Meter & Polyrhythms
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            Mastering 7/8, 5/4, hemiolas, and complex syncopations.
          </p>
        </div>
      </div>

      {/* Circle of Fifths Concept Preview Wireframe */}
      <div className="rounded-xl border border-border/80 bg-background/80 p-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
          {["C Major", "G Major", "D Major", "A Major", "E Major", "B Major", "F# Major", "Db Major", "Ab Major", "Eb Major", "Bb Major", "F Major"].map((key) => (
            <span
              key={key}
              className="rounded-lg border border-border/70 bg-surface px-3 py-1.5 font-mono text-xs text-text-secondary hover:text-text-primary hover:border-accent-violet/40 transition-colors"
            >
              {key}
            </span>
          ))}
        </div>
        <p className="text-xs font-mono text-text-muted mt-4">
          Interactive Harmonic Wheel will be functional in Phase 3
        </p>
      </div>
    </div>
  );

  return (
    <PlaceholderPage
      title="Music Theory Learning Hub"
      badge="Phase 3 Feature"
      badgeVariant="cyan"
      phase="Phase 3"
      description="Connect the musical patterns you hear to formal music theory concepts: scale modes, chord substitutions, cadences, harmonic tension, and voice leading."
      icon={<TheoryBookIcon size={24} />}
      plannedFeatures={plannedCapabilities}
      mockPreview={mockPreview}
    />
  );
}
