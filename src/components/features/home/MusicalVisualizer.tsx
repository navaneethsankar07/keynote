"use client";

import React, { useState } from "react";
import { WaveformIcon, ActivityIcon, SlidersIcon, PianoKeysIcon } from "@/components/ui/Icons";

export interface MusicalVisualizerProps {
  activeModeIndex?: number;
  onModeSelect?: (index: number) => void;
}

const DASHBOARD_PRESETS = [
  {
    name: "Harmonic Minor",
    modeName: "Aeolian / Natural Minor",
    bpm: 124,
    timeSig: "4/4",
    key: "F# Minor",
    relativeKey: "A Major",
    confidence: "98.7%",
    chords: [
      { numeral: "i", chord: "F#m", function: "Tonic" },
      { numeral: "VI", chord: "Dmaj7", function: "Subdominant" },
      { numeral: "III", chord: "A", function: "Mediant" },
      { numeral: "VII", chord: "E", function: "Subtonic" },
    ],
    stems: [
      { name: "Drums", level: 82, color: "#8b5cf6" },
      { name: "Bass", level: 90, color: "#06b6d4" },
      { name: "Chords", level: 68, color: "#a855f7" },
      { name: "Lead", level: 74, color: "#22d3ee" },
    ],
    bars: [25, 45, 80, 65, 92, 88, 50, 72, 98, 62, 45, 82, 90, 54, 38, 68, 94, 76, 58, 32, 48, 70, 85, 60],
  },
  {
    name: "Dorian Vibe",
    modeName: "Dorian Mode (Natural 6th)",
    bpm: 96,
    timeSig: "7/8",
    key: "D Dorian",
    relativeKey: "C Major",
    confidence: "96.4%",
    chords: [
      { numeral: "i7", chord: "Dm7", function: "Tonic" },
      { numeral: "IV", chord: "G7", function: "Subdominant" },
      { numeral: "ii7", chord: "Em7", function: "Supertonic" },
      { numeral: "V7sus4", chord: "A7sus4", function: "Dominant" },
    ],
    stems: [
      { name: "Drums", level: 75, color: "#06b6d4" },
      { name: "Bass", level: 84, color: "#6366f1" },
      { name: "Chords", level: 78, color: "#a855f7" },
      { name: "Lead", level: 65, color: "#38bdf8" },
    ],
    bars: [42, 70, 54, 88, 48, 98, 82, 62, 78, 92, 60, 50, 74, 86, 64, 52, 80, 68, 42, 28, 55, 75, 88, 64],
  },
  {
    name: "Lydian Ethereal",
    modeName: "Lydian Mode (Raised 4th #4)",
    bpm: 72,
    timeSig: "3/4",
    key: "Bb Lydian",
    relativeKey: "F Major",
    confidence: "99.1%",
    chords: [
      { numeral: "Imaj7#11", chord: "Bbmaj7#11", function: "Tonic" },
      { numeral: "II", chord: "C/Bb", function: "Supertonic" },
      { numeral: "vii7", chord: "Am7", function: "Leading" },
      { numeral: "iii9", chord: "Dm9", function: "Mediant" },
    ],
    stems: [
      { name: "Drums", level: 60, color: "#22d3ee" },
      { name: "Bass", level: 72, color: "#a78bfa" },
      { name: "Chords", level: 88, color: "#f43f5e" },
      { name: "Lead", level: 80, color: "#38bdf8" },
    ],
    bars: [18, 32, 50, 68, 82, 94, 72, 88, 62, 80, 92, 76, 60, 44, 68, 84, 56, 40, 30, 20, 35, 58, 72, 50],
  },
  {
    name: "Mixolydian Blues",
    modeName: "Mixolydian Mode (Flat 7th b7)",
    bpm: 118,
    timeSig: "4/4",
    key: "A Mixolydian",
    relativeKey: "D Major",
    confidence: "97.8%",
    chords: [
      { numeral: "I7", chord: "A7", function: "Tonic Dominant" },
      { numeral: "bVII", chord: "G", function: "Subtonic" },
      { numeral: "IV", chord: "D", function: "Subdominant" },
      { numeral: "I", chord: "A", function: "Tonic" },
    ],
    stems: [
      { name: "Drums", level: 88, color: "#f59e0b" },
      { name: "Bass", level: 82, color: "#8b5cf6" },
      { name: "Chords", level: 70, color: "#06b6d4" },
      { name: "Lead", level: 86, color: "#fcd34d" },
    ],
    bars: [30, 52, 76, 85, 95, 78, 65, 82, 90, 70, 55, 78, 88, 62, 45, 72, 90, 78, 60, 40, 50, 72, 84, 65],
  },
];

