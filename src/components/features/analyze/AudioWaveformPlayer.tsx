"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { AudioFileMetadata } from "@/types/analyzer";
import { formatDuration } from "@/lib/audio-utils";

interface AudioWaveformPlayerProps {
  metadata: AudioFileMetadata;
}

export function AudioWaveformPlayer({ metadata }: AudioWaveformPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(metadata.duration || 0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
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
      audio.play().catch((err) => {
        console.warn("Audio playback was blocked or failed:", err);
      });
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

  const seekToRatio = useCallback(
    (ratio: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      const clamped = Math.max(0, Math.min(1, ratio));
      const targetTime = clamped * duration;
      audio.currentTime = targetTime;
      setCurrentTime(targetTime);
    },
    [duration]
  );

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    seekToRatio(ratio);
  };

  const handleWaveformMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    setHoverProgress(Math.max(0, Math.min(1, clickX / rect.width)));
  };

  const handleWaveformMouseLeave = () => {
    setHoverProgress(null);
  };

  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const peaks = metadata.peaks && metadata.peaks.length > 0 ? metadata.peaks : Array(100).fill(0.3);

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} src={metadata.objectUrl} preload="auto" />

      {/* Top Bar: Telemetry Label and Current Timestamp */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-text-muted uppercase tracking-wider">Audio Telemetry Waveform</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-primary">
          <span className="text-accent-cyan font-bold">{formatDuration(currentTime)}</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-secondary">{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Interactive Waveform Visualizer Canvas Container */}
      <div
        ref={waveformRef}
        onClick={handleWaveformClick}
        onMouseMove={handleWaveformMouseMove}
        onMouseLeave={handleWaveformMouseLeave}
        className="relative h-28 sm:h-36 w-full rounded-2xl bg-[#06070c] border border-white/10 p-3 flex items-end justify-between gap-[2px] sm:gap-[3px] cursor-pointer overflow-hidden group select-none transition-all duration-300 hover:border-accent-violet/40"
        title="Click to seek playback position"
      >
        {/* Subtle Background Grid Lines */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Center zero-axis baseline */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-white/5 -translate-y-1/2" />

        {/* Real Sampled Peaks Bars */}
        {peaks.map((peak, index) => {
          const barRatio = index / peaks.length;
          const isPlayed = barRatio <= progressRatio;
          const isHovered = hoverProgress !== null && barRatio <= hoverProgress;

          // Compute responsive bar height
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
                      ? "#06b6d4" // Cyan
                      : "#8b5cf6" // Violet
                    : isHovered
                    ? "rgba(167, 139, 250, 0.45)"
                    : "rgba(255, 255, 255, 0.12)",
                  boxShadow: isPlayed
                    ? index % 3 === 0
                      ? "0 0 8px rgba(6, 182, 212, 0.4)"
                      : "0 0 8px rgba(139, 92, 246, 0.4)"
                    : "none",
                }}
              />
            </div>
          );
        })}

        {/* Playhead Vertical Line Indicator */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-accent-cyan shadow-[0_0_12px_#06b6d4] transition-all duration-75 z-10"
          style={{ left: `${progressRatio * 100}%` }}
        >
          <div className="h-3 w-3 rounded-full bg-accent-cyan -translate-x-1/2 -translate-y-1/2 absolute top-0 shadow-[0_0_8px_#22d3ee]" />
        </div>

        {/* Hover Time Tooltip */}
        {hoverProgress !== null && (
          <div
            className="pointer-events-none absolute bottom-2 px-2 py-1 rounded bg-surface-elevated/95 border border-white/10 text-[10px] font-mono text-accent-cyan shadow-lg -translate-x-1/2 z-20"
            style={{ left: `${hoverProgress * 100}%` }}
          >
            {formatDuration(hoverProgress * duration)}
          </div>
        )}
      </div>

      {/* Primary Player Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Play / Pause & Restart Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlayPause}
            className="h-12 w-12 rounded-2xl bg-accent-violet hover:bg-accent-violet-deep text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95 cursor-pointer"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
            aria-label="Restart audio from beginning"
          >
            <RotateCcw size={16} />
          </button>

          <div className="hidden sm:block pl-2">
            <p className="text-xs font-medium text-text-primary truncate max-w-[200px]">
              {metadata.fileName}
            </p>
            <p className="text-[11px] font-mono text-text-muted">
              {metadata.fileSizeFormatted} • {metadata.durationFormatted}
            </p>
          </div>
        </div>

        {/* Seek Scrubber for Fine Adjustment */}
        <div className="w-full sm:w-auto flex-1 max-w-xs px-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
              if (audioRef.current) audioRef.current.currentTime = val;
            }}
            className="w-full accent-accent-violet h-1.5 bg-white/10 rounded-lg cursor-pointer"
            aria-label="Audio scrubber"
          />
        </div>

        {/* Volume & Mute Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleMute}
            className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 sm:w-24 accent-accent-cyan h-1.5 bg-white/10 rounded-lg cursor-pointer"
            aria-label="Volume slider"
          />
        </div>
      </div>
    </div>
  );
}
