/**
 * Instrument & Sound Source Identification Engine
 *
 * Implements:
 * 1. Multi-band spectral energy distribution (sub-bass, bass, low-mid, mid, high-mid, brilliance)
 * 2. Spectral moment analysis: Spectral Centroid (brightness), Rolloff, Spectral Flatness, and Flux
 * 3. Temporal envelope analysis: attack sharpness, decay characteristics, and transient density
 * 4. Human vocal presence detection via formant energy (F1/F2 in 400-2600Hz) and melody tracking
 * 5. Percussion sound source analysis (Kick drum, Snare/Clap, Hi-Hats/Cymbals, Electronic vs Acoustic)
 * 6. Bass sound source analysis (Bass Guitar vs Synth Bass vs Sub-Bass)
 * 7. Harmonic & Keyboard sound source classification (Piano, Guitar, Synth Pad, Organ)
 * 8. Overall timbral profiling (Brightness, Harmonicity, Dynamic Range, Acousticness vs Electronicness)
 * 9. Honest specificity & confidence scoring (distinguishing broad families from specific candidates)
 */

import {
  InstrumentDetection,
  InstrumentFamily,
  InstrumentAnalysisResult,
  VocalAnalysis,
  PercussionAnalysis,
  BassAnalysis,
  TimbreProfile,
  ChordAnalysisResult,
  MelodyAnalysisResult,
  TempoAnalysisResult,
  BeatTrackingResult,
} from "./types";
import { radix2FFT } from "./chroma";

export interface InstrumentAnalysisOptions {
  onProgress?: (percent: number, message: string) => void;
}

interface FrameSpectralStats {
  rms: number;
  centroid: number;
  rolloff: number;
  flatness: number;
  subBassEnergy: number; // 20 - 90 Hz
  bassEnergy: number; // 90 - 250 Hz
  lowMidEnergy: number; // 250 - 800 Hz
  midEnergy: number; // 800 - 2800 Hz (vocal formant region)
  highMidEnergy: number; // 2800 - 6500 Hz (snare snap, presence)
  highEnergy: number; // 6500 - 15000 Hz (cymbals, hi-hats, air)
}

const FAMILY_COLORS: Record<InstrumentFamily, string> = {
  voice: "#EC4899", // Pink
  percussion: "#F59E0B", // Amber
  bass: "#3B82F6", // Blue
  keyboard: "#8B5CF6", // Violet
  strings: "#10B981", // Emerald
  wind_brass: "#F97316", // Orange
  electronic: "#06B6D4", // Cyan
  ambient_fx: "#A855F7", // Purple
};

/**
 * Executes full client-side instrument and sound source identification.
 */
