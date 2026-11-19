"use client";

import React, { useState } from "react";
import { WaveformIcon, ActivityIcon } from "@/components/ui/Icons";

const DEMO_PRESETS = [
  {
    name: "Harmonic Minor",
    bpm: "124 BPM",
    timeSig: "4/4",
    key: "F# Minor",
    scale: "Aeolian / Natural Minor",
    chords: ["F#m", "Dmaj7", "A", "E"],
    bars: [24, 45, 78, 62, 90, 85, 48, 70, 95, 60, 42, 80, 88, 52, 35, 65, 92, 74, 55, 30],
  },
  {
    name: "Syncopated Groove",
    bpm: "96 BPM",
    timeSig: "7/8",
    key: "D Dorian",
    scale: "Dorian Mode",
    chords: ["Dm7", "G7", "Em7", "A7sus4"],
    bars: [40, 68, 52, 85, 45, 95, 80, 60, 75, 90, 58, 48, 72, 84, 62, 50, 78, 65, 40, 25],
  },
  {
    name: "Ambient Polyphony",
    bpm: "72 BPM",
    timeSig: "3/4",
    key: "Bb Lydian",
    scale: "Lydian Mode (#4)",
    chords: ["Bbmaj7#11", "C/Bb", "Am7", "Dm9"],
    bars: [15, 30, 48, 65, 80, 92, 70, 85, 60, 78, 90, 74, 58, 42, 66, 82, 54, 38, 28, 18],
  },
];

export function MusicalVisualizer() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const current = DEMO_PRESETS[activePresetIndex];

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border/80 bg-surface/90 p-5 sm:p-7 shadow-2xl shadow-accent-violet/5 backdrop-blur-sm">
      {/* Decorative subtle ambient backdrop glow */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-accent-violet/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent-cyan/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Visualizer Top Bar: Track Meta & Selectors */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-elevated border border-border text-accent-cyan">
            <WaveformIcon size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold text-text-primary">
                Spectral Audio Deconstruction
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                Interactive Preview
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Simulating multi-track musical analysis engine
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated p-1">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setActivePresetIndex(idx)}
              className={`rounded-md px-2.5 py-1 text-xs font-mono transition-all ${
                activePresetIndex === idx
                  ? "bg-accent-violet text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              }`}
            >
              {preset.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Waveform & Frequency Display */}
      <div className="relative z-10 my-6">
        {/* Frequency & Waveform Canvas Representation */}
        <div className="relative h-36 sm:h-44 w-full rounded-xl border border-border/60 bg-background/90 p-4 flex flex-col justify-between overflow-hidden">
          {/* Subtle grid lines */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#22263a22_1px,transparent_1px),linear-gradient(to_bottom,#22263a22_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Top metadata overlay */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-text-muted">
            <div className="flex items-center gap-3">
              <span className="text-accent-violet-light font-semibold">
                KEY: {current.key}
              </span>
              <span>•</span>
              <span className="text-accent-cyan font-semibold">
                TEMPO: {current.bpm}
              </span>
              <span>•</span>
              <span>METER: {current.timeSig}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <ActivityIcon size={12} className="text-accent-violet animate-pulse" />
              <span>FFT: 2048 SAMPLES</span>
            </div>
          </div>

          {/* Dynamic Frequency Bars */}
          <div className="relative z-10 flex h-24 items-end justify-between gap-1 sm:gap-2 px-1">
            {current.bars.map((height, i) => (
              <div
                key={i}
                className="group relative flex-1 flex flex-col justify-end items-center h-full"
              >
                {/* Bar */}
                <div
                  className="w-full rounded-t-sm transition-all duration-500 ease-out"
                  style={{
                    height: `${height}%`,
                    background:
                      i % 3 === 0
                        ? "linear-gradient(to top, #6d28d9, #8b5cf6)"
                        : i % 3 === 1
                        ? "linear-gradient(to top, #0e7490, #06b6d4)"
                        : "linear-gradient(to top, #7c3aed, #22d3ee)",
                    opacity: 0.85,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Frequency axis labels */}
          <div className="relative z-10 flex justify-between border-t border-border/40 pt-1 text-[9px] font-mono text-text-faint">
            <span>20 Hz</span>
            <span>120 Hz</span>
            <span>500 Hz</span>
            <span>2 kHz</span>
            <span>8 kHz</span>
            <span>20 kHz</span>
          </div>
        </div>
      </div>

      {/* Musical Analysis Summary Badges */}
      <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border/70 bg-surface-elevated/70 p-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Detected Scale
          </span>
          <p className="mt-1 font-display text-sm font-semibold text-text-primary">
            {current.scale}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 bg-surface-elevated/70 p-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Time Signature
          </span>
          <p className="mt-1 font-display text-sm font-semibold text-accent-cyan">
            {current.timeSig} Meter
          </p>
        </div>

        <div className="col-span-2 rounded-xl border border-border/70 bg-surface-elevated/70 p-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
            Chord Progression Sequence
          </span>
          <div className="mt-1 flex items-center gap-2">
            {current.chords.map((chord, i) => (
              <React.Fragment key={chord}>
                <span className="rounded-md bg-surface px-2 py-0.5 font-mono text-xs font-medium text-text-primary border border-border/80">
                  {chord}
                </span>
                {i < current.chords.length - 1 && (
                  <span className="text-text-muted text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
