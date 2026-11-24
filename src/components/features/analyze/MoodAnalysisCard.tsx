"use client";

import React, { useState } from "react";
import {
  MoodAnalysisResult,
  MoodConfidenceLevel,
} from "@/lib/audio-analysis/types";
import {
  Heart,
  Sparkles,
  Flame,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Radio,
  Sliders,
  Info,
} from "lucide-react";

interface MoodAnalysisCardProps {
  moodResult: MoodAnalysisResult;
}

export function MoodAnalysisCard({ moodResult }: MoodAnalysisCardProps) {
  const [selectedSecondaryMood, setSelectedSecondaryMood] = useState<string | null>(null);

  const {
    primaryMood,
    secondaryMoods,
    dimensions,
    supportingAcousticFeatures,
    contrastingNuances,
    sectionTrajectory,
    hasSectionProgression,
    confidenceLevel,
    isAmbiguous,
    analysisSummary,
    perceptualDisclaimer,
  } = moodResult;

  const { energy, valence, arousal } = dimensions;

  const getConfidenceBadgeColor = (level: MoodConfidenceLevel) => {
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

  const getEnergyBadge = (lvl: string) => {
    switch (lvl) {
      case "high":
        return "border-amber-500/30 bg-amber-950/20 text-amber-300";
      case "moderate":
        return "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan";
      case "low":
      default:
        return "border-blue-500/30 bg-blue-950/20 text-blue-300";
    }
  };

  const getValenceBadge = (tone: string) => {
    switch (tone) {
      case "positive":
        return "border-emerald-500/30 bg-emerald-950/20 text-emerald-300";
      case "negative":
        return "border-purple-500/30 bg-purple-950/20 text-purple-300";
      case "ambiguous":
        return "border-amber-500/30 bg-amber-950/20 text-amber-300";
      case "neutral":
      default:
        return "border-white/20 bg-white/5 text-text-secondary";
    }
  };

  const getArousalBadge = (intensity: string) => {
    switch (intensity) {
      case "intense":
        return "border-rose-500/30 bg-rose-950/20 text-rose-300";
      case "moderate":
        return "border-accent-violet/30 bg-accent-violet/10 text-accent-cyan";
      case "calm":
      default:
        return "border-teal-500/30 bg-teal-950/20 text-teal-300";
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-7 shadow-2xl relative overflow-hidden select-none">
      {/* Background Subtle Radial Glow */}
      <div
        className="pointer-events-none absolute -top-24 right-1/3 h-64 w-96 rounded-full bg-accent-violet/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent-violet/15 border border-accent-violet/30 flex items-center justify-center text-accent-cyan">
            <Heart size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-text-primary">
                Musical Mood & Emotional Character
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan">
                Phase 13
              </span>
            </div>
            <p className="text-xs font-mono text-text-muted">
              Affective Multi-Dimension Modeling: Energy • Valence • Arousal
            </p>
          </div>
        </div>

        {/* Top Confidence Pill */}
        <div className="flex items-center gap-2">
          {isAmbiguous && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border border-amber-500/30 bg-amber-950/20 text-amber-300">
              <AlertTriangle size={12} />
              <span>Affective Contrast</span>
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border capitalize ${getConfidenceBadgeColor(
              confidenceLevel
            )}`}
          >
            {confidenceLevel === "high" ? (
              <CheckCircle2 size={13} />
            ) : confidenceLevel === "moderate" ? (
              <Radio size={13} />
            ) : (
              <HelpCircle size={13} />
            )}
            <span>{confidenceLevel} Confidence</span>
          </span>
        </div>
      </div>

      {/* Primary Mood Hero Banner */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-surface-elevated to-surface p-6 sm:p-7 space-y-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Dominant Expressive Character</span>
            </span>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                {primaryMood.label}
              </h2>
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-medium border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan">
                Primary Mood Archetype
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono text-text-muted">Shades & Nuances:</span>
              {secondaryMoods.length > 0 ? (
                secondaryMoods.map((sm, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setSelectedSecondaryMood(selectedSecondaryMood === sm.label ? null : sm.label)
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                      selectedSecondaryMood === sm.label
                        ? "border-accent-violet/50 bg-accent-violet/20 text-accent-cyan"
                        : "border-white/10 bg-white/5 text-text-secondary hover:text-white"
                    }`}
                  >
                    {sm.label} ({Math.round(sm.score * 100)}%)
                  </button>
                ))
              ) : (
                <span className="text-xs font-mono text-text-muted">Pure cohesive focus</span>
              )}
            </div>
          </div>

          {/* Primary Mood Fit Affinity Meter */}
          <div className="shrink-0 rounded-2xl border border-white/5 bg-black/40 p-4 min-w-[170px] text-center space-y-2">
            <span className="text-[10px] font-mono uppercase text-text-muted">
              Mood Affinity Fit
            </span>
            <div className="font-display text-3xl font-bold text-accent-cyan">
              {Math.round(primaryMood.score * 100)}%
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan"
                style={{ width: `${Math.round(primaryMood.score * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Selected Secondary Mood Details Popover */}
        {selectedSecondaryMood && (
          <div className="rounded-xl border border-accent-violet/30 bg-accent-violet/10 p-3 space-y-1 text-xs font-mono animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-accent-cyan font-bold">
              <Sliders size={12} />
              <span>Nuance: {selectedSecondaryMood}</span>
            </div>
            <p className="text-text-secondary text-[11px]">
              {secondaryMoods.find((s) => s.label === selectedSecondaryMood)?.supportingCues.join(" • ") ??
                "Complementary emotional coloration detected in harmonic or rhythmic sub-elements."}
            </p>
          </div>
        )}

        {/* Acoustic Evidence & Signatures */}
        {supportingAcousticFeatures.length > 0 && (
          <div className="pt-2 border-t border-white/5 space-y-1.5">
            <span className="text-[11px] font-mono text-text-muted">
              Measurable Acoustic Evidence & Signatures:
            </span>
            <div className="flex flex-wrap gap-2">
              {supportingAcousticFeatures.map((cue, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-white/[0.03] border border-white/10 text-text-secondary"
                >
                  <CheckCircle2 size={12} className="text-accent-cyan shrink-0" />
                  <span>{cue}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3 Core Affective Dimensions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Sliders size={13} className="text-accent-cyan" />
            <span>Core Affective Dimensions (Independent Axes)</span>
          </span>
          <span className="text-[10px] font-mono text-text-muted">
            Energy • Valence • Arousal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1. Energy */}
          <div className="rounded-2xl border border-white/5 bg-surface-elevated/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                  <Flame size={16} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-text-primary block">
                    Energy
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    Kinetic & Physical Drive
                  </span>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border capitalize ${getEnergyBadge(
                  energy.level
                )}`}
              >
                {energy.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">Magnitude</span>
                <span className="font-bold text-accent-cyan">
                  {Math.round(energy.score * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
                  style={{ width: `${Math.round(energy.score * 100)}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] font-mono text-text-secondary leading-relaxed">
              {energy.explanation}
            </p>
          </div>

          {/* 2. Valence / Emotional Tone */}
          <div className="rounded-2xl border border-white/5 bg-surface-elevated/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                  <Activity size={16} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-text-primary block">
                    Emotional Tone
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    Valence & Harmony
                  </span>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border capitalize ${getValenceBadge(
                  valence.tone
                )}`}
              >
                {valence.tone}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">Tone Index</span>
                <span className="font-bold text-accent-cyan">
                  {Math.round(valence.score * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-400 to-emerald-400"
                  style={{ width: `${Math.round(valence.score * 100)}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] font-mono text-text-secondary leading-relaxed">
              {valence.explanation}
            </p>
          </div>

          {/* 3. Arousal / Intensity */}
          <div className="rounded-2xl border border-white/5 bg-surface-elevated/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400">
                  <Zap size={16} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-text-primary block">
                    Arousal
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    Sensory Stimulation
                  </span>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border capitalize ${getArousalBadge(
                  arousal.intensity
                )}`}
              >
                {arousal.intensity}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">Intensity</span>
                <span className="font-bold text-accent-cyan">
                  {Math.round(arousal.score * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-rose-400"
                  style={{ width: `${Math.round(arousal.score * 100)}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] font-mono text-text-secondary leading-relaxed">
              {arousal.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Section-Level Mood Trajectory (from Phase 10 Structure) */}
      {hasSectionProgression && sectionTrajectory.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Layers size={13} className="text-accent-cyan" />
              <span>Section Mood & Energy Progression</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              Emotional dynamics mapped across song form
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {sectionTrajectory.map((sec, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-black/20 p-3 text-xs font-mono space-y-2 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">{sec.sectionName}</span>
                  <span className="text-[10px] text-text-muted">
                    {sec.startTime.toFixed(0)}s–{sec.endTime.toFixed(0)}s
                  </span>
                </div>

                <div className="text-[11px] text-accent-cyan truncate font-medium">
                  {sec.dominantMood}
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-text-muted">
                    <span>Energy</span>
                    <span>{Math.round(sec.relativeEnergy * 100)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-cyan"
                      style={{ width: `${Math.round(sec.relativeEnergy * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contrasting Nuances & Crossover Callout */}
      {contrastingNuances.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3.5 space-y-1.5 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <AlertTriangle size={14} className="shrink-0" />
            <span>Affective Nuances & Emotional Counter-Balance</span>
          </div>
          <div className="space-y-1 text-amber-200/80 text-[11px]">
            {contrastingNuances.map((nuance, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                <span>{nuance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Natural Language Synthesis & Perceptual Disclaimer */}
      <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-4 sm:p-5 space-y-2.5 text-xs font-mono">
        <div className="flex items-center gap-2 text-text-secondary">
          <Info size={14} className="text-accent-cyan shrink-0" />
          <span className="font-bold text-text-primary">Analytical Synthesis</span>
        </div>
        <p className="text-text-secondary leading-relaxed">
          {analysisSummary}
        </p>
        <p className="text-[10px] text-text-muted pt-2 border-t border-white/5 leading-relaxed">
          {perceptualDisclaimer}
        </p>
      </div>
    </div>
  );
}