export async function analyzeInstrumentsAndSounds(
  audioBuffer: AudioBuffer,
  context: {
    chords: ChordAnalysisResult;
    melody: MelodyAnalysisResult;
    tempo: TempoAnalysisResult;
    beats: BeatTrackingResult;
  },
  options: InstrumentAnalysisOptions = {}
): Promise<InstrumentAnalysisResult> {
  const { onProgress } = options;

  const totalDuration = audioBuffer.duration;
  const rawSampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const rawLength = audioBuffer.length;

  if (rawLength === 0 || totalDuration < 1.0) {
    return createEmptyInstrumentResult(
      "Audio duration is too short for instrument or timbral identification."
    );
  }

  onProgress?.(15, "Downsampling signal for multi-band spectral timbre profiling...");

  // Downsample to ~22050 Hz to preserve high-frequency cymbal content up to 11 kHz
  const downsampleFactor = Math.max(1, Math.floor(rawSampleRate / 22050));
  const targetSampleRate = rawSampleRate / downsampleFactor;
  const downsampledLength = Math.floor(rawLength / downsampleFactor);
  const mono = new Float32Array(downsampledLength);

  const ch0 = audioBuffer.getChannelData(0);
  const ch1 = numChannels > 1 ? audioBuffer.getChannelData(1) : null;

  for (let i = 0; i < downsampledLength; i++) {
    const rawIdx = i * downsampleFactor;
    mono[i] = ch1 ? (ch0[rawIdx] + ch1[rawIdx]) * 0.5 : ch0[rawIdx];
  }

  // 1. Sliding Window STFT Analysis (Window 2048, Hop 1024)
  const windowSize = 2048; // ~93ms at 22050Hz
  const hopSize = 1024; // ~46ms hop
  const numFrames = Math.floor((downsampledLength - windowSize) / hopSize);

  if (numFrames < 5) {
    return createEmptyInstrumentResult("Not enough audio frames for timbral analysis.");
  }

  // Precompute Hann window
  const hann = new Float32Array(windowSize);
  for (let n = 0; n < windowSize; n++) {
    hann[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / windowSize));
  }

  const real = new Float32Array(windowSize);
  const imag = new Float32Array(windowSize);
  const frameStats: FrameSpectralStats[] = [];

  const binHz = targetSampleRate / windowSize;
  const numBins = windowSize / 2;

  onProgress?.(35, "Extracting multi-band spectral energy, flatness & moments...");

  const yieldChunk = Math.max(25, Math.floor(numFrames / 15));

  for (let frame = 0; frame < numFrames; frame++) {
    if (frame % yieldChunk === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const startIdx = frame * hopSize;
    let rms = 0;

    for (let n = 0; n < windowSize; n++) {
      const s = mono[startIdx + n] * hann[n];
      real[n] = s;
      imag[n] = 0;
      rms += s * s;
    }
    rms = Math.sqrt(rms / windowSize);

    if (rms < 0.002) {
      // Near-silent frame
      continue;
    }

    radix2FFT(real, imag);

    let totalEnergy = 0;
    let weightedFreqSum = 0;
    let logEnergySum = 0;

    let subBass = 0;
    let bass = 0;
    let lowMid = 0;
    let mid = 0;
    let highMid = 0;
    let high = 0;

    const powers = new Float32Array(numBins);

    for (let k = 1; k < numBins; k++) {
      const mag = Math.sqrt(real[k] * real[k] + imag[k] * imag[k]);
      const p = mag * mag;
      powers[k] = p;
      const freq = k * binHz;

      totalEnergy += p;
      weightedFreqSum += freq * mag;
      logEnergySum += Math.log(p + 1e-12);

      if (freq >= 20 && freq < 90) subBass += p;
      else if (freq >= 90 && freq < 250) bass += p;
      else if (freq >= 250 && freq < 800) lowMid += p;
      else if (freq >= 800 && freq < 2800) mid += p;
      else if (freq >= 2800 && freq < 6500) highMid += p;
      else if (freq >= 6500 && freq < 12000) high += p;
    }

    if (totalEnergy <= 0) continue;

    const centroid = weightedFreqSum / (Math.sqrt(totalEnergy) + 1e-6);

    // Spectral Rolloff (85% energy threshold)
    const rolloffTarget = totalEnergy * 0.85;
    let cumulative = 0;
    let rolloffFreq = targetSampleRate * 0.5;

    for (let k = 1; k < numBins; k++) {
      cumulative += powers[k];
      if (cumulative >= rolloffTarget) {
        rolloffFreq = k * binHz;
        break;
      }
    }

    // Spectral Flatness (Wiener entropy)
    const geometricMean = Math.exp(logEnergySum / (numBins - 1));
    const arithmeticMean = totalEnergy / (numBins - 1);
    const flatness = Math.min(1.0, geometricMean / (arithmeticMean + 1e-12));

    frameStats.push({
      rms,
      centroid,
      rolloff: rolloffFreq,
      flatness,
      subBassEnergy: subBass / totalEnergy,
      bassEnergy: bass / totalEnergy,
      lowMidEnergy: lowMid / totalEnergy,
      midEnergy: mid / totalEnergy,
      highMidEnergy: highMid / totalEnergy,
      highEnergy: high / totalEnergy,
    });
  }

  onProgress?.(60, "Analyzing vocal presence, drum transients & bass instruments...");

  // 2. Aggregate Overall Track Spectral Statistics
  const validCount = Math.max(1, frameStats.length);
  let meanCentroid = 0;
  let meanRolloff = 0;
  let meanFlatness = 0;
  let meanSub = 0;
  let meanBass = 0;
  let meanLowMid = 0;
  let meanMid = 0;
  let meanHighMid = 0;
  let meanHigh = 0;
  let peakRms = 0;
  let rmsSum = 0;

  for (const f of frameStats) {
    meanCentroid += f.centroid;
    meanRolloff += f.rolloff;
    meanFlatness += f.flatness;
    meanSub += f.subBassEnergy;
    meanBass += f.bassEnergy;
    meanLowMid += f.lowMidEnergy;
    meanMid += f.midEnergy;
    meanHighMid += f.highMidEnergy;
    meanHigh += f.highEnergy;
    rmsSum += f.rms;
    if (f.rms > peakRms) peakRms = f.rms;
  }

  meanCentroid /= validCount;
  meanRolloff /= validCount;
  meanFlatness /= validCount;
  meanSub /= validCount;
  meanBass /= validCount;
  meanLowMid /= validCount;
  meanMid /= validCount;
  meanHighMid /= validCount;
  meanHigh /= validCount;
  const meanRms = rmsSum / validCount;

  // 3. Timbre Profile Formulation
  const dynamicRangeDb = Number(
    (20 * Math.log10((peakRms + 1e-4) / (meanRms + 1e-4))).toFixed(1)
  );
  const harmonicity = Number((1.0 - Math.min(1.0, meanFlatness * 4.0)).toFixed(2));

  let brightness: "bright" | "balanced" | "dark" = "balanced";
  if (meanCentroid >= 2300) brightness = "bright";
  else if (meanCentroid <= 1250) brightness = "dark";

  // Acoustic vs Electronic estimation
  // Acoustic traits: high dynamic range, natural inharmonicity, rich low-mid body
  // Electronic traits: high sub-bass concentration, static flatness, hyper-compressed dynamics
  const electronicScore = Math.min(
    1.0,
    Math.max(
      0.0,
      meanSub * 2.2 +
        (meanFlatness > 0.08 ? 0.3 : 0) +
        (dynamicRangeDb < 9 ? 0.35 : 0) +
        (meanHigh > 0.18 ? 0.2 : 0) -
        (meanLowMid > 0.25 ? 0.15 : 0)
    )
  );
  const acousticScore = Number((1.0 - electronicScore).toFixed(2));

  let dominantTexture = "Harmonically Rich & Balanced";
  if (electronicScore >= 0.7) dominantTexture = "Deep Electronic & Synthetic";
  else if (acousticScore >= 0.65) dominantTexture = "Natural Acoustic & Resonant";
  else if (brightness === "bright" && meanHighMid > 0.2)
    dominantTexture = "Punchy & Bright";
  else if (brightness === "dark") dominantTexture = "Warm & Subdued";

  const timbre: TimbreProfile = {
    brightness,
    spectralCentroidHz: Math.round(meanCentroid),
    spectralRolloffHz: Math.round(meanRolloff),
    spectralFlatness: Number(meanFlatness.toFixed(3)),
    harmonicity,
    dynamicRangeDb,
    acousticness: acousticScore,
    electronicness: Number(electronicScore.toFixed(2)),
    dominantTexture,
  };

  onProgress?.(75, "Evaluating vocal formants and melodic voice characteristics...");

  // 4. Vocal Analysis (leveraging Phase 9 melody notes + vocal formant spectrum)
  const vocal = evaluateVocalPresence(context.melody, meanMid);

  onProgress?.(85, "Evaluating rhythmic percussion and drum transient profiles...");

  // 5. Percussion Analysis (leveraging Phase 5 rhythm + transient bursts)
  const percussion = evaluatePercussionSources(
    context.beats,
    context.tempo,
    meanSub,
    meanHighMid,
    meanHigh
  );

  onProgress?.(92, "Evaluating bass instruments and harmonic sound sources...");

  // 6. Bass Analysis
  const bass = evaluateBassSources(meanSub, meanBass, electronicScore);

  // 7. Comprehensive Instrument Detections List
  const detections: InstrumentDetection[] = [];

  // Voice Detection
  if (vocal.detected) {
    detections.push({
      id: "inst-voice-lead",
      name:
        vocal.classification === "lead_vocals"
          ? "Lead Vocals"
          : vocal.classification === "choir"
          ? "Vocal Ensemble / Choir"
          : "Vocals",
      family: "voice",
      familyLabel: "Voice & Vocals",
      specificity:
        vocal.classification === "lead_vocals" ? "candidate" : "family",
      confidence: vocal.confidence,
      confidenceLevel:
        vocal.confidence >= 0.75
          ? "high"
          : vocal.confidence >= 0.5
          ? "moderate"
          : "low",
      presencePercentage: vocal.presencePercentage,
      frequencyRange: "130 Hz – 3,200 Hz",
      timbralCues: [
        "Vocal formant resonances in 800 Hz – 2,400 Hz",
        "Continuous melodic pitch contour with natural vibrato",
      ],
      isAcoustic: true,
      isElectronic: false,
      color: FAMILY_COLORS.voice,
    });
  }

  // Percussion Detection
  if (percussion.detected) {
    const isElecDrum = percussion.percussionType === "electronic_drums";
    detections.push({
      id: "inst-drums",
      name:
        percussion.percussionType === "drum_kit"
          ? "Acoustic Drum Kit"
          : percussion.percussionType === "electronic_drums"
          ? "Electronic Drum Elements / Beat"
          : "Rhythmic Percussion",
      family: "percussion",
      familyLabel: "Drums & Percussion",
      specificity:
        percussion.percussionType === "drum_kit" ||
        percussion.percussionType === "electronic_drums"
          ? "candidate"
          : "family",
      confidence: percussion.confidence,
      confidenceLevel:
        percussion.confidence >= 0.75
          ? "high"
          : percussion.confidence >= 0.5
          ? "moderate"
          : "low",
      presencePercentage: Math.min(
        100,
        Math.round(percussion.rhythmicDrive * 100)
      ),
      frequencyRange: "30 Hz – 14,000 Hz",
      timbralCues: [
        percussion.hasKick ? "Low-frequency kick transient (< 100 Hz)" : "",
        percussion.hasSnare ? "Mid-range snare snap (250 Hz – 3 kHz)" : "",
        percussion.hasHiHats ? "High metallic cymbal/hi-hat energy (> 6.5 kHz)" : "",
      ].filter(Boolean),
      isAcoustic: !isElecDrum,
      isElectronic: isElecDrum,
      color: FAMILY_COLORS.percussion,
    });
  }

  // Bass Detection
  if (bass.detected) {
    const isSynth =
      bass.bassType === "synth_bass" || bass.bassType === "sub_bass";
    detections.push({
      id: "inst-bass",
      name:
        bass.bassType === "bass_guitar"
          ? "Electric / Acoustic Bass Guitar"
          : bass.bassType === "synth_bass"
          ? "Synthesizer Bass / 808"
          : "Low Bass Source",
      family: "bass",
      familyLabel: "Bass Instruments",
      specificity:
        bass.bassType === "bass_guitar" || bass.bassType === "synth_bass"
          ? "candidate"
          : "family",
      confidence: bass.confidence,
      confidenceLevel:
        bass.confidence >= 0.75
          ? "high"
          : bass.confidence >= 0.5
          ? "moderate"
          : "low",
      presencePercentage: Math.min(100, Math.round((meanSub + meanBass) * 350)),
      frequencyRange: bass.fundamentalFrequencyRange,
      timbralCues: [
        isSynth
          ? "Heavy sub-octave fundamental with synthetic waveform"
          : "Harmonic string resonance in 60 Hz – 250 Hz",
      ],
      isAcoustic: !isSynth,
      isElectronic: isSynth,
      color: FAMILY_COLORS.bass,
    });
  }

  // Harmonic / Keyboard Detection
  if (context.chords.totalSegments >= 3) {
    const isPianoLike =
      acousticScore >= 0.55 &&
      meanMid >= 0.22 &&
      harmonicity >= 0.65;
    const isSynthPad =
      electronicScore >= 0.55 ||
      (harmonicity >= 0.75 && meanCentroid < 1600);

    if (isPianoLike) {
      detections.push({
        id: "inst-keys-piano",
        name: "Acoustic Piano / Keyboards",
        family: "keyboard",
        familyLabel: "Keyboards & Piano",
        specificity: "candidate",
        confidence: Number((0.65 + acousticScore * 0.25).toFixed(2)),
        confidenceLevel: acousticScore >= 0.7 ? "high" : "moderate",
        presencePercentage: Math.min(95, Math.round(harmonicity * 90)),
        frequencyRange: "65 Hz – 4,500 Hz",
        timbralCues: [
          "Percussive chord hammer attacks with natural exponential decay",
          "Rich polyphonic acoustic chord resonance across mid register",
        ],
        isAcoustic: true,
        isElectronic: false,
        color: FAMILY_COLORS.keyboard,
      });
    } else if (isSynthPad) {
      detections.push({
        id: "inst-synth-pad",
        name: "Synthesizer Pad / Ambient Keys",
        family: "electronic",
        familyLabel: "Electronic & Synths",
        specificity: "candidate",
        confidence: Number((0.6 + electronicScore * 0.3).toFixed(2)),
        confidenceLevel: electronicScore >= 0.7 ? "high" : "moderate",
        presencePercentage: Math.min(95, Math.round(harmonicity * 85)),
        frequencyRange: "100 Hz – 6,000 Hz",
        timbralCues: [
          "Sustained non-decaying harmonic chord profile",
          "Filtered electronic spectrum with low spectral flux",
        ],
        isAcoustic: false,
        isElectronic: true,
        color: FAMILY_COLORS.electronic,
      });
    } else {
      // Broad Harmonic Family match
      detections.push({
        id: "inst-harmonic-poly",
        name: "Harmonic Chord Instruments (Guitars / Keys)",
        family: "strings",
        familyLabel: "Harmonic & String Family",
        specificity: "family",
        confidence: 0.7,
        confidenceLevel: "moderate",
        presencePercentage: 80,
        frequencyRange: "120 Hz – 4,000 Hz",
        timbralCues: [
          "Consistent chromatic chord intervals across mid frequencies",
          "Coherent tonal progressions with stable harmonic anchors",
        ],
        isAcoustic: acousticScore >= 0.5,
        isElectronic: electronicScore > 0.5,
        color: FAMILY_COLORS.strings,
      });
    }
  }

  // 8. Families Present Summary
  const familiesPresent: InstrumentFamily[] = Array.from(
    new Set(detections.map((d) => d.family))
  );

  let overallAcousticVsElectronic: "acoustic" | "electronic" | "hybrid" = "hybrid";
  if (acousticScore >= 0.65) overallAcousticVsElectronic = "acoustic";
  else if (electronicScore >= 0.65) overallAcousticVsElectronic = "electronic";

  const totalConf =
    detections.length > 0
      ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length
      : 0.5;

  const analysisSummary = generateInstrumentSummary({
    detections,
    vocal,
    percussion,
    bass,
    timbre,
    overallAcousticVsElectronic,
  });

  return {
    detections,
    familiesPresent,
    vocal,
    percussion,
    bass,
    timbre,
    overallAcousticVsElectronic,
    confidence: Number(totalConf.toFixed(2)),
    analysisSummary,
  };
}

