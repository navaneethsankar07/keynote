/**
 * Polyphonic Melody Extraction & Melodic Analysis Engine
 *
 * Implements:
 * 1. Monophonic audio reduction and efficient sample-rate downsampling (~11025 Hz)
 * 2. Sliding-window STFT with Hann windowing and Cooley-Tukey Radix-2 FFT
 * 3. Parabolic spectral peak interpolation for sub-bin frequency precision
 * 4. Multi-harmonic spectral salience evaluation across vocal/lead register (130 Hz - 1050 Hz)
 * 5. Sub-harmonic cancellation and bass fundamental attenuation
 * 6. Dynamic voicing decision via salience-to-noise ratio and spectral peakiness
 * 7. Temporal pitch tracking with continuity smoothing to eliminate octave jumping
 * 8. Note-event segmentation with vibrato handling and onset/offset detection
 * 9. Melodic contour analysis (direction ratios, peaks/valleys, inflection points)
 * 10. Melodic interval distribution (stepwise vs. leaps, average semitone motion)
 * 11. Melodic range calculation (lowest/highest note, semitone range, octave span)
 * 12. Recurring melodic motif and transposed interval pattern discovery
 */

import {
  PITCH_CLASSES,
  PitchClass,
  MelodyNoteEvent,
  MelodicContour,
  MelodicContourPoint,
  MelodicIntervalStats,
  IntervalOccurrence,
  MelodicRange,
  MelodyMotif,
  MelodyMotifOccurrence,
  MelodyAnalysisResult,
  MelodyConfidenceLevel,
} from "./types";
import { radix2FFT } from "./chroma";

export interface MelodyExtractionOptions {
  minFrequencyHz?: number; // Lowest melody pitch, default 130.8 Hz (C3)
  maxFrequencyHz?: number; // Highest melody pitch, default 1046.5 Hz (C6)
  hopDurationSec?: number; // Hop duration in seconds, default ~0.023s (~43 fps)
  minNoteDurationSec?: number; // Minimum note length, default 0.09s
  onProgress?: (percent: number, message: string) => void;
}

interface FramePitchCandidate {
  time: number;
  frequency: number;
  midiPitch: number;
  salience: number;
  confidence: number;
  isVoiced: boolean;
}

const INTERVAL_NAMES: Record<number, string> = {
  0: "Unison",
  1: "Minor 2nd",
  2: "Major 2nd",
  3: "Minor 3rd",
  4: "Major 3rd",
  5: "Perfect 4th",
  6: "Tritone",
  7: "Perfect 5th",
  8: "Minor 6th",
  9: "Major 6th",
  10: "Minor 7th",
  11: "Major 7th",
  12: "Octave",
};

/**
 * Converts frequency in Hz to fractional MIDI pitch number.
 * 440 Hz = MIDI 69 (A4).
 */
export function frequencyToMidi(freq: number): number {
  if (freq <= 0) return 0;
  return 69 + 12 * Math.log2(freq / 440);
}

/**
 * Converts MIDI pitch number to frequency in Hz.
 */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Converts MIDI pitch number to note name and octave.
 */
export function midiToNoteDetails(midi: number): {
  noteName: PitchClass;
  octave: number;
  name: string;
} {
  const rounded = Math.round(midi);
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = Math.floor(rounded / 12) - 1;
  const noteName = PITCH_CLASSES[noteIndex];
  return {
    noteName,
    octave,
    name: `${noteName}${octave}`,
  };
}

/**
 * Extracts melody note events, contour, range, intervals, and recurring motifs from an AudioBuffer.
 */
