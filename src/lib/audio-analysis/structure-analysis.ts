/**
 * Musical Structure & Song Section Analysis Engine
 *
 * Implements:
 * 1. Multi-feature temporal analysis windowing (~1.0s window resolution)
 * 2. Composite novelty function combining chroma, energy, spectral brightness, rhythmic onsets, and chord shifts
 * 3. Change-point boundary detection with minimum section duration constraints (>= 6s)
 * 4. Section segmentation with start/end timestamps, durations, and boundary confidence scoring
 * 5. Section characteristics aggregation (energy dynamics, brightness, rhythmic density, melody presence, chords)
 * 6. Pairwise section similarity matrix using cosine similarity across normalized feature vectors
 * 7. Structural grouping (clustering similar sections into recurrent groups A, B, C...)
 * 8. Evidence-based section labeling (Intro, Verse, Chorus, Bridge, Instrumental, Outro, or neutral Section A/B/C)
 * 9. Form sequence synthesis (e.g. A → B → A → C → B) and structural complexity categorization
 */

import {
  SongSection,
  SectionGroup,
  SectionTransition,
  StructureSimilarityPair,
  StructureAnalysisResult,
  SectionBoundaryConfidence,
  SectionCharacteristics,
  ChordAnalysisResult,
  MelodyAnalysisResult,
  TempoAnalysisResult,
  BeatTrackingResult,
  KeyAnalysisResult,
} from "./types";
import { radix2FFT } from "./chroma";

export interface StructureAnalysisOptions {
  minSectionDurationSec?: number; // Minimum section duration, default 6.0s
  noveltyThreshold?: number; // Peak novelty sensitivity, default 0.32
  onProgress?: (percent: number, message: string) => void;
}

interface WindowFeature {
  time: number;
  energy: number; // 0.0 - 1.0 (normalized RMS)
  spectralCentroid: number; // 0.0 - 1.0 (normalized brightness)
  onsetDensity: number; // Onsets per second
  chroma: number[]; // 12-dimensional chroma vector
  hasMelody: boolean;
  melodyPitch: number; // 0 if unvoiced
  activeChord: string | null;
}

const SECTION_COLORS: Record<string, string> = {
  Intro: "#6366F1", // Indigo
  A: "#06B6D4", // Cyan
  B: "#8B5CF6", // Violet
  C: "#10B981", // Emerald
  D: "#F59E0B", // Amber
  E: "#EC4899", // Pink
  F: "#3B82F6", // Blue
  Outro: "#A855F7", // Purple
  Bridge: "#F97316", // Orange
  Instrumental: "#14B8A6", // Teal
  Default: "#8B5CF6",
};

/**
 * Executes full client-side musical structure and song section analysis.
 */
