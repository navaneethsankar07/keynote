"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { HARMONIC_PALETTES, type HarmonicPalette } from "@/lib/constants";

interface AnimationContextType {
  isAnimationActive: boolean;
  setIsAnimationActive: (active: boolean) => void;
  toggleAnimation: () => void;
  paletteIndex: number;
  activePalette: HarmonicPalette;
  cyclePalette: () => void;
}

const AnimationContext = createContext<AnimationContextType>({
  isAnimationActive: true,
  setIsAnimationActive: () => {},
  toggleAnimation: () => {},
  paletteIndex: 0,
  activePalette: HARMONIC_PALETTES[0],
  cyclePalette: () => {},
});

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  const [paletteIndex, setPaletteIndex] = useState(0);

  useEffect(() => {
    try {
      localStorage.removeItem("keynote_animation_active");
    } catch {
      // Ignore
    }
  }, []);

  const toggleAnimation = () => {
    setIsAnimationActive((prev) => !prev);
  };

  const cyclePalette = useCallback(() => {
    setPaletteIndex((prev) => (prev + 1) % HARMONIC_PALETTES.length);
  }, []);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea") ||
          target.closest("[role='button']"))
      ) {
        return;
      }
      cyclePalette();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [cyclePalette]);

  const activePalette =
    HARMONIC_PALETTES[paletteIndex % HARMONIC_PALETTES.length] || HARMONIC_PALETTES[0];

  return (
    <AnimationContext.Provider
      value={{
        isAnimationActive,
        setIsAnimationActive,
        toggleAnimation,
        paletteIndex,
        activePalette,
        cyclePalette,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  return useContext(AnimationContext);
}
