"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Spotlight } from "@/components/ui/spotlight";

export function LearnPreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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

          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex-1 relative w-full flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[620px] perspective-[1000px]"
          >
            <div className="pointer-events-none absolute w-[380px] h-[380px] rounded-full bg-accent-cyan/15 blur-[120px]" />
            <div className="pointer-events-none absolute w-[320px] h-[320px] rounded-full bg-accent-violet/15 blur-[100px] translate-y-24" />

            <motion.div
              style={{ rotateX, rotateY }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                y: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="relative z-10 w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] aspect-[896/1200] flex items-center justify-center filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)]"
            >
              <Image
                src="/images/3d/music-robot.jpg"
                alt="Keynote Music Theory Robot with vintage radio head and complete legs and feet"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 520px"
                className="object-contain rounded-3xl select-none pointer-events-none"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
