"use client";

import React, { useState } from "react";
import {
  GenreAnalysisResult,
  GenreCandidate,
} from "@/lib/audio-analysis/types";
import {
  Compass,
  Radio,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sliders,
  Flame,
  Volume2,
  GitBranch,
  Info,
} from "lucide-react";

interface GenreAnalysisCardProps {
  genreResult: GenreAnalysisResult;
}

export function GenreAnalysisCard({ genreResult }: GenreAnalysisCardProps) {
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null);

  const {
    primaryGenre,
    secondaryGenres,
    hybridStyleLabel,
    isAmbiguous,
    ambiguityReason,
    styleTraits,
    sectionVariations,
    hasSectionVariation,
    analysisSummary,
    methodologyNote,
  } = genreResult;

  const isUncertain = primaryGenre.genre.includes("Uncertain");

  const getConfidenceBadgeColor = (level: GenreCandidate["confidenceLevel"]) => {
    switch (level) {
      case "high":
        return "border-emerald-500/30 bg-emerald-950/20 text-emerald-300";
      case "moderate":
        return "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan";
      case "low":
        return "border-amber-500/30 bg-amber-950/20 text-amber-300";
      case "speculative":
      case "uncertain":
      default:
        return "border-purple-500/30 bg-purple-950/20 text-purple-300";
    }
  };

  const traits = [
    { label: "Danceability", value: styleTraits.danceability, icon: Activity, desc: "Metric pulse & beat drive" },
    { label: "Energy Index", value: styleTraits.energy, icon: Flame, desc: "Centroid & dynamic intensity" },
    { label: "Acousticness", value: styleTraits.acousticness, icon: Volume2, desc: "Organic unamplified timbre" },
    { label: "Instrumentalness", value: styleTraits.instrumentalness, icon: Sliders, desc: "Absence of lead vocal" },
    { label: "Harmonic Complexity", value: styleTraits.harmonicComplexity, icon: Layers, desc: "Chord extensions & diversity" },
    { label: "Rhythmic Syncopation", value: styleTraits.rhythmicSyncopation, icon: Sparkles, desc: "Off-beat groove energy" },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-7 shadow-2xl relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-24 right-1/4 h-64 w-96 rounded-full bg-accent-violet/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent-violet/15 border border-accent-violet/30 flex items-center justify-center text-accent-cyan">
            <Compass size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-text-primary">
                Genre & Musical Style
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan">
                Phase 12
              </span>
            </div>
            <p className="text-xs font-mono text-text-muted">
              Multi-Dimensional MIR Stylistic Classification & Trait Radar
            </p>
          </div>
        </div>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {hybridStyleLabel && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono border border-accent-violet/40 bg-accent-violet/15 text-accent-cyan">
              <GitBranch size={12} />
              <span>{hybridStyleLabel}</span>
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border capitalize ${getConfidenceBadgeColor(
              primaryGenre.confidenceLevel
            )}`}
          >
            {primaryGenre.confidenceLevel === "high" ? (
              <CheckCircle2 size={13} />
            ) : primaryGenre.confidenceLevel === "moderate" ? (
              <Radio size={13} />
            ) : primaryGenre.confidenceLevel === "low" ? (
              <AlertTriangle size={13} />
            ) : (
              <HelpCircle size={13} />
            )}
            <span>{primaryGenre.confidenceLevel} Confidence</span>
          </span>
        </div>
      </div>

      {/* Primary Genre Hero Panel */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-surface-elevated to-surface p-6 sm:p-7 space-y-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
              <span>Primary Aesthetic Alignment</span>
              {isAmbiguous && (
                <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Crossover / Hybrid Overlap
                </span>
              )}
            </span>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {primaryGenre.genre}
              </h2>
              {primaryGenre.subgenre && (
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-medium border border-accent-violet/30 bg-accent-violet/10 text-accent-cyan">
                  {primaryGenre.subgenre}
                </span>
              )}
            </div>

            {primaryGenre.culturalContextNote && (
              <p className="text-xs text-text-muted leading-relaxed max-w-2xl pt-1">
                {primaryGenre.culturalContextNote}
              </p>
            )}
          </div>

          {/* Affinity Meter */}
          <div className="shrink-0 rounded-2xl border border-white/5 bg-black/40 p-4 min-w-[160px] text-center space-y-2">
            <span className="text-[10px] font-mono uppercase text-text-muted">
              Stylistic Fit Affinity
            </span>
            <div className="font-display text-3xl font-bold text-accent-cyan">
              {primaryGenre.affinityPercentage}%
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan"
                style={{ width: `${primaryGenre.affinityPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Ambiguity Callout if present */}
        {isAmbiguous && ambiguityReason && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3 flex items-start gap-2.5 text-xs text-amber-200/90 font-mono">
            <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <span>{ambiguityReason}</span>
          </div>
        )}

        {/* Supporting Evidence Chips */}
        {!isUncertain && primaryGenre.supportingEvidence.length > 0 && (
          <div className="pt-2 border-t border-white/5 space-y-2">
            <span className="text-[11px] font-mono text-text-muted">
              Measurable Acoustic Evidence:
            </span>
            <div className="flex flex-wrap gap-2">
              {primaryGenre.supportingEvidence.map((ev, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-white/[0.03] border border-white/10 text-text-secondary"
                >
                  <CheckCircle2 size={12} className="text-accent-cyan shrink-0" />
                  <span>{ev}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contradicting / Opposing Factors */}
        {primaryGenre.contradictingFactors.length > 0 && (
          <div className="pt-1 space-y-1.5">
            <span className="text-[10px] font-mono text-text-muted">
              Counter-Indicative Factors (Prevented single-genre dominance):
            </span>
            <div className="flex flex-wrap gap-2">
              {primaryGenre.contradictingFactors.map((cf, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-amber-950/10 border border-amber-500/20 text-amber-300/80"
                >
                  <AlertTriangle size={11} className="text-amber-400 shrink-0" />
                  <span>{cf}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Style Traits Radar Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Sliders size={13} className="text-accent-cyan" />
            <span>Multi-Dimensional Stylistic Trait Metrics</span>
          </span>
          <span className="text-[10px] font-mono text-text-muted">
            Derived from Phases 5–11 DSP telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {traits.map((trait, idx) => {
            const Icon = trait.icon;
            const pct = Math.round(trait.value * 100);
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/5 bg-surface-elevated/40 p-4 space-y-2.5 transition-colors hover:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent-cyan">
                      <Icon size={14} />
                    </div>
                    <span className="text-xs font-mono font-medium text-text-primary">
                      {trait.label}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-accent-cyan">
                    {pct}%
                  </span>
                </div>

                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-[10px] font-mono text-text-muted">
                  {trait.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Genres & Stylistic Influences */}
      {secondaryGenres.length > 0 && (
        <div className="space-y-3 pt-1">
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Radio size={13} className="text-accent-violet" />
            <span>Secondary Stylistic Influences & Competing Archetypes</span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {secondaryGenres.map((sec, idx) => {
              const isExpanded = selectedSecondary === sec.genre;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSecondary(isExpanded ? null : sec.genre)}
                  className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                    isExpanded
                      ? "border-accent-violet/40 bg-surface-elevated/90"
                      : "border-white/5 bg-surface-elevated/30 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase text-accent-violet">
                          Influence #{idx + 1}
                        </span>
                        {sec.subgenre && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-text-secondary">
                            {sec.subgenre}
                          </span>
                        )}
                      </div>
                      <h4 className="font-display text-base font-bold text-text-primary">
                        {sec.genre}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-accent-violet">
                        {sec.affinityPercentage}%
                      </span>
                      <span className="text-[10px] font-mono text-text-muted block">
                        fit score
                      </span>
                    </div>
                  </div>

                  {sec.supportingEvidence.length > 0 && (
                    <div className="pt-3 border-t border-white/5 mt-3 space-y-1">
                      {sec.supportingEvidence.map((ev, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                          <span className="h-1 w-1 rounded-full bg-accent-violet" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section-Level Stylistic Variation (from Phase 10 Macro Sections) */}
      {hasSectionVariation && sectionVariations.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Layers size={13} className="text-accent-cyan" />
              <span>Section-Level Stylistic Dynamics</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              Identified shifts across song sections
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {sectionVariations.map((sec, idx) => {
              const isShift = sec.stylisticContrast !== "consistent";
              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 text-xs font-mono space-y-1.5 ${
                    isShift
                      ? "border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan"
                      : "border-white/5 bg-black/20 text-text-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">{sec.sectionName}</span>
                    <span className="text-[10px] text-text-muted">
                      {sec.startTime.toFixed(0)}s–{sec.endTime.toFixed(0)}s
                    </span>
                  </div>
                  <div className="text-[11px] text-accent-cyan truncate">
                    {sec.dominantStyle}
                  </div>
                  {sec.divergentFeatures.length > 0 && (
                    <p className="text-[10px] text-text-muted line-clamp-2">
                      {sec.divergentFeatures[0]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Natural Language Summary & Methodology Note */}
      <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-4 sm:p-5 space-y-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-text-secondary">
          <Info size={14} className="text-accent-cyan shrink-0" />
          <span className="font-bold text-text-primary">Analytical Synthesis</span>
        </div>
        <p className="text-text-secondary leading-relaxed">
          {analysisSummary}
        </p>
        <p className="text-[10px] text-text-muted pt-1 border-t border-white/5">
          {methodologyNote}
        </p>
      </div>
    </div>
  );
}

