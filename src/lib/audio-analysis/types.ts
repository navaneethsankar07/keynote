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

export type AnalysisStage =
  | "ingesting"
  | "onset_detection"
  | "tempo_estimation"
  | "beat_tracking"
  | "complete";

export interface AnalysisProgress {
  stage: AnalysisStage;
  message: string;
  percent: number;
}
