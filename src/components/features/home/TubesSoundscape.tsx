"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { useAnimation } from "@/context/AnimationContext";

// Musical Harmonic Color Palettes — rich, studio-refined tones
export const HARMONIC_PALETTES = [
  {
    name: "Aeolian",
    tubes: ["#7c3aed", "#0891b2", "#6366f1"],
    lights: ["#5b21b6", "#0e7490", "#6d28d9", "#0284c7"],
    staffColor: "#8b5cf6",
    accentColor: "#06b6d4",
  },
  {
    name: "Dorian",
    tubes: ["#0284c7", "#4f46e5", "#7c3aed"],
    lights: ["#0369a1", "#4338ca", "#0891b2", "#5b21b6"],
    staffColor: "#38bdf8",
    accentColor: "#6366f1",
  },
  {
    name: "Lydian",
    tubes: ["#0ea5e9", "#7c3aed", "#e11d48"],
    lights: ["#0284c7", "#5b21b6", "#be123c", "#38bdf8"],
    staffColor: "#60a5fa",
    accentColor: "#f43f5e",
  },
  {
    name: "Mixolydian",
    tubes: ["#d97706", "#7c3aed", "#0284c7"],
    lights: ["#b45309", "#5b21b6", "#0891b2", "#d97706"],
    staffColor: "#f59e0b",
    accentColor: "#7c3aed",
  },
];

const SPECTRUM_BAR_COUNT = 96;

// High-resolution acoustic mastering logarithmic spectrum profile
const SPECTRUM_BARS_DATA = Array.from({ length: SPECTRUM_BAR_COUNT }, (_, i) => {
  const norm = i / (SPECTRUM_BAR_COUNT - 1);
  const subBass = Math.sin(norm * Math.PI * 0.85) * 20;
  const lowMid = Math.sin((norm - 0.2) * Math.PI * 3.4) * 14;
  const midRange = Math.sin((norm - 0.52) * Math.PI * 4.2) * 12;
  const presence = Math.sin((norm - 0.76) * Math.PI * 5) * 10;
  const airTaper = Math.cos(norm * (Math.PI / 2)) * 7;
  const rawHeight = 10 + subBass + (lowMid > 0 ? lowMid : 0) + (midRange > 0 ? midRange : 0) + (presence > 0 ? presence : 0) + airTaper;
  const baseH = Math.max(7, Math.min(52, Math.round(rawHeight)));
  const animIndex = (i % 4) + 1;
  return { baseH, animClass: `pro-fft-pulse-${animIndex}` };
});

// Custom Luminous Audio Reticle Mouse Cursor (Cyan & Violet, 32x32)
const CUSTOM_CURSOR_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Ccircle cx='16' cy='16' r='8.5' stroke='%2322d3ee' stroke-width='1.2' stroke-opacity='0.8'/%3E%3Cline x1='16' y1='2' x2='16' y2='6' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='16' y1='26' x2='16' y2='30' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='26' y1='16' x2='30' y2='16' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='2' y1='16' x2='6' y2='16' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='16' r='2' fill='%23ffffff'/%3E%3C/svg%3E\") 16 16, crosshair";

interface TubeMeshEntry {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  points: THREE.Vector3[];
  radius: number;
  timeOffset: number;
  speed: number;
}

interface TubesSoundscapeProps {
  className?: string;
}

