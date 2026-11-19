"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeynoteLogo, MenuIcon, CloseIcon, GearIcon, PlayIcon, PauseIcon, WaveformIcon } from "@/components/ui/Icons";
import { useAnimation } from "@/context/AnimationContext";
import { MAIN_NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { isAnimationActive, toggleAnimation } = useAnimation();

  // Close settings popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsOpen]);

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

        {/* Right side settings & status indicator & Mobile menu button */}
        <div className="flex items-center gap-2.5">
          {/* Gear Option for Animation & Motion Control */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet",
                settingsOpen
                  ? "border-accent-violet/60 bg-surface-elevated text-accent-cyan shadow-sm"
                  : "border-border bg-surface/80 text-text-secondary hover:text-text-primary hover:border-border-hover hover:bg-surface-hover"
              )}
              aria-label="Soundscape Animation Controls"
              title="Animation Settings"
            >
              <GearIcon
                size={18}
                className={cn(
                  "transition-transform duration-300",
                  settingsOpen ? "rotate-90 text-accent-cyan" : "group-hover:rotate-45"
                )}
              />
              {/* Dynamic Status Dot on Gear */}
              <span
                className={cn(
                  "absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-surface",
                  isAnimationActive ? "bg-emerald-400" : "bg-text-muted/60"
                )}
              />
            </button>

            {/* Gear Settings Popover Panel */}
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-surface-elevated p-3.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-border/70">
                  <span className="font-display text-xs font-semibold uppercase tracking-wider text-text-primary">
                    Visual Experience
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border",
                      isAnimationActive
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-text-muted/30 bg-surface text-text-muted"
                    )}
                  >
                    {isAnimationActive ? "ACTIVE" : "PAUSED"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-text-primary">
                      3D Soundscape
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Neon tubes & audio motion
                    </span>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleAnimation}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet",
                      isAnimationActive ? "bg-accent-violet" : "bg-surface-hover border-border"
                    )}
                    role="switch"
                    aria-checked={isAnimationActive}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                        isAnimationActive ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {/* Quick Pause/Play CTA */}
                <button
                  type="button"
                  onClick={toggleAnimation}
                  className="mt-3.5 w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent-violet/40 hover:bg-surface-hover transition-colors"
                >
                  {isAnimationActive ? (
                    <>
                      <PauseIcon size={14} className="text-accent-violet" />
                      <span>Stop Animation</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon size={14} className="text-emerald-400" />
                      <span>Start Animation</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/60 bg-surface/50 px-3 py-1 text-xs text-text-secondary font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-violet opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-violet" />
            </span>
            <span>Phase 2 Active</span>
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

          {/* Mobile Soundscape Animation Toggle */}
          <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GearIcon size={16} className="text-text-muted" />
              <span className="text-xs font-medium text-text-primary">3D Soundscape</span>
            </div>
            <button
              type="button"
              onClick={toggleAnimation}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-colors",
                isAnimationActive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-text-muted/30 bg-surface text-text-muted"
              )}
            >
              {isAnimationActive ? "STOP" : "START"}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted font-mono">
            <span>{SITE_CONFIG.name} v{SITE_CONFIG.version}</span>
            <span className="text-accent-violet">Dark Theme</span>
          </div>
        </div>
      )}
    </header>
  );
}
