"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  MelodyAnalysisResult,
  MelodyNoteEvent,
} from "@/lib/audio-analysis/types";
import { formatDuration } from "@/lib/audio-utils";
import { Sliders, Sparkles, Music2, Volume2, Info } from "lucide-react";

interface MelodyTimelineProps {
  melodyResult: MelodyAnalysisResult;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function MelodyTimeline({
  melodyResult,
  currentTime,
  duration,
  onSeek,
}: MelodyTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const [hoveredNote, setHoveredNote] = useState<MelodyNoteEvent | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const { notes, range, totalNotes } = melodyResult;

  // Determine active note at currentTime
  const activeNoteIndex = useMemo(() => {
    if (!notes.length) return -1;
    for (let i = 0; i < notes.length; i++) {
      if (currentTime >= notes[i].startTime && currentTime <= notes[i].endTime) {
        return i;
      }
    }
    return -1;
  }, [notes, currentTime]);

  const activeNote = activeNoteIndex >= 0 ? notes[activeNoteIndex] : null;

  // Auto-scroll timeline to follow playhead during playback
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

  // Compute MIDI vertical bounds
  const { maxMidi, pitchRows } = useMemo(() => {
    if (!notes.length) {
      return { maxMidi: 72, pitchRows: [] };
    }

    const noteMidis = notes.map((n) => n.midiPitch);
    const minM = Math.min(...noteMidis);
    const maxM = Math.max(...noteMidis);

    // Padding of at least 1 semitone on top and bottom
    const paddedMin = Math.max(48, minM - 1);
    const paddedMax = Math.min(84, maxM + 1);

    const rows: { midi: number; label: string; isNatural: boolean }[] = [];
    for (let m = paddedMax; m >= paddedMin; m--) {
      const noteNames = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
      const noteName = noteNames[m % 12];
      const oct = Math.floor(m / 12) - 1;
      const isNatural = !noteName.includes("♯");
      rows.push({
        midi: m,
        label: `${noteName}${oct}`,
        isNatural,
      });
    }

    return { maxMidi: paddedMax, pitchRows: rows };
  }, [notes]);

  // Timeline width scales with duration (at least 750px for readability)
  const timelineWidthPx = Math.max(760, Math.round(duration * 65));

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(clickRatio * duration);
  };

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverX(e.clientX - rect.left);
  };

  const handleTimelineMouseLeave = () => {
    setHoverX(null);
    setHoveredNote(null);
  };

  if (totalNotes === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface/80 p-8 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center mx-auto text-accent-violet">
          <Music2 size={24} />
        </div>
        <h4 className="font-display font-semibold text-text-primary text-base">
          No Prominent Melodic Line Isolated
        </h4>
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
          The audio signal appears polyphonically dense, heavily percussive, or unpitched.
          Melody extraction focuses strictly on prominent lead vocal or instrumental fundamental frequencies
          and avoids guessing notes when acoustic evidence is ambiguous.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Info & Active Note Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-text-muted">
          <Sliders size={13} className="text-accent-cyan" />
          <span>Interactive Piano Roll Timeline (Click to Seek)</span>
        </div>

        <div className="flex items-center gap-2.5">
          {activeNote ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-violet/20 border border-accent-violet/40 text-accent-violet animate-pulse">
              <Volume2 size={13} />
              <span className="font-bold">{activeNote.name}</span>
              <span className="text-[10px] text-text-muted">
                ({activeNote.frequency} Hz • {activeNote.duration}s)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-text-muted text-[11px]">
              <Sparkles size={11} className="text-accent-cyan" />
              <span>{totalNotes} Melody Notes Extracted</span>
            </div>
          )}

          {range && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-text-secondary text-[11px]">
              Range: {range.lowestNote.name} – {range.highestNote.name}
            </span>
          )}
        </div>
      </div>

      {/* Main Piano-Roll Scroll Container */}
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-white/10 bg-surface/90 overflow-x-auto overflow-y-hidden shadow-inner custom-scrollbar"
        style={{ maxHeight: "380px" }}
      >
        <div
          className="relative select-none cursor-pointer"
          style={{ width: `${timelineWidthPx}px`, height: `${pitchRows.length * 28 + 32}px` }}
          onClick={handleTimelineClick}
          onMouseMove={handleTimelineMouseMove}
          onMouseLeave={handleTimelineMouseLeave}
        >
          {/* Pitch Row Background & Grid Lines */}
          <div className="absolute inset-0 pointer-events-none">
            {pitchRows.map((row, idx) => (
              <div
                key={row.midi}
                className={`absolute w-full border-b flex items-center ${
                  row.isNatural
                    ? "bg-white/[0.015] border-white/5"
                    : "bg-white/[0.04] border-white/10"
                }`}
                style={{
                  top: `${idx * 28}px`,
                  height: "28px",
                }}
              >
                {/* Sticky Left Pitch Label */}
                <div
                  className={`sticky left-0 z-20 px-2.5 py-0.5 text-[10px] font-mono font-medium rounded-r-md backdrop-blur-md border-r ${
                    row.isNatural
                      ? "text-text-secondary bg-surface/95 border-white/10"
                      : "text-text-muted bg-surface-deep/95 border-white/15"
                  } ${
                    activeNote && activeNote.midiPitch === row.midi
                      ? "text-accent-cyan font-bold bg-accent-cyan/15 border-accent-cyan/40"
                      : ""
                  }`}
                >
                  {row.label}
                </div>
              </div>
            ))}
          </div>

          {/* Time Marker Ticks along bottom */}
          <div className="absolute bottom-0 inset-x-0 h-6 border-t border-white/10 bg-surface-deep/80 backdrop-blur-sm pointer-events-none flex items-center">
            {Array.from({ length: Math.ceil(duration / 2) + 1 }).map((_, i) => {
              const tickTime = i * 2;
              if (tickTime > duration) return null;
              const leftPct = (tickTime / duration) * 100;
              return (
                <div
                  key={tickTime}
                  className="absolute text-[9px] font-mono text-text-muted flex items-center gap-1 pl-1"
                  style={{ left: `${leftPct}%` }}
                >
                  <span className="w-px h-2.5 bg-white/20 inline-block" />
                  <span>{formatDuration(tickTime)}</span>
                </div>
              );
            })}
          </div>

          {/* Note Events Blocks */}
          <div className="absolute inset-0 z-10">
            {notes.map((note, index) => {
              const leftPct = (note.startTime / duration) * 100;
              const widthPct = Math.max(0.6, (note.duration / duration) * 100);
              const rowIdx = maxMidi - note.midiPitch;
              const topPx = rowIdx * 28 + 2;
              const isActive = index === activeNoteIndex;
              const isHovered = hoveredNote?.id === note.id;

              // Style based on confidence and active state
              let bgStyle = "bg-accent-violet/30 border-accent-violet/50 text-white";
              if (note.confidence >= 0.75) {
                bgStyle = "bg-gradient-to-r from-accent-violet/70 to-accent-cyan/70 border-accent-cyan/60 text-white shadow-[0_0_8px_rgba(139,92,246,0.3)]";
              } else if (note.confidence < 0.45 || note.isUncertain) {
                bgStyle = "bg-amber-500/15 border-dashed border-amber-500/40 text-amber-300";
              }

              if (isActive) {
                bgStyle = "bg-accent-cyan border-white text-surface-deep font-bold shadow-[0_0_16px_rgba(6,182,212,0.8)] scale-y-105 z-30 ring-2 ring-accent-cyan/50";
              } else if (isHovered) {
                bgStyle += " ring-2 ring-white/60 brightness-125 z-20";
              }

              return (
                <div
                  key={note.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(note.startTime);
                  }}
                  onMouseEnter={() => setHoveredNote(note)}
                  onMouseLeave={() => setHoveredNote(null)}
                  className={`absolute h-[24px] rounded-md border flex items-center px-1.5 text-[11px] font-mono transition-all duration-150 cursor-pointer overflow-hidden ${bgStyle}`}
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    top: `${topPx}px`,
                  }}
                  title={`${note.name} (${note.startTime}s - ${note.endTime}s)`}
                >
                  <span className="truncate whitespace-nowrap font-bold select-none">
                    {note.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Synchronized Playhead Line */}
          <div
            ref={playheadRef}
            className="absolute top-0 bottom-6 w-0.5 bg-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.9)] z-25 pointer-events-none transition-none"
            style={{
              left: `${(currentTime / duration) * 100}%`,
            }}
          >
            {/* Playhead Head Marker */}
            <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-accent-cyan border border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-surface-deep" />
            </div>
          </div>

          {/* Hover Time Indicator */}
          {hoverX !== null && (
            <div
              className="absolute top-0 bottom-6 w-px bg-white/30 z-20 pointer-events-none border-l border-dashed border-white/40"
              style={{ left: `${hoverX}px` }}
            />
          )}
        </div>
      </div>

      {/* Note Detail Hover Tooltip Card */}
      {hoveredNote && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-deep/90 border border-white/10 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-accent-violet/20 border border-accent-violet/40 text-accent-cyan font-bold text-sm">
              {hoveredNote.name}
            </span>
            <span className="text-text-secondary">
              Frequency: <strong className="text-text-primary">{hoveredNote.frequency} Hz</strong>
            </span>
            <span className="text-text-secondary">
              Time: <strong className="text-text-primary">{formatDuration(hoveredNote.startTime)} – {formatDuration(hoveredNote.endTime)}</strong>
            </span>
            <span className="text-text-secondary">
              Duration: <strong className="text-text-primary">{hoveredNote.duration}s</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-muted">Confidence:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                hoveredNote.confidenceLevel === "high"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : hoveredNote.confidenceLevel === "moderate"
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-300"
              }`}
            >
              {hoveredNote.confidenceLevel} ({Math.round(hoveredNote.confidence * 100)}%)
            </span>
          </div>
        </div>
      )}

      {/* Legend & Confidence Guide */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-[11px] font-mono text-text-muted">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-gradient-to-r from-accent-violet to-accent-cyan border border-accent-cyan/60 inline-block" />
            <span>High Confidence Note</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-accent-violet/40 border border-accent-violet/60 inline-block" />
            <span>Moderate Note</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/15 border border-dashed border-amber-500/40 inline-block" />
            <span>Low / Uncertain</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-text-muted">
          <Info size={12} />
          <span>Click any note to seek playback</span>
        </div>
      </div>
    </div>
  );
}
