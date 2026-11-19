"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { WaveformIcon, ActivityIcon, SparklesIcon } from "@/components/ui/Icons";
import { useAnimation } from "@/context/AnimationContext";

export function IntroductionSection() {
  const { isAnimationActive } = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse tracking state for 3D parallax & stage spotlight
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normX: 0, normY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth interpolated mouse for fluid canvas ripples
  const smoothMouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  // Handle section mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    setMousePos({ x, y, normX, normY });
    setIsHovered(true);

    smoothMouseRef.current.targetX = x;
    smoothMouseRef.current.targetY = y;
    smoothMouseRef.current.active = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    smoothMouseRef.current.active = false;
    setMousePos((prev) => ({ ...prev, normX: 0, normY: 0 }));
  }, []);

  // Interactive Neon Harmonic Ribbon Canvas (Harmonic continuation from Hero Neon Tubes)
  useEffect(() => {
    if (!isAnimationActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    // Multi-frequency harmonic ribbons (matching Hero neon tubes palette: violet, cyan, indigo)
    const ribbons = [
      {
        yRatio: 0.58,
        freq: 0.0035,
        freq2: 0.008,
        amp: 32,
        amp2: 18,
        speed: 0.02,
        color: "rgba(124, 58, 237, 0.45)", // Electric Violet
        glow: "rgba(124, 58, 237, 0.6)",
        width: 2.2,
        phase: 0,
      },
      {
        yRatio: 0.63,
        freq: 0.005,
        freq2: 0.012,
        amp: 24,
        amp2: 14,
        speed: 0.026,
        color: "rgba(8, 145, 178, 0.4)", // Neon Cyan
        glow: "rgba(8, 145, 178, 0.55)",
        width: 1.8,
        phase: Math.PI / 3,
      },
      {
        yRatio: 0.68,
        freq: 0.0028,
        freq2: 0.006,
        amp: 40,
        amp2: 20,
        speed: 0.016,
        color: "rgba(99, 102, 241, 0.35)", // Indigo Flow
        glow: "rgba(99, 102, 241, 0.5)",
        width: 1.5,
        phase: Math.PI / 1.5,
      },
      {
        yRatio: 0.54,
        freq: 0.007,
        freq2: 0.016,
        amp: 16,
        amp2: 8,
        speed: 0.034,
        color: "rgba(224, 231, 255, 0.28)", // Luminous Overtones
        glow: "rgba(167, 139, 250, 0.4)",
        width: 1.0,
        phase: Math.PI,
      },
    ];

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp smooth mouse
      const sm = smoothMouseRef.current;
      sm.x += (sm.targetX - sm.x) * 0.08;
      sm.y += (sm.targetY - sm.y) * 0.08;

      time += 0.025;

      ribbons.forEach((ribbon) => {
        ctx.beginPath();
        ctx.lineWidth = ribbon.width;
        ctx.strokeStyle = ribbon.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = ribbon.glow;

        const baseY = height * ribbon.yRatio;
        const step = 6;

        for (let x = 0; x <= width; x += step) {
          // Fundamental + Compound Harmonic series
          let y =
            baseY +
            Math.sin(x * ribbon.freq + time * ribbon.speed + ribbon.phase) * ribbon.amp +
            Math.cos(x * ribbon.freq2 - time * (ribbon.speed * 0.7)) * ribbon.amp2;

          // Interactive mouse proximity distortion
          if (sm.active) {
            const dx = x - sm.x;
            const dy = y - sm.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 220;
            if (dist < radius) {
              const influence = Math.pow(1 - dist / radius, 2) * 55;
              y += sm.y > y ? -influence : influence;
            }
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimationActive]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-28 sm:py-36 lg:py-44 border-t border-white/5 bg-[#07080e] overflow-hidden"
    >
      {/* 1. Classy Moving Grand Piano — Melted seamlessly across the entire section */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
        {/* Cinematic parallax container: shifts gently with mouse motion */}
        <div
          className="absolute right-0 top-0 bottom-0 w-full lg:w-[72%] xl:w-[65%] h-full transition-transform duration-700 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.normY * -3}deg) rotateY(${
              mousePos.normX * 4
            }deg) translate3d(${mousePos.normX * -12}px, ${mousePos.normY * -8}px, 0)`,
          }}
        >
          {/* Continuous slow cinematic pan/scale drift */}
          <div className="relative w-full h-full animate-piano-drift">
            <Image
              src="/images/piano-classy.jpg"
              alt="Classy Grand Piano Keys"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover object-[62%_45%] opacity-85 lg:opacity-95"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse 85% 78% at 65% 50%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 86%)",
                maskImage:
                  "radial-gradient(ellipse 85% 78% at 65% 50%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 86%)",
              }}
            />
          </div>
        </div>

        {/* Dynamic Studio Follow-Spotlight: Glides across the keys with the user's cursor */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-700"
          style={{
            background: isHovered
              ? `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124, 58, 237, 0.22), rgba(8, 145, 178, 0.08), transparent 70%)`
              : `radial-gradient(650px circle at 70% 50%, rgba(124, 58, 237, 0.16), rgba(8, 145, 178, 0.05), transparent 70%)`,
          }}
        />

        {/* Seamless edge blending overlays — melts into #07080e on all 4 boundaries */}
        {/* Left feather gradient: guarantees ultra-sharp contrast for typography while blending piano */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#07080e] via-[#07080e]/95 lg:via-[#07080e]/90 to-transparent z-[2]" />

        {/* Top fade gradient: seamless flow from the hero above */}
        <div className="absolute inset-x-0 top-0 h-36 sm:h-48 bg-gradient-to-b from-[#07080e] via-[#07080e]/75 to-transparent z-[2]" />

        {/* Bottom fade gradient: seamless flow into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-48 bg-gradient-to-t from-[#07080e] via-[#07080e]/75 to-transparent z-[2]" />

        {/* Right edge fade */}
        <div className="absolute inset-y-0 right-0 w-28 sm:w-40 bg-gradient-to-l from-[#07080e] to-transparent z-[2]" />
      </div>

      {/* 2. Interactive Neon Harmonic Soundwave Canvas (connecting with Hero's 3D Neon Tubes) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-[3] opacity-80"
      />

      {/* 3. Atmospheric Stage Lighting & Aura */}
      <div
        className="pointer-events-none absolute -top-32 right-1/4 w-[580px] h-[580px] rounded-full bg-accent-violet/15 blur-[150px] animate-aurora-breathe"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 right-1/3 w-[500px] h-[500px] rounded-full bg-accent-cyan/10 blur-[140px] animate-aurora-breathe"
        style={{ animationDelay: "4s" }}
        aria-hidden="true"
      />

      {/* 4. Section Editorial Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Bold Swiss-Style Editorial Story */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start space-y-7">
            {/* Classy Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                01 // Architectural Acoustics
              </span>
            </div>

            {/* Impact Headline */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-text-primary leading-[1.12]">
              Every song has a story{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                beyond its sound.
              </span>
            </h2>

            {/* Editorial Lead Paragraph */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans max-w-xl">
              Discover the musical structure hiding beneath the melodies you love.
              Explore rhythm, harmony, instruments, tonal relationships, and the musical
              ideas that bring songs to life.
            </p>

            {/* Trendy Specular Frosted Glass Feature Cards */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Card 1: Hidden Architecture */}
              <div className="relative rounded-2xl p-5 bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl transition-all duration-300 hover:border-accent-violet/40 hover:bg-white/[0.04] hover:-translate-y-1 shadow-lg shadow-black/40 group overflow-hidden">
                {/* Top specular glow line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-violet/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-accent-violet text-sm font-semibold">
                    <WaveformIcon size={16} />
                    <span>Hidden Architecture</span>
                  </div>
                  <span className="font-mono text-[9px] text-text-muted bg-white/5 px-2 py-0.5 rounded">
                    CADENCE
                  </span>
                </div>

                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Uncover structural cadence, chord transitions, and modal anchors hidden inside familiar hooks.
                </p>

                {/* Micro Harmonic Equalizer Graphic */}
                <div className="flex items-end gap-1 h-5 pt-1">
                  {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 80, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-accent-violet to-accent-cyan rounded-[1px] opacity-70 group-hover:opacity-100 transition-all duration-300"
                      style={{
                        height: `${h}%`,
                        animation: `microEqPulse 1.4s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Card 2: Sonic Anatomy */}
              <div className="relative rounded-2xl p-5 bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan/40 hover:bg-white/[0.04] hover:-translate-y-1 shadow-lg shadow-black/40 group overflow-hidden">
                {/* Top specular glow line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-accent-cyan text-sm font-semibold">
                    <ActivityIcon size={16} />
                    <span>Sonic Anatomy</span>
                  </div>
                  <span className="font-mono text-[9px] text-text-muted bg-white/5 px-2 py-0.5 rounded">
                    MULTI-STEM
                  </span>
                </div>

                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Decompose complex musical mixes into separate frequency overtones, rhythm grooves, and harmonic layers.
                </p>

                {/* Micro Frequency Stem Spectrum Pills */}
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-text-muted">
                  <span className="px-1.5 py-0.5 rounded bg-surface/80 border border-white/5 text-purple-300">
                    SUB
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-surface/80 border border-white/5 text-indigo-300">
                    MID
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-surface/80 border border-white/5 text-cyan-300">
                    LEAD
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-surface/80 border border-white/5 text-text-secondary flex items-center gap-1">
                    <SparklesIcon size={10} />
                    AIR
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Spatial Negative Space revealing the grand piano keys in full glory */}
          <div
            className="hidden lg:block lg:col-span-5 xl:col-span-6 min-h-[420px] pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Scoped Keyframe Animations */}
      <style>{`
        @keyframes pianoDrift {
          0%, 100% {
            transform: scale(1.03) translate(0%, 0%);
          }
          50% {
            transform: scale(1.08) translate(-1.2%, -0.8%);
          }
        }
        @keyframes auroraBreathe {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
          }
        }
        @keyframes microEqPulse {
          0% {
            transform: scaleY(0.4);
          }
          100% {
            transform: scaleY(1);
          }
        }
        .animate-piano-drift {
          animation: pianoDrift 20s ease-in-out infinite alternate;
        }
        .animate-aurora-breathe {
          animation: auroraBreathe 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