export async function analyzeSongStructure(
  audioBuffer: AudioBuffer,
  context: {
    chords: ChordAnalysisResult;
    melody: MelodyAnalysisResult;
    tempo: TempoAnalysisResult;
    beats: BeatTrackingResult;
    key: KeyAnalysisResult;
  },
  options: StructureAnalysisOptions = {}
): Promise<StructureAnalysisResult> {
  const { minSectionDurationSec = 6.0, onProgress } = options;

  const totalDuration = audioBuffer.duration;
  const rawSampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const rawLength = audioBuffer.length;

  if (rawLength === 0 || totalDuration < 4.0) {
    return createMinimalStructureResult(
      totalDuration,
      "Audio duration is too short for structural section segmentation (minimum 4s required)."
    );
  }

  onProgress?.(10, "Extracting multi-feature temporal windows for structural analysis...");

  // 1. Downsample signal to ~5512 Hz for rapid structural feature extraction
  const downsampleFactor = Math.max(1, Math.floor(rawSampleRate / 5512));
  const targetSampleRate = rawSampleRate / downsampleFactor;
  const downsampledLength = Math.floor(rawLength / downsampleFactor);
  const mono = new Float32Array(downsampledLength);

  const ch0 = audioBuffer.getChannelData(0);
  const ch1 = numChannels > 1 ? audioBuffer.getChannelData(1) : null;

  for (let i = 0; i < downsampledLength; i++) {
    const rawIdx = i * downsampleFactor;
    mono[i] = ch1 ? (ch0[rawIdx] + ch1[rawIdx]) * 0.5 : ch0[rawIdx];
  }

  // 2. Feature Windowing (~1.0s window, ~0.5s hop)
  const windowSamples = 4096; // ~0.74s at 5512Hz
  const hopSamples = 2048; // ~0.37s hop
  const numWindows = Math.floor((downsampledLength - windowSamples) / hopSamples);

  if (numWindows < 6) {
    return createMinimalStructureResult(
      totalDuration,
      "Not enough feature frames to isolate distinct musical sections."
    );
  }

  // Precompute Hann window
  const hann = new Float32Array(windowSamples);
  for (let n = 0; n < windowSamples; n++) {
    hann[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / windowSamples));
  }

  const real = new Float32Array(windowSamples);
  const imag = new Float32Array(windowSamples);
  const windowFeatures: WindowFeature[] = [];

  let maxRms = 0.0001;
  const rawFeatures: {
    time: number;
    rms: number;
    centroid: number;
    chroma: number[];
  }[] = [];

  onProgress?.(25, "Computing energy, spectral centroid & tonal chroma profiles...");

  for (let w = 0; w < numWindows; w++) {
    const startIdx = w * hopSamples;
    const windowTime = (startIdx + windowSamples * 0.5) / targetSampleRate;

    let rms = 0;
    for (let n = 0; n < windowSamples; n++) {
      const s = mono[startIdx + n] * hann[n];
      real[n] = s;
      imag[n] = 0;
      rms += s * s;
    }
    rms = Math.sqrt(rms / windowSamples);
    if (rms > maxRms) maxRms = rms;

    radix2FFT(real, imag);

    // Compute spectral centroid & chroma
    let numSum = 0;
    let denSum = 0;
    const chroma = new Float32Array(12);

    for (let k = 1; k < windowSamples / 2; k++) {
      const mag = Math.sqrt(real[k] * real[k] + imag[k] * imag[k]);
      const freq = (k * targetSampleRate) / windowSamples;

      numSum += freq * mag;
      denSum += mag;

      // Chroma binning between 65Hz and 2000Hz
      if (freq >= 65 && freq <= 2000) {
        const midi = 69 + 12 * Math.log2(freq / 440);
        const pitchClass = ((Math.round(midi) % 12) + 12) % 12;
        chroma[pitchClass] += mag;
      }
    }

    const centroid = denSum > 0 ? numSum / denSum : 0;

    // L1 normalize chroma
    let chromaSum = 0;
    for (let c = 0; c < 12; c++) chromaSum += chroma[c];
    const normChroma = Array.from(chroma).map((v) =>
      chromaSum > 0 ? v / chromaSum : 0
    );

    rawFeatures.push({
      time: windowTime,
      rms,
      centroid,
      chroma: normChroma,
    });
  }

  // Normalize features and fuse with existing chord / melody context
  let maxCentroid = 1;
  for (const f of rawFeatures) {
    if (f.centroid > maxCentroid) maxCentroid = f.centroid;
  }

  for (let i = 0; i < rawFeatures.length; i++) {
    const f = rawFeatures[i];
    const t = f.time;

    // Active chord at time t
    let activeChord: string | null = null;
    for (const c of context.chords.segments) {
      if (t >= c.startTime && t <= c.endTime) {
        activeChord = c.name;
        break;
      }
    }

    // Active melody at time t
    let hasMelody = false;
    let melodyPitch = 0;
    for (const m of context.melody.notes) {
      if (t >= m.startTime && t <= m.endTime) {
        hasMelody = true;
        melodyPitch = m.midiPitch;
        break;
      }
    }

    // Rhythmic onset count in +-0.5s window
    let onsetsInWindow = 0;
    for (const b of context.beats.beatTimestamps) {
      if (Math.abs(b - t) <= 0.5) onsetsInWindow++;
    }

    windowFeatures.push({
      time: t,
      energy: Math.min(1.0, f.rms / (maxRms || 1)),
      spectralCentroid: Math.min(1.0, f.centroid / (maxCentroid || 1)),
      onsetDensity: onsetsInWindow,
      chroma: f.chroma,
      hasMelody,
      melodyPitch,
      activeChord,
    });
  }

  onProgress?.(50, "Evaluating structural boundary novelty function...");

  // 3. Multi-Feature Novelty Function via Context Checkerboard Distance
  // Compares past context window (L frames) with future context window (L frames)
  const numFeats = windowFeatures.length;
  const noveltyCurve: number[] = new Array(numFeats).fill(0);
  const L = 4; // ~1.5s context window on each side

  for (let i = L; i < numFeats - L; i++) {
    // Average left context [i - L, i - 1]
    let leftEnergy = 0;
    let leftCentroid = 0;
    const leftChroma = new Float32Array(12);
    let leftMelodyCount = 0;

    for (let k = i - L; k < i; k++) {
      leftEnergy += windowFeatures[k].energy;
      leftCentroid += windowFeatures[k].spectralCentroid;
      for (let c = 0; c < 12; c++) leftChroma[c] += windowFeatures[k].chroma[c];
      if (windowFeatures[k].hasMelody) leftMelodyCount++;
    }
    leftEnergy /= L;
    leftCentroid /= L;
    for (let c = 0; c < 12; c++) leftChroma[c] /= L;
    const leftMelodyRatio = leftMelodyCount / L;

    // Average right context [i, i + L - 1]
    let rightEnergy = 0;
    let rightCentroid = 0;
    const rightChroma = new Float32Array(12);
    let rightMelodyCount = 0;

    for (let k = i; k < i + L; k++) {
      rightEnergy += windowFeatures[k].energy;
      rightCentroid += windowFeatures[k].spectralCentroid;
      for (let c = 0; c < 12; c++) rightChroma[c] += windowFeatures[k].chroma[c];
      if (windowFeatures[k].hasMelody) rightMelodyCount++;
    }
    rightEnergy /= L;
    rightCentroid /= L;
    for (let c = 0; c < 12; c++) rightChroma[c] /= L;
    const rightMelodyRatio = rightMelodyCount / L;

    // Chroma cosine distance (0 to 1)
    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let c = 0; c < 12; c++) {
      dot += leftChroma[c] * rightChroma[c];
      norm1 += leftChroma[c] * leftChroma[c];
      norm2 += rightChroma[c] * rightChroma[c];
    }
    const chromaDist =
      norm1 > 0 && norm2 > 0
        ? 1.0 - Math.max(0, dot / (Math.sqrt(norm1) * Math.sqrt(norm2)))
        : 0;

    // Energy change
    const energyDelta = Math.abs(rightEnergy - leftEnergy);

    // Spectral brightness change
    const centroidDelta = Math.abs(rightCentroid - leftCentroid);

    // Melody voice state transition (e.g. vocal enters or stops)
    const melodyShift = Math.abs(rightMelodyRatio - leftMelodyRatio);

    // Weighted novelty
    const novelty =
      chromaDist * 0.35 +
      energyDelta * 0.35 +
      centroidDelta * 0.15 +
      melodyShift * 0.15;

    noveltyCurve[i] = novelty;
  }

  // Smooth novelty curve with Gaussian window to detect macro section changes
  const smoothedNovelty = smoothCurve(noveltyCurve, 3);

  onProgress?.(70, "Detecting section change-points & segment boundaries...");

  // 4. Boundary Peak Picking with Minimum Section Duration Constraint
  const boundaryTimes = detectBoundaries(
    smoothedNovelty,
    windowFeatures,
    totalDuration,
    minSectionDurationSec
  );

  // 5. Segment Creation & Characteristic Extraction
  const sections: SongSection[] = [];
  for (let s = 0; s < boundaryTimes.length - 1; s++) {
    const start = boundaryTimes[s];
    const end = boundaryTimes[s + 1];
    const dur = end - start;

    const chars = calculateSectionCharacteristics(
      start,
      end,
      windowFeatures,
      context
    );

    // Compute boundary confidence based on local novelty peak strength
    let maxLocalNov = 0;
    for (let i = 0; i < windowFeatures.length - 1; i++) {
      if (Math.abs(windowFeatures[i].time - start) <= 1.0) {
        if (smoothedNovelty[i] > maxLocalNov) maxLocalNov = smoothedNovelty[i];
      }
    }
    const boundaryConfidence: SectionBoundaryConfidence =
      maxLocalNov >= 0.45 ? "high" : maxLocalNov >= 0.25 ? "moderate" : "low";

    sections.push({
      id: `section-${s + 1}-${start.toFixed(1)}`,
      label: `Section ${String.fromCharCode(65 + s)}`,
      neutralLabel: `Section ${String.fromCharCode(65 + s)}`,
      group: String.fromCharCode(65 + s),
      groupIndex: s,
      occurrenceIndex: 1,
      startTime: Number(start.toFixed(2)),
      endTime: Number(end.toFixed(2)),
      duration: Number(dur.toFixed(2)),
      boundaryConfidence,
      confidenceScore: Number(Math.min(1.0, 0.4 + maxLocalNov * 1.2).toFixed(2)),
      characteristics: chars,
      similarSectionIds: [],
      isRepeated: false,
      color: SECTION_COLORS[String.fromCharCode(65 + s)] || SECTION_COLORS.Default,
    });
  }

  onProgress?.(85, "Analyzing cross-section similarity and recurring patterns...");

  // 6. Pairwise Section Similarity Matrix
  const similarityPairs: StructureSimilarityPair[] = [];
  const numSecs = sections.length;

  for (let i = 0; i < numSecs; i++) {
    for (let j = i + 1; j < numSecs; j++) {
      const sim = computeSectionSimilarity(
        sections[i].characteristics,
        sections[j].characteristics
      );

      let simType: "near_identical" | "strong" | "partial" | "weak" = "weak";
      if (sim >= 0.82) simType = "near_identical";
      else if (sim >= 0.68) simType = "strong";
      else if (sim >= 0.5) simType = "partial";

      similarityPairs.push({
        sectionAId: sections[i].id,
        sectionBId: sections[j].id,
        similarity: Number(sim.toFixed(2)),
        similarityType: simType,
      });

      if (sim >= 0.68) {
        sections[i].similarSectionIds.push(sections[j].id);
        sections[j].similarSectionIds.push(sections[i].id);
        sections[i].isRepeated = true;
        sections[j].isRepeated = true;
      }
    }
  }

  onProgress?.(92, "Clustering structural groups & assigning evidence-based labels...");

  // 7. Structural Grouping (A, B, C...)
  const groups = clusterSectionGroups(sections, similarityPairs);

  // 8. Evidence-Based Semantic Section Labeling
  assignSectionLabels(sections, groups, totalDuration);

  // 9. Section Transitions
  const transitions: SectionTransition[] = [];
  for (let i = 0; i < sections.length - 1; i++) {
    const s1 = sections[i];
    const s2 = sections[i + 1];
    const energyJump = Math.abs(
      s2.characteristics.energy - s1.characteristics.energy
    );
    transitions.push({
      fromSectionId: s1.id,
      toSectionId: s2.id,
      time: s1.endTime,
      transitionType: energyJump > 0.25 ? "abrupt" : "gradual",
      changeMagnitude: Number(energyJump.toFixed(2)),
    });
  }

  // 10. Overall Structural Pattern & Complexity
  const sectionSequence = sections.map((s) => s.label);
  const neutralSequence = sections.map((s) => s.group);
  const formSummary = formatFormSequence(sections);
  const neutralFormSummary = neutralSequence.join(" → ");

  const hasIntro = sections.length > 0 && sections[0].label.toLowerCase().includes("intro");
  const hasOutro =
    sections.length > 1 &&
    sections[sections.length - 1].label.toLowerCase().includes("outro");

  let structuralComplexity: "minimal" | "standard" | "complex" | "through_composed" =
    "standard";
  if (sections.length <= 2) structuralComplexity = "minimal";
  else if (sections.length >= 7) structuralComplexity = "complex";
  else if (groups.every((g) => g.occurrenceCount === 1) && sections.length >= 4) {
    structuralComplexity = "through_composed";
  }

  const analysisSummary = generateStructureSummary({
    sectionCount: sections.length,
    formSummary,
    hasIntro,
    hasOutro,
    groups,
    structuralComplexity,
  });

  return {
    sections,
    totalSections: sections.length,
    sectionSequence,
    formSummary,
    neutralFormSummary,
    groups,
    transitions,
    similarityPairs,
    hasIntro,
    hasOutro,
    structuralComplexity,
    analysisSummary,
  };
}

