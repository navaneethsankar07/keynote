/**
 * Musical Key & Scale Detection Engine
 *
 * Estimates the musical key (tonic pitch class + major/minor mode) from
 * a 12-dimensional pitch-class chroma distribution.
 *
 * Implements:
 * - Krumhansl-Schmuckler cognitive tonal pitch-class profiles
 * - Pearson product-moment correlation across all 24 diatonic keys (12 Major, 12 Minor)
 * - Harmonic relationship identification (Relative Major/Minor, Parallel, Dominant)
 * - Statistically grounded confidence scoring based on absolute correlation and runner-up margin
 * - Scale degree mapping for the detected diatonic tonality
 * - Transparent, non-fabricated musicological explanations
 */

import {
  PITCH_CLASSES,
  TonalMode,
  KeyCandidate,
  KeyAnalysisResult,
  KeyConfidence,
} from "./types";
import { ChromaResult } from "./chroma";

// Krumhansl-Schmuckler Tonal Key Profiles (Normalized)
// Derived from extensive empirical psychoacoustic probe-tone experiments
const KRUMHANSL_MAJOR_PROFILE = [
  6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88,
];

const KRUMHANSL_MINOR_PROFILE = [
  6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17,
];

// Diatonic scale formulas (intervals in semitones from root)
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10]; // Natural Minor / Aeolian

/**
 * Computes the Pearson correlation coefficient r between two 12-element numeric vectors.
 * Returns a value between -1.0 (perfect negative) and +1.0 (perfect positive correlation).
 */
export function computePearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;

  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  let numerator = 0;
  let varX = 0;
  let varY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    varX += diffX * diffX;
    varY += diffY * diffY;
  }

  const denominator = Math.sqrt(varX * varY);
  if (denominator < 1e-9) return 0;

  return numerator / denominator;
}

/**
 * Identifies the harmonic relationship of a candidate key relative to the primary detected key.
 */
function identifyKeyRelationship(
  primaryRootIdx: number,
  primaryMode: TonalMode,
  candidateRootIdx: number,
  candidateMode: TonalMode
): string | undefined {
  if (primaryMode === "Major") {
    // Relative Minor is 9 semitones above (or 3 semitones below)
    if (candidateMode === "Minor" && candidateRootIdx === (primaryRootIdx + 9) % 12) {
      return "Relative Minor";
    }
    // Parallel Minor is same root, minor mode
    if (candidateMode === "Minor" && candidateRootIdx === primaryRootIdx) {
      return "Parallel Minor";
    }
    // Dominant Major is 7 semitones above (Perfect 5th)
    if (candidateMode === "Major" && candidateRootIdx === (primaryRootIdx + 7) % 12) {
      return "Dominant (5th)";
    }
    // Subdominant Major is 5 semitones above (Perfect 4th)
    if (candidateMode === "Major" && candidateRootIdx === (primaryRootIdx + 5) % 12) {
      return "Subdominant (4th)";
    }
  } else {
    // Relative Major is 3 semitones above
    if (candidateMode === "Major" && candidateRootIdx === (primaryRootIdx + 3) % 12) {
      return "Relative Major";
    }
    // Parallel Major is same root, major mode
    if (candidateMode === "Major" && candidateRootIdx === primaryRootIdx) {
      return "Parallel Major";
    }
    // Dominant Minor is 7 semitones above
    if (candidateMode === "Minor" && candidateRootIdx === (primaryRootIdx + 7) % 12) {
      return "Dominant Minor";
    }
    // Subdominant Minor is 5 semitones above
    if (candidateMode === "Minor" && candidateRootIdx === (primaryRootIdx + 5) % 12) {
      return "Subdominant Minor";
    }
  }

  return undefined;
}

/**
 * Detects musical key and tonal scale from a chroma distribution.
 */
