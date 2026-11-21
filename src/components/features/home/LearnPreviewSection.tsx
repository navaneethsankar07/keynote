"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import type { Application, SplineEvent } from "@splinetool/runtime";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

const NOTE_FREQS: Record<string, number> = {
  B3: 246.94,
  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "Eb4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392.0,
  "Ab4": 415.3,
  A4: 440.0,
  "A#4": 466.16,
  "Bb4": 466.16,
  B4: 493.88,
  C5: 523.25,
  "C#5": 554.37,
  D5: 587.33,
  "Eb5": 622.25,
  E5: 659.25,
  F5: 698.46,
};

const REAL_SONGS = [
  {
    title: "Never Gonna Give You Up",
    lyrics:
      "Never gonna give you up! Never gonna let you down! Never gonna run around and desert you! Never gonna make you cry! Never gonna say goodbye!",
    tempo: 114,
    notes: ["F4", "G4", "Bb4", "G4", "D5", "D5", "C5", "F4", "G4", "Bb4", "G4", "C5", "C5", "Bb4", "A4", "G4"],
  },
  {
    title: "Bohemian Rhapsody",
    lyrics:
      "Mama! Just killed a man! Put a gun against his head, pulled my trigger now he's dead! Mama! Life had just begun, but now I've gone and thrown it all away!",
    tempo: 76,
    notes: ["Bb4", "D4", "F4", "G4", "Eb4", "G4", "Bb4", "F4", "D4", "Bb4", "C4", "D4", "Eb4", "F4"],
  },
  {
    title: "All Star",
    lyrics:
      "Somebody once told me the world is gonna roll me, I ain't the sharpest tool in the shed! She was looking kind of dumb with her finger and her thumb in the shape of an L on her forehead!",
    tempo: 104,
    notes: ["F#4", "C#5", "A#4", "A#4", "G4", "F#4", "F#4", "B4", "A#4", "A#4", "G4", "G4", "F#4"],
  },
  {
    title: "I Want It That Way",
    lyrics:
      "Tell me why! Ain't nothin' but a heartache! Tell me why! Ain't nothin' but a mistake! Tell me why! I never wanna hear you say, I want it that way!",
    tempo: 100,
    notes: ["F#4", "E4", "D4", "E4", "F#4", "B4", "A4", "G4", "F#4", "E4", "F#4", "D4"],
  },
  {
    title: "Don't Stop Believin'",
    lyrics:
      "Just a small town girl, livin' in a lonely world! She took the midnight train goin' anywhere! Just a city boy, born and raised in South Detroit! Don't stop believin'! Hold on to that feelin'!",
    tempo: 118,
    notes: ["E4", "B4", "G4", "E4", "B4", "C#5", "B4", "A4", "G4", "F#4", "E4"],
  },
  {
    title: "Hey Jude",
    lyrics:
      "Hey Jude, don't make it bad! Take a sad song and make it better! Remember to let her into your heart, then you can start to make it better! Na, na na, na-na-na na!",
    tempo: 78,
    notes: ["C5", "A4", "A4", "C5", "D5", "G4", "G4", "A4", "Bb4", "F5", "F5", "E5", "C5", "D5"],
  },
  {
    title: "Livin' on a Prayer",
    lyrics:
      "Whoa, we're halfway there! Whoa-oh, livin' on a prayer! Take my hand, we'll make it I swear! Whoa-oh, livin' on a prayer!",
    tempo: 122,
    notes: ["E4", "G4", "A4", "B4", "D5", "C5", "B4", "A4", "G4", "A4", "B4", "E4"],
  },
  {
    title: "Billie Jean",
    lyrics:
      "Billie Jean is not my lover! She's just a girl who claims that I am the one, but the kid is not my son! She says I am the one, but the kid is not my son! Hee-hee!",
    tempo: 117,
    notes: ["F#4", "C#4", "E4", "F#4", "E4", "C#4", "B3", "C#4", "F#4", "C#4", "E4", "F#4"],
  },
  {
    title: "Blinding Lights",
    lyrics:
      "I said, ooh, I'm blinded by the lights! No, I can't sleep until I feel your touch! I said, ooh, I'm drowning in the night! Oh, when I'm like this, you're the one I trust!",
    tempo: 170,
    notes: ["F4", "F4", "Eb4", "F4", "G4", "C5", "Bb4", "Ab4", "G4", "F4", "Eb4", "F4"],
  },
  {
    title: "Fly Me to the Moon",
    lyrics:
      "Fly me to the moon, let me play among the stars! Let me see what spring is like on Jupiter and Mars! In other words, hold my hand! In other words, baby, kiss me!",
    tempo: 118,
    notes: ["C5", "B4", "A4", "G4", "F4", "G4", "A4", "C5", "B4", "A4", "G4", "F4", "E4"],
  },
  {
    title: "Eye of the Tiger",
    lyrics:
      "It's the eye of the tiger, it's the thrill of the fight! Risin' up to the challenge of our rival! And the last known survivor stalks his prey in the night, and he's watching us all with the eye of the tiger!",
    tempo: 109,
    notes: ["C4", "C4", "Bb4", "C4", "C4", "Bb4", "C4", "C4", "Eb4", "D4", "C4"],
  },
  {
    title: "Take On Me",
    lyrics:
      "Take on me! Take on me! Take me on! Take on me! I'll be gone, in a day or two!",
    tempo: 168,
    notes: ["B3", "B3", "D4", "G4", "G4", "F#4", "A4", "A4", "A4", "E4", "G4", "G4", "G4", "F#4", "D4"],
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
  const [isSinging, setIsSinging] = useState(false);
  const activeAudioContextRef = useRef<AudioContext | null>(null);
  const lastSongIndexRef = useRef(-1);

  const stopSinging = useCallback(() => {
    setIsSinging(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (activeAudioContextRef.current) {
      try {
        activeAudioContextRef.current.close();
      } catch {}
      activeAudioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopSinging();
    };
  }, [stopSinging]);

  const singSong = useCallback((song: (typeof REAL_SONGS)[number]) => {
    if (typeof window === "undefined") return;

    stopSinging();
    setIsSinging(true);

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        activeAudioContextRef.current = ctx;

        const noteDuration = (60 / song.tempo) * 0.7;
        const now = ctx.currentTime + 0.05;

        const loopNotes = [...song.notes, ...song.notes, ...song.notes];
        loopNotes.forEach((noteStr, idx) => {
          const freq = NOTE_FREQS[noteStr];
          if (!freq) return;

          const startTime = now + idx * noteDuration;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration * 0.9);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + noteDuration);
        });
      }
    } catch {}

    if ("speechSynthesis" in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(song.lyrics);
        const maleVoice = getMaleVoice();
        if (maleVoice) {
          utterance.voice = maleVoice;
        }
        utterance.pitch = 0.95;
        utterance.rate = 1.08;
        utterance.volume = 1;

        utterance.onend = () => {
          stopSinging();
        };

        utterance.onerror = () => {
          stopSinging();
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        stopSinging();
      }
    }
  }, [stopSinging]);

  const handleSingRandomSong = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    let nextIdx: number;
    do {
      nextIdx = Math.floor(Math.random() * REAL_SONGS.length);
    } while (nextIdx === lastSongIndexRef.current && REAL_SONGS.length > 1);
    lastSongIndexRef.current = nextIdx;

    singSong(REAL_SONGS[nextIdx]);
  }, [singSong]);

  const triggerReaction = useCallback(
    (targetName: string, clientX?: number, clientY?: number, relY?: number) => {
      const text = getReactionForTarget(targetName, relY);
      if (!text) return;

      const now = Date.now();
      if (now - lastTriggerTimeRef.current < 200) return;
      lastTriggerTimeRef.current = now;

      stopSinging();
      playCartoonSound();
      speakPhrase(text);
    },
    [stopSinging]
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
            <button
              type="button"
              onClick={handleSingRandomSong}
              aria-label="Sing a song"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/[0.08] hover:bg-white/[0.18] active:scale-95 border border-white/20 hover:border-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              {isSinging ? (
                <div className="flex items-end justify-center gap-1 h-5 w-5">
                  <span className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-4" />
                  <span className="w-1 bg-violet-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-5" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
                </div>
              ) : (
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors group-hover:scale-110 duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              )}
            </button>

            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
              onSplineMouseDown={handleSplineMouseDown}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
