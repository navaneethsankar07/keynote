"use client";

import React, { useState } from "react";
import {
  MelodyAnalysisResult,
} from "@/lib/audio-analysis/types";
import { formatDuration } from "@/lib/audio-utils";
import {
  Music2,
  TrendingUp,
  TrendingDown,
  Activity,
  Repeat,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Compass,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Play,
} from "lucide-react";

interface MelodyAnalysisCardProps {
  melodyResult: MelodyAnalysisResult;
  currentTime?: number;
  onSeek?: (time: number) => void;
}

export function MelodyAnalysisCard({
  melodyResult,
  onSeek,
}: MelodyAnalysisCardProps) {
  const [selectedMotif, setSelectedMotif] = useState<string | null>(null);

  const {
    totalNotes,
    contour,
    intervalStats,
    range,
    motifs,
    averageConfidence,
    voicedPercentage,
    voicedDurationSec,
    isReliable,
    analysisSummary,
  } = melodyResult;

  // Confidence badge config
  const confidenceBadge = (() => {
    if (!isReliable || totalNotes === 0) {
      return {
        label: "Low / Diffuse",
        colorClass: "bg-rose-500/15 border-rose-500/30 text-rose-300",
        icon: HelpCircle,
        desc: "Ambiguous or polyphonically suppressed pitch energy",
      };
    }
    if (averageConfidence >= 0.7) {
      return {
        label: "High Confidence",
        colorClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        icon: CheckCircle2,
        desc: "Clear harmonic salience and coherent pitch track",
      };
    }
    if (averageConfidence >= 0.45) {
      return {
        label: "Moderate Confidence",
        colorClass: "bg-amber-500/15 border-amber-500/30 text-amber-300",
        icon: AlertTriangle,
        desc: "Dominant melody isolated amidst polyphonic accompaniment",
      };
    }
    return {
      label: "Low Confidence",
      colorClass: "bg-rose-500/15 border-rose-500/30 text-rose-300",
      icon: HelpCircle,
      desc: "Challenging signal with competing harmonic voices",
    };
  })();

  const ConfidenceIcon = confidenceBadge.icon;

  if (totalNotes === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet">
            <Music2 size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-text-primary">
              Melody & Pitch Analysis
            </h3>
            <p className="text-xs font-mono text-text-muted">
              Polyphonic Harmonic Salience Pipeline
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-6 text-center space-y-3">
          <p className="text-sm text-text-secondary leading-relaxed">
            {analysisSummary}
          </p>
          <p className="text-xs text-text-muted font-mono">
            No discrete melodic note events could be isolated with sufficient harmonic confidence.
          </p>
        </div>
      </div>
    );
  }

  // Precompute SVG contour path
  const contourPath = (() => {
    if (!contour.contourPoints.length) return "";
    const points = contour.contourPoints;
    const minTime = points[0].time;
    const maxTime = points[points.length - 1].time || 1;
    const timeSpan = maxTime - minTime || 1;

    const midiValues = points.map((p) => p.midiPitch);
    const minM = Math.min(...midiValues) - 1;
    const maxM = Math.max(...midiValues) + 1;
    const midiSpan = maxM - minM || 1;

    const coords = points.map((p) => {
      const x = ((p.time - minTime) / timeSpan) * 100;
      const y = 100 - ((p.midiPitch - minM) / midiSpan) * 85 - 8;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${coords.join(" L ")}`;
  })();

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent-cyan/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center text-accent-cyan shadow-inner">
            <Music2 size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent-cyan">
              Signal Processing • Harmonic Salience Tracking
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
              Melody & Pitch Analysis
            </h3>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              Lead Voice Extraction • Melodic Contour • Interval Geometry
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium ${confidenceBadge.colorClass}`}
          >
            <ConfidenceIcon size={13} />
            <span>{confidenceBadge.label} ({Math.round(averageConfidence * 100)}%)</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary text-xs font-mono">
            <Clock size={13} className="text-accent-cyan" />
            <span>{voicedDurationSec}s Voiced ({voicedPercentage}%)</span>
          </span>
        </div>
      </div>

      {/* Algorithmic Summary Paragraph */}
      <div className="rounded-2xl border border-white/10 bg-surface-deep/70 p-4 sm:p-5 text-sm text-text-secondary leading-relaxed font-sans">
        <p>{analysisSummary}</p>
      </div>

      {/* Primary Metrics 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Melodic Range */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Compass size={14} className="text-accent-cyan" />
              <span>Pitch Range</span>
            </span>
            <span className="text-accent-cyan font-bold">
              {range ? `${range.semitoneRange} st` : "N/A"}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-text-primary">
                {range ? `${range.lowestNote.name} – ${range.highestNote.name}` : "N/A"}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              {range ? range.spanDescription : "Insufficient notes"}
            </p>
          </div>

          {range && (
            <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
              <span>Low: {range.lowestNote.frequency} Hz</span>
              <span>High: {range.highestNote.frequency} Hz</span>
            </div>
          )}
        </div>

        {/* Card 2: Interval Movement */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Activity size={14} className="text-accent-violet" />
              <span>Motion Style</span>
            </span>
            <span className="text-accent-violet font-bold">
              {Math.round(intervalStats.stepwiseRatio * 100)}% Stepwise
            </span>
          </div>

          <div>
            <div className="font-display text-2xl font-bold text-text-primary truncate">
              {intervalStats.stepwiseRatio >= 0.5 ? "Stepwise Flow" : "Disjunct Leaps"}
            </div>
            <p className="text-xs text-text-muted mt-1 truncate">
              Most common: {intervalStats.mostCommonInterval}
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
            <span>Avg: {intervalStats.averageIntervalSemitones} st</span>
            <span>Leaps: {Math.round(intervalStats.leapRatio * 100)}%</span>
          </div>
        </div>

        {/* Card 3: Contour Archetype */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              {contour.dominantDirection.includes("Ascending") ? (
                <TrendingUp size={14} className="text-emerald-400" />
              ) : contour.dominantDirection.includes("Descending") ? (
                <TrendingDown size={14} className="text-amber-400" />
              ) : (
                <Layers size={14} className="text-accent-cyan" />
              )}
              <span>Contour Shape</span>
            </span>
            <span className="text-accent-cyan font-bold">{contour.directionChanges} turns</span>
          </div>

          <div>
            <div className="font-display text-2xl font-bold text-text-primary truncate">
              {contour.contourType}
            </div>
            <p className="text-xs text-text-muted mt-1 truncate">
              {contour.dominantDirection}
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
            <span>Asc: {contour.ascendingPercentage}%</span>
            <span>Desc: {contour.descendingPercentage}%</span>
          </div>
        </div>

        {/* Card 4: Motifs & Voicing */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Repeat size={14} className="text-accent-cyan" />
              <span>Motifs & Notes</span>
            </span>
            <span className="text-accent-cyan font-bold">{totalNotes} notes</span>
          </div>

          <div>
            <div className="font-display text-2xl font-bold text-text-primary">
              {motifs.length > 0 ? `${motifs.length} Motifs` : "Through-composed"}
            </div>
            <p className="text-xs text-text-muted mt-1">
              {motifs.length > 0
                ? `${motifs[0].repetitionCount}x repetition in top motif`
                : "No recurring note phrases"}
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
            <span>Voiced: {voicedPercentage}%</span>
            <span>Peaks: {contour.localPeaksCount}</span>
          </div>
        </div>
      </div>

      {/* Melodic Contour Trajectory Waveform */}
      {contour.contourPoints.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-muted flex items-center gap-1.5">
              <Activity size={13} className="text-accent-cyan" />
              <span>Extracted Pitch Contour Trajectory</span>
            </span>
            <div className="flex items-center gap-3 text-text-secondary">
              <span className="text-emerald-400">▲ {contour.ascendingPercentage}% Ascending</span>
              <span className="text-amber-400">▼ {contour.descendingPercentage}% Descending</span>
              <span className="text-accent-cyan">● {contour.repeatedPercentage}% Repeated</span>
            </div>
          </div>

          <div className="relative h-28 w-full rounded-2xl border border-white/10 bg-surface-deep/80 p-3 overflow-hidden shadow-inner">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="contourGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Area Under Curve */}
              {contourPath && (
                <path
                  d={`${contourPath} L 100,100 L 0,100 Z`}
                  fill="url(#areaGrad)"
                />
              )}

              {/* Luminous Contour Line */}
              {contourPath && (
                <path
                  d={contourPath}
                  fill="none"
                  stroke="url(#contourGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            {/* Range markers on left */}
            {range && (
              <div className="absolute inset-y-2 left-2 flex flex-col justify-between text-[9px] font-mono text-text-muted pointer-events-none">
                <span>{range.highestNote.name}</span>
                <span>{range.lowestNote.name}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interval Distribution Histogram */}
      {intervalStats.distribution.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-muted flex items-center gap-1.5">
              <Layers size={13} className="text-accent-violet" />
              <span>Melodic Interval Distribution (Consecutive Note Transitions)</span>
            </span>
            <span className="text-text-secondary">
              Total Transitions: {intervalStats.totalIntervals}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {intervalStats.distribution.slice(0, 12).map((item) => {
              const isDominant =
                item.name.toLowerCase() ===
                intervalStats.mostCommonInterval.split(" ")[0].toLowerCase();

              return (
                <div
                  key={item.semitones}
                  className={`p-3 rounded-xl border transition-all ${
                    isDominant
                      ? "bg-accent-violet/15 border-accent-violet/40 shadow-sm"
                      : "bg-surface-deep/60 border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-text-primary truncate">
                      {item.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded ${
                        item.isStepwise
                          ? "bg-accent-cyan/15 text-accent-cyan"
                          : "bg-accent-violet/15 text-accent-violet"
                      }`}
                    >
                      {item.semitones}st
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2 mb-1">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDominant
                          ? "bg-accent-violet"
                          : item.isStepwise
                          ? "bg-accent-cyan/70"
                          : "bg-white/30"
                      }`}
                      style={{ width: `${Math.min(100, item.percentage * 2)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-text-muted">
                    <span>{item.count}x</span>
                    <span>{item.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recurring Melodic Motifs / Patterns */}
      {motifs.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-muted flex items-center gap-1.5">
              <Repeat size={13} className="text-accent-cyan" />
              <span>Identified Melodic Motifs & Repeated Phrases</span>
            </span>
            <span className="text-text-muted">
              Click an occurrence to jump playback
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {motifs.map((motif) => {
              const isSelected = selectedMotif === motif.id;

              return (
                <div
                  key={motif.id}
                  onClick={() => setSelectedMotif(isSelected ? null : motif.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-accent-violet/15 border-accent-violet/50 shadow-lg ring-1 ring-accent-violet/30"
                      : "bg-surface-deep/70 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-accent-cyan">
                        {motif.patternName}
                      </span>
                      {motif.isTransposed && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-accent-violet/20 text-accent-violet border border-accent-violet/30">
                          Transposed
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-text-primary font-bold">
                      {motif.repetitionCount}x Repetitions
                    </span>
                  </div>

                  {/* Note Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {motif.notes.map((n, idx) => (
                      <React.Fragment key={`${motif.id}-note-${idx}`}>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-text-primary">
                          {n}
                        </span>
                        {idx < motif.notes.length - 1 && (
                          <ArrowRight size={10} className="text-text-muted" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Occurrences timestamps */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-text-muted mr-1">
                      Occurrences:
                    </span>
                    {motif.occurrences.map((occ, occIdx) => (
                      <button
                        key={`${motif.id}-occ-${occIdx}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeek?.(occ.startTime);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-accent-violet/20 border border-white/10 hover:border-accent-violet/40 text-text-secondary hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                        title={`Seek to ${formatDuration(occ.startTime)}`}
                      >
                        <Play size={9} className="fill-current text-accent-cyan" />
                        <span>{formatDuration(occ.startTime)}</span>
                        <span className="text-text-muted text-[9px]">({occ.duration}s)</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DSP Transparency Footer Note */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex items-start gap-3 text-xs text-text-muted font-sans leading-relaxed">
        <Info size={16} className="text-accent-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-secondary font-mono">100% Client-Side DSP Extraction:</strong>{" "}
          Melody notes and contour trajectories are computed directly in your browser using multi-harmonic salience summation (HPS) and temporal continuity smoothing.
          No audio is uploaded to any server, and no generative LLM hallucination is used.
          In dense polyphonic music with overlapping accompaniment, weaker melodic segments are marked as uncertain.
        </div>
      </div>
    </div>
  );
}
