"use client";

import React from "react";
import { UploadCloud, Search } from "lucide-react";
import { AnalyzerMode } from "@/types/analyzer";

interface InputModeSelectorProps {
  mode: AnalyzerMode;
  onModeChange: (mode: AnalyzerMode) => void;
  disabled?: boolean;
}

export function InputModeSelector({
  mode,
  onModeChange,
  disabled = false,
}: InputModeSelectorProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex p-1.5 rounded-2xl bg-surface-elevated/70 border border-white/10 backdrop-blur-md shadow-inner">
        <button
          type="button"
          onClick={() => onModeChange("upload")}
          disabled={disabled}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 select-none ${
            mode === "upload"
              ? "bg-accent-violet text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]"
              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
          }`}
        >
          <UploadCloud size={16} />
          <span>Upload Audio</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("search")}
          disabled={disabled}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 select-none ${
            mode === "search"
              ? "bg-accent-violet text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]"
              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
          }`}
        >
          <Search size={16} />
          <span>Search Song</span>
        </button>
      </div>
    </div>
  );
}