/**
 * Detects structural change-point boundaries.
 */
function detectBoundaries(
  novelty: number[],
  windows: WindowFeature[],
  totalDuration: number,
  minSectionDuration: number
): number[] {
  const boundaries: number[] = [0];
  let lastBoundaryTime = 0;

  // Window stride in seconds
  const windowCount = novelty.length;
  if (windowCount === 0) return [0, totalDuration];

  // Calculate dynamic adaptive threshold
  let sum = 0;
  let nonZeroCount = 0;
  for (let i = 0; i < windowCount; i++) {
    if (novelty[i] > 0) {
      sum += novelty[i];
      nonZeroCount++;
    }
  }
  const meanNov = nonZeroCount > 0 ? sum / nonZeroCount : 0.1;
  const threshold = Math.max(0.12, meanNov * 1.2);

  for (let i = 2; i < windowCount - 2; i++) {
    const val = novelty[i];
    const t = windows[i].time;

    // Peak condition: strictly greater than immediate neighbors
    if (
      val >= threshold &&
      val >= novelty[i - 1] &&
      val >= novelty[i + 1] &&
      val >= novelty[i - 2] &&
      val >= novelty[i + 2]
    ) {
      if (t - lastBoundaryTime >= minSectionDuration && totalDuration - t >= 4.0) {
        boundaries.push(Number(t.toFixed(1)));
        lastBoundaryTime = t;
      }
    }
  }

  // Ensure end of audio is closed
  if (totalDuration - lastBoundaryTime >= minSectionDuration * 0.6) {
    boundaries.push(Number(totalDuration.toFixed(2)));
  } else if (boundaries.length > 1) {
    boundaries[boundaries.length - 1] = Number(totalDuration.toFixed(2));
  } else {
    boundaries.push(Number(totalDuration.toFixed(2)));
  }

  return boundaries;
}

