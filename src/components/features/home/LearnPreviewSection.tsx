"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import type { Application } from "@splinetool/runtime";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

export function LearnPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem("keynote_welcome_seen");
      if (!hasSeen) {
        sessionStorage.setItem("keynote_welcome_seen", "true");
        const raf = requestAnimationFrame(() => {
          setShowWelcome(true);
        });

        const timer = setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => setShowWelcome(false), 600);
        }, 5500);

        return () => {
          cancelAnimationFrame(raf);
          clearTimeout(timer);
        };
      }
    } catch {
      // Storage unavailable or blocked
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => setShowWelcome(false), 300);
  }, []);

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
            {showWelcome && (
              <div
                className={cn(
                  "absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 pointer-events-auto transition-all duration-700 ease-out",
                  isFadingOut
                    ? "opacity-0 translate-y-2 pointer-events-none"
                    : "opacity-100 translate-y-0"
                )}
              >
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#090a12]/80 backdrop-blur-md px-3.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-cyan-400" />
                  </span>
                  <span className="text-xs font-sans font-medium text-neutral-200 tracking-tight select-none">
                    Welcome to the world of music
                  </span>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="ml-0.5 text-white/40 hover:text-white transition-colors cursor-pointer p-0.5 rounded-full"
                    aria-label="Dismiss welcome message"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </div>
            )}

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
