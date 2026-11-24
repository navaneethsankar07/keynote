/**
 * Audio Chord Detection & Segmentation Engine
 *
 * Estimates time-varying musical chords across an audio track by:
 * 1. Sliding-window Short-Time Fourier Transform (STFT) with Hann windowing
 * 2. 12-dimensional pitch-class chroma feature extraction per time frame
 * 3. Low-frequency bass tracking to resolve chord inversions & suspended enharmonics
 * 4. Template matching across 108 chord qualities (9 qualities x 12 roots)
 * 5. Temporal median filtering to suppress percussion transients and spurious glitches
 * 6. Temporal segmentation merging contiguous frames into musical chord blocks
 * 7. Statistically calibrated confidence scoring and transparent uncertainty handling
 */

import {
  PITCH_CLASSES,
  PitchClass,
  ChordSegment,
  ChordAnalysisResult,
  ChordConfidence,
} from "./types";
import { ALL_CHORD_TEMPLATES, ChordTemplate } from "./chord-templates";
import { radix2FFT } from "./chroma";

export interface ChordDetectionOptions {
  hopDurationSec?: number; // Target hop duration (default ~0.186s)
  minSegmentDurationSec?: number; // Minimum duration to retain a distinct chord (default 0.38s)
  onProgress?: (percent: number, message: string) => void;
}

interface FramePrediction {
  chord: ChordTemplate | null;
  score: number;
  time: number;
  isSilent: boolean;
  bassRoot: PitchClass | null;
}

/**
 * Executes client-side chord detection and timeline segmentation on an AudioBuffer.
 */
