import React from "react";

export function AnalyzerHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-4">
      {/* Main Headline */}
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
        Explore the DNA of a{" "}
        <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
          song.
        </span>
      </h1>

      {/* Supporting Text */}
      <p className="text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed font-sans max-w-2xl mx-auto">
        Discover the rhythm, harmony, melody, and musical structure behind the songs you love.
      </p>
    </div>
  );
}

