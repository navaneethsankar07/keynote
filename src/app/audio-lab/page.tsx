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
        {/* BPM Metronome Widget */}
        <div className="rounded-2xl border border-white/10 bg-[#121524]/95 p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span className="text-accent-violet font-semibold">TOOL 01</span>
              <MetronomeIcon size={18} className="text-accent-violet" />
            </div>
            <h4 className="font-display text-sm font-bold text-text-primary mt-2">
              BPM Tap & Metronome
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Tap tempo detection with micro-timing variance and swing analytics.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="font-mono text-base font-bold text-accent-cyan">120.0 BPM</span>
            <span className="text-[10px] font-mono rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/25">
              Sync Ready
            </span>
          </div>
        </div>

        {/* Pitch Mapper Widget with Piano Keys */}
        <div className="rounded-2xl border border-white/10 bg-[#121524]/95 p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span className="text-accent-cyan font-semibold">TOOL 02</span>
              <PianoKeysIcon size={18} className="text-accent-cyan" />
            </div>
            <h4 className="font-display text-sm font-bold text-text-primary mt-2">
              Virtual Pitch Mapper
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Test note frequencies, interval ratios, and microtonal tunings.
            </p>
          </div>
          {/* Piano key illustration */}
          <div className="my-3 flex items-center justify-center gap-1 bg-[#090b12] p-2 rounded-xl border border-white/5">
            {["C", "D", "E", "F", "G", "A", "B"].map((note, idx) => (
              <div
                key={note}
                className={`h-10 flex-1 rounded-sm flex items-end justify-center pb-1 text-[9px] font-mono ${
                  idx === 0 || idx === 3
                    ? "bg-accent-violet/30 text-accent-violet-light border border-accent-violet/40"
                    : "bg-white/10 text-text-muted"
                }`}
              >
                {note}
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-text-primary">A4 = 440 Hz</span>
            <span className="text-[10px] font-mono rounded bg-white/5 px-2 py-0.5 text-text-muted border border-white/10">
              Concert Pitch
            </span>
          </div>
        </div>

        {/* Spectrum Analyzer Widget */}
        <div className="rounded-2xl border border-white/10 bg-[#121524]/95 p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span className="text-accent-violet-light font-semibold">TOOL 03</span>
              <SlidersIcon size={18} className="text-accent-violet-light" />
            </div>
            <h4 className="font-display text-sm font-bold text-text-primary mt-2">
              Spectrogram Scope
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Visual frequency heatmaps across sub, bass, mid, and brilliance.
            </p>
          </div>
          <div className="my-3 h-10 w-full rounded-xl bg-[#090b12] border border-white/5 p-1.5 flex items-end gap-1">
            {[35, 60, 90, 75, 45, 85, 95, 65, 40, 70, 55, 30].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-xs bg-gradient-to-t from-accent-violet to-accent-cyan"
                style={{ height: `${h}%`, opacity: 0.8 }}
              />
            ))}
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-accent-violet-light">20Hz - 20kHz</span>
            <span className="text-[10px] font-mono rounded-full bg-accent-violet/10 px-2 py-0.5 text-accent-violet-light border border-accent-violet/30">
              Live FFT
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PlaceholderPage
      title="Audio Lab & Interactive Tools"
      badge="Phase 4 Studio"
      badgeVariant="warning"
      phase="Phase 4"
      description="Interactive audio utilities and visualizers: real-time frequency spectrograms, BPM tap counters, virtual piano pitch mappers, and audio stem inspectors."
      icon={<SlidersIcon size={24} />}
      plannedFeatures={plannedCapabilities}
      mockPreview={mockPreview}
    />
  );
}
