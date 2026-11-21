"use client";

import React, { useRef, useCallback, useState } from "react";
import type { Application, SplineEvent } from "@splinetool/runtime";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

const isInsideBody = (relX: number, relY: number): boolean => {
  if (relY < 0.20 || relY > 0.96) return false;
  if (relX < 0.18 || relX > 0.78) return false;

  if (relY < 0.46) {
    return relX >= 0.35 && relX <= 0.62;
  }

  if (relY <= 0.74) {
    return relX >= 0.18 && relX <= 0.78;
  }

  return relX >= 0.28 && relX <= 0.68;
};

const getReactionForTarget = (name: string, relativeY?: number): string | null => {
  const lower = name.toLowerCase();

  if (
    lower.includes("rectangle") ||
    lower.includes("scene") ||
    lower.includes("camera") ||
    lower.includes("light") ||
    lower.includes("plane") ||
    lower.includes("background")
  ) {
    return null;
  }

  if (lower.includes("neck")) {
    const neckPhrases = [
      "Ow, my neck!",
      "Hey, don't choke me!",
      "Ouch, watch the neck!",
      "Hey, ticklish neck!",
    ];
    return neckPhrases[Math.floor(Math.random() * neckPhrases.length)];
  }

  if (lower.includes("eye")) {
    const eyePhrases = [
      "Ohh, my eye!",
      "Ow! Not my eye!",
      "Hey, watch my eye!",
      "My eye! I need that to see!",
    ];
    return eyePhrases[Math.floor(Math.random() * eyePhrases.length)];
  }

  if (lower.includes("head") || lower.includes("hair")) {
    const headPhrases = [
      "Ouch! Watch my head!",
      "Ow, my head!",
      "Hey, watch the hair!",
      "Don't touch my head!",
    ];
    return headPhrases[Math.floor(Math.random() * headPhrases.length)];
  }

  if (lower.includes("ear")) {
    const earPhrases = [
      "Ow, my ear!",
      "Hey, that's my ear!",
      "Too close to the ear!",
    ];
    return earPhrases[Math.floor(Math.random() * earPhrases.length)];
  }

  if (lower.includes("chest")) {
    const chestPhrases = [
      "Ouch, my chest!",
      "Hey, what are you doing to my chest?!",
      "Oof, right in the chest!",
      "Don't poke my chest!",
    ];
    return chestPhrases[Math.floor(Math.random() * chestPhrases.length)];
  }

  if (
    lower.includes("belly") ||
    lower.includes("stomach") ||
    lower.includes("pelvic") ||
    lower.includes("bottom")
  ) {
    const bellyPhrases = [
      "Ouch! That tickles!",
      "Oof, not the belly!",
      "Hey, personal space!",
      "Watch the gut, man!",
    ];
    return bellyPhrases[Math.floor(Math.random() * bellyPhrases.length)];
  }

  if (lower.includes("body") || lower.includes("fusedbody")) {
    if (relativeY !== undefined && relativeY >= 0.6) {
      const bellyPhrases = [
        "Ouch! That tickles!",
        "Oof, not the belly!",
        "Hey, personal space!",
      ];
      return bellyPhrases[Math.floor(Math.random() * bellyPhrases.length)];
    }
    const chestPhrases = [
      "Ouch, my chest!",
      "Hey, what are you doing to my chest?!",
      "Oof, right in the chest!",
    ];
    return chestPhrases[Math.floor(Math.random() * chestPhrases.length)];
  }

  if (
    lower.includes("arm") ||
    lower.includes("hand") ||
    lower.includes("forearm") ||
    lower.includes("elbow")
  ) {
    const armPhrases = [
      "Hey, that's my hand!",
      "Don't grab my arm!",
      "What are you doing?!",
      "Hey, hands off!",
    ];
    return armPhrases[Math.floor(Math.random() * armPhrases.length)];
  }

  if (
    lower.includes("leg") ||
    lower.includes("foot") ||
    lower.includes("femur") ||
    lower.includes("shin")
  ) {
    const legPhrases = [
      "Ow, my leg!",
      "Hey, watch my feet!",
      "Oof, watch your step!",
      "That's my shin, ow!",
    ];
    return legPhrases[Math.floor(Math.random() * legPhrases.length)];
  }

  if (lower.includes("cube") || lower.includes("cylinder")) {
    if (relativeY !== undefined) {
      if (relativeY >= 0.38 && relativeY < 0.46) {
        return "Ow, my neck!";
      }
      if (relativeY < 0.38) {
        return "Ouch! Watch my head!";
      }
    }
    return "Ouch, my chest!";
  }

  return null;
};

const playCartoonSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch {}
};

const getMaleVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const english = voices.filter((v) => v.lang.startsWith("en"));
  const pool = english.length > 0 ? english : voices;

  const preferred = pool.find((v) =>
    /(male|david|alex|fred|daniel|george|james|guy|tom|oliver|aaron|mark)/i.test(v.name)
  );

  const fallbackNonFemale = pool.find(
    (v) => !/(female|woman|zira|samantha|victoria|karen|fiona|moira|veena|cynthia)/i.test(v.name)
  );

  return preferred || fallbackNonFemale || pool[0];
};

const speakPhrase = (phrase: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    const maleVoice = getMaleVoice();
    if (maleVoice) {
      utterance.voice = maleVoice;
    }
    utterance.pitch = 0.82;
    utterance.rate = 1.12;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  } catch {}
};

interface Song {
  lines: { text: string; pitch: number; rate: number }[];
  melody: { freq: number; duration: number }[];
}

const SONGS: Song[] = [
  {
    lines: [
      { text: "Never gonna give you up,", pitch: 1.05, rate: 1.15 },
      { text: "Never gonna let you down!", pitch: 0.95, rate: 1.15 },
      { text: "Never gonna run around and desert you!", pitch: 1.12, rate: 1.25 },
      { text: "Never gonna make you cry, oh yeah!", pitch: 1.25, rate: 1.2 },
    ],
    melody: [
      { freq: 261.63, duration: 0.2 },
      { freq: 293.66, duration: 0.2 },
      { freq: 329.63, duration: 0.25 },
      { freq: 392.0, duration: 0.35 },
      { freq: 440.0, duration: 0.3 },
      { freq: 523.25, duration: 0.5 },
    ],
  },
  {
    lines: [
      { text: "Is this the real life?", pitch: 0.85, rate: 1.05 },
      { text: "Or is this just fantasy?", pitch: 0.95, rate: 1.1 },
      { text: "Caught in a landslide, no escape from reality!", pitch: 1.1, rate: 1.2 },
      { text: "Mamaaa, ooh-ooh-ooh!", pitch: 1.35, rate: 0.95 },
    ],
    melody: [
      { freq: 349.23, duration: 0.3 },
      { freq: 392.0, duration: 0.3 },
      { freq: 440.0, duration: 0.35 },
      { freq: 349.23, duration: 0.4 },
      { freq: 523.25, duration: 0.6 },
    ],
  },
  {
    lines: [
      { text: "Sweet Caroline!", pitch: 1.15, rate: 1.05 },
      { text: "Ba, ba, baaa!", pitch: 1.35, rate: 1.15 },
      { text: "Good times never seemed so good!", pitch: 1.1, rate: 1.15 },
      { text: "So good! So good! So good!", pitch: 1.28, rate: 1.25 },
    ],
    melody: [
      { freq: 392.0, duration: 0.25 },
      { freq: 440.0, duration: 0.25 },
      { freq: 493.88, duration: 0.3 },
      { freq: 587.33, duration: 0.4 },
      { freq: 523.25, duration: 0.5 },
    ],
  },
  {
    lines: [
      { text: "Fly me to the moon,", pitch: 1.0, rate: 1.05 },
      { text: "And let me play among the stars!", pitch: 1.15, rate: 1.15 },
      { text: "Let me see what spring is like on Jupiter and Mars!", pitch: 1.08, rate: 1.2 },
      { text: "In other words... Do be do be doo!", pitch: 1.25, rate: 1.1 },
    ],
    melody: [
      { freq: 440.0, duration: 0.25 },
      { freq: 392.0, duration: 0.25 },
      { freq: 349.23, duration: 0.3 },
      { freq: 329.63, duration: 0.3 },
      { freq: 293.66, duration: 0.5 },
    ],
  },
  {
    lines: [
      { text: "Whether you're a brother or whether you're a mother,", pitch: 0.92, rate: 1.25 },
      { text: "You're stayin' alive, stayin' alive!", pitch: 1.28, rate: 1.2 },
      { text: "Feel the city breakin' and everybody shakin'!", pitch: 1.0, rate: 1.25 },
      { text: "Ah, ha, ha, ha, stayin' alive, stayin' alive!", pitch: 1.35, rate: 1.2 },
    ],
    melody: [
      { freq: 349.23, duration: 0.2 },
      { freq: 392.0, duration: 0.2 },
      { freq: 440.0, duration: 0.25 },
      { freq: 523.25, duration: 0.4 },
      { freq: 587.33, duration: 0.45 },
    ],
  },
  {
    lines: [
      { text: "Just a small town girl,", pitch: 0.95, rate: 1.1 },
      { text: "Livin' in a lonely world!", pitch: 1.05, rate: 1.15 },
      { text: "Don't stop believin'!", pitch: 1.25, rate: 1.1 },
      { text: "Hold on to that feelin'! Oh-whoa-oh!", pitch: 1.32, rate: 1.15 },
    ],
    melody: [
      { freq: 329.63, duration: 0.25 },
      { freq: 392.0, duration: 0.25 },
      { freq: 493.88, duration: 0.35 },
      { freq: 440.0, duration: 0.35 },
      { freq: 523.25, duration: 0.5 },
    ],
  },
  {
    lines: [
      { text: "Somebody once told me the world is gonna roll me,", pitch: 0.95, rate: 1.25 },
      { text: "I ain't the sharpest tool in the shed!", pitch: 0.9, rate: 1.25 },
      { text: "Hey now, you're an all star, get your game on, go play!", pitch: 1.22, rate: 1.2 },
      { text: "Only shooting stars break the mold!", pitch: 1.18, rate: 1.25 },
    ],
    melody: [
      { freq: 392.0, duration: 0.2 },
      { freq: 440.0, duration: 0.2 },
      { freq: 392.0, duration: 0.2 },
      { freq: 493.88, duration: 0.35 },
      { freq: 523.25, duration: 0.5 },
    ],
  },
  {
    lines: [
      { text: "Work it harder, make it better,", pitch: 0.95, rate: 1.2 },
      { text: "Do it faster, makes us stronger!", pitch: 1.1, rate: 1.2 },
      { text: "More than ever, hour after, our work is never over!", pitch: 1.25, rate: 1.25 },
      { text: "Around the world, around the world! Beep boop!", pitch: 1.32, rate: 1.2 },
    ],
    melody: [
      { freq: 261.63, duration: 0.2 },
      { freq: 329.63, duration: 0.2 },
      { freq: 392.0, duration: 0.25 },
      { freq: 523.25, duration: 0.35 },
      { freq: 659.25, duration: 0.45 },
    ],
  },
];

