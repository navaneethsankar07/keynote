"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  MetronomeIcon,
  PianoKeysIcon,
  WaveformIcon,
  LayersIcon,
  SlidersIcon,
  ActivityIcon,
} from "@/components/ui/Icons";

export function MusicalDnaSection() {
  const [activeStem, setActiveStem] = useState<string>("vocals");

  const stemLayers = [
    { id: "drums", name: "Drums & Percussion", freq: "30 Hz – 12 kHz", pan: "Center", level: 85, color: "#a78bfa" },
    { id: "bass", name: "Bassline & Sub", freq: "40 Hz – 280 Hz", pan: "Center (Mono)", level: 92, color: "#818cf8" },
    { id: "vocals", name: "Lead & Harmony Vocals", freq: "200 Hz – 8 kHz", pan: "Wide Stereo", level: 96, color: "#22d3ee" },
    { id: "synths", name: "Guitars & Keys", freq: "150 Hz – 14 kHz", pan: "Left / Right Spread", level: 78, color: "#38bdf8" },
  ];

  const structureBlocks = [
    { label: "Intro", bars: "8 bars", energy: 25, color: "from-purple-900/40 to-purple-800/20", border: "border-purple-500/20" },
    { label: "Verse 1", bars: "16 bars", energy: 45, color: "from-indigo-900/40 to-indigo-800/20", border: "border-indigo-500/20" },
    { label: "Pre-Chorus", bars: "8 bars", energy: 65, color: "from-cyan-900/40 to-cyan-800/20", border: "border-cyan-500/20" },
    { label: "Chorus", bars: "16 bars", energy: 95, color: "from-purple-700/50 to-cyan-700/30", border: "border-cyan-400/40" },
    { label: "Verse 2", bars: "16 bars", energy: 50, color: "from-indigo-900/40 to-indigo-800/20", border: "border-indigo-500/20" },
    { label: "Bridge", bars: "8 bars", energy: 75, color: "from-violet-800/40 to-pink-900/20", border: "border-violet-500/30" },
    { label: "Outro", bars: "8 bars", energy: 30, color: "from-purple-950/40 to-background", border: "border-purple-500/20" },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge variant="cyan" size="md" className="mb-4">
            <LayersIcon size={13} className="text-accent-cyan" />
            <span>Musical DNA</span>
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
            What you can discover{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              inside every song.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Every piece of music is an interconnected system of rhythm, harmony, and tone.
            Keynote deconstructs these dimensions into clear, intuitive insights.
          </p>
        </div>

        {/* Bento Grid: 6 Unique Musical Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* 1. RHYTHM (Col-span 7) */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#0c0d16]/90 p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-accent-violet/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-violet/10 border border-accent-violet/20 text-accent-violet">
                    <MetronomeIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">Rhythm</h3>
                    <p className="text-xs text-text-muted">Tempo, meter, and rhythmic feel</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-accent-violet-light bg-accent-violet/10 px-3 py-1 rounded-full border border-accent-violet/20">
                  4/4 Time Signature
                </span>
              </div>

              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                Understand the beat, tempo, time signature, rhythmic feel, and groove of a song.
                Trace how swing, syncopation, and polyrhythms shape the kinetic energy.
              </p>
            </div>

            {/* Illustrative Rhythm Pulse Visualizer */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-2.5">
                <span>124 BPM • Groove Grid</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Locked In Sync
                </span>
              </div>

              {/* 16-Step Beat Grid */}
              <div className="grid grid-cols-16 gap-1 sm:gap-1.5 py-3">
                {Array.from({ length: 16 }).map((_, i) => {
                  const isDownbeat = i % 4 === 0;
                  const isBackbeat = i === 4 || i === 12;
                  const isSyncopated = i === 6 || i === 14;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-full rounded-md transition-all duration-300 ${
                          isDownbeat
                            ? "h-9 bg-accent-violet shadow-sm shadow-accent-violet/40"
                            : isBackbeat
                            ? "h-7 bg-accent-cyan shadow-sm shadow-accent-cyan/30"
                            : isSyncopated
                            ? "h-5 bg-white/40"
                            : "h-3 bg-white/10"
                        }`}
                      />
                      <span className="font-mono text-[9px] text-text-muted select-none">
                        {isDownbeat ? `${i / 4 + 1}` : "•"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. HARMONY (Col-span 5) */}
          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#0c0d16]/90 p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-accent-cyan/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
                    <PianoKeysIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">Harmony</h3>
                    <p className="text-xs text-text-muted">Chords & harmonic movement</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                Explore chords, chord progressions, harmonic relationships, and tonal context.
                Unpack how tension and resolution drive emotional momentum.
              </p>
            </div>

            {/* Illustrative Chord Block Chain */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="font-mono text-xs text-text-muted mb-2.5 flex items-center justify-between">
                <span>Progression Analysis</span>
                <span className="text-accent-cyan">ii⁹ → V¹³ → Imaj⁷</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { roman: "ii⁹", name: "Dm9", quality: "Tension Pre-dominant", color: "border-purple-500/30 bg-purple-500/10" },
                  { roman: "V¹³", name: "G13", quality: "Active Dominant", color: "border-indigo-500/30 bg-indigo-500/10" },
                  { roman: "Imaj⁷", name: "Cmaj7", quality: "Tonal Resolution", color: "border-cyan-500/30 bg-cyan-500/10" },
                ].map((chord, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center ${chord.color}`}
                  >
                    <span className="font-display text-sm font-bold text-white">{chord.name}</span>
                    <span className="font-mono text-[10px] text-text-muted mt-0.5">{chord.roman}</span>
                    <span className="text-[9px] text-text-secondary mt-1">{chord.quality}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. MELODY (Col-span 6) */}
          <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#0c0d14]/90 p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <WaveformIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">Melody</h3>
                    <p className="text-xs text-text-muted">Pitch contours & thematic motifs</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  Vocal Pitch Arc
                </span>
              </div>

              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                Understand melodic movement, pitch relationships, phrasing, and recurring motifs.
                Follow how vocal curves lift across chorus peaks and resolve into verses.
              </p>
            </div>

            {/* Illustrative Pitch Contour Ribbon */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="h-20 w-full relative flex items-center">
                {/* Micro pitch grid lines */}
                <div className="absolute inset-x-0 top-1/4 h-px bg-white/5" />
                <div className="absolute inset-x-0 top-2/4 h-px bg-white/5" />
                <div className="absolute inset-x-0 top-3/4 h-px bg-white/5" />

                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                  <path
                    d="M 10 45 C 50 45, 70 15, 110 20 C 150 25, 170 5, 210 12 C 250 20, 270 35, 290 35"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    className="drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                  />
                  {/* Contour note markers */}
                  {[
                    { cx: 10, cy: 45, label: "E4" },
                    { cx: 110, cy: 20, label: "G4" },
                    { cx: 210, cy: 12, label: "B4" },
                    { cx: 290, cy: 35, label: "A4" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.cx} cy={pt.cy} r="4" fill="#ffffff" />
                      <text x={pt.cx} y={pt.cy - 7} textAnchor="middle" fontSize="9" fill="#c084fc" fontFamily="monospace">
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* 4. TONALITY (Col-span 6) */}
          <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#0c0d14]/90 p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <ActivityIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">Tonality</h3>
                    <p className="text-xs text-text-muted">Key signatures, modes & tonal gravity</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  A Natural Minor
                </span>
              </div>

              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                Explore the musical key, scale, tonal center, and relationship between notes.
                Trace how modal shifts inject subtle color changes into songs.
              </p>
            </div>

            {/* Illustrative Scale Degree Steps Ladder */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-2">
                <span>Scale Degree Formula (Aeolian)</span>
                <span className="text-white">1 - 2 - ♭3 - 4 - 5 - ♭6 - ♭7</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {[
                  { note: "A", deg: "1 (Tonic)", active: true },
                  { note: "B", deg: "2", active: false },
                  { note: "C", deg: "♭3 (Min)", active: true },
                  { note: "D", deg: "4", active: false },
                  { note: "E", deg: "5 (Dom)", active: true },
                  { note: "F", deg: "♭6", active: false },
                  { note: "G", deg: "♭7", active: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`py-2 px-1 rounded-lg border text-xs font-mono transition-all ${
                      item.active
                        ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-bold"
                        : "border-white/5 bg-white/[0.02] text-text-muted"
                    }`}
                  >
                    <div>{item.note}</div>
                    <div className="text-[9px] text-text-muted opacity-80 mt-0.5">{item.deg}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. STRUCTURE (Col-span 12 - Full Width Timeline) */}
          <div className="lg:col-span-12 rounded-3xl border border-white/10 bg-[#0c0d16]/90 p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <LayersIcon size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Structure</h3>
                  <p className="text-xs text-text-muted">Arrangement timeline & energy arcs</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary max-w-xl">
                Discover how a song is organized into sections such as intro, verse, chorus, bridge, and outro.
              </p>
            </div>

            {/* Illustrative Segmented Song Arrangement Map */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-3">
                <span>Arrangement Flow Map</span>
                <span>Total: 80 Bars • 3m 42s</span>
              </div>

              {/* Connected Section Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {structureBlocks.map((block, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border ${block.border} bg-gradient-to-b ${block.color} p-3 flex flex-col justify-between h-24 transition-all duration-200 hover:scale-[1.02]`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-semibold text-white">{block.label}</span>
                      <span className="font-mono text-[10px] text-text-muted">{block.bars}</span>
                    </div>

                    {/* Section Relative Energy Meter */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-text-muted">
                        <span>Energy</span>
                        <span>{block.energy}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                          style={{ width: `${block.energy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. INSTRUMENTS & SOUND (Col-span 12 - Layered Acoustic Stems) */}
          <div className="lg:col-span-12 rounded-3xl border border-white/10 bg-[#0c0d16]/90 p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <SlidersIcon size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Instruments & Sound</h3>
                  <p className="text-xs text-text-muted">Layered acoustic textures & frequency space</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary max-w-xl">
                Explore the instruments, sound layers, textures, and musical elements that contribute to the song.
              </p>
            </div>

            {/* Illustrative Multitrack Stem Layers */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stemLayers.map((stem) => {
                const isSelected = activeStem === stem.id;
                return (
                  <div
                    key={stem.id}
                    onClick={() => setActiveStem(stem.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-accent-cyan/50 bg-accent-cyan/10 shadow-lg shadow-cyan-500/10"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-sm font-semibold text-white">{stem.name}</span>
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: stem.color }}
                      />
                    </div>
                    <div className="font-mono text-xs text-text-muted space-y-1">
                      <div className="flex justify-between">
                        <span>Range:</span>
                        <span className="text-text-secondary">{stem.freq}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Field:</span>
                        <span className="text-text-secondary">{stem.pan}</span>
                      </div>
                    </div>
                    {/* Simulated Level Meter */}
                    <div className="mt-3 h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stem.level}%`,
                          backgroundColor: stem.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
