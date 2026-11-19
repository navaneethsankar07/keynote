import React from "react";
import Link from "next/link";
import { KeynoteLogo } from "@/components/ui/Icons";
import { SITE_CONFIG, FOOTER_NAV_LINKS } from "@/lib/constants";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full border-t border-border/80 bg-surface/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet rounded-lg"
              aria-label={`${SITE_CONFIG.name} Home`}
            >
              <KeynoteLogo size={28} />
              <span className="font-display text-xl font-bold tracking-wider text-text-primary">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="max-w-sm text-sm text-text-secondary leading-relaxed">
              {SITE_CONFIG.tagline} {SITE_CONFIG.description}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center rounded-full bg-accent-violet/10 px-2.5 py-1 text-xs font-mono text-accent-violet-light border border-accent-violet/25">
                Phase 2: Animated Hero
              </span>
              <span className="inline-flex items-center rounded-full bg-surface-elevated px-2.5 py-1 text-xs font-mono text-text-muted border border-border">
                App Router
              </span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-text-primary">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5" role="list">
              {FOOTER_NAV_LINKS.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-text-primary">
              Song Analysis
            </h4>
            <ul className="mt-4 space-y-2.5" role="list">
              {FOOTER_NAV_LINKS.analysis.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-text-primary">
              Music Theory
            </h4>
            <ul className="mt-4 space-y-2.5" role="list">
              {FOOTER_NAV_LINKS.theory.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {currentYear} {SITE_CONFIG.name}. Built for music discovery and analysis.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono">Tempo • Harmony • Scale • Rhythm</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
