"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { TubesApp } from "threejs-components/build/cursors/tubes1.min.js";

// Musical Harmonic Color Palettes mapped to harmonic color moods
export const HARMONIC_PALETTES = [
  {
    name: "Aeolian",
    tubes: ["#8b5cf6", "#06b6d4", "#7c3aed"],
    lights: ["#6d28d9", "#06b6d4", "#a855f7", "#38bdf8"],
    staffColor: "#a78bfa",
    accentColor: "#22d3ee",
  },
  {
    name: "Dorian",
    tubes: ["#06b6d4", "#6366f1", "#a855f7"],
    lights: ["#0891b2", "#818cf8", "#22d3ee", "#c084fc"],
    staffColor: "#22d3ee",
    accentColor: "#818cf8",
  },
  {
    name: "Lydian",
    tubes: ["#22d3ee", "#a78bfa", "#f43f5e"],
    lights: ["#38bdf8", "#8b5cf6", "#fb7185", "#67e8f9"],
    staffColor: "#38bdf8",
    accentColor: "#f43f5e",
  },
  {
    name: "Mixolydian",
    tubes: ["#f59e0b", "#8b5cf6", "#06b6d4"],
    lights: ["#d97706", "#7c3aed", "#22d3ee", "#fcd34d"],
    staffColor: "#fcd34d",
    accentColor: "#8b5cf6",
  },
];

const SPECTRUM_BAR_COUNT = 96;

// High-resolution acoustic mastering logarithmic spectrum profile
const SPECTRUM_BARS_DATA = Array.from({ length: SPECTRUM_BAR_COUNT }, (_, i) => {
  const norm = i / (SPECTRUM_BAR_COUNT - 1);
  // Natural multi-octave acoustic frequency response
  const subBass = Math.sin(norm * Math.PI * 0.85) * 22;
  const lowMid = Math.sin((norm - 0.2) * Math.PI * 3.4) * 16;
  const midRange = Math.sin((norm - 0.52) * Math.PI * 4.2) * 14;
  const presence = Math.sin((norm - 0.76) * Math.PI * 5) * 11;
  const airTaper = Math.cos(norm * (Math.PI / 2)) * 8;
  const rawHeight = 12 + subBass + (lowMid > 0 ? lowMid : 0) + (midRange > 0 ? midRange : 0) + (presence > 0 ? presence : 0) + airTaper;
  const baseH = Math.max(8, Math.min(62, Math.round(rawHeight)));
  const animIndex = (i % 4) + 1;
  return { baseH, animClass: `pro-fft-pulse-${animIndex}` };
});

interface TubesSoundscapeProps {
  className?: string;
}