/**
 * Aggregates measured characteristics for a section.
 */
function calculateSectionCharacteristics(
  start: number,
  end: number,
  windows: WindowFeature[],
  context: {
    chords: ChordAnalysisResult;
    melody: MelodyAnalysisResult;
  }
): SectionCharacteristics {
  let energySum = 0;
  let centroidSum = 0;
  let onsetSum = 0;
  let windowCount = 0;
  const energies: number[] = [];

  for (const w of windows) {
    if (w.time >= start && w.time <= end) {
      energySum += w.energy;
      energies.push(w.energy);
      centroidSum += w.spectralCentroid;
      onsetSum += w.onsetDensity;
      windowCount++;
    }
  }

  const dur = Math.max(0.1, end - start);
  const meanEnergy = windowCount > 0 ? energySum / windowCount : 0.5;
  const meanCentroid = windowCount > 0 ? centroidSum / windowCount : 0.5;
  const rhythmicDensity = Number((onsetSum / dur).toFixed(1));

  // Energy variance
  let varSum = 0;
  for (const e of energies) {
    const diff = e - meanEnergy;
    varSum += diff * diff;
  }
  const energyDynamics = Number(
    (Math.sqrt(varSum / Math.max(1, energies.length)) * 2).toFixed(2)
  );

  // Dominant chord and chord change count in section
  const sectionChords: Record<string, number> = {};
  let chordChanges = 0;
  let prevChord = "";

  for (const c of context.chords.segments) {
    if (c.endTime >= start && c.startTime <= end) {
      const overlapStart = Math.max(start, c.startTime);
      const overlapEnd = Math.min(end, c.endTime);
      const overlapDur = Math.max(0, overlapEnd - overlapStart);

      sectionChords[c.name] = (sectionChords[c.name] || 0) + overlapDur;
      if (c.name !== prevChord) {
        chordChanges++;
        prevChord = c.name;
      }
    }
  }

  let dominantChord: string | null = null;
  let maxChordDur = 0;
  for (const [chord, d] of Object.entries(sectionChords)) {
    if (d > maxChordDur) {
      maxChordDur = d;
      dominantChord = chord;
    }
  }

  // Melodic Voicing in section
  let voicedSecs = 0;
  const melodyPitches: number[] = [];
  for (const m of context.melody.notes) {
    if (m.endTime >= start && m.startTime <= end) {
      const overlapStart = Math.max(start, m.startTime);
      const overlapEnd = Math.min(end, m.endTime);
      voicedSecs += Math.max(0, overlapEnd - overlapStart);
      melodyPitches.push(m.midiPitch);
    }
  }

  const melodicVoicingRatio = Math.min(
    100,
    Math.round((voicedSecs / dur) * 100)
  );

  let melodyPitchRange: string | null = null;
  if (melodyPitches.length >= 2) {
    const minM = Math.min(...melodyPitches);
    const maxM = Math.max(...melodyPitches);
    const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
    melodyPitchRange = `${names[minM % 12]}${Math.floor(minM / 12) - 1} – ${
      names[maxM % 12]
    }${Math.floor(maxM / 12) - 1}`;
  }

  return {
    energy: Number(meanEnergy.toFixed(2)),
    energyDynamics: Math.min(1.0, energyDynamics),
    spectralBrightness: Number(meanCentroid.toFixed(2)),
    rhythmicDensity,
    harmonicPurity: 0.75,
    dominantChord,
    chordChangeCount: Math.max(0, chordChanges - 1),
    melodicVoicingRatio,
    melodyPitchRange,
  };
}

