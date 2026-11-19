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
    staffColor: "#a78bfa",
    accentColor: "#22d3ee",
    tag: "Tension & Depth",
  },
  {
    mode: "Dorian (Soul & Groove)",
    keyNote: "D Dorian",
    tubes: ["#06b6d4", "#6366f1", "#a855f7"],
    lights: ["#0891b2", "#818cf8", "#22d3ee", "#c084fc"],
    staffColor: "#22d3ee",
    accentColor: "#818cf8",
    tag: "Smooth & Modal",
  },
  {
    mode: "Lydian (Bright & Cosmic)",
    keyNote: "Bb Lydian",
    tubes: ["#22d3ee", "#a78bfa", "#f43f5e"],
    lights: ["#38bdf8", "#8b5cf6", "#fb7185", "#67e8f9"],
    staffColor: "#38bdf8",
    accentColor: "#f43f5e",
    tag: "Raised 4th (#4)",
  },
  {
    mode: "Mixolydian (Blues & Energy)",
    keyNote: "A Mixolydian",
    tubes: ["#f59e0b", "#8b5cf6", "#06b6d4"],
    lights: ["#d97706", "#7c3aed", "#22d3ee", "#fcd34d"],
    staffColor: "#fcd34d",
    accentColor: "#8b5cf6",
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

  // Global click / pointerdown listener: click anywhere to change color
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't trigger if clicking interactive buttons, inputs, links
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

      {/* --- LUMINOUS MUSICAL STAFF & FLOATING NOTES RIBBON --- */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-70 transition-all duration-700">
        <svg
          className="w-full max-w-[1600px] h-[260px] overflow-visible"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Luminous Glow Filter for Musical Staff & Notes */}
            <filter id="staffGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient along the staff line */}
            <linearGradient id="staffGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={activePalette.staffColor} stopOpacity="0.02" />
              <stop offset="15%" stopColor={activePalette.staffColor} stopOpacity="0.35" />
              <stop offset="50%" stopColor={activePalette.accentColor} stopOpacity="0.45" />
              <stop offset="85%" stopColor={activePalette.staffColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={activePalette.staffColor} stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="noteGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={activePalette.accentColor} />
              <stop offset="100%" stopColor={activePalette.staffColor} />
            </linearGradient>
          </defs>

          {/* 5 Elegant Harmonic Staff Lines */}
          <g filter="url(#staffGlow)" stroke="url(#staffGradient)" strokeWidth="1.2">
            {/* Line 1 (Top) */}
            <path d="M 0,40 C 300,28 600,52 900,38 C 1050,30 1150,42 1200,40" />
            {/* Line 2 */}
            <path d="M 0,52 C 300,40 600,64 900,50 C 1050,42 1150,54 1200,52" />
            {/* Line 3 (Center) */}
            <path d="M 0,64 C 300,52 600,76 900,62 C 1050,54 1150,66 1200,64" />
            {/* Line 4 */}
            <path d="M 0,76 C 300,64 600,88 900,74 C 1050,66 1150,78 1200,76" />
            {/* Line 5 (Bottom) */}
            <path d="M 0,88 C 300,76 600,100 900,86 C 1050,78 1150,90 1200,88" />
          </g>

          {/* Floating Engraved Musical Notes & Symbols along the staff */}
          <g filter="url(#staffGlow)" className="transition-colors duration-500">
            {/* Treble Clef (𝄞) */}
            <g transform="translate(60, 26) scale(0.75)" fill={activePalette.staffColor}>
              <path
                d="M18,65 C14,65 10,61 10,55 C10,46 18,38 24,30 C30,22 32,13 29,7 C26,0 19,0 17,6 C15,11 16,19 18,29 L20,38 C18,38 15,39 13,41 C8,45 5,52 5,59 C5,69 12,77 22,77 C31,77 39,70 39,60 C39,50 31,43 22,43 C21,43 20,43 19,43 L19,32 C25,25 28,17 26,10 C25,5 21,3 19,6 C16,9 17,16 18,25 L21,72 C21,80 18,87 12,89 C8,90 4,88 4,84 C4,81 7,79 10,79 C12,79 13,81 13,82 C11,84 8,85 7,82"
                stroke={activePalette.staffColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>

            {/* Time Signature: 4/4 */}
            <g transform="translate(112, 42)" fill={activePalette.accentColor} className="font-mono text-xs font-black">
              <text x="0" y="16" fontSize="16" fontFamily="var(--font-mono)">4</text>
              <text x="0" y="32" fontSize="16" fontFamily="var(--font-mono)">4</text>
            </g>

            {/* Note 1: Quarter Note (F#) with Sharp ♯ */}
            <g transform="translate(170, 78)">
              {/* Sharp ♯ */}
              <path
                d="M -12,-8 L -12,8 M -7,-12 L -7,4 M -15,-2 L -4,-5 M -15,4 L -4,1"
                stroke={activePalette.staffColor}
                strokeWidth="1.3"
              />
              {/* Notehead */}
              <ellipse cx="0" cy="0" rx="6" ry="4.5" transform="rotate(-22)" fill={activePalette.accentColor} />
              {/* Stem Up */}
              <line x1="5.5" y1="0" x2="5.5" y2="-28" stroke={activePalette.staffColor} strokeWidth="1.6" strokeLinecap="round" />
            </g>

            {/* Note 2 & 3: Beamed Eighth Notes (A - C#) ♫ */}
            <g transform="translate(280, 68)">
              <ellipse cx="0" cy="0" rx="6" ry="4.5" transform="rotate(-22)" fill={activePalette.staffColor} />
              <line x1="5.5" y1="0" x2="5.5" y2="-26" stroke={activePalette.staffColor} strokeWidth="1.6" />

              <ellipse cx="40" cy="-10" rx="6" ry="4.5" transform="rotate(-22 40 -10)" fill={activePalette.accentColor} />
              <line x1="45.5" y1="-10" x2="45.5" y2="-36" stroke={activePalette.accentColor} strokeWidth="1.6" />

              {/* Connecting Beam */}
              <polygon points="5.5,-26 45.5,-36 45.5,-31 5.5,-21" fill="url(#noteGlowGrad)" />
            </g>

            {/* Note 4: Eighth Note with Curved Flag (D) ♪ */}
            <g transform="translate(420, 56)">
              <ellipse cx="0" cy="0" rx="6" ry="4.5" transform="rotate(-22)" fill={activePalette.accentColor} />
              <line x1="5.5" y1="0" x2="5.5" y2="-28" stroke={activePalette.staffColor} strokeWidth="1.6" />
              {/* Flag */}
              <path
                d="M 5.5,-28 C 16,-20 16,-10 18,-6"
                fill="none"
                stroke={activePalette.accentColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Note 5: Half Note (Open Notehead) on E */}
            <g transform="translate(530, 48)">
              <ellipse
                cx="0"
                cy="0"
                rx="6"
                ry="4.5"
                transform="rotate(-22)"
                fill="none"
                stroke={activePalette.staffColor}
                strokeWidth="2"
              />
              <line x1="5.5" y1="0" x2="5.5" y2="-28" stroke={activePalette.staffColor} strokeWidth="1.6" />
            </g>

            {/* Note 6, 7, 8: Fast Triplet Beamed Run ♫ */}
            <g transform="translate(660, 64)">
              <ellipse cx="0" cy="0" rx="5.5" ry="4" transform="rotate(-22)" fill={activePalette.staffColor} />
              <line x1="5" y1="0" x2="5" y2="-25" stroke={activePalette.staffColor} strokeWidth="1.5" />

              <ellipse cx="32" cy="-6" rx="5.5" ry="4" transform="rotate(-22 32 -6)" fill={activePalette.accentColor} />
              <line x1="37" y1="-6" x2="37" y2="-31" stroke={activePalette.accentColor} strokeWidth="1.5" />

              <ellipse cx="64" cy="-14" rx="5.5" ry="4" transform="rotate(-22 64 -14)" fill={activePalette.staffColor} />
              <line x1="69" y1="-14" x2="69" y2="-39" stroke={activePalette.staffColor} strokeWidth="1.5" />

              {/* Dual Beams for 16th triplet */}
              <polygon points="5,-25 69,-39 69,-35 5,-21" fill="url(#noteGlowGrad)" />
              <polygon points="5,-18 69,-32 69,-29 5,-15" fill="url(#noteGlowGrad)" opacity="0.8" />
            </g>

            {/* Note 9: High Overtone with Ledger Line + Flat ♭ */}
            <g transform="translate(830, 36)">
              {/* Ledger Line */}
              <line x1="-12" y1="0" x2="14" y2="0" stroke={activePalette.staffColor} strokeWidth="1.4" opacity="0.7" />
              {/* Flat sign ♭ */}
              <path
                d="M -16,-12 L -16,6 C -14,2 -8,2 -8,7 C -8,11 -16,11 -16,11"
                fill="none"
                stroke={activePalette.accentColor}
                strokeWidth="1.4"
              />
              {/* Notehead */}
              <ellipse cx="0" cy="0" rx="6" ry="4.5" transform="rotate(-22)" fill={activePalette.accentColor} />
              {/* Stem Down */}
              <line x1="-5.5" y1="0" x2="-5.5" y2="28" stroke={activePalette.staffColor} strokeWidth="1.6" />
            </g>

            {/* Note 10: Whole Note (Harmonic Tonic) 𝅝 */}
            <g transform="translate(970, 60)">
              <ellipse
                cx="0"
                cy="0"
                rx="7"
                ry="4.5"
                transform="rotate(-15)"
                fill="none"
                stroke={activePalette.staffColor}
                strokeWidth="2.2"
              />
              <circle cx="0" cy="0" r="2" fill={activePalette.accentColor} opacity="0.6" />
            </g>

            {/* Note 11: Final Resolving Note ♪ */}
            <g transform="translate(1080, 52)">
              <ellipse cx="0" cy="0" rx="6" ry="4.5" transform="rotate(-22)" fill={activePalette.staffColor} />
              <line x1="5.5" y1="0" x2="5.5" y2="-28" stroke={activePalette.staffColor} strokeWidth="1.6" />
              <path
                d="M 5.5,-28 C 16,-20 16,-10 18,-6"
                fill="none"
                stroke={activePalette.accentColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </g>
        </svg>
      </div>

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