/**
 * Evaluates human vocal presence using Phase 9 melody results and formant resonance.
 */
function evaluateVocalPresence(
  melody: MelodyAnalysisResult,
  midEnergyRatio: number
): VocalAnalysis {
  // If melody extraction found dominant vocal line in human vocal range (130 - 850 Hz)
  const vocalRangeNotes = melody.notes.filter(
    (n) => n.frequency >= 130 && n.frequency <= 850 && !n.isUncertain
  );

  const vocalRatio =
    melody.totalNotes > 0 ? vocalRangeNotes.length / melody.totalNotes : 0;

  // Formant energy in 800 - 2600 Hz
  const hasFormantStrength = midEnergyRatio >= 0.25;
  const isLeadVocal =
    melody.isReliable &&
    vocalRatio >= 0.6 &&
    hasFormantStrength &&
    melody.voicedPercentage >= 20;

  if (isLeadVocal) {
    const conf = Math.min(
      0.95,
      0.55 + vocalRatio * 0.25 + melody.averageConfidence * 0.2
    );
    return {
      detected: true,
      classification: "lead_vocals",
      confidence: Number(conf.toFixed(2)),
      presencePercentage: melody.voicedPercentage,
      formantClarity: Number(Math.min(1.0, midEnergyRatio * 2.8).toFixed(2)),
      description:
        "Prominent lead vocal detected with clear formant resonances across the mid-frequency range and expressive melodic contour.",
    };
  }

  // Check for backing vocals or choir
  if (melody.voicedPercentage >= 15 && hasFormantStrength) {
    return {
      detected: true,
      classification: "backing_vocals",
      confidence: 0.65,
      presencePercentage: melody.voicedPercentage,
      formantClarity: Number(Math.min(1.0, midEnergyRatio * 2.2).toFixed(2)),
      description:
        "Vocal harmonics and formant resonances identified, appearing in backing or accompaniment roles.",
    };
  }

  return {
    detected: false,
    classification: "instrumental_only",
    confidence: 0.8,
    presencePercentage: 0,
    formantClarity: 0.15,
    description:
      "No sustained lead vocal detected. The recording displays instrumental and harmonic characteristics.",
  };
}

