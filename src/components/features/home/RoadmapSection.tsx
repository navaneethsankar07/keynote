import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CheckCircleIcon, ClockIcon } from "@/components/ui/Icons";
import { ROADMAP_PHASES } from "@/lib/constants";

export function RoadmapSection() {
  return (
    <section className="py-16 sm:py-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Platform Roadmap"
          badgeVariant="cyan"
          title="Under active development"
          description="Keynote is being built in disciplined engineering phases. Phase 1 establishes the architecture and design tokens; future phases will introduce the audio processing engine and interactive learning modules."
        />

        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {ROADMAP_PHASES.map((phase) => {
            const isCurrent = phase.status === "current";
            const isUpcoming = phase.status === "upcoming";

            return (
              <Card
                key={phase.phase}
                variant={isCurrent ? "elevated" : "surface"}
                padding="md"
                className={`relative flex flex-col justify-between ${
                  isCurrent
                    ? "border-accent-violet/40 shadow-lg shadow-accent-violet/5"
                    : "border-border/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <span className="font-mono text-xs font-semibold text-accent-cyan uppercase tracking-wider">
                      {phase.phase}
                    </span>
                    {isCurrent ? (
                      <Badge variant="violet" size="sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-violet animate-pulse" />
                        In Progress
                      </Badge>
                    ) : isUpcoming ? (
                      <Badge variant="warning" size="sm">
                        <ClockIcon size={12} />
                        Next Phase
                      </Badge>
                    ) : (
                      <Badge variant="outline" size="sm">
                        Planned
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-text-primary mt-1">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mt-2">
                    {phase.description}
                  </p>

                  <ul className="mt-6 space-y-2.5 pt-4 border-t border-border/60" role="list">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                        {isCurrent ? (
                          <CheckCircleIcon size={14} className="text-accent-violet shrink-0 mt-0.5" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-text-muted shrink-0 mt-1.5 ml-1" />
                        )}
                        <span className={isCurrent ? "text-text-primary" : ""}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 text-[11px] font-mono text-text-muted">
                  {isCurrent
                    ? "Currently completing verification"
                    : "Specifications in review"}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
