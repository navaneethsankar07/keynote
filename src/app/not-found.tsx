import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, WaveformIcon } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-elevated border border-border text-accent-violet">
          <WaveformIcon size={32} />
        </div>
        
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-cyan">
            404 Error • Out of Tune
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mt-2">
            Frequency Not Found
          </h1>
          <p className="text-sm text-text-secondary mt-3 leading-relaxed">
            The musical route you are looking for does not exist or has been moved to another harmonic position.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Button href="/" variant="primary" size="md" icon={<ArrowLeftIcon size={16} />} iconPosition="left">
            Return to Keynote Home
          </Button>
        </div>
      </div>
    </div>
  );
}