export function TubesSoundscape({ className = "" }: TubesSoundscapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isAnimationActive } = useAnimation();
  const isAnimationActiveRef = useRef(isAnimationActive);

  // Sync ref with state for animation loop access without restarting effect
  useEffect(() => {
    isAnimationActiveRef.current = isAnimationActive;
  }, [isAnimationActive]);

  const [paletteIndex, setPaletteIndex] = useState(0);
  const activePalette =
    HARMONIC_PALETTES[paletteIndex % HARMONIC_PALETTES.length] || HARMONIC_PALETTES[0];

  const updatePaletteRef = useRef<((idx: number) => void) | null>(null);

  const cycleHarmonicPalette = useCallback(() => {
    setPaletteIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % HARMONIC_PALETTES.length;
      if (updatePaletteRef.current) {
        updatePaletteRef.current(nextIndex);
      }
      return nextIndex;
    });
  }, []);

  // Click listener: clicking background strictly shifts animation harmonic mood
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea"))
      ) {
        return;
      }
      cycleHarmonicPalette();
    };

    window.addEventListener("pointerdown", handleGlobalClick);
    return () => {
      window.removeEventListener("pointerdown", handleGlobalClick);
    };
  }, [cycleHarmonicPalette]);

  // High-density color gradient interpolation across 96 filaments
  const spectrumBars = useMemo(() => {
    return SPECTRUM_BARS_DATA.map((bar, i) => {
      let color = activePalette?.tubes?.[0] || "#7c3aed";
      if (i >= 24 && i < 54) {
        color = activePalette?.accentColor || "#06b6d4";
      } else if (i >= 54 && i < 76) {
        color = activePalette?.staffColor || "#8b5cf6";
      } else if (i >= 76) {
        color = activePalette?.tubes?.[1] || "#0891b2";
      }
      return { ...bar, color };
    });
  }, [activePalette]);

  // Native Three.js 3D Tubes Simulation with robust lifecycle and zero memory leaks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    let isMounted = true;
    let animationFrameId: number;

    const width = canvas.parentElement.clientWidth || window.innerWidth;
    const height = canvas.parentElement.clientHeight || window.innerHeight;

    // 1. Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    } catch (err) {
      console.warn("WebGL initialization fallback:", err);
      return;
    }

    // 2. Studio Lighting Rig
    const initialPalette =
      HARMONIC_PALETTES[paletteIndex % HARMONIC_PALETTES.length] || HARMONIC_PALETTES[0];

    const ambientLight = new THREE.AmbientLight(0x0f0b1e, 1.2);
    scene.add(ambientLight);

    const pointLights: THREE.PointLight[] = [];
    const lightPositions: [number, number, number][] = [
      [-5, 4, 4.5],
      [5, 4, 4.5],
      [-5, -4, 4],
      [5, -4, 4],
    ];

    lightPositions.forEach((pos, idx) => {
      const colorHex = initialPalette.lights[idx] || initialPalette.lights[0];
      const light = new THREE.PointLight(colorHex, 85, 20);
      light.position.set(...pos);
      scene.add(light);
      pointLights.push(light);
    });

    // 3. 14 Musical Harmonic Filaments (Tubes)
    const TUBE_COUNT = 14;
    const POINTS_PER_TUBE = 24;
    const tubesList: TubeMeshEntry[] = [];

    for (let i = 0; i < TUBE_COUNT; i++) {
      const tubeColorHex = initialPalette.tubes[i % initialPalette.tubes.length];
      const radius = 0.022 + (i % 4) * 0.01;
      const points: THREE.Vector3[] = [];

      // Initial resting curve points
      for (let j = 0; j < POINTS_PER_TUBE; j++) {
        const t = j / (POINTS_PER_TUBE - 1);
        const z = -t * 1.8;
        const x = Math.sin(t * Math.PI + i * 0.4) * 0.8;
        const y = Math.cos(t * Math.PI + i * 0.5) * 0.4;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
      const geometry = new THREE.TubeGeometry(curve, 36, radius, 8, false);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(tubeColorHex),
        roughness: 0.22,
        metalness: 0.88,
        emissive: new THREE.Color(tubeColorHex),
        emissiveIntensity: 0.28,
        transparent: true,
        opacity: 0.9,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      tubesList.push({
        mesh,
        curve,
        points,
        radius,
        timeOffset: i * 0.45 + Math.random() * 0.5,
        speed: 0.75 + (i % 3) * 0.2,
      });
    }

    // Palette updater handler
    updatePaletteRef.current = (idx: number) => {
      const newPalette =
        HARMONIC_PALETTES[idx % HARMONIC_PALETTES.length] || HARMONIC_PALETTES[0];

      // Update lights
      pointLights.forEach((light, lIdx) => {
        const color = newPalette.lights[lIdx] || newPalette.lights[0];
        light.color.set(color);
      });

      // Update tube materials
      tubesList.forEach((tube, tIdx) => {
        const tubeColor = newPalette.tubes[tIdx % newPalette.tubes.length];
        const mat = tube.mesh.material as THREE.MeshStandardMaterial;
        mat.color.set(tubeColor);
        mat.emissive.set(tubeColor);
      });
    };

    // 4. Pointer Interaction and Motion Physics
    const mousePos = { x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false };
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const planeIntersectPoint = new THREE.Vector3();

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      if (raycaster.ray.intersectPlane(planeZ, planeIntersectPoint)) {
        mousePos.targetX = planeIntersectPoint.x;
        mousePos.targetY = planeIntersectPoint.y;
        mousePos.isHovering = true;
      }
    };

    const handlePointerLeave = () => {
      mousePos.isHovering = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // 5. Window Resize Handler (clean reference for removeEventListener)
    const handleResize = () => {
      if (!isMounted || !canvas || !canvas.parentElement || !renderer) return;
      const newWidth = canvas.parentElement.clientWidth || window.innerWidth;
      const newHeight = canvas.parentElement.clientHeight || window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener("resize", handleResize);

    // 6. Smooth 60fps Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isMounted) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!renderer) return;

      const time = clock.getElapsedTime();

      // If animation is toggled off by user, preserve low-power state
      if (!isAnimationActiveRef.current) {
        return;
      }

      // Idle Lissajous harmonic soundwave path when cursor is still or outside
      const idleX = Math.cos(time * 0.65) * 2.6;
      const idleY = Math.sin(time * 1.3) * 1.3;

      if (mousePos.isHovering) {
        mousePos.x += (mousePos.targetX - mousePos.x) * 0.08;
        mousePos.y += (mousePos.targetY - mousePos.y) * 0.08;
      } else {
        mousePos.x += (idleX - mousePos.x) * 0.04;
        mousePos.y += (idleY - mousePos.y) * 0.04;
      }

      // Update each tube's leading point and trailing segments
      for (let i = 0; i < tubesList.length; i++) {
        const tube = tubesList[i];
        const { points, curve, radius, timeOffset, speed } = tube;

        // Individual harmonic frequency wave offset
        const waveX = Math.sin(time * speed + timeOffset) * 0.45;
        const waveY = Math.cos(time * (speed * 0.8) + timeOffset) * 0.35;
        const waveZ = Math.sin(time * (speed * 0.6) + timeOffset) * 0.3;

        // Lead point lerps towards current focal point
        const leadX = mousePos.x + waveX;
        const leadY = mousePos.y + waveY;
        const leadZ = waveZ;

        points[0].x += (leadX - points[0].x) * (0.07 + (i % 3) * 0.015);
        points[0].y += (leadY - points[0].y) * (0.07 + (i % 3) * 0.015);
        points[0].z += (leadZ - points[0].z) * 0.06;

        // Trailing segments smoothly follow the segment ahead (organic snake physics)
        for (let j = 1; j < points.length; j++) {
          const prev = points[j - 1];
          const curr = points[j];
          curr.x += (prev.x - curr.x) * 0.22;
          curr.y += (prev.y - curr.y) * 0.22;
          curr.z += (prev.z - curr.z) * 0.22;
        }

        // Reconstruct tube mesh geometry
        tube.mesh.geometry.dispose();
        tube.mesh.geometry = new THREE.TubeGeometry(curve, 32, radius, 8, false);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Full Cleanup on Unmount (Guarantees zero memory leaks on page navigation)
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      updatePaletteRef.current = null;

      // Dispose all tubes
      tubesList.forEach((tube) => {
        tube.mesh.geometry.dispose();
        if (tube.mesh.material instanceof THREE.Material) {
          tube.mesh.material.dispose();
        }
        scene.remove(tube.mesh);
      });

      // Dispose lights
      pointLights.forEach((light) => {
        scene.remove(light);
        light.dispose();
      });

      scene.clear();

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer = null;
      }
    };
  }, [paletteIndex]);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden select-none ${className}`}
      aria-hidden="true"
      style={{ cursor: isAnimationActive ? CUSTOM_CURSOR_URL : "default" }}
    >
      {/* Background ambient radial glow — softened to protect eyes */}
      <div
        className="pointer-events-none absolute top-[-5%] left-1/2 -translate-x-1/2 h-[650px] w-[1000px] max-w-[130vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.09)_0%,rgba(6,182,212,0.03)_45%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      {/* Interactive 3D WebGL Neon Tubes Canvas with custom audio pointer */}
      <canvas
        ref={canvasRef}
        id="tubes-canvas"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 pointer-events-auto ${
          isAnimationActive ? "opacity-75" : "opacity-0 pointer-events-none"
        }`}
        style={{ cursor: isAnimationActive ? CUSTOM_CURSOR_URL : "default" }}
      />

      {/* --- PROFESSIONAL STUDIO-GRADE FULL-WIDTH FFT EQUALIZER --- */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 w-full flex flex-col justify-end overflow-hidden z-20"
        aria-hidden="true"
      >
        <style>{`
          @keyframes proFftPulse1 {
            0%, 100% { transform: scaleY(0.48); opacity: 0.55; }
            50% { transform: scaleY(1.0); opacity: 0.88; }
          }
          @keyframes proFftPulse2 {
            0%, 100% { transform: scaleY(0.85); opacity: 0.82; }
            50% { transform: scaleY(0.42); opacity: 0.5; }
          }
          @keyframes proFftPulse3 {
            0%, 100% { transform: scaleY(0.58); opacity: 0.6; }
            50% { transform: scaleY(0.96); opacity: 0.9; }
          }
          @keyframes proFftPulse4 {
            0%, 100% { transform: scaleY(0.92); opacity: 0.88; }
            50% { transform: scaleY(0.48); opacity: 0.52; }
          }
          .pro-fft-pulse-1 { animation: proFftPulse1 2.4s ease-in-out infinite; transform-origin: bottom; }
          .pro-fft-pulse-2 { animation: proFftPulse2 2.8s ease-in-out infinite; transform-origin: bottom; }
          .pro-fft-pulse-3 { animation: proFftPulse3 2.1s ease-in-out infinite; transform-origin: bottom; }
          .pro-fft-pulse-4 { animation: proFftPulse4 2.6s ease-in-out infinite; transform-origin: bottom; }
        `}</style>

        {/* 96 Dense High-Definition Spectral Filament Bars (Full Width) */}
        <div
          className="w-full h-14 sm:h-16 flex items-end justify-between px-1 sm:px-4 md:px-6 transition-opacity duration-700"
          style={{ opacity: isAnimationActive ? 1 : 0.25 }}
        >
          {spectrumBars.map((bar, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center flex-1 transition-colors duration-700 ${
                isAnimationActive ? bar.animClass : ""
              }`}
              style={{
                height: `${bar.baseH}px`,
                animationPlayState: isAnimationActive ? "running" : "paused",
              }}
            >
              {/* Precision Floating Peak-Hold Micro Dot */}
              <span
                className="w-[1.5px] h-[1.5px] rounded-full mb-[2px] transition-colors duration-700 opacity-85"
                style={{
                  backgroundColor: bar.color,
                  boxShadow: `0 0 2px ${bar.color}`,
                }}
              />
              {/* Razor-Thin Vertical Spectrum Filament */}
              <span
                className="w-[1px] sm:w-[1.2px] h-full rounded-t-sm transition-colors duration-700 opacity-70"
                style={{
                  backgroundColor: bar.color,
                  boxShadow: `0 0 2px ${bar.color}`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Minimal Studio Precision Hardware Baseline with Micro-Ticks (No text) */}
        <div className="w-full border-t border-border/40 bg-background/40 backdrop-blur-sm px-2 sm:px-6 py-1 flex items-center justify-between">
          {Array.from({ length: 33 }).map((_, idx) => (
            <span
              key={idx}
              className={`w-[1px] bg-border/60 transition-colors ${
                idx % 4 === 0 ? "h-2 bg-text-muted/40" : "h-1 bg-border/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Smooth bottom vignette fade into background */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/40 to-transparent z-10"
        aria-hidden="true"
      />
    </div>
  );
}
