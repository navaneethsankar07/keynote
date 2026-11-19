"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  // Always active initially on load as requested ("make that on initially")
  const [isAnimationActive, setIsAnimationActive] = useState(true);

  // Clear any legacy stored "false" flag to guarantee fresh initial load is ON
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
