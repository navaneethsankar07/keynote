"use client";

import React, { useRef, useCallback } from "react";
import type { Application } from "@splinetool/runtime";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export function LearnPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const canvas =
      canvasRef.current || sectionRef.current?.querySelector("canvas");
    if (!canvas) return;

    if (e.target !== canvas && !canvas.contains(e.target as Node)) {
      canvas.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));

      const syntheticEvent = new PointerEvent("pointermove", {
        bubbles: true,
        cancelable: true,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        pointerId: e.pointerId ?? 1,
        pointerType: e.pointerType ?? "mouse",
      });

      Object.defineProperty(syntheticEvent, "pageX", {
        value: e.pageX || e.clientX + window.scrollX,
      });
      Object.defineProperty(syntheticEvent, "pageY", {
        value: e.pageY || e.clientY + window.scrollY,
      });

      canvas.dispatchEvent(syntheticEvent);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    const canvas =
      canvasRef.current || sectionRef.current?.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const centerEvent = new PointerEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
      pointerId: 1,
      pointerType: "mouse",
    });

    Object.defineProperty(centerEvent, "pageX", {
      value: centerX + window.scrollX,
    });
    Object.defineProperty(centerEvent, "pageY", {
      value: centerY + window.scrollY,
    });

    canvas.dispatchEvent(centerEvent);
  }, []);

  const handleSplineLoad = useCallback((app: Application) => {
    canvasRef.current = app.canvas;
  }, []);

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative py-20 sm:py-28 md:py-32 border-t border-white/5 bg-[#07080e]/50 overflow-hidden"
    >
      <Spotlight
        className="-top-40 left-0 md:left-40 lg:left-60 md:-top-20"
        fill="white"
      />

      <div className="pointer-events-none absolute -top-24 right-1/4 w-[500px] h-[500px] rounded-full  blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 w-[450px] h-[450px] rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 min-h-[500px]">
          <div className="flex-1 flex flex-col justify-center items-start text-left max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Understand the language{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                of music.
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-neutral-300 max-w-xl leading-relaxed font-sans">
              Learn music theory through clear explanations, visual demonstrations, guided
              lessons, and examples connected to the music you already love.
            </p>

            <div className="mt-8 sm:mt-10 flex items-center gap-4">
              <Button
                href="/learn"
                variant="primary"
                size="lg"
                icon={<ArrowRightIcon size={18} />}
                iconPosition="right"
              >
                Explore the learning hub
              </Button>
            </div>
          </div>

          <div className="flex-1 relative w-full h-[420px] sm:h-[480px] lg:h-[580px] min-h-[400px]">
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 max-w-[280px] sm:max-w-[320px] pointer-events-none select-none character-bubble-float">
              <div className="relative rounded-2xl sm:rounded-3xl border border-white/20 bg-[#090b14]/85 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.35),inset_0_-1.5px_2px_rgba(255,255,255,0.65),0_0_28px_rgba(139,92,246,0.2)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-cyan-400" />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                    Keynote Guide
                  </span>
                </div>
                <p className="font-display text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                  &ldquo;Welcome to the world of music!&rdquo;
                </p>
                <p className="mt-1 text-xs text-neutral-300 leading-relaxed font-sans">
                  Move your cursor to look around — let&apos;s explore harmony, rhythm, and melody together.
                </p>
                <span
                  className="absolute -bottom-2 right-10 sm:right-14 w-4 h-4 rotate-45 bg-[#090b14] border-r border-b border-white/20 shadow-[1px_1px_2px_rgba(255,255,255,0.5)]"
                  aria-hidden="true"
                />
              </div>
            </div>

            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
