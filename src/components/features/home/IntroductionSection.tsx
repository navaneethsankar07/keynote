"use client";

import React, { useState, useCallback } from "react";
import { WaveformIcon, ActivityIcon } from "@/components/ui/Icons";

interface KeyData {
  note: string;
  name: string;
  freq: number;
}

const WHITE_KEYS: KeyData[] = [
  { note: "C4", name: "C", freq: 261.63 },
  { note: "D4", name: "D", freq: 293.66 },
  { note: "E4", name: "E", freq: 329.63 },
  { note: "F4", name: "F", freq: 349.23 },
  { note: "G4", name: "G", freq: 392.0 },
  { note: "A4", name: "A", freq: 440.0 },
  { note: "B4", name: "B", freq: 493.88 },
  { note: "C5", name: "C", freq: 523.25 },
  { note: "D5", name: "D", freq: 587.33 },
  { note: "E5", name: "E", freq: 659.25 },
  { note: "F5", name: "F", freq: 698.46 },
  { note: "G5", name: "G", freq: 783.99 },
  { note: "A5", name: "A", freq: 880.0 },
  { note: "B5", name: "B", freq: 987.77 },
];

interface BlackKeyData extends KeyData {
  leftPercent: number;
}

// 14 white keys: each width = 100 / 14 = ~7.1428%
// Black key width = 5%. Center on boundary = (boundary_index * 100 / 14) - 2.5%
const BLACK_KEYS: BlackKeyData[] = [
  // Octave 4
  { note: "C#4", name: "C#", freq: 277.18, leftPercent: (1 * 100) / 14 - 2.5 },
  { note: "D#4", name: "D#", freq: 311.13, leftPercent: (2 * 100) / 14 - 2.5 },
  { note: "F#4", name: "F#", freq: 369.99, leftPercent: (4 * 100) / 14 - 2.5 },
  { note: "G#4", name: "G#", freq: 415.3, leftPercent: (5 * 100) / 14 - 2.5 },
  { note: "A#4", name: "A#", freq: 466.16, leftPercent: (6 * 100) / 14 - 2.5 },
  // Octave 5
  { note: "C#5", name: "C#", freq: 554.37, leftPercent: (8 * 100) / 14 - 2.5 },
  { note: "D#5", name: "D#", freq: 622.25, leftPercent: (9 * 100) / 14 - 2.5 },
  { note: "F#5", name: "F#", freq: 739.99, leftPercent: (11 * 100) / 14 - 2.5 },
  { note: "G#5", name: "G#", freq: 830.61, leftPercent: (12 * 100) / 14 - 2.5 },
  { note: "A#5", name: "A#", freq: 932.33, leftPercent: (13 * 100) / 14 - 2.5 },
];

export function IntroductionSection() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

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
    setActiveKey(key.note);
    playSound(key.freq);
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

          {/* Right Column: Clean Keyboard */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full relative rounded-3xl border border-white/10 bg-[#0a0c14]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
              {/* Subtle ambient background glow */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent-violet/10 via-transparent to-accent-cyan/10"
                aria-hidden="true"
              />

              {/* Piano Keyboard Frame */}
              <div className="relative z-10 rounded-2xl border border-white/10 bg-[#050609] p-2.5 sm:p-3 shadow-inner">
                {/* Traditional red/purple velvet felt strip */}
                <div className="h-2 w-full rounded-t-sm bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#2e1065] shadow-sm mb-1" />

                {/* Piano Keys Container */}
                <div className="relative w-full h-48 sm:h-56 flex select-none overflow-hidden rounded-b-lg">
                  {/* 14 White Keys */}
                  {WHITE_KEYS.map((key) => {
                    const isActive = activeKey === key.note;
                    return (
                      <button
                        key={key.note}
                        type="button"
                        onClick={() => handleKeyClick(key)}
                        aria-label={`Key ${key.note}`}
                        className={`flex-1 h-full rounded-b-md border-r border-[#cbd5e1]/40 last:border-r-0 relative z-0 flex flex-col justify-end items-center pb-3 transition-all duration-150 cursor-pointer active:translate-y-0.5 ${
                          isActive
                            ? "bg-gradient-to-b from-violet-200 via-indigo-300 to-cyan-300 text-slate-950 font-bold shadow-[0_0_18px_rgba(167,139,250,0.85)] ring-2 ring-accent-violet"
                            : "bg-gradient-to-b from-[#fafaf9] via-[#f5f5f4] to-[#e7e5e4] hover:bg-white text-slate-500 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)]"
                        }`}
                      >
                        <span className="font-mono text-xs sm:text-sm font-medium">
                          {key.name}
                        </span>
                      </button>
                    );
                  })}

                  {/* 10 Black Keys (positioned absolutely) */}
                  {BLACK_KEYS.map((key) => {
                    const isActive = activeKey === key.note;
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
                        <span className="font-mono text-[9px] sm:text-[10px] font-semibold">
                          {key.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
