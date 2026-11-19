"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  harmonicFreq: number;
  harmonicAmp: number;
  phase: number;
}

export function SoundscapeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;
    let isVisible = true;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Damped mouse tracking for subtle desktop parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isDesktop = false;

    const checkIsDesktop = () => {
      isDesktop =
        window.innerWidth >= 768 &&
        !window.matchMedia("(pointer: coarse)").matches;
    };
    checkIsDesktop();

    // Particle system (ambient acoustic nodes)
    let particles: Particle[] = [];
    const initParticles = () => {
      const count = window.innerWidth < 768 ? 14 : 36;
      particles = [];
      const colors = [
        "rgba(139, 92, 246, ", // Electric violet
        "rgba(124, 58, 237, ", // Deep violet
        "rgba(6, 182, 212, ",  // Cyan
        "rgba(34, 211, 238, ", // Light cyan
        "rgba(248, 250, 252, ", // Soft white
      ];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          baseX: x,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -0.15 - Math.random() * 0.25, // Gentle upward acoustic drift
          radius: 0.8 + Math.random() * 1.4,
          alpha: 0.15 + Math.random() * 0.35,
          color: colors[Math.floor(Math.random() * colors.length)],
          harmonicFreq: 0.001 + Math.random() * 0.002,
          harmonicAmp: 8 + Math.random() * 16,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Resize handler with high-DPI canvas support
    const handleResize = () => {
      checkIsDesktop();
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initParticles();

      // If motion is reduced, render a single static frame
      if (prefersReducedMotion) {
        renderFrame(0);
      }
    };

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDesktop) return;
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / width - 0.5;
      const relY = (e.clientY - rect.top) / height - 0.5;
      targetMouseX = relX * 24; // Subtle max displacement ±12px
      targetMouseY = relY * 16;
    };

    // Visibility change handler (pauses background animation when tab is inactive)
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible && !prefersReducedMotion) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    // Render concentric sound rings (acoustic radiation circles)
    const drawSoundRings = (
      centerX: number,
      centerY: number,
      breatheFactor: number
    ) => {
      ctx.save();
      const ringRadii = [
        { r: Math.min(width, height) * 0.18, alpha: 0.08, dash: [4, 12] },
        { r: Math.min(width, height) * 0.32, alpha: 0.06, dash: [6, 16] },
        { r: Math.min(width, height) * 0.48, alpha: 0.04, dash: [8, 20] },
      ];

      for (let i = 0; i < ringRadii.length; i++) {
        const ring = ringRadii[i];
        const scaledR = ring.r * (1 + breatheFactor * (i + 1) * 0.03);

        ctx.beginPath();
        ctx.arc(centerX, centerY, scaledR, 0, Math.PI * 2);
        ctx.setLineDash(ring.dash);
        ctx.strokeStyle = `rgba(139, 92, 246, ${ring.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    };

    // Render multi-layered harmonic waveforms
    const drawWaveforms = (
      centerY: number,
      mouseOffsetX: number,
      mouseOffsetY: number
    ) => {
      const step = 4; // Step resolution for smooth rendering

      // --- Wave 1: Fundamental Base Melody (Deep Violet) ---
      ctx.save();
      ctx.beginPath();
      const wave1Y = centerY + mouseOffsetY * 0.5;
      const wave1Speed = time * 0.0006;

      ctx.moveTo(0, height);
      ctx.lineTo(0, wave1Y);

      for (let x = 0; x <= width; x += step) {
        const normX = x / width;
        // Harmonic composition: fundamental + gentle overtone
        const y =
          wave1Y +
          Math.sin(x * 0.003 + wave1Speed + mouseOffsetX * 0.02) * 28 +
          Math.cos(x * 0.0012 - wave1Speed * 0.7) * 16 +
          Math.sin(normX * Math.PI) * 10;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      // Soft vertical gradient fill fading into dark background
      const fillGrad = ctx.createLinearGradient(0, wave1Y - 40, 0, height);
      fillGrad.addColorStop(0, "rgba(124, 58, 237, 0.07)");
      fillGrad.addColorStop(0.5, "rgba(139, 92, 246, 0.02)");
      fillGrad.addColorStop(1, "rgba(9, 10, 15, 0)");
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Wave 1 Stroke
      ctx.beginPath();
      for (let x = 0; x <= width; x += step) {
        const normX = x / width;
        const y =
          wave1Y +
          Math.sin(x * 0.003 + wave1Speed + mouseOffsetX * 0.02) * 28 +
          Math.cos(x * 0.0012 - wave1Speed * 0.7) * 16 +
          Math.sin(normX * Math.PI) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const strokeGrad1 = ctx.createLinearGradient(0, 0, width, 0);
      strokeGrad1.addColorStop(0, "rgba(124, 58, 237, 0.05)");
      strokeGrad1.addColorStop(0.3, "rgba(139, 92, 246, 0.28)");
      strokeGrad1.addColorStop(0.7, "rgba(167, 139, 250, 0.25)");
      strokeGrad1.addColorStop(1, "rgba(124, 58, 237, 0.05)");
      ctx.strokeStyle = strokeGrad1;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      // --- Wave 2: Harmonic Counter-melody (Violet to Cyan) ---
      ctx.save();
      ctx.beginPath();
      const wave2Y = centerY + 18 - mouseOffsetY * 0.4;
      const wave2Speed = time * 0.0009;

      for (let x = 0; x <= width; x += step) {
        const y =
          wave2Y +
          Math.sin(x * 0.0052 - wave2Speed) * 20 +
          Math.cos(x * 0.0022 + wave2Speed * 0.8) * 14;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const strokeGrad2 = ctx.createLinearGradient(0, 0, width, 0);
      strokeGrad2.addColorStop(0, "rgba(139, 92, 246, 0.04)");
      strokeGrad2.addColorStop(0.4, "rgba(139, 92, 246, 0.22)");
      strokeGrad2.addColorStop(0.7, "rgba(6, 182, 212, 0.24)");
      strokeGrad2.addColorStop(1, "rgba(6, 182, 212, 0.04)");
      ctx.strokeStyle = strokeGrad2;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();

      // --- Wave 3: High Overtone Shimmer (Delicate Cyan) ---
      ctx.save();
      ctx.beginPath();
      const wave3Y = centerY - 14 + mouseOffsetY * 0.3;
      const wave3Speed = time * 0.0012;

      for (let x = 0; x <= width; x += step) {
        const y =
          wave3Y +
          Math.sin(x * 0.008 + wave3Speed) * 12 +
          Math.sin(x * 0.003 - wave3Speed * 0.5) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const strokeGrad3 = ctx.createLinearGradient(0, 0, width, 0);
      strokeGrad3.addColorStop(0, "rgba(6, 182, 212, 0.02)");
      strokeGrad3.addColorStop(0.5, "rgba(34, 211, 238, 0.16)");
      strokeGrad3.addColorStop(1, "rgba(6, 182, 212, 0.02)");
      ctx.strokeStyle = strokeGrad3;
      ctx.lineWidth = 1.0;
      ctx.stroke();
      ctx.restore();

      // --- Subtle Discrete Sampling Ticks (PCM / FFT intervals) ---
      ctx.save();
      const tickSpacing = window.innerWidth < 768 ? 64 : 40;
      const startX = width * 0.08;
      const endX = width * 0.92;

      for (let x = startX; x <= endX; x += tickSpacing) {
        const waveY =
          wave1Y +
          Math.sin(x * 0.003 + wave1Speed + mouseOffsetX * 0.02) * 28 +
          Math.cos(x * 0.0012 - wave1Speed * 0.7) * 16;

        const tickHeight = 4 + Math.sin(x * 0.01 + time * 0.002) * 3;
        ctx.beginPath();
        ctx.moveTo(x, waveY - tickHeight);
        ctx.lineTo(x, waveY + tickHeight);
        ctx.strokeStyle = "rgba(167, 139, 250, 0.16)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    };

    // Render floating resonance particles
    const drawParticles = () => {
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Animate particle position
        if (!prefersReducedMotion) {
          p.y += p.vy;
          p.phase += p.harmonicFreq * 16;
          p.x = p.baseX + Math.sin(p.phase) * p.harmonicAmp;

          // Wrap around top/bottom
          if (p.y < -10) {
            p.y = height + 10;
            p.baseX = Math.random() * width;
            p.x = p.baseX;
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Draw faint resonance links between near particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 65;

          if (dist < maxDist) {
            const linkAlpha = (1 - dist / maxDist) * 0.07;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${linkAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    };

    // Main render frame function
    const renderFrame = (timestamp: number) => {
      time = timestamp;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      const epicenterX = width * 0.5 + currentMouseX * 0.6;
      const epicenterY = height * 0.38 + currentMouseY * 0.4;
      const breathe = Math.sin(time * 0.0008);

      // Layer 1: Acoustic Radiation Rings
      drawSoundRings(epicenterX, epicenterY, breathe);

      // Layer 2: Flowing Harmonic Waveforms
      drawWaveforms(epicenterY, currentMouseX, currentMouseY);

      // Layer 3: Resonance Nodes & Micro-particles
      drawParticles();
    };

    // Animation loop
    const loop = (timestamp: number) => {
      if (!isVisible) return;
      renderFrame(timestamp);
      animationFrameId = requestAnimationFrame(loop);
    };

    // Initialize
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Ambient background light gradients */}
      <div
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 h-[550px] w-[900px] max-w-[120vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12)_0%,rgba(6,182,212,0.04)_45%,transparent_70%)] blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      {/* HTML5 High-Performance Soundscape Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-90 transition-opacity duration-1000"
      />
    </div>
  );
}

