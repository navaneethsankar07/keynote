"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { WaveformIcon, ActivityIcon } from "@/components/ui/Icons";

function ShuffleIcon({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 3h5v5" />
      <path d="M4 20L21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}

function SkipBackIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="19 20 9 12 19 4 19 20" fill="currentColor" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  );
}

function SkipForwardIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  );
}

function RepeatIcon({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function PlayIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function PauseIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

const TOTAL_DURATION = 230; // 3:50 (Starboy duration)

export function IntroductionSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(84); // 01:24
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth synthesizer chord loop for Starboy (G minor: Gm -> F -> Eb -> Dm)
  const playAmbientChord = useCallback((ctx: AudioContext, timeOffset: number, freqs: number[]) => {
    try {
      const now = ctx.currentTime + timeOffset;
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.9);
      });
    } catch {
      // Audio autoplay blocked or unsupported
    }
  }, []);

  const triggerChordSequence = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Gm7 (G3, Bb3, D4, F4)
      playAmbientChord(ctx, 0, [196.0, 233.08, 293.66, 349.23]);
      // F (F3, A3, C4, E4)
      playAmbientChord(ctx, 1.2, [174.61, 220.0, 261.63, 329.63]);
    } catch {
      // ignore
    }
  }, [playAmbientChord]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      triggerChordSequence();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            return isRepeat ? 0 : TOTAL_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isRepeat]);

  // Periodic chill synth chords while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      triggerChordSequence();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, triggerChordSequence]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(Math.round(ratio * TOTAL_DURATION));
  };

  const handlePrev = () => {
    setCurrentTime(0);
    if (isPlaying) triggerChordSequence();
  };

  const handleNext = () => {
    setCurrentTime((prev) => (prev + 30 > TOTAL_DURATION ? 0 : prev + 30));
    if (isPlaying) triggerChordSequence();
  };

  const progressPercent = (currentTime / TOTAL_DURATION) * 100;

  return (
    <section className="relative py-28 sm:py-36 lg:py-44 border-t border-white/5 bg-[#07080e] overflow-hidden">
      {/* Background ambient radial gradients */}
      <div
        className="pointer-events-none absolute -top-32 right-1/4 w-[520px] h-[520px] rounded-full bg-accent-violet/15 blur-[140px] animate-pulse"
        style={{ animationDuration: "7s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-1/3 w-[460px] h-[460px] rounded-full bg-accent-cyan/10 blur-[130px] animate-pulse"
        style={{ animationDuration: "9s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-32 w-[420px] h-[420px] rounded-full bg-accent-violet/10 blur-[120px] animate-pulse"
        style={{ animationDuration: "8s" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typographic & Editorial Storytelling */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
              Every song has a story{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                beyond its sound.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans max-w-xl">
              Discover the musical structure hiding beneath the melodies you love.
              Explore rhythm, harmony, instruments, tonal relationships, and the musical
              ideas that bring songs to life.
            </p>

            {/* Editorial Feature Highlights */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-white/10 backdrop-blur-md transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-accent-violet/5 group">
                <div className="flex items-center gap-2 text-accent-violet text-sm font-semibold mb-1 group-hover:text-accent-violet-light transition-colors">
                  <WaveformIcon size={16} />
                  <span>Hidden Architecture</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Uncover structural cadence, chord transitions, and modal anchors hidden inside familiar hooks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-white/10 backdrop-blur-md transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-accent-cyan/5 group">
                <div className="flex items-center gap-2 text-accent-cyan text-sm font-semibold mb-1 group-hover:text-cyan-300 transition-colors">
                  <ActivityIcon size={16} />
                  <span>Sonic Anatomy</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Decompose complex musical mixes into separate frequency overtones, rhythm grooves, and harmonic layers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Music Player Component (styled like the attached design) */}
          <div className="lg:col-span-5 xl:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
              {/* Backlight glow */}
              <div
                className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-accent-violet/25 via-indigo-500/15 to-accent-cyan/20 blur-3xl rounded-[44px] -z-10"
                aria-hidden="true"
              />

              {/* Music Player Card */}
              <div className="relative rounded-[36px] bg-[#0c0e18]/90 border border-white/10 p-7 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(139,92,246,0.12)]">
                {/* Circular Album Artwork */}
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden mx-auto shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(139,92,246,0.2)] border-2 border-white/10 select-none">
                  <Image
                    src="/images/starboy-cover.jpg"
                    alt="Starboy - The Weeknd"
                    fill
                    priority
                    sizes="(max-width: 640px) 192px, 208px"
                    className={`object-cover object-center transition-all duration-700 ${
                      isPlaying ? "scale-105" : "scale-100"
                    }`}
                  />
                  {/* Subtle vinyl gloss sheen */}
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

                  {/* Pulsing playing indicator ring */}
                  {isPlaying && (
                    <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent-violet/40 animate-ping opacity-30" />
                  )}
                </div>

                {/* Track Title and Artist */}
                <div className="text-center mt-6 select-none">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Starboy
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1 font-medium">
                    The Weeknd ft. Daft Punk
                  </p>
                </div>

                {/* Scrubber / Timeline Bar */}
                <div className="mt-6 select-none">
                  {/* Progress slider track */}
                  <div
                    ref={progressBarRef}
                    onClick={handleSeek}
                    className="h-1.5 w-full bg-white/15 hover:bg-white/20 rounded-full cursor-pointer relative group/bar transition-colors"
                    role="progressbar"
                    aria-valuenow={currentTime}
                    aria-valuemin={0}
                    aria-valuemax={TOTAL_DURATION}
                    aria-label="Track progress"
                  >
                    {/* Filled bar */}
                    <div
                      className="h-full bg-white rounded-full relative"
                      style={{ width: `${progressPercent}%` }}
                    >
                      {/* Scrubber knob handle */}
                      <span className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3.5 h-3.5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.5)] group-hover/bar:scale-125 transition-transform" />
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-text-muted mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(TOTAL_DURATION)}</span>
                  </div>
                </div>

                {/* Player Controls (Shuffle, Prev, Big Play/Pause Circle, Next, Repeat) */}
                <div className="flex items-center justify-between px-1 mt-6 select-none">
                  {/* Shuffle */}
                  <button
                    type="button"
                    onClick={() => setIsShuffle((prev) => !prev)}
                    aria-label="Toggle shuffle"
                    className={`p-2 transition-colors cursor-pointer ${
                      isShuffle
                        ? "text-accent-violet drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    <ShuffleIcon size={18} />
                  </button>

                  {/* Previous */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous track"
                    className="p-2 text-text-secondary hover:text-white transition-colors cursor-pointer active:scale-90"
                  >
                    <SkipBackIcon size={20} />
                  </button>

                  {/* Big Elevated Circular Play/Pause Button */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause track" : "Play track"}
                    className="w-14 h-14 rounded-full bg-white text-[#090a0f] flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} className="ml-0.5" />}
                  </button>

                  {/* Next */}
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next track"
                    className="p-2 text-text-secondary hover:text-white transition-colors cursor-pointer active:scale-90"
                  >
                    <SkipForwardIcon size={20} />
                  </button>

                  {/* Repeat */}
                  <button
                    type="button"
                    onClick={() => setIsRepeat((prev) => !prev)}
                    aria-label="Toggle repeat"
                    className={`p-2 transition-colors cursor-pointer ${
                      isRepeat
                        ? "text-accent-violet drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    <RepeatIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
