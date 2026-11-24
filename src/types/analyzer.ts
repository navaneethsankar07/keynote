import {
  RhythmAnalysisResult,
  AnalysisProgress,
  FullSongAnalysisResult,
  KeyAnalysisResult,
  KeyCandidate,
  PitchClass,
  TonalMode,
  KeyConfidence,
  ChordSegment,
  ChordAnalysisResult,
  ChordQuality,
  ChordConfidence,
  ProgressionAnalysisResult,
  ProgressionPattern,
  ProgressionOccurrence,
  ChordTransition,
  ChordDistributionItem,
  HarmonicDegree,
} from "@/lib/audio-analysis/types";

export interface AudioFileMetadata {
  file: File;
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  fileType: string;
  duration: number;
  durationFormatted: string;
  sampleRate?: number;
  channels?: number;
  objectUrl: string;
  peaks: number[];
  audioBuffer?: AudioBuffer;
}

export type AnalyzerMode = "upload" | "search";

export type AnalyzerWorkflowState =
  | "idle"
  | "loading"
  | "ready"
  | "analyzing"
  | "analyzed"
  | "standby";

export interface AudioValidationError {
  title: string;
  message: string;
}

export type {
  RhythmAnalysisResult,
  AnalysisProgress,
  FullSongAnalysisResult,
  KeyAnalysisResult,
  KeyCandidate,
  PitchClass,
  TonalMode,
  KeyConfidence,
  ChordSegment,
  ChordAnalysisResult,
  ChordQuality,
  ChordConfidence,
  ProgressionAnalysisResult,
  ProgressionPattern,
  ProgressionOccurrence,
  ChordTransition,
  ChordDistributionItem,
  HarmonicDegree,
};
