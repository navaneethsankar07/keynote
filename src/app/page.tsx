import React from "react";
import { HeroSection } from "@/components/features/home/HeroSection";
import { FeaturePreview } from "@/components/features/home/FeaturePreview";
import { RoadmapSection } from "@/components/features/home/RoadmapSection";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <FeaturePreview />
      <RoadmapSection />
    </main>
  );
}
