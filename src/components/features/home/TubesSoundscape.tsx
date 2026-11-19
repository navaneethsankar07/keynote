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
        className="pointer-events-none absolute top-[-5%] left-1/2 -translate-x-1/2 h-[600px] w-[1000px] max-w-[130vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.16)_0%,rgba(6,182,212,0.06)_40%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      {/* Interactive 3D WebGL Neon Tubes Canvas */}
      <canvas
        ref={canvasRef}
        id="tubes-canvas"
        className="absolute inset-0 h-full w-full opacity-85 transition-opacity duration-1000 cursor-crosshair pointer-events-auto"
      />

      {/* --- CENTERED LUMINOUS NEON SOUNDWAVE WITH MUSICAL STAFF NOTES --- */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-85 transition-all duration-700"
        aria-hidden="true"
      >
        <svg
          className="w-[92vw] max-w-[880px] h-[220px] overflow-visible"
          viewBox="0 0 880 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Neon Bloom Glow Filter matching the 3D tubes */}
            <filter id="neonMelodyGlow" x="-30%" y="-40%" width="160%" height="180%">
              <feGaussianBlur stdDeviation="4" result="heavyGlow" />
              <feGaussianBlur stdDeviation="1.5" result="sharpGlow" />
              <feMerge>
                <feMergeNode in="heavyGlow" />
                <feMergeNode in="sharpGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Sinuous Neon Wave Gradient */}
            <linearGradient id="neonWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={activePalette.tubes[0]} stopOpacity="0" />
              <stop offset="25%" stopColor={activePalette.tubes[0]} stopOpacity="0.85" />
              <stop offset="50%" stopColor={activePalette.tubes[1]} stopOpacity="0.95" />
              <stop offset="75%" stopColor={activePalette.tubes[2]} stopOpacity="0.85" />
              <stop offset="100%" stopColor={activePalette.tubes[2]} stopOpacity="0" />
            </linearGradient>

            {/* Note Beam Gradient */}
            <linearGradient id="neonNoteBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={activePalette.accentColor} />
              <stop offset="100%" stopColor={activePalette.staffColor} />
            </linearGradient>

            <style>{`
              @keyframes melodicWaveFloat {
                0%, 100% {
                  transform: translateY(0px) rotate(-0.5deg);
                }
                50% {
                  transform: translateY(-12px) rotate(0.5deg);
                }
              }
              .melodic-wave-group {
                animation: melodicWaveFloat 6s ease-in-out infinite;
                transform-origin: center center;
              }
              @media (prefers-reduced-motion: reduce) {
                .melodic-wave-group {
                  animation: none !important;
                }
              }
            `}</style>
          </defs>

          <g className="melodic-wave-group" filter="url(#neonMelodyGlow)">
            {/* 1. Fluid Neon Soundwave Ribbon */}
            <path
              d="M 50,115 C 190,55 310,175 450,105 C 590,40 710,165 830,115"
              stroke="url(#neonWaveGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            {/* White-hot energy core running through the neon wave */}
            <path
              d="M 50,115 C 190,55 310,175 450,105 C 590,40 710,165 830,115"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />

            {/* Note 1: Glowing Quarter Note (♩) on first crest (x: 230, y: 80) */}
            <g transform="translate(230, 80)">
              {/* Subtle acoustic bloom ring */}
              <circle cx="0" cy="0" r="11" stroke={activePalette.staffColor} strokeWidth="1" opacity="0.35" fill="none" />
              {/* Notehead */}
              <ellipse cx="0" cy="0" rx="7.5" ry="5.5" transform="rotate(-20)" fill={activePalette.staffColor} />
              <ellipse cx="0" cy="0" rx="4" ry="2.5" transform="rotate(-20)" fill="#ffffff" opacity="0.6" />
              {/* Stem */}
              <line x1="7" y1="0" x2="7" y2="-34" stroke={activePalette.staffColor} strokeWidth="2.4" strokeLinecap="round" />
            </g>

            {/* Note 2 & 3: Luminous Beamed Eighth Notes (♫) across central crest (x: 420 to 472) */}
            <g transform="translate(420, 115)">
              <ellipse cx="0" cy="0" rx="7.5" ry="5.5" transform="rotate(-20)" fill={activePalette.accentColor} />
              <ellipse cx="0" cy="0" rx="4" ry="2.5" transform="rotate(-20)" fill="#ffffff" opacity="0.6" />
              <line x1="7" y1="0" x2="7" y2="-36" stroke={activePalette.accentColor} strokeWidth="2.4" strokeLinecap="round" />

              <ellipse cx="52" cy="-12" rx="7.5" ry="5.5" transform="rotate(-20 52 -12)" fill={activePalette.staffColor} />
              <ellipse cx="52" cy="-12" rx="4" ry="2.5" transform="rotate(-20 52 -12)" fill="#ffffff" opacity="0.6" />
              <line x1="59" y1="-12" x2="59" y2="-48" stroke={activePalette.staffColor} strokeWidth="2.4" strokeLinecap="round" />

              {/* Connecting neon beam */}
              <polygon points="7,-36 59,-48 59,-41 7,-29" fill="url(#neonNoteBeamGrad)" />
            </g>

            {/* Note 4: Luminous Eighth Note with Curved Neon Flag (♪) (x: 650, y: 95) */}
            <g transform="translate(650, 95)">
              {/* Subtle acoustic bloom ring */}
              <circle cx="0" cy="0" r="11" stroke={activePalette.accentColor} strokeWidth="1" opacity="0.35" fill="none" />
              {/* Notehead */}
              <ellipse cx="0" cy="0" rx="7.5" ry="5.5" transform="rotate(-20)" fill={activePalette.accentColor} />
              <ellipse cx="0" cy="0" rx="4" ry="2.5" transform="rotate(-20)" fill="#ffffff" opacity="0.6" />
              {/* Stem */}
              <line x1="7" y1="0" x2="7" y2="-34" stroke={activePalette.staffColor} strokeWidth="2.4" strokeLinecap="round" />
              {/* Curved flag */}
              <path
                d="M 7,-34 C 21,-25 21,-13 24,-7"
                fill="none"
                stroke={activePalette.accentColor}
                strokeWidth="2.6"
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
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
