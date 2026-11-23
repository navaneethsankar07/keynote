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
    tubes: ["#8b5cf6", "#06b6d4", "#7c3aed"],
    lights: ["#6d28d9", "#06b6d4", "#a855f7", "#38bdf8"],
    staffColor: "#8b5cf6",
    accentColor: "#06b6d4",
  },
  {
    name: "Dorian",
    tubes: ["#06b6d4", "#6366f1", "#a855f7"],
    lights: ["#0891b2", "#818cf8", "#22d3ee", "#c084fc"],
    staffColor: "#38bdf8",
    accentColor: "#6366f1",
  },
  {
    name: "Lydian",
    tubes: ["#22d3ee", "#a78bfa", "#f43f5e"],
    lights: ["#38bdf8", "#8b5cf6", "#fb7185", "#67e8f9"],
    staffColor: "#60a5fa",
    accentColor: "#f43f5e",
  },
  {
    name: "Mixolydian",
    tubes: ["#f59e0b", "#8b5cf6", "#06b6d4"],
    lights: ["#d97706", "#7c3aed", "#22d3ee", "#fcd34d"],
    staffColor: "#f59e0b",
    accentColor: "#7c3aed",
  },
];

