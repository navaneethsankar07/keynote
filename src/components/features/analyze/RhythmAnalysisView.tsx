"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Activity,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  RefreshCw,
  Sliders,
  Sparkles,
  Music2,
  Layers,
  Repeat,
  Disc,
} from "lucide-react";
import {
  RhythmAnalysisResult,
  FullSongAnalysisResult,
  AudioFileMetadata,
} from "@/types/analyzer";
import { formatDuration } from "@/lib/audio-utils";
import { KeyAnalysisCard } from "./KeyAnalysisCard";
import { ChromaVisualizer } from "./ChromaVisualizer";
import { ChordTimeline } from "./ChordTimeline";
import { ChordAnalysisCard } from "./ChordAnalysisCard";
import { ChordProgressionView } from "./ChordProgressionView";
import { MelodyTimeline } from "./MelodyTimeline";
import { MelodyAnalysisCard } from "./MelodyAnalysisCard";
import { StructureTimeline } from "./StructureTimeline";
import { StructureAnalysisCard } from "./StructureAnalysisCard";
import { InstrumentAnalysisCard } from "./InstrumentAnalysisCard";

interface RhythmAnalysisViewProps {
  metadata: AudioFileMetadata;
  analysis: FullSongAnalysisResult | RhythmAnalysisResult;
  onBackToPreview: () => void;
  onReanalyze: () => void;
  onReset: () => void;
}

type ViewTab =
  | "all"
  | "instruments"
  | "structure"
  | "melody"
  | "progressions"
  | "chords"
  | "tonality"
  | "rhythm";

