import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LiquidGlassButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function GlassFilter() {
  return (
    <svg className="hidden pointer-events-none absolute" aria-hidden="true">
      <defs>
        <filter
          id="liquid-glass-filter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
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
        "bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10",
        "shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]",
        "hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.15),inset_3px_3px_0.5px_-3px_rgba(255,255,255,0.15),inset_-3px_-3px_0.5px_-3px_rgba(255,255,255,0.95),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.7),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.7),inset_0_0_8px_8px_rgba(255,255,255,0.16),inset_0_0_3px_3px_rgba(255,255,255,0.08),0_0_16px_rgba(0,0,0,0.2)] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-x-4 top-1 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />
      <span className="relative z-10 tracking-tight">{children}</span>
      <GlassFilter />
    </Link>
  );
});

LiquidGlassButton.displayName = "LiquidGlassButton";

export const LiquidButton = LiquidGlassButton;
