"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TheoryBookIcon, ArrowRightIcon } from "@/components/ui/Icons";

export function LearnPreviewSection() {
  const [selectedTopic, setSelectedTopic] = useState(1);

  const topics = [
    {
      id: 0,
      title: "Notes & Intervals",
      summary: "Understand semitone distances, frequency ratios, and harmonic tension.",
      tag: "Foundation",
      previewNote: "Interval Ratio: 3:2 (Perfect 5th)",
      visualization: (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>Interval Consonance Spectrum</span>
            <span className="text-accent-cyan">Perfect Fifth (7 Semitones)</span>
          </div>
          <div className="h-14 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between px-6 relative">
            <div className="flex flex-col items-center">
              <span className="h-4 w-4 rounded-full bg-accent-violet border-2 border-white" />
              <span className="font-mono text-xs text-white mt-1">C4 (Root)</span>
            </div>
            <div className="flex-1 mx-4 h-0.5 bg-gradient-to-r from-accent-violet via-accent-cyan to-accent-cyan relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] text-accent-cyan bg-[#0a0c14] px-1.5 border border-white/10 rounded">
                7 Semitones • 3:2 Ratio
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-4 w-4 rounded-full bg-accent-cyan border-2 border-white" />
              <span className="font-mono text-xs text-white mt-1">G4 (5th)</span>
            </div>
          </div>
          <p className="text-xs text-text-muted leading-relaxed font-sans">
            The foundation of all musical harmony begins with the overtone relationship between intervals.
          </p>
        </div>
      ),
    },
    {
      id: 1,
      title: "Scales & Modes",
      summary: "Master the 7 diatonic modes and how each creates a distinct sonic emotion.",
      tag: "Modal Color",
      previewNote: "Dorian Mode: W-H-W-W-W-H-W",
      visualization: (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>Dorian Mode Scale Degrees</span>
            <span className="text-accent-violet-light">Natural 6th Raised Degree</span>
          </div>
          {/* Piano Keyboard Scale Voicing */}
          <div className="flex items-end justify-center gap-1 h-20 bg-black/60 p-2.5 rounded-xl border border-white/10">
            {[
              { note: "D", inScale: true, deg: "1" },
              { note: "E", inScale: true, deg: "2" },
              { note: "F", inScale: true, deg: "♭3" },
              { note: "G", inScale: true, deg: "4" },
              { note: "A", inScale: true, deg: "5" },
              { note: "B", inScale: true, deg: "6", highlight: true },
              { note: "C", inScale: true, deg: "♭7" },
              { note: "D", inScale: true, deg: "8" },
            ].map((k, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-lg flex flex-col justify-end items-center pb-2 text-[10px] font-mono transition-all ${
                  k.highlight
                    ? "bg-accent-cyan text-black font-bold h-full shadow-md shadow-accent-cyan/40"
                    : k.inScale
                    ? "bg-white text-black font-semibold h-full"
                    : "bg-white/20 text-text-muted h-3/4"
                }`}
              >
                <span>{k.note}</span>
                <span className="text-[8px] opacity-75">{k.deg}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted leading-relaxed font-sans">
            The Dorian mode combines the solemn depth of minor with the bright hope of a raised natural 6th.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "Chords & Harmony",
      summary: "Explore chord structures, extended 7ths, inversions, and voice leading.",
      tag: "Harmony",
      previewNote: "Extended Voicing: Maj9 (1-3-5-7-9)",
      visualization: (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>Harmonic Vertical Stack</span>
            <span className="text-purple-300">Cmaj9 Harmonic Layering</span>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center font-mono text-xs">
            {[
              { deg: "Root", note: "C", color: "bg-purple-900/40 border-purple-500/40 text-white" },
              { deg: "3rd", note: "E", color: "bg-indigo-900/40 border-indigo-500/40 text-white" },
              { deg: "5th", note: "G", color: "bg-cyan-900/40 border-cyan-500/40 text-white" },
              { deg: "7th", note: "B", color: "bg-purple-800/40 border-purple-400/40 text-purple-200" },
              { deg: "9th", note: "D", color: "bg-cyan-800/40 border-cyan-400/40 text-cyan-200" },
            ].map((chord, idx) => (
              <div key={idx} className={`p-3 rounded-xl border ${chord.color} flex flex-col justify-between h-16`}>
                <span className="text-[10px] text-text-muted">{chord.deg}</span>
                <span className="font-bold text-sm">{chord.note}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted leading-relaxed font-sans">
            Stacking intervals in thirds creates rich emotional coloration from simple triads to lush 9th chords.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: "Rhythm & Time Signatures",
      summary: "Understand meter, subdivisions, syncopation, and compound time.",
      tag: "Meter",
      previewNote: "Compound Time: 6/8 (Two dotted beats)",
      visualization: (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>Meter Comparison</span>
            <span className="text-accent-cyan">4/4 vs 6/8 Feel</span>
          </div>
          <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-white">4/4 (Duple Subdivision)</span>
              <span className="text-text-muted">1 & 2 & 3 & 4 &</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`flex-1 h-3 rounded ${i % 2 === 0 ? "bg-accent-violet" : "bg-white/20"}`} />
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono pt-2">
              <span className="text-white">6/8 (Triple Subdivision)</span>
              <span className="text-text-muted">1 2 3 • 4 5 6</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`flex-1 h-3 rounded ${i === 0 || i === 3 ? "bg-accent-cyan" : "bg-white/20"}`} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Melody & Musical Phrasing",
      summary: "Learn how melodic contours, motifs, and call-and-response build memorability.",
      tag: "Phrasing",
      previewNote: "Antecedent & Consequent Architecture",
      visualization: (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>Phrasing Arc</span>
            <span className="text-accent-violet-light">Call (Tension) & Response (Resolution)</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
              <span className="text-purple-300 font-semibold block mb-1">Antecedent (Question)</span>
              <span className="text-text-muted text-[11px]">Rises in pitch, leaves open harmonic tension on the dominant.</span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
              <span className="text-cyan-300 font-semibold block mb-1">Consequent (Answer)</span>
              <span className="text-text-muted text-[11px]">Descends smoothly, resolving home to the tonic degree.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Musical Structure",
      summary: "Discover verse-chorus architecture, bridges, and cadence resolutions.",
      tag: "Form",
      previewNote: "Cadence Types: Authentic, Plagal, Deceptive",
      visualization: (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>Standard Pop & Classical Form</span>
            <span className="text-white">Dynamic Journey</span>
          </div>
          <div className="flex items-center gap-1.5 text-center font-mono text-[10px]">
            <div className="flex-1 py-2 rounded-lg bg-white/5 border border-white/5">Intro</div>
            <div className="flex-1 py-2 rounded-lg bg-indigo-900/30 border border-indigo-500/20 text-indigo-300">Verse</div>
            <div className="flex-1 py-2 rounded-lg bg-purple-900/40 border border-purple-500/30 text-white font-bold">Chorus</div>
            <div className="flex-1 py-2 rounded-lg bg-indigo-900/30 border border-indigo-500/20 text-indigo-300">Verse</div>
            <div className="flex-1 py-2 rounded-lg bg-cyan-900/40 border border-cyan-500/30 text-cyan-200">Bridge</div>
            <div className="flex-1 py-2 rounded-lg bg-purple-900/40 border border-purple-500/30 text-white font-bold">Chorus</div>
            <div className="flex-1 py-2 rounded-lg bg-white/5 border border-white/5">Outro</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <Badge variant="violet" size="md" className="mb-4">
            <TheoryBookIcon size={13} className="text-accent-violet" />
            <span>Theory Learning Hub</span>
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
            Understand the language{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              of music.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Learn music theory through clear explanations, visual demonstrations, guided
            lessons, and examples connected to the music you already love.
          </p>
        </div>

        {/* Interactive Theory Experience Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Topic Selectors Column */}
          <div className="lg:col-span-5 flex flex-col space-y-2.5">
            {topics.map((t) => {
              const isSelected = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTopic(t.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "border-accent-violet/50 bg-[#121422] shadow-xl shadow-accent-violet/10"
                      : "border-white/5 bg-[#0a0b12]/50 hover:bg-[#0d0f1a] hover:border-white/10"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-sm font-semibold text-white group-hover:text-accent-violet-light transition-colors">
                        {t.title}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                        {t.tag}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-1">
                      {t.summary}
                    </p>
                  </div>
                  <div
                    className={`h-2 w-2 rounded-full shrink-0 transition-all ${
                      isSelected ? "bg-accent-violet ring-4 ring-accent-violet/20" : "bg-white/10"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Interactive Learning Visualizer Stage */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0c0d16]/95 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Top Stage Header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-accent-violet/15 border border-accent-violet/30 flex items-center justify-center text-accent-violet">
                    <TheoryBookIcon size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider block">
                      Visual Demonstration
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">
                      {topics[selectedTopic].title}
                    </h3>
                  </div>
                </div>

                <span className="font-mono text-xs text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1 rounded-full">
                  Interactive Preview
                </span>
              </div>

              {/* Dynamic Demonstration Body */}
              <div className="py-8">
                {topics[selectedTopic].visualization}
              </div>
            </div>

            {/* Bottom Guidance & Call to Action */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-text-muted font-sans max-w-sm">
                Structured progressive learning connected directly to audio examples.
              </div>

              <Button
                href="/learn"
                variant="primary"
                size="md"
                icon={<ArrowRightIcon size={16} />}
                iconPosition="right"
              >
                Explore the learning hub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
