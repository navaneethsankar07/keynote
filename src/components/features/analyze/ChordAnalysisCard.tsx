"use client";

import React from "react";
import { ChordAnalysisResult } from "@/lib/audio-analysis/types";
import {
  Layers,
  Activity,
  Sparkles,
  Info,
  Clock,
  Compass,
} from "lucide-react";

interface ChordAnalysisCardProps {
  chordResult: ChordAnalysisResult;
}

export function ChordAnalysisCard({ chordResult }: ChordAnalysisCardProps) {
  const {
    uniqueChords,
    dominantChord,
    totalSegments,
    averageConfidence,
    harmonicRhythmBps,
    analysisSummary,
    segments,
  } = chordResult;

  // Calculate average chord duration
  const totalDuration = segments.reduce((acc, s) => acc + s.duration, 0);
  const avgDuration = totalSegments > 0 ? (totalDuration / totalSegments).toFixed(1) : "0";

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-md p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-accent-violet/15 text-accent-violet flex items-center justify-center border border-accent-violet/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Layers size={18} className="text-accent-cyan" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-accent-cyan">
              Harmonic Structure Engine
            </span>
            <h3 className="font-display text-base sm:text-lg font-bold text-text-primary">
              Chord Progression & Harmonic Telemetry
            </h3>
          </div>
        </div>

        {/* Global Average Confidence Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent-violet/30 bg-accent-violet/10 text-accent-violet text-xs font-mono font-medium self-start sm:self-auto">
          <Sparkles size={13} className="text-accent-cyan shrink-0" />
          <span>Avg Confidence:</span>
          <span className="font-bold text-accent-cyan">
            {Math.round(averageConfidence * 100)}%
          </span>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dominant Chord Card */}
        <div className="rounded-2xl border border-white/10 bg-surface-elevated/80 p-4 sm:p-5 space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-mono uppercase text-text-muted">
            <Compass size={14} className="text-accent-cyan" />
            <span>Dominant Chord</span>
          </span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-text-primary">
              {dominantChord || "—"}
            </span>
            <span className="text-xs font-mono text-accent-cyan font-semibold">
              Harmonic Anchor
            </span>
          </div>
          <p className="text-[11px] font-mono text-text-muted">
            Most frequent chord across the composition
          </p>
        </div>

        {/* Distinct Chords Card */}
        <div className="rounded-2xl border border-white/10 bg-surface-elevated/80 p-4 sm:p-5 space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-mono uppercase text-text-muted">
            <Layers size={14} className="text-accent-violet" />
            <span>Chord Vocabulary</span>
          </span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-text-primary">
              {uniqueChords.length}
            </span>
            <span className="text-xs font-mono text-text-muted">Chords</span>
          </div>
          <p className="text-[11px] font-mono text-text-muted">
            Distinct harmonic qualities detected
          </p>
        </div>

        {/* Total Segments Card */}
        <div className="rounded-2xl border border-white/10 bg-surface-elevated/80 p-4 sm:p-5 space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-mono uppercase text-text-muted">
            <Activity size={14} className="text-accent-cyan" />
            <span>Harmonic Changes</span>
          </span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-text-primary">
              {totalSegments}
            </span>
            <span className="text-xs font-mono text-text-muted">Segments</span>
          </div>
          <p className="text-[11px] font-mono text-text-muted">
            ~{harmonicRhythmBps.toFixed(2)} changes/second
          </p>
        </div>

        {/* Average Pace Card */}
        <div className="rounded-2xl border border-white/10 bg-surface-elevated/80 p-4 sm:p-5 space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-mono uppercase text-text-muted">
            <Clock size={14} className="text-accent-violet" />
            <span>Average Duration</span>
          </span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-text-primary">
              {avgDuration}
            </span>
            <span className="text-xs font-mono text-accent-cyan">sec/chord</span>
          </div>
          <p className="text-[11px] font-mono text-text-muted">
            Pacing between harmonic shifts
          </p>
        </div>
      </div>

      {/* Unique Chords Palette */}
      <div className="rounded-2xl border border-white/10 bg-surface-elevated/30 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            Detected Chord Palette
          </span>
          <span className="text-[11px] font-mono text-text-muted">
            {uniqueChords.length} Unique
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {uniqueChords.map((chord) => (
            <span
              key={chord}
              className={`px-3 py-1.5 rounded-xl border font-mono text-sm font-bold transition-all ${
                chord === dominantChord
                  ? "bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "bg-surface-elevated border-white/10 text-text-primary hover:border-white/20"
              }`}
            >
              {chord}
            </span>
          ))}
        </div>
      </div>

      {/* Factual Acoustic Note */}
      <div className="flex items-start gap-2.5 rounded-xl bg-white/[0.03] border border-white/5 p-4 text-xs text-text-muted">
        <Info size={16} className="text-accent-cyan shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-text-secondary leading-relaxed font-medium">
            {analysisSummary}
          </p>
          <p className="text-text-muted/80 leading-relaxed text-[11px]">
            Chords are estimated via pitch-class template matching across sliding STFT spectral windows.
            Complex polyphony, vocal melodies, or percussive transients may create brief harmonic ambiguity.
          </p>
        </div>
      </div>
    </div>
  );
}

