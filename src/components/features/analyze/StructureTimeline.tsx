"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  StructureAnalysisResult,
  SongSection,
} from "@/lib/audio-analysis/types";
import { formatDuration } from "@/lib/audio-utils";
import { Sliders, Volume2, Info, Layers, Play } from "lucide-react";

interface StructureTimelineProps {
  structureResult: StructureAnalysisResult;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function StructureTimeline({
  structureResult,
  currentTime,
  duration,
  onSeek,
}: StructureTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSection, setHoveredSection] = useState<SongSection | null>(null);

  const { sections, formSummary, groups, totalSections } = structureResult;

  // Active section index
  const activeSectionIndex = useMemo(() => {
    if (!sections.length) return -1;
    for (let i = 0; i < sections.length; i++) {
      if (currentTime >= sections[i].startTime && currentTime <= sections[i].endTime) {
        return i;
      }
    }
    // End of track fallback
    if (currentTime >= (sections[sections.length - 1]?.endTime ?? 0)) {
      return sections.length - 1;
    }
    return -1;
  }, [sections, currentTime]);

  const activeSection = activeSectionIndex >= 0 ? sections[activeSectionIndex] : null;

  // Auto-scroll timeline to keep active section in view
  useEffect(() => {
    if (!containerRef.current || duration <= 0) return;
    const container = containerRef.current;
    const playheadPx = (currentTime / duration) * container.scrollWidth;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    if (playheadPx < viewLeft || playheadPx > viewRight - 80) {
      container.scrollTo({
        left: Math.max(0, playheadPx - container.clientWidth * 0.35),
        behavior: "smooth",
      });
    }
  }, [currentTime, duration]);

  if (totalSections === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface/80 p-8 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center mx-auto text-accent-violet">
          <Layers size={24} />
        </div>
        <h4 className="font-display font-semibold text-text-primary text-base">
          Continuous Form Detected
        </h4>
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
          The audio signal displays an unbroken musical continuum without discrete macro section boundaries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Info & Active Section Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-text-muted">
          <Sliders size={13} className="text-accent-cyan" />
          <span>Interactive Form Timeline (Click to Seek)</span>
        </div>

        <div className="flex items-center gap-2.5">
          {activeSection ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-violet/20 border border-accent-violet/40 text-accent-cyan animate-pulse">
              <Volume2 size={13} className="text-accent-violet" />
              <span className="font-bold">{activeSection.label}</span>
              <span className="text-[10px] text-text-muted">
                ({formatDuration(activeSection.startTime)} – {formatDuration(activeSection.endTime)})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-text-muted text-[11px]">
              <Layers size={11} className="text-accent-cyan" />
              <span>{totalSections} Sections Segmented</span>
            </div>
          )}

          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-text-secondary text-[11px]">
            Form: {formSummary}
          </span>
        </div>
      </div>

      {/* Main Structural Timeline Bar */}
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-white/10 bg-surface/90 overflow-hidden shadow-inner p-2 select-none"
      >
        <div className="relative h-20 w-full flex items-stretch gap-1 rounded-xl overflow-hidden bg-surface-deep/80 p-1">
          {sections.map((section, idx) => {
            const widthPct = Math.max(2, (section.duration / duration) * 100);
            const isActive = idx === activeSectionIndex;
            const isHovered = hoveredSection?.id === section.id;

            return (
              <div
                key={section.id}
                onClick={() => onSeek(section.startTime)}
                onMouseEnter={() => setHoveredSection(section)}
                onMouseLeave={() => setHoveredSection(null)}
                className={`relative flex flex-col justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden ${
                  isActive
                    ? "ring-2 ring-accent-cyan shadow-[0_0_20px_rgba(6,182,212,0.6)] brightness-125 z-20"
                    : isHovered
                    ? "brightness-125 ring-1 ring-white/40 z-10"
                    : "opacity-85 hover:opacity-100"
                }`}
                style={{
                  width: `${widthPct}%`,
                  borderColor: section.color,
                  backgroundColor: `${section.color}22`,
                }}
                title={`${section.label}: ${formatDuration(section.startTime)} - ${formatDuration(section.endTime)}`}
              >
                {/* Top Section Header */}
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="font-mono text-xs font-bold truncate drop-shadow-sm"
                    style={{ color: section.color }}
                  >
                    {section.label}
                  </span>
                  <span className="text-[9px] font-mono opacity-70 hidden md:inline-block">
                    {section.duration}s
                  </span>
                </div>

                {/* Bottom Metadata: Dominant Chord + Energy */}
                <div className="flex items-center justify-between text-[10px] font-mono opacity-80 pt-1">
                  <span className="truncate">
                    {section.characteristics.dominantChord || "—"}
                  </span>
                  <span className="text-[9px] opacity-75">
                    {Math.round(section.characteristics.energy * 100)}%
                  </span>
                </div>

                {/* Bottom Energy Dynamic Indicator Bar */}
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(section.characteristics.energy * 100)}%`,
                      backgroundColor: section.color,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Synchronized Playhead Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-accent-cyan shadow-[0_0_12px_rgba(6,182,212,1)] z-30 pointer-events-none transition-none"
            style={{
              left: `${(currentTime / duration) * 100}%`,
            }}
          >
            <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-accent-cyan border border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-surface-deep" />
            </div>
          </div>
        </div>

        {/* Time Labels along bottom */}
        <div className="flex justify-between items-center px-2 pt-2 text-[10px] font-mono text-text-muted">
          <span>0:00</span>
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Hover Section Detail Box */}
      {hoveredSection && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-deep/90 border border-white/10 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-0.5 rounded-md font-bold text-sm border"
              style={{
                color: hoveredSection.color,
                borderColor: `${hoveredSection.color}55`,
                backgroundColor: `${hoveredSection.color}22`,
              }}
            >
              {hoveredSection.label}
            </span>
            <span className="text-text-secondary">
              Time: <strong className="text-text-primary">{formatDuration(hoveredSection.startTime)} – {formatDuration(hoveredSection.endTime)}</strong>
            </span>
            <span className="text-text-secondary">
              Duration: <strong className="text-text-primary">{hoveredSection.duration}s</strong>
            </span>
            <span className="text-text-secondary">
              Dominant Chord: <strong className="text-text-primary">{hoveredSection.characteristics.dominantChord || "None"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-text-secondary">
              Energy: <strong className="text-text-primary">{Math.round(hoveredSection.characteristics.energy * 100)}%</strong>
            </span>
            <span className="text-text-secondary">
              Melody: <strong className="text-text-primary">{hoveredSection.characteristics.melodicVoicingRatio}%</strong>
            </span>
            <button
              type="button"
              onClick={() => onSeek(hoveredSection.startTime)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-accent-violet text-white text-[10px] transition-colors cursor-pointer"
            >
              <Play size={10} className="fill-current" />
              <span>Jump</span>
            </button>
          </div>
        </div>
      )}

      {/* Structural Groups Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text-muted text-[11px] mr-1">Recurring Groups:</span>
          {groups.map((group) => (
            <div
              key={group.group}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px]"
              style={{
                borderColor: `${group.color}40`,
                backgroundColor: `${group.color}15`,
                color: group.color,
              }}
            >
              <span className="font-bold">{group.label}</span>
              <span className="text-[9px] opacity-75">
                ({group.occurrenceCount}x • {group.totalDuration}s)
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-text-muted text-[11px]">
          <Info size={12} />
          <span>Click any section to seek playback</span>
        </div>
      </div>
    </div>
  );
}

