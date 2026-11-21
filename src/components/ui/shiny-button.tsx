"use client";

import React from "react";
import Link from "next/link";
import { TheoryBookIcon } from "@/components/ui/Icons";

export interface ShinyButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function ShinyButton({
  label = "Browse music theory",
  onClick,
  href,
  className = "",
  icon = <TheoryBookIcon size={18} className="text-white/80 group-hover:text-white transition-colors" />,
}: ShinyButtonProps) {
  const content = (
    <span className="relative inline-flex h-14 items-center justify-center rounded-md p-[1.5px] group overflow-hidden transition-all duration-300 active:scale-[0.98]">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-md bg-gradient-to-r from-white/90 via-purple-300/70 via-cyan-300/70 to-white/90 opacity-80 group-hover:opacity-100 group-hover:from-white group-hover:via-violet-400 group-hover:to-cyan-300 transition-all duration-500"
      />

      <span className="relative flex h-full w-full items-center justify-center gap-2.5 rounded-md bg-[#0a0b10] px-8 py-3.5 text-sm sm:text-base font-medium text-white transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:via-indigo-600 group-hover:to-accent-violet shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),0_4px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_12px_40px_rgba(139,92,246,0.4),inset_0_1px_2px_rgba(255,255,255,0.45)]">
        <span
          aria-hidden="true"
          className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-3 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-2 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-2 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        />

        {icon && <span className="relative z-10">{icon}</span>}
        <span className="relative z-10 tracking-wide text-white group-hover:text-white transition-colors duration-300">
          {label}
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={`inline-block ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`inline-block ${className}`}>
      {content}
    </button>
  );
}

export default ShinyButton;