export function MusicalVisualizer({
  activeModeIndex = 0,
  onModeSelect,
}: MusicalVisualizerProps) {
  const [internalPresetIndex, setInternalPresetIndex] = useState(activeModeIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeChordIndex, setActiveChordIndex] = useState(0);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [userBpm, setUserBpm] = useState<number | null>(null);

  const selectedIndex = activeModeIndex ?? internalPresetIndex;
  const current = DASHBOARD_PRESETS[selectedIndex % DASHBOARD_PRESETS.length];
  const activeBpm = userBpm ?? current.bpm;
  const beatPeriod = (60 / activeBpm).toFixed(3);

  // Handle preset switch
  const handleSelectPreset = (idx: number) => {
    setInternalPresetIndex(idx);
    setUserBpm(null);
    setActiveChordIndex(0);
    if (onModeSelect) {
      onModeSelect(idx);
    }
  };

  // Interactive Tap Tempo calculator
  const handleTapTempo = () => {
    const now = performance.now();
    const newTaps = [...tapTimes.slice(-4), now];
    setTapTimes(newTaps);

    if (newTaps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        setUserBpm(calculatedBpm);
      }
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-3xl border border-white/10 bg-[#0d0f18]/95 p-5 sm:p-8 shadow-2xl shadow-accent-violet/10 backdrop-blur-xl transition-all duration-300">
      {/* Decorative ambient chassis glow */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-accent-violet/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent-cyan/15 blur-3xl"
        aria-hidden="true"
      />

      {/* --- DASHBOARD HEADER --- */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#161928] border border-white/10 text-accent-cyan shadow-inner">
            <WaveformIcon size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-display text-base font-bold tracking-tight text-text-primary">
                Spectral Audio Deconstruction Console
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Signal</span>
              </span>
            </div>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              Multi-track acoustic FFT engine • 48 kHz / 24-bit PCM analysis
            </p>
          </div>
        </div>

        {/* Studio Presets / Musical Modes */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#141724] p-1.5 shadow-inner overflow-x-auto max-w-full">
          {DASHBOARD_PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                selectedIndex === idx
                  ? "bg-accent-violet text-white shadow-md shadow-accent-violet/30 border border-white/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`}
            >
              {preset.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* --- MAIN SPECTRUM & OSCILLOSCOPE WINDOW --- */}
      <div className="relative z-10 my-6">
        <div className="relative h-44 sm:h-52 w-full rounded-2xl border border-white/10 bg-[#07080e]/95 p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Hardware grid lines */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Floating live oscilloscope curve in background */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
            preserveAspectRatio="none"
            viewBox="0 0 800 200"
          >
            <path
              d="M0,100 C150,20 250,180 400,100 C550,20 650,180 800,100"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              className={isPlaying ? "animate-pulse" : ""}
            />
          </svg>

          {/* Top telemetry HUD bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between text-xs font-mono text-text-muted border-b border-white/5 pb-2">
            <div className="flex items-center gap-3">
              <span className="text-accent-violet-light font-semibold">
                KEY: {current.key} ({current.relativeKey} rel)
              </span>
              <span>•</span>
              <span className="text-accent-cyan font-semibold">
                TEMPO: {activeBpm} BPM
              </span>
              <span>•</span>
              <span className="text-text-primary">METER: {current.timeSig}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-emerald-400">
                CONFIDENCE: {current.confidence}
              </span>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-text-secondary hover:text-white transition-colors border border-white/10 cursor-pointer"
              >
                <ActivityIcon size={12} className="text-accent-violet" />
                <span>{isPlaying ? "Pause Stream" : "Resume Stream"}</span>
              </button>
            </div>
          </div>

          {/* Real-time 24-band Frequency Spectrum Bars with Peak-Hold LEDs */}
          <div className="relative z-10 flex h-28 items-end justify-between gap-1 sm:gap-2 px-1">
            {current.bars.map((height, i) => (
              <div
                key={i}
                className="group relative flex-1 flex flex-col justify-end items-center h-full"
              >
                {/* Peak-Hold LED Marker */}
                <div
                  className="w-full h-1 rounded-xs mb-1 transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#22d3ee" : "#a855f7",
                    opacity: isPlaying ? 0.9 : 0.4,
                  }}
                />

                {/* Main Frequency Bar */}
                <div
                  className="w-full rounded-t-sm transition-all duration-300 ease-out frequency-pulse-tick"
                  style={{
                    height: `${height}%`,
                    background:
                      i % 3 === 0
                        ? "linear-gradient(to top, #4c1d95, #8b5cf6, #c084fc)"
                        : i % 3 === 1
                        ? "linear-gradient(to top, #083344, #06b6d4, #67e8f9)"
                        : "linear-gradient(to top, #581c87, #7c3aed, #38bdf8)",
                    opacity: 0.9,
                    animation: isPlaying
                      ? `frequency-tick-pulse ${beatPeriod}s ease-in-out infinite ${(i * 0.035).toFixed(2)}s`
                      : "none",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Frequency Spectrum Axis Labels */}
          <div className="relative z-10 flex justify-between border-t border-white/10 pt-2 text-[10px] font-mono text-text-muted">
            <span className="text-accent-violet-light">SUB 20Hz</span>
            <span>BASS 120Hz</span>
            <span>LOW-MID 500Hz</span>
            <span>MID 2kHz</span>
            <span>PRESENCE 8kHz</span>
            <span className="text-accent-cyan">AIR 20kHz</span>
          </div>
        </div>
      </div>

      {/* --- STEM TRACK DECONSTRUCTION MIXER --- */}
      <div className="relative z-10 mb-6 rounded-2xl border border-white/10 bg-[#121522]/90 p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <SlidersIcon size={16} className="text-accent-violet" />
            <span className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
              Stem Isolation Channels
            </span>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Phase 2 Acoustic Signal Separation Preview
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {current.stems.map((stem) => (
            <div
              key={stem.name}
              className="rounded-xl border border-white/5 bg-[#181c2e] p-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-medium text-text-primary">{stem.name}</span>
                <span className="text-text-muted">{stem.level}%</span>
              </div>

              {/* Simulated VU Meter Bar */}
              <div className="my-2.5 h-2 w-full rounded-full bg-black/50 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${stem.level}%`,
                    backgroundColor: stem.color,
                    boxShadow: `0 0 10px ${stem.color}60`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                <span>Active Track</span>
                <span className="text-emerald-400 font-semibold">ONLINE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- HARMONIC CHORD PROGRESSION & THEORY MATRIX --- */}
      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Chord Progression Strip */}
        <div className="col-span-1 sm:col-span-2 rounded-2xl border border-white/10 bg-[#121522]/90 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
              Roman Numeral Harmonic Progression
            </span>
            <span className="text-[11px] font-mono text-accent-violet-light">
              Mode: {current.modeName.split(" ")[0]}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {current.chords.map((ch, idx) => (
              <button
                key={ch.chord}
                type="button"
                onClick={() => setActiveChordIndex(idx)}
                className={`rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                  activeChordIndex === idx
                    ? "border-accent-violet bg-accent-violet/20 shadow-lg shadow-accent-violet/20"
                    : "border-white/5 bg-[#181c2e] hover:border-white/20 hover:bg-[#1f243b]"
                }`}
              >
                <span className="font-mono text-xs font-bold text-accent-cyan block">
                  {ch.numeral}
                </span>
                <span className="font-display text-sm font-bold text-text-primary block mt-0.5">
                  {ch.chord}
                </span>
                <span className="text-[9px] font-mono text-text-muted block mt-1">
                  {ch.function}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* BPM Tap & Quick Metronome Tool */}
        <div className="rounded-2xl border border-white/10 bg-[#121522]/90 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
                Tempo Engine
              </span>
              <PianoKeysIcon size={14} className="text-accent-cyan" />
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-display text-3xl font-black text-text-primary">
                {activeBpm}
              </span>
              <span className="font-mono text-xs text-accent-cyan uppercase">BPM</span>
            </div>
            <p className="text-xs text-text-muted font-mono mt-1">
              Micro-timing jitter: ±0.3ms
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
            <button
              type="button"
              onClick={handleTapTempo}
              className="flex-1 rounded-xl bg-accent-cyan/15 hover:bg-accent-cyan/25 text-accent-cyan border border-accent-cyan/30 py-2 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
            >
              TAP TEMPO
            </button>
            {userBpm && (
              <button
                type="button"
                onClick={() => setUserBpm(null)}
                className="rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-white px-2.5 py-2 text-xs font-mono border border-white/10 cursor-pointer"
                title="Reset to preset BPM"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