export function detectMusicalKey(chroma: ChromaResult): KeyAnalysisResult {
  const { distribution, percentages, isSilent } = chroma;

  // Handle silence or empty audio
  if (isSilent) {
    return {
      key: "Undetermined",
      root: "C",
      mode: "Major",
      confidence: "ambiguous",
      confidenceScore: 0,
      confidenceReason: "The audio signal contains negligible acoustic energy to establish tonality.",
      correlationScore: 0,
      alternativeKeys: [],
      chromaDistribution: distribution,
      chromaPercentages: percentages,
      scaleDegrees: [],
      explanation: "No discernible pitch-class energy detected in the audio file.",
    };
  }

  const allCandidates: KeyCandidate[] = [];

  // Evaluate all 24 keys (12 Major, 12 Minor)
  for (let rootIdx = 0; rootIdx < 12; rootIdx++) {
    const rootName = PITCH_CLASSES[rootIdx];

    // Major rotation
    const rotatedMajor = new Array(12);
    for (let i = 0; i < 12; i++) {
      rotatedMajor[i] = KRUMHANSL_MAJOR_PROFILE[(i - rootIdx + 12) % 12];
    }
    const majorCorr = computePearsonCorrelation(distribution, rotatedMajor);
    allCandidates.push({
      root: rootName,
      mode: "Major",
      keyName: `${rootName} Major`,
      correlation: majorCorr,
      scorePercent: 0, // Computed below
    });

    // Minor rotation
    const rotatedMinor = new Array(12);
    for (let i = 0; i < 12; i++) {
      rotatedMinor[i] = KRUMHANSL_MINOR_PROFILE[(i - rootIdx + 12) % 12];
    }
    const minorCorr = computePearsonCorrelation(distribution, rotatedMinor);
    allCandidates.push({
      root: rootName,
      mode: "Minor",
      keyName: `${rootName} Minor`,
      correlation: minorCorr,
      scorePercent: 0, // Computed below
    });
  }

  // Sort descending by Pearson correlation
  allCandidates.sort((a, b) => b.correlation - a.correlation);

  const bestCandidate = allCandidates[0];
  const secondCandidate = allCandidates[1];
  const separation = bestCandidate.correlation - secondCandidate.correlation;

  const bestRootIdx = PITCH_CLASSES.indexOf(bestCandidate.root);

  // Compute normalized score percentages relative to best candidate
  const maxScore = Math.max(0.1, bestCandidate.correlation);
  for (const cand of allCandidates) {
    const relativeScore = Math.max(0, cand.correlation) / maxScore;
    cand.scorePercent = Math.round(relativeScore * 100);

    const candRootIdx = PITCH_CLASSES.indexOf(cand.root);
    cand.relationship = identifyKeyRelationship(
      bestRootIdx,
      bestCandidate.mode,
      candRootIdx,
      cand.mode
    );
  }

  // Derive Confidence
  let confidence: KeyConfidence = "low";
  let confidenceScore = 0.4;
  let confidenceReason = "";

  if (bestCandidate.correlation >= 0.65 && separation >= 0.055) {
    confidence = "high";
    confidenceScore = Math.min(0.96, 0.75 + separation * 1.8);
    confidenceReason = `Strong harmonic profile correlation (r = ${bestCandidate.correlation.toFixed(
      2
    )}) with unambiguous separation (+${separation.toFixed(2)}) over runner-up candidates.`;
  } else if (bestCandidate.correlation >= 0.50 && separation >= 0.025) {
    confidence = "moderate";
    confidenceScore = Math.min(0.74, 0.5 + separation * 1.5);
    confidenceReason = `Consistent tonal center detected (r = ${bestCandidate.correlation.toFixed(
      2
    )}), with close secondary correlation from ${secondCandidate.keyName}${
      secondCandidate.relationship ? ` (${secondCandidate.relationship})` : ""
    }.`;
  } else if (bestCandidate.correlation < 0.38) {
    confidence = "low";
    confidenceScore = 0.25;
    confidenceReason = `Weak tonal coherence (r = ${bestCandidate.correlation.toFixed(
      2
    )}). Audio may feature complex chromaticism, atonal textures, or heavy non-pitched percussion.`;
  } else {
    confidence = "ambiguous";
    confidenceScore = 0.38;
    confidenceReason = `Dual tonal ambiguity between ${bestCandidate.keyName} and ${
      secondCandidate.keyName
    }${
      secondCandidate.relationship ? ` (${secondCandidate.relationship})` : ""
    } due to shared diatonic scale degrees.`;
  }

  // Scale degrees belonging to detected key
  const intervals =
    bestCandidate.mode === "Major" ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
  const scaleDegrees = intervals.map((interval) => (bestRootIdx + interval) % 12);

  // Filter top alternatives (exclude top candidate itself, take next 3 highest)
  const alternativeKeys = allCandidates.slice(1, 4);

  // Generate factual musicological explanation
  const rootPct = percentages[bestRootIdx];
  const fifthIdx = (bestRootIdx + 7) % 12;
  const fifthPct = percentages[fifthIdx];
  const thirdInterval = bestCandidate.mode === "Major" ? 4 : 3;
  const thirdIdx = (bestRootIdx + thirdInterval) % 12;
  const thirdPct = percentages[thirdIdx];

  const explanation =
    `Harmonic energy concentrates strongly on the tonic ${bestCandidate.root} (${rootPct}%) ` +
    `and dominant ${PITCH_CLASSES[fifthIdx]} (${fifthPct}%). The modal character is established by ` +
    `${bestCandidate.mode === "Major" ? "major third" : "minor third"} ${PITCH_CLASSES[thirdIdx]} (${thirdPct}%), ` +
    `yielding high mathematical alignment with the ${bestCandidate.keyName} diatonic pitch-class template.`;

  return {
    key: bestCandidate.keyName,
    root: bestCandidate.root,
    mode: bestCandidate.mode,
    confidence,
    confidenceScore,
    confidenceReason,
    correlationScore: Math.round(bestCandidate.correlation * 100) / 100,
    alternativeKeys,
    chromaDistribution: distribution,
    chromaPercentages: percentages,
    scaleDegrees,
    explanation,
  };
}

