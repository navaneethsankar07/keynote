"use client";

import React from "react";
import { ArrowLeft, RefreshCw, Cpu, Sparkles, CheckCircle2, Music4 } from "lucide-react";
import { AudioFileMetadata } from "@/types/analyzer";

interface AnalysisStandbyViewProps {
  metadata: AudioFileMetadata;
  onBackToPreview: () => void;
  onReset: () => void;
}

export function AnalysisStandbyView({
  metadata,
  onBackToPreview,
  onReset,
}: AnalysisStandbyViewProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="rounded-3xl border border-accent-violet/30 bg-surface/90 backdrop-blur-xl p-6 sm:p-9 shadow-2xl space-y-7 relative overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent-violet/15 blur-3xl"
          aria-hidden="true"
        />

        {/* Header with Pipeline Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-accent-violet/20 text-accent-violet flex items-center justify-center border border-accent-violet/40 shadow-inner">
              <Cpu size={24} className="text-accent-cyan" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent-cyan">
                Phase 4 Telemetry Complete
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-text-primary">
                Analysis Pipeline Standby
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-violet/15 border border-accent-violet/30 text-accent-violet text-xs font-mono font-medium">
            <Sparkles size={13} className="text-accent-cyan" />
            <span>Ready for Phase 5 Inference</span>
          </div>
        </div>

        {/* Validated Track Summary Card */}
        <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music4 size={18} className="text-accent-violet" />
              <h3 className="font-display text-sm font-bold text-text-primary truncate max-w-sm">
                {metadata.fileName}
              </h3>
            </div>
            <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
              <CheckCircle2 size={13} />
              Validated
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-text-secondary pt-1">
            <span>Duration: <strong className="text-text-primary">{metadata.durationFormatted}</strong></span>
            <span>•</span>
            <span>Size: <strong className="text-text-primary">{metadata.fileSizeFormatted}</strong></span>
            <span>•</span>
            <span>Sample Rate: <strong className="text-text-primary">{metadata.sampleRate ? `${(metadata.sampleRate / 1000).toFixed(1)} kHz` : "Standard"}</strong></span>
            <span>•</span>
            <span>Channels: <strong className="text-text-primary">{metadata.channels === 1 ? "Mono" : "Stereo"}</strong></span>
          </div>
        </div>

        {/* Honest Architecture & Roadmap Explanation */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3">
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-violet" />
            <span>Neural Engine Connection Notice</span>
          </h4>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Your audio file has been locally ingested, decoded, and sampled into frequency telemetry without leaving your device.
          </p>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            In accordance with Keynote&apos;s architectural roadmap, the real machine-learning analysis models
            (BPM tracking, musical key identification, chord progression mapping, and audio stem separation)
            will be integrated in the upcoming Phase 5 release.
          </p>
          <div className="pt-1 text-[11px] font-mono text-text-muted">
            Keynote does not simulate mock results or produce artificial estimates.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onBackToPreview}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Audio Player</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-violet hover:bg-accent-violet-deep text-white text-xs sm:text-sm font-medium transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] cursor-pointer"
          >
            <RefreshCw size={15} />
            <span>Analyze Another Audio File</span>
          </button>
        </div>
      </div>
    </div>
  );
}

