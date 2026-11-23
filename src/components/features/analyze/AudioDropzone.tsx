"use client";

import React, { useRef, useState, useCallback } from "react";
import { UploadCloud, FileAudio, AlertCircle, Loader2 } from "lucide-react";
import { MAX_AUDIO_FILE_SIZE_MB, SUPPORTED_AUDIO_EXTENSIONS } from "@/lib/audio-utils";
import { AudioValidationError } from "@/types/analyzer";

interface AudioDropzoneProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  error: AudioValidationError | null;
  onClearError?: () => void;
}

export function AudioDropzone({
  onFileSelected,
  isLoading,
  error,
  onClearError,
}: AudioDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(true);
    }
  }, [isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (isLoading) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFileSelected(files[0]);
      }
    },
    [isLoading, onFileSelected]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
    // Reset file input so selecting the same file again triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerFilePicker = () => {
    if (!isLoading && fileInputRef.current) {
      onClearError?.();
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.webm"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />

      {/* Main Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleTriggerFilePicker}
        className={`relative group rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden select-none ${
          isDragging
            ? "border-accent-cyan bg-accent-cyan/10 scale-[1.01] shadow-[0_0_30px_rgba(6,182,212,0.25)]"
            : error
            ? "border-rose-500/50 bg-rose-950/10 hover:border-rose-400"
            : "border-white/15 bg-surface/60 hover:border-accent-violet/60 hover:bg-surface-elevated/70 shadow-2xl"
        }`}
      >
        {/* Subtle Ambient Radial Highlight on Hover */}
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
          {/* Center Graphic Icon */}
          <div
            className={`h-20 w-20 rounded-3xl flex items-center justify-center transition-all duration-300 ${
              isLoading
                ? "bg-accent-violet/20 text-accent-violet animate-pulse"
                : isDragging
                ? "bg-accent-cyan text-white scale-110 shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                : "bg-surface-elevated text-accent-violet border border-white/10 group-hover:border-accent-violet/40 group-hover:scale-105 shadow-xl"
            }`}
          >
            {isLoading ? (
              <Loader2 size={36} className="animate-spin text-accent-cyan" />
            ) : isDragging ? (
              <UploadCloud size={38} className="animate-bounce" />
            ) : (
              <FileAudio size={36} />
            )}
          </div>

          {/* Primary Text Instructions */}
          <div className="space-y-2">
            <h3 className="font-display text-lg sm:text-xl font-bold text-text-primary">
              {isLoading
                ? "Reading and decoding audio signal..."
                : isDragging
                ? "Release to ingest audio file"
                : "Drop your audio here"}
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
              {isLoading
                ? "Sampling frequency peaks and constructing waveform telemetry."
                : "or choose a file from your device to begin local audio analysis."}
            </p>
          </div>

          {/* Supported Format Pills */}
          {!isLoading && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
              {SUPPORTED_AUDIO_EXTENSIONS.map((ext) => (
                <span
                  key={ext}
                  className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono font-medium text-text-secondary uppercase"
                >
                  {ext.replace(".", "")}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-md bg-accent-violet/15 border border-accent-violet/30 text-[11px] font-mono font-medium text-accent-violet">
                Up to {MAX_AUDIO_FILE_SIZE_MB}MB
              </span>
            </div>
          )}

          {/* Click to Select Button */}
          {!isLoading && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-violet/15 group-hover:bg-accent-violet text-text-primary text-xs sm:text-sm font-medium border border-accent-violet/30 transition-all duration-300">
                <UploadCloud size={16} />
                <span>Choose Audio File</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Error Banner */}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 flex items-start gap-3.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="text-xs sm:text-sm font-semibold text-rose-300">{error.title}</h4>
            <p className="text-xs text-rose-200/80 leading-relaxed">{error.message}</p>
          </div>
          <button
            type="button"
            onClick={handleTriggerFilePicker}
            className="text-xs font-mono text-rose-300 underline hover:text-white px-2 py-1 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