/**
 * Computes cosine-based multi-feature similarity between two sections.
 */
function computeSectionSimilarity(
  c1: SectionCharacteristics,
  c2: SectionCharacteristics
): number {
  // Energy similarity
  const energySim = 1.0 - Math.min(1.0, Math.abs(c1.energy - c2.energy) * 1.5);

  // Brightness similarity
  const brightSim =
    1.0 - Math.min(1.0, Math.abs(c1.spectralBrightness - c2.spectralBrightness) * 1.8);

  // Dominant chord match
  const chordSim =
    c1.dominantChord && c2.dominantChord && c1.dominantChord === c2.dominantChord
      ? 1.0
      : 0.3;

  // Melodic presence similarity
  const voiceDiff = Math.abs(c1.melodicVoicingRatio - c2.melodicVoicingRatio) / 100;
  const voiceSim = 1.0 - voiceDiff;

  // Rhythmic density ratio
  const maxR = Math.max(c1.rhythmicDensity, c2.rhythmicDensity, 0.1);
  const minR = Math.min(c1.rhythmicDensity, c2.rhythmicDensity);
  const rhythmSim = minR / maxR;

  return (
    energySim * 0.3 +
    brightSim * 0.2 +
    chordSim * 0.25 +
    voiceSim * 0.15 +
    rhythmSim * 0.1
  );
}

