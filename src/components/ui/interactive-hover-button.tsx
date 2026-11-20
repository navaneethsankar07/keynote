import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children?: React.ReactNode;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLAnchorElement,
  InteractiveHoverButtonProps
>(({ href, className, children = "Analyze a song", ...props }, ref) => {
  return (
    <Link
      href={href}
      ref={ref}
      className={cn(
        "group relative inline-flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/[0.05] px-8 py-3.5 text-center font-medium text-text-primary backdrop-blur-xl transition-all duration-300 ease-out select-none",
        "shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:border-violet-400/60 hover:shadow-[0_12px_40px_rgba(139,92,246,0.4),inset_0_1px_2px_rgba(255,255,255,0.45)]",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
        aria-hidden="true"
      />

      <div className="flex items-center gap-2.5">
        <div
          className="h-2 w-2 rounded-full bg-accent-violet transition-all duration-500 ease-out group-hover:scale-[100] group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:via-indigo-600 group-hover:to-accent-violet"
          aria-hidden="true"
        />
        <span className="inline-block transition-all duration-300 ease-out group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>

      <div
        className="absolute inset-0 z-10 flex h-full w-full -translate-x-10 items-center justify-center gap-2 font-medium text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        aria-hidden="true"
      >
        <span>{children}</span>
        <ArrowRightIcon size={18} />
      </div>

      <span
        className="pointer-events-none absolute inset-x-8 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        aria-hidden="true"
      />
    </Link>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
