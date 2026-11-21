"use client";

import React, { useRef, useCallback, useState } from "react";
import type { Application, SplineEvent } from "@splinetool/runtime";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

const getReactionForTarget = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("eye")) {
    const eyePhrases = ["Ohh, my eye!", "Ow! Not my eye!", "Hey, watch my eye!"];
    return eyePhrases[Math.floor(Math.random() * eyePhrases.length)];
  }
  if (lower.includes("head") || lower.includes("hair")) {
    const headPhrases = ["Ouch! Watch the hair!", "Ow, my head!", "Hey, careful up there!"];
    return headPhrases[Math.floor(Math.random() * headPhrases.length)];
  }
  if (lower.includes("arm") || lower.includes("hand") || lower.includes("forearm")) {
    const armPhrases = ["What are you doing?!", "Hey, that's my hand!", "Don't pull my arm!"];
    return armPhrases[Math.floor(Math.random() * armPhrases.length)];
  }
  if (lower.includes("belly") || lower.includes("body")) {
    const bodyPhrases = ["Ouch! That tickles!", "Oof, what are you doing?!", "Hey, personal space!"];
    return bodyPhrases[Math.floor(Math.random() * bodyPhrases.length)];
  }
  const genericPhrases = [
    "Ouch!",
    "Ohh, my eye!",
    "What are you doing?!",
    "Hey, stop that!",
    "Oof! Watch it!",
  ];
  return genericPhrases[Math.floor(Math.random() * genericPhrases.length)];
};

const playCartoonSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch {}
};

const getMaleVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const english = voices.filter((v) => v.lang.startsWith("en"));
  const pool = english.length > 0 ? english : voices;

  const preferred = pool.find((v) =>
    /(male|david|alex|fred|daniel|george|james|guy|tom|oliver|aaron|mark)/i.test(v.name)
  );

  const fallbackNonFemale = pool.find(
    (v) => !/(female|woman|zira|samantha|victoria|karen|fiona|moira|veena|cynthia)/i.test(v.name)
  );

  return preferred || fallbackNonFemale || pool[0];
};

const speakPhrase = (phrase: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    const maleVoice = getMaleVoice();
    if (maleVoice) {
      utterance.voice = maleVoice;
    }
    utterance.pitch = 0.82;
    utterance.rate = 1.12;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  } catch {}
};

export function LearnPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reaction, setReaction] = useState<{ text: string; x: number; y: number } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTriggerTimeRef = useRef(0);

  const triggerReaction = useCallback(
    (targetName: string, clientX?: number, clientY?: number) => {
      const now = Date.now();
      if (now - lastTriggerTimeRef.current < 250) return;
      lastTriggerTimeRef.current = now;

      const text = getReactionForTarget(targetName);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (clientX !== undefined && clientY !== undefined && sectionRef.current) {
        const sectionRect = sectionRef.current.getBoundingClientRect();
        setReaction({
          text,
          x: clientX - sectionRect.left,
          y: clientY - sectionRect.top - 15,
        });
      } else if (canvasRef.current && sectionRef.current) {
        const cRect = canvasRef.current.getBoundingClientRect();
        const sRect = sectionRef.current.getBoundingClientRect();
        setReaction({
          text,
          x: cRect.left - sRect.left + cRect.width / 2,
          y: cRect.top - sRect.top + cRect.height * 0.25,
        });
      }

      timeoutRef.current = setTimeout(() => {
        setReaction(null);
      }, 1800);

      playCartoonSound();
      speakPhrase(text);
    },
    []
  );

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

  const handleSplineMouseDown = useCallback(
    (e: SplineEvent) => {
      triggerReaction(e.target?.name || "body");
    },
    [triggerReaction]
  );

  const handleCanvasContainerPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current || e.currentTarget.querySelector("canvas");
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const relY = (e.clientY - rect.top) / rect.height;
        let part = "body";
        if (relY < 0.38) {
          part = "eye";
        } else if (relY < 0.58) {
          part = "head";
        } else {
          part = "belly";
        }
        triggerReaction(part, e.clientX, e.clientY);
      }
    },
    [triggerReaction]
  );

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

      {reaction && (
        <div
          className="pointer-events-none absolute z-30 transition-all duration-200"
          style={{ left: reaction.x, top: reaction.y }}
        >
          <div className="relative -translate-x-1/2 -translate-y-full rounded-2xl bg-white px-4 py-2 font-display text-xs sm:text-sm font-bold text-black shadow-2xl border-2 border-accent-violet animate-bounce">
            <span>{reaction.text}</span>
            <div className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 bg-white border-r-2 border-b-2 border-accent-violet" />
          </div>
        </div>
      )}

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

          <div
            onPointerDown={handleCanvasContainerPointerDown}
            className="flex-1 relative w-full h-[420px] sm:h-[480px] lg:h-[580px] min-h-[400px] cursor-pointer"
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
              onSplineMouseDown={handleSplineMouseDown}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
