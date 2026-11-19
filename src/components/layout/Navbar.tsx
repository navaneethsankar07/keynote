"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeynoteLogo, MenuIcon, CloseIcon, WaveformIcon } from "@/components/ui/Icons";
import { MAIN_NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Wordmark */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2.5 text-text-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet rounded-lg"
          aria-label={`${SITE_CONFIG.name} Home`}
        >
          <KeynoteLogo
            size={30}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-wider text-text-primary">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted -mt-1 hidden sm:block">
              Music Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 rounded-full border border-border/80 bg-surface/80 px-3 py-1.5 shadow-sm"
          aria-label="Main Navigation"
        >
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet",
                  isActive
                    ? "bg-surface-elevated text-text-primary shadow-sm border border-border"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/50"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-3 rounded-full bg-accent-violet" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side status indicator & Mobile menu button */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/60 bg-surface/50 px-3 py-1 text-xs text-text-secondary font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-violet opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-violet" />
            </span>
            <span>Phase 1 Active</span>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface-elevated px-4 pt-3 pb-6 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "bg-accent-violet/15 text-accent-violet-light border border-accent-violet/30"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <WaveformIcon size={16} className="text-accent-violet" />
                  ) : (
                    <span className="text-xs font-mono text-text-muted">Explore</span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted font-mono">
            <span>{SITE_CONFIG.name} v{SITE_CONFIG.version}</span>
            <span className="text-accent-violet">Dark Theme</span>
          </div>
        </div>
      )}
    </header>
  );
}
