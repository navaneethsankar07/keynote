"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MenuIcon,
  CloseIcon,
  GearIcon,
  PauseIcon,
  WaveformIcon,
} from "@/components/ui/Icons";
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
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col items-center pointer-events-none px-3 sm:px-4">
      {/* --- TOP-DOCKED DYNAMIC ISLAND / NOTCH CAPSULE --- */}
      <div className="pointer-events-auto relative flex items-center h-12 px-3.5 sm:px-4 bg-[#090a10]/95 backdrop-blur-xl border-b border-x border-white/10 rounded-b-[20px] shadow-2xl shadow-black/80 gap-3 sm:gap-6 transition-all duration-300">
        {/* Left Inverted Concave Ear - smooth aesthetic merge into top edge */}
        <svg
          className="absolute right-full top-0 h-4 w-4 pointer-events-none fill-[#090a10]/95"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M16 0 L0 0 A16 16 0 0 0 16 16 Z" />
          <path
            d="M0 0 A16 16 0 0 0 16 16"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        </svg>

        {/* Right Inverted Concave Ear - smooth aesthetic merge into top edge */}
        <svg
          className="absolute left-full top-0 h-4 w-4 pointer-events-none fill-[#090a10]/95"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M0 0 L16 0 A16 16 0 0 1 0 16 Z" />
          <path
            d="M16 0 A16 16 0 0 1 0 16"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        </svg>

        {/* 1. Left: Nav Logo Badge */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet rounded-lg py-0.5"
          aria-label={`${SITE_CONFIG.name} Home`}
        >
          <Image
            src="/images/logo-white.png"
            alt={SITE_CONFIG.name}
            width={40}
            height={32}
            className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </Link>

        {/* 2. Center: Desktop Nav Links (Clean, minimalist text) */}
        <nav
          className="hidden md:flex items-center gap-1 sm:gap-1.5"
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
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet",
                  isActive
                    ? "text-white bg-white/10 font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right: Controls & CTA Action Button */}
        <div className="flex items-center gap-2">
          {/* Soundscape Animation Controls (Gear Popover) */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={cn(
                "relative flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet",
                settingsOpen
                  ? "border-accent-violet/60 bg-white/15 text-accent-cyan shadow-sm"
                  : "border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:border-white/20 hover:bg-white/10"
              )}
              aria-label="Soundscape Animation Controls"
              title="Animation Settings"
            >
              <GearIcon
                size={13}
                className={cn(
                  "transition-transform duration-300",
                  settingsOpen ? "rotate-90 text-accent-cyan" : ""
                )}
              />
              {/* Dynamic status dot on gear button */}
              <span
                className={cn(
                  "absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full border border-black",
                  isAnimationActive ? "bg-emerald-400" : "bg-neutral-500"
                )}
              />
            </button>

            {/* Gear Settings Popover Panel */}
            {settingsOpen && (
              <div
                className="absolute right-0 top-full mt-2.5 w-72 rounded-2xl border border-white/10 bg-[#0c0d14]/98 p-4 shadow-2xl shadow-black/90 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                role="dialog"
                aria-label="Soundscape Animation Settings"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <GearIcon size={14} className="text-accent-cyan" />
                    <span className="font-display text-xs font-semibold uppercase tracking-wider text-white">
                      Animation Control
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border",
                      isAnimationActive
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-neutral-700 bg-neutral-900 text-neutral-400"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isAnimationActive ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
                      )}
                    />
                    {isAnimationActive ? "LIVE" : "PAUSED"}
                  </div>
                </div>

                {/* Master Interactive Toggle Card */}
                <button
                  type="button"
                  onClick={toggleAnimation}
                  className={cn(
                    "mt-3.5 w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet",
                    isAnimationActive
                      ? "border-accent-violet/40 bg-accent-violet/10 hover:border-accent-violet/60 hover:bg-accent-violet/15"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  )}
                  role="switch"
                  aria-checked={isAnimationActive}
                  aria-label="Toggle 3D soundscape animation"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                        isAnimationActive
                          ? "border-accent-violet/40 bg-accent-violet/20 text-accent-cyan"
                          : "border-white/10 bg-white/5 text-neutral-400"
                      )}
                    >
                      {isAnimationActive ? (
                        <WaveformIcon size={16} className="animate-pulse" />
                      ) : (
                        <PauseIcon size={14} />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white transition-colors">
                        3D Soundscape
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {isAnimationActive
                          ? "Interactive harmonic motion"
                          : "Paused • Conserves battery"}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div
                    className={cn(
                      "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out",
                      isAnimationActive
                        ? "bg-accent-violet border-accent-violet shadow-sm shadow-accent-violet/30"
                        : "bg-neutral-800 border-white/10"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out mt-[1px] ml-[1px]",
                        isAnimationActive ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </div>
                </button>

                {/* Subtle Engine Info & Tip */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>WebGL Tubes Engine</span>
                  <span className="text-accent-violet-light/90">Click background to shift mood</span>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA Pill Button (White capsule with dark text, matching reference image) */}
          <Link
            href="/analyze"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-white text-black hover:bg-neutral-100 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
          >
            <WaveformIcon size={12} className="text-black" />
            <span>Analyze</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <CloseIcon size={14} /> : <MenuIcon size={14} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN DRAWER --- */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-2 w-full max-w-sm rounded-2xl border border-white/10 bg-[#090a10]/95 p-4 shadow-2xl shadow-black/90 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
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
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/15 text-white font-semibold border border-white/10"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <WaveformIcon size={14} className="text-accent-cyan" />
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-500">Explore</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Soundscape Animation Toggle */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md border",
                  isAnimationActive
                    ? "border-accent-violet/40 bg-accent-violet/20 text-accent-cyan"
                    : "border-white/10 bg-white/5 text-neutral-400"
                )}
              >
                {isAnimationActive ? <WaveformIcon size={12} /> : <PauseIcon size={10} />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">3D Soundscape</span>
                <span className="text-[10px] text-neutral-400">
                  {isAnimationActive ? "Running" : "Paused"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleAnimation}
              className={cn(
                "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet",
                isAnimationActive ? "bg-accent-violet border-accent-violet" : "bg-neutral-800 border-white/10"
              )}
              role="switch"
              aria-checked={isAnimationActive}
              aria-label="Toggle 3D soundscape animation"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out mt-[0.5px] ml-[0.5px]",
                  isAnimationActive ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