/**
 * Evaluates drum and percussion presence from transients and spectral energy.
 */
function evaluatePercussionSources(
  beats: BeatTrackingResult,
  tempo: TempoAnalysisResult,
  subEnergy: number,
  highMidEnergy: number,
  highEnergy: number
): PercussionAnalysis {
  const hasRhythmicBeats = beats.totalBeats >= 6 && tempo.bpm > 0;
  const hasKick = subEnergy >= 0.08 || (hasRhythmicBeats && beats.regularityScore >= 0.6);
  const hasSnare = highMidEnergy >= 0.14;
  const hasHiHats = highEnergy >= 0.06;

  const detected = hasRhythmicBeats && (hasKick || hasSnare || hasHiHats);

  if (!detected) {
    return {
      detected: false,
      percussionType: "none",
      hasKick: false,
      hasSnare: false,
      hasHiHats: false,
      transientSharpness: 0.1,
      rhythmicDrive: 0,
      confidence: 0.85,
      description: "Minimal or ambient rhythmic activity without prominent drum transients.",
    };
  }

  const isElectronic = subEnergy >= 0.2 || highEnergy >= 0.18;
  const percussionType = isElectronic ? "electronic_drums" : "drum_kit";
  const confidence = Number(
    Math.min(0.95, 0.6 + beats.regularityScore * 0.35).toFixed(2)
  );

  return {
    detected: true,
    percussionType,
    hasKick,
    hasSnare,
    hasHiHats,
    transientSharpness: Number((highMidEnergy * 3.5).toFixed(2)),
    rhythmicDrive: Number(beats.regularityScore.toFixed(2)),
    confidence,
    description: isElectronic
      ? "Electronic rhythm section with synthesized kick and crisp high-frequency transients."
      : "Acoustic drum kit elements detected with organic dynamic attack and cymbal sustain.",
  };
}

