import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cyan";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  isExternal = false,
  icon,
  iconPosition = "right",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles = {
    primary:
      "bg-accent-violet hover:bg-accent-violet-deep text-white shadow-lg shadow-accent-violet/20 hover:shadow-accent-violet/30 border border-accent-violet/40",
    secondary:
      "bg-surface-elevated hover:bg-surface-hover text-text-primary border border-border hover:border-border-hover shadow-sm",
    cyan:
      "bg-accent-cyan hover:bg-accent-cyan-hover text-background font-semibold shadow-lg shadow-accent-cyan/20",
    outline:
      "bg-transparent hover:bg-surface border border-border hover:border-border-hover text-text-secondary hover:text-text-primary",
    ghost:
      "bg-transparent hover:bg-surface-elevated text-text-secondary hover:text-text-primary",
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </>
  );

  const combinedClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
}

