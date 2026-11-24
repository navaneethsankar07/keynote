"use client";

import React from "react";
import { ProgressionAnalysisResult } from "@/lib/audio-analysis/types";
import { formatDuration } from "@/lib/audio-utils";
import {
  Repeat,
  ArrowRight,
  Layers,
  Info,
  Clock,
  Play,
  Compass,
} from "lucide-react";

interface ChordProgressionViewProps {
  progression: ProgressionAnalysisResult;
  currentTime: number;
  onSeek: (time: number) => void;
}

export function ChordProgressionView({
  progression,
  currentTime,
  onSeek,
}: ChordProgressionViewProps) {
  const {
    patterns,
    primaryProgression,
    transitions,
    distribution,
    keyReliable,
    keyUsed,
    totalChordChanges,
    harmonicSummary,
  } = progression;

  // Find if current playback time is inside any progression occurrence
  let activePatternOccurrence: {
    patternId: string;
    occurrenceIndex: number;
  } | null = null;

  for (const pat of patterns) {
    for (let i = 0; i < pat.occurrences.length; i++) {
      const occ = pat.occurrences[i];
      if (currentTime >= occ.startTime && currentTime <= occ.endTime) {
        activePatternOccurrence = { patternId: pat.id, occurrenceIndex: i };
        break;
      }
    }
    if (activePatternOccurrence) break;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Card: Harmonic Progression Overview */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-md p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-accent-violet/15 text-accent-violet flex items-center justify-center border border-accent-violet/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Repeat size={18} className="text-accent-cyan" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-accent-cyan">
                Progression & Harmonic Motion Engine
              </span>
              <h3 className="font-display text-base sm:text-lg font-bold text-text-primary">
                Chord Sequences & Harmonic Analysis
              </h3>
            </div>
          </div>

          {/* Key Context Indicator */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {keyReliable && keyUsed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono font-medium">
                <Compass size={13} />
                <span>Roman Numerals in {keyUsed}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-text-muted text-xs font-mono">
                <Info size={13} />
                <span>Modal / Unanchored Key</span>
              </span>
            )}
          </div>
        </div>

        {/* Primary Progression Callout */}
        {primaryProgression ? (
          <div className="rounded-2xl border border-accent-violet/30 bg-gradient-to-br from-accent-violet/10 via-surface-elevated/50 to-transparent p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_8px_#06b6d4]" />
                <span className="text-xs font-mono uppercase tracking-wider text-accent-cyan font-bold">
                  Primary Recurring Chord Progression
                </span>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-accent-violet/20 text-accent-violet border border-accent-violet/30 self-start sm:self-auto font-semibold">
                Repeats {primaryProgression.repetitionCount} times across track
              </span>
            </div>

            {/* Big Chord Sequence Chips with Roman Numerals */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
              {primaryProgression.chords.map((chord, idx) => {
                const roman = primaryProgression.romanNumerals ? primaryProgression.romanNumerals[idx] : null;
                return (
                  <React.Fragment key={idx}>
                    <div className="rounded-2xl border border-white/15 bg-surface-elevated px-4 py-3 sm:px-5 sm:py-3.5 shadow-lg flex flex-col items-center min-w-[70px] sm:min-w-[85px] transition-transform hover:scale-105">
                      <span className="font-display text-xl sm:text-2xl font-black text-text-primary">
                        {chord}
                      </span>
                      {roman && (
                        <span className="text-xs font-mono font-bold text-accent-cyan mt-0.5">
                          {roman}
                        </span>
                      )}
                    </div>

                    {idx < primaryProgression.chords.length - 1 && (
                      <ArrowRight size={18} className="text-accent-violet/60 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Occurrences & Playback Jump Links */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[11px] font-mono text-text-muted flex items-center gap-1.5">
                <Clock size={12} className="text-accent-violet" />
                <span>Occurrence Timestamps (Click to jump audio playback):</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {primaryProgression.occurrences.map((occ, oIdx) => {
                  const isCurrent =
                    activePatternOccurrence?.patternId === primaryProgression.id &&
                    activePatternOccurrence.occurrenceIndex === oIdx;

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => onSeek(occ.startTime)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-accent-cyan text-surface-ground border-accent-cyan font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)] scale-105"
                          : "bg-white/5 border-white/10 text-text-secondary hover:text-white hover:border-white/20 hover:bg-white/10"
                      }`}
                      title={`Jump to occurrence ${oIdx + 1} (${formatDuration(occ.startTime)} - ${formatDuration(occ.endTime)})`}
                    >
                      <Play size={10} className={isCurrent ? "fill-surface-ground" : "fill-accent-cyan text-accent-cyan"} />
                      <span>
                        #{oIdx + 1}: {formatDuration(occ.startTime)} – {formatDuration(occ.endTime)}
                      </span>
                      <span className="text-[10px] opacity-75">({occ.duration.toFixed(1)}s)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center space-y-2">
            <Layers size={24} className="text-accent-violet mx-auto opacity-60" />
            <h4 className="text-sm font-semibold text-text-secondary">
              No Cyclical Repeating Loop Detected
            </h4>
            <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed font-mono">
              The song features varied through-composed or linear harmonic motion rather than a repeating 4-chord loop.
            </p>
          </div>
        )}

        {/* Factual Acoustic Harmonic Summary */}
        <div className="flex items-start gap-2.5 rounded-xl bg-white/[0.03] border border-white/5 p-4 text-xs text-text-muted">
          <Info size={16} className="text-accent-cyan shrink-0 mt-0.5" />
          <p className="leading-relaxed text-text-secondary font-medium">
            {harmonicSummary}
          </p>
        </div>
      </div>

      {/* 2. Secondary Recurring Patterns (if multiple found) */}
      {patterns.length > 1 && (
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-md p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Repeat size={14} className="text-accent-violet" />
              <span>Other Recurring Sequences ({patterns.length - 1})</span>
            </span>
            <span className="text-[11px] font-mono text-text-muted">Filtered N-Grams</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {patterns.slice(1).map((pat) => (
              <div
                key={pat.id}
                className="rounded-2xl border border-white/10 bg-surface-elevated/40 p-4 space-y-3 transition-colors hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm sm:text-base text-text-primary">
                    {pat.patternName}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-accent-cyan border border-white/10 font-medium">
                    {pat.repetitionCount}x
                  </span>
                </div>

                {pat.romanNumerals && (
                  <div className="text-xs font-mono font-bold text-accent-cyan/80">
                    {pat.romanNumerals.join(" → ")}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5">
                  {pat.occurrences.map((occ, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSeek(occ.startTime)}
                      className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white border border-white/5 transition-colors cursor-pointer"
                    >
                      {formatDuration(occ.startTime)} ({occ.duration.toFixed(1)}s)
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Chord Transitions & Frequency/Duration Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chord Frequency & Duration Breakdown */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-md p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h4 className="font-display text-sm sm:text-base font-semibold text-text-primary">
                Chord Frequency & Duration Metrics
              </h4>
              <p className="text-xs text-text-muted">
                Distinguishes occurrence count from cumulative acoustic time
              </p>
            </div>
            <span className="text-xs font-mono text-accent-cyan font-semibold">
              {distribution.length} Chords
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {distribution.map((item) => (
              <div
                key={item.chordName}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-text-primary">
                      {item.chordName}
                    </span>
                    {item.romanNumeral && (
                      <span className="text-xs font-mono font-bold text-accent-cyan px-2 py-0.5 rounded bg-accent-cyan/10 border border-accent-cyan/20">
                        {item.romanNumeral}
                      </span>
                    )}
                    {item.isDiatonic ? (
                      <span className="text-[10px] font-mono text-emerald-400/80">Diatonic</span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-300/80">Non-diatonic</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-text-muted">{item.eventCount} events</span>
                    <span className="font-bold text-text-primary">{item.totalDurationSec.toFixed(1)}s</span>
                    <span className="text-accent-violet font-semibold">{item.percentage}%</span>
                  </div>
                </div>

                {/* Duration bar */}
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan"
                    style={{ width: `${Math.max(3, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chord Transition Probabilities */}
        <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-md p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h4 className="font-display text-sm sm:text-base font-semibold text-text-primary">
                Chord Transitions
              </h4>
              <p className="text-xs text-text-muted">
                Observed step-wise harmonic motion & probabilities
              </p>
            </div>
            <span className="text-xs font-mono text-accent-violet font-semibold">
              {totalChordChanges} Changes
            </span>
          </div>

          <div className="space-y-2 pt-1 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {transitions.length > 0 ? (
              transitions.map((tr, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary text-sm">{tr.fromChord}</span>
                    <ArrowRight size={13} className="text-accent-cyan" />
                    <span className="font-bold text-accent-cyan text-sm">{tr.toChord}</span>
                    {tr.fromRoman && tr.toRoman && (
                      <span className="text-[10px] text-text-muted">
                        ({tr.fromRoman} → {tr.toRoman})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-text-muted">{tr.count}x</span>
                    <span className="font-bold text-accent-violet">
                      {Math.round(tr.probability * 100)}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-text-muted text-center py-8 font-mono">
                No chord transitions observed.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
