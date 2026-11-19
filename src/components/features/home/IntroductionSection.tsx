"use client";

import React, { useState, useEffect, useId } from "react";
import { PlayIcon, PauseIcon, SlidersIcon } from "@/components/ui/Icons";

type VisualizerMode = "spectrum" | "vectorscope" | "harmonic";
type AudioStem = "all" | "bass" | "mid" | "lead" | "air";

interface ChordData {
  name: string;
  symbol: string;
  rootFreq: string;
  rootNote: string;
  scaleType: string;
  consonance: number;
  notes: { note: string; freq: string; ratio: string; role: string }[];
  activeKeys: number[]; // 0-11 representing C, C#, D, etc.
}

const CHORD_PRESETS: ChordData[] = [
  {
    name: "D Major 9 (add 11)",
    symbol: "Dmaj9(#11)",
    rootFreq: "73.4 Hz",
    rootNote: "D2",
    scaleType: "Lydian Harmonic",
    consonance: 94,
    notes: [
      { note: "D2", freq: "73.4 Hz", ratio: "1:1", role: "Fundamental Root" },
      { note: "A2", freq: "110.0 Hz", ratio: "3:2", role: "Perfect Fifth Anchor" },
      { note: "F#3", freq: "185.0 Hz", ratio: "5:4", role: "Major Third Character" },
      { note: "C#4", freq: "277.2 Hz", ratio: "15:8", role: "Major Seventh Color" },
      { note: "E4", freq: "329.6 Hz", ratio: "9:4", role: "Major Ninth Extension" },
      { note: "G#4", freq: "415.3 Hz", ratio: "45:32", role: "Augmented 11th Tension" },
    ],
    activeKeys: [2, 6, 8, 9, 1], // D, F#, G#, A, C#
  },
  {
    name: "F# Minor 11",
    symbol: "F#m11",
    rootFreq: "92.5 Hz",
    rootNote: "F#2",
    scaleType: "Aeolian Resonance",
    consonance: 89,
    notes: [
      { note: "F#2", freq: "92.5 Hz", ratio: "1:1", role: "Root Foundation" },
      { note: "C#3", freq: "138.6 Hz", ratio: "3:2", role: "Fifth Symmetry" },
      { note: "A3", freq: "220.0 Hz", ratio: "6:5", role: "Minor Third Sentiment" },
      { note: "E4", freq: "329.6 Hz", ratio: "7:4", role: "Minor Seventh Luster" },
      { note: "B4", freq: "493.9 Hz", ratio: "11:8", role: "Eleventh Space" },
    ],
    activeKeys: [6, 9, 1, 4, 11], // F#, A, C#, E, B
  },
  {
    name: "C Major 9",
    symbol: "Cmaj9",
    rootFreq: "65.4 Hz",
    rootNote: "C2",
    scaleType: "Ionian Pure",
    consonance: 96,
    notes: [
      { note: "C2", freq: "65.4 Hz", ratio: "1:1", role: "Acoustic Center" },
      { note: "G2", freq: "98.0 Hz", ratio: "3:2", role: "Fifth Harmonic" },
      { note: "E3", freq: "164.8 Hz", ratio: "5:4", role: "Pure Major Third" },
      { note: "B3", freq: "246.9 Hz", ratio: "15:8", role: "Leading Tone" },
      { note: "D4", freq: "293.7 Hz", ratio: "9:4", role: "Compound Ninth" },
    ],
    activeKeys: [0, 4, 7, 11, 2], // C, E, G, B, D
  },
  {
    name: "Bb Dominant 13 (b9)",
    symbol: "Bb13(b9)",
    rootFreq: "58.3 Hz",
    rootNote: "Bb1",
    scaleType: "Altered Dominant",
    consonance: 81,
    notes: [
      { note: "Bb1", freq: "58.3 Hz", ratio: "1:1", role: "Root Bass Pulse" },
      { note: "Ab2", freq: "103.8 Hz", ratio: "7:4", role: "Dominant Seventh" },
      { note: "D3", freq: "146.8 Hz", ratio: "5:4", role: "Major Third Drive" },
      { note: "B3", freq: "246.9 Hz", ratio: "17:16", role: "Flat Ninth Tension" },
      { note: "G4", freq: "392.0 Hz", ratio: "13:8", role: "Thirteenth Resonance" },
    ],
    activeKeys: [10, 8, 2, 11, 7], // Bb, Ab, D, B, G
  },
];