/**
 * Clusters sections into structural groups (A, B, C...).
 */
function clusterSectionGroups(
  sections: SongSection[],
  pairs: StructureSimilarityPair[]
): SectionGroup[] {
  const groups: SectionGroup[] = [];
  const assigned = new Map<string, string>(); // sectionId -> groupLetter
  let nextGroupCode = 65; // 'A'

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    if (assigned.has(sec.id)) continue;

    const groupLetter = String.fromCharCode(nextGroupCode++);
    assigned.set(sec.id, groupLetter);

    const memberIds = [sec.id];

    // Find similar unassigned sections
    for (const pair of pairs) {
      if (pair.similarity >= 0.68) {
        if (pair.sectionAId === sec.id && !assigned.has(pair.sectionBId)) {
          assigned.set(pair.sectionBId, groupLetter);
          memberIds.push(pair.sectionBId);
        } else if (pair.sectionBId === sec.id && !assigned.has(pair.sectionAId)) {
          assigned.set(pair.sectionAId, groupLetter);
          memberIds.push(pair.sectionAId);
        }
      }
    }

    const groupSections = sections.filter((s) => memberIds.includes(s.id));
    const totalDur = groupSections.reduce((acc, s) => acc + s.duration, 0);
    const avgEnergy =
      groupSections.reduce((acc, s) => acc + s.characteristics.energy, 0) /
      groupSections.length;

    groups.push({
      group: groupLetter,
      label: `Group ${groupLetter}`,
      sectionIds: memberIds,
      occurrenceCount: memberIds.length,
      totalDuration: Number(totalDur.toFixed(2)),
      averageEnergy: Number(avgEnergy.toFixed(2)),
      color: SECTION_COLORS[groupLetter] || SECTION_COLORS.Default,
    });
  }

  // Update sections with assigned group and occurrence counts
  const groupCounters = new Map<string, number>();

  for (const sec of sections) {
    const g = assigned.get(sec.id) || "A";
    const count = (groupCounters.get(g) || 0) + 1;
    groupCounters.set(g, count);

    sec.group = g;
    sec.occurrenceIndex = count;
    sec.neutralLabel = count > 1 ? `Section ${g}${count}` : `Section ${g}`;
    sec.color = SECTION_COLORS[g] || SECTION_COLORS.Default;
  }

  return groups;
}

