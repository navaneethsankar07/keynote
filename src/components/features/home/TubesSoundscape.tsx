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

      {/* --- FLOATING LUMINOUS MUSICAL STAFF NOTES --- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
        <style>{`
          @keyframes staffNoteFloatA {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-13px) rotate(2deg); }
          }
          @keyframes staffNoteFloatB {
            0%, 100% { transform: translateY(0px) rotate(2deg); }
            50% { transform: translateY(12px) rotate(-2deg); }
          }
          @keyframes staffNoteFloatC {
            0%, 100% { transform: translateY(0px) scale(0.96); }
            50% { transform: translateY(-11px) scale(1.04); }
          }
          @keyframes staffNoteFloatD {
            0%, 100% { transform: translateY(0px) rotate(-3deg); }
            50% { transform: translateY(10px) rotate(1.5deg); }
          }
          .staff-note-float-a { animation: staffNoteFloatA 6.5s ease-in-out infinite; }
          .staff-note-float-b { animation: staffNoteFloatB 5.6s ease-in-out infinite; }
          .staff-note-float-c { animation: staffNoteFloatC 7.2s ease-in-out infinite; }
          .staff-note-float-d { animation: staffNoteFloatD 6.8s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .staff-note-float-a, .staff-note-float-b, .staff-note-float-c, .staff-note-float-d {
              animation: none !important;
            }
          }
        `}</style>

        {/* Global SVG Filter & Gradient Definitions */}
        <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
          <defs>
            <filter id="staffNoteGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="staffNoteBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={activePalette.accentColor} />
              <stop offset="100%" stopColor={activePalette.staffColor} />
            </linearGradient>
          </defs>
        </svg>

        {/* Note 1: Beamed Eighth Notes (♫) - Upper Left */}
        <div className="staff-note-float-a absolute top-[10%] left-[2%] sm:left-[6%] lg:left-[10%] opacity-40 sm:opacity-85 scale-75 sm:scale-100 transition-all duration-700">
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none" className="transition-all duration-700">
            <g filter="url(#staffNoteGlow)">
              <ellipse cx="12" cy="41" rx="7" ry="5" transform="rotate(-20 12 41)" fill={activePalette.staffColor} />
              <line x1="18.5" y1="40" x2="18.5" y2="13" stroke={activePalette.staffColor} strokeWidth="2.2" strokeLinecap="round" />

              <ellipse cx="42" cy="33" rx="7" ry="5" transform="rotate(-20 42 33)" fill={activePalette.accentColor} />
              <line x1="48.5" y1="32" x2="48.5" y2="5" stroke={activePalette.accentColor} strokeWidth="2.2" strokeLinecap="round" />

              <polygon points="18.5,13 48.5,5 48.5,11 18.5,19" fill="url(#staffNoteBeamGrad)" />
            </g>
          </svg>
        </div>

        {/* Note 2: Eighth Note with Curved Flag (♪) - Mid Left */}
        <div className="staff-note-float-b absolute top-[26%] left-[1%] sm:left-[4%] lg:left-[6%] opacity-40 sm:opacity-90 scale-75 sm:scale-100 transition-all duration-700">
          <svg width="42" height="50" viewBox="0 0 42 50" fill="none" className="transition-all duration-700">
            <g filter="url(#staffNoteGlow)">
              <ellipse cx="13" cy="39" rx="7" ry="5" transform="rotate(-20 13 39)" fill={activePalette.accentColor} />
              <line x1="19.5" y1="38" x2="19.5" y2="9" stroke={activePalette.staffColor} strokeWidth="2.2" strokeLinecap="round" />
              <path
                d="M 19.5,9 C 31,17 31,27 35,32"
                fill="none"
                stroke={activePalette.accentColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Note 3: Quarter Note with Sharp Accidental (♯♩) - Lower Left */}
        <div className="staff-note-float-c absolute top-[41%] left-[2%] sm:left-[6%] lg:left-[11%] opacity-40 sm:opacity-85 scale-75 sm:scale-100 transition-all duration-700">
          <svg width="46" height="50" viewBox="0 0 46 50" fill="none" className="transition-all duration-700">
            <g filter="url(#staffNoteGlow)">
              <path
                d="M 8,23 L 8,43 M 14,19 L 14,39 M 4,34 L 18,30 M 4,26 L 18,22"
                stroke={activePalette.staffColor}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <ellipse cx="30" cy="39" rx="7" ry="5" transform="rotate(-20 30 39)" fill={activePalette.accentColor} />
              <line x1="36.5" y1="38" x2="36.5" y2="9" stroke={activePalette.staffColor} strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Note 4: Miniature Dual-Beamed Sixteenths (♬) - Upper Right */}
        <div className="staff-note-float-d absolute top-[11%] right-[2%] sm:right-[6%] lg:right-[10%] opacity-40 sm:opacity-85 scale-75 sm:scale-100 transition-all duration-700">
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none" className="transition-all duration-700">
            <g filter="url(#staffNoteGlow)">
              <ellipse cx="12" cy="41" rx="7" ry="5" transform="rotate(-20 12 41)" fill={activePalette.staffColor} />
              <line x1="18.5" y1="40" x2="18.5" y2="10" stroke={activePalette.staffColor} strokeWidth="2.2" strokeLinecap="round" />

              <ellipse cx="42" cy="33" rx="7" ry="5" transform="rotate(-20 42 33)" fill={activePalette.accentColor} />
              <line x1="48.5" y1="32" x2="48.5" y2="2" stroke={activePalette.accentColor} strokeWidth="2.2" strokeLinecap="round" />

              {/* Dual Beams for 16th notes */}
              <polygon points="18.5,10 48.5,2 48.5,7 18.5,15" fill="url(#staffNoteBeamGrad)" />
              <polygon points="18.5,18 48.5,10 48.5,15 18.5,23" fill="url(#staffNoteBeamGrad)" opacity="0.85" />
            </g>
          </svg>
        </div>

        {/* Note 5: Classic Quarter Note (♩) - Mid Right */}
        <div className="staff-note-float-a absolute top-[27%] right-[1%] sm:right-[4%] lg:right-[6%] opacity-40 sm:opacity-90 scale-75 sm:scale-100 transition-all duration-700">
          <svg width="34" height="50" viewBox="0 0 34 50" fill="none" className="transition-all duration-700">
            <g filter="url(#staffNoteGlow)">
              <ellipse cx="13" cy="39" rx="7" ry="5" transform="rotate(-20 13 39)" fill={activePalette.accentColor} />
              <line x1="19.5" y1="38" x2="19.5" y2="9" stroke={activePalette.staffColor} strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Note 6: Beamed Eighth Notes Descending Pair (♫) - Lower Right */}
        <div className="staff-note-float-b absolute top-[43%] right-[2%] sm:right-[6%] lg:right-[11%] opacity-40 sm:opacity-85 scale-75 sm:scale-100 transition-all duration-700">
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none" className="transition-all duration-700">
            <g filter="url(#staffNoteGlow)">
              <ellipse cx="12" cy="34" rx="7" ry="5" transform="rotate(-20 12 34)" fill={activePalette.accentColor} />
              <line x1="18.5" y1="33" x2="18.5" y2="6" stroke={activePalette.staffColor} strokeWidth="2.2" strokeLinecap="round" />

              <ellipse cx="42" cy="41" rx="7" ry="5" transform="rotate(-20 42 41)" fill={activePalette.staffColor} />
              <line x1="48.5" y1="40" x2="48.5" y2="13" stroke={activePalette.accentColor} strokeWidth="2.2" strokeLinecap="round" />

              <polygon points="18.5,6 48.5,13 48.5,19 18.5,12" fill="url(#staffNoteBeamGrad)" />
            </g>
          </svg>
        </div>

        {/* Note 7: Subtle Open Half Note (𝅗𝅥) - Ambient Depth */}
        <div className="staff-note-float-c absolute top-[8%] left-[26%] hidden md:block opacity-45 scale-90 transition-transform duration-700">
          <svg width="34" height="50" viewBox="0 0 34 50" fill="none" className="transition-all duration-700">
            <g filter="url(#staffNoteGlow)">
              <ellipse
                cx="13"
                cy="39"
                rx="7"
                ry="5"
                transform="rotate(-20 13 39)"
                fill="none"
                stroke={activePalette.staffColor}
                strokeWidth="2.4"
              />
              <line x1="19.5" y1="38" x2="19.5" y2="9" stroke={activePalette.staffColor} strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Note 8: Subtle Flagged Note (♪) - Ambient Depth */}
        <div className="staff-note-float-d absolute top-[9%] right-[24%] hidden md:block opacity-45 scale-90 transition-transform duration-700">
          <svg width="42" height="50" viewBox="0 0 42 50" fill="none" className="transition-all duration-700">
            <g filter="url(#staffNoteGlow)">
              <ellipse cx="13" cy="39" rx="7" ry="5" transform="rotate(-20 13 39)" fill={activePalette.staffColor} />
              <line x1="19.5" y1="38" x2="19.5" y2="9" stroke={activePalette.staffColor} strokeWidth="2.2" strokeLinecap="round" />
              <path
                d="M 19.5,9 C 31,17 31,27 35,32"
                fill="none"
                stroke={activePalette.accentColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
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
