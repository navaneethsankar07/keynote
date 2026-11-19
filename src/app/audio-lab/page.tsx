import React from "react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { SlidersIcon, PianoKeysIcon, MetronomeIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Audio Lab (Preview) — Keynote",
  description:
    "Interactive music tools: real-time frequency spectrograms, BPM tap counters, and pitch visualizers.",
};

export default function AudioLabPage() {
  const plannedCapabilities = [
    "High-resolution real-time audio FFT spectrogram and overtone visualizer",
    "BPM tap counter with millisecond tempo calculation and subdivisions",
    "Interactive piano roll pitch mapper with MIDI input support",
    "Stereo field and phase correlation visualizer",
    "Transient detector with audio slice and beat-marker export",
    "Tuning reference generator (440Hz / 432Hz pitch calibrator)",
  ];

  const mockPreview = (
    <div className="space-y-6">
      {/* Tool preview widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* BPM Metronome Mock */}
        <div className="rounded-xl border border-border bg-surface-elevated/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span>TOOL 01</span>
              <MetronomeIcon size={16} className="text-accent-violet" />
            </div>
            <h4 className="font-display text-sm font-semibold text-text-primary mt-2">
              BPM Tap & Metronome
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Tap tempo detection with micro-timing variance analysis.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-accent-cyan">120.0 BPM</span>
            <span className="text-[10px] font-mono rounded bg-surface px-2 py-0.5 text-text-muted border border-border">
              Inactive
            </span>
          </div>
        </div>

        {/* Pitch Mapper Mock */}
        <div className="rounded-xl border border-border bg-surface-elevated/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span>TOOL 02</span>
              <PianoKeysIcon size={16} className="text-accent-cyan" />
            </div>
            <h4 className="font-display text-sm font-semibold text-text-primary mt-2">
              Virtual Pitch Mapper
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Test note frequencies and chord intervals on interactive keys.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-text-primary">A4 = 440 Hz</span>
            <span className="text-[10px] font-mono rounded bg-surface px-2 py-0.5 text-text-muted border border-border">
              Standard
            </span>
          </div>
        </div>

        {/* Spectrum Analyzer Mock */}
        <div className="rounded-xl border border-border bg-surface-elevated/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span>TOOL 03</span>
              <SlidersIcon size={16} className="text-accent-violet-light" />
            </div>
            <h4 className="font-display text-sm font-semibold text-text-primary mt-2">
              Spectrum Scope
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Frequency distribution inspection across sub, bass, mid, and highs.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-accent-violet-light">20Hz - 20kHz</span>
            <span className="text-[10px] font-mono rounded bg-surface px-2 py-0.5 text-text-muted border border-border">
              Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PlaceholderPage
      title="Audio Lab & Tools"
      badge="Phase 3 Feature"
      badgeVariant="warning"
      phase="Phase 3"
      description="Interactive audio utilities and visualizers: real-time frequency spectrograms, BPM tap counters, virtual piano pitch mappers, and audio stem inspectors."
      icon={<SlidersIcon size={24} />}
      plannedFeatures={plannedCapabilities}
      mockPreview={mockPreview}
    />
  );
}