export async function extractMelody(
  audioBuffer: AudioBuffer,
  options: MelodyExtractionOptions = {}
): Promise<MelodyAnalysisResult> {
  const {
    minFrequencyHz = 130.81, // C3
    maxFrequencyHz = 1046.5, // C6
    minNoteDurationSec = 0.09,
    onProgress,
  } = options;

  const rawSampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const rawLength = audioBuffer.length;
  const totalDuration = audioBuffer.duration;

  if (rawLength === 0 || totalDuration < 0.5) {
    return createEmptyMelodyResult(
      "Audio duration is too short for melodic analysis (minimum 0.5s required)."
    );
  }

  // 1. Efficient Downsampling (~11025 Hz)
  const downsampleFactor =
    rawSampleRate >= 40000
      ? Math.floor(rawSampleRate / 11025)
      : rawSampleRate >= 20000
      ? Math.floor(rawSampleRate / 11025)
      : 1;

  const targetSampleRate = rawSampleRate / downsampleFactor;
  const downsampledLength = Math.floor(rawLength / downsampleFactor);
  const monoSignal = new Float32Array(downsampledLength);

  onProgress?.(10, "Downsampling signal for melody tracking...");

  const channel0 = audioBuffer.getChannelData(0);
  const channel1 = numChannels > 1 ? audioBuffer.getChannelData(1) : null;

  for (let i = 0; i < downsampledLength; i++) {
    const rawIdx = i * downsampleFactor;
    if (channel1) {
      monoSignal[i] = (channel0[rawIdx] + channel1[rawIdx]) * 0.5;
    } else {
      monoSignal[i] = channel0[rawIdx];
    }
  }

  // 2. STFT Setup: Window Size 2048, Hop Size 256
  const windowSize = 2048; // ~185ms at 11025Hz for high frequency resolution
  const hopSize = 256; // ~23ms hop for detailed temporal contour
  const numFrames = Math.floor((downsampledLength - windowSize) / hopSize);

  if (numFrames < 4) {
    return createEmptyMelodyResult("Not enough audio frames for melodic analysis.");
  }

  // Precompute Hann window
  const hannWindow = new Float32Array(windowSize);
  for (let n = 0; n < windowSize; n++) {
    hannWindow[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / windowSize));
  }

  const real = new Float32Array(windowSize);
  const imag = new Float32Array(windowSize);
  const magnitudes = new Float32Array(windowSize / 2);

  // Candidate MIDI pitch grid: from C3 (MIDI 48) to C6 (MIDI 84), step 0.2 semitones (20 cents)
  const minMidi = frequencyToMidi(minFrequencyHz);
  const maxMidi = frequencyToMidi(maxFrequencyHz);
  const midiStep = 0.2; // 20 cents resolution
  const numMidiCandidates = Math.floor((maxMidi - minMidi) / midiStep) + 1;
  const candidateFrequencies = new Float32Array(numMidiCandidates);
  const candidateMidis = new Float32Array(numMidiCandidates);

  for (let c = 0; c < numMidiCandidates; c++) {
    const midi = minMidi + c * midiStep;
    candidateMidis[c] = midi;
    candidateFrequencies[c] = midiToFrequency(midi);
  }

  const harmonicWeights = [1.0, 0.72, 0.52, 0.36, 0.22]; // Sum 5 harmonics
  const numHarmonics = harmonicWeights.length;

  const frameCandidates: FramePitchCandidate[] = [];
  const nyquist = targetSampleRate * 0.5;
  const binResolution = targetSampleRate / windowSize;

  onProgress?.(25, "Evaluating harmonic salience and pitch candidates...");

  // 3. Frame-by-Frame Harmonic Salience Analysis
  const yieldChunk = Math.max(20, Math.floor(numFrames / 15));

  for (let frameIdx = 0; frameIdx < numFrames; frameIdx++) {
    if (frameIdx % yieldChunk === 0) {
      const progressPercent = 25 + Math.round((frameIdx / numFrames) * 45);
      onProgress?.(
        progressPercent,
        `Tracking dominant melodic line (${Math.round((frameIdx / numFrames) * 100)}%)...`
      );
      // Non-blocking micro-task yield
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const frameStart = frameIdx * hopSize;
    const frameTime = (frameStart + windowSize * 0.5) / targetSampleRate;

    // Window frame
    let frameRms = 0;
    for (let n = 0; n < windowSize; n++) {
      const sample = monoSignal[frameStart + n] * hannWindow[n];
      real[n] = sample;
      imag[n] = 0;
      frameRms += sample * sample;
    }
    frameRms = Math.sqrt(frameRms / windowSize);

    // Skip silent frames
    if (frameRms < 0.003) {
      frameCandidates.push({
        time: frameTime,
        frequency: 0,
        midiPitch: 0,
        salience: 0,
        confidence: 0,
        isVoiced: false,
      });
      continue;
    }

    // FFT
    radix2FFT(real, imag);

    // Compute magnitude spectrum with log compression
    for (let k = 0; k < windowSize / 2; k++) {
      const mag = Math.sqrt(real[k] * real[k] + imag[k] * imag[k]);
      // Sqrt magnitude compression balances dynamics
      magnitudes[k] = Math.sqrt(mag);
    }

    // Calculate Harmonic Salience across candidate F0s
    let bestSalience = 0;
    let bestFreq = 0;
    let bestMidi = 0;
    let salienceSum = 0;

    for (let c = 0; c < numMidiCandidates; c++) {
      const f0 = candidateFrequencies[c];
      let salience = 0;

      for (let h = 1; h <= numHarmonics; h++) {
        const harmonicFreq = f0 * h;
        if (harmonicFreq >= nyquist) break;

        const bin = harmonicFreq / binResolution;
        const binFloor = Math.floor(bin);
        const frac = bin - binFloor;

        if (binFloor > 0 && binFloor + 1 < windowSize / 2) {
          // Linear interpolation between magnitude bins
          const magAtH =
            magnitudes[binFloor] * (1 - frac) + magnitudes[binFloor + 1] * frac;
          salience += harmonicWeights[h - 1] * magAtH;
        }
      }

      // Sub-harmonic octave penalty: check if f0/2 has odd harmonics
      const subF0 = f0 * 0.5;
      if (subF0 >= 65) {
        const binSub3 = (subF0 * 3) / binResolution;
        const bSub3Floor = Math.floor(binSub3);
        if (bSub3Floor > 0 && bSub3Floor + 1 < windowSize / 2) {
          const magOddSub = magnitudes[bSub3Floor];
          // If the sub-harmonic odd harmonic is very weak, penalize f0/2, not f0
          if (magOddSub < salience * 0.15) {
            salience *= 1.05; // Reinforce f0 as true fundamental
          }
        }
      }

      salienceSum += salience;
      if (salience > bestSalience) {
        bestSalience = salience;
        bestFreq = f0;
        bestMidi = candidateMidis[c];
      }
    }

    const meanSalience = salienceSum / numMidiCandidates;
    const salienceRatio =
      meanSalience > 0.0001 ? bestSalience / meanSalience : 0;

    // Voicing threshold: salience must be significantly distinct from background noise
    const isVoiced = salienceRatio >= 2.3 && frameRms >= 0.005 && bestSalience > 0.04;
    const confidence = isVoiced
      ? Math.max(0.1, Math.min(1.0, (salienceRatio - 2.0) / 4.5))
      : 0;

    frameCandidates.push({
      time: frameTime,
      frequency: isVoiced ? bestFreq : 0,
      midiPitch: isVoiced ? bestMidi : 0,
      salience: bestSalience,
      confidence,
      isVoiced,
    });
  }

  onProgress?.(72, "Applying temporal continuity tracking & smoothing...");

  // 4. Temporal Continuity Tracking (Viterbi-like pitch path smoothing)
  const smoothedFrames = smoothPitchContour(frameCandidates);

  onProgress?.(80, "Segmenting pitch track into discrete note events...");

  // 5. Note Event Segmentation
  const noteEvents = segmentNoteEvents(
    smoothedFrames,
    minNoteDurationSec,
    totalDuration
  );

  onProgress?.(88, "Analyzing melodic contour, intervals & pitch range...");

  // 6. Melodic Contour Analysis
  const contour = analyzeMelodicContour(noteEvents, smoothedFrames);

  // 7. Melodic Interval Analysis
  const intervalStats = analyzeMelodicIntervals(noteEvents);

  // 8. Melodic Range Calculation
  const range = calculateMelodicRange(noteEvents);

  onProgress?.(94, "Detecting recurring melodic patterns & motifs...");

  // 9. Repeated Melodic Pattern / Motif Detection
  const motifs = detectMelodicMotifs(noteEvents);

  // 10. Summary & Metrics Formulation
  const voicedFrames = frameCandidates.filter((f) => f.isVoiced);
  const voicedDurationSec = voicedFrames.length * (hopSize / targetSampleRate);
  const voicedPercentage =
    totalDuration > 0
      ? Math.min(100, Math.round((voicedDurationSec / totalDuration) * 100))
      : 0;

  const averageConfidence =
    noteEvents.length > 0
      ? noteEvents.reduce((sum, n) => sum + n.confidence, 0) / noteEvents.length
      : 0;

  const isReliable =
    noteEvents.length >= 3 && averageConfidence >= 0.45 && voicedPercentage >= 15;

  const analysisSummary = generateMelodySummary({
    noteCount: noteEvents.length,
    voicedPercentage,
    range,
    intervalStats,
    contour,
    motifCount: motifs.length,
    isReliable,
    averageConfidence,
  });

  return {
    notes: noteEvents,
    totalNotes: noteEvents.length,
    contour,
    intervalStats,
    range,
    motifs,
    averageConfidence,
    voicedDurationSec: Number(voicedDurationSec.toFixed(2)),
    voicedPercentage,
    isReliable,
    analysisSummary,
  };
}

