"use client";

import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  SlidersIcon,
  MetronomeIcon,
  PianoKeysIcon,
  WaveformIcon,
  ActivityIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

export function AudioLabPreviewSection() {
  // Interactive Tap Tempo State for BPM Tapper preview
  const [bpm, setBpm] = useState<number>(128);
  const [tapCount, setTapCount] = useState<number>(0);
  const tapTimesRef = useRef<number[]>([]);

  const handleTap = () => {
    const now = performance.now();
    const times = tapTimesRef.current;
    times.push(now);

    // Keep only last 4 taps
    if (times.length > 4) {
      times.shift();
    }

    if (times.length > 1) {
      const intervals: number[] = [];
      for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgInterval > 0) {
        const calculatedBpm = Math.round(60000 / avgInterval);
        if (calculatedBpm >= 40 && calculatedBpm <= 260) {
          setBpm(calculatedBpm);
        }
      }
    }
    setTapCount((c) => c + 1);
  };

  const tools = [
    {
      id: "bpm-tapper",
      title: "BPM Tapper",
      category: "Tempo Measurement",
      icon: <MetronomeIcon size={20} className="text-accent-violet" />,
      description: "Tap along to any song in real time to calculate exact tempo with millisecond averaging.",
      visual: (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-text-muted">Calculated Tempo</span>
            <span className="text-2xl font-mono font-bold text-white">{bpm} <span className="text-xs text-text-muted font-normal">BPM</span></span>
            <span className="text-[10px] text-accent-violet-light font-mono mt-0.5">
              {tapCount > 0 ? `${tapCount} taps registered` : "Tap button to test"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleTap}
            className="px-4 py-2.5 rounded-xl bg-accent-violet hover:bg-accent-violet-deep text-white font-mono text-xs font-semibold shadow-lg shadow-accent-violet/20 active:scale-95 transition-all cursor-pointer"
          >
            TAP TEMPO
          </button>
        </div>
      ),
    },
    {
      id: "metronome",
      title: "Metronome",
      category: "Timekeeping",
      icon: <ActivityIcon size={20} className="text-accent-cyan" />,
      description: "Visual timekeeping with customizable subdivision clicks, swing accents, and time signatures.",
      visual: (
        <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((beat) => (
              <div
                key={beat}
                className={`flex flex-col items-center gap-1 ${
                  beat === 1 ? "text-accent-cyan" : "text-text-muted"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    beat === 1
                      ? "bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan shadow-sm shadow-accent-cyan/30"
                      : "bg-white/5 border border-white/5 text-text-muted"
                  }`}
                >
                  {beat}
                </div>
                <span className="text-[9px] font-mono">{beat === 1 ? "Down" : "Beat"}</span>
              </div>
            ))}
          </div>
          <span className="font-mono text-xs text-text-muted bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
            4/4 • Allegro
          </span>
        </div>
      ),
    },
    {
      id: "pitch-explorer",
      title: "Pitch & Note Explorer",
      category: "Tonal Frequency",
      icon: <PianoKeysIcon size={20} className="text-purple-400" />,
      description: "Calibrate and explore frequency to note conversions from sub-bass to hypersonic overtones.",
      visual: (
        <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-[10px] text-text-muted block">Pitch Reference</span>
            <span className="text-white font-bold">A4 = 440.00 Hz</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="px-2 py-1 rounded-lg bg-white/5 text-text-muted border border-white/5">432 Hz</span>
            <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">440 Hz</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 text-text-muted border border-white/5">444 Hz</span>
          </div>
        </div>
      ),
    },
    {
      id: "scale-explorer",
      title: "Scale Explorer",
      category: "Modal Theory",
      icon: <SlidersIcon size={20} className="text-indigo-400" />,
      description: "Interactive diatonic, pentatonic, and exotic scale generator with instant step formulas.",
      visual: (
        <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold">Minor Pentatonic</span>
            <span className="text-indigo-400">1 - ♭3 - 4 - 5 - ♭7</span>
          </div>
          <div className="flex gap-1">
            {["R", "m3", "P4", "P5", "m7"].map((degree, i) => (
              <span
                key={i}
                className="flex-1 py-1 text-center font-mono text-[10px] bg-indigo-900/30 text-indigo-300 rounded border border-indigo-500/20"
              >
                {degree}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "interval-explorer",
      title: "Interval Explorer",
      category: "Acoustic Distance",
      icon: <WaveformIcon size={20} className="text-cyan-400" />,
      description: "Calculate semitone spans, inverted intervals, and psychoacoustic consonance rankings.",
      visual: (
        <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-[10px] text-text-muted block">Selected Interval</span>
            <span className="text-cyan-300 font-bold">Tritone (Dim 5th)</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-muted block">Distance</span>
            <span className="text-white font-bold">6 Semitones</span>
          </div>
        </div>
      ),
    },
    {
      id: "waveform-visualizer",
      title: "Waveform Visualizer",
      category: "Real-time FFT",
      icon: <WaveformIcon size={20} className="text-emerald-400" />,
      description: "High-definition time-domain waveforms and spectral overtone waterfalls for visual inspection.",
      visual: (
        <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between">
          <div className="flex items-end gap-1 h-8 flex-1 mr-4">
            {[30, 50, 75, 95, 60, 45, 80, 100, 70, 50, 85, 65, 40, 60, 90, 75, 45, 30].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/40 to-emerald-400"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
            FFT Active
          </span>
        </div>
      ),
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#07080e]/60 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <Badge variant="cyan" size="md" className="mb-4">
            <SlidersIcon size={13} className="text-accent-cyan" />
            <span>Interactive Tools</span>
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
            Explore music{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              beyond the song.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Experiment with musical ideas, discover relationships between notes, and
            explore sound through interactive tools.
          </p>
        </div>

        {/* 6 Specialized Audio Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-3xl border border-white/10 bg-[#0c0d16]/90 p-6 flex flex-col justify-between shadow-xl hover:border-white/20 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform duration-200">
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                    {tool.category}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-1.5">
                  {tool.title}
                </h3>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                  {tool.description}
                </p>
              </div>

              {/* Interactive Tool Preview Widget */}
              <div className="mt-auto">
                {tool.visual}
              </div>
            </div>
          ))}
        </div>

        {/* Section CTA Button */}
        <div className="mt-14 flex justify-center">
          <Button
            href="/audio-lab"
            variant="secondary"
            size="lg"
            icon={<ArrowRightIcon size={18} />}
            iconPosition="right"
          >
            Explore Audio Lab
          </Button>
        </div>
      </div>
    </section>
  );
}
