import React from "react";
import type { Metadata } from "next";
import { AnalyzerView } from "@/components/features/analyze/AnalyzerView";

export const metadata: Metadata = {
  title: "Song Analyzer — Keynote",
  description:
    "Deconstruct recorded audio into musical elements: tempo, key signatures, chord progressions, and rhythm structures.",
};

export default function AnalyzePage() {
  return <AnalyzerView />;
}
