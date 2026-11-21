"use client";

import React from "react";
import Link from "next/link";

export interface GetStartedButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function GetStartedButton({
  label = "Get started",
  onClick,
  href,
  className,
}: GetStartedButtonProps) {
  const sharedClasses = [
    "group relative inline-flex h-14 items-center justify-center gap-2.5",
    "overflow-hidden rounded-full border border-white/20 px-8",
    "bg-zinc-950 text-white text-sm sm:text-base font-semibold tracking-wide",
    "transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.5)]",
    "hover:border-violet-400/60 hover:shadow-[0_12px_40px_rgba(139,92,246,0.35)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    className ?? "",
  ].join(" ");

  const content = (
    <>
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute left-1/2 top-1/2 h-80 w-80",
          "-translate-x-1/2 -translate-y-1/2 scale-0 rounded-full",
          "bg-gradient-to-r from-violet-600 via-indigo-600 to-accent-violet",
          "transition-transform duration-500 ease-out",
          "group-hover:scale-100 group-focus-visible:scale-100",
        ].join(" ")}
      />
      <span className="relative z-10 transition-colors duration-300 text-white">
        {label}
      </span>
      <svg
        aria-hidden="true"
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 text-white transition-transform duration-300 ease-out -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={label}
        className={sharedClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={sharedClasses}
    >
      {content}
    </button>
  );
}

export default GetStartedButton;
