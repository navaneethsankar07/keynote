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

const SPECTRUM_BAR_COUNT = 64;

// Precomputed harmonic acoustic heights across 64 frequency bands
const SPECTRUM_BARS_DATA = Array.from({ length: SPECTRUM_BAR_COUNT }, (_, i) => {
  const norm = i / (SPECTRUM_BAR_COUNT - 1);
  const sub = Math.sin(norm * Math.PI * 0.9) * 22;
  const mid1 = Math.sin((norm - 0.22) * Math.PI * 3.2) * 14;
  const mid2 = Math.sin((norm - 0.58) * Math.PI * 4) * 12;
  const airTaper = Math.cos(norm * (Math.PI / 2)) * 10;
  const rawHeight = 18 + sub + (mid1 > 0 ? mid1 : 0) + (mid2 > 0 ? mid2 : 0) + airTaper;
  const baseH = Math.max(10, Math.min(54, Math.round(rawHeight)));
  const animIndex = (i % 4) + 1; // 1, 2, 3, 4
  return { baseH, animClass: `eq-pulse-${animIndex}` };
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

  // Color assignments for the 64 full-width equalizer bars
  const spectrumBars = useMemo(() => {
    return SPECTRUM_BARS_DATA.map((bar, i) => {
      let color = activePalette.tubes[0];
      if (i >= 16 && i < 34) {
        color = activePalette.accentColor;
      } else if (i >= 34 && i < 50) {
        color = activePalette.staffColor;
      } else if (i >= 50) {
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

      {/* --- FULL-WIDTH STUDIO EQUALIZER ALL ALONG THE BOTTOM --- */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 w-full flex flex-col justify-end overflow-hidden z-20"
        aria-hidden="true"
      >
        <style>{`
          @keyframes eqPulse1 {
            0%, 100% { transform: scaleY(0.42); opacity: 0.55; }
            50% { transform: scaleY(1.0); opacity: 0.95; }
          }
          @keyframes eqPulse2 {
            0%, 100% { transform: scaleY(0.85); opacity: 0.9; }
            50% { transform: scaleY(0.38); opacity: 0.5; }
          }
          @keyframes eqPulse3 {
            0%, 100% { transform: scaleY(0.55); opacity: 0.65; }
            50% { transform: scaleY(0.96); opacity: 1.0; }
          }
          @keyframes eqPulse4 {
            0%, 100% { transform: scaleY(0.92); opacity: 0.95; }
            50% { transform: scaleY(0.46); opacity: 0.55; }
          }
          .eq-pulse-1 { animation: eqPulse1 2.2s ease-in-out infinite; transform-origin: bottom; }
          .eq-pulse-2 { animation: eqPulse2 2.6s ease-in-out infinite; transform-origin: bottom; }
          .eq-pulse-3 { animation: eqPulse3 1.9s ease-in-out infinite; transform-origin: bottom; }
          .eq-pulse-4 { animation: eqPulse4 2.4s ease-in-out infinite; transform-origin: bottom; }
          @media (prefers-reduced-motion: reduce) {
            .eq-pulse-1, .eq-pulse-2, .eq-pulse-3, .eq-pulse-4 {
              animation: none !important;
            }
          }
        `}</style>

        {/* 64-Band Full Width Equalizer Bars */}
        <div className="w-full flex items-end justify-between gap-[2px] sm:gap-[3px] md:gap-[4px] px-2 sm:px-6 md:px-10 h-14 sm:h-16">
          {spectrumBars.map((bar, idx) => (
            <span
              key={idx}
              className={`flex-1 rounded-t-full transition-colors duration-700 ${bar.animClass}`}
              style={{
                height: `${bar.baseH}px`,
                backgroundColor: bar.color,
                boxShadow: `0 0 10px ${bar.color}`,
              }}
            />
          ))}
        </div>

        {/* Minimal Audio Frequency Axis scale running full width */}
        <div className="w-full border-t border-border/40 bg-background/50 backdrop-blur-sm px-3 sm:px-6 md:px-10 py-1.5 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-text-muted/70 tracking-widest uppercase">
          <span>20Hz Sub</span>
          <span className="hidden sm:inline">60Hz</span>
          <span>120Hz Low</span>
          <span className="hidden md:inline">250Hz</span>
          <span>500Hz Mid</span>
          <span className="hidden md:inline">1kHz</span>
          <span>2kHz High</span>
          <span className="hidden sm:inline">8kHz</span>
          <span>20kHz Air</span>
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
