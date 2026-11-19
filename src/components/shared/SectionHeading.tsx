import React from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  badgeVariant?: "default" | "violet" | "cyan" | "success" | "warning";
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  badge,
  badgeVariant = "violet",
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {badge && (
        <Badge variant={badgeVariant} size="sm">
          {badge}
        </Badge>
      )}
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