export async function detectChords(
  audioBuffer: AudioBuffer,
  options: ChordDetectionOptions = {}
): Promise<ChordAnalysisResult> {
  const { minSegmentDurationSec = 0.38, onProgress } = options;

  const rawSampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const rawLength = audioBuffer.length;
  const totalDuration = audioBuffer.duration;

  if (rawLength === 0 || totalDuration < 0.5) {
    return {
      segments: [],
      uniqueChords: [],
      dominantChord: null,
      totalSegments: 0,
      averageConfidence: 0,
      harmonicRhythmBps: 0,
      analysisSummary: "Audio duration is too short for chord analysis.",
    };
  }

  // Downsample to effective ~11025 Hz
  const downsampleFactor =
    rawSampleRate >= 40000
      ? Math.floor(rawSampleRate / 11025)
      : rawSampleRate >= 20000
      ? Math.floor(rawSampleRate / 11025)
      : 1;
  const effectiveSampleRate = rawSampleRate / downsampleFactor;
  const effectiveLength = Math.floor(rawLength / downsampleFactor);

  // Extract mono signal
  const mono = new Float32Array(effectiveLength);
  const ch0 = audioBuffer.getChannelData(0);
  const ch1 = numChannels > 1 ? audioBuffer.getChannelData(1) : null;

  if (ch1) {
    for (let i = 0; i < effectiveLength; i++) {
      const srcIdx = i * downsampleFactor;
      mono[i] = (ch0[srcIdx] + ch1[srcIdx]) * 0.5;
    }
  } else {
    for (let i = 0; i < effectiveLength; i++) {
      const srcIdx = i * downsampleFactor;
      mono[i] = ch0[srcIdx];
    }
  }

  // Windowing parameters
  const windowSize = 4096;
  const hopSize = 2048; // ~0.186s per frame
  const numFrames = Math.max(1, Math.floor((effectiveLength - windowSize) / hopSize));

  const hannWindow = new Float32Array(windowSize);
  for (let n = 0; n < windowSize; n++) {
    hannWindow[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (windowSize - 1)));
  }

  // Pre-calculate filterbank mappings for musical range (65.4 Hz to 2093 Hz)
  const binResolution = effectiveSampleRate / windowSize;
  const minBin = Math.max(1, Math.floor(65.4 / binResolution));
  const maxBin = Math.min(windowSize / 2 - 1, Math.ceil(2093.0 / binResolution));
  const bassMaxBin = Math.min(windowSize / 2 - 1, Math.ceil(220.0 / binResolution)); // Bass register (<220 Hz)

  const binPc0 = new Int8Array(maxBin + 1);
  const binPc1 = new Int8Array(maxBin + 1);
  const binFrac = new Float32Array(maxBin + 1);

  for (let k = minBin; k <= maxBin; k++) {
    const freq = k * binResolution;
    const midi = 69 + 12 * (Math.log(freq / 440) / Math.LN2);
    const s0 = Math.floor(midi);
    binPc0[k] = ((s0 % 12) + 12) % 12;
    binPc1[k] = (((s0 + 1) % 12) + 12) % 12;
    binFrac[k] = midi - s0;
  }

  const framePredictions: FramePrediction[] = [];
  const realBuf = new Float32Array(windowSize);
  const imagBuf = new Float32Array(windowSize);
  const chromaBuf = new Float32Array(12);
  const bassChromaBuf = new Float32Array(12);

  const yieldInterval = 100;

  for (let f = 0; f < numFrames; f++) {
    // Yield periodically to prevent UI lag on large audio files
    if (f > 0 && f % yieldInterval === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      onProgress?.(
        Math.round((f / numFrames) * 100),
        `Analyzing harmonic chord frames (${f}/${numFrames})...`
      );
    }

    const frameStart = f * hopSize;
    if (frameStart + windowSize > effectiveLength) break;
    const frameCenterSec = (frameStart + windowSize / 2) / effectiveSampleRate;

    // Apply window & calculate RMS
    let frameRms = 0;
    for (let n = 0; n < windowSize; n++) {
      const sample = mono[frameStart + n] * hannWindow[n];
      realBuf[n] = sample;
      imagBuf[n] = 0.0;
      frameRms += sample * sample;
    }

    // Silence or low-level background threshold
    if (frameRms < 1e-4 * windowSize) {
      framePredictions.push({
        chord: null,
        score: 0,
        time: frameCenterSec,
        isSilent: true,
        bassRoot: null,
      });
      continue;
    }

    radix2FFT(realBuf, imagBuf);

    chromaBuf.fill(0);
    bassChromaBuf.fill(0);
    let totalNormSq = 0;

    for (let k = minBin; k <= maxBin; k++) {
      const p0 = binPc0[k];
      const p1 = binPc1[k];
      const frac = binFrac[k];

      const r = realBuf[k];
      const im = imagBuf[k];
      const power = r * r + im * im;

      const e0 = power * (1 - frac);
      const e1 = power * frac;

      chromaBuf[p0] += e0;
      chromaBuf[p1] += e1;

      // Accumulate low-frequency bass profile
      if (k <= bassMaxBin) {
        bassChromaBuf[p0] += e0;
        bassChromaBuf[p1] += e1;
      }
    }

    for (let p = 0; p < 12; p++) {
      totalNormSq += chromaBuf[p] * chromaBuf[p];
    }

    if (totalNormSq < 1e-8) {
      framePredictions.push({
        chord: null,
        score: 0,
        time: frameCenterSec,
        isSilent: true,
        bassRoot: null,
      });
      continue;
    }

    // Normalize frame chroma to unit L2-norm
    const invNorm = 1 / Math.sqrt(totalNormSq);
    for (let p = 0; p < 12; p++) {
      chromaBuf[p] *= invNorm;
    }

    // Detect bass note
    let maxBassEnergy = 0;
    let bassRootIdx = -1;
    for (let p = 0; p < 12; p++) {
      if (bassChromaBuf[p] > maxBassEnergy) {
        maxBassEnergy = bassChromaBuf[p];
        bassRootIdx = p;
      }
    }
    const detectedBass = bassRootIdx >= 0 ? PITCH_CLASSES[bassRootIdx] : null;

    // Match against all 108 chord templates
    let bestTemplate: ChordTemplate | null = null;
    let bestScore = -1;
    let runnerUpScore = -1;

    for (let tIdx = 0; tIdx < ALL_CHORD_TEMPLATES.length; tIdx++) {
      const template = ALL_CHORD_TEMPLATES[tIdx];
      let dot = 0;
      for (let p = 0; p < 12; p++) {
        dot += chromaBuf[p] * template.vector[p];
      }

      // Bass note alignment bonus: if the template's root matches the lowest fundamental,
      // it provides slight evidence favoring root position over inverted enharmonics
      if (bassRootIdx === template.rootIdx) {
        dot += 0.04;
      }

      if (dot > bestScore) {
        runnerUpScore = bestScore;
        bestScore = dot;
        bestTemplate = template;
      } else if (dot > runnerUpScore) {
        runnerUpScore = dot;
      }
    }

    // Quality threshold: must have sufficient correlation and energy coherence
    if (bestScore < 0.52 || !bestTemplate) {
      framePredictions.push({
        chord: null,
        score: bestScore > 0 ? bestScore : 0,
        time: frameCenterSec,
        isSilent: false,
        bassRoot: detectedBass,
      });
    } else {
      framePredictions.push({
        chord: bestTemplate,
        score: bestScore,
        time: frameCenterSec,
        isSilent: false,
        bassRoot: detectedBass,
      });
    }
  }

  // --- TEMPORAL SMOOTHING: 3-Frame Median / Majority Filter ---
  const smoothedNames: (string | null)[] = new Array(framePredictions.length);
  for (let i = 0; i < framePredictions.length; i++) {
    const prev = framePredictions[Math.max(0, i - 1)].chord?.shortName ?? null;
    const curr = framePredictions[i].chord?.shortName ?? null;
    const next = framePredictions[Math.min(framePredictions.length - 1, i + 1)].chord?.shortName ?? null;

    if (prev === next && prev !== null && curr !== prev) {
      // Current frame is an isolated single-frame fluctuation; replace with consensus
      smoothedNames[i] = prev;
    } else {
      smoothedNames[i] = curr;
    }
  }

  // --- TEMPORAL SEGMENTATION ---
  const rawSegments: {
    name: string;
    chordTemplate: ChordTemplate | null;
    startFrame: number;
    endFrame: number;
    scores: number[];
  }[] = [];

  let curSegment: {
    name: string;
    chordTemplate: ChordTemplate | null;
    startFrame: number;
    endFrame: number;
    scores: number[];
  } | null = null;

  for (let i = 0; i < framePredictions.length; i++) {
    const name = smoothedNames[i] || "N.C.";
    const framePred = framePredictions[i];
    const template = name === "N.C." ? null : framePred.chord;

    if (!curSegment) {
      curSegment = {
        name,
        chordTemplate: template,
        startFrame: i,
        endFrame: i,
        scores: [framePred.score],
      };
    } else if (curSegment.name === name) {
      curSegment.endFrame = i;
      curSegment.scores.push(framePred.score);
    } else {
      rawSegments.push(curSegment);
      curSegment = {
        name,
        chordTemplate: template,
        startFrame: i,
        endFrame: i,
        scores: [framePred.score],
      };
    }
  }
  if (curSegment) {
    rawSegments.push(curSegment);
  }

  // --- MERGE SHORT TRANSIENT SEGMENTS (< minSegmentDurationSec) ---
  const hopDuration = hopSize / effectiveSampleRate;
  const mergedSegments: {
    name: string;
    chordTemplate: ChordTemplate | null;
    startSec: number;
    endSec: number;
    scores: number[];
  }[] = [];

  for (let s = 0; s < rawSegments.length; s++) {
    const seg = rawSegments[s];
    const segStartSec = seg.startFrame * hopDuration;
    const segEndSec = Math.min(totalDuration, (seg.endFrame + 1) * hopDuration);
    const segDuration = segEndSec - segStartSec;

    if (segDuration < minSegmentDurationSec && mergedSegments.length > 0) {
      // Merge into preceding stable segment
      const last = mergedSegments[mergedSegments.length - 1];
      last.endSec = segEndSec;
      last.scores.push(...seg.scores);
    } else {
      mergedSegments.push({
        name: seg.name,
        chordTemplate: seg.chordTemplate,
        startSec: segStartSec,
        endSec: segEndSec,
        scores: seg.scores,
      });
    }
  }

  // Merge consecutive segments that now share the same chord name
  const finalSegmentsList: {
    name: string;
    chordTemplate: ChordTemplate | null;
    startSec: number;
    endSec: number;
    scores: number[];
  }[] = [];

  for (const seg of mergedSegments) {
    if (finalSegmentsList.length > 0 && finalSegmentsList[finalSegmentsList.length - 1].name === seg.name) {
      const prev = finalSegmentsList[finalSegmentsList.length - 1];
      prev.endSec = seg.endSec;
      prev.scores.push(...seg.scores);
    } else {
      finalSegmentsList.push({ ...seg });
    }
  }

  // Ensure first starts at 0 and last ends at totalDuration
  if (finalSegmentsList.length > 0) {
    finalSegmentsList[0].startSec = 0;
    finalSegmentsList[finalSegmentsList.length - 1].endSec = totalDuration;
  }

  // Format into final ChordSegments
  const segments: ChordSegment[] = finalSegmentsList.map((seg, idx) => {
    const avgScore = seg.scores.reduce((a, b) => a + b, 0) / Math.max(1, seg.scores.length);
    const duration = Math.max(0.1, seg.endSec - seg.startSec);
    const isUncertain = seg.name === "N.C." || avgScore < 0.62;

    let confidenceLevel: ChordConfidence = "uncertain";
    if (seg.name !== "N.C.") {
      if (avgScore >= 0.82) confidenceLevel = "high";
      else if (avgScore >= 0.68) confidenceLevel = "moderate";
      else confidenceLevel = "low";
    }

    return {
      id: `chord-seg-${idx}`,
      root: seg.chordTemplate ? seg.chordTemplate.root : null,
      quality: seg.chordTemplate ? seg.chordTemplate.quality : null,
      name: seg.name,
      startTime: Math.round(seg.startSec * 100) / 100,
      endTime: Math.round(seg.endSec * 100) / 100,
      duration: Math.round(duration * 100) / 100,
      confidence: Math.round(Math.min(1.0, avgScore) * 100) / 100,
      confidenceLevel,
      isUncertain,
      score: Math.round(Math.min(1.0, avgScore) * 100) / 100,
    };
  });

  // Calculate unique chords & dominant chord
  const chordDurationMap = new Map<string, number>();
  for (const seg of segments) {
    if (seg.name !== "N.C.") {
      chordDurationMap.set(seg.name, (chordDurationMap.get(seg.name) || 0) + seg.duration);
    }
  }

  const uniqueChords = Array.from(chordDurationMap.keys());
  let dominantChord: string | null = null;
  let maxDur = 0;
  for (const [name, dur] of chordDurationMap.entries()) {
    if (dur > maxDur) {
      maxDur = dur;
      dominantChord = name;
    }
  }

  const validScores = segments.filter((s) => !s.isUncertain).map((s) => s.confidence);
  const avgConfidence =
    validScores.length > 0
      ? validScores.reduce((a, b) => a + b, 0) / validScores.length
      : 0;

  const chordChanges = Math.max(0, segments.length - 1);
  const harmonicRhythmBps = totalDuration > 0 ? chordChanges / totalDuration : 0;

  // Analysis Summary
  let analysisSummary = "";
  if (uniqueChords.length === 0) {
    analysisSummary = "No distinct harmonic chord progressions detected in the audio signal.";
  } else {
    analysisSummary = `Detected ${uniqueChords.length} distinct chords across ${segments.length} harmonic regions. Predominant harmonic center anchored around ${dominantChord || uniqueChords[0]}.`;
  }

  return {
    segments,
    uniqueChords,
    dominantChord,
    totalSegments: segments.length,
    averageConfidence: Math.round(avgConfidence * 100) / 100,
    harmonicRhythmBps: Math.round(harmonicRhythmBps * 100) / 100,
    analysisSummary,
  };
}
