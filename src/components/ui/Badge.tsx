import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "violet" | "cyan" | "success" | "warning" | "outline";
  size?: "sm" | "md";
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-surface-elevated text-text-secondary border border-border/80",
    violet:
      "bg-accent-violet/10 text-accent-violet-light border border-accent-violet/30",
    cyan:
      "bg-accent-cyan/10 text-accent-cyan-hover border border-accent-cyan/30",
    success:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    warning:
      "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    outline:
      "bg-transparent text-text-muted border border-border",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium tracking-wide",
    md: "px-2.5 py-1 text-xs font-medium tracking-wide",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-sans transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