// 32-band frequency distribution from 20Hz to 20kHz
const FREQ_BANDS = [
  { label: "20Hz", zone: "bass", weight: 0.8 },
  { label: "32Hz", zone: "bass", weight: 0.95 },
  { label: "45Hz", zone: "bass", weight: 1.0 },
  { label: "63Hz", zone: "bass", weight: 0.9 },
  { label: "80Hz", zone: "bass", weight: 0.85 },
  { label: "100Hz", zone: "bass", weight: 0.9 },
  { label: "125Hz", zone: "bass", weight: 0.75 },
  { label: "160Hz", zone: "bass", weight: 0.7 },
  { label: "200Hz", zone: "bass", weight: 0.65 },
  { label: "250Hz", zone: "mid", weight: 0.6 },
  { label: "315Hz", zone: "mid", weight: 0.7 },
  { label: "400Hz", zone: "mid", weight: 0.85 },
  { label: "500Hz", zone: "mid", weight: 0.9 },
  { label: "630Hz", zone: "mid", weight: 0.8 },
  { label: "800Hz", zone: "mid", weight: 0.75 },
  { label: "1kHz", zone: "mid", weight: 0.85 },
  { label: "1.2kHz", zone: "mid", weight: 0.8 },
  { label: "1.6kHz", zone: "lead", weight: 0.9 },
  { label: "2kHz", zone: "lead", weight: 0.95 },
  { label: "2.5kHz", zone: "lead", weight: 0.85 },
  { label: "3.1kHz", zone: "lead", weight: 0.75 },
  { label: "4kHz", zone: "lead", weight: 0.7 },
  { label: "5kHz", zone: "air", weight: 0.8 },
  { label: "6.3kHz", zone: "air", weight: 0.85 },
  { label: "8kHz", zone: "air", weight: 0.9 },
  { label: "10kHz", zone: "air", weight: 0.75 },
  { label: "12kHz", zone: "air", weight: 0.65 },
  { label: "14kHz", zone: "air", weight: 0.55 },
  { label: "16kHz", zone: "air", weight: 0.45 },
  { label: "18kHz", zone: "air", weight: 0.35 },
  { label: "20kHz", zone: "air", weight: 0.25 },
];