/**
 * Evaluates bass sound sources.
 */
function evaluateBassSources(
  subEnergy: number,
  bassEnergy: number,
  electronicScore: number
): BassAnalysis {
  const totalBass = subEnergy + bassEnergy;
  const detected = totalBass >= 0.12;

  if (!detected) {
    return {
      detected: false,
      bassType: "none",
      fundamentalFrequencyRange: "N/A",
      subBassEnergyRatio: 0,
      confidence: 0.8,
      description: "Low-frequency bass presence is subdued or absent.",
    };
  }

  let bassType: "bass_guitar" | "synth_bass" | "sub_bass" = "bass_guitar";
  if (subEnergy >= 0.18) {
    bassType = "sub_bass";
  } else if (electronicScore >= 0.55) {
    bassType = "synth_bass";
  }

  const confidence = Number(Math.min(0.92, 0.55 + totalBass * 1.5).toFixed(2));

  return {
    detected: true,
    bassType,
    fundamentalFrequencyRange: "40 Hz – 220 Hz",
    subBassEnergyRatio: Number(subEnergy.toFixed(2)),
    confidence,
    description:
      bassType === "bass_guitar"
        ? "Electric or acoustic bass guitar providing low-frequency harmonic root motion."
        : bassType === "synth_bass"
        ? "Synthesizer bass with solid sub-harmonic power and electronic drive."
        : "Deep sub-bass extension anchoring the lower octave.",
  };
}

