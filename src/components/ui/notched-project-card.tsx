"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotchedProjectCardProps {
  href: string;
  title: string;
  description?: string;
  image: string;
  imageAlt?: string;
  badge?: string;
  tags?: string[];
  screen?: { src: string; alt: string; className?: string };
  dim?: number;
  monochrome?: boolean;
  surface?: string;
  accent?: string;
  accentForeground?: string;
  className?: string;
}

const DISC = 64;
const BLOCK = 80;
const FILLET = 28;

export function NotchedProjectCard({
  href,
  title,
  description,
  image,
  imageAlt = "",
  badge,
  tags = [],
  screen,
  dim = screen ? 0.45 : 0,
  monochrome = false,
  surface = "#07080e",
  className,
}: NotchedProjectCardProps) {
  const tone = monochrome
    ? "grayscale transition-[filter,scale] duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0"
    : "transition-[scale] duration-500";

  return (
    <a
      href={href}
      className={cn(
        "group flex flex-col rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className
      )}
    >
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-white/[0.04] border border-white/10">
          <Image
            src={image}
            alt={screen ? "" : imageAlt}
            fill
            unoptimized
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              tone,
              !screen && "group-hover:scale-[1.04]"
            )}
          />
          {dim > 0 && (
            <div
              aria-hidden
              className="absolute inset-0 z-10"
              style={{ backgroundColor: `rgb(0 0 0 / ${dim})` }}
            />
          )}
          {screen && (
            <div
              className={cn(
                "absolute bottom-0 right-0 w-[82%] h-[75%] origin-bottom-right drop-shadow-[0_18px_40px_rgba(0,0,0,0.5)] group-hover:scale-[1.07] z-10",
                tone,
                screen.className
              )}
            >
              <Image
                src={screen.src}
                alt={screen.alt}
                fill
                unoptimized
                className="object-contain object-bottom-right"
              />
            </div>
          )}
          {badge && (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-4 z-20">
              <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-md">
                {badge}
              </span>
            </div>
          )}
        </div>

        <div
          aria-hidden
          className="absolute bottom-0 right-0 pointer-events-none z-20"
          style={{
            width: BLOCK,
            height: BLOCK,
            borderTopLeftRadius: BLOCK - DISC / 2,
            background: surface,
          }}
        />
        {[
          { bottom: BLOCK, right: 0 },
          { bottom: 0, right: BLOCK },
        ].map((pos, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute pointer-events-none z-20"
            style={{
              ...pos,
              width: FILLET,
              height: FILLET,
              background: `radial-gradient(circle at top left, transparent ${
                FILLET - 0.5
              }px, ${surface} ${FILLET}px)`,
            }}
          />
        ))}

        <span
          aria-hidden
          className="absolute bottom-0 right-0 flex items-center justify-center rounded-full overflow-hidden backdrop-blur-xl bg-[#0e101a]/75 text-white border border-[#a78bfa]/40 shadow-[0_0_22px_rgba(167,139,250,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_2px_rgba(255,255,255,0.6)] transition-all duration-300 group-hover:bg-[#7c3aed] group-hover:border-[#7c3aed] group-hover:shadow-[0_0_30px_rgba(124,58,237,0.5),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-1.5px_2px_rgba(255,255,255,0.6)] z-30"
          style={{
            width: DISC,
            height: DISC,
          }}
        >
          <ArrowUpRight className="size-5 text-white" />
        </span>
      </div>

      <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-white group-hover:text-white transition-colors">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-text-secondary font-sans line-clamp-2">
          {description}
        </p>
      )}
      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <li
              key={`${t}-${i}`}
              className="rounded-md bg-white/[0.06] border border-white/10 px-2.5 py-1 text-[10px] font-mono font-medium uppercase tracking-wider text-white/80"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </a>
  );
}

export default NotchedProjectCard;
