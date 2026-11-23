import { TempoAnalysisResult, TempoConfidence } from "./types";
import { OnsetDetectionResult } from "./onset-detection";

export interface TempoEstimationOptions {
  minBpm?: number;
  maxBpm?: number;
}

/**
 * Estimates tempo (BPM) from an onset strength envelope using normalized autocorrelation,
 * sub-sample parabolic interpolation, perceptual tempo weighting, and harmonic ambiguity detection.
 */
export function estimateTempo(
  onsets: OnsetDetectionResult,
  options: TempoEstimationOptions = {}
): TempoAnalysisResult {
  const { minBpm = 50, maxBpm = 220 } = options;
  const { onsetEnvelope, hopSizeSeconds, totalFrames, isSilent } = onsets;

  if (isSilent || totalFrames < 40) {
    return {
      bpm: 0,
      confidence: "low",
      confidenceScore: 0.1,
      confidenceReason: "Insufficient audio signal or silence detected.",
      alternativeBpm: null,
      alternativeLabel: null,
      beatIntervalSeconds: 0,
    };
  }

  // 1. Calculate lag bounds corresponding to min/max BPM
  // lag = 60 / (BPM * hopSizeSeconds)
  const minLag = Math.max(2, Math.floor(60 / (maxBpm * hopSizeSeconds)));
  const maxLag = Math.min(totalFrames - 10, Math.ceil(60 / (minBpm * hopSizeSeconds)));

  if (minLag >= maxLag || maxLag >= totalFrames) {
    return {
      bpm: 0,
      confidence: "low",
      confidenceScore: 0.1,
      confidenceReason: "Audio file duration is too short to estimate tempo.",
      alternativeBpm: null,
      alternativeLabel: null,
      beatIntervalSeconds: 0,
    };
  }

  // 2. Compute normalized autocorrelation R[lag] over search window
  const lagRangeCount = maxLag - minLag + 1;
  const rValues = new Float32Array(lagRangeCount);
  let rSum = 0;
  let rMax = 0;

  for (let lag = minLag; lag <= maxLag; lag++) {
    const idx = lag - minLag;
    let sum = 0;
    const nTerms = totalFrames - lag;

    for (let t = 0; t < nTerms; t++) {
      sum += onsetEnvelope[t] * onsetEnvelope[t + lag];
    }

    // Unbiased normalization
    const normalized = sum / Math.max(1, nTerms);
    rValues[idx] = normalized;
    rSum += normalized;
    if (normalized > rMax) rMax = normalized;
  }

  const rMean = rSum / lagRangeCount;

  // Calculate variance/std of autocorrelation
  let rVarSum = 0;
  for (let i = 0; i < lagRangeCount; i++) {
    const d = rValues[i] - rMean;
    rVarSum += d * d;
  }
  const rStd = Math.sqrt(rVarSum / lagRangeCount);

  // 3. Find candidate local maxima in autocorrelation
  interface PeakCandidate {
    lag: number;
    value: number;
    weightedScore: number;
    bpm: number;
  }

  const peaks: PeakCandidate[] = [];

  for (let i = 1; i < lagRangeCount - 1; i++) {
    const prev = rValues[i - 1];
    const curr = rValues[i];
    const next = rValues[i + 1];

    if (curr > prev && curr > next && curr > rMean) {
      const lag = minLag + i;
      const bpm = 60 / (lag * hopSizeSeconds);

      // Human perceptual preference prior centered around 120 BPM
      // Prior weight = exp(-0.5 * ((bpm - 120) / 45)^2)
      const diffBpm = (bpm - 120) / 45;
      const perceptualPrior = Math.exp(-0.5 * diffBpm * diffBpm);

      // Combined score: 65% raw correlation strength + 35% perceptual prior
      const weightedScore = curr * (0.65 + 0.35 * perceptualPrior);

      peaks.push({
        lag,
        value: curr,
        weightedScore,
        bpm,
      });
    }
  }

  // If no distinct peaks found, audio is unmetered or non-rhythmic
  if (peaks.length === 0 || rStd < 1e-5) {
    return {
      bpm: 0,
      confidence: "low",
      confidenceScore: 0.15,
      confidenceReason: "No periodic rhythm or repetitive pulse detected in the audio.",
      alternativeBpm: null,
      alternativeLabel: null,
      beatIntervalSeconds: 0,
    };
  }

  // Sort peaks by weighted score descending
  peaks.sort((a, b) => b.weightedScore - a.weightedScore);
  let bestPeak = peaks[0];
  let alternativeBpm: number | null = null;
  let alternativeLabel: string | null = null;

  // Check if bestPeak is actually a harmonic multiple (e.g. 2x or 3x lag) of a true fundamental
  // In autocorrelation, signals with period P also peak at 2P and 3P.
  // If a fundamental peak exists at ~bestPeak.lag / 2 or / 3 with at least 65% of the energy,
  // the fundamental pulse represents the true musical tempo.
  for (const candidate of peaks) {
    if (candidate.lag < bestPeak.lag) {
      const ratio = bestPeak.lag / candidate.lag;
      if (
        (Math.abs(ratio - 2.0) < 0.12 || Math.abs(ratio - 3.0) < 0.15) &&
        candidate.value >= bestPeak.value * 0.65
      ) {
        // Promote candidate to primary fundamental
        const altLag = bestPeak.lag;
        const altBpm = Math.round((60 / (altLag * hopSizeSeconds)) * 10) / 10;
        alternativeBpm = altBpm;
        alternativeLabel = Math.abs(ratio - 2.0) < 0.12 ? "Half-time candidate" : "Sub-harmonic candidate";
        bestPeak = candidate;
        break;
      }
    }
  }

  // 4. Parabolic sub-sample peak interpolation for exact BPM precision
  const bestIdx = bestPeak.lag - minLag;
  let exactLag = bestPeak.lag;

  if (bestIdx > 0 && bestIdx < lagRangeCount - 1) {
    const alpha = rValues[bestIdx - 1];
    const beta = rValues[bestIdx];
    const gamma = rValues[bestIdx + 1];
    const denom = 2 * (2 * beta - alpha - gamma);
    if (Math.abs(denom) > 1e-6) {
      const delta = (alpha - gamma) / denom;
      exactLag += Math.max(-0.5, Math.min(0.5, delta));
    }
  }

  const detectedBpm = Math.round((60 / (exactLag * hopSizeSeconds)) * 10) / 10;
  const beatIntervalSeconds = exactLag * hopSizeSeconds;

  // 5. If alternative BPM was not already assigned from harmonic resolution, search for half/double candidates
  if (alternativeBpm === null) {
    for (let i = 0; i < peaks.length; i++) {
      const candidate = peaks[i];
      if (candidate.lag === bestPeak.lag) continue;
      const ratioToBest = candidate.value / bestPeak.value;

      // Check for double lag (half-time BPM: candidate lag ~ 2 * bestLag)
      const lagRatio = candidate.lag / exactLag;
      if (Math.abs(lagRatio - 2.0) < 0.12 && ratioToBest > 0.6) {
        alternativeBpm = Math.round((detectedBpm / 2) * 10) / 10;
        alternativeLabel = "Half-time candidate";
        break;
      }

      // Check for half lag (double-time BPM: candidate lag ~ 0.5 * bestLag)
      if (Math.abs(lagRatio - 0.5) < 0.12 && ratioToBest > 0.6) {
        alternativeBpm = Math.round((detectedBpm * 2) * 10) / 10;
        alternativeLabel = "Double-time candidate";
        break;
      }
    }
  }

  // 6. Quantitative confidence scoring based on peak prominence over noise
  // Prominence is how many standard deviations the peak stands out from the mean
  const prominence = (bestPeak.value - rMean) / (rStd || 1e-4);

  let confidence: TempoConfidence;
  let confidenceScore: number;
  let confidenceReason: string;

  if (prominence >= 2.8) {
    confidence = "high";
    confidenceScore = Math.min(0.96, 0.75 + (prominence - 2.8) * 0.05);
    confidenceReason = "Strong periodic onset peaks detected with consistent rhythm.";
  } else if (prominence >= 1.7) {
    confidence = "moderate";
    confidenceScore = Math.min(0.74, 0.5 + (prominence - 1.7) * 0.2);
    confidenceReason = "Identifiable rhythmic pulses with subtle tempo drift or competing sub-harmonics.";
  } else {
    confidence = "low";
    confidenceScore = Math.max(0.2, 0.3 + (prominence - 1.0) * 0.15);
    confidenceReason = "Weak or diffuse periodic rhythm; audio may have expressive timing or subtle percussion.";
  }

  return {
    bpm: detectedBpm,
    confidence,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    confidenceReason,
    alternativeBpm,
    alternativeLabel,
    beatIntervalSeconds,
  };
}
