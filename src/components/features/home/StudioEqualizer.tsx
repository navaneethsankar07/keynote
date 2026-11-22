"use client";

import React, { useMemo } from "react";
import { useAnimation } from "@/context/AnimationContext";

const SPECTRUM_BAR_COUNT = 96;

const SPECTRUM_BARS_DATA = Array.from({ length: SPECTRUM_BAR_COUNT }, (_, i) => {
  const norm = i / (SPECTRUM_BAR_COUNT - 1);
  const subBass = Math.sin(norm * Math.PI * 0.85) * 20;
  const lowMid = Math.sin((norm - 0.2) * Math.PI * 3.4) * 14;
  const midRange = Math.sin((norm - 0.52) * Math.PI * 4.2) * 12;
  const presence = Math.sin((norm - 0.76) * Math.PI * 5) * 10;
  const airTaper = Math.cos(norm * (Math.PI / 2)) * 7;
  const rawHeight =
    10 +
    subBass +
    (lowMid > 0 ? lowMid : 0) +
    (midRange > 0 ? midRange : 0) +
    (presence > 0 ? presence : 0) +
    airTaper;
  const baseH = Math.max(7, Math.min(52, Math.round(rawHeight)));
  const animIndex = (i % 4) + 1;
  return { baseH, animClass: `pro-fft-pulse-${animIndex}` };
});

interface StudioEqualizerProps {
  className?: string;
  baselineClassName?: string;
}

export function StudioEqualizer({
  className = "",
  baselineClassName = "",
}: StudioEqualizerProps) {
  const { isAnimationActive, activePalette } = useAnimation();

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

  return (
    <div
      className={`pointer-events-none w-full flex flex-col justify-end overflow-hidden select-none ${className}`}
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

      {/* Minimal Studio Precision Hardware Baseline with Micro-Ticks */}
      <div
        className={`w-full border-t border-border/40 bg-background/40 backdrop-blur-sm px-2 sm:px-6 py-1 flex items-center justify-between ${baselineClassName}`}
      >
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
  );
}
