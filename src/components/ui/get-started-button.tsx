"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

function shortestAngle(from: number, to: number) {
  const diff = ((to - from + 540) % 360) - 180;
  return from + diff;
}

export interface GetStartedButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function GetStartedButton({
  label = "Get started",
  onClick,
  href,
  className,
}: GetStartedButtonProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [angle, setAngle] = useState(-45);
  const lastAngleRef = useRef(-45);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rawAngle =
      Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    const nextAngle = shortestAngle(lastAngleRef.current, rawAngle);
    lastAngleRef.current = nextAngle;
    setAngle(nextAngle);
  };

  const resetAngle = () => {
    const nextAngle = shortestAngle(lastAngleRef.current, -45);
    lastAngleRef.current = nextAngle;
    setAngle(nextAngle);
  };

  const sharedClasses = [
    "group relative inline-flex h-14 items-center justify-center gap-2",
    "overflow-hidden rounded-full border border-white/20 px-8",
    "bg-white text-zinc-950 text-sm sm:text-base font-semibold tracking-wide",
    "transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.15)]",
    "hover:border-white/50 hover:text-white hover:shadow-[0_0_35px_rgba(255,255,255,0.25)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    className ?? "",
  ].join(" ");

  const content = (
    <>
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute left-1/2 top-1/2 h-5 w-5",
          "-translate-x-1/2 -translate-y-1/2 scale-0 rounded-full",
          "bg-zinc-950 border border-white/20",
          "transition-transform duration-500 ease-out",
          "group-hover:scale-[40] group-focus-visible:scale-[40]",
        ].join(" ")}
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {label}
      </span>
      <svg
        aria-hidden="true"
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 transition-transform duration-150 ease-linear text-zinc-950 group-hover:text-white"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </>
  );

  if (href) {
    return (
      <Link
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetAngle}
        aria-label={label}
        className={sharedClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetAngle}
      aria-label={label}
      className={sharedClasses}
    >
      {content}
    </button>
  );
}

export default GetStartedButton;

