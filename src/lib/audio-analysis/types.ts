export type TempoConfidence = "high" | "moderate" | "low";

export interface TempoCandidate {
  bpm: number;
  score: number;
}

export interface TempoAnalysisResult {
  bpm: number;
  confidence: TempoConfidence;
  confidenceScore: number; // 0.0 to 1.0 (derived from peak-to-noise autocorrelation ratio)
  confidenceReason: string;
  alternativeBpm: number | null;
  alternativeLabel: string | null; // e.g. "Half-time candidate" or "Double-time candidate"
  beatIntervalSeconds: number;
}

export interface BeatTrackingResult {
  beatTimestamps: number[]; // Timestamps in seconds of detected beats
  totalBeats: number;
  averageIntervalMs: number;
  regularityScore: number; // 0.0 to 1.0 (1.0 = perfectly steady rhythm, lower = expressive or irregular meter)
  firstBeatOffset: number; // Second timestamp of the first detected beat
}

export interface RhythmAnalysisResult {
  tempo: TempoAnalysisResult;
  beats: BeatTrackingResult;
  duration: number;
  analyzedSampleCount: number;
  analysisTimeMs: number;
}

/* ==========================================================================
   Musical Key & Scale Detection Types (Phase 6)
   ========================================================================== */

export const PITCH_CLASSES = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
] as const;

export const ENHARMONIC_NAMES = [
  "C",
  "C♯ / D♭",
  "D",
  "D♯ / E♭",
  "E",
  "F",
  "F♯ / G♭",
  "G",
  "G♯ / A♭",
  "A",
  "A♯ / B♭",
  "B",
] as const;

export type PitchClass = (typeof PITCH_CLASSES)[number];

export type TonalMode = "Major" | "Minor";

export type KeyConfidence = "high" | "moderate" | "low" | "ambiguous";

export interface KeyCandidate {
  root: PitchClass;
  mode: TonalMode;
  keyName: string; // e.g. "C Major", "A Minor"
  correlation: number; // Pearson r (-1.0 to 1.0)
  scorePercent: number; // Relative confidence percentage (0 to 100)
  relationship?: string; // e.g. "Relative Minor", "Parallel Minor", "Dominant Key"
}

export interface KeyAnalysisResult {
  key: string; // e.g. "C Major", "F♯ Minor"
  root: PitchClass;
  mode: TonalMode;
  confidence: KeyConfidence;
  confidenceScore: number; // 0.0 to 1.0
  confidenceReason: string;
  correlationScore: number; // Pearson correlation coefficient r
  alternativeKeys: KeyCandidate[];
  chromaDistribution: number[]; // 12 normalized values summing to 1.0
  chromaPercentages: number[]; // 12 values scaled 0 to 100 for display
  scaleDegrees: number[]; // Pitch-class indices (0-11) belonging to the detected scale
  explanation: string;
}

export interface FullSongAnalysisResult {
  tempo: TempoAnalysisResult;
  beats: BeatTrackingResult;
  key: KeyAnalysisResult;
  chords: ChordAnalysisResult;
  progression: ProgressionAnalysisResult;
  duration: number;
  analyzedSampleCount: number;
  analysisTimeMs: number;
}

/* ==========================================================================
   Chord Progression & Harmonic Analysis Types (Phase 8)
   ========================================================================== */

export interface HarmonicDegree {
  romanNumeral: string; // e.g. "I", "ii", "iii", "IV", "V", "vi", "vii°", "♭VII"
  scaleDegree: number; // 1 - 7 (or 0 for non-diatonic / chromatic)
  isDiatonic: boolean;
  functionLabel: string; // e.g. "Tonic", "Dominant", "Subdominant", etc.
}

export interface ProgressionOccurrence {
  startTime: number;
  endTime: number;
  duration: number;
  startIndex: number;
  endIndex: number;
}

export interface ProgressionPattern {
  id: string;
  chords: string[]; // e.g. ["C", "G", "Am", "F"]
  romanNumerals: string[] | null; // e.g. ["I", "V", "vi", "IV"]
  patternName: string; // e.g. "C → G → Am → F"
  length: number; // Number of chords in sequence (e.g. 4)
  repetitionCount: number; // Number of times this sequence occurs
  occurrences: ProgressionOccurrence[];
  totalDuration: number;
  averageDuration: number;
  confidence: number; // 0.0 - 1.0
  isDominant: boolean;
}

export interface ChordTransition {
  fromChord: string;
  toChord: string;
  count: number;
  probability: number; // 0.0 - 1.0 (P(toChord | fromChord))
  fromRoman?: string | null;
  toRoman?: string | null;
}

export interface ChordDistributionItem {
  chordName: string;
  romanNumeral: string | null;
  eventCount: number; // Frequency of appearance
  totalDurationSec: number; // Cumulative time in seconds
  percentage: number; // Percentage of analyzed track duration (0 - 100%)
  isDiatonic: boolean;
}

export interface ProgressionAnalysisResult {
  patterns: ProgressionPattern[];
  primaryProgression: ProgressionPattern | null;
  transitions: ChordTransition[];
  distribution: ChordDistributionItem[];
  keyReliable: boolean;
  keyUsed: string | null;
  totalChordChanges: number;
  harmonicSummary: string;
}

export type AnalysisStage =
  | "ingesting"
  | "onset_detection"
  | "tempo_estimation"
  | "beat_tracking"
  | "chroma_extraction"
  | "key_detection"
  | "chord_detection"
  | "progression_analysis"
  | "complete";

export type ChordQuality =
  | "major"
  | "minor"
  | "diminished"
  | "augmented"
  | "sus2"
  | "sus4"
  | "dom7"
  | "maj7"
  | "min7";

export type ChordConfidence = "high" | "moderate" | "low" | "uncertain";

export interface ChordSegment {
  id: string;
  root: PitchClass | null;
  quality: ChordQuality | null;
  name: string; // e.g. "C", "Am", "G7", "Csus4", "N.C."
  startTime: number; // in seconds
  endTime: number; // in seconds
  duration: number; // in seconds
  confidence: number; // 0.0 - 1.0 calibrated algorithmic score
  confidenceLevel: ChordConfidence;
  isUncertain: boolean;
  score: number; // Raw cosine similarity match score
  bassNote?: PitchClass | null;
}

export interface ChordAnalysisResult {
  segments: ChordSegment[];
  uniqueChords: string[];
  dominantChord: string | null;
  totalSegments: number;
  averageConfidence: number; // 0.0 - 1.0
  harmonicRhythmBps: number; // Average chord changes per second
  analysisSummary: string;
}

export interface AnalysisProgress {
  stage: AnalysisStage;
  message: string;
  percent: number;
}
