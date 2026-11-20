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
      <HeroSection />
      <IntroductionSection />
      <MusicalDnaSection />
      <HowItWorksSection />
      <LearnPreviewSection />
      <AudioLabPreviewSection />
      <FinalCtaSection />
    </main>
  );
}
