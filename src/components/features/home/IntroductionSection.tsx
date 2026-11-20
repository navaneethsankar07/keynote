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
  previewLabel: string;
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
    previewLabel: "Official 30s Preview",
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
    previewLabel: "Official 30s Preview",
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
    previewLabel: "Official 30s Preview",
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
    previewLabel: "Official 30s Preview",
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
    previewLabel: "Official 30s Preview",
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
    previewLabel: "Official 30s Preview",
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
    previewLabel: "Official 30s Preview",
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
    previewLabel: "Official 30s Preview",
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
    previewLabel: "Official 30s Preview",
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
    previewLabel: "Official 30s Preview",
  },
];

// Minimal Player Icons
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

  // Stop previous audio and reset state when switching tracks
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

  // Play / Pause toggle with legitimate audio playback
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

  // Synchronize audio source if audio element was not yet created or src changed
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

  // Seek bar interaction
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

  // Prepare carousel items from real track collection
  const carouselItems = MUSIC_TRACKS.map((t) => ({
    title: t.title,
    src: t.src,
    alt: `${t.title} - ${t.artist}`,
    label: "", // Clean printed CD face
    credits: [
      { label: "Artist", value: t.artist },
      { label: "Album", value: t.album },
      { label: "Year", value: t.year },
    ],
  }));

  return (
    <section
      id="introduction"
      className="relative py-16 sm:py-20 lg:py-24 border-t border-white/5 bg-[#06070d] overflow-hidden"
    >
      {/* Hidden audio element for genuine preview playback */}
      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
      />

      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-32 right-1/4 w-[560px] h-[560px] rounded-full bg-accent-violet/10 blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-cyan/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* 1. Header on top with full width */}
        <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-12">
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.12]">
            Every song has a story{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              beyond its sound.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed font-sans max-w-3xl mx-auto">
            Discover the musical structure hiding beneath the melodies you love.
            Explore rhythm, harmony, instruments, tonal relationships, and the musical
            ideas that bring songs to life.
          </p>
        </div>

        {/* 2. Full-Width 3D Disc Cascade Carousel with Infinite Loop */}
        <div className="relative w-full h-[360px] sm:h-[400px] md:h-[440px] flex items-center justify-center">
          <DiscCascadeCarousel
            items={carouselItems}
            height="100%"
            discSize="clamp(200px, 23vw, 300px)"
            spacing={0.96}
            rise={0.2}
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

        {/* 3. Floating, Compact Full-Width Minimal Player Bar */}
        <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-6 rounded-2xl sm:rounded-full bg-[#0c0e17]/85 border border-white/12 px-5 py-3 sm:px-8 sm:py-3.5 backdrop-blur-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(139,92,246,0.14),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all">
          {/* Top row: Track Info | 5 Controls | Balanced Spacer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            {/* Left: Track Title & Artist */}
            <div className="min-w-0 text-center sm:text-left sm:w-1/3">
              <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-text-muted truncate mt-0.5">
                {currentTrack.artist}
              </p>
            </div>

            {/* Center: Playback Controls (Shuffle, Prev, Play/Pause, Next, Repeat) */}
            <div className="flex items-center justify-center gap-4 sm:gap-5 sm:w-1/3">
              {/* Shuffle */}
              <button
                type="button"
                onClick={() => setIsShuffle((prev) => !prev)}
                aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
                className={`p-1.5 transition-all cursor-pointer ${
                  isShuffle
                    ? "text-accent-violet scale-110"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <ShuffleIcon size={17} />
              </button>

              {/* Previous Track */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous track"
                className="p-1.5 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <PrevTrackIcon size={19} />
              </button>

              {/* Elevated Floating Play / Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                disabled={!currentTrack.audioSrc}
                aria-label={
                  isPlaying
                    ? `Pause ${currentTrack.title}`
                    : `Play ${currentTrack.title}`
                }
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                  !currentTrack.audioSrc
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : isPlaying
                    ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(139,92,246,0.6)] scale-105 active:scale-95"
                    : "bg-white text-slate-950 hover:bg-white/95 hover:scale-105 active:scale-95 shadow-[0_6px_18px_rgba(255,255,255,0.25)]"
                }`}
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <PauseIcon size={19} />
                ) : (
                  <PlayIcon size={19} className="ml-0.5" />
                )}
              </button>

              {/* Next Track */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next track"
                className="p-1.5 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <NextTrackIcon size={19} />
              </button>

              {/* Repeat / Loop */}
              <button
                type="button"
                onClick={() => setIsRepeat((prev) => !prev)}
                aria-label={isRepeat ? "Disable repeat" : "Enable repeat"}
                className={`p-1.5 transition-all cursor-pointer ${
                  isRepeat
                    ? "text-accent-violet scale-110"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <RepeatIcon size={17} />
              </button>
            </div>

            {/* Right: Balanced Empty Spacer for Symmetrical Layout */}
            <div className="hidden sm:block sm:w-1/3" aria-hidden="true" />
          </div>

          {/* Bottom row: Full-Width Scrubber Track with Left & Right Timestamps */}
          <div className="mt-2 sm:mt-2.5 flex items-center gap-3">
            <span className="text-[11px] font-mono text-text-muted shrink-0 w-10 text-right">
              {formatTime(currentTime)}
            </span>

            <div
              ref={seekTrackRef}
              onClick={handleSeek}
              className="h-1.5 flex-1 bg-white/15 hover:bg-white/25 rounded-full cursor-pointer relative group/seek transition-colors"
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
                  className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-100 group-hover/seek:scale-125 transition-transform"
                  aria-hidden="true"
                />
              </div>
            </div>

            <span className="text-[11px] font-mono text-text-muted shrink-0 w-10">
              {audioError ? (
                <span className="text-amber-400 font-sans text-[10px]">{audioError}</span>
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
