"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { WaveformIcon, ActivityIcon, SparklesIcon } from "@/components/ui/Icons";

interface KeyConfig {
  note: string;
  name: string;
  octave: number;
  freq: number;
  isBlack: boolean;
  offsetPercent?: number; // for black keys positioning
}

// 2-octave studio range: C4 (261.63 Hz) to B5 (987.77 Hz)
const WHITE_KEYS: KeyConfig[] = [
  { note: "C4", name: "C", octave: 4, freq: 261.63, isBlack: false },
  { note: "D4", name: "D", octave: 4, freq: 293.66, isBlack: false },
  { note: "E4", name: "E", octave: 4, freq: 329.63, isBlack: false },
  { note: "F4", name: "F", octave: 4, freq: 349.23, isBlack: false },
  { note: "G4", name: "G", octave: 4, freq: 392.0, isBlack: false },
  { note: "A4", name: "A", octave: 4, freq: 440.0, isBlack: false },
  { note: "B4", name: "B", octave: 4, freq: 493.88, isBlack: false },
  { note: "C5", name: "C", octave: 5, freq: 523.25, isBlack: false },
  { note: "D5", name: "D", octave: 5, freq: 587.33, isBlack: false },
  { note: "E5", name: "E", octave: 5, freq: 659.25, isBlack: false },
  { note: "F5", name: "F", octave: 5, freq: 698.46, isBlack: false },
  { note: "G5", name: "G", octave: 5, freq: 783.99, isBlack: false },
  { note: "A5", name: "A", octave: 5, freq: 880.0, isBlack: false },
  { note: "B5", name: "B", octave: 5, freq: 987.77, isBlack: false },
];

const BLACK_KEYS: KeyConfig[] = [
  // Octave 4
  { note: "C#4", name: "C#", octave: 4, freq: 277.18, isBlack: true, offsetPercent: (1 * 100) / 14 - 2.5 },
  { note: "D#4", name: "D#", octave: 4, freq: 311.13, isBlack: true, offsetPercent: (2 * 100) / 14 - 2.5 },
  { note: "F#4", name: "F#", octave: 4, freq: 369.99, isBlack: true, offsetPercent: (4 * 100) / 14 - 2.5 },
  { note: "G#4", name: "G#", octave: 4, freq: 415.3, isBlack: true, offsetPercent: (5 * 100) / 14 - 2.5 },
  { note: "A#4", name: "A#", octave: 4, freq: 466.16, isBlack: true, offsetPercent: (6 * 100) / 14 - 2.5 },
  // Octave 5
  { note: "C#5", name: "C#", octave: 5, freq: 554.37, isBlack: true, offsetPercent: (8 * 100) / 14 - 2.5 },
  { note: "D#5", name: "D#", octave: 5, freq: 622.25, isBlack: true, offsetPercent: (9 * 100) / 14 - 2.5 },
  { note: "F#5", name: "F#", octave: 5, freq: 739.99, isBlack: true, offsetPercent: (11 * 100) / 14 - 2.5 },
  { note: "G#5", name: "G#", octave: 5, freq: 830.61, isBlack: true, offsetPercent: (12 * 100) / 14 - 2.5 },
  { note: "A#5", name: "A#", octave: 5, freq: 932.33, isBlack: true, offsetPercent: (13 * 100) / 14 - 2.5 },
];

const CHORD_VOICINGS = [
  {
    name: "Cmaj9",
    tag: "Lush Tonic",
    notes: ["C4", "E4", "G4", "B4", "D5"],
    root: "C4 (261.6 Hz)",
    consonance: "96.8%",
  },
  {
    name: "F#m11",
    tag: "Atmospheric",
    notes: ["F#4", "A4", "C#5", "E5", "B5"],
    root: "F#4 (370.0 Hz)",
    consonance: "92.4%",
  },
  {
    name: "A♭ Lydian",
    tag: "Cinematic",
    notes: ["C4", "D#4", "G4", "C5", "D5"],
    root: "G#4 (415.3 Hz)",
    consonance: "94.1%",
  },
  {
    name: "D13(b9)",
    tag: "Jazz Cadence",
    notes: ["D4", "F#4", "C5", "D#5", "B5"],
    root: "D4 (293.7 Hz)",
    consonance: "88.6%",
  },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
}

