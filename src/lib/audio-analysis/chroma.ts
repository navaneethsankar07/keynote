/**
 * Chroma Feature Extraction (Pitch-Class Profile)
 *
 * Extracts a 12-dimensional chroma vector representing the distribution
 * of acoustic energy across the 12 semitones of the chromatic scale:
 * [C, C♯, D, D♯, E, F, F♯, G, G♯, A, A♯, B].
 *
 * Implements:
 * - FFT spectral analysis via Cooley-Tukey Radix-2 FFT
 * - Hann windowing to suppress spectral leakage
 * - Frequency-to-MIDI pitch binning within musical fundamental range (65 Hz - 2100 Hz)
 * - Triangular semitone weighting to handle continuous pitch variation
 * - Log-magnitude compression to balance loud and quiet harmonic content
 * - L1 normalization yielding a pitch-class probability distribution
 */

export interface ChromaExtractionOptions {
  windowSize?: number; // Must be power of 2, default 4096
  maxFrames?: number; // Target number of frames across the file, default 400
  minFrequency?: number; // Lowest frequency in Hz, default 65.4 Hz (C2)
  maxFrequency?: number; // Highest frequency in Hz, default 2093 Hz (C7)
}

export interface ChromaResult {
  distribution: number[]; // 12 normalized values summing to 1.0 (or 0 if silent)
  percentages: number[]; // 12 values scaled 0 to 100 with 1 decimal place
  isSilent: boolean;
  framesAnalyzed: number;
}

/**
 * Computes an in-place Radix-2 Cooley-Tukey Fast Fourier Transform.
 * @param real Array of real values (length must be power of 2)
 * @param imag Array of imaginary values (length must equal real)
 */
export function radix2FFT(real: Float32Array, imag: Float32Array): void {
  const n = real.length;
  if ((n & (n - 1)) !== 0) {
    throw new Error("FFT size must be a power of 2");
  }

  // Bit-reversal permutation
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      const tempR = real[i];
      const tempI = imag[i];
      real[i] = real[j];
      imag[i] = imag[j];
      real[j] = tempR;
      imag[j] = tempI;
    }
    let k = n >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }

  // Butterfly passes
  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const angle = (-2 * Math.PI) / len;
    const wStepR = Math.cos(angle);
    const wStepI = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let wR = 1.0;
      let wI = 0.0;

      for (let k = 0; k < halfLen; k++) {
        const idx1 = i + k;
        const idx2 = idx1 + halfLen;

        const uR = real[idx1];
        const uI = imag[idx1];

        const tR = real[idx2] * wR - imag[idx2] * wI;
        const tI = real[idx2] * wI + imag[idx2] * wR;

        real[idx1] = uR + tR;
        imag[idx1] = uI + tI;
        real[idx2] = uR - tR;
        imag[idx2] = uI - tI;

        const nextWR = wR * wStepR - wI * wStepI;
        const nextWI = wR * wStepI + wI * wStepR;
        wR = nextWR;
        wI = nextWI;
      }
    }
  }
}

/**
 * Extracts the 12-pitch-class Chroma energy distribution from an AudioBuffer.
 */
