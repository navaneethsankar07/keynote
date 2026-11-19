import React from "react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { WaveformIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Song Analyzer (Preview) — Keynote",
  description:
    "Deconstruct recorded audio into musical elements: tempo, key signatures, chord progressions, and rhythm structures.",
};

export default function AnalyzePage() {
  const plannedCapabilities = [
    "High-precision BPM tracking with variable tempo mapping",
    "Tonal center and musical key detection (Major, Minor, Modes)",
    "Roman numeral harmonic analysis and chord identification",
    "Audio stem separation preview (Vocals, Drums, Bass, Instruments)",
    "Time signature and meter change timeline marker",
    "Interactive waveform scrubber with transient beat grid",
  ];

  const mockPreview = (
    <div className="space-y-6">
      {/* Upload Dropzone Preview (Non-functional) */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 sm:p-12 text-center bg-surface/50">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated text-accent-violet border border-border">
          <WaveformIcon size={28} />
        </div>
        <h4 className="font-display text-base sm:text-lg font-semibold text-text-primary mt-4">
          Audio Input Pipeline (Coming in Phase 2)
        </h4>
        <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-md mx-auto">
          In Phase 2, this workspace will accept audio files (MP3, WAV, FLAC) and stream audio directly to the signal-processing engine.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface-elevated px-3 py-1 text-xs font-mono text-text-muted border border-border">
          <span>Engine Status: Awaiting Phase 2 Signal Processor</span>
        </div>
      </div>

      {/* Mock Analysis Dashboard Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border/80 bg-surface-elevated/60 p-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Tempo Analysis
          </span>
          <p className="mt-1 font-display text-xl font-bold text-text-primary">
            -- BPM
          </p>
          <span className="text-[11px] text-text-muted">Pending audio load</span>
        </div>

        <div className="rounded-xl border border-border/80 bg-surface-elevated/60 p-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Key Signature
          </span>
          <p className="mt-1 font-display text-xl font-bold text-accent-violet-light">
            -- Key
          </p>
          <span className="text-[11px] text-text-muted">Tonal center</span>
        </div>

        <div className="rounded-xl border border-border/80 bg-surface-elevated/60 p-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Meter
          </span>
          <p className="mt-1 font-display text-xl font-bold text-accent-cyan">
            -- / --
          </p>
          <span className="text-[11px] text-text-muted">Time signature</span>
        </div>

        <div className="rounded-xl border border-border/80 bg-surface-elevated/60 p-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Confidence
          </span>
          <p className="mt-1 font-display text-xl font-bold text-emerald-400">
            -- %
          </p>
          <span className="text-[11px] text-text-muted">Model accuracy</span>
        </div>
      </div>
    </div>
  );

  return (
    <PlaceholderPage
      title="Song Analyzer"
      badge="Phase 2 Feature"
      badgeVariant="violet"
      phase="Phase 2"
      description="The upcoming Keynote Song Analyzer will deconstruct recorded audio into its core musical elements: detecting tempo, key signatures, modal characteristics, and full chord progressions."
      icon={<WaveformIcon size={24} />}
      plannedFeatures={plannedCapabilities}
      mockPreview={mockPreview}
    />
  );
}
