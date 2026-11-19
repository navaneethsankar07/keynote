"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import type { TubesApp } from "threejs-components/build/cursors/tubes1.min.js";

// Musical Harmonic Color Palettes mapped to musical modes
export const HARMONIC_PALETTES = [
  {
    mode: "Aeolian (Harmonic Minor)",
    keyNote: "F# Minor",
    tubes: ["#8b5cf6", "#06b6d4", "#7c3aed"],
    lights: ["#6d28d9", "#06b6d4", "#a855f7", "#38bdf8"],
    tag: "Tension & Depth",
  },
  {
    mode: "Dorian (Soul & Groove)",
    keyNote: "D Dorian",
    tubes: ["#06b6d4", "#6366f1", "#a855f7"],
    lights: ["#0891b2", "#818cf8", "#22d3ee", "#c084fc"],
    tag: "Smooth & Modal",
  },
  {
    mode: "Lydian (Bright & Cosmic)",
    keyNote: "Bb Lydian",
    tubes: ["#22d3ee", "#a78bfa", "#f43f5e"],
    lights: ["#38bdf8", "#8b5cf6", "#fb7185", "#67e8f9"],
    tag: "Raised 4th (#4)",
  },
  {
    mode: "Mixolydian (Blues & Energy)",
    keyNote: "A Mixolydian",
    tubes: ["#f59e0b", "#8b5cf6", "#06b6d4"],
    lights: ["#d97706", "#7c3aed", "#22d3ee", "#fcd34d"],
    tag: "Dominant 7th (b7)",
  },
];

interface TubesSoundscapeProps {
  activeModeIndex?: number;
  onModeChange?: (index: number) => void;
}

export function TubesSoundscape({
  activeModeIndex = 0,
  onModeChange,
}: TubesSoundscapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<TubesApp | null>(null);

  const [isWebGLSupported, setIsWebGLSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const paletteIndex = activeModeIndex % HARMONIC_PALETTES.length;
  const activePalette = HARMONIC_PALETTES[paletteIndex];

  // Update tubes colors when activeModeIndex changes
  useEffect(() => {
    if (appRef.current?.tubes) {
      const palette = HARMONIC_PALETTES[activeModeIndex % HARMONIC_PALETTES.length];
      appRef.current.tubes.setColors(palette.tubes);
      appRef.current.tubes.setLightsColors(palette.lights);
    }
  }, [activeModeIndex]);

  // Cycle palette on user click
  const cycleHarmonicPalette = useCallback(() => {
    const nextIndex = (activeModeIndex + 1) % HARMONIC_PALETTES.length;
    if (onModeChange) {
      onModeChange(nextIndex);
    }
    if (appRef.current?.tubes) {
      const palette = HARMONIC_PALETTES[nextIndex];
      appRef.current.tubes.setColors(palette.tubes);
      appRef.current.tubes.setLightsColors(palette.lights);
    }
  }, [activeModeIndex, onModeChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isWebGLSupported) return;

    let isDestroyed = false;

    const initTubes = async () => {
      try {
        // Dynamic import to prevent SSR issues in Next.js Turbopack
        const { default: TubesCursor } = await import(
          "threejs-components/build/cursors/tubes1.min.js"
        );

        if (isDestroyed || !canvasRef.current) return;

        const palette = HARMONIC_PALETTES[activeModeIndex % HARMONIC_PALETTES.length];

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
  }, [isWebGLSupported, activeModeIndex]);

  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
      onClick={cycleHarmonicPalette}
    >
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute top-[-5%] left-1/2 -translate-x-1/2 h-[600px] w-[1000px] max-w-[130vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.16)_0%,rgba(6,182,212,0.06)_40%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      {/* Interactive 3D WebGL Neon Tubes Canvas */}
      <canvas
        ref={canvasRef}
        id="tubes-canvas"
        className="absolute inset-0 h-full w-full opacity-85 transition-opacity duration-1000 cursor-crosshair pointer-events-auto"
      />

      {/* Fallback for reduced motion / non-webgl */}
      {!isWebGLSupported && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(139,92,246,0.2),rgba(6,182,212,0.08),transparent_80%)]" />
      )}

      {/* Smooth bottom vignette fade into background */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent"
        aria-hidden="true"
      />

      {/* Interactive Musical Mode Indicator pill */}
      <div className="pointer-events-none absolute top-4 right-4 sm:top-6 sm:right-8 z-20 hidden md:flex items-center gap-2 rounded-full border border-border/70 bg-surface/80 px-3.5 py-1.5 backdrop-blur-md text-[11px] font-mono text-text-secondary shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
        </span>
        <span className="text-text-primary font-semibold">{activePalette.keyNote}</span>
        <span className="text-text-muted">•</span>
        <span className="text-accent-violet-light">{activePalette.mode.split(" ")[0]}</span>
        <span className="text-text-muted hidden lg:inline">| Click to shift chord</span>
      </div>
    </div>
  );
}
