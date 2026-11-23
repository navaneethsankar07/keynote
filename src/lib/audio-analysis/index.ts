import { RhythmAnalysisResult, AnalysisProgress } from "./types";
import { extractOnsetEnvelope } from "./onset-detection";
import { estimateTempo } from "./tempo";
import { trackBeats } from "./beat-tracking";

export * from "./types";
export * from "./onset-detection";
export * from "./tempo";
export * from "./beat-tracking";

export interface AnalyzeRhythmOptions {
  onProgress?: (progress: AnalysisProgress) => void;
  minBpm?: number;
  maxBpm?: number;
}

/**
 * Executes full client-side Rhythm and Tempo analysis on an AudioBuffer.
 * Processes in non-blocking async micro-tasks to preserve 60fps UI responsiveness.
 */
export async function analyzeRhythmAndTempo(
  audioBuffer: AudioBuffer,
  options: AnalyzeRhythmOptions = {}
): Promise<RhythmAnalysisResult> {
  const startTime = performance.now();
  const { onProgress, minBpm = 50, maxBpm = 220 } = options;

  const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));

  // 1. Validation
  const duration = audioBuffer.duration;
  if (!duration || duration < 1.0) {
    throw new Error("Audio file duration is too short for rhythm analysis (minimum 1.0 second required).");
  }

  // Stage 1: Onset Detection
  onProgress?.({
    stage: "onset_detection",
    message: "Extracting acoustic onset strength envelope...",
    percent: 25,
  });
  await yieldToMain();

  const onsets = extractOnsetEnvelope(audioBuffer);

  if (onsets.isSilent) {
    throw new Error("Audio signal contains negligible energy or complete silence. No rhythm detected.");
  }

  // Stage 2: Periodicity & Tempo Estimation
  onProgress?.({
    stage: "tempo_estimation",
    message: "Calculating periodicity and estimating tempo (BPM)...",
    percent: 60,
  });
  await yieldToMain();

  const tempo = estimateTempo(onsets, { minBpm, maxBpm });

  if (tempo.bpm === 0) {
    throw new Error(tempo.confidenceReason || "Could not detect a stable periodic tempo in the audio.");
  }

  // Stage 3: Beat Tracking & Grid Alignment
  onProgress?.({
    stage: "beat_tracking",
    message: "Tracking and aligning beat grid with acoustic transients...",
    percent: 85,
  });
  await yieldToMain();

  const beats = trackBeats(onsets, tempo.beatIntervalSeconds);

  // Stage 4: Complete
  onProgress?.({
    stage: "complete",
    message: "Rhythm analysis complete.",
    percent: 100,
  });
  await yieldToMain();

  const endTime = performance.now();

  return {
    tempo,
    beats,
    duration,
    analyzedSampleCount: audioBuffer.length,
    analysisTimeMs: Math.round(endTime - startTime),
  };
}