export function TubesSoundscape({ className = "" }: TubesSoundscapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<TubesApp | null>(null);

  const [paletteIndex, setPaletteIndex] = useState(0);

  const [isWebGLSupported, setIsWebGLSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const activePalette = HARMONIC_PALETTES[paletteIndex % HARMONIC_PALETTES.length];

  // Cycle palette strictly within the animation component on click
  const cycleHarmonicPalette = useCallback(() => {
    setPaletteIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % HARMONIC_PALETTES.length;
      if (appRef.current?.tubes) {
        const nextPalette = HARMONIC_PALETTES[nextIndex];
        try {
          appRef.current.tubes.setColors(nextPalette.tubes);
          appRef.current.tubes.setLightsColors(nextPalette.lights);
        } catch (err) {
          console.warn("Could not set tube colors dynamically:", err);
        }
      }
      return nextIndex;
    });
  }, []);

  // Click listener: clicking background strictly shifts only animation colors
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea"))
      ) {
        return;
      }
      cycleHarmonicPalette();
    };

    window.addEventListener("pointerdown", handleGlobalClick);
    return () => {
      window.removeEventListener("pointerdown", handleGlobalClick);
    };
  }, [cycleHarmonicPalette]);

  // High-density color gradient interpolation across 96 filaments
  const spectrumBars = useMemo(() => {
    return SPECTRUM_BARS_DATA.map((bar, i) => {
      let color = activePalette.tubes[0];
      if (i >= 24 && i < 54) {
        color = activePalette.accentColor;
      } else if (i >= 54 && i < 76) {
        color = activePalette.staffColor;
      } else if (i >= 76) {
        color = activePalette.tubes[1];
      }
      return { ...bar, color };
    });
  }, [activePalette]);

  // Initialize ThreeJS Tubes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isWebGLSupported) return;

    let isDestroyed = false;

    const initTubes = async () => {
      try {
        const { default: TubesCursor } = await import(
          "threejs-components/build/cursors/tubes1.min.js"
        );

        if (isDestroyed || !canvasRef.current) return;

        const palette = HARMONIC_PALETTES[paletteIndex % HARMONIC_PALETTES.length];

        const app = TubesCursor(canvasRef.current, {
          bloom: {
            strength: 1.4,
            radius: 0.6,
            threshold: 0.08,
          },
          tubes: {
            colors: palette.tubes,
            lights: {
              intensity: 240,
              colors: palette.lights,
            },
          },
          sleepRadiusX: 280,
          sleepRadiusY: 140,
          sleepTimeScale1: 0.7,
          sleepTimeScale2: 1.4,
        });

        appRef.current = app;
      } catch (err) {
        console.warn("WebGL Tubes initialization fallback:", err);
        setIsWebGLSupported(false);
      }
    };

    initTubes();

    return () => {
      isDestroyed = true;
      if (appRef.current && typeof appRef.current.dispose === "function") {
        try {
          appRef.current.dispose();
        } catch (e) {
          console.error("Error disposing Tubes:", e);
        }
        appRef.current = null;
      }
    };
    // Initialize once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebGLSupported]);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute top-[-5%] left-1/2 -translate-x-1/2 h-[700px] w-[1100px] max-w-[130vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18)_0%,rgba(6,182,212,0.07)_40%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      {/* Interactive 3D WebGL Neon Tubes Canvas */}
      <canvas
        ref={canvasRef}
        id="tubes-canvas"
        className="absolute inset-0 h-full w-full opacity-85 transition-opacity duration-1000 cursor-crosshair pointer-events-auto"
      />

      {/* --- PROFESSIONAL STUDIO-GRADE FULL-WIDTH FFT EQUALIZER --- */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 w-full flex flex-col justify-end overflow-hidden z-20"
        aria-hidden="true"
      >
        <style>{`
          @keyframes proFftPulse1 {
            0%, 100% { transform: scaleY(0.48); opacity: 0.6; }
            50% { transform: scaleY(1.0); opacity: 0.95; }
          }
          @keyframes proFftPulse2 {
            0%, 100% { transform: scaleY(0.85); opacity: 0.9; }
            50% { transform: scaleY(0.42); opacity: 0.55; }
          }
          @keyframes proFftPulse3 {
            0%, 100% { transform: scaleY(0.58); opacity: 0.65; }
            50% { transform: scaleY(0.96); opacity: 1.0; }
          }
          @keyframes proFftPulse4 {
            0%, 100% { transform: scaleY(0.92); opacity: 0.95; }
            50% { transform: scaleY(0.48); opacity: 0.6; }
          }
          @keyframes curveFloat {
            0%, 100% { opacity: 0.75; transform: scaleY(0.96); }
            50% { opacity: 0.95; transform: scaleY(1.04); }
          }
          .pro-fft-pulse-1 { animation: proFftPulse1 2.4s ease-in-out infinite; transform-origin: bottom; }
          .pro-fft-pulse-2 { animation: proFftPulse2 2.8s ease-in-out infinite; transform-origin: bottom; }
          .pro-fft-pulse-3 { animation: proFftPulse3 2.1s ease-in-out infinite; transform-origin: bottom; }
          .pro-fft-pulse-4 { animation: proFftPulse4 2.6s ease-in-out infinite; transform-origin: bottom; }
          .fft-envelope-curve { animation: curveFloat 3.2s ease-in-out infinite; transform-origin: bottom; }
          @media (prefers-reduced-motion: reduce) {
            .pro-fft-pulse-1, .pro-fft-pulse-2, .pro-fft-pulse-3, .pro-fft-pulse-4, .fft-envelope-curve {
              animation: none !important;
            }
          }
        `}</style>

        {/* Continuous High-Definition Spectral Envelope Waveform */}
        <div className="w-full relative h-16 sm:h-20 overflow-hidden">
          <svg
            className="w-full h-full fft-envelope-curve"
            viewBox="0 0 1200 75"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="proFftFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={activePalette.accentColor} stopOpacity="0.22" />
                <stop offset="40%" stopColor={activePalette.staffColor} stopOpacity="0.12" />
                <stop offset="100%" stopColor={activePalette.tubes[0]} stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="proFftStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={activePalette.tubes[0]} />
                <stop offset="25%" stopColor={activePalette.accentColor} />
                <stop offset="65%" stopColor={activePalette.staffColor} />
                <stop offset="100%" stopColor={activePalette.tubes[1]} />
              </linearGradient>
              <filter id="proGlow" x="-5%" y="-30%" width="110%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Gradient Underfill */}
            <path
              d="M 0,72 C 60,72 100,42 160,34 C 230,26 280,50 360,30 C 440,16 540,36 640,26 C 740,16 820,40 940,30 C 1040,22 1120,58 1200,74 L 1200,75 L 0,75 Z"
              fill="url(#proFftFill)"
            />

            {/* Secondary Harmonic Ghost Trace (RMS Average) */}
            <path
              d="M 0,74 C 70,74 110,54 170,48 C 240,42 290,58 370,44 C 450,30 550,48 650,40 C 750,32 830,50 950,42 C 1050,36 1130,64 1200,74"
              stroke={activePalette.staffColor}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.45"
            />

            {/* Razor-Sharp Main Peak Envelope Curve */}
            <path
              d="M 0,72 C 60,72 100,42 160,34 C 230,26 280,50 360,30 C 440,16 540,36 640,26 C 740,16 820,40 940,30 C 1040,22 1120,58 1200,74"
              stroke="url(#proFftStroke)"
              strokeWidth="1.6"
              strokeLinecap="round"
              filter="url(#proGlow)"
            />
          </svg>

          {/* 96 Dense High-Definition Spectral Filament Bars */}
          <div className="absolute inset-0 w-full flex items-end justify-between px-1 sm:px-4 md:px-6">
            {spectrumBars.map((bar, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center flex-1 transition-colors duration-700 ${bar.animClass}`}
                style={{ height: `${bar.baseH}px` }}
              >
                {/* Precision Floating Peak-Hold Micro Dot */}
                <span
                  className="w-[1.5px] h-[1.5px] rounded-full mb-[2px] transition-colors duration-700 opacity-90"
                  style={{
                    backgroundColor: bar.color,
                    boxShadow: `0 0 4px ${bar.color}`,
                  }}
                />
                {/* Razor-Thin Vertical Spectrum Filament */}
                <span
                  className="w-[1px] sm:w-[1.2px] h-full rounded-t-sm transition-colors duration-700 opacity-80"
                  style={{
                    backgroundColor: bar.color,
                    boxShadow: `0 0 3px ${bar.color}`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Studio Precision Hardware Baseline with Micro-Ticks (No text) */}
        <div className="w-full border-t border-border/40 bg-background/40 backdrop-blur-sm px-2 sm:px-6 py-1 flex items-center justify-between">
          {Array.from({ length: 33 }).map((_, idx) => (
            <span
              key={idx}
              className={`w-[1px] bg-border/60 transition-colors ${
                idx % 4 === 0 ? "h-2 bg-text-muted/40" : "h-1 bg-border/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Fallback for reduced motion / non-webgl */}
      {!isWebGLSupported && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(139,92,246,0.2),rgba(6,182,212,0.08),transparent_80%)]" />
      )}

      {/* Smooth bottom vignette fade into background */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-background via-background/40 to-transparent z-10"
        aria-hidden="true"
      />
    </div>
  );
}