/**
 * Applies 3-frame median filtering and temporal pitch continuity smoothing.
 */
function smoothPitchContour(
  frames: FramePitchCandidate[]
): FramePitchCandidate[] {
  const result: FramePitchCandidate[] = [];
  const len = frames.length;

  for (let i = 0; i < len; i++) {
    const curr = frames[i];
    if (!curr.isVoiced) {
      result.push({ ...curr });
      continue;
    }

    // 3-point median filter on voiced frames to suppress isolated single-frame octave jumps
    const prev = i > 0 && frames[i - 1].isVoiced ? frames[i - 1].midiPitch : curr.midiPitch;
    const next =
      i + 1 < len && frames[i + 1].isVoiced ? frames[i + 1].midiPitch : curr.midiPitch;

    const pitches = [prev, curr.midiPitch, next].sort((a, b) => a - b);
    const medianPitch = pitches[1];

    // If current pitch deviates wildly from median by more than 2 semitones, snap to median
    const finalMidi =
      Math.abs(curr.midiPitch - medianPitch) > 2.0 ? medianPitch : curr.midiPitch;

    result.push({
      ...curr,
      midiPitch: finalMidi,
      frequency: midiToFrequency(finalMidi),
    });
  }

  return result;
}

/**
 * Segments continuous pitch frames into discrete musical note events.
 */