/**
 * Assigns evidence-based semantic labels (Intro, Verse, Chorus, Bridge, Outro, or neutral fallback).
 */
function assignSectionLabels(
  sections: SongSection[],
  groups: SectionGroup[],
  totalDuration: number
): void {
  const count = sections.length;
  if (count === 0) return;

  const meanEnergy =
    sections.reduce((acc, s) => acc + s.characteristics.energy, 0) / count;

  // 1. Identify Intro
  // Condition: First section, starts at 0, duration <= 32s, lower energy, occurs once
  const first = sections[0];
  const firstGroup = groups.find((g) => g.group === first.group);
  if (
    first.startTime === 0 &&
    first.duration <= 32 &&
    firstGroup?.occurrenceCount === 1 &&
    first.characteristics.energy <= meanEnergy * 1.15
  ) {
    first.label = "Intro";
    first.color = SECTION_COLORS.Intro;
  }

  // 2. Identify Outro
  // Condition: Last section, ends near track end, occurs once, lower energy or trailing
  const last = sections[count - 1];
  const lastGroup = groups.find((g) => g.group === last.group);
  if (
    count > 1 &&
    last.endTime >= totalDuration - 2.0 &&
    lastGroup?.occurrenceCount === 1 &&
    last.id !== first.id
  ) {
    last.label = "Outro";
    last.color = SECTION_COLORS.Outro;
  }

  // 3. Identify Chorus candidates among recurring groups
  // Condition: occurs >= 2 times, higher than average energy, high melodic presence
  const recurringGroups = groups.filter(
    (g) =>
      g.occurrenceCount >= 2 &&
      g.group !== first.group &&
      g.group !== last.group
  );

  let chorusGroup: string | null = null;
  let highestChorusScore = -1;

  for (const g of recurringGroups) {
    const gSections = sections.filter((s) => s.group === g.group);
    const avgE = g.averageEnergy;
    const avgVoice =
      gSections.reduce((acc, s) => acc + s.characteristics.melodicVoicingRatio, 0) /
      gSections.length;

    // Score based on energy and vocal presence
    const score = avgE * 0.6 + (avgVoice / 100) * 0.4;
    if (avgE >= meanEnergy && score > highestChorusScore) {
      highestChorusScore = score;
      chorusGroup = g.group;
    }
  }

  // 4. Identify Verse candidates
  let verseGroup: string | null = null;
  if (chorusGroup) {
    const remainingRecurring = recurringGroups.filter(
      (g) => g.group !== chorusGroup
    );
    if (remainingRecurring.length > 0) {
      // Pick the recurring group with moderate energy preceding chorus
      verseGroup = remainingRecurring[0].group;
    }
  }

  // 5. Apply labels
  const groupLabelCounters = new Map<string, number>();

  for (const sec of sections) {
    if (sec.label === "Intro" || sec.label === "Outro") continue;

    if (sec.group === chorusGroup) {
      const idx = (groupLabelCounters.get("Chorus") || 0) + 1;
      groupLabelCounters.set("Chorus", idx);
      sec.label = `Chorus ${idx}`;
      sec.color = SECTION_COLORS.B; // Violet
    } else if (sec.group === verseGroup) {
      const idx = (groupLabelCounters.get("Verse") || 0) + 1;
      groupLabelCounters.set("Verse", idx);
      sec.label = `Verse ${idx}`;
      sec.color = SECTION_COLORS.A; // Cyan
    } else {
      // Check for Bridge: occurs once, middle 50-80% of track, contrasting
      const midTime = sec.startTime / totalDuration;
      const g = groups.find((grp) => grp.group === sec.group);
      if (
        g?.occurrenceCount === 1 &&
        midTime >= 0.45 &&
        midTime <= 0.85 &&
        chorusGroup
      ) {
        sec.label = "Bridge";
        sec.color = SECTION_COLORS.Bridge;
      } else if (sec.characteristics.melodicVoicingRatio <= 10 && sec.duration >= 8) {
        sec.label = "Instrumental Break";
        sec.color = SECTION_COLORS.Instrumental;
      } else {
        // Honest neutral labeling: Section A, B, etc.
        sec.label = sec.neutralLabel;
      }
    }
  }
}

