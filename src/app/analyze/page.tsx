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
      {/* DAW-like Audio Dropzone & Waveform Scrubber */}
      <div className="border border-white/10 rounded-2xl p-6 sm:p-8 bg-[#0b0d16]/95 relative overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent-violet/15 text-accent-violet flex items-center justify-center border border-accent-violet/30">
              <WaveformIcon size={20} />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-text-primary">
                Acoustic File Ingestion & Neural Deconstructor
              </h4>
              <p className="text-xs font-mono text-text-muted">
                Accepts WAV, FLAC, AIFF, MP3 • Up to 192kHz / 32-bit float
              </p>
            </div>
          </div>
          <span className="rounded-full bg-accent-cyan/10 px-3 py-1 text-xs font-mono text-accent-cyan border border-accent-cyan/25">
            Engine Standby
          </span>
        </div>

        {/* Simulated Waveform Scrubber with Beat Markers */}
        <div className="my-6 relative h-28 w-full rounded-xl bg-[#06070c] border border-white/5 p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between text-[10px] font-mono text-text-muted">
            <span>00:00.00</span>
            <span>00:30.00</span>
            <span>01:00.00</span>
            <span>01:30.00</span>
            <span>02:00.00</span>
            <span>02:30.00</span>
          </div>

          {/* Visual waveform bars */}
          <div className="flex items-center justify-between gap-1 h-16 px-1">
            {Array.from({ length: 48 }).map((_, i) => {
              const h = Math.abs(Math.sin(i * 0.22) * 80 + Math.cos(i * 0.15) * 20);
              return (
                <div
                  key={i}
                  className="w-full rounded-xs transition-all duration-300"
                  style={{
                    height: `${Math.max(h, 15)}%`,
                    backgroundColor: i % 4 === 0 ? "#8b5cf6" : i % 2 === 0 ? "#06b6d4" : "#475569",
                    opacity: 0.75,
                  }}
                />
              );
            })}
          </div>

          {/* Playhead marker */}
          <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-accent-cyan shadow-[0_0_8px_#06b6d4]" />
        </div>

        {/* Stem Isolation Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { name: "Vocals / Lead", split: "Stem 01", color: "#8b5cf6" },
            { name: "Drum Transients", split: "Stem 02", color: "#06b6d4" },
            { name: "Sub / Bassline", split: "Stem 03", color: "#a855f7" },
            { name: "Harmonic Keys", split: "Stem 04", color: "#22d3ee" },
          ].map((stem) => (
            <div key={stem.name} className="rounded-xl border border-white/5 bg-[#121524] p-3">
              <span className="text-[10px] font-mono text-text-muted">{stem.split}</span>
              <p className="font-display text-xs font-bold text-text-primary mt-1">{stem.name}</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-black/60 overflow-hidden">
                <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: stem.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Telemetry Dashboard Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#121522]/90 p-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Tempo Analysis
          </span>
          <p className="mt-1 font-display text-xl font-bold text-text-primary">
            124.0 BPM
          </p>
          <span className="text-[11px] font-mono text-accent-cyan">±0.2ms stability</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121522]/90 p-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Key Signature
          </span>
          <p className="mt-1 font-display text-xl font-bold text-accent-violet-light">
            F# Minor
          </p>
          <span className="text-[11px] font-mono text-text-muted">Aeolian Mode</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121522]/90 p-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Meter
          </span>
          <p className="mt-1 font-display text-xl font-bold text-accent-cyan">
            4/4
          </p>
          <span className="text-[11px] font-mono text-text-muted">Common time</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121522]/90 p-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Confidence
          </span>
          <p className="mt-1 font-display text-xl font-bold text-emerald-400">
            99.2%
          </p>
          <span className="text-[11px] font-mono text-text-muted">Neural confidence</span>
        </div>
      </div>
    </div>
  );

  return (
    <PlaceholderPage
      title="Song Analyzer"
      badge="Phase 3 Pipeline"
      badgeVariant="violet"
      phase="Phase 3"
      description="The upcoming Keynote Song Analyzer will deconstruct recorded audio into its core musical elements: detecting tempo, key signatures, modal characteristics, and full chord progressions."
      icon={<WaveformIcon size={24} />}
      plannedFeatures={plannedCapabilities}
      mockPreview={mockPreview}
    />
  );
}