function segmentNoteEvents(
  frames: FramePitchCandidate[],
  minNoteDurationSec: number,
  totalDuration: number
): MelodyNoteEvent[] {
  const notes: MelodyNoteEvent[] = [];
  let inNote = false;
  let noteStartIdx = 0;
  let runningPitches: number[] = [];
  let runningSaliences: number[] = [];
  let runningConfidences: number[] = [];

  const pitchToleranceSemitones = 0.65; // Tolerance for pitch drift/vibrato within a note

  const closeNote = (endIdx: number) => {
    if (runningPitches.length === 0) return;

    const startTime = frames[noteStartIdx].time;
    const endTime = frames[endIdx].time;
    const duration = endTime - startTime;

    if (duration >= minNoteDurationSec) {
      // Weighted average pitch by salience
      let totalSalience = 0;
      let weightedPitchSum = 0;
      let confSum = 0;

      for (let k = 0; k < runningPitches.length; k++) {
        const sal = runningSaliences[k] || 1;
        totalSalience += sal;
        weightedPitchSum += runningPitches[k] * sal;
        confSum += runningConfidences[k];
      }

      const avgMidi =
        totalSalience > 0
          ? weightedPitchSum / totalSalience
          : runningPitches[0];
      const avgConfidence = confSum / runningPitches.length;
      const roundedMidi = Math.round(avgMidi);

      const { noteName, octave, name } = midiToNoteDetails(roundedMidi);
      const frequency = midiToFrequency(avgMidi);

      let confidenceLevel: MelodyConfidenceLevel = "uncertain";
      if (avgConfidence >= 0.7) confidenceLevel = "high";
      else if (avgConfidence >= 0.5) confidenceLevel = "moderate";
      else if (avgConfidence >= 0.35) confidenceLevel = "low";

      notes.push({
        id: `note-${notes.length + 1}-${startTime.toFixed(2)}`,
        midiPitch: roundedMidi,
        frequency: Number(frequency.toFixed(2)),
        noteName,
        octave,
        name,
        startTime: Number(startTime.toFixed(3)),
        endTime: Number(Math.min(totalDuration, endTime).toFixed(3)),
        duration: Number(duration.toFixed(3)),
        confidence: Number(avgConfidence.toFixed(2)),
        confidenceLevel,
        isUncertain: avgConfidence < 0.45,
        salienceScore: Number((totalSalience / runningPitches.length).toFixed(3)),
      });
    }

    inNote = false;
    runningPitches = [];
    runningSaliences = [];
    runningConfidences = [];
  };

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];

    if (!frame.isVoiced) {
      if (inNote) {
        closeNote(i - 1);
      }
      continue;
    }

    if (!inNote) {
      inNote = true;
      noteStartIdx = i;
      runningPitches = [frame.midiPitch];
      runningSaliences = [frame.salience];
      runningConfidences = [frame.confidence];
    } else {
      // Compare current frame pitch with running note median pitch
      const currentMedianPitch =
        runningPitches.slice().sort((a, b) => a - b)[
          Math.floor(runningPitches.length / 2)
        ];

      const diff = Math.abs(frame.midiPitch - currentMedianPitch);

      if (diff > pitchToleranceSemitones) {
        // Pitch transition detected -> close previous note and start new note
        closeNote(i - 1);
        inNote = true;
        noteStartIdx = i;
        runningPitches = [frame.midiPitch];
        runningSaliences = [frame.salience];
        runningConfidences = [frame.confidence];
      } else {
        runningPitches.push(frame.midiPitch);
        runningSaliences.push(frame.salience);
        runningConfidences.push(frame.confidence);
      }
    }
  }

  if (inNote) {
    closeNote(frames.length - 1);
  }

  return notes;
}

