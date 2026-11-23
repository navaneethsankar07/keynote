import { NavItem, FeatureCardData, RoadmapMilestone } from "@/types";

export const SITE_CONFIG = {
  name: "KEYNOTE",
  tagline: "Discover the music behind the music.",
  description:
    "An AI-powered music discovery, analysis, and learning platform designed to help music lovers and musicians deconstruct tempo, rhythm, harmony, keys, and musical ideas.",
  version: "0.2.0 (Phase 2)",
  links: {
    github: "https://github.com/navaneethsankar07/keynote",
  },
} as const;

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Analyze", href: "/analyze" },
  { label: "Learn", href: "/learn" },
  { label: "Audio Lab", href: "/audio-lab" },
];

export const FOOTER_NAV_LINKS = {
  platform: [
    { label: "Overview", href: "/" },
    { label: "Song Analyzer", href: "/analyze" },
    { label: "Theory Library", href: "/learn" },
    { label: "Audio Lab", href: "/audio-lab" },
  ],
  analysis: [
    { label: "Tempo & BPM", href: "/analyze" },
    { label: "Key & Scale Detection", href: "/analyze" },
    { label: "Chord Progressions", href: "/analyze" },
    { label: "Time Signatures", href: "/analyze" },
  ],
  theory: [
    { label: "Scale Modes", href: "/learn" },
    { label: "Harmonic Function", href: "/learn" },
    { label: "Cadences", href: "/learn" },
    { label: "Rhythm & Meter", href: "/learn" },
  ],
};

export const PLATFORM_FEATURES: FeatureCardData[] = [
  {
    id: "song-analysis",
    title: "Song Analysis",
    tagline: "Deconstruct songs into musical DNA",
    description:
      "Understand what makes your favorite songs move. Uncover accurate tempo, harmonic keys, scale degrees, and chord progressions with deep musical insight.",
    icon: "analysis",
    status: "Planned",
    targetRoute: "/analyze",
    capabilities: [
      "BPM & micro-timing detection",
      "Key, mode, and scale identification",
      "Chord progression mapping & Roman numeral analysis",
      "Time signature & meter shifts",
    ],
  },
  {
    id: "music-theory",
    title: "Music Theory",
    tagline: "Interactive concept learning",
    description:
      "Bridge the gap between listening and theory. Connect auditory moments in real songs to structural harmony, chord substitutions, and modal colors.",
    icon: "theory",
    status: "Planned",
    targetRoute: "/learn",
    capabilities: [
      "Interactive circle of fifths & modal wheels",
      "Visual chord breakdown & voice leading",
      "Curated theory lessons tied to real songs",
      "Ear-training & harmonic tension guides",
    ],
  },
  {
    id: "audio-tools",
    title: "Audio Tools",
    tagline: "Hands-on musical laboratory",
    description:
      "Interactive instruments and utility visualizers built for musicians, producers, and curious listeners looking to test musical ideas.",
    icon: "audio-lab",
    status: "Planned",
    targetRoute: "/audio-lab",
    capabilities: [
      "Frequency spectrum & overtone visualizer",
      "Real-time BPM tap & rhythm metronome",
      "Virtual piano key pitch mapper",
      "Waveform scrubber with transient markers",
    ],
  },
];

export const ROADMAP_PHASES: RoadmapMilestone[] = [
  {
    phase: "Phase 1",
    title: "Foundation & Design System",
    description:
      "Core architecture, responsive dark-theme design tokens, accessible layouts, and route shells.",
    status: "current",
    items: [
      "Next.js App Router & TypeScript setup",
      "Tailwind CSS dark-first design tokens",
      "Responsive navigation & footer architecture",
      "Landing page shell with musical visualizer",
      "Route placeholders for core workspaces",
    ],
  },
  {
    phase: "Phase 2",
    title: "Audio Engine & Song Analyzer",
    description:
      "Signal processing integration, client-side audio decoding, and musical element detection.",
    status: "upcoming",
    items: [
      "Audio file ingestion & waveform visualization",
      "BPM and beat-grid tracking engine",
      "Tonal key and scale degree detector",
      "Chord progression inference pipeline",
    ],
  },
  {
    phase: "Phase 3",
    title: "Theory Hub & Interactive Lab",
    description:
      "Educational modules, video lessons, and interactive musical utility tools.",
    status: "planned",
    items: [
      "Interactive piano roll & fretboard explorer",
      "Real-time frequency spectrogram",
      "Structured music theory learning curriculum",
      "Multi-song comparative analysis",
    ],
  },
];

export interface HarmonicPalette {
  name: string;
  tubes: string[];
  lights: string[];
  staffColor: string;
  accentColor: string;
}

export const HARMONIC_PALETTES: HarmonicPalette[] = [
  {
    name: "Aeolian",
    tubes: ["#7c3aed", "#0891b2", "#6366f1"],
    lights: ["#5b21b6", "#0e7490", "#6d28d9", "#0284c7"],
    staffColor: "#7c3aed",
    accentColor: "#0891b2",
  },
  {
    name: "Dorian",
    tubes: ["#0284c7", "#4f46e5", "#7c3aed"],
    lights: ["#0369a1", "#4338ca", "#0891b2", "#5b21b6"],
    staffColor: "#0284c7",
    accentColor: "#4f46e5",
  },
  {
    name: "Lydian",
    tubes: ["#0ea5e9", "#7c3aed", "#be123c"],
    lights: ["#0284c7", "#5b21b6", "#9f1239", "#38bdf8"],
    staffColor: "#0ea5e9",
    accentColor: "#be123c",
  },
  {
    name: "Mixolydian",
    tubes: ["#b45309", "#7c3aed", "#0284c7"],
    lights: ["#92400e", "#5b21b6", "#0891b2", "#b45309"],
    staffColor: "#b45309",
    accentColor: "#7c3aed",
  },
];

