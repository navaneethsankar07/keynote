import { AudioFileMetadata, AudioValidationError } from "@/types/analyzer";

export const MAX_AUDIO_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_AUDIO_FILE_SIZE_MB = 50;

export const SUPPORTED_AUDIO_EXTENSIONS = [
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".ogg",
  ".flac",
  ".webm",
];

export const SUPPORTED_AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
  "audio/ogg",
  "audio/flac",
  "audio/x-flac",
  "audio/webm",
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  return `${paddedMins}:${paddedSecs}`;
}

export function extractAudioPeaks(
  audioBuffer: AudioBuffer,
  targetCount: number = 100
): number[] {
  const channelData = audioBuffer.getChannelData(0);
  const totalSamples = channelData.length;
  const blockSize = Math.floor(totalSamples / targetCount);
  const peaks: number[] = [];

  let maxPeak = 0;

  for (let i = 0; i < targetCount; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, totalSamples);
    let peak = 0;

    for (let j = start; j < end; j += 4) {
      const val = Math.abs(channelData[j]);
      if (val > peak) peak = val;
    }

    peaks.push(peak);
    if (peak > maxPeak) maxPeak = peak;
  }

  // Normalize between 0.08 and 1.0 for aesthetic visualizer representation
  return peaks.map((p) => {
    if (maxPeak === 0) return 0.15;
    const norm = p / maxPeak;
    return Math.max(0.08, Math.min(1.0, norm));
  });
}

/**
 * Validates audio file constraints: format, size, duration, and decodability.
 */
export async function validateAndDecodeAudio(
  file: File
): Promise<
  | { success: true; metadata: AudioFileMetadata }
  | { success: false; error: AudioValidationError }
> {
  // 1. File existence check
  if (!file) {
    return {
      success: false,
      error: {
        title: "No file selected",
        message: "Please choose or drop an audio file to begin analysis.",
      },
    };
  }

  // 2. Size validation
  if (file.size === 0) {
    return {
      success: false,
      error: {
        title: "Empty file",
        message: "The selected file is empty (0 bytes). Please select a valid audio file.",
      },
    };
  }

  if (file.size > MAX_AUDIO_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: {
        title: "File exceeds size limit",
        message: `File size (${formatFileSize(file.size)}) exceeds the maximum allowed limit of ${MAX_AUDIO_FILE_SIZE_MB}MB.`,
      },
    };
  }

  // 3. Extension and MIME type check
  const fileName = file.name.toLowerCase();
  const hasValidExt = SUPPORTED_AUDIO_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  const hasValidMime = file.type
    ? SUPPORTED_AUDIO_MIME_TYPES.includes(file.type.toLowerCase()) || file.type.startsWith("audio/")
    : false;

  if (!hasValidExt && !hasValidMime) {
    return {
      success: false,
      error: {
        title: "Unsupported audio format",
        message: `"${file.name}" is not a supported audio format. Supported formats: MP3, WAV, M4A, AAC, OGG, and FLAC.`,
      },
    };
  }

  // Create temporary object URL for audio preview
  const objectUrl = URL.createObjectURL(file);

  try {
    // 4. Decode audio using Web Audio API
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtxClass) {
      // Fallback to HTMLAudioElement if Web Audio API is unavailable
      const duration = await getAudioDurationViaElement(objectUrl);
      if (duration <= 0 || !isFinite(duration)) {
        URL.revokeObjectURL(objectUrl);
        return {
          success: false,
          error: {
            title: "Audio duration unavailable",
            message: "The audio file does not contain a usable playback duration.",
          },
        };
      }

      // Generate synthetic fallback peaks
      const fallbackPeaks = generateSyntheticPeaks(100);

      return {
        success: true,
        metadata: {
          file,
          fileName: file.name,
          fileSizeBytes: file.size,
          fileSizeFormatted: formatFileSize(file.size),
          fileType: file.type || "audio/" + file.name.split(".").pop(),
          duration,
          durationFormatted: formatDuration(duration),
          objectUrl,
          peaks: fallbackPeaks,
        },
      };
    }

    const audioCtx = new AudioCtxClass();
    const arrayBuffer = await file.arrayBuffer();

    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } catch {
      // In case decodeAudioData rejects, attempt element fallback before giving up
      const duration = await getAudioDurationViaElement(objectUrl);
      if (duration > 0 && isFinite(duration)) {
        audioCtx.close().catch(() => {});
        return {
          success: true,
          metadata: {
            file,
            fileName: file.name,
            fileSizeBytes: file.size,
            fileSizeFormatted: formatFileSize(file.size),
            fileType: file.type || "audio/" + file.name.split(".").pop(),
            duration,
            durationFormatted: formatDuration(duration),
            objectUrl,
            peaks: generateSyntheticPeaks(100),
          },
        };
      }

      audioCtx.close().catch(() => {});
      URL.revokeObjectURL(objectUrl);
      return {
        success: false,
        error: {
          title: "Audio decoding failed",
          message: "The browser could not decode this audio stream. The file may be corrupted or use an unsupported codec.",
        },
      };
    }

    const duration = audioBuffer.duration;
    if (!duration || duration <= 0 || !isFinite(duration)) {
      audioCtx.close().catch(() => {});
      URL.revokeObjectURL(objectUrl);
      return {
        success: false,
        error: {
          title: "Invalid audio duration",
          message: "The audio file contains zero or unreadable duration.",
        },
      };
    }

    // Extract real sampled waveform peaks
    const peaks = extractAudioPeaks(audioBuffer, 100);
    const sampleRate = audioBuffer.sampleRate;
    const channels = audioBuffer.numberOfChannels;

    audioCtx.close().catch(() => {});

    return {
      success: true,
      metadata: {
        file,
        fileName: file.name,
        fileSizeBytes: file.size,
        fileSizeFormatted: formatFileSize(file.size),
        fileType: file.type || "audio/" + file.name.split(".").pop(),
        duration,
        durationFormatted: formatDuration(duration),
        sampleRate,
        channels,
        objectUrl,
        peaks,
      },
    };
  } catch (err) {
    URL.revokeObjectURL(objectUrl);
    return {
      success: false,
      error: {
        title: "Unable to process audio",
        message: err instanceof Error ? err.message : "An unexpected error occurred while reading the audio file.",
      },
    };
  }
}

function getAudioDurationViaElement(url: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = "metadata";

    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("error", onError);
      audio.src = "";
    };

    const onLoaded = () => {
      const dur = audio.duration;
      cleanup();
      resolve(dur);
    };

    const onError = () => {
      cleanup();
      resolve(0);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);
    audio.src = url;
  });
}

function generateSyntheticPeaks(count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 4;
    return Math.max(0.1, Math.min(1.0, Math.abs(Math.sin(angle) * 0.7 + Math.cos(angle * 1.5) * 0.3)));
  });
}

