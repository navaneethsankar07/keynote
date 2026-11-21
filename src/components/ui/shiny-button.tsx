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
        className="absolute inset-0 rounded-md bg-white/15 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:via-indigo-600 group-hover:to-accent-violet group-hover:shadow-[0_0_25px_rgba(139,92,246,0.35)]"
      />

      <span className="relative flex h-full w-full items-center justify-center gap-2.5 rounded-[5px] bg-[#0a0b10] px-8 py-3.5 text-sm sm:text-base font-medium text-white transition-colors duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
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
