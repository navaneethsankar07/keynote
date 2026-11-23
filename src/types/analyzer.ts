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
}

export type AnalyzerMode = "upload" | "search";

export type AnalyzerWorkflowState = "idle" | "loading" | "ready" | "standby";

export interface AudioValidationError {
  title: string;
  message: string;
}

