import {
  RhythmAnalysisResult,
  AnalysisProgress,
  FullSongAnalysisResult,
  ChordAnalysisResult,
  MelodyAnalysisResult,
} from "./types";
import { extractOnsetEnvelope } from "./onset-detection";
import { estimateTempo } from "./tempo";
import { trackBeats } from "./beat-tracking";
import { extractChromaDistribution } from "./chroma";
import { detectMusicalKey } from "./key-detection";
import { detectChords } from "./chord-detection";
import { analyzeChordProgression } from "./progression-analysis";
import { extractMelody } from "./melody-extraction";

export * from "./types";
export * from "./onset-detection";
export * from "./tempo";
export * from "./beat-tracking";
export * from "./chroma";
export * from "./key-detection";
export * from "./chord-templates";
export * from "./chord-detection";
export * from "./progression-analysis";
export * from "./melody-extraction";

export interface AnalyzeSongOptions {
  onProgress?: (progress: AnalysisProgress) => void;
  minBpm?: number;
  maxBpm?: number;
}

export type AnalyzeRhythmOptions = AnalyzeSongOptions;

/**
 * Executes full client-side Rhythm, Tempo, Key, Scale, and Chord Timeline analysis on an AudioBuffer.
 * Processes in non-blocking async micro-tasks to preserve 60fps UI responsiveness.
 */
export async function analyzeSongAudio(
  audioBuffer: AudioBuffer,
  options: AnalyzeSongOptions = {}
): Promise<FullSongAnalysisResult> {
  const startTime = performance.now();
  const { onProgress, minBpm = 50, maxBpm = 220 } = options;

  const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));

  // 1. Validation
  const duration = audioBuffer.duration;
  if (!duration || duration < 0.5) {
    throw new Error(
      "Audio file duration is too short for analysis (minimum 0.5 second required)."
    );
  }

  // Stage 1: Onset Detection (Rhythm)
  onProgress?.({
    stage: "onset_detection",
    message: "Extracting acoustic onset strength envelope...",
    percent: 15,
  });
  await yieldToMain();

  const onsets = extractOnsetEnvelope(audioBuffer);

  if (onsets.isSilent) {
    throw new Error(
      "Audio signal contains negligible energy or complete silence. No rhythm, tonality, or chords detected."
    );
  }

  // Stage 2: Periodicity & Tempo Estimation (Rhythm)
  onProgress?.({
    stage: "tempo_estimation",
    message: "Calculating periodicity and estimating tempo (BPM)...",
    percent: 32,
  });
  await yieldToMain();

  const tempo = estimateTempo(onsets, { minBpm, maxBpm });

  // Stage 3: Beat Tracking & Grid Alignment (Rhythm)
  onProgress?.({
    stage: "beat_tracking",
    message: "Tracking and aligning beat grid with acoustic transients...",
    percent: 48,
  });
  await yieldToMain();

  const beats = trackBeats(onsets, tempo.beatIntervalSeconds);

  // Stage 4: Chroma / Pitch-Class Distribution (Tonality)
  onProgress?.({
    stage: "chroma_extraction",
    message: "Extracting 12-pitch-class chromatic energy spectrum...",
    percent: 64,
  });
  await yieldToMain();

  const chroma = extractChromaDistribution(audioBuffer);

  // Stage 5: Musical Key & Scale Detection (Tonality)
  onProgress?.({
    stage: "key_detection",
    message: "Evaluating tonal key profiles & diatonic scale correlation...",
    percent: 78,
  });
  await yieldToMain();

  const key = detectMusicalKey(chroma);

  // Stage 6: Chord Detection & Chord Timeline Segmentation (Harmony)
  onProgress?.({
    stage: "chord_detection",
    message: "Analyzing chord roots, qualities, and timeline...",
    percent: 74,
  });
  await yieldToMain();

  let chords: ChordAnalysisResult;
  try {
    chords = await detectChords(audioBuffer, {
      onProgress: (pct, msg) => {
        onProgress?.({
          stage: "chord_detection",
          message: msg,
          percent: 68 + Math.round((pct / 100) * 10),
        });
      },
    });
  } catch (chordErr) {
    console.error("Chord analysis error, proceeding with fallback:", chordErr);
    chords = {
      segments: [],
      uniqueChords: [],
      dominantChord: null,
      totalSegments: 0,
      averageConfidence: 0,
      harmonicRhythmBps: 0,
      analysisSummary: "Chord detection could not be resolved on this audio signal.",
    };
  }

  // Stage 7: Chord Progression & Harmonic Analysis (Phase 8)
  onProgress?.({
    stage: "progression_analysis",
    message: "Identifying recurring progressions, transitions & Roman numerals...",
    percent: 84,
  });
  await yieldToMain();

  const progression = analyzeChordProgression(chords.segments, key, duration);

  // Stage 8: Melody & Melodic Line Extraction (Phase 9)
  onProgress?.({
    stage: "melody_extraction",
    message: "Extracting dominant melody notes, contour & recurring motifs...",
    percent: 92,
  });
  await yieldToMain();

  let melody: MelodyAnalysisResult;
  try {
    melody = await extractMelody(audioBuffer, {
      onProgress: (pct, msg) => {
        onProgress?.({
          stage: "melody_extraction",
          message: msg,
          percent: 85 + Math.round((pct / 100) * 12),
        });
      },
    });
  } catch (melodyErr) {
    console.error("Melody extraction error, proceeding with fallback:", melodyErr);
    melody = {
      notes: [],
      totalNotes: 0,
      contour: {
        ascendingCount: 0,
        descendingCount: 0,
        repeatedCount: 0,
        ascendingPercentage: 0,
        descendingPercentage: 0,
        repeatedPercentage: 0,
        directionChanges: 0,
        stepwiseCount: 0,
        leapCount: 0,
        stepwisePercentage: 0,
        leapPercentage: 0,
        localPeaksCount: 0,
        localValleysCount: 0,
        dominantDirection: "N/A",
        contourType: "Unvoiced / Diffuse",
        contourPoints: [],
      },
      intervalStats: {
        mostCommonInterval: "N/A",
        mostCommonSemitones: 0,
        averageIntervalSemitones: 0,
        stepwiseRatio: 0,
        leapRatio: 0,
        distribution: [],
        totalIntervals: 0,
      },
      range: null,
      motifs: [],
      averageConfidence: 0,
      voicedDurationSec: 0,
      voicedPercentage: 0,
      isReliable: false,
      analysisSummary: "Melodic extraction encountered an error or polyphonic ambiguity on this signal.",
    };
  }

  // Stage 9: Complete
  onProgress?.({
    stage: "complete",
    message: "Full acoustic, tonal, harmonic, and melodic analysis complete.",
    percent: 100,
  });
  await yieldToMain();

  const endTime = performance.now();

  return {
    tempo,
    beats,
    key,
    chords,
    progression,
    melody,
    duration,
    analyzedSampleCount: audioBuffer.length,
    analysisTimeMs: Math.round(endTime - startTime),
  };
}

/**
 * Preserved for backwards compatibility with Phase 5 callers.
 */
export async function analyzeRhythmAndTempo(
  audioBuffer: AudioBuffer,
  options: AnalyzeRhythmOptions = {}
): Promise<RhythmAnalysisResult> {
  const full = await analyzeSongAudio(audioBuffer, options);
  return {
    tempo: full.tempo,
    beats: full.beats,
    duration: full.duration,
    analyzedSampleCount: full.analyzedSampleCount,
    analysisTimeMs: full.analysisTimeMs,
  };
}