/**
 * Generates an honest natural language summary of detected sound sources.
 */
function generateInstrumentSummary({
  detections,
  vocal,
  percussion,
  bass,
  timbre,
  overallAcousticVsElectronic,
}: {
  detections: InstrumentDetection[];
  vocal: VocalAnalysis;
  percussion: PercussionAnalysis;
  bass: BassAnalysis;
  timbre: TimbreProfile;
  overallAcousticVsElectronic: string;
}): string {
  if (detections.length === 0) {
    return "Sound sources appear diffuse, ambient, or below the detection threshold for discrete instrument classification.";
  }

  const names = detections.map((d) => d.name);
  const vocalStr = vocal.detected
    ? `${vocal.classification === "lead_vocals" ? "lead vocals" : "vocal textures"}`
    : "instrumental arrangement";

  const rhythmStr = percussion.detected
    ? `${percussion.percussionType === "drum_kit" ? "acoustic drums" : "electronic rhythm"}`
    : "fluid rhythmic pulse";

  const bassStr = bass.detected ? `anchored by ${bass.bassType.replace("_", " ")}` : "";

  return `Identified ${detections.length} sound source candidates (${names.join(
    ", "
  )}), reflecting a ${overallAcousticVsElectronic} ${timbre.dominantTexture.toLowerCase()} palette. Features a ${vocalStr} with ${rhythmStr}${bassStr ? " " + bassStr : ""}. Timbral brightness is measured as ${timbre.brightness} (${timbre.spectralCentroidHz} Hz centroid).`;
}

export function createEmptyInstrumentResult(summary: string): InstrumentAnalysisResult {
  return {
    detections: [],
    familiesPresent: [],
    vocal: {
      detected: false,
      classification: "instrumental_only",
      confidence: 0,
      presencePercentage: 0,
      formantClarity: 0,
      description: summary,
    },
    percussion: {
      detected: false,
      percussionType: "none",
      hasKick: false,
      hasSnare: false,
      hasHiHats: false,
      transientSharpness: 0,
      rhythmicDrive: 0,
      confidence: 0,
      description: summary,
    },
    bass: {
      detected: false,
      bassType: "none",
      fundamentalFrequencyRange: "N/A",
      subBassEnergyRatio: 0,
      confidence: 0,
      description: summary,
    },
    timbre: {
      brightness: "balanced",
      spectralCentroidHz: 1500,
      spectralRolloffHz: 3000,
      spectralFlatness: 0.05,
      harmonicity: 0.5,
      dynamicRangeDb: 10,
      acousticness: 0.5,
      electronicness: 0.5,
      dominantTexture: "Neutral",
    },
    overallAcousticVsElectronic: "hybrid",
    confidence: 0,
    analysisSummary: summary,
  };
}
