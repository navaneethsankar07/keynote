import { BeatTrackingResult } from "./types";
import { OnsetDetectionResult } from "./onset-detection";

/**
 * Tracks beat positions in seconds by finding the optimal onset phase alignment
 * and refining each beat grid marker against local onset transient peaks.
 */
export function trackBeats(
  onsets: OnsetDetectionResult,
  beatIntervalSeconds: number
): BeatTrackingResult {
  const { onsetEnvelope, hopSizeSeconds, totalFrames, isSilent } = onsets;

  if (isSilent || totalFrames === 0 || beatIntervalSeconds <= 0) {
    return {
      beatTimestamps: [],
      totalBeats: 0,
      averageIntervalMs: 0,
      regularityScore: 0,
      firstBeatOffset: 0,
    };
  }

  const periodFrames = Math.round(beatIntervalSeconds / hopSizeSeconds);
  if (periodFrames <= 0 || periodFrames >= totalFrames) {
    return {
      beatTimestamps: [],
      totalBeats: 0,
      averageIntervalMs: 0,
      regularityScore: 0,
      firstBeatOffset: 0,
    };
  }

  // 1. Find optimal phase offset (0 <= phi < periodFrames) that maximizes correlation with onset envelope
  let bestPhi = 0;
  let maxPhaseScore = -1;

  for (let phi = 0; phi < periodFrames; phi++) {
    let score = 0;
    let count = 0;

    for (let f = phi; f < totalFrames; f += periodFrames) {
      score += onsetEnvelope[f];
      count++;
    }

    const avgScore = count > 0 ? score / count : 0;
    if (avgScore > maxPhaseScore) {
      maxPhaseScore = avgScore;
      bestPhi = phi;
    }
  }

  // 2. Refine individual beat positions against local onset peaks
  // Window of +/- 22% of beat period for onset snapping
  const searchWindow = Math.max(1, Math.round(periodFrames * 0.22));
  const beatTimestamps: number[] = [];

  for (let nominal = bestPhi; nominal < totalFrames; nominal += periodFrames) {
    const start = Math.max(0, nominal - searchWindow);
    const end = Math.min(totalFrames - 1, nominal + searchWindow);

    let localMaxFrame = nominal;
    let localMaxVal = onsetEnvelope[nominal];

    for (let f = start; f <= end; f++) {
      if (onsetEnvelope[f] > localMaxVal) {
        localMaxVal = onsetEnvelope[f];
        localMaxFrame = f;
      }
    }

    // Only snap to peak if local peak is pronounced enough
    const refinedFrame = localMaxVal > 0.12 ? localMaxFrame : nominal;
    const timestamp = Math.round(refinedFrame * hopSizeSeconds * 1000) / 1000;
    beatTimestamps.push(timestamp);
  }

  const totalBeats = beatTimestamps.length;
  if (totalBeats <= 1) {
    return {
      beatTimestamps,
      totalBeats,
      averageIntervalMs: Math.round(beatIntervalSeconds * 1000),
      regularityScore: 0.5,
      firstBeatOffset: beatTimestamps[0] || 0,
    };
  }

  // 3. Compute actual average interval and regularity (consistency score)
  const intervals: number[] = [];
  let intervalSum = 0;

  for (let i = 1; i < totalBeats; i++) {
    const diff = beatTimestamps[i] - beatTimestamps[i - 1];
    intervals.push(diff);
    intervalSum += diff;
  }

  const meanInterval = intervalSum / intervals.length;

  let varSum = 0;
  for (const diff of intervals) {
    const dev = diff - meanInterval;
    varSum += dev * dev;
  }
  const stdInterval = Math.sqrt(varSum / intervals.length);

  // Regularity score: lower standard deviation = higher regularity (1.0 = machine-precise)
  const coefficientOfVariation = stdInterval / (meanInterval || 1);
  const regularityScore = Math.max(0.1, Math.min(1.0, 1.0 - coefficientOfVariation * 2.5));

  return {
    beatTimestamps,
    totalBeats,
    averageIntervalMs: Math.round(meanInterval * 1000),
    regularityScore: Math.round(regularityScore * 100) / 100,
    firstBeatOffset: beatTimestamps[0] || 0,
  };
}
