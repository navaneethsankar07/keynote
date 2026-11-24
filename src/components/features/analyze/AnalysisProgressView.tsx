"use client";

import React from "react";
import { Cpu, Loader2, Music2, Activity, Layers } from "lucide-react";
import { AnalysisProgress } from "@/lib/audio-analysis/types";

interface AnalysisProgressViewProps {
  progress: AnalysisProgress | null;
  fileName: string;
}

export function AnalysisProgressView({ progress, fileName }: AnalysisProgressViewProps) {
  const percent = progress?.percent ?? 15;
  const message = progress?.message ?? "Preparing client-side audio DSP analysis...";

  const steps = [
    { label: "1. Onset", threshold: 12 },
    { label: "2. Tempo & BPM", threshold: 25 },
    { label: "3. Beat Grid", threshold: 38 },
    { label: "4. Chroma", threshold: 50 },
    { label: "5. Key & Scale", threshold: 62 },
    { label: "6. Chords", threshold: 74 },
    { label: "7. Progression", threshold: 84 },
    { label: "8. Melody", threshold: 94 },
  ];

  return (
    <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-8 sm:p-12 text-center shadow-2xl space-y-7 relative overflow-hidden select-none animate-in fade-in zoom-in-95 duration-300">
      {/* Background Subtle Radial Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-accent-violet/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Center Animated DSP Icon */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        <div className="h-20 w-20 rounded-3xl bg-surface-elevated text-accent-violet flex items-center justify-center border border-accent-violet/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] relative">
          {percent >= 85 ? (
            <Layers size={36} className="text-accent-cyan animate-pulse" />
          ) : percent >= 60 ? (
            <Music2 size={36} className="text-accent-cyan animate-pulse" />
          ) : percent >= 30 ? (
            <Activity size={36} className="text-accent-violet animate-pulse" />
          ) : (
            <Cpu size={36} className="text-accent-cyan" />
          )}
          <div className="absolute -inset-1.5 rounded-3xl border border-accent-cyan/30 animate-pulse pointer-events-none" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-cyan">
            Client-Side Signal Processing
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
            Analyzing Acoustic, Tonal & Harmonic DNA
          </h3>
          <p className="text-xs font-mono text-text-muted truncate max-w-sm mx-auto">
            {fileName}
          </p>
        </div>
      </div>

      {/* Real Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="h-2 w-full rounded-full bg-surface-elevated border border-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.5)]"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-text-muted px-1">
          <span className="flex items-center gap-1.5 text-text-secondary truncate max-w-[280px] sm:max-w-none">
            <Loader2 size={12} className="animate-spin text-accent-cyan shrink-0" />
            <span className="truncate">{message}</span>
          </span>
          <span className="font-bold text-accent-violet ml-2 shrink-0">{percent}%</span>
        </div>
      </div>

      {/* Real Stage Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2 border-t border-white/5 text-left">
        {steps.map((step, idx) => {
          const isDone = percent > step.threshold;
          const isActive = percent >= step.threshold && !isDone;
          return (
            <div
              key={idx}
              className={`p-2 rounded-xl border text-[10px] font-mono transition-colors text-center ${
                isDone
                  ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-300"
                  : isActive
                  ? "border-accent-violet/30 bg-accent-violet/10 text-accent-cyan animate-pulse"
                  : "border-white/5 bg-white/[0.02] text-text-muted"
              }`}
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
