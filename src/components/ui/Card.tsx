import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "surface" | "elevated" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Card({
  variant = "surface",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    surface: "bg-surface border border-border/80 shadow-md",
    elevated: "bg-surface-elevated border border-border shadow-lg",
    interactive:
      "bg-surface border border-border/80 hover:border-accent-violet/50 hover:bg-surface-elevated transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-accent-violet/5",
  };

  const paddingStyles = {
    none: "",
    sm: "p-4 sm:p-5",
    md: "p-6 sm:p-7",
    lg: "p-8 sm:p-10",
  };

  return (
    <div
      className={cn(
        "rounded-2xl relative overflow-hidden",
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-lg sm:text-xl font-semibold tracking-tight text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-text-secondary leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center pt-4 border-t border-border/60", className)}
      {...props}
    >
      {children}
    </div>
  );
}
