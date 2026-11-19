import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { WaveformIcon, TheoryBookIcon, SlidersIcon, ArrowRightIcon, CheckCircleIcon } from "@/components/ui/Icons";
import { PLATFORM_FEATURES } from "@/lib/constants";
import { FeatureCardData } from "@/types";

export function FeaturePreview() {
  const getFeatureIcon = (iconType: FeatureCardData["icon"]) => {
    switch (iconType) {
      case "analysis":
        return <WaveformIcon size={24} className="text-accent-violet" />;
      case "theory":
        return <TheoryBookIcon size={24} className="text-accent-cyan" />;
      case "audio-lab":
        return <SlidersIcon size={24} className="text-accent-violet-light" />;
      default:
        return <WaveformIcon size={24} className="text-accent-violet" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 border-t border-border/60 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Platform Capabilities"
          badgeVariant="violet"
          title="Deconstruct, understand, and master music"
          description="Keynote bridges the gap between passive listening and musical comprehension through structured analysis, interactive theory, and specialized tools."
        />

        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_FEATURES.map((feature) => (
            <Card
              key={feature.id}
              variant="interactive"
              padding="lg"
              className="flex flex-col justify-between group"
            >
              <div>
                {/* Card Header with Icon & Status */}
                <div className="flex items-center justify-between pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated border border-border group-hover:border-accent-violet/30 transition-colors">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  <Badge variant="warning" size="sm">
                    {feature.status}
                  </Badge>
                </div>

                {/* Title & Tagline */}
                <h3 className="font-display text-xl font-bold text-text-primary mt-2">
                  {feature.title}
                </h3>
                <p className="text-xs font-mono text-accent-cyan mt-1">
                  {feature.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed mt-3">
                  {feature.description}
                </p>

                {/* Capability Bullet Points */}
                <div className="mt-6 space-y-2.5 pt-4 border-t border-border/50">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                    Planned Capabilities
                  </span>
                  <ul className="space-y-2" role="list">
                    {feature.capabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                        <CheckCircleIcon size={14} className="text-accent-violet shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Placeholder Route Link */}
              <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-mono text-text-muted">
                  Route: {feature.targetRoute}
                </span>
                <Link
                  href={feature.targetRoute}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-violet-light hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet rounded"
                >
                  <span>Explore Shell</span>
                  <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
