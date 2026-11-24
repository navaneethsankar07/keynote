"use client";

import React, { useMemo, useRef, useEffect } from "react";
import {
  ChordAnalysisResult,
  ChordSegment,
} from "@/lib/audio-analysis/types";
import { formatDuration } from "@/lib/audio-utils";
import { Sliders, Sparkles } from "lucide-react";

interface ChordTimelineProps {
  chordResult: ChordAnalysisResult;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function ChordTimeline({
  chordResult,
  currentTime,
  duration,
  onSeek,
}: ChordTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSegmentRef = useRef<HTMLDivElement>(null);

  const { segments } = chordResult;

  // Identify currently active chord segment
  const activeSegmentIndex = useMemo(() => {
    if (!segments.length) return -1;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (currentTime >= seg.startTime && currentTime < seg.endTime) {
        return i;
      }
    }
    // If at the very end of the track
    if (currentTime >= (segments[segments.length - 1]?.endTime ?? 0)) {
      return segments.length - 1;
    }
    return -1;
  }, [segments, currentTime]);

  const activeSegment = activeSegmentIndex >= 0 ? segments[activeSegmentIndex] : null;

  // Auto-scroll the timeline container to keep active segment in view during playback
  useEffect(() => {
    if (activeSegmentRef.current && containerRef.current) {
      const container = containerRef.current;
      const el = activeSegmentRef.current;
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.clientWidth;
      const elLeft = el.offsetLeft;
      const elRight = elLeft + el.clientWidth;

      if (elLeft < containerLeft || elRight > containerRight) {
        container.scrollTo({
          left: elLeft - container.clientWidth / 2 + el.clientWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeSegmentIndex]);

  const getConfidenceStyle = (seg: ChordSegment, isActive: boolean) => {
    if (seg.isUncertain || seg.name === "N.C.") {
      return isActive
        ? "border-amber-400/80 bg-amber-500/20 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        : "border-white/10 bg-white/[0.02] text-text-muted hover:border-white/20";
    }

    if (isActive) {
      return "border-accent-cyan bg-accent-violet/30 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-102 z-10";
    }

    switch (seg.confidenceLevel) {
      case "high":
        return "border-accent-violet/30 bg-surface-elevated/70 text-text-primary hover:border-accent-violet/60 hover:bg-surface-elevated";
      case "moderate":
        return "border-white/15 bg-surface-elevated/40 text-text-secondary hover:border-white/30";
      case "low":
      default:
        return "border-white/10 bg-white/[0.03] text-text-muted hover:border-white/20";
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-md p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-accent-violet/15 text-accent-violet flex items-center justify-center border border-accent-violet/30">
            <Sliders size={16} className="text-accent-cyan" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold text-text-primary">
              Harmonic Chord Timeline
            </h3>
            <p className="text-xs text-text-muted">
              Synchronized progression segments detected over time (click any chord to seek)
            </p>
          </div>
        </div>

        {/* Live Active Chord Indicator */}
        {activeSegment && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/15 border border-accent-violet/30 text-xs font-mono self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#06b6d4]" />
            <span className="text-text-muted">Now Playing:</span>
            <span className="font-display font-bold text-accent-cyan text-sm">
              {activeSegment.name}
            </span>
            <span className="text-[10px] text-text-muted">
              ({formatDuration(activeSegment.startTime)} - {formatDuration(activeSegment.endTime)})
            </span>
          </div>
        )}
      </div>

      {/* Proportional Segment Timeline Bar */}
      <div className="space-y-2">
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl bg-[#08090f] border border-white/10 p-2 overflow-x-auto overflow-y-hidden select-none scrollbar-thin scrollbar-thumb-white/10"
        >
          {/* Timeline progress runner */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-accent-cyan shadow-[0_0_10px_#06b6d4] z-20 transition-all duration-75"
            style={{
              left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            }}
          />

          <div
            className="flex items-stretch gap-1.5 min-w-full"
            style={{
              width: `${Math.max(100, (duration / 30) * 100)}%`,
              minHeight: "84px",
            }}
          >
            {segments.map((seg, idx) => {
              const isActive = idx === activeSegmentIndex;
              const styleClass = getConfidenceStyle(seg, isActive);

              return (
                <div
                  key={seg.id}
                  ref={isActive ? activeSegmentRef : null}
                  onClick={() => onSeek(seg.startTime)}
                  style={{ flexGrow: seg.duration, minWidth: "56px" }}
                  className={`group relative rounded-xl border p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-200 ${styleClass}`}
                  title={`${seg.name} (${formatDuration(seg.startTime)} - ${formatDuration(seg.endTime)}) • Click to seek`}
                >
                  {/* Top: Start timestamp */}
                  <span className="text-[10px] font-mono text-text-muted/80 block truncate">
                    {formatDuration(seg.startTime)}
                  </span>

                  {/* Center: Chord Name */}
                  <div className="my-1 flex items-baseline justify-center gap-1">
                    <span
                      className={`font-display text-base sm:text-lg font-bold tracking-tight transition-transform ${
                        isActive ? "text-accent-cyan scale-110" : ""
                      }`}
                    >
                      {seg.name}
                    </span>
                  </div>

                  {/* Bottom: Duration & Confidence */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-text-muted/70">
                    <span>{seg.duration.toFixed(1)}s</span>
                    {!seg.isUncertain && (
                      <span className="opacity-75">{Math.round(seg.confidence * 100)}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Guidance Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted pt-1">
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-violet border border-accent-cyan/50" />
            <span>High Confidence</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span>Moderate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400/80" />
            <span>N.C. / Uncertain</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
          <Sparkles size={12} className="text-accent-cyan shrink-0" />
          <span>Click any chord to jump audio playback to that position.</span>
        </div>
      </div>
    </div>
  );
}
