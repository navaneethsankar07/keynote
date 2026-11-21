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
        className="absolute inset-0 rounded-md bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/90 via-purple-300/40 via-cyan-400/40 to-white/10 opacity-70 group-hover:opacity-100 group-hover:from-white group-hover:via-cyan-300/60 group-hover:to-purple-400/40 transition-all duration-500"
      />

      <span className="relative flex h-full w-full items-center justify-center gap-2.5 rounded-md bg-[#0a0b10] px-8 py-3.5 text-sm sm:text-base font-medium text-white transition-all duration-300 group-hover:bg-[#15122b] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(139,92,246,0.25)]">
        <span
          aria-hidden="true"
          className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-75 group-hover:opacity-100 group-hover:via-white transition-opacity duration-300"
        />

        <span
          aria-hidden="true"
          className="absolute -bottom-2 inset-x-6 h-4 rounded-md bg-purple-500/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {icon && <span className="relative z-10">{icon}</span>}
        <span className="relative z-10 tracking-wide text-white/90 group-hover:text-white transition-colors duration-300">
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

