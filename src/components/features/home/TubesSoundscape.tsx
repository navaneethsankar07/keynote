"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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

      {/* --- STUDIO ACOUSTIC SOUND RINGS & AMBIENT HARMONIC FREQUENCY SPECTRUM --- */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between overflow-hidden transition-all duration-700"
        aria-hidden="true"
      >
        <style>{`
          @keyframes acousticRingBreathe {
            0%, 100% {
              transform: scale(0.97) rotate(0deg);
              opacity: 0.22;
            }
            50% {
              transform: scale(1.03) rotate(1.5deg);
              opacity: 0.38;
            }
          }
          @keyframes freqBarPulseA {
            0%, 100% { transform: scaleY(0.4); opacity: 0.45; }
            50% { transform: scaleY(1.0); opacity: 0.9; }
          }
          @keyframes freqBarPulseB {
            0%, 100% { transform: scaleY(0.8); opacity: 0.75; }
            50% { transform: scaleY(0.35); opacity: 0.4; }
          }
          @keyframes freqBarPulseC {
            0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
            50% { transform: scaleY(0.95); opacity: 0.85; }
          }
          .acoustic-ring-group {
            animation: acousticRingBreathe 8s ease-in-out infinite;
            transform-origin: center center;
          }
          .freq-bar-1 { animation: freqBarPulseA 2.4s ease-in-out infinite; transform-origin: bottom; }
          .freq-bar-2 { animation: freqBarPulseB 2.8s ease-in-out infinite; transform-origin: bottom; }
          .freq-bar-3 { animation: freqBarPulseC 2.2s ease-in-out infinite; transform-origin: bottom; }
          @media (prefers-reduced-motion: reduce) {
            .acoustic-ring-group, .freq-bar-1, .freq-bar-2, .freq-bar-3 {
              animation: none !important;
            }
          }
        `}</style>

        {/* 1. Subtle Concentric Acoustic Sound Rings radiating behind headline */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="w-[800px] h-[800px] max-w-[130vw] max-h-[130vw] overflow-visible acoustic-ring-group"
            viewBox="0 0 600 600"
            fill="none"
          >
            <defs>
              <filter id="acousticGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Inner harmonic circle */}
            <circle
              cx="300"
              cy="300"
              r="130"
              stroke={activePalette.staffColor}
              strokeWidth="1.2"
              opacity="0.35"
              filter="url(#acousticGlow)"
            />

            {/* Middle acoustic frequency ring with dashed divisions */}
            <circle
              cx="300"
              cy="300"
              r="210"
              stroke={activePalette.accentColor}
              strokeWidth="1.2"
              strokeDasharray="4 12"
              opacity="0.3"
              filter="url(#acousticGlow)"
            />

            {/* Outer harmonic dispersion ring */}
            <circle
              cx="300"
              cy="300"
              r="285"
              stroke={activePalette.staffColor}
              strokeWidth="1"
              strokeDasharray="2 18"
              opacity="0.2"
            />
          </svg>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* 2. Studio Ambient Frequency Spectrum Strip (flanking the bottom above vignette) */}
        <div className="relative z-10 mb-8 sm:mb-12 flex flex-col items-center gap-2 pointer-events-none opacity-80 transition-colors duration-700">
          {/* Audio Equalizer Frequency Bars */}
          <div className="flex items-end gap-1 sm:gap-1.5 h-10 px-4">
            {[
              { h: 14, anim: "freq-bar-1", col: activePalette.tubes[0] },
              { h: 22, anim: "freq-bar-2", col: activePalette.tubes[0] },
              { h: 18, anim: "freq-bar-3", col: activePalette.tubes[0] },
              { h: 28, anim: "freq-bar-1", col: activePalette.accentColor },
              { h: 36, anim: "freq-bar-2", col: activePalette.accentColor },
              { h: 24, anim: "freq-bar-3", col: activePalette.accentColor },
              { h: 32, anim: "freq-bar-1", col: activePalette.staffColor },
              { h: 40, anim: "freq-bar-2", col: activePalette.staffColor },
              { h: 30, anim: "freq-bar-3", col: activePalette.staffColor },
              { h: 26, anim: "freq-bar-1", col: activePalette.tubes[1] },
              { h: 38, anim: "freq-bar-2", col: activePalette.tubes[1] },
              { h: 32, anim: "freq-bar-3", col: activePalette.tubes[1] },
              { h: 22, anim: "freq-bar-1", col: activePalette.accentColor },
              { h: 35, anim: "freq-bar-2", col: activePalette.accentColor },
              { h: 26, anim: "freq-bar-3", col: activePalette.accentColor },
              { h: 16, anim: "freq-bar-1", col: activePalette.staffColor },
              { h: 28, anim: "freq-bar-2", col: activePalette.staffColor },
              { h: 20, anim: "freq-bar-3", col: activePalette.staffColor },
              { h: 12, anim: "freq-bar-1", col: activePalette.tubes[2] },
              { h: 24, anim: "freq-bar-2", col: activePalette.tubes[2] },
              { h: 16, anim: "freq-bar-3", col: activePalette.tubes[2] },
            ].map((bar, idx) => (
              <span
                key={idx}
                className={`w-[2.5px] sm:w-[3px] rounded-full transition-colors duration-700 ${bar.anim}`}
                style={{
                  height: `${bar.h}px`,
                  backgroundColor: bar.col,
                  boxShadow: `0 0 8px ${bar.col}`,
                }}
              />
            ))}
          </div>

          {/* Minimal Acoustic Scale Labels */}
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] font-mono tracking-wider text-text-muted/70">
            <span>20Hz SUB</span>
            <span>•</span>
            <span>1kHz MID</span>
            <span>•</span>
            <span>20kHz AIR</span>
          </div>
        </div>
      </div>

      {/* Fallback for reduced motion / non-webgl */}
      {!isWebGLSupported && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(139,92,246,0.2),rgba(6,182,212,0.08),transparent_80%)]" />
      )}

      {/* Smooth bottom vignette fade into background */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