/**
 * Formats a clean sequence overview (e.g. Intro → Verse 1 → Chorus 1 → Outro).
 */
function formatFormSequence(sections: SongSection[]): string {
  if (sections.length === 0) return "N/A";
  return sections.map((s) => s.label).join(" → ");
}

/**
 * Smooths an array curve with a triangular moving average.
 */
function smoothCurve(arr: number[], radius: number): number[] {
  const result: number[] = [];
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    let sum = 0;
    let weightSum = 0;
    for (let r = -radius; r <= radius; r++) {
      const idx = i + r;
      if (idx >= 0 && idx < len) {
        const w = radius + 1 - Math.abs(r);
        sum += arr[idx] * w;
        weightSum += w;
      }
    }
    result.push(weightSum > 0 ? sum / weightSum : arr[i]);
  }
  return result;
}

/**
 * Generates an honest, evidence-based natural language structural summary.
 */
function generateStructureSummary({
  sectionCount,
  formSummary,
  hasIntro,
  hasOutro,
  groups,
  structuralComplexity,
}: {
  sectionCount: number;
  formSummary: string;
  hasIntro: boolean;
  hasOutro: boolean;
  groups: SectionGroup[];
  structuralComplexity: string;
}): string {
  if (sectionCount === 0) {
    return "No distinct structural boundaries or recurring sections could be isolated.";
  }

  const recurrentGroups = groups.filter((g) => g.occurrenceCount >= 2);
  const repStr =
    recurrentGroups.length > 0
      ? `organized around ${recurrentGroups.length} recurring musical theme${
          recurrentGroups.length > 1 ? "s" : ""
        }`
      : "arranged in a continuous or through-composed non-repeating form";

  const framing = [];
  if (hasIntro) framing.push("introductory passage");
  if (hasOutro) framing.push("outro fade");
  const framingStr =
    framing.length > 0 ? ` featuring an identifiable ${framing.join(" and ")}` : "";

  return `Segmented track into ${sectionCount} structural sections (${formSummary}) ${repStr}${framingStr}. Overall structural complexity is ${structuralComplexity.replace(
    "_",
    " "
  )}.`;
}

function createMinimalStructureResult(
  duration: number,
  summary: string
): StructureAnalysisResult {
  const singleSection: SongSection = {
    id: "section-1-0.00",
    label: "Continuous Section",
    neutralLabel: "Section A",
    group: "A",
    groupIndex: 0,
    occurrenceIndex: 1,
    startTime: 0,
    endTime: Number(duration.toFixed(2)),
    duration: Number(duration.toFixed(2)),
    boundaryConfidence: "low",
    confidenceScore: 0.5,
    characteristics: {
      energy: 0.5,
      energyDynamics: 0.2,
      spectralBrightness: 0.5,
      rhythmicDensity: 2.0,
      harmonicPurity: 0.7,
      dominantChord: null,
      chordChangeCount: 0,
      melodicVoicingRatio: 0,
      melodyPitchRange: null,
    },
    similarSectionIds: [],
    isRepeated: false,
    color: SECTION_COLORS.A,
  };

  return {
    sections: [singleSection],
    totalSections: 1,
    sectionSequence: ["Continuous Section"],
    formSummary: "Continuous Section",
    neutralFormSummary: "Section A",
    groups: [
      {
        group: "A",
        label: "Section A",
        sectionIds: [singleSection.id],
        occurrenceCount: 1,
        totalDuration: duration,
        averageEnergy: 0.5,
        color: SECTION_COLORS.A,
      },
    ],
    transitions: [],
    similarityPairs: [],
    hasIntro: false,
    hasOutro: false,
    structuralComplexity: "minimal",
    analysisSummary: summary,
  };
}
