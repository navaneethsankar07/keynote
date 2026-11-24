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
  melody: MelodyAnalysisResult;
  structure: StructureAnalysisResult;
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
  | "melody_extraction"
  | "structure_analysis"
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

/* ==========================================================================
   Melody & Melodic Analysis Types (Phase 9)
   ========================================================================== */

export type MelodyConfidenceLevel = "high" | "moderate" | "low" | "uncertain";

export interface MelodyNoteEvent {
  id: string;
  midiPitch: number; // Rounded MIDI pitch number, e.g. 60 for C4
  frequency: number; // Hz, e.g. 261.63
  noteName: PitchClass; // Pitch class without octave, e.g. "C"
  octave: number; // Octave number, e.g. 4
  name: string; // Full name with octave, e.g. "C4"
  startTime: number; // Start timestamp in seconds
  endTime: number; // End timestamp in seconds
  duration: number; // Duration in seconds
  confidence: number; // 0.0 - 1.0 calibrated algorithmic score
  confidenceLevel: MelodyConfidenceLevel;
  isUncertain: boolean;
  salienceScore: number; // Peak harmonic salience strength
}

export type MelodicDirection = "ascending" | "descending" | "repeated";

export interface MelodicContourPoint {
  time: number;
  midiPitch: number;
  noteName: string;
}

export interface MelodicContour {
  ascendingCount: number;
  descendingCount: number;
  repeatedCount: number;
  ascendingPercentage: number; // 0 - 100%
  descendingPercentage: number; // 0 - 100%
  repeatedPercentage: number; // 0 - 100%
  directionChanges: number; // Number of contour inflection turns
  stepwiseCount: number;
  leapCount: number;
  stepwisePercentage: number; // 0 - 100% (1-2 semitones)
  leapPercentage: number; // 0 - 100% (>= 3 semitones)
  localPeaksCount: number;
  localValleysCount: number;
  dominantDirection: string; // e.g. "Ascending", "Descending", "Balanced"
  contourType: string; // e.g. "Arch-shaped", "Wave-like / Undulating", "Stepwise Progression", "Ascending Climb", "Cascading Descent"
  contourPoints: MelodicContourPoint[];
}

export interface IntervalOccurrence {
  semitones: number;
  name: string; // e.g. "Unison", "Minor 2nd", "Major 2nd", etc.
  count: number;
  percentage: number; // 0 - 100%
  isStepwise: boolean;
  isLeap: boolean;
}

export interface MelodicIntervalStats {
  mostCommonInterval: string;
  mostCommonSemitones: number;
  averageIntervalSemitones: number;
  stepwiseRatio: number; // 0.0 - 1.0
  leapRatio: number; // 0.0 - 1.0
  distribution: IntervalOccurrence[];
  totalIntervals: number;
}

export interface MelodicRange {
  lowestNote: {
    midiPitch: number;
    name: string;
    frequency: number;
  };
  highestNote: {
    midiPitch: number;
    name: string;
    frequency: number;
  };
  semitoneRange: number;
  octaveSpan: number;
  spanDescription: string; // e.g. "2 octaves, 4 semitones (28 semitones)"
}

export interface MelodyMotifOccurrence {
  startTime: number;
  endTime: number;
  duration: number;
  startIndex: number;
  endIndex: number;
}

export interface MelodyMotif {
  id: string;
  notes: string[]; // e.g. ["E4", "G4", "A4"]
  intervalDeltas: number[]; // e.g. [+3, +2]
  patternName: string; // e.g. "E4 → G4 → A4"
  repetitionCount: number;
  occurrences: MelodyMotifOccurrence[];
  isTransposed: boolean;
  confidence: number; // 0.0 - 1.0
}

export interface MelodyAnalysisResult {
  notes: MelodyNoteEvent[];
  totalNotes: number;
  contour: MelodicContour;
  intervalStats: MelodicIntervalStats;
  range: MelodicRange | null;
  motifs: MelodyMotif[];
  averageConfidence: number; // 0.0 - 1.0
  voicedDurationSec: number;
  voicedPercentage: number; // 0 - 100%
  isReliable: boolean;
  analysisSummary: string;
}

/* ==========================================================================
   Musical Structure & Song Section Analysis Types (Phase 10)
   ========================================================================== */

export type SectionBoundaryConfidence = "high" | "moderate" | "low";

export interface SectionCharacteristics {
  energy: number; // 0.0 - 1.0 (mean RMS energy)
  energyDynamics: number; // 0.0 - 1.0 (energy standard deviation / variance)
  spectralBrightness: number; // 0.0 - 1.0 (mean spectral centroid)
  rhythmicDensity: number; // onsets per second
  harmonicPurity: number; // 0.0 - 1.0 (clarity of tonal chroma)
  dominantChord: string | null;
  chordChangeCount: number;
  melodicVoicingRatio: number; // 0 - 100% (percentage with detected melody)
  melodyPitchRange: string | null; // e.g. "C4 - G5"
}

export interface SongSection {
  id: string; // e.g. "section-1-0.00"
  label: string; // e.g. "Intro", "Verse 1", "Chorus 1", "Section A"
  neutralLabel: string; // e.g. "Section A", "Section B"
  group: string; // e.g. "A", "B", "C", "Intro", "Outro"
  groupIndex: number; // 0, 1, 2...
  occurrenceIndex: number; // 1, 2, 3... (e.g. Verse 1 vs Verse 2)
  startTime: number; // in seconds
  endTime: number; // in seconds
  duration: number; // in seconds
  boundaryConfidence: SectionBoundaryConfidence;
  confidenceScore: number; // 0.0 - 1.0
  characteristics: SectionCharacteristics;
  similarSectionIds: string[]; // IDs of sections with high feature similarity
  isRepeated: boolean;
  color: string; // Hex color for consistent visualization
}

export interface SectionGroup {
  group: string; // e.g. "A", "B", "Intro", "Outro"
  label: string; // e.g. "Chorus (Group B)" or "Section A"
  sectionIds: string[];
  occurrenceCount: number;
  totalDuration: number;
  averageEnergy: number;
  color: string;
}

export interface SectionTransition {
  fromSectionId: string;
  toSectionId: string;
  time: number;
  transitionType: "abrupt" | "gradual";
  changeMagnitude: number; // 0.0 - 1.0
}

export interface StructureSimilarityPair {
  sectionAId: string;
  sectionBId: string;
  similarity: number; // 0.0 - 1.0
  similarityType: "near_identical" | "strong" | "partial" | "weak";
}

export interface StructureAnalysisResult {
  sections: SongSection[];
  totalSections: number;
  sectionSequence: string[]; // e.g. ["Intro", "Verse 1", "Chorus 1", "Verse 2", "Chorus 2", "Outro"]
  formSummary: string; // e.g. "Intro → A → B → A → B → Outro"
  neutralFormSummary: string; // e.g. "A → B → A → C → B"
  groups: SectionGroup[];
  transitions: SectionTransition[];
  similarityPairs: StructureSimilarityPair[];
  hasIntro: boolean;
  hasOutro: boolean;
  structuralComplexity: "minimal" | "standard" | "complex" | "through_composed";
  analysisSummary: string;
}