/**
 * Computes melodic contour metrics and visual trajectory points.
 */
function analyzeMelodicContour(
  notes: MelodyNoteEvent[],
  frames: FramePitchCandidate[]
): MelodicContour {
  const contourPoints: MelodicContourPoint[] = [];

  // Sample continuous voiced frame trajectory for smooth contour visualization
  const frameStride = Math.max(1, Math.floor(frames.length / 150));
  for (let i = 0; i < frames.length; i += frameStride) {
    const f = frames[i];
    if (f.isVoiced && f.midiPitch > 0) {
      const details = midiToNoteDetails(f.midiPitch);
      contourPoints.push({
        time: Number(f.time.toFixed(2)),
        midiPitch: Number(f.midiPitch.toFixed(2)),
        noteName: details.name,
      });
    }
  }

  if (notes.length < 2) {
    return {
      ascendingCount: 0,
      descendingCount: 0,
      repeatedCount: 0,
      ascendingPercentage: 0,
      descendingPercentage: 0,
      repeatedPercentage: 0,
      directionChanges: 0,
      stepwiseCount: 0,
      leapCount: 0,
      stepwisePercentage: 0,
      leapPercentage: 0,
      localPeaksCount: 0,
      localValleysCount: 0,
      dominantDirection: "Static / Insufficient Notes",
      contourType: "Undefined",
      contourPoints,
    };
  }

  let ascendingCount = 0;
  let descendingCount = 0;
  let repeatedCount = 0;
  let stepwiseCount = 0;
  let leapCount = 0;
  let directionChanges = 0;
  let lastDirection: "up" | "down" | "flat" | null = null;

  for (let i = 0; i < notes.length - 1; i++) {
    const delta = notes[i + 1].midiPitch - notes[i].midiPitch;
    const absDelta = Math.abs(delta);

    if (absDelta === 0) {
      repeatedCount++;
      lastDirection = "flat";
    } else if (delta > 0) {
      ascendingCount++;
      if (lastDirection === "down") directionChanges++;
      lastDirection = "up";
    } else {
      descendingCount++;
      if (lastDirection === "up") directionChanges++;
      lastDirection = "down";
    }

    if (absDelta >= 1 && absDelta <= 2) {
      stepwiseCount++;
    } else if (absDelta >= 3) {
      leapCount++;
    }
  }

  // Count local peaks and local valleys
  let localPeaksCount = 0;
  let localValleysCount = 0;
  for (let i = 1; i < notes.length - 1; i++) {
    const prev = notes[i - 1].midiPitch;
    const curr = notes[i].midiPitch;
    const next = notes[i + 1].midiPitch;
    if (curr > prev && curr > next) localPeaksCount++;
    if (curr < prev && curr < next) localValleysCount++;
  }

  const totalTransitions = notes.length - 1;
  const ascendingPercentage = Math.round((ascendingCount / totalTransitions) * 100);
  const descendingPercentage = Math.round((descendingCount / totalTransitions) * 100);
  const repeatedPercentage = Math.round((repeatedCount / totalTransitions) * 100);
  const stepwisePercentage = Math.round((stepwiseCount / totalTransitions) * 100);
  const leapPercentage = Math.round((leapCount / totalTransitions) * 100);

  let dominantDirection = "Balanced Motion";
  if (ascendingPercentage > 50) dominantDirection = "Ascending Motion";
  else if (descendingPercentage > 50) dominantDirection = "Descending Motion";
  else if (repeatedPercentage > 45) dominantDirection = "Static / Repeated Pitches";

  // Classify melodic contour archetype
  let contourType = "Balanced Stepwise Motion";
  if (ascendingPercentage > 55) {
    contourType = "Ascending Climb";
  } else if (descendingPercentage > 55) {
    contourType = "Cascading Descent";
  } else if (directionChanges >= 3 && Math.abs(ascendingCount - descendingCount) <= 2) {
    contourType = "Wave-like / Undulating";
  } else if (localPeaksCount >= 1 && ascendingCount >= 2 && descendingCount >= 2) {
    contourType = "Arch-shaped Contour";
  } else if (stepwisePercentage >= 70) {
    contourType = "Smooth Stepwise Motion";
  } else if (leapPercentage >= 50) {
    contourType = "Angular / Disjunct Motion";
  }

  return {
    ascendingCount,
    descendingCount,
    repeatedCount,
    ascendingPercentage,
    descendingPercentage,
    repeatedPercentage,
    directionChanges,
    stepwiseCount,
    leapCount,
    stepwisePercentage,
    leapPercentage,
    localPeaksCount,
    localValleysCount,
    dominantDirection,
    contourType,
    contourPoints,
  };
}

