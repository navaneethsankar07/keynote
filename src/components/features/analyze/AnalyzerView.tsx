"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, RefreshCw, Trash2, Sparkles, AlertCircle } from "lucide-react";
import {
  AnalyzerMode,
  AnalyzerWorkflowState,
  AudioFileMetadata,
  AudioValidationError,
  FullSongAnalysisResult,
  AnalysisProgress,
} from "@/types/analyzer";
import { validateAndDecodeAudio } from "@/lib/audio-utils";
import { analyzeSongAudio } from "@/lib/audio-analysis";
import { AnalyzerHeader } from "./AnalyzerHeader";
import { InputModeSelector } from "./InputModeSelector";
import { AudioDropzone } from "./AudioDropzone";
import { SongSearchPlaceholder } from "./SongSearchPlaceholder";
import { AudioWaveformPlayer } from "./AudioWaveformPlayer";
import { AudioMetadataCard } from "./AudioMetadataCard";
import { AnalysisProgressView } from "./AnalysisProgressView";
import { RhythmAnalysisView } from "./RhythmAnalysisView";

export function AnalyzerView() {
  const [mode, setMode] = useState<AnalyzerMode>("upload");
  const [workflowState, setWorkflowState] = useState<AnalyzerWorkflowState>("idle");
  const [metadata, setMetadata] = useState<AudioFileMetadata | null>(null);
  const [validationError, setValidationError] = useState<AudioValidationError | null>(null);

  // Analysis state
  const [analysisResult, setAnalysisResult] = useState<FullSongAnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Keep track of current objectUrl for clean memory release
  const activeObjectUrlRef = useRef<string | null>(null);
  const hiddenReplaceInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (activeObjectUrlRef.current) {
        URL.revokeObjectURL(activeObjectUrlRef.current);
      }
    };
  }, []);

  const handleFileSelected = async (file: File) => {
    setValidationError(null);
    setAnalysisError(null);
    setAnalysisResult(null);
    setAnalysisProgress(null);
    setWorkflowState("loading");

    // Clean up previous URL if any
    if (activeObjectUrlRef.current) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }

    const result = await validateAndDecodeAudio(file);

    if (result.success) {
      activeObjectUrlRef.current = result.metadata.objectUrl;
      setMetadata(result.metadata);
      setWorkflowState("ready");
    } else {
      setMetadata(null);
      setValidationError(result.error);
      setWorkflowState("idle");
    }
  };

  const handleRemoveFile = () => {
    if (activeObjectUrlRef.current) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }
    setMetadata(null);
    setValidationError(null);
    setAnalysisResult(null);
    setAnalysisProgress(null);
    setAnalysisError(null);
    setWorkflowState("idle");
  };

  const handleTriggerReplace = () => {
    hiddenReplaceInputRef.current?.click();
  };

  const handleReplaceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
    if (hiddenReplaceInputRef.current) {
      hiddenReplaceInputRef.current.value = "";
    }
  };

  const handleStartAnalysis = async () => {
    if (!metadata || workflowState === "analyzing") return;

    setWorkflowState("analyzing");
    setAnalysisError(null);

    try {
      let buffer = metadata.audioBuffer;

      // Decode on-the-fly if buffer was not retained
      if (!buffer) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtxClass();
        const arrayBuffer = await metadata.file.arrayBuffer();
        buffer = await ctx.decodeAudioData(arrayBuffer);
        ctx.close().catch(() => {});
      }

      const result = await analyzeSongAudio(buffer, {
        onProgress: (p) => setAnalysisProgress(p),
      });

      setAnalysisResult(result);
      setWorkflowState("analyzed");
    } catch (err) {
      console.error("Audio analysis failed:", err);
      setAnalysisError(
        err instanceof Error
          ? err.message
          : "Song acoustic and tonal analysis could not be completed on this file."
      );
      setWorkflowState("ready");
    }
  };

  const handleBackToPreview = () => {
    if (metadata) {
      setWorkflowState("ready");
    }
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col justify-center pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-[450px] w-[800px] max-w-[120vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.08)_0%,rgba(6,182,212,0.02)_50%,transparent_70%)] blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Hidden File Input for Direct Replacement */}
      <input
        ref={hiddenReplaceInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.webm"
        className="hidden"
        onChange={handleReplaceInputChange}
      />

      <div className="w-full max-w-4xl mx-auto space-y-10 sm:space-y-12 my-auto">
        {/* Page Header (always visible for brand continuity) */}
        <AnalyzerHeader />

        {/* Input Mode Selector (Upload vs Search, only shown before analysis starts) */}
        {workflowState !== "analyzed" && workflowState !== "analyzing" && (
          <InputModeSelector
            mode={mode}
            onModeChange={(newMode) => {
              setMode(newMode);
              setValidationError(null);
            }}
            disabled={workflowState === "loading"}
          />
        )}

        {/* View Switching Logic based on mode & state */}
        {mode === "search" && workflowState !== "analyzed" && workflowState !== "analyzing" ? (
          <SongSearchPlaceholder onSwitchToUpload={() => setMode("upload")} />
        ) : workflowState === "analyzing" && metadata ? (
          <AnalysisProgressView progress={analysisProgress} fileName={metadata.fileName} />
        ) : workflowState === "analyzed" && metadata && analysisResult ? (
          <RhythmAnalysisView
            metadata={metadata}
            analysis={analysisResult}
            onBackToPreview={handleBackToPreview}
            onReanalyze={handleStartAnalysis}
            onReset={handleRemoveFile}
          />
        ) : metadata && workflowState === "ready" ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Analysis Error Notification if previous run failed */}
            {analysisError && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 flex items-start gap-3 shadow-lg">
                <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-rose-300">
                    Analysis Incomplete
                  </h4>
                  <p className="text-xs text-rose-200/80 leading-relaxed">
                    {analysisError}
                  </p>
                </div>
              </div>
            )}

            {/* Interactive Waveform & Player */}
            <AudioWaveformPlayer key={metadata.objectUrl} metadata={metadata} />

            {/* Extracted Metadata Card */}
            <AudioMetadataCard metadata={metadata} />

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleTriggerReplace}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <RefreshCw size={15} />
                  <span>Replace Audio</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>Remove</span>
                </button>
              </div>

              {/* Prominent CTA to Initiate Analysis Workflow */}
              <button
                type="button"
                onClick={handleStartAnalysis}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-accent-violet hover:bg-accent-violet-deep text-white font-medium text-sm transition-all duration-200 shadow-[0_0_25px_rgba(139,92,246,0.4)] active:scale-[0.98] cursor-pointer"
              >
                <Sparkles size={17} className="text-accent-cyan" />
                <span>Analyze this song</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <AudioDropzone
            onFileSelected={handleFileSelected}
            isLoading={workflowState === "loading"}
            error={validationError}
            onClearError={() => setValidationError(null)}
          />
        )}
      </div>
    </div>
  );
}
