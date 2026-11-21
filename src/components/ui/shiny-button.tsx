"use client";

import React, { useRef, useState, useEffect } from "react";
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
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateDims = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDims({ width: rect.width, height: rect.height });
      }
    };
    updateDims();
    const observer = new ResizeObserver(updateDims);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const W = dims.width || 230;
  const H = dims.height || 56;
  const r = 6;
  const o = 0.75;
  const xMid = W / 2;

  const pathLeft = `M ${xMid} ${o} H ${r} A ${r - o} ${r - o} 0 0 0 ${o} ${r} V ${H - r} A ${r - o} ${r - o} 0 0 0 ${r} ${H - o} H ${xMid}`;
  const pathRight = `M ${xMid} ${o} H ${W - r} A ${r - o} ${r - o} 0 0 1 ${W - o} ${r} V ${H - r} A ${r - o} ${r - o} 0 0 1 ${W - r} ${H - o} H ${xMid}`;

  const content = (
    <span
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="relative inline-flex h-14 items-center justify-center rounded-md group select-none transition-all duration-300 active:scale-[0.98]"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <rect
          x={o}
          y={o}
          width={Math.max(0, W - 2 * o)}
          height={Math.max(0, H - 2 * o)}
          rx={r - o}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={1.5}
        />
        <path
          d={pathLeft}
          fill="none"
          stroke="#a78bfa"
          strokeWidth={1.5}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={isHovered ? 0 : 100}
          style={{
            transition: "stroke-dashoffset 500ms cubic-bezier(0.4, 0, 0.2, 1)",
            filter: isHovered ? "drop-shadow(0 0 6px rgba(167, 139, 250, 0.75))" : "none",
          }}
        />
        <path
          d={pathRight}
          fill="none"
          stroke="#a78bfa"
          strokeWidth={1.5}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={isHovered ? 0 : 100}
          style={{
            transition: "stroke-dashoffset 500ms cubic-bezier(0.4, 0, 0.2, 1)",
            filter: isHovered ? "drop-shadow(0 0 6px rgba(167, 139, 250, 0.75))" : "none",
          }}
        />
      </svg>

      <span className="relative flex h-full w-full items-center justify-center gap-2.5 rounded-md bg-[#0a0b10] px-8 py-3.5 text-sm sm:text-base font-medium text-white transition-colors duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
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
