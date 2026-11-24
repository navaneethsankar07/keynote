/**
 * Musical Mood & Emotional Character Analysis Engine (Phase 13)
 *
 * Implements:
 * 1. Multi-dimensional affect modeling based on Russell's Circumplex Model and Thayer's Energy-Arousal framework:
 *    - Energy Dimension: physical/kinetic magnitude (Low, Moderate, High)
 *    - Valence / Emotional Tone Dimension: perceived pleasantness/optimism vs melancholy (Positive, Neutral, Negative, Ambiguous)
 *    - Arousal / Intensity Dimension: sensory stimulation & urgency (Calm, Moderate, Intense)
 * 2. Cross-domain telemetry synthesis across Phases 5–12:
 *    - Rhythm & Pulse (Phase 5): BPM, beat regularity, metric drive
 *    - Key & Mode (Phase 6): Major vs Minor diatonic framing, tonal stability
 *    - Chords & Harmony (Phases 7–8): Consonance vs dissonance, cadence resolution, harmonic complexity
 *    - Melodic Line (Phase 9): Ascending/descending contour, pitch range, interval leaps
 *    - Macro Structure (Phase 10): Section sequence, energy dynamics across sections
 *    - Timbre & Instruments (Phase 11): Acousticness vs electronicness, brightness, dynamic range dB, transient sharpness
 *    - Genre & Stylistic Context (Phase 12): Style trait radar (danceability, energy, acousticness)
 * 3. 16 Evidence-supported descriptive musical mood archetypes
 * 4. Section-level mood & intensity trajectory mapping
 * 5. Honest confidence calibration and perceptual subjectivity disclaimers
 */

import {
  MoodAnalysisResult,
  MoodDescriptor,
  SectionMoodTrajectory,
  MoodEnergyLevel,
  MoodValenceTone,
  MoodArousalIntensity,
  MoodConfidenceLevel,
  TempoAnalysisResult,
  BeatTrackingResult,
  KeyAnalysisResult,
  ChordAnalysisResult,
  ProgressionAnalysisResult,
  MelodyAnalysisResult,
  StructureAnalysisResult,
  InstrumentAnalysisResult,
  GenreAnalysisResult,
} from "./types";

export interface MoodAnalysisOptions {
  onProgress?: (percent: number, message: string) => void;
}

export interface MoodAnalysisContext {
  tempo: TempoAnalysisResult;
  beats: BeatTrackingResult;
  key: KeyAnalysisResult;
  chords: ChordAnalysisResult;
  progression: ProgressionAnalysisResult;
  melody: MelodyAnalysisResult;
  structure: StructureAnalysisResult;
  instruments: InstrumentAnalysisResult;
  genre: GenreAnalysisResult;
}

interface MoodArchetypeDefinition {
  label: string;
  evaluate: (
    ctx: MoodAnalysisContext,
    energyScore: number,
    valenceScore: number,
    arousalScore: number
  ) => {
    score: number; // 0.0 - 1.0 match affinity
    cues: string[];
  };
}

/**
 * 16 Descriptive Musical Mood Archetypes evaluated through multi-feature correlation.
 */