export function IntroductionSection() {
  const [activeMode, setActiveMode] = useState<VisualizerMode>("spectrum");
  const [activeStem, setActiveStem] = useState<AudioStem>("all");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeChordIdx, setActiveChordIdx] = useState<number>(0);
  const [hoveredBand, setHoveredBand] = useState<number | null>(null);
  const [resonanceQ, setResonanceQ] = useState<number>(1.42);
  const [timeStep, setTimeStep] = useState<number>(0);

  // SVG Unique Mask IDs to prevent duplicate ID warnings
  const clipId = useId();

  // Animation loop for organic live audio frequency pulsing
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (isPlaying) {
        const delta = (currentTime - lastTime) / 1000;
        setTimeStep((prev) => (prev + delta * 3.5) % 1000);
      }
      lastTime = currentTime;
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const activeChord = CHORD_PRESETS[activeChordIdx];

  // Dynamic band height calculations based on stem selection and animated sine wave harmonics
  const getBandHeight = (index: number) => {
    const band = FREQ_BANDS[index];
    let stemMultiplier = 1.0;

    if (activeStem !== "all") {
      if (activeStem === "bass" && band.zone === "bass") stemMultiplier = 1.35;
      else if (activeStem === "mid" && band.zone === "mid") stemMultiplier = 1.35;
      else if (activeStem === "lead" && band.zone === "lead") stemMultiplier = 1.35;
      else if (activeStem === "air" && band.zone === "air") stemMultiplier = 1.35;
      else stemMultiplier = 0.2;
    }

    if (!isPlaying) {
      return Math.round(band.weight * 45 * stemMultiplier);
    }

    // Organic composite waveforms (f1, f2, f3 harmonics)
    const wave1 = Math.sin(timeStep * 1.8 + index * 0.45) * 0.28;
    const wave2 = Math.sin(timeStep * 3.2 - index * 0.8) * 0.18;
    const wave3 = Math.cos(timeStep * 0.9 + index * 0.2) * 0.14;
    const pulse = 0.45 + wave1 + wave2 + wave3;

    const baseVal = band.weight * pulse * resonanceQ;
    const clamped = Math.max(0.08, Math.min(0.96, baseVal));
    return Math.round(clamped * 100 * stemMultiplier);
  };

  // Lissajous Curve Path for Polar Vectorscope
  const generateLissajousPath = (size: number) => {
    const center = size / 2;
    const radius = size * 0.38;
    const points: string[] = [];
    const steps = 180;
    const a = 3; // frequency ratio X
    const b = 2; // frequency ratio Y (3:2 = Perfect Fifth Lissajous figure)
    const delta = isPlaying ? timeStep * 1.2 : 1.1;

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const x = center + radius * Math.sin(a * theta + delta) * (0.85 + Math.sin(theta * 5 + timeStep) * 0.08);
      const y = center + radius * Math.sin(b * theta) * (0.85 + Math.cos(theta * 4 - timeStep) * 0.08);
      if (i === 0) {
        points.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
      } else {
        points.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
    }
    return points.join(" ");
  };

  return (
    <section className="relative py-20 sm:py-28 bg-[#05060a] border-t border-b border-white/[0.08] overflow-hidden text-text-primary selection:bg-accent-violet/30 selection:text-white">
      {/* Precision Background Hairline Grid (ZRK Tech Style) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px]"
        aria-hidden="true"
      />

      {/* Atmospheric Luminous Ambient Gradients */}
      <div
        className="pointer-events-none absolute top-12 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-violet/[0.04] blur-[120px] -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-10 right-1/4 w-[480px] h-[480px] rounded-full bg-accent-cyan/[0.04] blur-[120px] -z-10"
        aria-hidden="true"
      />

      {/* ZRK-Style Header Telemetry Ticker Bar */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-4 rounded-xl border border-white/[0.08] bg-[#090b14]/70 backdrop-blur-md text-[11px] font-mono tracking-wider text-text-muted">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? "bg-emerald-500" : "bg-amber-500"}`} />
            </span>
            <span className="text-text-secondary uppercase">
              DSP.CORE // <span className="text-white">ACTIVE</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">SYS_ID: #482-96K</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden md:inline text-white/60">
              BUFFER: <span className="text-white">512 SMP</span>
            </span>
            <span className="text-white/60">
              SAMPLE: <span className="text-white">96.0 kHz</span>
            </span>
            <span className="text-white/60">
              BIT DEPTH: <span className="text-white">32-BIT FLOAT</span>
            </span>
            <span className="hidden lg:inline text-accent-cyan/90">
              LATENCY: 0.8ms
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Editorial & Technical Music Deconstruction  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6 lg:pt-2">
            {/* ZRK-style Monospace Section Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-white/[0.12] bg-white/[0.03] text-[11px] font-mono tracking-widest uppercase text-accent-violet-hover">
              <span className="text-white/40">[ 01 ]</span>
              <span>ACOUSTIC DECONSTRUCTION</span>
            </div>

            {/* Core Section Headline (Protected Concept) */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.12]">
              Every song has a story{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                beyond its sound.
              </span>
            </h2>

            {/* Supporting Text (Protected Concept) */}
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans max-w-lg">
              Discover the musical structure hiding beneath the melodies you love.
              Explore rhythm, harmony, instruments, tonal relationships, and the musical
              ideas that bring songs to life.
            </p>

            {/* ZRK-Inspired Technical Spec Overlays with Corner Accents */}
            <div className="pt-2 w-full space-y-3">
              {/* Feature 01 */}
              <div className="relative p-4 rounded-xl border border-white/[0.08] bg-[#0a0d18]/60 hover:border-white/[0.16] transition-colors group">
                {/* ZRK Corner Hairline Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-violet/60" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-violet/60" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-violet/60" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-violet/60" />

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-accent-violet flex items-center gap-2">
                    <span className="text-white/30">[ 01.A ]</span>
                    <span>Polyphonic Frequency Separation</span>
                  </span>
                  <span className="text-[10px] font-mono text-white/30">20Hz - 20kHz</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Isolate spectral overtone energy into clear stems — deep bass weight,
                  harmonic chord geometry, and vocal resonance formants.
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>SPECTRAL BINS: 2048</span>
                  <span className="text-accent-cyan/80">OVERLAP: 75% HANN</span>
                </div>
              </div>

              {/* Feature 02 */}
              <div className="relative p-4 rounded-xl border border-white/[0.08] bg-[#0a0d18]/60 hover:border-white/[0.16] transition-colors group">
                {/* ZRK Corner Hairline Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-cyan/60" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-cyan/60" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-cyan/60" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-cyan/60" />

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-accent-cyan flex items-center gap-2">
                    <span className="text-white/30">[ 01.B ]</span>
                    <span>Harmonic Vectors & Cadence</span>
                  </span>
                  <span className="text-[10px] font-mono text-white/30">Lissajous Matrix</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Map chord progression gravity, modal transitions, and acoustic consonance
                  ratios that drive emotional impact and physical release.
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>PHASE DRIFT: ±0.04°</span>
                  <span className="text-accent-violet-hover">TUNING: 440 Hz</span>
                </div>
              </div>
            </div>

            {/* Bottom Hardware Telemetry Readout */}
            <div className="pt-2 flex items-center gap-4 text-[10px] font-mono text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-violet" />
                <span>DYNAMIC RANGE: 124 dB</span>
              </span>
              <span>•</span>
              <span>HARMONIC THD: &lt; 0.001%</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Ultra-Modern ZRK Musical Instrument Console */}
          {/* ========================================================= */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-white/[0.12] bg-[#080a12]/95 shadow-2xl backdrop-blur-xl overflow-hidden">
              {/* ZRK High-Tech Outer Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/60 pointer-events-none z-30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/60 pointer-events-none z-30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/60 pointer-events-none z-30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/60 pointer-events-none z-30" />

              {/* Console Background Coordinate Grid */}
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"
                aria-hidden="true"
              />

              {/* Top Hardware Console Control Bar */}
              <div className="relative z-20 px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-[#0b0e1b]/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Play/Pause Signal Generator Button */}
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 transition-all text-xs font-mono text-white cursor-pointer"
                    aria-label={isPlaying ? "Pause audio analysis" : "Resume audio analysis"}
                  >
                    {isPlaying ? (
                      <>
                        <PauseIcon size={12} className="text-accent-cyan" />
                        <span>RUNNING</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon size={12} className="text-amber-400" />
                        <span>PAUSED</span>
                      </>
                    )}
                  </button>

                  <div className="h-4 w-px bg-white/10" />

                  {/* Audio Telemetry Info */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-text-secondary">
                    <span className="text-white/40">TRACK:</span>
                    <span className="text-white font-medium">CHOPIN NOCTURNE OP.9 NO.2</span>
                  </div>
                </div>

                {/* Live VU Peak Decibel Meter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-text-muted">VU:</span>
                  <div className="flex items-center gap-0.5 h-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => {
                      const active = isPlaying
                        ? step <= 7 + Math.sin(timeStep * 3 + step) * 2.5
                        : step <= 3;
                      const isHot = step >= 9;
                      const isWarm = step >= 7 && step < 9;
                      return (
                        <div
                          key={step}
                          className={`w-1 h-2.5 rounded-[1px] transition-all duration-75 ${
                            active
                              ? isHot
                                ? "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]"
                                : isWarm
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                              : "bg-white/10"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-mono text-white/50">-6dB</span>
                </div>
              </div>

              {/* Visualizer Mode Selectors (ZRK Tab Accents) */}
              <div className="relative z-20 px-4 sm:px-6 py-2.5 border-b border-white/[0.08] bg-[#070910] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMode("spectrum")}
                    className={`relative px-3 py-1.5 rounded text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
                      activeMode === "spectrum"
                        ? "text-white bg-white/[0.08] border border-accent-cyan/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                        : "text-text-muted hover:text-white border border-transparent hover:border-white/10"
                    }`}
                  >
                    [ 01 // FFT SPECTRUM ]
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode("vectorscope")}
                    className={`relative px-3 py-1.5 rounded text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
                      activeMode === "vectorscope"
                        ? "text-white bg-white/[0.08] border border-accent-violet/50 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                        : "text-text-muted hover:text-white border border-transparent hover:border-white/10"
                    }`}
                  >
                    [ 02 // POLAR VECTORSCOPE ]
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode("harmonic")}
                    className={`relative px-3 py-1.5 rounded text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
                      activeMode === "harmonic"
                        ? "text-white bg-white/[0.08] border border-purple-400/50 shadow-[0_0_12px_rgba(192,132,252,0.15)]"
                        : "text-text-muted hover:text-white border border-transparent hover:border-white/10"
                    }`}
                  >
                    [ 03 // HARMONIC MATRIX ]
                  </button>
                </div>

                {/* Resonance Q Parameter Scrubber */}
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-text-muted">
                  <SlidersIcon size={12} className="text-white/40" />
                  <span>Q-FACTOR:</span>
                  <button
                    type="button"
                    onClick={() => setResonanceQ((prev) => (prev >= 2.0 ? 0.8 : prev + 0.3))}
                    className="text-accent-cyan px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 hover:border-white/20 cursor-pointer"
                  >
                    {resonanceQ.toFixed(2)}x
                  </button>
                </div>
              </div>

              {/* Main Visualizer Stage */}
              <div className="relative z-10 p-4 sm:p-6 min-h-[340px] flex flex-col justify-between">
                {/* ------------------------------------------------------------- */}
                {/* MODE 1: 32-BAND POLYPHONIC FFT SPECTRUM & WATERFALL          */}
                {/* ------------------------------------------------------------- */}
                {activeMode === "spectrum" && (
                  <div className="flex flex-col space-y-4">
                    {/* Frequency Stem Filter Selector */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {(
                          [
                            { id: "all", label: "ALL FREQS" },
                            { id: "bass", label: "SUB/BASS" },
                            { id: "mid", label: "LOW-MID" },
                            { id: "lead", label: "HIGH-MID" },
                            { id: "air", label: "AIR 20k" },
                          ] as const
                        ).map((stem) => (
                          <button
                            key={stem.id}
                            type="button"
                            onClick={() => setActiveStem(stem.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                              activeStem === stem.id
                                ? "bg-accent-violet/20 border border-accent-violet text-white font-medium"
                                : "bg-white/[0.02] border border-white/[0.06] text-text-muted hover:text-white"
                            }`}
                          >
                            {stem.label}
                          </button>
                        ))}
                      </div>

                      {hoveredBand !== null ? (
                        <div className="text-[11px] font-mono text-accent-cyan flex items-center gap-2">
                          <span>FREQ: {FREQ_BANDS[hoveredBand].label}</span>
                          <span className="text-white/30">•</span>
                          <span>LEVEL: -{(100 - getBandHeight(hoveredBand)) * 0.45} dB</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-text-muted">
                          HOVER BAND TO INSPECT
                        </span>
                      )}
                    </div>

                    {/* Frequency Bands Graphic Visualizer */}
                    <div className="relative h-44 w-full rounded-xl bg-[#030408] border border-white/[0.08] p-3 flex items-end justify-between gap-[2px] sm:gap-1 overflow-hidden">
                      {/* Decibel Horizontal Grid Reference Lines */}
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-2 px-3 text-[9px] font-mono text-white/15">
                        <div className="border-b border-white/[0.06] w-full flex justify-between">
                          <span>0 dB</span>
                          <span>MAX HEADROOM</span>
                        </div>
                        <div className="border-b border-white/[0.04] w-full flex justify-between">
                          <span>-12 dB</span>
                          <span>NOMINAL RMS</span>
                        </div>
                        <div className="border-b border-white/[0.04] w-full flex justify-between">
                          <span>-24 dB</span>
                          <span>AMBIENT FLOOR</span>
                        </div>
                        <div className="border-b border-white/[0.04] w-full flex justify-between">
                          <span>-48 dB</span>
                          <span>NOISE THRESHOLD</span>
                        </div>
                      </div>

                      {/* Continuous Spline Audio Energy Curve */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        preserveAspectRatio="none"
                        viewBox="0 0 320 100"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id={`curveGrad-${clipId}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                          </linearGradient>
                        </defs>
                        <path
                          d={FREQ_BANDS.map((_, i) => {
                            const x = (i / (FREQ_BANDS.length - 1)) * 320;
                            const y = 98 - (getBandHeight(i) / 100) * 85;
                            return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                          }).join(" ")}
                          fill="none"
                          stroke={`url(#curveGrad-${clipId})`}
                          strokeWidth="2"
                        />
                      </svg>

                      {/* 32 Individual Frequency Columns */}
                      {FREQ_BANDS.map((band, idx) => {
                        const h = getBandHeight(idx);
                        const isHovered = hoveredBand === idx;
                        const zoneColor =
                          band.zone === "bass"
                            ? "bg-purple-500"
                            : band.zone === "mid"
                            ? "bg-indigo-400"
                            : band.zone === "lead"
                            ? "bg-sky-400"
                            : "bg-cyan-400";

                        return (
                          <div
                            key={band.label}
                            onMouseEnter={() => setHoveredBand(idx)}
                            onMouseLeave={() => setHoveredBand(null)}
                            className="relative flex-1 h-full flex flex-col justify-end items-center group cursor-crosshair z-20"
                          >
                            {/* Floating Peak Hold Indicator */}
                            <div
                              className={`w-full h-[2px] rounded-full transition-all duration-150 mb-0.5 ${
                                isHovered ? "bg-white shadow-[0_0_8px_#ffffff]" : "bg-white/60"
                              }`}
                              style={{
                                transform: `translateY(-${Math.min(95, h + 4)}px)`,
                              }}
                            />

                            {/* Frequency Bar with Glowing Gradient */}
                            <div
                              className={`w-full rounded-t-[2px] transition-all duration-75 ${zoneColor} ${
                                isHovered ? "brightness-150 shadow-[0_0_10px_rgba(255,255,255,0.4)]" : "opacity-85"
                              }`}
                              style={{ height: `${h}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Band Axis Frequency Labels */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-text-muted px-1">
                      <span>20 Hz (SUB)</span>
                      <span>250 Hz (BASS)</span>
                      <span>1 kHz (MID)</span>
                      <span>4 kHz (PRESENCE)</span>
                      <span>20 kHz (AIR)</span>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* MODE 2: POLAR VECTORSCOPE & LISSAJOUS STEREO PHASE SCOPE     */}
                {/* ------------------------------------------------------------- */}
                {activeMode === "vectorscope" && (
                  <div className="flex flex-col items-center justify-center py-2 space-y-4">
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-white/10 bg-[#03050a] flex items-center justify-center overflow-hidden">
                      {/* Concentric Polar Grid Decibel Circles */}
                      <div className="absolute inset-4 rounded-full border border-dashed border-white/[0.08]" />
                      <div className="absolute inset-12 rounded-full border border-white/[0.06]" />
                      <div className="absolute inset-20 rounded-full border border-dashed border-white/[0.04]" />

                      {/* 45-degree Stereo L/R Phase Crosshairs */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-px bg-white/[0.08]" />
                        <div className="h-full w-px bg-white/[0.08] absolute" />
                        <div className="w-full h-px bg-accent-violet/20 rotate-45 absolute" />
                        <div className="w-full h-px bg-accent-cyan/20 -rotate-45 absolute" />
                      </div>

                      {/* Polar Degrees Coordinate Markings */}
                      <span className="absolute top-1 text-[9px] font-mono text-white/30">0° (MONO +M)</span>
                      <span className="absolute bottom-1 text-[9px] font-mono text-white/30">180° (-M)</span>
                      <span className="absolute left-1.5 text-[9px] font-mono text-white/30">L (90°)</span>
                      <span className="absolute right-1.5 text-[9px] font-mono text-white/30">R (270°)</span>

                      {/* Animated Lissajous Phase Orbital Curve */}
                      <svg
                        className="w-full h-full absolute inset-0 z-10"
                        viewBox="0 0 280 280"
                        aria-hidden="true"
                      >
                        <path
                          d={generateLissajousPath(280)}
                          fill="none"
                          stroke="#a78bfa"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="filter drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                        />
                        <path
                          d={generateLissajousPath(280)}
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="1"
                          strokeOpacity="0.7"
                        />
                      </svg>

                      {/* Center Point Radar Origin */}
                      <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] z-20" />
                    </div>

                    {/* Stereo Phase Correlation Telemetry Bar */}
                    <div className="w-full max-w-sm flex items-center justify-between px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[10px] font-mono">
                      <span className="text-text-muted">-1.0 (OUT OF PHASE)</span>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white font-semibold">+0.94 // STEREO COHERENT</span>
                      </div>
                      <span className="text-text-muted">+1.0 (PERFECT MONO)</span>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* MODE 3: HARMONIC OVERTONE MATRIX & CHORD CLUSTER             */}
                {/* ------------------------------------------------------------- */}
                {activeMode === "harmonic" && (
                  <div className="flex flex-col space-y-4">
                    {/* Preset Chord Selector Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CHORD_PRESETS.map((chord, idx) => (
                        <button
                          key={chord.name}
                          type="button"
                          onClick={() => setActiveChordIdx(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            activeChordIdx === idx
                              ? "border-accent-violet bg-accent-violet/15 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                              : "border-white/[0.06] bg-white/[0.02] text-text-secondary hover:text-white hover:border-white/15"
                          }`}
                        >
                          <div className="text-[10px] font-mono text-text-muted uppercase">
                            Preset 0{idx + 1}
                          </div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            {chord.symbol}
                          </div>
                          <div className="text-[10px] font-mono text-accent-cyan mt-0.5">
                            {chord.scaleType}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Harmonic Intervals & Physical Ratio Matrix */}
                    <div className="rounded-xl border border-white/[0.08] bg-[#030509] p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono pb-2 border-b border-white/[0.06]">
                        <span className="text-text-muted">CHORD: <span className="text-white font-semibold">{activeChord.name}</span></span>
                        <span className="text-accent-violet">CONSONANCE: {activeChord.consonance}%</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {activeChord.notes.map((n) => (
                          <div
                            key={n.note}
                            className="p-2 rounded-lg border border-white/[0.05] bg-white/[0.02] flex flex-col"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-accent-cyan">{n.note}</span>
                              <span className="text-[10px] font-mono text-white/50">{n.ratio}</span>
                            </div>
                            <span className="text-[10px] font-mono text-white/70 mt-0.5">{n.freq}</span>
                            <span className="text-[9px] text-text-muted mt-1 truncate">{n.role}</span>
                          </div>
                        ))}
                      </div>

                      {/* Micro-Keyboard Voicing Preview */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-text-muted">VOICED KEYS:</span>
                        <div className="flex gap-1 h-7">
                          {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map(
                            (noteName, keyIdx) => {
                              const isBlack = noteName.includes("#");
                              const isVoiced = activeChord.activeKeys.includes(keyIdx);
                              return (
                                <div
                                  key={noteName}
                                  className={`w-3.5 sm:w-4 rounded-[2px] flex items-end justify-center pb-0.5 text-[8px] font-mono transition-all ${
                                    isVoiced
                                      ? "bg-accent-violet text-white shadow-[0_0_8px_rgba(139,92,246,0.8)] font-bold scale-105"
                                      : isBlack
                                      ? "bg-[#161922] text-white/20"
                                      : "bg-white/20 text-white/40"
                                  }`}
                                >
                                  {isVoiced ? noteName[0] : ""}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Console Status Telemetry */}
                <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-text-muted">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">CALIBRATION:</span>
                    <span className="text-white">A4 = 440.00 Hz (ISO 16)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-white/40">STEREO CORRELATION:</span>
                    <span className="text-accent-cyan font-semibold">+0.94</span>
                    <span className="text-white/20">|</span>
                    <span className="text-accent-violet-hover">ALGORITHM: RADIX-4 FFT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
