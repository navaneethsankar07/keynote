"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { TubesApp } from "threejs-components/build/cursors/tubes1.min.js";
import { useAnimation } from "@/context/AnimationContext";

// Musical Harmonic Color Palettes — dialed down for eye comfort and studio elegance
export const HARMONIC_PALETTES = [
  {
    name: "Aeolian",
    tubes: ["#7c3aed", "#0891b2", "#6366f1"],
    lights: ["#5b21b6", "#0e7490", "#6d28d9", "#0284c7"],
    staffColor: "#8b5cf6",
    accentColor: "#06b6d4",
  },
  {
    name: "Dorian",
    tubes: ["#0284c7", "#4f46e5", "#7c3aed"],
    lights: ["#0369a1", "#4338ca", "#0891b2", "#5b21b6"],
    staffColor: "#38bdf8",
    accentColor: "#6366f1",
  },
  {
    name: "Lydian",
    tubes: ["#0ea5e9", "#7c3aed", "#e11d48"],
    lights: ["#0284c7", "#5b21b6", "#be123c", "#38bdf8"],
    staffColor: "#60a5fa",
    accentColor: "#f43f5e",
  },
  {
    name: "Mixolydian",
    tubes: ["#d97706", "#7c3aed", "#0284c7"],
    lights: ["#b45309", "#5b21b6", "#0891b2", "#d97706"],
    staffColor: "#f59e0b",
    accentColor: "#7c3aed",
  },
];

const SPECTRUM_BAR_COUNT = 96;

// High-resolution acoustic mastering logarithmic spectrum profile
const SPECTRUM_BARS_DATA = Array.from({ length: SPECTRUM_BAR_COUNT }, (_, i) => {
  const norm = i / (SPECTRUM_BAR_COUNT - 1);
  const subBass = Math.sin(norm * Math.PI * 0.85) * 20;
  const lowMid = Math.sin((norm - 0.2) * Math.PI * 3.4) * 14;
  const midRange = Math.sin((norm - 0.52) * Math.PI * 4.2) * 12;
  const presence = Math.sin((norm - 0.76) * Math.PI * 5) * 10;
  const airTaper = Math.cos(norm * (Math.PI / 2)) * 7;
  const rawHeight = 10 + subBass + (lowMid > 0 ? lowMid : 0) + (midRange > 0 ? midRange : 0) + (presence > 0 ? presence : 0) + airTaper;
  const baseH = Math.max(7, Math.min(52, Math.round(rawHeight)));
  const animIndex = (i % 4) + 1;
  return { baseH, animClass: `pro-fft-pulse-${animIndex}` };
});

// Custom Luminous Audio Reticle Mouse Cursor (Cyan & Violet, 32x32)
const CUSTOM_CURSOR_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Ccircle cx='16' cy='16' r='8.5' stroke='%2322d3ee' stroke-width='1.2' stroke-opacity='0.8'/%3E%3Cline x1='16' y1='2' x2='16' y2='6' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='16' y1='26' x2='16' y2='30' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='2' y1='16' x2='6' y2='16' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='26' y1='16' x2='30' y2='16' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='16' r='2' fill='%23ffffff'/%3E%3C/svg%3E\") 16 16, crosshair";

interface TubesSoundscapeProps {
  className?: string;
}

