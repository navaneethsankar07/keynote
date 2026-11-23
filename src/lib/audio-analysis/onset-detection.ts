export interface OnsetDetectionResult {
  onsetEnvelope: Float32Array;
  hopSizeSeconds: number;
  sampleRate: number;
  totalFrames: number;
  isSilent: boolean;
  meanOnsetEnergy: number;
  maxOnsetEnergy: number;
}

/**
 * Extracts a normalized onset strength envelope from an AudioBuffer.
 * Uses framed energy flux with high-frequency pre-emphasis and adaptive thresholding.
 */
export function extractOnsetEnvelope(audioBuffer: AudioBuffer): OnsetDetectionResult {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;

  // 1. Convert to mono
  const mono = new Float32Array(length);
  const ch0 = audioBuffer.getChannelData(0);

  if (numChannels === 1) {
    mono.set(ch0);
  } else {
    const ch1 = audioBuffer.getChannelData(1);
    for (let i = 0; i < length; i++) {
      mono[i] = (ch0[i] + ch1[i]) * 0.5;
    }
  }

  // 2. Framing parameters (hop = 10ms = 100 frames/sec)
  const hopSizeSeconds = 0.01;
  const hopSize = Math.max(1, Math.round(sampleRate * hopSizeSeconds));
  const frameSize = hopSize * 2; // 20ms window
  const totalFrames = Math.max(0, Math.floor((length - frameSize) / hopSize));

  if (totalFrames < 10) {
    return {
      onsetEnvelope: new Float32Array(0),
      hopSizeSeconds,
      sampleRate,
      totalFrames: 0,
      isSilent: true,
      meanOnsetEnergy: 0,
      maxOnsetEnergy: 0,
    };
  }

  // 3. Compute short-time energy with pre-emphasis for high-frequency transients
  const rawEnergies = new Float32Array(totalFrames);
  let totalSignalEnergy = 0;

  for (let f = 0; f < totalFrames; f++) {
    const offset = f * hopSize;
    let sumSq = 0;
    let prevSample = 0;

    for (let j = 0; j < frameSize; j++) {
      const s = mono[offset + j];
      // High-pass pre-emphasis (highlights drum attacks & transient edges)
      const diff = s - 0.85 * prevSample;
      prevSample = s;
      sumSq += s * s * 0.4 + diff * diff * 0.6;
    }

    const rms = Math.sqrt(sumSq / frameSize);
    rawEnergies[f] = rms;
    totalSignalEnergy += rms;
  }

  // Check for absolute silence
  if (totalSignalEnergy < 1e-5) {
    return {
      onsetEnvelope: new Float32Array(totalFrames),
      hopSizeSeconds,
      sampleRate,
      totalFrames,
      isSilent: true,
      meanOnsetEnergy: 0,
      maxOnsetEnergy: 0,
    };
  }

  // 4. Compute half-wave rectified first difference (spectral energy flux)
  // log compression: log(1 + 100 * E) mimics human ear perception of loudness
  const flux = new Float32Array(totalFrames);
  for (let f = 1; f < totalFrames; f++) {
    const prev = Math.log1p(rawEnergies[f - 1] * 80);
    const curr = Math.log1p(rawEnergies[f] * 80);
    const diff = curr - prev;
    flux[f] = diff > 0 ? diff : 0;
  }

  // 5. Adaptive threshold subtraction (moving local mean over ~350ms window)
  const halfWindow = Math.max(2, Math.round(0.175 / hopSizeSeconds));
  const windowLen = halfWindow * 2 + 1;
  const onsetEnvelope = new Float32Array(totalFrames);

  let runningSum = 0;
  for (let i = 0; i < Math.min(windowLen, totalFrames); i++) {
    runningSum += flux[i];
  }

  let maxOnset = 0;
  let onsetSum = 0;

  for (let f = 0; f < totalFrames; f++) {
    // Slide window
    const removeIdx = f - halfWindow - 1;
    const addIdx = f + halfWindow;
    if (removeIdx >= 0) runningSum -= flux[removeIdx];
    if (addIdx < totalFrames) runningSum += flux[addIdx];

    const count = Math.min(f + halfWindow, totalFrames - 1) - Math.max(0, f - halfWindow) + 1;
    const localMean = runningSum / count;

    // Novelty value above local background
    const val = Math.max(0, flux[f] - localMean * 0.9);
    onsetEnvelope[f] = val;
    onsetSum += val;
    if (val > maxOnset) maxOnset = val;
  }

  // 6. Normalization
  if (maxOnset > 0) {
    const invMax = 1.0 / maxOnset;
    for (let f = 0; f < totalFrames; f++) {
      onsetEnvelope[f] *= invMax;
    }
  }

  const meanOnset = totalFrames > 0 ? (onsetSum / totalFrames) / (maxOnset || 1) : 0;
  const isSilent = maxOnset < 1e-4;

  return {
    onsetEnvelope,
    hopSizeSeconds,
    sampleRate,
    totalFrames,
    isSilent,
    meanOnsetEnergy: meanOnset,
    maxOnsetEnergy: maxOnset,
  };
}
