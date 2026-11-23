import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LiquidGlassButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export const LiquidGlassButton = React.forwardRef<
  HTMLAnchorElement,
  LiquidGlassButtonProps
>(({ href = "#", className, children = "Liquid Glass", ...props }, ref) => {
  return (
    <Link
      href={href}
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-white transition-all duration-300 select-none",
        "bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/15",
        "shadow-[0_10px_30px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.4),inset_0_-1.5px_2px_rgba(255,255,255,0.65)]",
        "hover:border-white/30 hover:shadow-[0_12px_36px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.5),inset_0_-2px_2.5px_rgba(255,255,255,0.8)] hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-x-5 top-1 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />
      <span className="relative z-10 tracking-tight">{children}</span>
    </Link>
  );
});

LiquidGlassButton.displayName = "LiquidGlassButton";