export function RhythmAnalysisView({
  metadata,
  analysis,
  onBackToPreview,
  onReanalyze,
  onReset,
}: RhythmAnalysisViewProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>("all");

  const duration = metadata.duration || analysis.duration || 1;
  const { tempo, beats } = analysis;
  const keyResult = "key" in analysis ? analysis.key : null;
  const chordResult = "chords" in analysis ? analysis.chords : null;
  const progressionResult = "progression" in analysis ? analysis.progression : null;
  const melodyResult = "melody" in analysis ? analysis.melody : null;
  const structureResult = "structure" in analysis ? analysis.structure : null;
  const instrumentResult = "instruments" in analysis ? analysis.instruments : null;

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audio.play().catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = newVol === 0;
    }
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const seekToTime = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const clamped = Math.max(0, Math.min(duration, time));
      audio.currentTime = clamped;
      setCurrentTime(clamped);
    },
    [duration]
  );

  // Find the active beat index based on current playback time
  const currentBeatIndex = useMemo(() => {
    if (!beats.beatTimestamps.length) return -1;
    let idx = -1;
    for (let i = 0; i < beats.beatTimestamps.length; i++) {
      if (beats.beatTimestamps[i] <= currentTime) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [beats.beatTimestamps, currentTime]);

  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const peaks = metadata.peaks && metadata.peaks.length > 0 ? metadata.peaks : Array(100).fill(0.3);

  // Confidence styling badge for Tempo
  const tempoConfidenceBadge = useMemo(() => {
    switch (tempo.confidence) {
      case "high":
        return {
          label: "High Confidence",
          colorClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          icon: CheckCircle2,
          percent: `${Math.round(tempo.confidenceScore * 100)}%`,
        };
      case "moderate":
        return {
          label: "Moderate Confidence",
          colorClass: "bg-amber-500/15 border-amber-500/30 text-amber-300",
          icon: AlertTriangle,
          percent: `${Math.round(tempo.confidenceScore * 100)}%`,
        };
      default:
        return {
          label: "Low Confidence",
          colorClass: "bg-rose-500/15 border-rose-500/30 text-rose-300",
          icon: HelpCircle,
          percent: `${Math.round(tempo.confidenceScore * 100)}%`,
        };
    }
  }, [tempo.confidence, tempo.confidenceScore]);

  const TempoConfidenceIcon = tempoConfidenceBadge.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} src={metadata.objectUrl} preload="auto" />

      {/* Top Banner: Title & Analysis Benchmark */}
      <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className="pointer-events-none absolute -top-24 right-0 h-64 w-96 rounded-full bg-accent-violet/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent-cyan">
              DSP Audio Intelligence • Phases 5, 6, 7, 8, 9 & 10
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
              Full Song Analysis Results
            </h2>
            <p className="text-xs font-mono text-text-muted mt-0.5 truncate max-w-sm sm:max-w-md">
              {metadata.fileName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {instrumentResult && instrumentResult.detections.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-violet/15 border border-accent-violet/30 text-accent-cyan text-xs font-mono font-medium">
                <Disc size={13} className="text-accent-violet" />
                <span>Timbre: {instrumentResult.detections.length} sources</span>
              </span>
            )}
            {structureResult && structureResult.totalSections > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan text-xs font-mono font-medium">
                <Layers size={13} className="text-accent-cyan" />
                <span>Form: {structureResult.totalSections} sections</span>
              </span>
            )}
            {melodyResult && melodyResult.totalNotes > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-violet/15 border border-accent-violet/30 text-accent-cyan text-xs font-mono font-medium">
                <Music2 size={13} className="text-accent-violet" />
                <span>Melody: {melodyResult.totalNotes} notes</span>
              </span>
            )}
            {keyResult && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan text-xs font-mono font-medium">
                <Music2 size={13} />
                <span>Key: {keyResult.key}</span>
              </span>
            )}
            {chordResult && chordResult.dominantChord && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-violet/15 border border-accent-violet/30 text-accent-violet text-xs font-mono font-medium">
                <Layers size={13} className="text-accent-cyan" />
                <span>Anchor: {chordResult.dominantChord}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary text-xs font-mono font-medium">
              <Sparkles size={13} className="text-accent-cyan" />
              <span>{analysis.analysisTimeMs}ms</span>
            </span>
          </div>
        </div>

        {/* --- INTERACTIVE BEAT TIMELINE & WAVEFORM PLAYER --- */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-muted flex items-center gap-1.5">
              <Sliders size={13} className="text-accent-violet" />
              <span>Waveform & Beat Alignment (Click to Seek)</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-accent-cyan font-bold">{formatDuration(currentTime)}</span>
              <span className="text-text-muted">/</span>
              <span className="text-text-secondary">{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Interactive Waveform with Beat Grid Overlay */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              seekToTime(ratio * duration);
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              setHoverTime(Math.max(0, Math.min(duration, ratio * duration)));
            }}
            onMouseLeave={() => setHoverTime(null)}
            className="relative h-28 sm:h-32 w-full rounded-2xl bg-[#06070c] border border-white/10 p-3 flex items-end justify-between gap-[2px] sm:gap-[3px] cursor-pointer overflow-hidden group select-none transition-all duration-300 hover:border-accent-violet/40"
            title="Click anywhere to seek to that timestamp or beat"
          >
            {/* Background Grid */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Zero Axis */}
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-white/5 -translate-y-1/2" />

            {/* Detected Beat Vertical Tick Markers */}
            {beats.beatTimestamps.map((beatTime, idx) => {
              const beatRatio = beatTime / duration;
              if (beatRatio < 0 || beatRatio > 1) return null;
              const isPast = beatTime <= currentTime;
              const isCurrent = idx === currentBeatIndex;

              return (
                <div
                  key={idx}
                  className={`pointer-events-none absolute top-0 bottom-0 w-px transition-colors duration-100 ${
                    isCurrent
                      ? "bg-accent-cyan shadow-[0_0_8px_#06b6d4] z-10 w-[2px]"
                      : isPast
                      ? "bg-accent-violet/40"
                      : "bg-white/10"
                  }`}
                  style={{ left: `${beatRatio * 100}%` }}
                >
                  {/* Top tick head */}
                  <div
                    className={`h-1.5 w-1 rounded-full -translate-x-1/2 ${
                      isCurrent
                        ? "bg-accent-cyan"
                        : idx % 4 === 0
                        ? "bg-accent-violet"
                        : "bg-white/30"
                    }`}
                  />
                </div>
              );
            })}

            {/* Waveform Bars */}
            {peaks.map((peak, index) => {
              const barRatio = index / peaks.length;
              const isPlayed = barRatio <= progressRatio;
              const heightPercent = Math.max(10, Math.round(peak * 100));

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col justify-center items-center h-full relative"
                >
                  <div
                    className="w-full rounded-full transition-all duration-150"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: isPlayed
                        ? index % 3 === 0
                          ? "#06b6d4"
                          : "#8b5cf6"
                        : "rgba(255, 255, 255, 0.12)",
                      boxShadow: isPlayed
                        ? index % 3 === 0
                          ? "0 0 6px rgba(6, 182, 212, 0.4)"
                          : "0 0 6px rgba(139, 92, 246, 0.4)"
                        : "none",
                    }}
                  />
                </div>
              );
            })}

            {/* Playhead vertical marker */}
            <div
              className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-accent-cyan shadow-[0_0_12px_#06b6d4] transition-all duration-75 z-20"
              style={{ left: `${progressRatio * 100}%` }}
            >
              <div className="h-3 w-3 rounded-full bg-accent-cyan -translate-x-1/2 -translate-y-1/2 absolute top-0 shadow-[0_0_8px_#22d3ee]" />
            </div>

            {/* Hover Tooltip */}
            {hoverTime !== null && (
              <div
                className="pointer-events-none absolute bottom-2 px-2 py-1 rounded bg-surface-elevated/95 border border-white/10 text-[10px] font-mono text-accent-cyan shadow-lg -translate-x-1/2 z-30"
                style={{ left: `${(hoverTime / duration) * 100}%` }}
              >
                {formatDuration(hoverTime)}
              </div>
            )}
          </div>

          {/* Integrated Playback Control Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlayPause}
                className="h-11 w-11 rounded-xl bg-accent-violet hover:bg-accent-violet-deep text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_18px_rgba(139,92,246,0.4)] active:scale-95 cursor-pointer"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-white ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                aria-label="Restart audio from beginning"
              >
                <RotateCcw size={15} />
              </button>

              <div className="text-xs font-mono text-text-secondary pl-1">
                <span>Space to toggle • Click waveform to scrub</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="text-text-secondary hover:text-text-primary p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 accent-accent-cyan h-1.5 bg-white/10 rounded-lg cursor-pointer"
                aria-label="Volume slider"
              />
            </div>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-accent-violet text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                : "bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10"
            }`}
          >
            All Dimensions
          </button>
          {instrumentResult && (
            <button
              type="button"
              onClick={() => setActiveTab("instruments")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "instruments"
                  ? "bg-accent-violet text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10"
              }`}
            >
              <Disc size={13} />
              <span>Instruments & Timbre</span>
            </button>
          )}
          {structureResult && (
            <button
              type="button"
              onClick={() => setActiveTab("structure")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "structure"
                  ? "bg-accent-violet text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10"
              }`}
            >
              <Layers size={13} />
              <span>Structure & Form</span>
            </button>
          )}
          {melodyResult && (
            <button
              type="button"
              onClick={() => setActiveTab("melody")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "melody"
                  ? "bg-accent-violet text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10"
              }`}
            >
              <Music2 size={13} />
              <span>Melody & Pitch</span>
            </button>
          )}
          {progressionResult && (
            <button
              type="button"
              onClick={() => setActiveTab("progressions")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "progressions"
                  ? "bg-accent-violet text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10"
              }`}
            >
              <Repeat size={13} />
              <span>Progressions & Harmony</span>
            </button>
          )}
          {chordResult && (
            <button
              type="button"
              onClick={() => setActiveTab("chords")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "chords"
                  ? "bg-accent-violet text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10"
              }`}
            >
              <Layers size={13} />
              <span>Chord Timeline</span>
            </button>
          )}
          {keyResult && (
            <button
              type="button"
              onClick={() => setActiveTab("tonality")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "tonality"
                  ? "bg-accent-violet text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10"
              }`}
            >
              <Music2 size={13} />
              <span>Key & Tonality</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab("rhythm")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "rhythm"
                ? "bg-accent-violet text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                : "bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10"
            }`}
          >
            <Activity size={13} />
            <span>Rhythm & Tempo</span>
          </button>
        </div>

        {/* --- SECTION: INSTRUMENT & SOUND IDENTIFICATION (PHASE 11) --- */}
        {instrumentResult && (activeTab === "all" || activeTab === "instruments") && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            <InstrumentAnalysisCard instrumentResult={instrumentResult} />
          </div>
        )}

        {/* --- SECTION 0: MUSICAL STRUCTURE & SECTION ANALYSIS (PHASE 10) --- */}
        {structureResult && (activeTab === "all" || activeTab === "structure") && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <StructureTimeline
                structureResult={structureResult}
                currentTime={currentTime}
                duration={duration}
                onSeek={seekToTime}
              />
            </div>

            <StructureAnalysisCard
              structureResult={structureResult}
              onSeek={seekToTime}
            />
          </div>
        )}

        {/* --- SECTION 0: MELODY & PITCH ANALYSIS (PHASE 9) --- */}
        {melodyResult && (activeTab === "all" || activeTab === "melody") && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <MelodyTimeline
                melodyResult={melodyResult}
                currentTime={currentTime}
                duration={duration}
                onSeek={seekToTime}
              />
            </div>

            <MelodyAnalysisCard
              melodyResult={melodyResult}
              currentTime={currentTime}
              onSeek={seekToTime}
            />
          </div>
        )}

        {/* --- SECTION 1: CHORD PROGRESSION & HARMONIC ANALYSIS (PHASE 8) --- */}
        {progressionResult && (activeTab === "all" || activeTab === "progressions") && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            <ChordProgressionView
              progression={progressionResult}
              currentTime={currentTime}
              onSeek={seekToTime}
            />
          </div>
        )}

        {/* --- SECTION 2: CHORD TIMELINE & HARMONY (PHASE 7) --- */}
        {chordResult && (activeTab === "all" || activeTab === "chords") && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            {/* Chord Timeline Component with Playback Sync */}
            <ChordTimeline
              chordResult={chordResult}
              currentTime={currentTime}
              duration={duration}
              onSeek={seekToTime}
            />

            {/* Chord Analysis Card */}
            <ChordAnalysisCard chordResult={chordResult} />
          </div>
        )}

        {/* --- SECTION 2: KEY & TONALITY (PHASE 6) --- */}
        {keyResult && (activeTab === "all" || activeTab === "tonality") && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            {/* Key & Scale Card */}
            <KeyAnalysisCard keyResult={keyResult} />

            {/* Pitch-Class Chroma Visualizer */}
            <ChromaVisualizer keyResult={keyResult} />
          </div>
        )}

        {/* --- SECTION 3: RHYTHM & TEMPO (PHASE 5) --- */}
        {(activeTab === "all" || activeTab === "rhythm") && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            {/* Primary Metrics Grid: Tempo + Regularity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Tempo (BPM) Card */}
              <div className="rounded-2xl border border-white/10 bg-surface-elevated/80 p-5 sm:p-6 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-mono uppercase text-text-muted">
                    <Gauge size={15} className="text-accent-violet" />
                    <span>Estimated Tempo</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-mono ${tempoConfidenceBadge.colorClass}`}
                  >
                    <TempoConfidenceIcon size={12} />
                    <span>{tempoConfidenceBadge.label}</span>
                    <span className="font-bold opacity-80">({tempoConfidenceBadge.percent})</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-text-primary">
                    {tempo.bpm > 0 ? tempo.bpm : "—"}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-accent-cyan">
                    BPM
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed border-t border-white/5 pt-3">
                  {tempo.confidenceReason}
                </p>

                {/* Alternative Interpretation Callout (Half-time / Double-time) */}
                {tempo.alternativeBpm && (
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/25 p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-accent-cyan font-semibold">
                        Alternative: {tempo.alternativeBpm} BPM
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {tempo.alternativeLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-normal">
                      Identified secondary harmonic peak in autocorrelation. In rhythmic styles, pulse may be felt at this half/double meter.
                    </p>
                  </div>
                )}
              </div>

              {/* Rhythm & Meter Regularity Card */}
              <div className="rounded-2xl border border-white/10 bg-surface-elevated/80 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-mono uppercase text-text-muted">
                    <Activity size={15} className="text-accent-cyan" />
                    <span>Rhythm Telemetry</span>
                  </span>

                  <span className="text-xs font-mono text-accent-violet font-semibold">
                    {beats.regularityScore >= 0.8
                      ? "Metronomic Precision"
                      : beats.regularityScore >= 0.5
                      ? "Expressive Timing"
                      : "Variable / Loose Pulse"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-white/5 bg-black/30 p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-text-muted">
                      Detected Beats
                    </span>
                    <p className="font-display text-xl font-bold text-text-primary">
                      {beats.totalBeats}
                    </p>
                    <span className="text-[10px] font-mono text-text-muted block">
                      Across {formatDuration(duration)}
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/30 p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-text-muted">
                      Beat Interval
                    </span>
                    <p className="font-display text-xl font-bold text-accent-cyan">
                      {beats.averageIntervalMs}
                      <span className="text-xs font-mono ml-1 font-normal">ms</span>
                    </p>
                    <span className="text-[10px] font-mono text-text-muted block">
                      ~{(beats.averageIntervalMs / 1000).toFixed(3)}s / beat
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/30 p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-text-muted">
                      Beat Regularity
                    </span>
                    <p className="font-display text-xl font-bold text-text-primary">
                      {Math.round(beats.regularityScore * 100)}%
                    </p>
                    <span className="text-[10px] font-mono text-text-muted block">
                      Pulse consistency
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/30 p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-text-muted">
                      First Beat Offset
                    </span>
                    <p className="font-display text-xl font-bold text-text-primary">
                      {beats.firstBeatOffset.toFixed(2)}s
                    </p>
                    <span className="text-[10px] font-mono text-text-muted block">
                      Initial downbeat
                    </span>
                  </div>
                </div>

                {/* Live Synchronized Beat Counter */}
                <div className="rounded-xl border border-white/5 bg-surface/50 p-2.5 flex items-center justify-between text-xs font-mono">
                  <span className="text-text-muted">Active Playback Pulse:</span>
                  <span className="text-accent-cyan font-bold flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${isPlaying ? "bg-accent-cyan animate-ping" : "bg-white/20"}`} />
                    <span>
                      {currentBeatIndex >= 0
                        ? `Beat ${currentBeatIndex + 1} of ${beats.totalBeats}`
                        : "Playback Idle"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onBackToPreview}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Back to File Preview</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onReanalyze}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Re-analyze</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent-violet hover:bg-accent-violet-deep text-white text-xs sm:text-sm font-medium transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] cursor-pointer"
            >
              <span>Analyze Another Song</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
