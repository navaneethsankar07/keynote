"use client";

import React, { createContext, useContext, useState } from "react";

interface AnimationContextType {
  isAnimationActive: boolean;
  setIsAnimationActive: (active: boolean) => void;
  toggleAnimation: () => void;
}

const AnimationContext = createContext<AnimationContextType>({
  isAnimationActive: true,
  setIsAnimationActive: () => {},
  toggleAnimation: () => {},
});

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isAnimationActive, setIsAnimationActive] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("keynote_animation_active");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const toggleAnimation = () => {
    setIsAnimationActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("keynote_animation_active", String(next));
      } catch {
        // Fallback
      }
      return next;
    });
  };

  return (
    <AnimationContext.Provider
      value={{
        isAnimationActive,
        setIsAnimationActive,
        toggleAnimation,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  return useContext(AnimationContext);
}
