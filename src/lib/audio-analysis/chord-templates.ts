/**
 * Chord Pitch-Class Templates & Harmonic Modeling
 *
 * Implements 12-dimensional pitch-class templates for all 9 supported chord qualities:
 * - Major (root, maj 3rd, 5th)
 * - Minor (root, min 3rd, 5th)
 * - Diminished (root, min 3rd, dim 5th)
 * - Augmented (root, maj 3rd, aug 5th)
 * - Suspended 2 (root, maj 2nd, 5th)
 * - Suspended 4 (root, perf 4th, 5th)
 * - Dominant 7 (root, maj 3rd, 5th, min 7th)
 * - Major 7 (root, maj 3rd, 5th, maj 7th)
 * - Minor 7 (root, min 3rd, 5th, min 7th)
 *
 * Uses L2-unit-vector normalization to prevent 4-note 7th chords from falsely
 * overriding 3-note triads when the 7th degree is not present in the audio.
 */

import { PITCH_CLASSES, PitchClass, ChordQuality } from "./types";

export interface ChordTemplate {
  rootIdx: number;
  root: PitchClass;
  quality: ChordQuality;
  displayName: string;
  shortName: string;
  intervals: number[];
  vector: Float32Array; // 12-dimensional normalized unit vector
}

export const CHORD_QUALITY_DEFINITIONS: {
  quality: ChordQuality;
  suffix: string;
  label: string;
  intervals: number[];
  weights: number[]; // Relative energy weights for [root, 3rd/2nd/4th, 5th, (7th)]
}[] = [
  {
    quality: "major",
    suffix: "",
    label: "Major",
    intervals: [0, 4, 7],
    weights: [1.1, 0.9, 1.0],
  },
  {
    quality: "minor",
    suffix: "m",
    label: "Minor",
    intervals: [0, 3, 7],
    weights: [1.1, 0.9, 1.0],
  },
  {
    quality: "diminished",
    suffix: "dim",
    label: "Diminished",
    intervals: [0, 3, 6],
    weights: [1.1, 0.9, 0.95],
  },
  {
    quality: "augmented",
    suffix: "aug",
    label: "Augmented",
    intervals: [0, 4, 8],
    weights: [1.1, 0.9, 0.9],
  },
  {
    quality: "sus2",
    suffix: "sus2",
    label: "Suspended 2",
    intervals: [0, 2, 7],
    weights: [1.1, 0.85, 1.0],
  },
  {
    quality: "sus4",
    suffix: "sus4",
    label: "Suspended 4",
    intervals: [0, 5, 7],
    weights: [1.1, 0.85, 1.0],
  },
  {
    quality: "dom7",
    suffix: "7",
    label: "Dominant 7",
    intervals: [0, 4, 7, 10],
    weights: [1.0, 0.85, 0.9, 0.85],
  },
  {
    quality: "maj7",
    suffix: "maj7",
    label: "Major 7",
    intervals: [0, 4, 7, 11],
    weights: [1.0, 0.85, 0.9, 0.85],
  },
  {
    quality: "min7",
    suffix: "m7",
    label: "Minor 7",
    intervals: [0, 3, 7, 10],
    weights: [1.0, 0.85, 0.9, 0.85],
  },
];

/**
 * Builds all 108 chord templates (12 roots x 9 qualities).
 */
export function buildChordTemplates(): ChordTemplate[] {
  const templates: ChordTemplate[] = [];

  for (let rootIdx = 0; rootIdx < 12; rootIdx++) {
    const rootName = PITCH_CLASSES[rootIdx];

    for (const def of CHORD_QUALITY_DEFINITIONS) {
      const vec = new Float32Array(12);
      let normSq = 0;

      for (let i = 0; i < def.intervals.length; i++) {
        const interval = def.intervals[i];
        const pitchClass = (rootIdx + interval) % 12;
        const weight = def.weights[i];
        vec[pitchClass] = weight;
        normSq += weight * weight;
      }

      // Normalize to unit length (L2 norm)
      const invNorm = normSq > 0 ? 1 / Math.sqrt(normSq) : 1;
      for (let p = 0; p < 12; p++) {
        vec[p] *= invNorm;
      }

      const shortName = `${rootName}${def.suffix}`;
      const displayName = `${rootName} ${def.label}`;

      templates.push({
        rootIdx,
        root: rootName,
        quality: def.quality,
        displayName,
        shortName,
        intervals: def.intervals.map((int) => (rootIdx + int) % 12),
        vector: vec,
      });
    }
  }

  return templates;
}

// Pre-instantiated singleton templates for high performance
export const ALL_CHORD_TEMPLATES = buildChordTemplates();