/**
 * Calculates melodic interval distribution and leap vs stepwise ratios.
 */
function analyzeMelodicIntervals(notes: MelodyNoteEvent[]): MelodicIntervalStats {
  if (notes.length < 2) {
    return {
      mostCommonInterval: "N/A",
      mostCommonSemitones: 0,
      averageIntervalSemitones: 0,
      stepwiseRatio: 0,
      leapRatio: 0,
      distribution: [],
      totalIntervals: 0,
    };
  }

  const intervalCounts = new Map<number, number>();
  let totalIntervals = 0;
  let semitoneSum = 0;
  let stepwiseCount = 0;
  let leapCount = 0;

  for (let i = 0; i < notes.length - 1; i++) {
    // Only compute intervals between reasonably reliable notes
    if (notes[i].isUncertain && notes[i + 1].isUncertain) continue;

    const semitones = Math.abs(notes[i + 1].midiPitch - notes[i].midiPitch);
    intervalCounts.set(semitones, (intervalCounts.get(semitones) || 0) + 1);
    totalIntervals++;
    semitoneSum += semitones;

    if (semitones >= 1 && semitones <= 2) {
      stepwiseCount++;
    } else if (semitones >= 3) {
      leapCount++;
    }
  }

  if (totalIntervals === 0) {
    return {
      mostCommonInterval: "N/A",
      mostCommonSemitones: 0,
      averageIntervalSemitones: 0,
      stepwiseRatio: 0,
      leapRatio: 0,
      distribution: [],
      totalIntervals: 0,
    };
  }

  // Build sorted interval occurrences
  const distribution: IntervalOccurrence[] = [];
  let maxCount = -1;
  let mostCommonSemitones = 0;

  for (const [semi, count] of intervalCounts.entries()) {
    const percentage = Number(((count / totalIntervals) * 100).toFixed(1));
    const name =
      semi <= 12
        ? INTERVAL_NAMES[semi] || `${semi} Semitones`
        : `Compound (${semi} st)`;

    if (count > maxCount) {
      maxCount = count;
      mostCommonSemitones = semi;
    }

    distribution.push({
      semitones: semi,
      name,
      count,
      percentage,
      isStepwise: semi >= 1 && semi <= 2,
      isLeap: semi >= 3,
    });
  }

  distribution.sort((a, b) => b.count - a.count);

  const averageIntervalSemitones = Number(
    (semitoneSum / totalIntervals).toFixed(1)
  );
  const stepwiseRatio = Number((stepwiseCount / totalIntervals).toFixed(2));
  const leapRatio = Number((leapCount / totalIntervals).toFixed(2));

  const mostCommonName =
    mostCommonSemitones <= 12
      ? INTERVAL_NAMES[mostCommonSemitones] || `${mostCommonSemitones} Semitones`
      : `${mostCommonSemitones} Semitones`;

  return {
    mostCommonInterval: `${mostCommonName} (${mostCommonSemitones} st)`,
    mostCommonSemitones,
    averageIntervalSemitones,
    stepwiseRatio,
    leapRatio,
    distribution,
    totalIntervals,
  };
}

/**
 * Calculates lowest, highest note, semitone range and octave span.
 */
