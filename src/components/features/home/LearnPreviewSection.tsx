"use client";

import React, { useRef, useCallback, useEffect } from "react";
import type { Application } from "@splinetool/runtime";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export function LearnPreviewSection() {
  const splineAppRef = useRef<Application | null>(null);

  const applyZoom = useCallback(() => {
    if (!splineAppRef.current) return;
    const zoom =
      typeof window !== "undefined"
        ? window.innerWidth < 640
          ? 0.55
          : window.innerWidth < 1024
          ? 0.62
          : 0.68
        : 0.68;
    splineAppRef.current.setZoom(zoom);
  }, []);

  const handleSplineLoad = useCallback(
    (spline: Application) => {
      splineAppRef.current = spline;
      applyZoom();
      setTimeout(applyZoom, 100);
      setTimeout(applyZoom, 300);
    },
    [applyZoom]
  );

  useEffect(() => {
    window.addEventListener("resize", applyZoom);
    return () => window.removeEventListener("resize", applyZoom);
  }, [applyZoom]);

  return (
    <section className="relative py-20 sm:py-28 md:py-32 border-t border-white/5 bg-[#07080e]/50 overflow-hidden">
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

          <div className="flex-1 relative w-full h-[520px] sm:h-[580px] lg:h-[680px] xl:h-[720px] min-h-[480px] flex items-center justify-center">
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