export function TubesSoundscape({ className = "" }: TubesSoundscapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<TubesApp | null>(null);

  const { isAnimationActive } = useAnimation();
  const isAnimationActiveRef = useRef(isAnimationActive);

  // Sync ref with state and toggle visual opacity dynamically
  useEffect(() => {
    isAnimationActiveRef.current = isAnimationActive;
    if (containerRef.current) {
      containerRef.current.style.cursor = isAnimationActive ? CUSTOM_CURSOR_URL : "default";
      const canvas = containerRef.current.querySelector("canvas");
      if (canvas) {
        canvas.className = `absolute inset-0 h-full w-full transition-opacity duration-700 pointer-events-auto ${
          isAnimationActive ? "opacity-65" : "opacity-0 pointer-events-none"
        }`;
        canvas.style.cursor = isAnimationActive ? CUSTOM_CURSOR_URL : "default";
      }
    }
  }, [isAnimationActive]);

  const [paletteIndex, setPaletteIndex] = useState(0);

  const [isWebGLSupported, setIsWebGLSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const testCanvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext("webgl2") ||
          testCanvas.getContext("webgl") ||
          testCanvas.getContext("experimental-webgl"))
      );
    } catch {
      return true;
    }
  });

  const activePalette =
    HARMONIC_PALETTES[paletteIndex % HARMONIC_PALETTES.length] || HARMONIC_PALETTES[0];

  // Intercept and swallow unhandled promise rejections from WebGPU adapter probes or disposed contexts
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason && (typeof reason === "object" || typeof reason === "string")) {
        const msg =
          typeof reason === "string"
            ? reason
            : (reason as Error).message || "";
        if (
          msg.includes("Cannot read properties of null") ||
          msg.includes("reading '0'") ||
          msg.includes("reading 'precision'") ||
          msg.includes("WebGPU")
        ) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  // Cycle palette strictly within the animation component on click
  const cycleHarmonicPalette = useCallback(() => {
    setPaletteIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % HARMONIC_PALETTES.length;
      if (appRef.current?.tubes) {
        const nextPalette = HARMONIC_PALETTES[nextIndex] || HARMONIC_PALETTES[0];
        try {
          if (nextPalette?.tubes && typeof appRef.current.tubes.setColors === "function") {
            appRef.current.tubes.setColors(nextPalette.tubes);
          }
          if (nextPalette?.lights && typeof appRef.current.tubes.setLightsColors === "function") {
            appRef.current.tubes.setLightsColors(nextPalette.lights);
          }
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
      let color = activePalette?.tubes?.[0] || "#7c3aed";
      if (i >= 24 && i < 54) {
        color = activePalette?.accentColor || "#06b6d4";
      } else if (i >= 54 && i < 76) {
        color = activePalette?.staffColor || "#8b5cf6";
      } else if (i >= 76) {
        color = activePalette?.tubes?.[1] || "#0891b2";
      }
      return { ...bar, color };
    });
  }, [activePalette]);

  // Initialize ThreeJS Tubes with soft, eye-friendly bloom, dynamic canvas, and zero leaked listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isWebGLSupported) return;

    let isDestroyed = false;

    // Track listeners added during initialization to prevent zombie event listener memory leaks
    type CapturedListener = {
      target: EventTarget;
      type: string;
      listener: EventListenerOrEventListenerObject;
      options?: boolean | AddEventListenerOptions;
    };
    const capturedListeners: CapturedListener[] = [];

    // Dynamically create a virgin canvas element per mount
    const canvas = document.createElement("canvas");
    canvas.id = "tubes-canvas";
    canvas.className = `absolute inset-0 h-full w-full transition-opacity duration-700 pointer-events-auto ${
      isAnimationActiveRef.current ? "opacity-65" : "opacity-0 pointer-events-none"
    }`;
    canvas.style.cursor = isAnimationActiveRef.current ? CUSTOM_CURSOR_URL : "default";
    container.appendChild(canvas);

    const initTubes = async () => {
      try {
        const { default: TubesCursor } = await import(
          "threejs-components/build/cursors/tubes1.min.js"
        );

        if (isDestroyed || !containerRef.current) {
          if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
          return;
        }

        const palette =
          HARMONIC_PALETTES[paletteIndex % HARMONIC_PALETTES.length] ||
          HARMONIC_PALETTES[0];

        // Intercept window and document addEventListener calls during TubesCursor initialization
        // threejs-components has a bug where .bind(this) prevents removeEventListener from working in dispose()
        const origWindowAdd = window.addEventListener.bind(window);
        const origDocAdd = document.addEventListener.bind(document);

        window.addEventListener = function (
          type: string,
          listener: EventListenerOrEventListenerObject,
          options?: boolean | AddEventListenerOptions
        ) {
          capturedListeners.push({ target: window, type, listener, options });
          return origWindowAdd(type, listener, options);
        };

        document.addEventListener = function (
          type: string,
          listener: EventListenerOrEventListenerObject,
          options?: boolean | AddEventListenerOptions
        ) {
          capturedListeners.push({ target: document, type, listener, options });
          return origDocAdd(type, listener, options);
        };

        let app: TubesApp | null = null;
        try {
          app = TubesCursor(canvas, {
            bloom: {
              strength: 0.65, // Soft, eye-friendly bloom (no blinding glare)
              radius: 0.45,
              threshold: 0.18, // Clean threshold so dark backgrounds stay rested
            },
            tubes: {
              colors: palette.tubes,
              lights: {
                intensity: 100, // Balanced, refined ambient illumination
                colors: palette.lights,
              },
            },
            sleepRadiusX: 280,
            sleepRadiusY: 140,
            sleepTimeScale1: 0.7,
            sleepTimeScale2: 1.4,
          });
        } finally {
          window.addEventListener = origWindowAdd;
          document.addEventListener = origDocAdd;
        }

        if (isDestroyed) {
          if (app && typeof app.dispose === "function") {
            try {
              app.dispose();
            } catch {}
          }
          if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
          return;
        }

        appRef.current = app;
      } catch (err) {
        console.warn("WebGL Tubes initialization fallback:", err);
        setIsWebGLSupported(false);
      }
    };

    initTubes();

    return () => {
      isDestroyed = true;
      if (appRef.current) {
        // Defuse three instance completely before disposing
        const threeInst = (appRef.current as unknown as {
          three?: {
            render?: () => void;
            onBeforeRender?: () => void;
            onAfterRender?: () => void;
            renderer?: {
              setAnimationLoop?: (fn: null | (() => void)) => void;
            };
            isDisposed?: boolean;
          };
        })?.three;

        if (threeInst) {
          if (threeInst.renderer && typeof threeInst.renderer.setAnimationLoop === "function") {
            try {
              threeInst.renderer.setAnimationLoop(null);
            } catch {}
          }
          threeInst.render = () => {};
          threeInst.onBeforeRender = () => {};
          threeInst.onAfterRender = () => {};
          threeInst.isDisposed = true;
        }

        try {
          appRef.current.dispose();
        } catch {
          // Ignore disposal errors on unmount
        }
        appRef.current = null;
      }

      // Cleanly remove any zombie listeners that were registered during TubesCursor creation
      capturedListeners.forEach(({ target, type, listener, options }) => {
        try {
          target.removeEventListener(type, listener, options);
        } catch {}
      });

      // Remove canvas from DOM
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
    };
    // Initialize once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebGLSupported]);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden select-none ${className}`}
      aria-hidden="true"
      style={{ cursor: isAnimationActive ? CUSTOM_CURSOR_URL : "default" }}
    >
      {/* Background ambient radial glow — softened to protect eyes */}
      <div
        className="pointer-events-none absolute top-[-5%] left-1/2 -translate-x-1/2 h-[650px] w-[1000px] max-w-[130vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.09)_0%,rgba(6,182,212,0.03)_45%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      {/* Dynamic Interactive 3D WebGL Neon Tubes Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full pointer-events-auto"
        style={{ cursor: isAnimationActive ? CUSTOM_CURSOR_URL : "default" }}
      />

      {/* --- PROFESSIONAL STUDIO-GRADE FULL-WIDTH FFT EQUALIZER --- */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 w-full flex flex-col justify-end overflow-hidden z-20"
        aria-hidden="true"
      >
        <style>{`
          @keyframes proFftPulse1 {
            0%, 100% { transform: scaleY(0.48); opacity: 0.55; }
            50% { transform: scaleY(1.0); opacity: 0.88; }
          }
          @keyframes proFftPulse2 {
            0%, 100% { transform: scaleY(0.85); opacity: 0.82; }
            50% { transform: scaleY(0.42); opacity: 0.5; }
          }
          @keyframes proFftPulse3 {
            0%, 100% { transform: scaleY(0.58); opacity: 0.6; }
            50% { transform: scaleY(0.96); opacity: 0.9; }
          }
          @keyframes proFftPulse4 {
            0%, 100% { transform: scaleY(0.92); opacity: 0.88; }
            50% { transform: scaleY(0.48); opacity: 0.52; }
          }
          .pro-fft-pulse-1 { animation: proFftPulse1 2.4s ease-in-out infinite; transform-origin: bottom; }
          .pro-fft-pulse-2 { animation: proFftPulse2 2.8s ease-in-out infinite; transform-origin: bottom; }
          .pro-fft-pulse-3 { animation: proFftPulse3 2.1s ease-in-out infinite; transform-origin: bottom; }
          .pro-fft-pulse-4 { animation: proFftPulse4 2.6s ease-in-out infinite; transform-origin: bottom; }
          @media (prefers-reduced-motion: reduce) {
            .pro-fft-pulse-1, .pro-fft-pulse-2, .pro-fft-pulse-3, .pro-fft-pulse-4 {
              animation: none !important;
            }
          }
        `}</style>

        {/* 96 Dense High-Definition Spectral Filament Bars (Full Width) */}
        <div
          className="w-full h-14 sm:h-16 flex items-end justify-between px-1 sm:px-4 md:px-6 transition-opacity duration-700"
          style={{ opacity: isAnimationActive ? 1 : 0.25 }}
        >
          {spectrumBars.map((bar, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center flex-1 transition-colors duration-700 ${
                isAnimationActive ? bar.animClass : ""
              }`}
              style={{
                height: `${bar.baseH}px`,
                animationPlayState: isAnimationActive ? "running" : "paused",
              }}
            >
              {/* Precision Floating Peak-Hold Micro Dot */}
              <span
                className="w-[1.5px] h-[1.5px] rounded-full mb-[2px] transition-colors duration-700 opacity-85"
                style={{
                  backgroundColor: bar.color,
                  boxShadow: `0 0 2px ${bar.color}`,
                }}
              />
              {/* Razor-Thin Vertical Spectrum Filament */}
              <span
                className="w-[1px] sm:w-[1.2px] h-full rounded-t-sm transition-colors duration-700 opacity-70"
                style={{
                  backgroundColor: bar.color,
                  boxShadow: `0 0 2px ${bar.color}`,
                }}
              />
            </div>
          ))}
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(139,92,246,0.15),rgba(6,182,212,0.05),transparent_80%)]" />
      )}

      {/* Smooth bottom vignette fade into background */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/40 to-transparent z-10"
        aria-hidden="true"
      />
    </div>
  );
}
