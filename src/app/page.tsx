import React from "react";
import { HeroSection } from "@/components/features/home/HeroSection";
import { IntroductionSection } from "@/components/features/home/IntroductionSection";
import { MusicalDnaSection } from "@/components/features/home/MusicalDnaSection";
import { HowItWorksSection } from "@/components/features/home/HowItWorksSection";
import { LearnPreviewSection } from "@/components/features/home/LearnPreviewSection";
import { AudioLabPreviewSection } from "@/components/features/home/AudioLabPreviewSection";
import { FinalCtaSection } from "@/components/features/home/FinalCtaSection";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* 1. Hero Section (Locked Phase 2 Component - Completely Untouched) */}
      <HeroSection />

      {/* 2. Section 1: Introduction / What Keynote Does */}
      <IntroductionSection />

      {/* 3. Section 2: Musical DNA / What You Can Discover */}
      <MusicalDnaSection />

      {/* 4. Section 3: How It Works */}
      <HowItWorksSection />

      {/* 5. Section 4: Learn Music */}
      <LearnPreviewSection />

      {/* 6. Section 5: Audio Lab */}
      <AudioLabPreviewSection />

      {/* 7. Section 6: Final Call to Action */}
      <FinalCtaSection />
    </main>
  );
}
