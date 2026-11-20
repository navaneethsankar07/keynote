"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import DiscCascadeCarousel from "@/components/ui/disc-cascade-carousel";

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: string;
  src: string;
  audioSrc?: string;
  key: string;
  bpm: number;
  timeSignature: string;
  groove: string;
}

const MUSIC_TRACKS: TrackItem[] = [
  {
    id: "one-of-the-girls",
    title: "One of the Girls",
    artist: "The Weeknd, JENNIE & Lily-Rose Depp",
    album: "The Idol Episode 4",
    year: "2023",
    src: "/images/discs/one-of-the-girls.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9e/2f/1f/9e2f1f11-20a8-767a-0e33-9029028a7024/mzaf_1603981766065362477.plus.aac.p.m4a",
    key: "B Minor",
    bpm: 118,
    timeSignature: "4/4",
    groove: "Slow Jam R&B",
  },
  {
    id: "starboy",
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    year: "2016",
    src: "/images/discs/starboy.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a",
    key: "G Minor",
    bpm: 93,
    timeSignature: "4/4",
    groove: "Synthwave Pulse",
  },
  {
    id: "die-for-you",
    title: "Die For You",
    artist: "The Weeknd",
    album: "Starboy",
    year: "2016",
    src: "/images/discs/die-for-you.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/50/50/1a/50501a86-bd74-e90d-8a56-68c9b5e6e7d6/mzaf_4588197682084244913.plus.aac.p.m4a",
    key: "C# Minor",
    bpm: 134,
    timeSignature: "4/4",
    groove: "Electro Ballad",
  },
  {
    id: "save-your-tears",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    year: "2020",
    src: "/images/discs/save-your-tears.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8b/38/17/8b3817e4-c0e9-7e02-2654-3e2ecee93603/mzaf_18415642125637540903.plus.aac.p.m4a",
    key: "C Major",
    bpm: 118,
    timeSignature: "4/4",
    groove: "Synth-pop Beat",
  },
  {
    id: "kill-bill",
    title: "Kill Bill",
    artist: "SZA",
    album: "SOS",
    year: "2022",
    src: "/images/discs/kill-bill.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/45/2b/ea/452bead6-c7f5-82d4-f5f7-ec876014b4cc/mzaf_2905911853279084717.plus.aac.p.m4a",
    key: "A Minor",
    bpm: 89,
    timeSignature: "4/4",
    groove: "Boom-Bap R&B",
  },
  {
    id: "snooze",
    title: "Snooze",
    artist: "SZA",
    album: "SOS",
    year: "2022",
    src: "/images/discs/snooze.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b3/9b/ca/b39bca57-2627-1aec-77af-cbf551205394/mzaf_4430383240210492712.plus.aac.p.m4a",
    key: "F Major",
    bpm: 143,
    timeSignature: "4/4",
    groove: "Soul Swing",
  },
  {
    id: "the-hills",
    title: "The Hills",
    artist: "The Weeknd",
    album: "Beauty Behind the Madness",
    year: "2015",
    src: "/images/discs/the-hills.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0b/70/c8/0b70c898-ec23-3131-5d17-aa7417045013/mzaf_3059117378996578649.plus.aac.p.m4a",
    key: "C Minor",
    bpm: 113,
    timeSignature: "4/4",
    groove: "Trap R&B",
  },
  {
    id: "creepin",
    title: "Creepin'",
    artist: "Metro Boomin, The Weeknd & 21 Savage",
    album: "HEROES & VILLAINS",
    year: "2022",
    src: "/images/discs/creepin.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/47/ba/83/47ba83bd-ff6a-d4b2-f126-545a170f0775/mzaf_2932236241939206370.plus.aac.p.m4a",
    key: "C# Minor",
    bpm: 98,
    timeSignature: "4/4",
    groove: "Cinematic R&B",
  },
  {
    id: "pink-and-white",
    title: "Pink + White",
    artist: "Frank Ocean",
    album: "Blonde",
    year: "2016",
    src: "/images/discs/pink-and-white.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ba/11/dc/ba11dccd-16d2-9cd8-13f0-85b73acc0a09/mzaf_1304250511099243436.plus.aac.p.m4a",
    key: "A Major",
    bpm: 160,
    timeSignature: "6/8",
    groove: "Neo-Soul Waltz",
  },
  {
    id: "saturn",
    title: "Saturn",
    artist: "SZA",
    album: "Saturn",
    year: "2024",
    src: "/images/discs/saturn.jpg",
    audioSrc:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7c/28/b3/7c28b3ed-9aa9-6454-92c6-e46d20849bed/mzaf_518591709818271733.plus.aac.p.m4a",
    key: "B Major",
    bpm: 178,
    timeSignature: "4/4",
    groove: "Dream R&B",
  },
];

