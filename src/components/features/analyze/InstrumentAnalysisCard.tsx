"use client";

import React, { useState } from "react";
import {
  InstrumentAnalysisResult,
} from "@/lib/audio-analysis/types";
import {
  Mic,
  Drum,
  Disc,
  Radio,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Activity,
  Info,
  Waves,
} from "lucide-react";

interface InstrumentAnalysisCardProps {
  instrumentResult: InstrumentAnalysisResult;
}

export function InstrumentAnalysisCard({
  instrumentResult,
}: InstrumentAnalysisCardProps) {
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(
    null
  );

  const {
    detections,
    vocal,
    percussion,
    bass,
    timbre,
    overallAcousticVsElectronic,
    analysisSummary,
  } = instrumentResult;

  if (detections.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet">
            <Radio size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-text-primary">
              Instrument & Sound Identification
            </h3>
            <p className="text-xs font-mono text-text-muted">
              Spectral Timbre & Sound Source Profiling
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

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent-cyan/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center text-accent-cyan shadow-inner">
            <Radio size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent-cyan">
              Timbral Intelligence • Phase 11
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
              Instrument & Sound Identification
            </h3>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              Multi-Band Spectral Analysis • Sound Source Classification • Timbre Metrics
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium ${
              overallAcousticVsElectronic === "acoustic"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : overallAcousticVsElectronic === "electronic"
                ? "bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan"
                : "bg-accent-violet/15 border-accent-violet/30 text-accent-violet"
            }`}
          >
            <Sparkles size={13} />
            <span className="capitalize">{overallAcousticVsElectronic} Palette</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary text-xs font-mono">
            <Waves size={13} className="text-accent-cyan" />
            <span className="capitalize">{timbre.brightness} Timbre</span>
          </span>
        </div>
      </div>

      {/* Algorithmic Summary Paragraph */}
      <div className="rounded-2xl border border-white/10 bg-surface-deep/70 p-4 sm:p-5 text-sm text-text-secondary leading-relaxed font-sans">
        <p>{analysisSummary}</p>
      </div>

      {/* 4 Primary Sound Source Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Vocal Presence */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Mic size={14} className="text-pink-400" />
              <span>Voice / Vocal</span>
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                vocal.detected
                  ? "bg-pink-500/15 border-pink-500/30 text-pink-400"
                  : "bg-white/5 border-white/10 text-text-muted"
              }`}
            >
              {vocal.detected ? "Detected" : "Instrumental"}
            </span>
          </div>

          <div>
            <div className="font-display text-xl font-bold text-text-primary capitalize truncate">
              {vocal.classification.replace("_", " ")}
            </div>
            <p className="text-xs text-text-muted mt-1 leading-snug line-clamp-2">
              {vocal.description}
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
            <span>Presence: {vocal.presencePercentage}%</span>
            <span>Formants: {Math.round(vocal.formantClarity * 100)}%</span>
          </div>
        </div>

        {/* Pillar 2: Percussion & Drums */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Drum size={14} className="text-amber-400" />
              <span>Rhythm & Drums</span>
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                percussion.detected
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                  : "bg-white/5 border-white/10 text-text-muted"
              }`}
            >
              {percussion.detected ? "Active" : "Ambient"}
            </span>
          </div>

          <div>
            <div className="font-display text-xl font-bold text-text-primary capitalize truncate">
              {percussion.percussionType.replace("_", " ")}
            </div>
            <p className="text-xs text-text-muted mt-1 leading-snug line-clamp-2">
              {percussion.description}
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex gap-2">
            {percussion.hasKick && (
              <span className="text-[10px] px-1 rounded bg-white/5 text-accent-cyan">
                Kick
              </span>
            )}
            {percussion.hasSnare && (
              <span className="text-[10px] px-1 rounded bg-white/5 text-accent-violet">
                Snare
              </span>
            )}
            {percussion.hasHiHats && (
              <span className="text-[10px] px-1 rounded bg-white/5 text-text-secondary">
                Hats
              </span>
            )}
          </div>
        </div>

        {/* Pillar 3: Bass Instruments */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Disc size={14} className="text-blue-400" />
              <span>Low-End Bass</span>
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                bass.detected
                  ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
                  : "bg-white/5 border-white/10 text-text-muted"
              }`}
            >
              {bass.detected ? "Present" : "Subdued"}
            </span>
          </div>

          <div>
            <div className="font-display text-xl font-bold text-text-primary capitalize truncate">
              {bass.bassType.replace("_", " ")}
            </div>
            <p className="text-xs text-text-muted mt-1 leading-snug line-clamp-2">
              {bass.description}
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-white/5 flex justify-between">
            <span>Range: {bass.fundamentalFrequencyRange}</span>
            <span>Sub-Ratio: {Math.round(bass.subBassEnergyRatio * 100)}%</span>
          </div>
        </div>

        {/* Pillar 4: Timbral Profile */}
        <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <Activity size={14} className="text-accent-cyan" />
              <span>Timbre Texture</span>
            </span>
            <span className="text-accent-cyan font-bold">{timbre.dominantTexture.split(" ")[0]}</span>
          </div>

          <div>
            <div className="font-display text-xl font-bold text-text-primary truncate">
              {timbre.dominantTexture}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Centroid: {timbre.spectralCentroidHz} Hz • Flatness: {timbre.spectralFlatness}
            </p>
          </div>

          {/* Acoustic vs Electronic progress bar */}
          <div className="pt-2 border-t border-white/5 space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>Acoustic ({Math.round(timbre.acousticness * 100)}%)</span>
              <span>Electronic ({Math.round(timbre.electronicness * 100)}%)</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-400 h-full transition-all"
                style={{ width: `${Math.round(timbre.acousticness * 100)}%` }}
              />
              <div
                className="bg-accent-cyan h-full transition-all"
                style={{ width: `${Math.round(timbre.electronicness * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detected Instrument Candidates List */}
      <div className="space-y-4 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <Sliders size={13} className="text-accent-cyan" />
            <span>Identified Instrument Candidates & Sound Sources</span>
          </span>
          <span>{detections.length} Sound Sources Identified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detections.map((detection) => {
            const isSelected = selectedDetectionId === detection.id;

            return (
              <div
                key={detection.id}
                onClick={() =>
                  setSelectedDetectionId(isSelected ? null : detection.id)
                }
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-accent-cyan shadow-xl scale-[1.01]"
                    : "hover:border-white/20"
                }`}
                style={{
                  borderColor: isSelected ? "#06B6D4" : `${detection.color}40`,
                  backgroundColor: `${detection.color}10`,
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono font-bold text-sm truncate"
                      style={{ color: detection.color }}
                    >
                      {detection.name}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                      detection.specificity === "candidate"
                        ? "bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan font-bold"
                        : "bg-white/5 border-white/10 text-text-secondary"
                    }`}
                  >
                    {detection.specificity === "candidate"
                      ? "Candidate"
                      : "Family Match"}
                  </span>
                </div>

                {/* Body Details */}
                <div className="space-y-3 pt-3 text-xs font-mono">
                  {/* Presence Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-text-muted mb-1">
                      <span>Presence Across Song</span>
                      <span className="text-text-primary font-bold">
                        {detection.presencePercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${detection.presencePercentage}%`,
                          backgroundColor: detection.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Frequency Range & Family */}
                  <div className="flex justify-between text-[11px] text-text-secondary pt-1">
                    <span>Family: {detection.familyLabel.split(" ")[0]}</span>
                    <span>Range: {detection.frequencyRange}</span>
                  </div>

                  {/* Confidence Badge */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-text-muted">
                      Confidence:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        detection.confidenceLevel === "high"
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : detection.confidenceLevel === "moderate"
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                          : "bg-rose-500/15 border-rose-500/30 text-rose-300"
                      }`}
                    >
                      {detection.confidenceLevel === "high" ? (
                        <CheckCircle2 size={11} />
                      ) : detection.confidenceLevel === "moderate" ? (
                        <AlertTriangle size={11} />
                      ) : (
                        <HelpCircle size={11} />
                      )}
                      <span>
                        {detection.confidenceLevel} ({Math.round(detection.confidence * 100)}%)
                      </span>
                    </span>
                  </div>

                  {/* Timbral Cues */}
                  {detection.timbralCues.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-[10px] text-text-muted block">
                        Acoustic Cues:
                      </span>
                      {detection.timbralCues.map((cue, idx) => (
                        <div
                          key={idx}
                          className="text-[10px] text-text-secondary flex items-start gap-1.5 leading-snug"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0 mt-1"
                            style={{ backgroundColor: detection.color }}
                          />
                          <span>{cue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timbral Acoustic Telemetry Details Panel */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <Activity size={13} className="text-accent-violet" />
            <span>Measured Timbral Acoustics Telemetry</span>
          </span>
          <span>Client-side DSP features</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl border border-white/5 bg-surface-deep/80 space-y-1 text-xs font-mono">
            <span className="text-[10px] text-text-muted block">
              Spectral Centroid
            </span>
            <p className="font-display text-lg font-bold text-text-primary">
              {timbre.spectralCentroidHz} <span className="text-xs font-normal">Hz</span>
            </p>
            <span className="text-[10px] text-text-secondary capitalize">
              {timbre.brightness} brightness
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/5 bg-surface-deep/80 space-y-1 text-xs font-mono">
            <span className="text-[10px] text-text-muted block">
              Spectral Rolloff (85%)
            </span>
            <p className="font-display text-lg font-bold text-accent-cyan">
              {timbre.spectralRolloffHz} <span className="text-xs font-normal">Hz</span>
            </p>
            <span className="text-[10px] text-text-secondary">
              High frequency cutoff
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/5 bg-surface-deep/80 space-y-1 text-xs font-mono">
            <span className="text-[10px] text-text-muted block">
              Spectral Flatness
            </span>
            <p className="font-display text-lg font-bold text-text-primary">
              {timbre.spectralFlatness}
            </p>
            <span className="text-[10px] text-text-secondary">
              {timbre.spectralFlatness < 0.05 ? "Pure tonal harmonics" : "Noisy / transient"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/5 bg-surface-deep/80 space-y-1 text-xs font-mono">
            <span className="text-[10px] text-text-muted block">
              Harmonic Purity
            </span>
            <p className="font-display text-lg font-bold text-accent-violet">
              {Math.round(timbre.harmonicity * 100)}%
            </p>
            <span className="text-[10px] text-text-secondary">
              Harmonic-to-noise ratio
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/5 bg-surface-deep/80 space-y-1 text-xs font-mono">
            <span className="text-[10px] text-text-muted block">
              Dynamic Range Spread
            </span>
            <p className="font-display text-lg font-bold text-text-primary">
              {timbre.dynamicRangeDb} <span className="text-xs font-normal">dB</span>
            </p>
            <span className="text-[10px] text-text-secondary">
              Peak to RMS ratio
            </span>
          </div>
        </div>
      </div>

      {/* DSP Transparency Footer Note */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex items-start gap-3 text-xs text-text-muted font-sans leading-relaxed">
        <Info size={16} className="text-accent-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-secondary font-mono">Honest Polyphonic Classification:</strong>{" "}
          Instrument candidates are inferred from acoustic multi-band spectral energy, transient attack behavior,
          vocal formant resonances ($400 - 2,600$ Hz), and harmonic purity.
          In commercial recordings, overlapping instruments cannot be perfectly isolated without full source separation.
          Keynote distinguishes broad families from specific candidates and never hallucinates detections when cues are ambiguous.
        </div>
      </div>
    </div>
  );
}