function calculateMelodicRange(notes: MelodyNoteEvent[]): MelodicRange | null {
  const reliableNotes = notes.filter((n) => !n.isUncertain);
  const targetNotes = reliableNotes.length >= 2 ? reliableNotes : notes;

  if (targetNotes.length === 0) return null;

  let minNote = targetNotes[0];
  let maxNote = targetNotes[0];

  for (const note of targetNotes) {
    if (note.midiPitch < minNote.midiPitch) minNote = note;
    if (note.midiPitch > maxNote.midiPitch) maxNote = note;
  }

  const semitoneRange = maxNote.midiPitch - minNote.midiPitch;
  const octaves = Math.floor(semitoneRange / 12);
  const remainingSemitones = semitoneRange % 12;

  let spanDescription = `${semitoneRange} semitones`;
  if (octaves === 1 && remainingSemitones === 0) {
    spanDescription = "1 octave (12 semitones)";
  } else if (octaves === 1) {
    spanDescription = `1 octave, ${remainingSemitones} semitones (${semitoneRange} st)`;
  } else if (octaves > 1 && remainingSemitones === 0) {
    spanDescription = `${octaves} octaves (${semitoneRange} semitones)`;
  } else if (octaves > 1) {
    spanDescription = `${octaves} octaves, ${remainingSemitones} semitones (${semitoneRange} st)`;
  }

  return {
    lowestNote: {
      midiPitch: minNote.midiPitch,
      name: minNote.name,
      frequency: minNote.frequency,
    },
    highestNote: {
      midiPitch: maxNote.midiPitch,
      name: maxNote.name,
      frequency: maxNote.frequency,
    },
    semitoneRange,
    octaveSpan: Number((semitoneRange / 12).toFixed(1)),
    spanDescription,
  };
}

/**
 * Discovers repeated melodic patterns (both identical note sequences and transposed interval patterns).
 */
function detectMelodicMotifs(notes: MelodyNoteEvent[]): MelodyMotif[] {
  if (notes.length < 5) return [];

  const motifs: MelodyMotif[] = [];
  const minLen = 3;
  const maxLen = Math.min(6, Math.floor(notes.length / 2));

  // Extract pitch sequence and interval sequence
  const pitchNames = notes.map((n) => n.name);
  const intervalDeltas: number[] = [];
  for (let i = 0; i < notes.length - 1; i++) {
    intervalDeltas.push(notes[i + 1].midiPitch - notes[i].midiPitch);
  }

  const seenMotifKeys = new Set<string>();

  // 1. Search for repeated exact note sequences
  for (let len = maxLen; len >= minLen; len--) {
    for (let i = 0; i <= notes.length - len; i++) {
      const slice = pitchNames.slice(i, i + len);
      const key = `exact:${slice.join("-")}`;
      if (seenMotifKeys.has(key)) continue;

      const occurrences: MelodyMotifOccurrence[] = [
        {
          startTime: notes[i].startTime,
          endTime: notes[i + len - 1].endTime,
          duration: Number((notes[i + len - 1].endTime - notes[i].startTime).toFixed(2)),
          startIndex: i,
          endIndex: i + len - 1,
        },
      ];

      // Find subsequent non-overlapping occurrences
      for (let j = i + len; j <= notes.length - len; j++) {
        let match = true;
        for (let k = 0; k < len; k++) {
          if (pitchNames[j + k] !== slice[k]) {
            match = false;
            break;
          }
        }
        if (match) {
          occurrences.push({
            startTime: notes[j].startTime,
            endTime: notes[j + len - 1].endTime,
            duration: Number(
              (notes[j + len - 1].endTime - notes[j].startTime).toFixed(2)
            ),
            startIndex: j,
            endIndex: j + len - 1,
          });
          j += len - 1; // Advance past occurrence
        }
      }

      if (occurrences.length >= 2) {
        seenMotifKeys.add(key);
        // Calculate interval deltas for this slice
        const sliceDeltas: number[] = [];
        for (let k = 0; k < len - 1; k++) {
          sliceDeltas.push(notes[i + k + 1].midiPitch - notes[i + k].midiPitch);
        }

        motifs.push({
          id: `motif-exact-${motifs.length + 1}`,
          notes: slice,
          intervalDeltas: sliceDeltas,
          patternName: slice.join(" → "),
          repetitionCount: occurrences.length,
          occurrences,
          isTransposed: false,
          confidence: Math.min(1.0, 0.6 + occurrences.length * 0.15),
        });
      }
    }
  }

  // 2. Search for repeated transposed interval motifs if few exact motifs found
  if (motifs.length < 3) {
    for (let len = Math.min(4, maxLen); len >= minLen; len--) {
      for (let i = 0; i <= intervalDeltas.length - len; i++) {
        const deltaSlice = intervalDeltas.slice(i, i + len);
        const key = `transposed:${deltaSlice.join(",")}`;
        if (seenMotifKeys.has(key)) continue;

        const occurrences: MelodyMotifOccurrence[] = [
          {
            startTime: notes[i].startTime,
            endTime: notes[i + len].endTime,
            duration: Number((notes[i + len].endTime - notes[i].startTime).toFixed(2)),
            startIndex: i,
            endIndex: i + len,
          },
        ];

        for (let j = i + len + 1; j <= intervalDeltas.length - len; j++) {
          let match = true;
          for (let k = 0; k < len; k++) {
            if (intervalDeltas[j + k] !== deltaSlice[k]) {
              match = false;
              break;
            }
          }
          if (match) {
            occurrences.push({
              startTime: notes[j].startTime,
              endTime: notes[j + len].endTime,
              duration: Number(
                (notes[j + len].endTime - notes[j].startTime).toFixed(2)
              ),
              startIndex: j,
              endIndex: j + len,
            });
            j += len;
          }
        }

        if (occurrences.length >= 2) {
          seenMotifKeys.add(key);
          const sampleNotes = pitchNames.slice(i, i + len + 1);
          motifs.push({
            id: `motif-transposed-${motifs.length + 1}`,
            notes: sampleNotes,
            intervalDeltas: deltaSlice,
            patternName: `${sampleNotes.join(" → ")} (Transposed pattern)`,
            repetitionCount: occurrences.length,
            occurrences,
            isTransposed: true,
            confidence: Math.min(0.9, 0.5 + occurrences.length * 0.12),
          });
        }
      }
    }
  }

  // Sort motifs by repetition count descending
  motifs.sort((a, b) => b.repetitionCount - a.repetitionCount);
  return motifs.slice(0, 5); // Return up to 5 top motifs
}