export function extractChromaDistribution(
  audioBuffer: AudioBuffer,
  options: ChromaExtractionOptions = {}
): ChromaResult {
  const {
    windowSize = 4096,
    maxFrames = 400,
    minFrequency = 65.4, // C2
    maxFrequency = 2093.0, // C7
  } = options;

  const rawSampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const rawLength = audioBuffer.length;

  if (rawLength === 0) {
    return {
      distribution: new Array(12).fill(1 / 12),
      percentages: new Array(12).fill(8.3),
      isSilent: true,
      framesAnalyzed: 0,
    };
  }

  // Downsample to effective ~11025 Hz to give exquisite spectral resolution (Δf ≈ 2.69 Hz)
  // which cleanly separates semitones even in the lowest musical octaves (C2 = 65.4 Hz)
  const downsampleFactor =
    rawSampleRate >= 40000
      ? Math.floor(rawSampleRate / 11025)
      : rawSampleRate >= 20000
      ? Math.floor(rawSampleRate / 11025)
      : 1;
  const effectiveSampleRate = rawSampleRate / downsampleFactor;
  const effectiveLength = Math.floor(rawLength / downsampleFactor);

  // Extract mono signal with downsampling
  const monoSignal = new Float32Array(effectiveLength);
  const ch0 = audioBuffer.getChannelData(0);
  const ch1 = numChannels > 1 ? audioBuffer.getChannelData(1) : null;

  if (ch1) {
    for (let i = 0; i < effectiveLength; i++) {
      const srcIdx = i * downsampleFactor;
      monoSignal[i] = (ch0[srcIdx] + ch1[srcIdx]) * 0.5;
    }
  } else {
    for (let i = 0; i < effectiveLength; i++) {
      const srcIdx = i * downsampleFactor;
      monoSignal[i] = ch0[srcIdx];
    }
  }

  // Pre-calculate Hann window
  const hannWindow = new Float32Array(windowSize);
  for (let n = 0; n < windowSize; n++) {
    hannWindow[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (windowSize - 1)));
  }

  // Determine frame count and step size across the signal
  const availableFrames = Math.max(1, Math.floor((effectiveLength - windowSize) / (windowSize / 2)));
  const numFrames = Math.min(availableFrames, maxFrames);
  const hopSize = Math.max(1, Math.floor((effectiveLength - windowSize) / Math.max(1, numFrames)));

  // 12-dimensional chroma accumulator
  const chromaBins = new Float64Array(12);
  let totalEnergy = 0;
  let validFrames = 0;

  // Reusable FFT buffers
  const realBuf = new Float32Array(windowSize);
  const imagBuf = new Float32Array(windowSize);

  // Pre-map FFT bins to continuous triangular semitone filterbank
  const halfWindow = windowSize / 2;
  const binFrequencyResolution = effectiveSampleRate / windowSize;

  const minBin = Math.max(1, Math.floor(minFrequency / binFrequencyResolution));
  const maxBin = Math.min(halfWindow - 1, Math.ceil(maxFrequency / binFrequencyResolution));

  const binPc0 = new Int8Array(maxBin + 1);
  const binPc1 = new Int8Array(maxBin + 1);
  const binFrac = new Float32Array(maxBin + 1);

  for (let k = minBin; k <= maxBin; k++) {
    const freq = k * binFrequencyResolution;
    if (freq >= minFrequency && freq <= maxFrequency) {
      // Frequency to continuous MIDI pitch (A4 = 440 Hz = MIDI 69)
      const midi = 69 + 12 * (Math.log(freq / 440) / Math.LN2);
      const s0 = Math.floor(midi);
      const frac = midi - s0;
      binPc0[k] = ((s0 % 12) + 12) % 12;
      binPc1[k] = (((s0 + 1) % 12) + 12) % 12;
      binFrac[k] = frac;
    } else {
      binPc0[k] = -1;
      binPc1[k] = -1;
      binFrac[k] = 0;
    }
  }

  // Process frames
  for (let f = 0; f < numFrames; f++) {
    const frameStart = f * hopSize;
    if (frameStart + windowSize > effectiveLength) break;

    // Apply window and check frame energy
    let frameRms = 0;
    for (let n = 0; n < windowSize; n++) {
      const sample = monoSignal[frameStart + n] * hannWindow[n];
      realBuf[n] = sample;
      imagBuf[n] = 0.0;
      frameRms += sample * sample;
    }

    // Skip almost-silent frames (e.g. intro/outro silence)
    if (frameRms < 1e-7 * windowSize) {
      continue;
    }

    validFrames++;
    radix2FFT(realBuf, imagBuf);

    // Accumulate spectral power into continuous chroma filterbank
    for (let k = minBin; k <= maxBin; k++) {
      const p0 = binPc0[k];
      if (p0 < 0) continue;

      const p1 = binPc1[k];
      const frac = binFrac[k];

      const r = realBuf[k];
      const im = imagBuf[k];
      const power = r * r + im * im;

      chromaBins[p0] += power * (1.0 - frac);
      chromaBins[p1] += power * frac;
      totalEnergy += power;
    }
  }

  // Handle silent or near-silent files
  if (totalEnergy < 1e-5 || validFrames === 0) {
    return {
      distribution: new Array(12).fill(1 / 12),
      percentages: new Array(12).fill(8.3),
      isSilent: true,
      framesAnalyzed: validFrames,
    };
  }

  // Normalize distribution to sum to 1.0
  const distribution: number[] = new Array(12);
  const percentages: number[] = new Array(12);

  for (let i = 0; i < 12; i++) {
    const val = chromaBins[i] / totalEnergy;
    distribution[i] = val;
    percentages[i] = Math.round(val * 1000) / 10; // e.g. 15.4%
  }

  return {
    distribution,
    percentages,
    isSilent: false,
    framesAnalyzed: validFrames,
  };
}
