"use client";

import React, { useState, useCallback } from "react";
import { WaveformIcon, ActivityIcon, SparklesIcon } from "@/components/ui/Icons";

interface KeyData {
  note: string;
  name: string;
  freq: number;
  octave: number;
  pitchClass: string;
}

const WHITE_KEYS: KeyData[] = [
  { note: "C4", name: "C", freq: 261.63, octave: 4, pitchClass: "Tonic Root" },
  { note: "D4", name: "D", freq: 293.66, octave: 4, pitchClass: "Major 2nd" },
  { note: "E4", name: "E", freq: 329.63, octave: 4, pitchClass: "Major 3rd" },
  { note: "F4", name: "F", freq: 349.23, octave: 4, pitchClass: "Perfect 4th" },
  { note: "G4", name: "G", freq: 392.0, octave: 4, pitchClass: "Perfect 5th" },
  { note: "A4", name: "A", freq: 440.0, octave: 4, pitchClass: "Major 6th" },
  { note: "B4", name: "B", freq: 493.88, octave: 4, pitchClass: "Major 7th" },
  { note: "C5", name: "C", freq: 523.25, octave: 5, pitchClass: "Octave" },
  { note: "D5", name: "D", freq: 587.33, octave: 5, pitchClass: "Major 9th" },
  { note: "E5", name: "E", freq: 659.25, octave: 5, pitchClass: "Major 10th" },
  { note: "F5", name: "F", freq: 698.46, octave: 5, pitchClass: "Perfect 11th" },
  { note: "G5", name: "G", freq: 783.99, octave: 5, pitchClass: "Perfect 12th" },
  { note: "A5", name: "A", freq: 880.0, octave: 5, pitchClass: "Major 13th" },
  { note: "B5", name: "B", freq: 987.77, octave: 5, pitchClass: "Major 14th" },
];

interface BlackKeyData extends KeyData {
  leftPercent: number;
}

// 14 white keys: each width = 100 / 14 = ~7.1428%
// Black key width = 5%. Center on boundary = (boundary_index * 100 / 14) - 2.5%
const BLACK_KEYS: BlackKeyData[] = [
  // Octave 4
  { note: "C#4", name: "C#", freq: 277.18, octave: 4, pitchClass: "Minor 2nd", leftPercent: (1 * 100) / 14 - 2.5 },
  { note: "D#4", name: "D#", freq: 311.13, octave: 4, pitchClass: "Minor 3rd", leftPercent: (2 * 100) / 14 - 2.5 },
  { note: "F#4", name: "F#", freq: 369.99, octave: 4, pitchClass: "Tritone (#4)", leftPercent: (4 * 100) / 14 - 2.5 },
  { note: "G#4", name: "G#", freq: 415.3, octave: 4, pitchClass: "Minor 6th", leftPercent: (5 * 100) / 14 - 2.5 },
  { note: "A#4", name: "A#", freq: 466.16, octave: 4, pitchClass: "Minor 7th", leftPercent: (6 * 100) / 14 - 2.5 },
  // Octave 5
  { note: "C#5", name: "C#", freq: 554.37, octave: 5, pitchClass: "Minor 9th", leftPercent: (8 * 100) / 14 - 2.5 },
  { note: "D#5", name: "D#", freq: 622.25, octave: 5, pitchClass: "Minor 10th", leftPercent: (9 * 100) / 14 - 2.5 },
  { note: "F#5", name: "F#", freq: 739.99, octave: 5, pitchClass: "Augmented 11th", leftPercent: (11 * 100) / 14 - 2.5 },
  { note: "G#5", name: "G#", freq: 830.61, octave: 5, pitchClass: "Minor 13th", leftPercent: (12 * 100) / 14 - 2.5 },
  { note: "A#5", name: "A#", freq: 932.33, octave: 5, pitchClass: "Minor 14th", leftPercent: (13 * 100) / 14 - 2.5 },
];

