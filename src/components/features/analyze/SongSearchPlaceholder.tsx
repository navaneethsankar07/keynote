"use client";

import React, { useState } from "react";
import { Search, Music, Info, ArrowRight } from "lucide-react";

interface SongSearchPlaceholderProps {
  onSwitchToUpload: () => void;
}

export function SongSearchPlaceholder({ onSwitchToUpload }: SongSearchPlaceholderProps) {
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (songTitle.trim() || artistName.trim()) {
      setHasAttempted(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="h-10 w-10 rounded-2xl bg-accent-violet/15 text-accent-violet flex items-center justify-center border border-accent-violet/25">
          <Music size={20} />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-text-primary">
            Online Song Catalog Search
          </h3>
          <p className="text-xs font-mono text-text-muted">
            Song Identification & Streaming Audio Retrieval
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
            Song Title
          </label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="e.g. Bohemian Rhapsody, Claire de Lune, Get Lucky"
            className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-white/10 text-text-primary placeholder:text-text-muted/60 text-sm focus:outline-none focus:border-accent-violet focus:ring-1 focus:ring-accent-violet transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
            Artist or Composer
          </label>
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="e.g. Queen, Claude Debussy, Daft Punk"
            className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-white/10 text-text-primary placeholder:text-text-muted/60 text-sm focus:outline-none focus:border-accent-violet focus:ring-1 focus:ring-accent-violet transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-text-primary font-medium text-sm transition-all duration-200 border border-white/10 cursor-pointer active:scale-[0.99]"
        >
          <Search size={16} />
          <span>Search Song Catalog</span>
        </button>
      </form>

      {/* Honest Status Notice */}
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4.5 space-y-3">
        {hasAttempted && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300">
            Search query recorded. Real-time catalog searching is coming in a future phase.
          </div>
        )}
        <div className="flex items-start gap-3">
          <Info size={18} className="text-accent-cyan shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-semibold text-accent-cyan">
              Catalog Search In Development
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Online audio search and rights-cleared stream indexing are scheduled for a future phase.
              Keynote never fakes analysis results or fabricates streaming audio.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-cyan-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-text-muted">
            Ready to explore? Upload any local track from your device.
          </span>
          <button
            type="button"
            onClick={onSwitchToUpload}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-cyan hover:text-white transition-colors cursor-pointer"
          >
            <span>Switch to Upload</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
