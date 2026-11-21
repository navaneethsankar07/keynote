"use client";

import React, { useRef, useCallback } from "react";
import type { Application } from "@splinetool/runtime";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export function LearnPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const splineRef = useRef<Application | null>(null);
  const isHoveredRef = useRef(false);

  const handlePointerEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (splineRef.current) {
      try {
        splineRef.current.canvas?.dispatchEvent(
          new PointerEvent("pointerenter", { bubbles: true, cancelable: true })
        );
        splineRef.current.setGlobalEvents(true);
      } catch {}
    }
  }, []);

  const handlePointerMove = useCallback(() => {
    if (!isHoveredRef.current) {
      handlePointerEnter();
    }
  }, [handlePointerEnter]);

  const handlePointerLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (splineRef.current) {
      try {
        splineRef.current.setGlobalEvents(false);
        const canvas = splineRef.current.canvas;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          canvas.dispatchEvent(
            new PointerEvent("pointermove", {
              bubbles: true,
              cancelable: true,
              clientX: rect.left + rect.width / 2,
              clientY: rect.top + rect.height / 2,
            })
          );
          canvas.dispatchEvent(
            new PointerEvent("pointerleave", { bubbles: true, cancelable: true })
          );
        }
      } catch {}
    }
  }, []);

  const handleSplineLoad = useCallback((app: Application) => {
    splineRef.current = app;
    if (sectionRef.current?.matches(":hover")) {
      isHoveredRef.current = true;
      try {
        app.canvas?.dispatchEvent(
          new PointerEvent("pointerenter", { bubbles: true, cancelable: true })
        );
        app.setGlobalEvents(true);
      } catch {}
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative py-20 sm:py-28 md:py-32 border-t border-white/5 bg-[#07080e]/50 overflow-hidden"
    >
      <Spotlight
        className="-top-40 left-0 md:left-40 lg:left-60 md:-top-20"
        fill="white"
      />

      <div className="pointer-events-none absolute -top-24 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-violet/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 w-[450px] h-[450px] rounded-full bg-accent-cyan/10 blur-[130px]" />

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