const CHORD_PRESETS = [
  {
    id: "c-maj7",
    name: "C Major 7",
    notes: ["C4", "E4", "G4", "B4"],
    role: "Root Tonic Harmony",
  },
  {
    id: "a-min9",
    name: "A Minor 9",
    notes: ["A4", "C5", "E5", "G5", "B5"],
    role: "Lush Minor Atmosphere",
  },
  {
    id: "f-lydian",
    name: "F Lydian",
    notes: ["F4", "A4", "C5", "E5", "G5"],
    role: "Cinematic Bright Resonance",
  },
  {
    id: "d-dom9",
    name: "D Dom 9",
    notes: ["D4", "F#4", "A4", "C5", "E5"],
    role: "Warm Harmonic Tension",
  },
];

export function IntroductionSection() {
  const [activeNotes, setActiveNotes] = useState<string[]>(["C4", "E4", "G4", "B4"]);
  const [selectedChord, setSelectedChord] = useState<string>("c-maj7");
  const [lastNote, setLastNote] = useState<KeyData>({
    note: "C4",
    name: "C",
    freq: 261.63,
    octave: 4,
    pitchClass: "Tonic Root",
  });

  // Sound generator using Web Audio API
  const playSound = useCallback((freq: number) => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.05);

      setTimeout(() => {
        try {
          ctx.close();
        } catch {
          // ignore
        }
      }, 1100);
    } catch {
      // Audio autoplay blocked or unsupported
    }
  }, []);

  const handleKeyClick = (key: KeyData) => {
    setSelectedChord("");
    setActiveNotes([key.note]);
    setLastNote(key);
    playSound(key.freq);
  };

  const handleChordSelect = (chord: typeof CHORD_PRESETS[0]) => {
    setSelectedChord(chord.id);
    setActiveNotes(chord.notes);

    // Find first note for telemetry
    const firstKey =
      WHITE_KEYS.find((k) => k.note === chord.notes[0]) ||
      BLACK_KEYS.find((k) => k.note === chord.notes[0]);
    if (firstKey) {
      setLastNote({
        ...firstKey,
        pitchClass: chord.name,
      });
    }

    // Play rolled arpeggio
    chord.notes.forEach((nStr, idx) => {
      const kData =
        WHITE_KEYS.find((k) => k.note === nStr) ||
        BLACK_KEYS.find((k) => k.note === nStr);
      if (kData) {
        setTimeout(() => {
          playSound(kData.freq);
        }, idx * 110);
      }
    });
  };

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#07080e]/60 overflow-hidden">
      {/* Background ambient radial gradients */}
      <div
        className="pointer-events-none absolute top-1/4 left-0 w-96 h-96 rounded-full bg-accent-violet/5 blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-accent-cyan/5 blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typographic & Editorial Storytelling */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
              Every song has a story{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                beyond its sound.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans max-w-xl">
              Discover the musical structure hiding beneath the melodies you love.
              Explore rhythm, harmony, instruments, tonal relationships, and the musical
              ideas that bring songs to life.
            </p>

            {/* Editorial Feature Highlights */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-surface/40 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 text-accent-violet text-sm font-semibold mb-1">
                  <WaveformIcon size={16} />
                  <span>Hidden Architecture</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Uncover structural cadence, chord transitions, and modal anchors hidden inside familiar hooks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface/40 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 text-accent-cyan text-sm font-semibold mb-1">
                  <ActivityIcon size={16} />
                  <span>Sonic Anatomy</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Decompose complex musical mixes into separate frequency overtones, rhythm grooves, and harmonic layers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Studio Keyboard Visualizer */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-white/10 bg-[#0a0c14]/95 p-6 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
              {/* Subtle top studio grid lines */}
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"
                aria-hidden="true"
              />

              {/* Console Header */}
              <div className="relative z-10 flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-accent-cyan animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                    Studio Keyboard Visualizer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-accent-violet-light bg-accent-violet/10 border border-accent-violet/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <SparklesIcon size={12} />
                    <span>2 Octaves • C4 - B5</span>
                  </span>
                </div>
              </div>

              {/* Interactive Piano Keyboard Frame */}
              <div className="relative z-10 my-6 rounded-2xl border border-white/10 bg-[#050609] p-3 shadow-inner">
                {/* Traditional red/purple velvet felt strip above the keys */}
                <div className="h-2 w-full rounded-t-sm bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#2e1065] shadow-sm mb-1" />

                {/* Piano Keys Container */}
                <div className="relative w-full h-44 sm:h-52 flex select-none overflow-hidden rounded-b-lg">
                  {/* 14 White Keys */}
                  {WHITE_KEYS.map((key) => {
                    const isActive = activeNotes.includes(key.note);
                    return (
                      <button
                        key={key.note}
                        type="button"
                        onClick={() => handleKeyClick(key)}
                        aria-label={`Key ${key.note}`}
                        className={`flex-1 h-full rounded-b-md border-r border-[#cbd5e1]/40 last:border-r-0 relative z-0 flex flex-col justify-end items-center pb-2.5 transition-all duration-150 cursor-pointer active:translate-y-0.5 ${
                          isActive
                            ? "bg-gradient-to-b from-violet-200 via-indigo-300 to-cyan-300 text-slate-950 font-bold shadow-[0_0_15px_rgba(167,139,250,0.8)] ring-2 ring-accent-violet"
                            : "bg-gradient-to-b from-[#fafaf9] via-[#f5f5f4] to-[#e7e5e4] hover:bg-[#ffffff] text-slate-500 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)]"
                        }`}
                      >
                        <span className="font-mono text-[10px] sm:text-xs">
                          {key.name}
                        </span>
                        <span className="text-[9px] opacity-70 scale-90 sm:scale-100">
                          {key.octave}
                        </span>
                      </button>
                    );
                  })}

                  {/* 10 Black Keys (positioned absolutely) */}
                  {BLACK_KEYS.map((key) => {
                    const isActive = activeNotes.includes(key.note);
                    return (
                      <button
                        key={key.note}
                        type="button"
                        onClick={() => handleKeyClick(key)}
                        style={{
                          left: `${key.leftPercent}%`,
                          width: "5%",
                        }}
                        aria-label={`Key ${key.note}`}
                        className={`absolute top-0 h-[60%] z-10 rounded-b-sm border-x border-b shadow-lg transition-all duration-150 cursor-pointer active:translate-y-0.5 flex flex-col justify-end items-center pb-2 ${
                          isActive
                            ? "bg-gradient-to-b from-accent-violet via-purple-600 to-indigo-600 border-accent-violet-light text-white shadow-[0_0_18px_rgba(139,92,246,0.9)] scale-105"
                            : "bg-gradient-to-b from-[#262b3a] via-[#161a26] to-[#0c0e17] border-[#374151]/80 hover:from-[#374151] hover:to-[#111827] text-white/70 shadow-[2px_3px_5px_rgba(0,0,0,0.7)]"
                        }`}
                      >
                        <span className="font-mono text-[8px] sm:text-[9px] font-semibold">
                          {key.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chord Presets */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                  <span>Harmonic Presets:</span>
                  <span className="text-white/40">Click any key or preset to play</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CHORD_PRESETS.map((chord) => {
                    const isSelected = selectedChord === chord.id;
                    return (
                      <button
                        key={chord.id}
                        type="button"
                        onClick={() => handleChordSelect(chord)}
                        className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col ${
                          isSelected
                            ? "border-accent-violet/60 bg-accent-violet/15 shadow-md shadow-accent-violet/10 text-white"
                            : "border-white/5 bg-white/[0.02] text-text-secondary hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="text-xs font-semibold">{chord.name}</span>
                        <span className="text-[10px] font-mono text-text-muted mt-0.5 truncate">
                          {chord.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Key / Frequency Telemetry */}
              <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-text-secondary">
                  <span>Voicing:</span>
                  <span className="text-white font-semibold">
                    {lastNote.name}
                    {lastNote.octave} ({lastNote.freq.toFixed(1)} Hz)
                  </span>
                </div>
                <div className="text-accent-cyan text-right">
                  {lastNote.pitchClass}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