export function IntroductionSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Interactive states
  const [activeNotes, setActiveNotes] = useState<string[]>(["C4", "E4", "G4", "B4", "D5"]);
  const [activeChordName, setActiveChordName] = useState<string>("Cmaj9");
  const [activeConsonance, setActiveConsonance] = useState<string>("96.8%");
  const [lastFrequency, setLastFrequency] = useState<number>(261.63);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });

  // Harmonic impulses for canvas visualizer
  const impulsesRef = useRef<{ xRatio: number; intensity: number; decay: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Sound synthesis using Web Audio API with soft Rhodes / acoustic chime tone
  const playTone = useCallback((freq: number) => {
    if (typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        const AudioClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioClass) return;
        audioCtxRef.current = new AudioClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // Primary fundamental oscillator
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Warm acoustic Rhodes-like characteristics
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, now);

      // Subtle overtone (2nd harmonic) slightly detuned for warmth
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc2.detune.setValueAtTime(4, now);

      // Low-pass filter for smooth, warm vintage tone
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(Math.min(freq * 3.5, 3200), now);
      filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 1.5, 900), now + 0.8);

      // ADSR Envelope
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.06, now + 0.35);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.45);
      osc2.stop(now + 1.45);
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  // Trigger key interaction
  const handleKeyTrigger = useCallback(
    (key: KeyConfig) => {
      setActiveNotes([key.note]);
      setActiveChordName(key.note);
      setLastFrequency(key.freq);
      setActiveConsonance("100% PURE");
      playTone(key.freq);

      // Calculate relative X ratio (0 to 1) for the wave ripple
      const keyIndex = WHITE_KEYS.findIndex((k) => k.note === key.note);
      const ratio = keyIndex >= 0 ? (keyIndex + 0.5) / 14 : 0.5;

      impulsesRef.current.push({
        xRatio: ratio,
        intensity: 1.0,
        decay: 0.94,
      });

      // Spawn burst of harmonic particles
      const colors = ["#a78bfa", "#818cf8", "#22d3ee", "#38bdf8", "#ffffff"];
      for (let i = 0; i < 14; i++) {
        particlesRef.current.push({
          x: ratio,
          y: 0.85,
          vx: (Math.random() - 0.5) * 0.006,
          vy: -Math.random() * 0.012 - 0.004,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 1,
        });
      }
    },
    [playTone]
  );

  // Trigger chord voicing selection
  const handleChordSelect = useCallback(
    (chord: typeof CHORD_VOICINGS[0]) => {
      setActiveNotes(chord.notes);
      setActiveChordName(chord.name);
      setActiveConsonance(chord.consonance);

      // Play rolled arpeggio
      chord.notes.forEach((noteStr, idx) => {
        const found =
          WHITE_KEYS.find((k) => k.note === noteStr) ||
          BLACK_KEYS.find((k) => k.note === noteStr);
        if (found) {
          setTimeout(() => {
            playTone(found.freq);
            setLastFrequency(found.freq);

            const keyIndex = WHITE_KEYS.findIndex((k) => k.note === found.note);
            const ratio = keyIndex >= 0 ? (keyIndex + 0.5) / 14 : 0.5;

            impulsesRef.current.push({
              xRatio: ratio,
              intensity: 0.75,
              decay: 0.95,
            });
          }, idx * 95);
        }
      });
    },
    [playTone]
  );

  // 60FPS Interactive Harmonic Wavefield Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      time += 0.016;
      const width = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const height = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

      ctx.clearRect(0, 0, width, height);

      // Update impulse forces
      impulsesRef.current.forEach((imp) => {
        imp.intensity *= imp.decay;
      });
      impulsesRef.current = impulsesRef.current.filter((imp) => imp.intensity > 0.02);

      // Wave configurations: Fundamental, 2nd, 3rd, 4th harmonics
      const harmonics = [
        {
          color: "rgba(167, 139, 250, 0.55)", // Violet
          baseAmp: 22,
          freq: 0.012,
          speed: 1.2,
          yOffset: height * 0.45,
          lineWidth: 2.2,
        },
        {
          color: "rgba(129, 140, 248, 0.45)", // Indigo
          baseAmp: 16,
          freq: 0.022,
          speed: 1.8,
          yOffset: height * 0.48,
          lineWidth: 1.8,
        },
        {
          color: "rgba(34, 211, 238, 0.5)", // Cyan
          baseAmp: 12,
          freq: 0.034,
          speed: 2.3,
          yOffset: height * 0.52,
          lineWidth: 1.6,
        },
        {
          color: "rgba(255, 255, 255, 0.75)", // White shimmer crest
          baseAmp: 8,
          freq: 0.048,
          speed: 3.1,
          yOffset: height * 0.5,
          lineWidth: 1.2,
        },
      ];

      // Draw harmonic ribbons
      harmonics.forEach((h, hIdx) => {
        ctx.beginPath();
        ctx.strokeStyle = h.color;
        ctx.lineWidth = h.lineWidth;
        ctx.lineCap = "round";

        const points = 140;
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * width;
          const normX = i / points;

          // Natural harmonic standing wave superposition
          let y =
            h.yOffset +
            Math.sin(normX * 12 + time * h.speed + hIdx) * h.baseAmp +
            Math.sin(normX * 24 - time * 0.8) * (h.baseAmp * 0.35);

          // Add interactive impulse displacements from active piano keys
          impulsesRef.current.forEach((imp) => {
            const dist = Math.abs(normX - imp.xRatio);
            if (dist < 0.28) {
              const factor = Math.cos((dist / 0.28) * (Math.PI / 2));
              y -= Math.sin(dist * 35 - time * 8) * imp.intensity * 40 * factor;
            }
          });

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Render & update harmonic particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.014;
        p.alpha = Math.max(0, p.life);

        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0.05);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-28 sm:py-36 lg:py-44 border-t border-white/5 bg-[#06070b] overflow-hidden"
    >
      {/* Dynamic Cursor Spotlight (Awwwards 2026 Luxury Lighting) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ease-out"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.03) 40%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Stage Glows */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-accent-violet/10 blur-[150px] animate-pulse"
        style={{ animationDuration: "8s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/3 w-[550px] h-[550px] rounded-full bg-accent-cyan/10 blur-[140px] animate-pulse"
        style={{ animationDuration: "10s" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Haute-Horlogerie Music Editorial & Live Telemetry */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6">
            {/* Classy Micro-Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
                Acoustic Architecture
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-[11px] text-accent-violet-light">
                {activeChordName}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.12]">
              Every song has a story{" "}
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                beyond its sound.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans max-w-xl">
              Discover the musical structure hiding beneath the melodies you love.
              Explore rhythm, harmony, instruments, tonal relationships, and the musical
              ideas that bring songs to life.
            </p>

            {/* Contemporary Glass Audio Modules */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Module 1: Spectrum Anatomy */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl hover:border-accent-violet/30 transition-all hover:translate-y-[-2px] group">
                <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-2">
                  <div className="flex items-center gap-2 text-accent-violet font-semibold">
                    <WaveformIcon size={14} />
                    <span>SPECTRUM FFT</span>
                  </div>
                  <span className="text-white/40">24-BIT</span>
                </div>
                {/* 5-Band Live Frequency Level Meter */}
                <div className="flex items-end gap-1.5 h-8 my-2">
                  {[65, 88, 45, 92, 74].map((ht, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-white/10 rounded-t-sm overflow-hidden flex flex-col justify-end"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-accent-violet to-accent-cyan rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                        style={{ height: `${ht}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                  <span>SUB</span>
                  <span>MID</span>
                  <span>AIR</span>
                </div>
              </div>

              {/* Module 2: Harmonic Consonance */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl hover:border-accent-cyan/30 transition-all hover:translate-y-[-2px] group">
                <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-2">
                  <div className="flex items-center gap-2 text-accent-cyan font-semibold">
                    <ActivityIcon size={14} />
                    <span>CONSONANCE</span>
                  </div>
                  <span className="text-white/40">PYTHAGOREAN</span>
                </div>
                <div className="my-2">
                  <div className="text-2xl font-bold font-mono tracking-tight text-white group-hover:text-accent-cyan transition-colors">
                    {activeConsonance}
                  </div>
                  <div className="text-[11px] font-mono text-text-muted mt-0.5">
                    Fundamental: {lastFrequency.toFixed(1)} Hz
                  </div>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-accent-violet via-indigo-500 to-accent-cyan rounded-full transition-all duration-500"
                    style={{ width: activeConsonance.includes("%") ? activeConsonance : "95%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2026 Awwwards-Grade Interactive Harmonic Studio Console */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              ref={containerRef}
              className="w-full relative rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#0e1018]/90 to-[#07080d]/95 p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden group"
            >
              {/* Specular Edge Highlighting */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="pointer-events-none absolute -inset-px rounded-3xl border border-white/5" />

              {/* Console Top Navigation Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-medium tracking-wider text-text-primary uppercase">
                    Harmonic String Field
                  </span>
                  <span className="text-white/20">|</span>
                  <span className="font-mono text-[11px] text-accent-cyan">
                    440 Hz ISO
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-text-muted bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <SparklesIcon size={11} className="text-accent-violet-light" />
                    <span>Click keys or chords</span>
                  </span>
                </div>
              </div>

              {/* 60FPS Reactive Soundwave Canvas */}
              <div className="relative z-10 w-full h-36 sm:h-44 my-4 rounded-2xl bg-[#040508]/80 border border-white/[0.06] overflow-hidden flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full block cursor-crosshair pointer-events-auto"
                />

                {/* Corner Studio Telemetry Overlays */}
                <div className="pointer-events-none absolute top-2.5 left-3 font-mono text-[10px] text-white/40 tracking-wider">
                  OSCILLATOR: RHODES/SINE ADSR
                </div>
                <div className="pointer-events-none absolute bottom-2.5 right-3 font-mono text-[10px] text-accent-violet-light tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/5">
                  RESONANCE: 4-POLE BESSEL
                </div>
              </div>

              {/* Tactile Hardware Keyboard */}
              <div className="relative z-10 rounded-2xl border border-white/[0.08] bg-[#05060a] p-2.5 sm:p-3 shadow-inner">
                {/* Vintage Crimson Velvet Felt Strip */}
                <div className="h-1.5 w-full rounded-t-sm bg-gradient-to-r from-[#3b071a] via-[#500724] to-[#3b071a] shadow-sm mb-1" />

                {/* 2-Octave Keyboard Container */}
                <div className="relative w-full h-44 sm:h-52 flex select-none overflow-hidden rounded-b-lg">
                  {/* 14 Satin Ivory White Keys */}
                  {WHITE_KEYS.map((key) => {
                    const isActive = activeNotes.includes(key.note);
                    return (
                      <button
                        key={key.note}
                        type="button"
                        onClick={() => handleKeyTrigger(key)}
                        aria-label={`Key ${key.note}`}
                        className={`flex-1 h-full rounded-b-md border-r border-[#cbd5e1]/30 last:border-r-0 relative z-0 flex flex-col justify-end items-center pb-2.5 transition-all duration-150 cursor-pointer active:translate-y-0.5 ${
                          isActive
                            ? "bg-gradient-to-b from-purple-200 via-indigo-200 to-cyan-200 text-slate-950 font-bold shadow-[0_0_20px_rgba(167,139,250,0.9)] ring-2 ring-accent-violet scale-[1.01]"
                            : "bg-gradient-to-b from-[#fafaf9] via-[#f5f5f4] to-[#e2e8f0] hover:bg-white text-slate-500 shadow-[inset_0_-3px_5px_rgba(0,0,0,0.2)]"
                        }`}
                      >
                        <span className="font-mono text-[11px] sm:text-xs font-semibold">
                          {key.name}
                        </span>
                        <span className="text-[9px] opacity-60 scale-90">
                          {key.octave}
                        </span>
                      </button>
                    );
                  })}

                  {/* 10 Matte Ebony Black Keys */}
                  {BLACK_KEYS.map((key) => {
                    const isActive = activeNotes.includes(key.note);
                    return (
                      <button
                        key={key.note}
                        type="button"
                        onClick={() => handleKeyTrigger(key)}
                        style={{
                          left: `${key.offsetPercent}%`,
                          width: "5.1%",
                        }}
                        aria-label={`Key ${key.note}`}
                        className={`absolute top-0 h-[62%] z-10 rounded-b-sm border-x border-b shadow-2xl transition-all duration-150 cursor-pointer active:translate-y-0.5 flex flex-col justify-end items-center pb-2 ${
                          isActive
                            ? "bg-gradient-to-b from-accent-violet via-purple-600 to-indigo-600 border-accent-violet-light text-white shadow-[0_0_22px_rgba(139,92,246,1)] scale-105"
                            : "bg-gradient-to-b from-[#222736] via-[#141722] to-[#080a10] border-[#31374a] hover:from-[#32394e] hover:to-[#11141e] text-white/60 shadow-[2px_4px_7px_rgba(0,0,0,0.85)]"
                        }`}
                      >
                        <span className="font-mono text-[9px] font-semibold">
                          {key.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chord Voicing Presets */}
              <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-white/40">
                  HARMONIC VOICINGS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CHORD_VOICINGS.map((chord) => {
                    const isSelected = activeChordName === chord.name;
                    return (
                      <button
                        key={chord.name}
                        type="button"
                        onClick={() => handleChordSelect(chord)}
                        className={`px-3 py-1 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-accent-violet text-white font-semibold shadow-[0_0_12px_rgba(139,92,246,0.5)] border border-accent-violet-light"
                            : "bg-white/[0.03] text-text-secondary hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                        }`}
                      >
                        {chord.name}
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
