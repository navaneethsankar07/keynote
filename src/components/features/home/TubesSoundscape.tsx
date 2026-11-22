"use client";

import React, { useEffect, useRef, useState } from "react";
import type { TubesApp } from "threejs-components/build/cursors/tubes1.min.js";
import { useAnimation } from "@/context/AnimationContext";
import { StudioEqualizer } from "./StudioEqualizer";

// Custom Luminous Audio Reticle Mouse Cursor (Cyan & Violet, 32x32)
const CUSTOM_CURSOR_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Ccircle cx='16' cy='16' r='8.5' stroke='%2322d3ee' stroke-width='1.2' stroke-opacity='0.8'/%3E%3Cline x1='16' y1='2' x2='16' y2='6' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='16' y1='26' x2='16' y2='30' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='2' y1='16' x2='6' y2='16' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='26' y1='16' x2='30' y2='16' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='16' r='2' fill='%23ffffff'/%3E%3C/svg%3E\") 16 16, crosshair";

interface TubesSoundscapeProps {
  className?: string;
}

export function TubesSoundscape({ className = "" }: TubesSoundscapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<TubesApp | null>(null);

  const { isAnimationActive, activePalette } = useAnimation();
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

  // Sync Tubes colors when active harmonic palette changes
  useEffect(() => {
    if (appRef.current?.tubes) {
      try {
        if (activePalette?.tubes && typeof appRef.current.tubes.setColors === "function") {
          appRef.current.tubes.setColors(activePalette.tubes);
        }
        if (activePalette?.lights && typeof appRef.current.tubes.setLightsColors === "function") {
          appRef.current.tubes.setLightsColors(activePalette.lights);
        }
      } catch (err) {
        console.warn("Could not set tube colors dynamically:", err);
      }
    }
  }, [activePalette]);

  const [isWebGLSupported] = useState(() => {
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

  // Initialize ThreeJS Tubes with soft bloom and dynamic canvas
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isWebGLSupported) return;

    let isDestroyed = false;

    type CapturedListener = {
      target: EventTarget;
      type: string;
      listener: EventListenerOrEventListenerObject;
      options?: boolean | AddEventListenerOptions;
    };
    const capturedListeners: CapturedListener[] = [];

    const originalWindowAddEventListener = window.addEventListener.bind(window);
    const originalDocAddEventListener = document.addEventListener.bind(document);

    window.addEventListener = function (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      capturedListeners.push({ target: window, type, listener, options });
      return originalWindowAddEventListener(type, listener, options);
    };

    document.addEventListener = function (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      capturedListeners.push({ target: document, type, listener, options });
      return originalDocAddEventListener(type, listener, options);
    };

    // Dynamically create clean canvas
    const canvas = document.createElement("canvas");
    canvas.className = `absolute inset-0 h-full w-full transition-opacity duration-700 pointer-events-auto ${
      isAnimationActiveRef.current ? "opacity-65" : "opacity-0 pointer-events-none"
    }`;
    canvas.style.cursor = isAnimationActiveRef.current ? CUSTOM_CURSOR_URL : "default";
    container.appendChild(canvas);

    let isPointerDown = false;
    const handlePointerDown = (e: PointerEvent) => {
      if (e.isPrimary) isPointerDown = true;
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (e.isPrimary) isPointerDown = false;
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (isPointerDown && isAnimationActiveRef.current) {
        canvas.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: e.clientX,
            clientY: e.clientY,
            bubbles: true,
          })
        );
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);

    import("threejs-components/build/cursors/tubes1.min.js")
      .then((module) => {
        if (isDestroyed) {
          if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
          return;
        }

        const TubesCursor = module.default;
        const app = TubesCursor(canvas, {
          tubes: {
            colors: activePalette?.tubes || ["#7c3aed", "#0891b2", "#6366f1"],
            lights: {
              colors: activePalette?.lights || ["#5b21b6", "#0e7490", "#6d28d9", "#0284c7"],
            },
          },
        });

        appRef.current = app;

        window.addEventListener = originalWindowAddEventListener;
        document.addEventListener = originalDocAddEventListener;
      })
      .catch((err) => {
        console.warn("WebGL Tubes initialization skipped:", err);
        window.addEventListener = originalWindowAddEventListener;
        document.addEventListener = originalDocAddEventListener;
      });

    return () => {
      isDestroyed = true;

      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);

      window.addEventListener = originalWindowAddEventListener;
      document.addEventListener = originalDocAddEventListener;

      if (appRef.current) {
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
        } catch {}
        appRef.current = null;
      }

      capturedListeners.forEach(({ target, type, listener, options }) => {
        try {
          target.removeEventListener(type, listener, options);
        } catch {}
      });

      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebGLSupported]);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden select-none ${className}`}
      aria-hidden="true"
      style={{ cursor: isAnimationActive ? CUSTOM_CURSOR_URL : "default" }}
    >
      {/* Background ambient radial glow */}
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
      <StudioEqualizer className="absolute bottom-0 left-0 right-0 z-20" />

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
