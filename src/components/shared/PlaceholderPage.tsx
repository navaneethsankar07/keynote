import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowLeftIcon, CheckCircleIcon, SparklesIcon } from "@/components/ui/Icons";

interface PlaceholderPageProps {
  title: string;
  badge: string;
  badgeVariant?: "default" | "violet" | "cyan" | "warning";
  phase: string;
  description: string;
  icon: React.ReactNode;
  plannedFeatures: string[];
  mockPreview?: React.ReactNode;
}

export function PlaceholderPage({
  title,
  badge,
  badgeVariant = "violet",
  phase,
  description,
  icon,
  plannedFeatures,
  mockPreview,
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Breadcrumb / Back Link */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet rounded"
        >
          <ArrowLeftIcon size={14} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Header */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-elevated border border-border text-accent-violet shadow-md">
            {icon}
          </div>
          <Badge variant={badgeVariant} size="md">
            {badge}
          </Badge>
          <span className="text-xs font-mono text-text-muted">
            Target: {phase}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
          {title}
        </h1>

        <p className="max-w-3xl text-base sm:text-lg text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>

      {/* Interactive Mock Preview / Wireframe Shell */}
      {mockPreview && (
        <div className="mt-10 rounded-2xl border border-border/80 bg-surface/60 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent-violet/60" />
              <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                Architectural Preview
              </span>
            </div>
            <span className="text-xs font-mono text-accent-cyan">
              Mock Shell • No Audio Engine Loaded
            </span>
          </div>
          {mockPreview}
        </div>
      )}

      {/* Planned Capabilities Grid */}
      <div className="mt-12">
        <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
          <SparklesIcon size={18} className="text-accent-violet" />
          Planned Capabilities for {title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plannedFeatures.map((feature, idx) => (
            <Card key={idx} variant="surface" padding="sm" className="flex items-start gap-3">
              <CheckCircleIcon size={18} className="text-accent-cyan shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-primary">{feature}</p>
                <p className="text-xs text-text-muted mt-1">Scheduled for upcoming platform releases</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation actions */}
      <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-text-muted font-mono">
          Phase 1 Foundation is currently active. Functional processing begins in Phase 2.
        </p>
        <div className="flex items-center gap-3">
          <Button href="/" variant="secondary" size="md">
            Return to Home
          </Button>
          <Button href="/analyze" variant="outline" size="md">
            View Analyzer Shell
          </Button>
        </div>
      </div>
    </div>
  );
}
