"use client";

import React from "react";
import Link from "next/link";
import { TheoryBookIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export interface ShinyButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function ShinyButton({
  label = "Explore music theory",
  onClick,
  href = "/learn",
  className = "",
  icon = <TheoryBookIcon size={18} className="shrink-0" />,
}: ShinyButtonProps) {
  const content = (
    <>
      <span className="relative z-20 flex items-center gap-2.5">
        {icon}
        <span>{label}</span>
      </span>

      <span
        className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out pointer-events-none"
        aria-hidden="true"
      />
      <span
        className="w-1/2 transition-all duration-300 block border-white/25 absolute h-[20%] rounded-tl-xl border-l-2 border-t-2 top-0 left-0 pointer-events-none group-hover:border-accent-violet/80"
        aria-hidden="true"
      />
      <span
        className="w-1/2 transition-all duration-300 block border-white/25 absolute group-hover:h-[90%] h-[60%] rounded-tr-xl border-r-2 border-t-2 top-0 right-0 pointer-events-none group-hover:border-accent-violet/80"
        aria-hidden="true"
      />
      <span
        className="w-1/2 transition-all duration-300 block border-white/25 absolute h-[60%] group-hover:h-[90%] rounded-bl-xl border-l-2 border-b-2 left-0 bottom-0 pointer-events-none group-hover:border-accent-violet/80"
        aria-hidden="true"
      />
      <span
        className="w-1/2 transition-all duration-300 block border-white/25 absolute h-[20%] rounded-br-xl border-r-2 border-b-2 right-0 bottom-0 pointer-events-none group-hover:border-accent-violet/80"
        aria-hidden="true"
      />
    </>
  );

  const sharedClasses = cn(
    "relative cursor-pointer h-14 py-3.5 px-8 text-center inline-flex items-center justify-center text-base font-medium text-text-primary rounded-xl overflow-hidden group transition-all duration-300 ease-in-out bg-surface-elevated/80 hover:bg-surface-hover backdrop-blur-md shadow-sm active:scale-[0.98]",
    className
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={sharedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={sharedClasses}>
      {content}
    </button>
  );
}

export default ShinyButton;
