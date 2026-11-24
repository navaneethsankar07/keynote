"use client";

import React, { useState } from "react";
import {
  StructureAnalysisResult,
} from "@/lib/audio-analysis/types";
import { formatDuration } from "@/lib/audio-utils";
import {
  Layers,
  Sparkles,
  Repeat,
  Compass,
  Activity,
  ArrowRight,
  Info,
  Clock,
  Play,
  Zap,
} from "lucide-react";

interface StructureAnalysisCardProps {
  structureResult: StructureAnalysisResult;
  onSeek?: (time: number) => void;
}

export function StructureAnalysisCard({
  structureResult,
  onSeek,
}: StructureAnalysisCardProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const {
    sections,
    totalSections,
    formSummary,
    neutralFormSummary,
    groups,
    similarityPairs,
    hasIntro,
    hasOutro,
    structuralComplexity,
    analysisSummary,
  } = structureResult;

  if (totalSections === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-text-primary">
              Song Structure & Form Analysis
            </h3>
            <p className="text-xs font-mono text-text-muted">
              Multi-Feature Change-Point Segmentation
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-6 text-center space-y-3">
          <p className="text-sm text-text-secondary leading-relaxed">
            {analysisSummary}
          </p>
        </div>
      </div>
    );
  }

  // Find highest energy and lowest energy sections
  const sortedByEnergy = [...sections].sort(
    (a, b) => b.characteristics.energy - a.characteristics.energy
  );
  const highestEnergySec = sortedByEnergy[0];
  const lowestEnergySec = sortedByEnergy[sortedByEnergy.length - 1];

  // Recurrent groups count
  const recurrentGroups = groups.filter((g) => g.occurrenceCount >= 2);

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent-violet/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center text-accent-cyan shadow-inner">
            <Layers size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent-cyan">
              Macro Form Telemetry • Phase 10
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
              Song Structure & Section Analysis
            </h3>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              Change-Point Novelty Segmentation • Cross-Section Similarity • Structural Archetypes
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan text-xs font-mono font-medium">
            <Sparkles size={13} />
            <span className="capitalize">{structuralComplexity.replace("_", " ")} Form</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary text-xs font-mono">
            <Clock size={13} className="text-accent-violet" />
            <span>{totalSections} Sections Segmented</span>
          </span>
        </div>
      </div>

      {/* Algorithmic Summary Paragraph */}
      <div className="rounded-2xl border border-white/10 bg-surface-deep/70 p-4 sm:p-5 text-sm text-text-secondary leading-relaxed font-sans">
        <p>{analysisSummary}</p>
      </div>

      {/* Primary Metrics 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Form Sequence */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Compass size={14} className="text-accent-cyan" />
              <span>Form Architecture</span>
            </span>
            <span className="text-accent-cyan font-bold">{groups.length} Groups</span>
          </div>

          <div>
            <div className="font-display text-2xl font-bold text-text-primary truncate" title={formSummary}>
              {formSummary}
            </div>
            <p className="text-xs text-text-muted mt-1 truncate">
              Neutral Form: {neutralFormSummary}
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
            <span>Sections: {totalSections}</span>
            <span>Groups: {groups.map((g) => g.group).join(", ")}</span>
          </div>
        </div>

        {/* Card 2: Structural Repetition */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Repeat size={14} className="text-accent-violet" />
              <span>Theme Recurrence</span>
            </span>
            <span className="text-accent-violet font-bold">
              {recurrentGroups.length} Recurring
            </span>
          </div>

          <div>
            <div className="font-display text-2xl font-bold text-text-primary">
              {recurrentGroups.length > 0 ? "Cyclic / Recurrent" : "Through-Composed"}
            </div>
            <p className="text-xs text-text-muted mt-1">
              {recurrentGroups.length > 0
                ? `${recurrentGroups.reduce((acc, g) => acc + g.occurrenceCount, 0)} of ${totalSections} sections in repeating themes`
                : "No repeated musical sections identified"}
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
            <span>Contrasting: {groups.filter((g) => g.occurrenceCount === 1).length}</span>
            <span>Pairs: {similarityPairs.filter((p) => p.similarity >= 0.68).length}</span>
          </div>
        </div>

        {/* Card 3: Framing Passages */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Activity size={14} className="text-emerald-400" />
              <span>Framing & Pace</span>
            </span>
            <span className="text-emerald-400 font-bold">
              ~{(sections.reduce((acc, s) => acc + s.duration, 0) / totalSections).toFixed(1)}s / Sec
            </span>
          </div>

          <div>
            <div className="font-display text-2xl font-bold text-text-primary">
              {hasIntro && hasOutro
                ? "Framed (Intro & Outro)"
                : hasIntro
                ? "Introductory Lead-in"
                : hasOutro
                ? "Outro Resolution"
                : "Continuous Flow"}
            </div>
            <p className="text-xs text-text-muted mt-1">
              {hasIntro ? `Intro: ${sections[0].duration}s` : "No distinct intro"} •{" "}
              {hasOutro ? `Outro: ${sections[sections.length - 1].duration}s` : "No distinct outro"}
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
            <span>Intro: {hasIntro ? "Yes" : "No"}</span>
            <span>Outro: {hasOutro ? "Yes" : "No"}</span>
          </div>
        </div>

        {/* Card 4: Dynamic Contrast */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              <span>Dynamic Contrast</span>
            </span>
            <span className="text-amber-400 font-bold">
              {Math.round((highestEnergySec.characteristics.energy - lowestEnergySec.characteristics.energy) * 100)}% Spread
            </span>
          </div>

          <div>
            <div className="font-display text-2xl font-bold text-text-primary truncate">
              {highestEnergySec.label}
            </div>
            <p className="text-xs text-text-muted mt-1 truncate">
              Peak Energy ({Math.round(highestEnergySec.characteristics.energy * 100)}%) vs {lowestEnergySec.label} ({Math.round(lowestEnergySec.characteristics.energy * 100)}%)
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
            <span>Peak: {highestEnergySec.label}</span>
            <span>Sparse: {lowestEnergySec.label}</span>
          </div>
        </div>
      </div>

      {/* Interactive Form Sequence Breadcrumb Strip */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <Layers size={13} className="text-accent-cyan" />
            <span>Structural Progression Sequence (Click to Seek)</span>
          </span>
          <span>{totalSections} Section Blocks</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border border-white/10 bg-surface-deep/80">
          {sections.map((section, idx) => (
            <React.Fragment key={section.id}>
              <button
                type="button"
                onClick={() => onSeek?.(section.startTime)}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all hover:scale-105 cursor-pointer shadow-sm"
                style={{
                  borderColor: `${section.color}55`,
                  backgroundColor: `${section.color}20`,
                  color: section.color,
                }}
                title={`Seek to ${formatDuration(section.startTime)}`}
              >
                <Play size={10} className="fill-current opacity-70 group-hover:opacity-100" />
                <span className="font-bold">{section.label}</span>
                <span className="text-[10px] opacity-70">
                  {formatDuration(section.startTime)}
                </span>
              </button>

              {idx < sections.length - 1 && (
                <ArrowRight size={12} className="text-text-muted opacity-60" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Individual Section Cards Breakdown */}
      <div className="space-y-4 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <Compass size={13} className="text-accent-violet" />
            <span>Section Characteristics & Acoustic Profiles</span>
          </span>
          <span>Click section card to highlight</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => {
            const isSelected = selectedSectionId === sec.id;

            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(isSelected ? null : sec.id)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-accent-cyan shadow-xl scale-[1.01]"
                    : "hover:border-white/20"
                }`}
                style={{
                  borderColor: isSelected ? "#06B6D4" : `${sec.color}40`,
                  backgroundColor: `${sec.color}12`,
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono font-bold text-sm"
                      style={{ color: sec.color }}
                    >
                      {sec.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-text-secondary">
                      Group {sec.group}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek?.(sec.startTime);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-text-primary text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    <Play size={9} className="fill-current text-accent-cyan" />
                    <span>{formatDuration(sec.startTime)}</span>
                  </button>
                </div>

                {/* Characteristics Metrics */}
                <div className="space-y-2.5 pt-3 text-xs font-mono">
                  {/* Energy Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-text-muted mb-1">
                      <span>Energy Level</span>
                      <span className="text-text-primary font-bold">
                        {Math.round(sec.characteristics.energy * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.round(sec.characteristics.energy * 100)}%`,
                          backgroundColor: sec.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Chord and Melody Information */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-lg bg-surface-deep/80 border border-white/5">
                      <span className="text-[10px] text-text-muted block">Anchor Chord</span>
                      <span className="font-bold text-text-primary">
                        {sec.characteristics.dominantChord || "None"}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-surface-deep/80 border border-white/5">
                      <span className="text-[10px] text-text-muted block">Melody Voicing</span>
                      <span className="font-bold text-accent-cyan">
                        {sec.characteristics.melodicVoicingRatio}%
                      </span>
                    </div>
                  </div>

                  {/* Range & Rhythm Details */}
                  <div className="flex justify-between text-[11px] text-text-secondary pt-1">
                    <span>Duration: {sec.duration}s</span>
                    <span>Rhythm: {sec.characteristics.rhythmicDensity} onsets/s</span>
                  </div>

                  {sec.characteristics.melodyPitchRange && (
                    <div className="text-[10px] text-text-muted truncate">
                      Pitch: {sec.characteristics.melodyPitchRange}
                    </div>
                  )}

                  {/* Cross-section similarity link */}
                  {sec.similarSectionIds.length > 0 && (
                    <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-accent-cyan">
                      <Repeat size={10} />
                      <span className="truncate">
                        Theme matched across {sec.similarSectionIds.length} other section{sec.similarSectionIds.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cross-Section Similarity Matrix */}
      {similarityPairs.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Repeat size={13} className="text-accent-cyan" />
              <span>Cross-Section Structural Similarity Matrix</span>
            </span>
            <span>Cosine multi-feature correlation</span>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-surface-deep/80 overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid gap-1.5 text-xs font-mono" style={{ gridTemplateColumns: `repeat(${sections.length + 1}, minmax(48px, 1fr))` }}>
                {/* Header row */}
                <div className="p-1 text-[10px] text-text-muted text-center" />
                {sections.map((s) => (
                  <div
                    key={`col-${s.id}`}
                    className="p-1 text-[10px] font-bold text-center truncate"
                    style={{ color: s.color }}
                  >
                    {s.label.split(" ")[0]}
                  </div>
                ))}

                {/* Matrix Rows */}
                {sections.map((rowSec) => (
                  <React.Fragment key={`row-${rowSec.id}`}>
                    <div
                      className="p-1 text-[10px] font-bold flex items-center truncate"
                      style={{ color: rowSec.color }}
                    >
                      {rowSec.label.split(" ")[0]}
                    </div>

                    {sections.map((colSec) => {
                      if (rowSec.id === colSec.id) {
                        return (
                          <div
                            key={`cell-${rowSec.id}-${colSec.id}`}
                            className="h-8 rounded bg-accent-violet/30 border border-accent-violet/40 flex items-center justify-center text-[10px] font-bold text-white"
                          >
                            1.0
                          </div>
                        );
                      }

                      // Find similarity pair
                      const pair = similarityPairs.find(
                        (p) =>
                          (p.sectionAId === rowSec.id && p.sectionBId === colSec.id) ||
                          (p.sectionAId === colSec.id && p.sectionBId === rowSec.id)
                      );

                      const sim = pair ? pair.similarity : 0.5;

                      return (
                        <div
                          key={`cell-${rowSec.id}-${colSec.id}`}
                          className={`h-8 rounded border flex items-center justify-center text-[10px] font-mono transition-colors ${
                            sim >= 0.8
                              ? "bg-accent-cyan/25 border-accent-cyan/50 text-accent-cyan font-bold"
                              : sim >= 0.68
                              ? "bg-accent-violet/20 border-accent-violet/40 text-text-primary font-semibold"
                              : sim >= 0.5
                              ? "bg-white/5 border-white/5 text-text-secondary"
                              : "bg-black/30 border-white/5 text-text-muted"
                          }`}
                          title={`${rowSec.label} vs ${colSec.label}: ${Math.round(sim * 100)}% match`}
                        >
                          {sim.toFixed(2)}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DSP Transparency Footer Note */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex items-start gap-3 text-xs text-text-muted font-sans leading-relaxed">
        <Info size={16} className="text-accent-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-secondary font-mono">Evidence-Based Structural Inference:</strong>{" "}
          Song sections and boundaries are detected directly from multi-feature change-point novelty
          (combining energy dynamics, chroma stability, spectral brightness, and rhythmic transients).
          Keynote does not impose a predefined pop-song formula; songs with irregular arrangements, ambient drones,
          or through-composed forms are identified neutrally based on acoustic evidence.
        </div>
      </div>
    </div>
  );
}