const MOOD_ARCHETYPES: MoodArchetypeDefinition[] = [
  // 1. Energetic
  {
    label: "Energetic",
    evaluate: (ctx, energy, _val, arousal) => {
      let score = 0;
      const cues: string[] = [];
      if (energy >= 0.65) {
        score += 0.45;
        cues.push(`High kinetic energy index (${Math.round(energy * 100)}%)`);
      }
      if (arousal >= 0.6) {
        score += 0.3;
        cues.push("Driving rhythmic pulse and active percussive transients");
      }
      if (ctx.tempo.bpm >= 115) {
        score += 0.25;
        cues.push(`Upbeat tempo (${ctx.tempo.bpm.toFixed(0)} BPM)`);
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 2. Calm
  {
    label: "Calm",
    evaluate: (ctx, energy, _val, arousal) => {
      let score = 0;
      const cues: string[] = [];
      if (energy <= 0.4) {
        score += 0.45;
        cues.push(`Gentle acoustic energy (${Math.round(energy * 100)}%)`);
      }
      if (arousal <= 0.4) {
        score += 0.35;
        cues.push("Relaxed sensory intensity without aggressive transients");
      }
      if (ctx.instruments.timbre.acousticness >= 0.5) {
        score += 0.2;
        cues.push("Natural acoustic instrumental resonance");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 3. Uplifting
  {
    label: "Uplifting",
    evaluate: (ctx, energy, valence) => {
      let score = 0;
      const cues: string[] = [];
      if (valence >= 0.6) {
        score += 0.4;
        cues.push("Bright, positive tonal valence");
      }
      if (ctx.key.mode === "Major") {
        score += 0.25;
        cues.push(`Major diatonic foundation in ${ctx.key.key}`);
      }
      if (energy >= 0.5) {
        score += 0.2;
        cues.push("Optimistic forward momentum");
      }
      if (ctx.melody.contour.dominantDirection === "Ascending") {
        score += 0.15;
        cues.push("Ascending melodic movement");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 4. Melancholic
  {
    label: "Melancholic",
    evaluate: (ctx, energy, valence, arousal) => {
      let score = 0;
      const cues: string[] = [];
      if (valence <= 0.42) {
        score += 0.4;
        cues.push("Somber, introspective emotional tone");
      }
      if (ctx.key.mode === "Minor") {
        score += 0.25;
        cues.push(`Minor key harmonic bed in ${ctx.key.key}`);
      }
      if (energy <= 0.5) {
        score += 0.2;
        cues.push("Restrained, subdued dynamics");
      }
      if (arousal <= 0.45) {
        score += 0.15;
        cues.push("Low-arousal contemplative pacing");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 5. Joyful
  {
    label: "Joyful",
    evaluate: (ctx, energy, valence) => {
      let score = 0;
      const cues: string[] = [];
      if (valence >= 0.68 && ctx.key.mode === "Major") {
        score += 0.45;
        cues.push("Radiant major-key emotional buoyancy");
      }
      if (energy >= 0.55) {
        score += 0.3;
        cues.push("Lively kinetic rhythm");
      }
      if (ctx.instruments.timbre.brightness === "bright") {
        score += 0.25;
        cues.push("Sparkling, crisp spectral centroid");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 6. Reflective
  {
    label: "Reflective",
    evaluate: (ctx, energy, _val, arousal) => {
      let score = 0;
      const cues: string[] = [];
      if (energy <= 0.5 && arousal <= 0.5) {
        score += 0.4;
        cues.push("Intimate, unhurried sonic atmosphere");
      }
      if (ctx.instruments.timbre.acousticness >= 0.4) {
        score += 0.3;
        cues.push("Acoustic warmth inviting thoughtful listening");
      }
      if (ctx.melody.voicedPercentage >= 20) {
        score += 0.3;
        cues.push("Lyrical melodic line conveying narrative focus");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 7. Dramatic
  {
    label: "Dramatic",
    evaluate: (ctx, _energy, _val, arousal) => {
      let score = 0;
      const cues: string[] = [];
      const dynamicSpread = ctx.instruments.timbre.dynamicRangeDb;
      if (dynamicSpread >= 13) {
        score += 0.4;
        cues.push(`Expansive dynamic contrast (${dynamicSpread} dB spread)`);
      }
      if (arousal >= 0.55) {
        score += 0.3;
        cues.push("High theatrical intensity and dynamic swells");
      }
      if (ctx.structure.totalSections >= 3) {
        score += 0.3;
        cues.push("Multi-section episodic development");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 8. Tense
  {
    label: "Tense",
    evaluate: (ctx, _energy, valence, arousal) => {
      let score = 0;
      const cues: string[] = [];
      const hasDissonance = ctx.chords.segments.some(
        (s) => (s.name ?? "").includes("dim") || (s.name ?? "").includes("sus")
      );
      if (arousal >= 0.6 && valence <= 0.45) {
        score += 0.45;
        cues.push("High sensory arousal paired with dark/conflicted tone");
      }
      if (hasDissonance) {
        score += 0.3;
        cues.push("Harmonic tension and unresolved chord colorations");
      }
      if (ctx.key.mode === "Minor") {
        score += 0.25;
        cues.push(`Minor tonal framework in ${ctx.key.key}`);
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 9. Peaceful
  {
    label: "Peaceful",
    evaluate: (ctx, energy, valence, arousal) => {
      let score = 0;
      const cues: string[] = [];
      if (energy <= 0.38 && arousal <= 0.38) {
        score += 0.45;
        cues.push("Serene, low-intensity soundscape");
      }
      if (valence >= 0.52) {
        score += 0.35;
        cues.push("Consonant harmonic warmth and gentle cadence");
      }
      if (ctx.instruments.timbre.acousticness >= 0.6) {
        score += 0.2;
        cues.push("Organic acoustic instrumentation without electronic harshness");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 10. Nostalgic
  {
    label: "Nostalgic",
    evaluate: (ctx, energy) => {
      let score = 0;
      const cues: string[] = [];
      const isWarm = ctx.instruments.timbre.brightness === "balanced" || ctx.instruments.timbre.brightness === "dark";
      if (isWarm && energy >= 0.3 && energy <= 0.65) {
        score += 0.4;
        cues.push("Warm, rounded timbral spectrum evoking vintage analog colors");
      }
      if (ctx.progression.distribution.length >= 3) {
        score += 0.3;
        cues.push("Cyclic chord changes with bittersweet harmonic movement");
      }
      if (ctx.melody.voicedPercentage >= 25) {
        score += 0.3;
        cues.push("Sentimental melodic contours");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 11. Relaxed
  {
    label: "Relaxed",
    evaluate: (ctx, energy, valence, arousal) => {
      let score = 0;
      const cues: string[] = [];
      const bpm = ctx.tempo.bpm;
      if (bpm >= 70 && bpm <= 105) {
        score += 0.35;
        cues.push(`Easy-going mid-tempo groove (${bpm.toFixed(0)} BPM)`);
      }
      if (arousal <= 0.5 && valence >= 0.45) {
        score += 0.35;
        cues.push("Balanced, unhurried sensory flow");
      }
      if (energy <= 0.6) {
        score += 0.3;
        cues.push("Moderate, comfortable dynamic range");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 12. Atmospheric
  {
    label: "Atmospheric",
    evaluate: (ctx, energy, _val, arousal) => {
      let score = 0;
      const cues: string[] = [];
      const lowPercussion = !ctx.instruments.percussion.detected || ctx.instruments.percussion.percussionType === "none";
      if (lowPercussion) {
        score += 0.45;
        cues.push("Absence of rigid percussive transients prioritizing spacious pads");
      }
      if (ctx.instruments.timbre.spectralFlatness >= 0.03) {
        score += 0.3;
        cues.push("Reverberant diffuse spectral sustain");
      }
      if (arousal <= 0.45) {
        score += 0.25;
        cues.push("Immersive spatial sound design");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 13. Aggressive
  {
    label: "Aggressive",
    evaluate: (ctx, energy, _val, arousal) => {
      let score = 0;
      const cues: string[] = [];
      if (energy >= 0.72 && arousal >= 0.7) {
        score += 0.45;
        cues.push("Peak kinetic energy and ferocious sonic intensity");
      }
      if (ctx.instruments.percussion.transientSharpness >= 0.6) {
        score += 0.3;
        cues.push("Piercing transient attacks and hard-hitting drum beats");
      }
      if (ctx.instruments.timbre.brightness === "bright" && ctx.instruments.timbre.spectralCentroidHz >= 2600) {
        score += 0.25;
        cues.push("Aggressive high-frequency saturation");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 14. Dreamy
  {
    label: "Dreamy",
    evaluate: (ctx, energy, valence, arousal) => {
      let score = 0;
      const cues: string[] = [];
      if (energy <= 0.45 && arousal <= 0.45) {
        score += 0.4;
        cues.push("Soft, floating dynamic envelope");
      }
      if (valence >= 0.48) {
        score += 0.3;
        cues.push("Warm, consonant harmonic bed");
      }
      if (ctx.instruments.timbre.dominantTexture.toLowerCase().includes("pad") || ctx.instruments.timbre.dominantTexture.toLowerCase().includes("rich")) {
        score += 0.3;
        cues.push("Lush, shimmering timbral textures");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 15. Romantic
  {
    label: "Romantic",
    evaluate: (ctx, energy, valence, arousal) => {
      let score = 0;
      const cues: string[] = [];
      if (valence >= 0.55 && energy <= 0.6) {
        score += 0.35;
        cues.push("Warm, tender harmonic colorations");
      }
      if (arousal <= 0.55 && ctx.melody.voicedPercentage >= 25) {
        score += 0.35;
        cues.push("Expressive vocal/melodic delivery with natural vibrato");
      }
      if (ctx.instruments.timbre.acousticness >= 0.4) {
        score += 0.3;
        cues.push("Intimate acoustic resonance (piano, strings, or acoustic guitar)");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },

  // 16. Mysterious
  {
    label: "Mysterious",
    evaluate: (ctx, _energy, valence, arousal) => {
      let score = 0;
      const cues: string[] = [];
      if (valence <= 0.48 && arousal <= 0.55) {
        score += 0.4;
        cues.push("Enigmatic, veiled harmonic atmosphere");
      }
      if (ctx.key.confidence === "low" || ctx.key.confidence === "ambiguous") {
        score += 0.3;
        cues.push("Tonal ambiguity and shifting key centers");
      }
      if (ctx.instruments.timbre.brightness === "dark") {
        score += 0.3;
        cues.push("Dark, shadowed timbral centroid");
      }
      return { score: Math.min(1.0, score), cues };
    },
  },
];

/**
 * Calculates continuous Energy dimension (0.0 - 1.0).
 */
function computeEnergyDimension(ctx: MoodAnalysisContext): {
  score: number;
  level: MoodEnergyLevel;
  explanation: string;
} {
  const centroidNorm = Math.min(1.0, ctx.instruments.timbre.spectralCentroidHz / 4000);
  const tempoNorm = Math.max(0.0, Math.min(1.0, (ctx.tempo.bpm - 55) / 125));
  const dynamicFactor = 1.0 - Math.min(0.4, ctx.instruments.timbre.dynamicRangeDb / 35);
  const sharpness = ctx.instruments.percussion.transientSharpness;
  const regularity = ctx.beats.regularityScore;

  const rawScore =
    centroidNorm * 0.35 +
    tempoNorm * 0.30 +
    sharpness * 0.20 +
    regularity * 0.15 * dynamicFactor;

  const score = Number(Math.max(0.08, Math.min(0.96, rawScore)).toFixed(2));
  const level: MoodEnergyLevel =
    score >= 0.65 ? "high" : score >= 0.38 ? "moderate" : "low";

  const explanation =
    level === "high"
      ? `High kinetic energy driven by fast tempo (${ctx.tempo.bpm.toFixed(0)} BPM) and bright spectral presence.`
      : level === "moderate"
      ? `Balanced physical energy with controlled rhythmic drive and stable dynamic momentum.`
      : `Low, restrained energy with subdued transients and spacious sonic pacing.`;

  return { score, level, explanation };
}

/**
 * Calculates continuous Valence / Emotional Tone dimension (0.0 - 1.0).
 */
function computeValenceDimension(ctx: MoodAnalysisContext): {
  score: number;
  tone: MoodValenceTone;
  explanation: string;
  isAmbiguous: boolean;
} {
  const isMajor = ctx.key.mode === "Major";
  const modeContribution = isMajor ? 0.68 : 0.36;

  const brightness = ctx.instruments.timbre.brightness;
  const brightnessContribution =
    brightness === "bright" ? 0.65 : brightness === "dark" ? 0.35 : 0.50;

  const contour = ctx.melody.contour.dominantDirection;
  const contourContribution =
    contour === "Ascending" ? 0.60 : contour === "Descending" ? 0.40 : 0.50;

  // Consonance ratio from chords
  const nonTriadCount = ctx.chords.segments.filter((s) => {
    const name = s.name ?? "";
    return name.includes("dim") || name.includes("aug") || name.includes("m7");
  }).length;
  const consonanceRatio = 1.0 - Math.min(0.5, nonTriadCount / Math.max(1, ctx.chords.segments.length));

  const rawScore =
    modeContribution * 0.45 +
    brightnessContribution * 0.25 +
    consonanceRatio * 0.15 +
    contourContribution * 0.15;

  const score = Number(Math.max(0.12, Math.min(0.92, rawScore)).toFixed(2));

  // Ambiguity check: upbeat tempo in minor key, or melancholic slow acoustic in major key
  const hasMoodConflict =
    (!isMajor && ctx.tempo.bpm >= 125 && ctx.instruments.timbre.electronicness >= 0.6) ||
    (isMajor && ctx.tempo.bpm <= 75 && brightness === "dark");

  let tone: MoodValenceTone;
  if (hasMoodConflict) {
    tone = "ambiguous";
  } else if (score >= 0.58) {
    tone = "positive";
  } else if (score <= 0.42) {
    tone = "negative";
  } else {
    tone = "neutral";
  }

  const explanation =
    tone === "positive"
      ? `Positive, uplifting tonal valence supported by ${ctx.key.key} diatonic harmony and bright harmonics.`
      : tone === "negative"
      ? `Somber, reflective emotional tone influenced by ${ctx.key.key} minor framing and contemplative cadence.`
      : tone === "ambiguous"
      ? `Complex emotional crossover pairing minor harmonic tension with energetic rhythmic drive.`
      : `Neutral, balanced emotional coloring without extreme melancholy or euphoric peaks.`;

  return { score, tone, explanation, isAmbiguous: tone === "ambiguous" };
}

/**
 * Calculates continuous Arousal / Intensity dimension (0.0 - 1.0).
 */
function computeArousalDimension(
  ctx: MoodAnalysisContext,
  energyScore: number
): {
  score: number;
  intensity: MoodArousalIntensity;
  explanation: string;
} {
  const tempoNorm = Math.max(0.0, Math.min(1.0, (ctx.tempo.bpm - 50) / 130));
  const sharpness = ctx.instruments.percussion.transientSharpness;
  const rhythmicDrive = ctx.instruments.percussion.rhythmicDrive;
  const acousticness = ctx.instruments.timbre.acousticness;

  const rawScore =
    tempoNorm * 0.35 +
    sharpness * 0.30 +
    rhythmicDrive * 0.20 +
    energyScore * 0.15 -
    acousticness * 0.08;

  const score = Number(Math.max(0.08, Math.min(0.96, rawScore)).toFixed(2));
  const intensity: MoodArousalIntensity =
    score >= 0.68 ? "intense" : score >= 0.38 ? "moderate" : "calm";

  const explanation =
    intensity === "intense"
      ? `High sensory stimulation and urgency driven by active transients and strong pulse.`
      : intensity === "moderate"
      ? `Comfortable, engaging sensory presence with steady musical movement.`
      : `Low arousal and gentle sonic pacing fostering tranquility and relaxed immersion.`;

  return { score, intensity, explanation };
}

/**
 * Calculates section-level mood and intensity variations using Phase 10 sections.
 */
function computeSectionMoodTrajectory(
  ctx: MoodAnalysisContext,
  overallEnergy: number,
  overallValence: number
): { trajectory: SectionMoodTrajectory[]; hasProgression: boolean } {
  const sections = ctx.structure.sections;
  if (!sections || sections.length < 2) {
    return { trajectory: [], hasProgression: false };
  }

  const trajectory: SectionMoodTrajectory[] = [];
  let distinctSectionCount = 0;

  for (const sec of sections) {
    // Relative energy from section characteristics
    const secEnergyNorm = sec.characteristics.energy;
    const relEnergy = Number(
      Math.max(0.1, Math.min(0.95, overallEnergy * 0.4 + secEnergyNorm * 0.6)).toFixed(2)
    );

    const relArousal = Number(
      Math.max(
        0.1,
        Math.min(
          0.95,
          relEnergy * 0.7 + (sec.characteristics.rhythmicDensity > 3.0 ? 0.25 : 0.05)
        )
      ).toFixed(2)
    );

    const energyLevel: MoodEnergyLevel =
      relEnergy >= 0.65 ? "high" : relEnergy >= 0.38 ? "moderate" : "low";

    const arousalIntensity: MoodArousalIntensity =
      relArousal >= 0.65 ? "intense" : relArousal >= 0.38 ? "moderate" : "calm";

    const valenceTone: MoodValenceTone =
      overallValence >= 0.58 ? "positive" : overallValence <= 0.42 ? "negative" : "neutral";

    let dominantMood = "Balanced";
    const labelLower = sec.label.toLowerCase();
    if (labelLower.includes("intro") || labelLower.includes("outro")) {
      dominantMood = relEnergy < 0.4 ? "Atmospheric / Calm" : "Building";
      distinctSectionCount++;
    } else if (labelLower.includes("chorus")) {
      dominantMood = relEnergy > 0.6 ? "Energetic / Climax" : "Lyrical Center";
      distinctSectionCount++;
    } else if (labelLower.includes("verse")) {
      dominantMood = "Reflective / Narrative";
    } else if (labelLower.includes("bridge")) {
      dominantMood = "Dramatic / Contrast";
      distinctSectionCount++;
    }

    trajectory.push({
      sectionId: sec.id,
      sectionName: sec.label,
      startTime: sec.startTime,
      endTime: sec.endTime,
      energyLevel,
      valenceTone,
      arousalIntensity,
      dominantMood,
      relativeEnergy: relEnergy,
      relativeArousal: relArousal,
    });
  }

  return {
    trajectory,
    hasProgression: distinctSectionCount >= 1,
  };
}

/**
 * Executes full client-side Musical Mood & Emotional Character Analysis.
 */
export async function analyzeMusicalMood(
  context: MoodAnalysisContext,
  options: MoodAnalysisOptions = {}
): Promise<MoodAnalysisResult> {
  const { onProgress } = options;

  onProgress?.(25, "Calculating affective energy, valence, and arousal dimensions...");

  // 1. Compute core 3 dimensions
  const energy = computeEnergyDimension(context);
  const valence = computeValenceDimension(context);
  const arousal = computeArousalDimension(context, energy.score);

  onProgress?.(55, "Correlating acoustic features with descriptive mood archetypes...");

  // 2. Score all 16 mood archetypes
  const scoredMoods: Array<{
    label: string;
    score: number;
    cues: string[];
  }> = [];

  for (const arch of MOOD_ARCHETYPES) {
    const res = arch.evaluate(context, energy.score, valence.score, arousal.score);
    if (res.score > 0.15) {
      scoredMoods.push({
        label: arch.label,
        score: Number(res.score.toFixed(2)),
        cues: res.cues,
      });
    }
  }

  // Sort descending by score
  scoredMoods.sort((a, b) => b.score - a.score);

  // 3. Fallback if no archetype reached significant score
  let primaryDescriptor: MoodDescriptor;
  const secondaryDescriptors: MoodDescriptor[] = [];

  if (scoredMoods.length === 0 || scoredMoods[0].score < 0.3) {
    primaryDescriptor = {
      label: "Atmospheric / Ambient",
      category: "primary",
      score: 0.35,
      supportingCues: ["Spacious soundscape without prominent energetic peaks"],
    };
  } else {
    primaryDescriptor = {
      label: scoredMoods[0].label,
      category: "primary",
      score: scoredMoods[0].score,
      supportingCues: scoredMoods[0].cues,
    };

    // Up to 3 secondary descriptors
    for (let i = 1; i < Math.min(4, scoredMoods.length); i++) {
      if (scoredMoods[i].score >= 0.4) {
        secondaryDescriptors.push({
          label: scoredMoods[i].label,
          category: i === 1 ? "secondary" : "subtle",
          score: scoredMoods[i].score,
          supportingCues: scoredMoods[i].cues.slice(0, 2),
        });
      }
    }
  }

  onProgress?.(80, "Evaluating section-level emotional dynamics and progression...");

  // 4. Section mood trajectory
  const { trajectory, hasProgression: hasSectionProgression } =
    computeSectionMoodTrajectory(context, energy.score, valence.score);

  // 5. Aggregate supporting and contrasting cues
  const supportingAcousticFeatures = [
    `Energy dimension rated at ${Math.round(energy.score * 100)}% (${energy.level})`,
    `Emotional tone / valence rated at ${Math.round(valence.score * 100)}% (${valence.tone})`,
    `Arousal / intensity rated at ${Math.round(arousal.score * 100)}% (${arousal.intensity})`,
    ...primaryDescriptor.supportingCues,
  ];

  const contrastingNuances: string[] = [];
  if (valence.isAmbiguous) {
    contrastingNuances.push(
      "Acoustic crossover: minor key harmonic tension paired with upbeat metric drive"
    );
  }
  if (context.instruments.timbre.dynamicRangeDb >= 14) {
    contrastingNuances.push(
      `Wide dynamic variation (${context.instruments.timbre.dynamicRangeDb} dB) creates expressive contrast across sections`
    );
  }

  // 6. Confidence Calibration
  const confScore = primaryDescriptor.score;
  const confidenceLevel: MoodConfidenceLevel =
    confScore >= 0.75
      ? "high"
      : confScore >= 0.55
      ? "moderate"
      : confScore >= 0.4
      ? "low"
      : "speculative";

  // 7. Natural language summary
  const secMoodStr =
    secondaryDescriptors.length > 0
      ? ` with secondary shades of ${secondaryDescriptors.map((s) => s.label).join(" and ")}`
      : "";

  const summary = `Primary musical mood characterized as ${primaryDescriptor.label}${secMoodStr}. Physical energy is ${energy.level} (${Math.round(
    energy.score * 100
  )}%), emotional valence is ${valence.tone} (${Math.round(
    valence.score * 100
  )}%), and sensory arousal is ${arousal.intensity} (${Math.round(
    arousal.score * 100
  )}%). ${energy.explanation} ${valence.explanation}`;

  const perceptualDisclaimer =
    "Mood and emotional character analysis estimates perceived musical and acoustic properties (energy, tone, and arousal). Perceived emotion is subjective, personal, and culturally contextual.";

  return {
    primaryMood: primaryDescriptor,
    secondaryMoods: secondaryDescriptors,
    dimensions: {
      energy,
      valence,
      arousal,
    },
    supportingAcousticFeatures,
    contrastingNuances,
    sectionTrajectory: trajectory,
    hasSectionProgression,
    confidence: confScore,
    confidenceLevel,
    isAmbiguous: valence.isAmbiguous,
    analysisSummary: summary,
    perceptualDisclaimer,
  };
}

export function createEmptyMoodResult(summary: string): MoodAnalysisResult {
  return {
    primaryMood: {
      label: "Atmospheric / Undetermined",
      category: "primary",
      score: 0,
      supportingCues: [summary],
    },
    secondaryMoods: [],
    dimensions: {
      energy: {
        score: 0.5,
        level: "moderate",
        explanation: summary,
      },
      valence: {
        score: 0.5,
        tone: "neutral",
        explanation: summary,
      },
      arousal: {
        score: 0.5,
        intensity: "moderate",
        explanation: summary,
      },
    },
    supportingAcousticFeatures: [],
    contrastingNuances: [],
    sectionTrajectory: [],
    hasSectionProgression: false,
    confidence: 0,
    confidenceLevel: "uncertain",
    isAmbiguous: false,
    analysisSummary: summary,
    perceptualDisclaimer:
      "Client-side audio signal processing did not acquire sufficient duration or energy to resolve musical mood.",
  };
}
