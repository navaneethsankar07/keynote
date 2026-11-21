"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import type { Application, SplineEvent } from "@splinetool/runtime";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

const REAL_SONGS = [
  {
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a",
  },
  {
    title: "One of the Girls",
    artist: "The Weeknd, JENNIE & Lily-Rose Depp",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9e/2f/1f/9e2f1f11-20a8-767a-0e33-9029028a7024/mzaf_1603981766065362477.plus.aac.p.m4a",
  },
  {
    title: "Die For You",
    artist: "The Weeknd",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/50/50/1a/50501a86-bd74-e90d-8a56-68c9b5e6e7d6/mzaf_4588197682084244913.plus.aac.p.m4a",
  },
  {
    title: "Save Your Tears",
    artist: "The Weeknd",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8b/38/17/8b3817e4-c0e9-7e02-2654-3e2ecee93603/mzaf_18415642125637540903.plus.aac.p.m4a",
  },
  {
    title: "The Hills",
    artist: "The Weeknd",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0b/70/c8/0b70c898-ec23-3131-5d17-aa7417045013/mzaf_3059117378996578649.plus.aac.p.m4a",
  },
  {
    title: "Creepin'",
    artist: "Metro Boomin, The Weeknd & 21 Savage",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/47/ba/83/47ba83bd-ff6a-d4b2-f126-545a170f0775/mzaf_2932236241939206370.plus.aac.p.m4a",
  },
  {
    title: "Kill Bill",
    artist: "SZA",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/45/2b/ea/452bead6-c7f5-82d4-f5f7-ec876014b4cc/mzaf_2905911853279084717.plus.aac.p.m4a",
  },
  {
    title: "Snooze",
    artist: "SZA",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b3/9b/ca/b39bca57-2627-1aec-77af-cbf551205394/mzaf_4430383240210492712.plus.aac.p.m4a",
  },
  {
    title: "Pink + White",
    artist: "Frank Ocean",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ba/11/dc/ba11dccd-16d2-9cd8-13f0-85b73acc0a09/mzaf_1304250511099243436.plus.aac.p.m4a",
  },
  {
    title: "Saturn",
    artist: "SZA",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7c/28/b3/7c28b3ed-9aa9-6454-92c6-e46d20849bed/mzaf_518591709818271733.plus.aac.p.m4a",
  },
];

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

export function LearnPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTriggerTimeRef = useRef(0);
  const pendingClickRef = useRef<{ clientX: number; clientY: number; relX: number; relY: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const currentSongIndexRef = useRef<number>(-1);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSingSong = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    let nextIdx = Math.floor(Math.random() * REAL_SONGS.length);
    if (nextIdx === currentSongIndexRef.current) {
      nextIdx = (nextIdx + 1) % REAL_SONGS.length;
    }
    currentSongIndexRef.current = nextIdx;

    const song = REAL_SONGS[nextIdx];
    const audio = new Audio(song.audioSrc);
    audioRef.current = audio;

    audio.onplay = () => setIsPlayingSong(true);
    audio.onended = () => {
      setIsPlayingSong(false);
      audioRef.current = null;
    };
    audio.onpause = () => setIsPlayingSong(false);
    audio.onerror = () => {
      setIsPlayingSong(false);
      audioRef.current = null;
    };

    audio.play().catch(() => {
      setIsPlayingSong(false);
    });
  }, []);

  useEffect(() => {
    let animFrame: number;
    const canvas =
      canvasRef.current || sectionRef.current?.querySelector("canvas");
    if (!canvas) return;

    if (!isPlayingSong) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let curX = centerX;
    let curY = centerY;
    const startTime = performance.now();

    const dispatchCoord = (x: number, y: number) => {
      const syntheticEvent = new PointerEvent("pointermove", {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        pointerId: 1,
        pointerType: "mouse",
      });
      Object.defineProperty(syntheticEvent, "pageX", {
        value: x + window.scrollX,
      });
      Object.defineProperty(syntheticEvent, "pageY", {
        value: y + window.scrollY,
      });
      canvas.dispatchEvent(syntheticEvent);
    };

    const grooveLoop = () => {
      const r = canvas.getBoundingClientRect();
      const midX = r.left + r.width / 2;
      const midY = r.top + r.height / 2;

      const elapsed = (performance.now() - startTime) / 1000;
      const beat = elapsed * 3.6;

      const swayX = Math.sin(beat) * (r.width * 0.22);
      const swayY = Math.sin(beat * 2) * (r.height * 0.08);
      const bobY = Math.pow(Math.sin(beat), 2) * (r.height * 0.06);
      const grooveOffset = Math.sin(beat * 0.5) * (r.width * 0.05);

      const targetX = midX + swayX + grooveOffset;
      const targetY = midY + swayY - bobY;

      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;

      dispatchCoord(curX, curY);

      animFrame = requestAnimationFrame(grooveLoop);
    };

    animFrame = requestAnimationFrame(grooveLoop);
    return () => {
      cancelAnimationFrame(animFrame);
      dispatchCoord(centerX, centerY);
    };
  }, [isPlayingSong]);

  const triggerReaction = useCallback(
    (targetName: string, _clientX?: number, _clientY?: number, relY?: number) => {
      const text = getReactionForTarget(targetName, relY);
      if (!text) return;

      const now = Date.now();
      if (now - lastTriggerTimeRef.current < 200) return;
      lastTriggerTimeRef.current = now;

      playCartoonSound();
      speakPhrase(text);
    },
    []
  );

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (isPlayingSong) return;

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
  }, [isPlayingSong]);

  const handlePointerLeave = useCallback(() => {
    if (isPlayingSong) return;

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
  }, [isPlayingSong]);

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
      triggerReaction(
        e.target?.name || "chest",
        coords?.clientX,
        coords?.clientY,
        coords?.relY
      );
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
          triggerReaction(part, e.clientX, e.clientY, relY);
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
              onClick={handleSingSong}
              aria-label="Make character sing"
              className={`absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full backdrop-blur-2xl transition-all duration-300 ease-out active:scale-95 group shadow-2xl cursor-pointer ${
                isPlayingSong
                  ? "bg-white/20 border-2 border-white/50 ring-4 ring-purple-500/30 shadow-[0_0_35px_rgba(168,85,247,0.55),inset_0_1px_2px_rgba(255,255,255,0.6)] scale-105"
                  : "bg-white/[0.10] hover:bg-white/[0.18] border border-white/25 hover:border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:scale-105"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/25 opacity-70 group-hover:opacity-100 transition-opacity" />

              {isPlayingSong ? (
                <div className="relative z-10 flex items-center gap-[3px]">
                  <span className="w-1 h-3.5 bg-white rounded-full animate-[bounce_0.8s_ease-in-out_infinite] [animation-delay:0ms]" />
                  <span className="w-1 h-6 bg-white rounded-full animate-[bounce_0.7s_ease-in-out_infinite] [animation-delay:180ms]" />
                  <span className="w-1 h-4.5 bg-white rounded-full animate-[bounce_0.85s_ease-in-out_infinite] [animation-delay:360ms]" />
                  <span className="w-1 h-2.5 bg-white rounded-full animate-[bounce_0.75s_ease-in-out_infinite] [animation-delay:90ms]" />
                </div>
              ) : (
                <svg
                  className="relative z-10 w-6 h-6 text-white/90 group-hover:text-white transition-transform group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
