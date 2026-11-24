"use client";

import React, { useState } from "react";
import {
  PITCH_CLASSES,
  ENHARMONIC_NAMES,
  KeyAnalysisResult,
} from "@/lib/audio-analysis/types";
import { BarChart3, Info } from "lucide-react";

interface ChromaVisualizerProps {
  keyResult: KeyAnalysisResult;
}

export function ChromaVisualizer({ keyResult }: ChromaVisualizerProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { chromaPercentages, scaleDegrees, root, mode } = keyResult;
  const rootIdx = PITCH_CLASSES.indexOf(root);
  const fifthIdx = (rootIdx + 7) % 12;
  const thirdIdx = (rootIdx + (mode === "Major" ? 4 : 3)) % 12;

  // Maximum value for scaling bar heights
  const maxPct = Math.max(...chromaPercentages, 15);

  const getNoteRole = (idx: number): { label: string; isPrimary: boolean } => {
    if (idx === rootIdx) return { label: "Tonic (1st)", isPrimary: true };
    if (idx === fifthIdx) return { label: "Dominant (5th)", isPrimary: true };
    if (idx === thirdIdx) {
      return {
        label: mode === "Major" ? "Major 3rd" : "Minor 3rd",
        isPrimary: true,
      };
    }
    if (scaleDegrees.includes(idx)) return { label: "In-Scale", isPrimary: false };
    return { label: "Chromatic", isPrimary: false };
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-md p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-accent-violet/15 text-accent-violet flex items-center justify-center border border-accent-violet/30">
            <BarChart3 size={16} className="text-accent-cyan" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold text-text-primary">
              Pitch-Class Distribution (Chroma)
            </h3>
            <p className="text-xs text-text-muted">
              12-tone acoustic energy profile extracted from spectral FFT
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span>Tonic / Primary</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-violet" />
            <span>Scale Degree</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span>Chromatic</span>
          </span>
        </div>
      </div>

      {/* 12-Bar Chroma Chart */}
      <div className="pt-4 pb-2">
        <div className="h-44 sm:h-52 flex items-end justify-between gap-1.5 sm:gap-3 px-1 sm:px-2">
          {PITCH_CLASSES.map((pitchName, idx) => {
            const pct = chromaPercentages[idx] ?? 0;
            const barHeightPct = Math.max(4, Math.round((pct / maxPct) * 100));
            const isInScale = scaleDegrees.includes(idx);
            const isTonic = idx === rootIdx;
            const isDominant = idx === fifthIdx;
            const role = getNoteRole(idx);
            const isHovered = hoveredIdx === idx;

            // Bar color styling
            let barGradient = "from-white/10 to-white/20 border-white/10";
            let labelColor = "text-text-muted";

            if (isTonic) {
              barGradient =
                "from-accent-cyan/80 to-accent-cyan border-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]";
              labelColor = "text-accent-cyan font-bold";
            } else if (isDominant) {
              barGradient =
                "from-accent-violet/80 to-accent-cyan/80 border-accent-cyan/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]";
              labelColor = "text-accent-violet font-semibold";
            } else if (isInScale) {
              barGradient = "from-accent-violet/40 to-accent-violet/80 border-accent-violet/40";
              labelColor = "text-text-secondary font-medium";
            }

            return (
              <div
                key={pitchName}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap rounded-xl bg-surface-elevated/95 border border-white/15 px-2.5 py-1.5 text-center shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[11px] font-bold text-text-primary">
                      {ENHARMONIC_NAMES[idx]} • {pct.toFixed(1)}%
                    </div>
                    <div className="text-[10px] font-mono text-accent-cyan">
                      {role.label}
                    </div>
                  </div>
                )}

                {/* Percentage label above bar */}
                <span
                  className={`text-[10px] font-mono mb-1.5 transition-colors ${
                    isTonic
                      ? "text-accent-cyan font-bold"
                      : isHovered
                      ? "text-white"
                      : "text-text-muted/60"
                  }`}
                >
                  {pct >= 3 ? `${pct.toFixed(0)}%` : ""}
                </span>

                {/* Animated Vertical Bar */}
                <div className="w-full flex justify-center items-end h-full">
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg border-t border-x transition-all duration-300 ease-out bg-gradient-to-t ${barGradient} ${
                      isHovered ? "brightness-125 scale-x-105" : ""
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>

                {/* Pitch Class Name Label */}
                <div className="mt-2.5 flex flex-col items-center">
                  <span
                    className={`text-xs sm:text-sm font-mono tracking-tight transition-colors ${labelColor} ${
                      isHovered ? "text-white scale-110" : ""
                    }`}
                  >
                    {pitchName}
                  </span>
                  {isTonic && (
                    <span className="text-[9px] font-mono uppercase tracking-wider text-accent-cyan font-bold mt-0.5">
                      Root
                    </span>
                  )}
                  {isDominant && (
                    <span className="text-[9px] font-mono uppercase tracking-wider text-accent-violet font-semibold mt-0.5">
                      5th
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanatory Footer */}
      <div className="flex items-start gap-2.5 rounded-xl bg-white/[0.03] border border-white/5 p-3 text-xs text-text-muted">
        <Info size={15} className="text-accent-cyan shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Highlighted columns represent the <span className="text-text-secondary font-medium">7 diatonic degrees</span> of the detected {keyResult.key} scale. Root (Tonic) and 5th (Dominant) anchor the harmonic center.
        </p>
      </div>
    </div>
  );
}