const playSongMelody = (notes: { freq: number; duration: number }[]) => {
  if (typeof window === "undefined") return () => {};
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return () => {};
    const ctx = new AudioContextClass();
    let startTime = ctx.currentTime + 0.05;
    const oscs: OscillatorNode[] = [];

    notes.forEach(({ freq, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
      oscs.push(osc);
      startTime += duration;
    });

    return () => {
      try {
        oscs.forEach((osc) => {
          try {
            osc.stop();
          } catch {}
        });
        ctx.close();
      } catch {}
    };
  } catch {
    return () => {};
  }
};

const singSong = (
  song: Song,
  onFinish?: () => void
): (() => void) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onFinish?.();
    return () => {};
  }

  let isCanceled = false;
  window.speechSynthesis.cancel();
  const stopMelody = playSongMelody(song.melody);
  const maleVoice = getMaleVoice();

  let lineIndex = 0;
  const speakNextLine = () => {
    if (isCanceled || lineIndex >= song.lines.length) {
      if (!isCanceled) {
        onFinish?.();
      }
      return;
    }

    const line = song.lines[lineIndex];
    lineIndex++;

    const utterance = new SpeechSynthesisUtterance(line.text);
    if (maleVoice) {
      utterance.voice = maleVoice;
    }
    utterance.pitch = line.pitch;
    utterance.rate = line.rate;
    utterance.volume = 1;

    utterance.onend = () => {
      if (!isCanceled) {
        speakNextLine();
      }
    };

    utterance.onerror = () => {
      if (!isCanceled) {
        onFinish?.();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNextLine();

  return () => {
    isCanceled = true;
    window.speechSynthesis.cancel();
    stopMelody();
  };
};

export function LearnPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSinging, setIsSinging] = useState(false);
  const stopSingingRef = useRef<(() => void) | null>(null);
  const lastSongIndexRef = useRef<number>(-1);
  const lastTriggerTimeRef = useRef(0);
  const pendingClickRef = useRef<{ clientX: number; clientY: number; relX: number; relY: number } | null>(null);

  const handleSingClick = useCallback(() => {
    if (stopSingingRef.current) {
      stopSingingRef.current();
      stopSingingRef.current = null;
    }

    let nextIndex = Math.floor(Math.random() * SONGS.length);
    if (SONGS.length > 1 && nextIndex === lastSongIndexRef.current) {
      nextIndex = (nextIndex + 1) % SONGS.length;
    }
    lastSongIndexRef.current = nextIndex;

    setIsSinging(true);
    stopSingingRef.current = singSong(SONGS[nextIndex], () => {
      setIsSinging(false);
      stopSingingRef.current = null;
    });
  }, []);

  const triggerReaction = useCallback(
    (targetName: string, relY?: number) => {
      const text = getReactionForTarget(targetName, relY);
      if (!text) return;

      if (stopSingingRef.current) {
        stopSingingRef.current();
        stopSingingRef.current = null;
        setIsSinging(false);
      }

      const now = Date.now();
      if (now - lastTriggerTimeRef.current < 200) return;
      lastTriggerTimeRef.current = now;

      playCartoonSound();
      speakPhrase(text);
    },
    []
  );

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const canvas =
      canvasRef.current || sectionRef.current?.querySelector("canvas");
    if (!canvas) return;

    if (e.target !== canvas && !canvas.contains(e.target as Node)) {
      canvas.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));

      const syntheticEvent = new PointerEvent("pointermove", {
        bubbles: true,
        cancelable: true,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        pointerId: e.pointerId ?? 1,
        pointerType: e.pointerType ?? "mouse",
      });

      Object.defineProperty(syntheticEvent, "pageX", {
        value: e.pageX || e.clientX + window.scrollX,
      });
      Object.defineProperty(syntheticEvent, "pageY", {
        value: e.pageY || e.clientY + window.scrollY,
      });

      canvas.dispatchEvent(syntheticEvent);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    const canvas =
      canvasRef.current || sectionRef.current?.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const centerEvent = new PointerEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
      pointerId: 1,
      pointerType: "mouse",
    });

    Object.defineProperty(centerEvent, "pageX", {
      value: centerX + window.scrollX,
    });
    Object.defineProperty(centerEvent, "pageY", {
      value: centerY + window.scrollY,
    });

    canvas.dispatchEvent(centerEvent);
  }, []);

  const handleSplineLoad = useCallback((app: Application) => {
    canvasRef.current = app.canvas;
  }, []);

  const handleSplineMouseDown = useCallback(
    (e: SplineEvent) => {
      const coords = pendingClickRef.current;
      pendingClickRef.current = null;
      if (coords && !isInsideBody(coords.relX, coords.relY)) {
        return;
      }
      triggerReaction(e.target?.name || "chest", coords?.relY);
    },
    [triggerReaction]
  );

  const handleCanvasContainerPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current || e.currentTarget.querySelector("canvas");
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      if (!isInsideBody(relX, relY)) return;

      pendingClickRef.current = { clientX: e.clientX, clientY: e.clientY, relX, relY };

      let part = "chest";
      if (relX < 0.35 || relX > 0.65) {
        if (relY > 0.38 && relY < 0.74) {
          part = "arm";
        }
      }
      if (part !== "arm") {
        if (relY < 0.30) {
          part = "head";
        } else if (relY < 0.38) {
          part = "eye";
        } else if (relY < 0.46) {
          part = "neck";
        } else if (relY < 0.60) {
          part = "chest";
        } else if (relY < 0.74) {
          part = "belly";
        } else {
          part = "leg";
        }
      }

      setTimeout(() => {
        if (pendingClickRef.current) {
          triggerReaction(part, relY);
          pendingClickRef.current = null;
        }
      }, 60);
    },
    [triggerReaction]
  );

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative py-20 sm:py-28 md:py-32 border-t border-white/5 bg-[#07080e]/50 overflow-hidden"
    >
      <Spotlight
        className="-top-40 left-0 md:left-40 lg:left-60 md:-top-20"
        fill="white"
      />

      <div className="pointer-events-none absolute -top-24 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-violet/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 w-[450px] h-[450px] rounded-full bg-accent-cyan/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 min-h-[500px]">
          <div className="flex-1 flex flex-col justify-center items-start text-left max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Understand the language{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                of music.
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-neutral-300 max-w-xl leading-relaxed font-sans">
              Learn music theory through clear explanations, visual demonstrations, guided
              lessons, and examples connected to the music you already love.
            </p>

            <div className="mt-8 sm:mt-10 flex items-center gap-4">
              <Button
                href="/learn"
                variant="primary"
                size="lg"
                icon={<ArrowRightIcon size={18} />}
                iconPosition="right"
              >
                Explore the learning hub
              </Button>
            </div>
          </div>

          <div
            onPointerDown={handleCanvasContainerPointerDown}
            className="flex-1 relative w-full h-[420px] sm:h-[480px] lg:h-[580px] min-h-[400px]"
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
              onSplineMouseDown={handleSplineMouseDown}
            />

            <button
              type="button"
              onClick={handleSingClick}
              onPointerDown={(e) => e.stopPropagation()}
              title="Sing a song"
              aria-label="Make character sing"
              className={`absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none ${
                isSinging
                  ? "bg-white/[0.18] border-accent-violet/60 ring-2 ring-accent-violet/60 shadow-[0_0_25px_rgba(139,92,246,0.6)]"
                  : "bg-white/[0.08] hover:bg-white/[0.18] border-white/20 hover:border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
              }`}
            >
              <svg
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                  isSinging
                    ? "text-accent-cyan scale-110 animate-pulse"
                    : "text-white/80 group-hover:text-white"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
