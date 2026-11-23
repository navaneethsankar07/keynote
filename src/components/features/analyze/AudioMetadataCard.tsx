import React from "react";
import { Clock, HardDrive, FileAudio, Radio, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { AudioFileMetadata } from "@/types/analyzer";

interface AudioMetadataCardProps {
  metadata: AudioFileMetadata;
}

export function AudioMetadataCard({ metadata }: AudioMetadataCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-accent-violet/15 text-accent-violet flex items-center justify-center border border-accent-violet/25">
            <FileAudio size={16} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Source File Information
            </span>
            <h4 className="font-display text-sm font-bold text-text-primary truncate max-w-xs sm:max-w-md">
              {metadata.fileName}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
          <CheckCircle2 size={13} />
          <span>Validated Audio</span>
        </div>
      </div>

      {/* Real Extracted Technical Properties Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/5 bg-surface-elevated/60 p-3">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Clock size={13} />
            <span className="text-[10px] font-mono uppercase">Duration</span>
          </div>
          <p className="font-mono text-sm sm:text-base font-bold text-text-primary">
            {metadata.durationFormatted}
          </p>
          <span className="text-[10px] font-mono text-text-muted">
            {metadata.duration.toFixed(1)} seconds
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-surface-elevated/60 p-3">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <HardDrive size={13} />
            <span className="text-[10px] font-mono uppercase">File Size</span>
          </div>
          <p className="font-mono text-sm sm:text-base font-bold text-text-primary">
            {metadata.fileSizeFormatted}
          </p>
          <span className="text-[10px] font-mono text-text-muted">
            {metadata.fileSizeBytes.toLocaleString()} bytes
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-surface-elevated/60 p-3">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Radio size={13} />
            <span className="text-[10px] font-mono uppercase">Sample Rate</span>
          </div>
          <p className="font-mono text-sm sm:text-base font-bold text-text-primary">
            {metadata.sampleRate ? `${(metadata.sampleRate / 1000).toFixed(1)} kHz` : "Standard"}
          </p>
          <span className="text-[10px] font-mono text-text-muted">
            {metadata.sampleRate ? `${metadata.sampleRate} Hz` : "Browser decoded"}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-surface-elevated/60 p-3">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <SlidersHorizontal size={13} />
            <span className="text-[10px] font-mono uppercase">Channels</span>
          </div>
          <p className="font-mono text-sm sm:text-base font-bold text-text-primary">
            {metadata.channels === 1 ? "Mono (1ch)" : metadata.channels === 2 ? "Stereo (2ch)" : "Multi-channel"}
          </p>
          <span className="text-[10px] font-mono text-text-muted truncate block">
            {metadata.fileType || "Audio Stream"}
          </span>
        </div>
      </div>
    </div>
  );
}