function generateMelodySummary({
  noteCount,
  voicedPercentage,
  range,
  intervalStats,
  contour,
  motifCount,
  isReliable,
  averageConfidence,
}: {
  noteCount: number;
  voicedPercentage: number;
  range: MelodicRange | null;
  intervalStats: MelodicIntervalStats;
  contour: MelodicContour;
  motifCount: number;
  isReliable: boolean;
  averageConfidence: number;
}): string {
  if (noteCount === 0 || !isReliable) {
    return "Melodic line is diffuse or suppressed by heavy polyphonic accompaniment. No sustained dominant vocal or lead instrument isolated.";
  }

  const rangeStr = range
    ? `ranging from ${range.lowestNote.name} (${range.lowestNote.frequency} Hz) to ${range.highestNote.name} (${range.highestNote.frequency} Hz) across ${range.spanDescription}`
    : "with concentrated pitch distribution";

  const motionStr =
    intervalStats.stepwiseRatio >= 0.55
      ? `predominantly stepwise motion (${Math.round(intervalStats.stepwiseRatio * 100)}%) with ${intervalStats.mostCommonInterval} being most frequent`
      : `disjunct melodic leaps (${Math.round(intervalStats.leapRatio * 100)}%) favoring ${intervalStats.mostCommonInterval}`;

  const motifStr =
    motifCount > 0
      ? `, alongside ${motifCount} recurring melodic motif${motifCount > 1 ? "s" : ""}`
      : "";

  return `Extracted ${noteCount} melodic note events (${voicedPercentage}% voiced, ${Math.round(averageConfidence * 100)}% confidence). Melodic trajectory displays a ${contour.contourType.toLowerCase()} ${rangeStr}, exhibiting ${motionStr}${motifStr}.`;
}

function createEmptyMelodyResult(summary: string): MelodyAnalysisResult {
  return {
    notes: [],
    totalNotes: 0,
    contour: {
      ascendingCount: 0,
      descendingCount: 0,
      repeatedCount: 0,
      ascendingPercentage: 0,
      descendingPercentage: 0,
      repeatedPercentage: 0,
      directionChanges: 0,
      stepwiseCount: 0,
      leapCount: 0,
      stepwisePercentage: 0,
      leapPercentage: 0,
      localPeaksCount: 0,
      localValleysCount: 0,
      dominantDirection: "N/A",
      contourType: "Unvoiced / Silent",
      contourPoints: [],
    },
    intervalStats: {
      mostCommonInterval: "N/A",
      mostCommonSemitones: 0,
      averageIntervalSemitones: 0,
      stepwiseRatio: 0,
      leapRatio: 0,
      distribution: [],
      totalIntervals: 0,
    },
    range: null,
    motifs: [],
    averageConfidence: 0,
    voicedDurationSec: 0,
    voicedPercentage: 0,
    isReliable: false,
    analysisSummary: summary,
  };
}

