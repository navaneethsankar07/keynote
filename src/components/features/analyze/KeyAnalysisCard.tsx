"use client";

import React from "react";
import {
  KeyAnalysisResult,
  PITCH_CLASSES,
} from "@/lib/audio-analysis/types";
import {
  Music,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Layers,
  Sparkles,
} from "lucide-react";

interface KeyAnalysisCardProps {
  keyResult: KeyAnalysisResult;
}

export function KeyAnalysisCard({ keyResult }: KeyAnalysisCardProps) {
  const {
    key,
    root,
    mode,
    confidence,
    confidenceScore,
    confidenceReason,
    correlationScore,
    alternativeKeys,
    scaleDegrees,
    explanation,
  } = keyResult;

  // Confidence badge configuration
  const confidenceBadge = (() => {
    switch (confidence) {
      case "high":
        return {
          label: "High Confidence",
          colorClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          icon: CheckCircle2,
        };
      case "moderate":
        return {
          label: "Moderate Confidence",
          colorClass: "bg-amber-500/15 border-amber-500/30 text-amber-300",
          icon: CheckCircle2,
        };
      case "ambiguous":
        return {
          label: "Dual Tonality / Ambiguous",
          colorClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
          icon: HelpCircle,
        };
      case "low":
      default:
        return {
          label: "Low Certainty",
          colorClass: "bg-rose-500/15 border-rose-500/30 text-rose-300",
          icon: AlertTriangle,
        };
    }
  })();

  const ConfidenceIcon = confidenceBadge.icon;

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-md p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-accent-violet/15 text-accent-violet flex items-center justify-center border border-accent-violet/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Music size={18} className="text-accent-cyan" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-accent-cyan">
              Harmonic Tonality Engine
            </span>
            <h3 className="font-display text-base sm:text-lg font-bold text-text-primary">
              Musical Key & Scale Estimation
            </h3>
          </div>
        </div>

        {/* Confidence Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-medium self-start sm:self-auto ${confidenceBadge.colorClass}`}
        >
          <ConfidenceIcon size={14} className="shrink-0" />
          <span>{confidenceBadge.label}</span>
          <span className="opacity-60 text-[10px]">
            ({Math.round(confidenceScore * 100)}%)
          </span>
        </div>
      </div>

      {/* Main Key Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Prominent Primary Key */}
        <div className="lg:col-span-6 rounded-2xl border border-accent-violet/25 bg-gradient-to-br from-accent-violet/10 via-surface-elevated/40 to-transparent p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
              Primary Estimated Key
            </span>
            <div className="flex items-baseline gap-3">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-cyan">
                {key}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/10 text-accent-cyan border border-white/10 font-semibold">
                r = {correlationScore.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Scale Degrees Preview */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="font-mono text-[11px]">Diatonic Scale Degrees:</span>
              <span className="text-[11px] font-mono text-accent-violet font-semibold">
                {mode} Mode
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {scaleDegrees.map((degreeIdx) => {
                const pitchName = PITCH_CLASSES[degreeIdx];
                const isTonic = pitchName === root;
                return (
                  <span
                    key={pitchName}
                    className={`h-7 px-2.5 rounded-lg text-xs font-mono flex items-center justify-center border transition-colors ${
                      isTonic
                        ? "bg-accent-cyan text-surface-ground border-accent-cyan font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                        : "bg-surface-elevated text-text-secondary border-white/10 font-medium"
                    }`}
                  >
                    {pitchName}
                    {isTonic && (
                      <span className="ml-1 text-[9px] uppercase tracking-tighter opacity-80">
                        1
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Algorithmic Reason */}
          <p className="text-xs text-text-muted leading-relaxed font-mono">
            {confidenceReason}
          </p>
        </div>

        {/* Right: Alternative Key Candidates */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-surface-elevated/30 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Layers size={13} className="text-accent-violet" />
                <span>Alternative Key Candidates</span>
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                Krumhansl correlation
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Plausible harmonic interpretations based on modal and relative proximity
            </p>
          </div>

          {/* List of Alternative Candidates */}
          <div className="space-y-2.5">
            {alternativeKeys.length > 0 ? (
              alternativeKeys.map((cand, idx) => (
                <div
                  key={cand.keyName}
                  className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-3 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-text-muted w-4">
                        #{idx + 2}
                      </span>
                      <span className="text-sm font-semibold text-text-primary">
                        {cand.keyName}
                      </span>
                      {cand.relationship && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-violet/15 text-accent-violet border border-accent-violet/25">
                          {cand.relationship}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-text-muted font-semibold">
                      r = {cand.correlation.toFixed(2)}
                    </span>
                  </div>

                  {/* Relative Score Bar */}
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-violet/60 transition-all duration-500"
                      style={{ width: `${cand.scorePercent}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-text-muted py-4 text-center font-mono">
                No viable secondary tonal interpretations detected.
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-text-muted/80 flex items-center gap-1.5 pt-1">
            <Sparkles size={12} className="text-accent-cyan shrink-0" />
            <span>
              Calculated via Pearson correlation against psychoacoustic empirical templates.
            </span>
          </div>
        </div>
      </div>

      {/* Factual Musicological Explanation */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-accent-cyan uppercase tracking-wider">
          <TrendingUp size={14} />
          <span>Acoustic Evidence & Tonal Explanation</span>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
}