function ShuffleIcon({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

function PrevTrackIcon({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <polygon points="19 20 9 12 19 4 19 20" />
      <line
        x1="5"
        y1="19"
        x2="5"
        y2="5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function PauseIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function NextTrackIcon({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <polygon points="5 4 15 12 5 20 5 4" />
      <line
        x1="19"
        y1="5"
        x2="19"
        y2="19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RepeatIcon({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function IntroductionSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekTrackRef = useRef<HTMLDivElement>(null);

  const currentTrack = MUSIC_TRACKS[selectedIndex] ?? MUSIC_TRACKS[0];

  const handleIndexChange = useCallback(
    (index: number, autoPlay: boolean = false) => {
      setSelectedIndex(index);
      setCurrentTime(0);
      setAudioError(null);
      setIsLoading(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = MUSIC_TRACKS[index]?.audioSrc || "";
        audioRef.current.load();
        if (autoPlay && MUSIC_TRACKS[index]?.audioSrc) {
          setIsLoading(true);
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(() => {
              setIsPlaying(false);
              setIsLoading(false);
            });
          return;
        }
      }
      setIsPlaying(false);
    },
    []
  );

  const handleNext = () => {
    if (isShuffle) {
      let nextIdx = Math.floor(Math.random() * MUSIC_TRACKS.length);
      if (nextIdx === selectedIndex) {
        nextIdx = (selectedIndex + 1) % MUSIC_TRACKS.length;
      }
      handleIndexChange(nextIdx, isPlaying);
    } else {
      const nextIdx = (selectedIndex + 1) % MUSIC_TRACKS.length;
      handleIndexChange(nextIdx, isPlaying);
    }
  };

  const handlePrev = () => {
    const prevIdx =
      (selectedIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    handleIndexChange(prevIdx, isPlaying);
  };

  const togglePlay = () => {
    if (!currentTrack.audioSrc) {
      setAudioError("Preview unavailable");
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setAudioError(null);

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
          setIsLoading(false);
          setAudioError("Unable to play preview");
        });
    }
  };

  useEffect(() => {
    if (audioRef.current && !audioRef.current.src) {
      audioRef.current.src = currentTrack.audioSrc || "";
      audioRef.current.load();
    }
  }, [currentTrack.audioSrc]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      handleNext();
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    setAudioError("Preview unavailable");
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekTrackRef.current || !audioRef.current || !duration) return;
    const rect = seekTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const mins = Math.floor(secs / 60);
    const remSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const carouselItems = MUSIC_TRACKS.map((t) => ({
    title: t.title,
    src: t.src,
    alt: `${t.title} - ${t.artist}`,
    label: "",
    credits: [
      { label: "Artist", value: t.artist },
      { label: "Key", value: t.key },
      { label: "BPM", value: `${t.bpm}` },
      { label: "Time", value: t.timeSignature },
    ],
  }));

  return (
    <section
      id="introduction"
      className="relative min-h-screen lg:h-screen flex flex-col justify-between border-t border-white/5 bg-[#06070d] overflow-hidden pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 sm:px-8"
    >
      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
      />

      <div
        className="pointer-events-none absolute -top-32 right-1/4 w-[560px] h-[560px] rounded-full bg-accent-violet/10 blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-cyan/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto shrink-0 pt-2 sm:pt-4">
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.12]">
          Every song has a story{" "}
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            beyond its sound.
          </span>
        </h2>

        <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-text-secondary leading-relaxed font-sans max-w-3xl mx-auto">
          Discover the musical structure hiding beneath the melodies you love.
          Explore rhythm, harmony, instruments, tonal relationships, and the musical
          ideas that bring songs to life.
        </p>
      </div>

      <div className="relative z-10 w-full flex-1 min-h-[350px] md:min-h-[380px] flex items-center justify-center my-auto">
        <DiscCascadeCarousel
          items={carouselItems}
          height="110%"
          discSize="clamp(170px, 18vw, 260px)"
          spacing={0.96}
          rise={0.18}
          depth={0.4}
          yaw={20}
          fan={-9}
          tilt={-5}
          roll={100}
          loop={true}
          spin={isPlaying ? 12 : 24}
          background="transparent"
          color="rgba(255,255,255,0.92)"
          frame={false}
          details={false}
          reviews={false}
          controls={true}
          indexLabel=""
          hint="Drag, swipe, or click discs"
          defaultIndex={0}
          index={selectedIndex}
          onIndexChange={(idx) => handleIndexChange(idx, false)}
          ariaLabel="Featured CD Carousel"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mt-auto pb-2 sm:pb-4 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="w-full flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="min-w-0 text-center md:text-left md:w-1/3">
              <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight truncate">
                {currentTrack.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary truncate mt-0.5">
                {currentTrack.artist}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-6 md:w-1/3">
              <button
                type="button"
                onClick={() => setIsShuffle((prev) => !prev)}
                aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
                className={`p-2 transition-all cursor-pointer ${isShuffle
                  ? "text-accent-violet scale-110"
                  : "text-white/60 hover:text-white"
                  }`}
              >
                <ShuffleIcon size={20} />
              </button>

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous track"
                className="p-2 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <PrevTrackIcon size={22} />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                disabled={!currentTrack.audioSrc}
                aria-label={
                  isPlaying
                    ? `Pause ${currentTrack.title}`
                    : `Play ${currentTrack.title}`
                }
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${!currentTrack.audioSrc
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : isPlaying
                    ? "bg-accent-violet transition-all duration-500 ease-out text-white shadow-[0_0_30px_rgba(139,92,246,0.6)] scale-105 active:scale-95"
                    : "bg-white text-slate-950 hover:bg-white/95 hover:scale-105 active:scale-95 shadow-[0_8px_25px_rgba(255,255,255,0.3)]"
                  }`}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <PauseIcon size={24} />
                ) : (
                  <PlayIcon size={24} className="ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next track"
                className="p-2 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <NextTrackIcon size={22} />
              </button>

              <button
                type="button"
                onClick={() => setIsRepeat((prev) => !prev)}
                aria-label={isRepeat ? "Disable repeat" : "Enable repeat"}
                className={`p-2 transition-all cursor-pointer ${isRepeat
                  ? "text-accent-violet scale-110"
                  : "text-white/60 hover:text-white"
                  }`}
              >
                <RepeatIcon size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center md:justify-end md:w-1/3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs">
                <span className="text-text-muted text-[10px] font-mono uppercase tracking-wider">Key</span>
                <span className="font-semibold text-purple-300 font-mono">{currentTrack.key}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs">
                <span className="text-text-muted text-[10px] font-mono uppercase tracking-wider">Tempo</span>
                <span className="font-semibold text-cyan-300 font-mono">{currentTrack.bpm} BPM</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs">
                <span className="text-text-muted text-[10px] font-mono uppercase tracking-wider">Time</span>
                <span className="font-semibold text-white font-mono">{currentTrack.timeSignature}</span>
              </div>
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs">
                <span className="text-text-muted text-[10px] font-mono uppercase tracking-wider">Rhythm</span>
                <span className="font-medium text-indigo-200">{currentTrack.groove}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm font-mono text-text-muted shrink-0 w-12 text-right">
              {formatTime(currentTime)}
            </span>

            <div
              ref={seekTrackRef}
              onClick={handleSeek}
              className="h-2 flex-1 bg-white/15 hover:bg-white/25 rounded-full cursor-pointer relative group/seek transition-colors"
              role="progressbar"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={duration || 30}
              aria-label="Seek progress"
            >
              <div
                className="h-full bg-white rounded-full relative"
                style={{ width: `${progressPercent}%` }}
              >
                <span
                  className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] scale-100 group-hover/seek:scale-125 transition-transform"
                  aria-hidden="true"
                />
              </div>
            </div>

            <span className="text-xs sm:text-sm font-mono text-text-muted shrink-0 w-12">
              {audioError ? (
                <span className="text-amber-400 font-sans text-xs">{audioError}</span>
              ) : (
                formatTime(duration || 30)
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
