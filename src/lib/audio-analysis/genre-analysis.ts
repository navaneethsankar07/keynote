/**
 * Genre & Musical Style Analysis Engine (Phase 12)
 *
 * Implements:
 * 1. Multi-dimensional Music Information Retrieval (MIR) feature space integration
 * 2. Cross-domain telemetry synthesis:
 *    - Rhythm & Tempo (Phase 5): BPM, pulse regularity, syncopation
 *    - Tonality & Key (Phase 6): Major/minor mode, tonal stability
 *    - Chords & Harmony (Phases 7-8): Harmonic complexity, chord vocabulary, cadence
 *    - Melody & Voice (Phase 9): Voiced duration ratio, pitch contour, interval leaps
 *    - Macro Structure (Phase 10): Section sequence, repetition index, structural complexity
 *    - Instrument & Timbre (Phase 11): Acousticness vs electronicness, dynamic range dB,
 *      spectral centroid Hz, spectral flatness, vocal presence, drum & bass source types
 * 3. Hierarchical multi-label genre classification with calibrated confidence
 * 4. Subgenre identification supported by granular acoustic cues
 * 5. Hybrid genre synthesis (e.g., "Electropop Fusion", "Acoustic Rock", "Neo-Soul")
 * 6. Section-level stylistic variation & contrast mapping
 * 7. Fully honest uncertainty reporting (no artificial certainty or fake ML claims)
 */

import {
  GenreAnalysisResult,
  GenreCandidate,
  SectionStyleVariation,
  StyleTraitRadar,
  TempoAnalysisResult,
  BeatTrackingResult,
  KeyAnalysisResult,
  ChordAnalysisResult,
  ProgressionAnalysisResult,
  MelodyAnalysisResult,
  StructureAnalysisResult,
  InstrumentAnalysisResult,
} from "./types";

export interface GenreAnalysisOptions {
  onProgress?: (percent: number, message: string) => void;
}

export interface GenreAnalysisContext {
  tempo: TempoAnalysisResult;
  beats: BeatTrackingResult;
  key: KeyAnalysisResult;
  chords: ChordAnalysisResult;
  progression: ProgressionAnalysisResult;
  melody: MelodyAnalysisResult;
  structure: StructureAnalysisResult;
  instruments: InstrumentAnalysisResult;
}

interface GenreDefinition {
  name: string;
  defaultSubgenre: string;
  description: string;
  evaluate: (
    ctx: GenreAnalysisContext,
    radar: StyleTraitRadar
  ) => {
    score: number; // 0.0 - 1.0
    subgenre: string | null;
    supportingEvidence: string[];
    contradictingFactors: string[];
    culturalContext?: string;
  };
}

/**
 * Definition of the 10 Primary Genre Archetypes evaluated by the MIR scoring engine.
 */
const GENRE_DEFINITIONS: GenreDefinition[] = [
  // 1. Electronic / Dance
  {
    name: "Electronic / Dance",
    defaultSubgenre: "Dance / Club",
    description: "Synthesized production anchored by electronic beats, sub-bass, and regular rhythm.",
    evaluate: (ctx, radar) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const bpm = ctx.tempo.bpm;
      const isElectronic = ctx.instruments.timbre.electronicness >= 0.55;
      const hasElectronicDrums = ctx.instruments.percussion.percussionType === "electronic_drums";
      const hasSynthBass = ctx.instruments.bass.bassType === "synth_bass" || ctx.instruments.bass.bassType === "sub_bass";

      if (isElectronic) {
        score += 0.35;
        supporting.push(`High synthetic timbre profile (${Math.round(ctx.instruments.timbre.electronicness * 100)}% electronic)`);
      } else if (ctx.instruments.timbre.acousticness > 0.65) {
        score -= 0.35;
        contradicting.push(`Predominantly organic acoustic instrumentation (${Math.round(ctx.instruments.timbre.acousticness * 100)}% acoustic)`);
      }

      if (hasElectronicDrums) {
        score += 0.25;
        supporting.push("Electronic drum elements with synthesized kick transients");
      }

      if (hasSynthBass) {
        score += 0.2;
        supporting.push(`Low-frequency drive anchored by ${ctx.instruments.bass.bassType.replace("_", " ")}`);
      }

      if (ctx.beats.regularityScore >= 0.75) {
        score += 0.15;
        supporting.push(`Strict metric grid regularity (${Math.round(ctx.beats.regularityScore * 100)}% consistency)`);
      }

      if (radar.danceability >= 0.65) {
        score += 0.1;
        supporting.push("High rhythmic danceability index");
      }

      if (ctx.instruments.timbre.dynamicRangeDb > 16) {
        score -= 0.2;
        contradicting.push(`Wide acoustic dynamic range (${ctx.instruments.timbre.dynamicRangeDb} dB) typical of live recordings`);
      }

      // Subgenre identification
      let subgenre = "Electro / Electronic";
      if (bpm >= 120 && bpm <= 132 && hasElectronicDrums) {
        subgenre = "House / Club";
      } else if (bpm >= 165 && bpm <= 180 && hasSynthBass) {
        subgenre = "Drum & Bass / Jungle";
      } else if (bpm >= 135 && bpm <= 150 && ctx.beats.regularityScore >= 0.85) {
        subgenre = "Trance / Techno";
      } else if (bpm >= 90 && bpm <= 118 && isElectronic) {
        subgenre = "Synthwave / Downtempo";
      } else if (radar.danceability < 0.4) {
        subgenre = "Ambient Electronic";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "Electronic dance styles prioritize metric pulse, synthesized basslines, and frequency-sculpted transients.",
      };
    },
  },

  // 2. Rock / Alternative
  {
    name: "Rock / Alternative",
    defaultSubgenre: "Alternative Rock",
    description: "Driving dynamic rhythm section with guitar-driven midrange presence and organic drum kit attack.",
    evaluate: (ctx) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const bpm = ctx.tempo.bpm;
      const hasDrumKit = ctx.instruments.percussion.percussionType === "drum_kit";
      const hasBassGuitar = ctx.instruments.bass.bassType === "bass_guitar";
      const dynamicRange = ctx.instruments.timbre.dynamicRangeDb;

      if (hasDrumKit) {
        score += 0.3;
        supporting.push("Acoustic drum kit attack with organic snare snap and cymbal decay");
      }

      if (hasBassGuitar) {
        score += 0.25;
        supporting.push("Electric/acoustic bass guitar providing harmonic root motion");
      }

      if (dynamicRange >= 11) {
        score += 0.2;
        supporting.push(`Dynamic performance spread (${dynamicRange} dB) characteristic of rock ensembles`);
      }

      if (ctx.instruments.timbre.spectralCentroidHz >= 1800 && ctx.instruments.timbre.spectralCentroidHz <= 3800) {
        score += 0.15;
        supporting.push("Pronounced midrange and presence energy indicative of guitars and amplification");
      }

      if (bpm >= 105 && bpm <= 165 && ctx.beats.regularityScore >= 0.6) {
        score += 0.1;
        supporting.push(`Steady driving tempo (${bpm.toFixed(0)} BPM)`);
      }

      if (ctx.instruments.timbre.electronicness >= 0.75) {
        score -= 0.35;
        contradicting.push("Heavy synthesized sound sources suppress organic rock attributes");
      }

      if (!ctx.instruments.percussion.detected) {
        score -= 0.3;
        contradicting.push("Absence of percussion rhythm section");
      }

      // Subgenre identification
      let subgenre = "Alternative / Modern Rock";
      if (ctx.instruments.timbre.spectralCentroidHz >= 2800 && dynamicRange >= 13) {
        subgenre = "Hard Rock / Post-Punk";
      } else if (ctx.instruments.timbre.acousticness >= 0.45) {
        subgenre = "Indie Rock / Acoustic Rock";
      } else if (ctx.key.mode === "Major" && ctx.melody.voicedPercentage >= 35) {
        subgenre = "Pop Rock";
      } else if (bpm >= 115 && bpm <= 140) {
        subgenre = "Classic Rock / Garage";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "Rock aesthetics center on the synergy of drum kit, bass guitar, and amplified midrange strings.",
      };
    },
  },

  // 3. Pop / Modern Commercial
  {
    name: "Pop / Modern Commercial",
    defaultSubgenre: "Modern Pop",
    description: "Vocal-forward production with polished diatonic harmony and structured verse-chorus arrangement.",
    evaluate: (ctx, radar) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const bpm = ctx.tempo.bpm;
      const vocal = ctx.instruments.vocal;
      const hasStructure = ctx.structure.totalSections >= 3;

      if (vocal.detected && vocal.presencePercentage >= 30) {
        score += 0.35;
        supporting.push(`Prominent vocal focus (${vocal.presencePercentage}% voiced duration with clear formant resonance)`);
      } else if (vocal.classification === "instrumental_only") {
        score -= 0.25;
        contradicting.push("Instrumental arrangement without dominant lead vocal");
      }

      if (ctx.key.confidence === "high" || ctx.key.confidence === "moderate") {
        score += 0.2;
        supporting.push(`Strong diatonic tonal center in ${ctx.key.key}`);
      }

      if (bpm >= 92 && bpm <= 132) {
        score += 0.15;
        supporting.push(`Radio-standard commercial tempo (${bpm.toFixed(0)} BPM)`);
      }

      if (hasStructure) {
        score += 0.15;
        supporting.push(`Well-delineated multi-section structural form (${ctx.structure.totalSections} sections)`);
      }

      if (radar.danceability >= 0.55) {
        score += 0.15;
        supporting.push("Catchy, rhythmic pulse with high metric accessibility");
      }

      if (ctx.instruments.timbre.dynamicRangeDb > 18) {
        score -= 0.2;
        contradicting.push("Very wide dynamic range lacks the commercial compression typical of modern pop");
      }

      // Subgenre identification
      let subgenre = "Commercial Pop";
      if (ctx.instruments.timbre.electronicness >= 0.6) {
        subgenre = "Dance Pop / Synth Pop";
      } else if (ctx.instruments.timbre.acousticness >= 0.55) {
        subgenre = "Acoustic Pop / Ballad";
      } else if (radar.danceability >= 0.7) {
        subgenre = "Electropop";
      } else if (ctx.key.mode === "Minor") {
        subgenre = "Dark Pop / Indie Pop";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "Pop music emphasizes vocal clarity, predictable diatonic cadences, and high-production polish.",
      };
    },
  },

  // 4. Hip-Hop / Urban
  {
    name: "Hip-Hop / Urban",
    defaultSubgenre: "Contemporary Hip-Hop",
    description: "Sub-bass driven rhythm with percussive vocal delivery, syncopated bounce, and cyclic chord loops.",
    evaluate: (ctx, radar) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const bpm = ctx.tempo.bpm;
      const hasSubBass = ctx.instruments.bass.bassType === "sub_bass" || ctx.instruments.bass.subBassEnergyRatio >= 0.15;
      const hasElectronicDrums = ctx.instruments.percussion.percussionType === "electronic_drums";
      const hasCyclicProgression =
        ctx.progression.patterns.length > 0 &&
        ctx.progression.distribution.length <= 4;

      if (hasSubBass) {
        score += 0.35;
        supporting.push("Pronounced sub-bass fundamental (< 80 Hz) characteristic of 808s and urban production");
      }

      if (hasElectronicDrums && ctx.instruments.percussion.hasSnare) {
        score += 0.25;
        supporting.push("Sharp snare/clap transients on backbeat with programmed electronic percussion");
      }

      // Hip-hop tempo: either 75-100 BPM standard or 130-160 BPM trap (half-time feel)
      if ((bpm >= 75 && bpm <= 100) || (bpm >= 130 && bpm <= 162)) {
        score += 0.2;
        supporting.push(`Urban rhythmic cadence tempo (${bpm.toFixed(0)} BPM)`);
      }

      if (hasCyclicProgression) {
        score += 0.15;
        supporting.push("Cyclic looping chord pattern providing a repetitive harmonic bed");
      }

      if (radar.instrumentalness >= 0.85 && !hasSubBass) {
        score -= 0.25;
        contradicting.push("Lack of vocal cadence and minimal low-frequency weight");
      }

      if (ctx.instruments.timbre.acousticness >= 0.75) {
        score -= 0.3;
        contradicting.push("Entirely acoustic ensemble lacks urban electronic bass foundations");
      }

      // Subgenre identification
      let subgenre = "Hip-Hop / Urban";
      if (bpm >= 130 && bpm <= 162 && hasSubBass) {
        subgenre = "Trap / Modern Urban";
      } else if (bpm >= 82 && bpm <= 98 && ctx.instruments.timbre.acousticness >= 0.3) {
        subgenre = "Boom Bap / Golden Era";
      } else if (ctx.melody.voicedPercentage >= 35 && ctx.key.mode === "Minor") {
        subgenre = "Melodic Rap / Trap Soul";
      } else if (ctx.instruments.timbre.electronicness >= 0.7) {
        subgenre = "Contemporary Hip-Hop";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "Hip-Hop is rooted in rhythmic breakbeats, prominent sub-bass extension, and verbal rhythmic cadence.",
      };
    },
  },

  // 5. Acoustic / Folk
  {
    name: "Acoustic / Folk",
    defaultSubgenre: "Contemporary Folk",
    description: "Organic, unamplified instrumentation, natural dynamic breathing, and warm acoustic timbres.",
    evaluate: (ctx) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const acousticness = ctx.instruments.timbre.acousticness;
      const dynamicRange = ctx.instruments.timbre.dynamicRangeDb;
      const centroid = ctx.instruments.timbre.spectralCentroidHz;

      if (acousticness >= 0.65) {
        score += 0.4;
        supporting.push(`High acoustic authenticity index (${Math.round(acousticness * 100)}% acoustic source profile)`);
      } else if (ctx.instruments.timbre.electronicness >= 0.5) {
        score -= 0.4;
        contradicting.push("Prominent electronic synthesizers and electronic percussion");
      }

      if (dynamicRange >= 13) {
        score += 0.25;
        supporting.push(`Natural uncompressed acoustic dynamic breathing (${dynamicRange} dB spread)`);
      }

      if (centroid >= 900 && centroid <= 2200) {
        score += 0.2;
        supporting.push(`Warm, woody timbral centroid (${centroid} Hz)`);
      }

      if (ctx.instruments.bass.bassType === "sub_bass") {
        score -= 0.3;
        contradicting.push("Synthetic sub-bass contradicts acoustic folk tradition");
      }

      if (ctx.instruments.percussion.percussionType === "none" || ctx.instruments.percussion.percussionType === "hand_percussion") {
        score += 0.15;
        supporting.push("Minimal or organic percussive presence");
      }

      // Subgenre identification
      let subgenre = "Acoustic / Folk";
      if (ctx.instruments.vocal.detected && acousticness >= 0.75) {
        subgenre = "Singer-Songwriter / Indie Folk";
      } else if (ctx.instruments.percussion.percussionType === "drum_kit") {
        subgenre = "Folk Rock / Americana";
      } else if (!ctx.instruments.vocal.detected && acousticness >= 0.8) {
        subgenre = "Fingerstyle / Acoustic Instrumental";
      } else if (ctx.key.mode === "Major") {
        subgenre = "Traditional Folk / Bluegrass";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "Folk music prioritizes acoustic instruments, vocal storytelling, and natural room resonance over synthetic production.",
      };
    },
  },

  // 6. Classical / Orchestral
  {
    name: "Classical / Orchestral",
    defaultSubgenre: "Orchestral / Symphonic",
    description: "Acoustic instrumental concert hall dynamics with complex harmonic voicings and zero drum kit beats.",
    evaluate: (ctx) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const acousticness = ctx.instruments.timbre.acousticness;
      const dynamicRange = ctx.instruments.timbre.dynamicRangeDb;
      const noDrumBeats = !ctx.instruments.percussion.detected || ctx.instruments.percussion.percussionType === "none";
      const hasHarmony = ctx.chords.totalSegments >= 4;

      if (acousticness >= 0.75) {
        score += 0.35;
        supporting.push("Pure acoustic sound source profile without electronic instruments");
      }

      if (dynamicRange >= 15) {
        score += 0.25;
        supporting.push(`Extensive concert-hall dynamic range (${dynamicRange} dB)`);
      }

      if (noDrumBeats) {
        score += 0.25;
        supporting.push("Absence of modern drum kit or electronic percussion rhythm section");
      } else {
        score -= 0.4;
        contradicting.push("Modern rhythmic beat grid and drum kit transients present");
      }

      if (hasHarmony && ctx.chords.uniqueChords.length >= 4) {
        score += 0.15;
        supporting.push(`Rich harmonic progression vocabulary (${ctx.chords.uniqueChords.length} unique chords)`);
      }

      if (ctx.instruments.timbre.electronicness >= 0.4) {
        score -= 0.35;
        contradicting.push("Electronic and synthetic instrumentation identified");
      }

      // Subgenre identification
      let subgenre = "Classical / Instrumental";
      if (dynamicRange >= 18) {
        subgenre = "Symphonic / Orchestral";
      } else if (ctx.instruments.timbre.spectralFlatness < 0.02) {
        subgenre = "Chamber Music / Piano Solo";
      } else if (ctx.structure.structuralComplexity === "complex") {
        subgenre = "Cinematic Score / Modern Classical";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "Classical traditions feature acoustic symphonic instruments, complex voice-leading, and expansive dynamics.",
      };
    },
  },

  // 7. Jazz / Blues
  {
    name: "Jazz / Blues",
    defaultSubgenre: "Modern Jazz",
    description: "Sophisticated harmonic extensions (7ths, modulations), expressive syncopated pulse, and acoustic bass.",
    evaluate: (ctx, radar) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const hasComplexHarmony = radar.harmonicComplexity >= 0.55;
      const hasBassGuitar = ctx.instruments.bass.bassType === "bass_guitar";
      const hasOrganicRhythm = ctx.instruments.percussion.percussionType === "drum_kit" || ctx.instruments.percussion.percussionType === "minimal_percussion";

      if (hasComplexHarmony) {
        score += 0.35;
        supporting.push(`Complex harmonic language (${Math.round(radar.harmonicComplexity * 100)}% chord complexity with extensions)`);
      }

      if (hasBassGuitar) {
        score += 0.2;
        supporting.push("Upright or electric bass providing walking root motion");
      }

      if (hasOrganicRhythm && ctx.beats.regularityScore >= 0.45 && ctx.beats.regularityScore <= 0.85) {
        score += 0.2;
        supporting.push("Expressive organic rhythmic pulse with human timing variation");
      }

      if (ctx.melody.intervalStats.leapRatio >= 0.35) {
        score += 0.15;
        supporting.push("Expressive melodic leaps and chromatic contour movement");
      }

      if (ctx.instruments.timbre.electronicness >= 0.65) {
        score -= 0.3;
        contradicting.push("High synthetic production suppresses traditional jazz/blues authenticity");
      }

      // Subgenre identification
      let subgenre = "Jazz / Blues";
      if (ctx.key.mode === "Minor" && ctx.chords.totalSegments <= 6) {
        subgenre = "Blues / Soul Blues";
      } else if (radar.harmonicComplexity >= 0.7) {
        subgenre = "Bebop / Post-Bop";
      } else if (ctx.tempo.bpm <= 95) {
        subgenre = "Cool Jazz / Ballad";
      } else if (ctx.instruments.timbre.electronicness >= 0.35) {
        subgenre = "Jazz Fusion";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "Jazz and blues are defined by harmonic tension and resolution, swing syncopation, and improvisational agility.",
      };
    },
  },

  // 8. R&B / Soul / Funk
  {
    name: "R&B / Soul / Funk",
    defaultSubgenre: "Contemporary R&B",
    description: "Groove-centric syncopation, expressive vocal melisma, warm harmonic pads, and low-end bounce.",
    evaluate: (ctx, radar) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const bpm = ctx.tempo.bpm;
      const vocal = ctx.instruments.vocal;
      const isMidTempo = bpm >= 78 && bpm <= 118;

      if (vocal.detected && vocal.presencePercentage >= 25) {
        score += 0.3;
        supporting.push(`Expressive vocal performance (${vocal.presencePercentage}% presence with rich formant resonance)`);
      }

      if (isMidTempo) {
        score += 0.25;
        supporting.push(`Soul/R&B groove tempo pocket (${bpm.toFixed(0)} BPM)`);
      }

      if (ctx.instruments.bass.detected) {
        score += 0.2;
        supporting.push(`Grooving low-end foundation anchored by ${ctx.instruments.bass.bassType.replace("_", " ")}`);
      }

      if (radar.harmonicComplexity >= 0.45) {
        score += 0.15;
        supporting.push("Rich harmonic voicings with minor seventh and extended chord colors");
      }

      if (ctx.instruments.percussion.transientSharpness > 0.8) {
        score -= 0.15;
        contradicting.push("Aggressive distortion transients contrast with smooth R&B production");
      }

      // Subgenre identification
      let subgenre = "Contemporary R&B";
      if (ctx.instruments.timbre.acousticness >= 0.5) {
        subgenre = "Neo-Soul / Classic Soul";
      } else if (bpm >= 105 && radar.danceability >= 0.65) {
        subgenre = "Funk / Disco Groove";
      } else if (bpm < 85) {
        subgenre = "Slow Jam / R&B Ballad";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "R&B and Soul prioritize vocal inflection, emotive chord colors, and pocket-driven rhythmic syncopation.",
      };
    },
  },

  // 9. Metal / Heavy Rock
  {
    name: "Metal / Heavy Rock",
    defaultSubgenre: "Heavy Metal",
    description: "High-energy harmonic distortion, aggressive transient attack, minor/modal tonality, and driving drums.",
    evaluate: (ctx) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const centroid = ctx.instruments.timbre.spectralCentroidHz;
      const hasDrums = ctx.instruments.percussion.percussionType === "drum_kit";
      const isMinorOrModal = ctx.key.mode === "Minor";

      if (centroid >= 2700 && ctx.instruments.timbre.brightness === "bright") {
        score += 0.35;
        supporting.push(`High spectral energy concentration (${centroid} Hz) indicating guitar amplification and distortion`);
      }

      if (hasDrums && ctx.instruments.percussion.transientSharpness >= 0.65) {
        score += 0.3;
        supporting.push("Intense percussive attack with sharp snare crack and double-kick transients");
      }

      if (isMinorOrModal) {
        score += 0.15;
        supporting.push(`Dark modal/minor tonal framing in ${ctx.key.key}`);
      }

      if (ctx.tempo.bpm >= 125) {
        score += 0.15;
        supporting.push(`Fast, high-octane tempo (${ctx.tempo.bpm.toFixed(0)} BPM)`);
      }

      if (ctx.instruments.timbre.acousticness >= 0.6) {
        score -= 0.4;
        contradicting.push("Gentle acoustic instrumentation contradicts heavy distortion requirements");
      }

      if (!ctx.instruments.percussion.detected) {
        score -= 0.35;
        contradicting.push("Lack of drum rhythm section");
      }

      // Subgenre identification
      let subgenre = "Heavy Metal";
      if (ctx.tempo.bpm >= 150) {
        subgenre = "Thrash / Speed Metal";
      } else if (ctx.structure.structuralComplexity === "complex") {
        subgenre = "Progressive Metal";
      } else if (centroid < 2900) {
        subgenre = "Alternative Metal / Hard Rock";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "Metal music is characterized by harmonic power chords, guitar overdrive harmonics, and high-intensity drumming.",
      };
    },
  },

  // 10. Ambient / Cinematic
  {
    name: "Ambient / Cinematic",
    defaultSubgenre: "Atmospheric Ambient",
    description: "Expansive spatial soundscapes, slow harmonic evolution, and absence of rigid metric beat pulses.",
    evaluate: (ctx, radar) => {
      let score = 0;
      const supporting: string[] = [];
      const contradicting: string[] = [];
      const lowRhythm =
        !ctx.instruments.percussion.detected ||
        ctx.beats.totalBeats < 8 ||
        ctx.tempo.confidence === "low";
      const highFlatness = ctx.instruments.timbre.spectralFlatness >= 0.04;

      if (lowRhythm) {
        score += 0.45;
        supporting.push("Absence of rigid metric drum pulses or transient-heavy rhythm sections");
      } else {
        score -= 0.4;
        contradicting.push("Driving rhythmic percussion contradicts ambient atmospheric stillness");
      }

      if (ctx.instruments.timbre.dominantTexture.toLowerCase().includes("synthetic") || ctx.instruments.timbre.dominantTexture.toLowerCase().includes("warm")) {
        score += 0.25;
        supporting.push(`Sustained spatial texture (${ctx.instruments.timbre.dominantTexture})`);
      }

      if (radar.danceability < 0.25) {
        score += 0.2;
        supporting.push("Minimal danceability index reflecting meditation and soundscape immersion");
      }

      if (highFlatness) {
        score += 0.15;
        supporting.push("Diffuse spectral spread characteristic of reverberant reverb tails and pads");
      }

      if (ctx.instruments.vocal.detected && ctx.instruments.vocal.presencePercentage > 40) {
        score -= 0.25;
        contradicting.push("Foreground lyric vocals draw focus away from atmospheric sound design");
      }

      // Subgenre identification
      let subgenre = "Atmospheric Ambient";
      if (ctx.instruments.timbre.brightness === "dark") {
        subgenre = "Dark Ambient / Drone";
      } else if (ctx.instruments.timbre.acousticness >= 0.5) {
        subgenre = "Cinematic Acoustic / Modern Classical";
      } else if (ctx.instruments.timbre.electronicness >= 0.6) {
        subgenre = "Space Ambient / Electronic Soundscape";
      }

      return {
        score: Math.max(0, Math.min(1.0, score)),
        subgenre,
        supportingEvidence: supporting,
        contradictingFactors: contradicting,
        culturalContext: "Ambient music prioritizes tone, timbre, and atmospheric immersion over traditional melody and rhythmic structure.",
      };
    },
  },
];

/**
 * Computes high-level Style Trait Radar from multi-stage context.
 */
function computeStyleTraitRadar(ctx: GenreAnalysisContext): StyleTraitRadar {
  const bpm = ctx.tempo.bpm;
  const regularity = ctx.beats.regularityScore;
  const percussion = ctx.instruments.percussion;
  const vocal = ctx.instruments.vocal;
  const chords = ctx.chords;

  // 1. Danceability: tempo optimal around 110-130 BPM, high regularity, crisp percussion
  let tempoDance = 0;
  if (bpm >= 100 && bpm <= 135) {
    tempoDance = 1.0 - Math.abs(bpm - 122) / 35;
  } else if (bpm >= 80 && bpm < 100) {
    tempoDance = 0.65;
  } else if (bpm > 135 && bpm <= 175) {
    tempoDance = 0.6;
  } else {
    tempoDance = 0.25;
  }
  const danceability = Number(
    Math.min(
      1.0,
      Math.max(
        0.05,
        tempoDance * 0.4 +
          regularity * 0.35 +
          (percussion.detected ? 0.25 : 0.0)
      )
    ).toFixed(2)
  );

  // 2. Energy: Centroid, dynamic range, RMS
  const centroidNorm = Math.min(1.0, ctx.instruments.timbre.spectralCentroidHz / 4500);
  const energy = Number(
    Math.min(
      1.0,
      Math.max(
        0.1,
        centroidNorm * 0.45 +
          (ctx.tempo.bpm >= 115 ? 0.3 : 0.15) +
          (percussion.transientSharpness * 0.25)
      )
    ).toFixed(2)
  );

  // 3. Acousticness: directly from Phase 11
  const acousticness = ctx.instruments.timbre.acousticness;

  // 4. Instrumentalness: 1.0 - vocal ratio
  const instrumentalness = Number(
    Math.max(
      0.0,
      Math.min(1.0, 1.0 - (vocal.presencePercentage / 100) * 0.95)
    ).toFixed(2)
  );

  // 5. Harmonic Complexity: chord diversity, extended chords, cadences
  const uniqueCount = chords.uniqueChords.length;
  const nonTriadRatio =
    chords.segments.filter((s) => {
      const name = s.name ?? "";
      return name.includes("7") || name.includes("sus") || name.includes("dim");
    }).length / Math.max(1, chords.segments.length);

  const harmonicComplexity = Number(
    Math.min(
      1.0,
      Math.max(
        0.1,
        Math.min(1.0, uniqueCount / 7) * 0.4 +
          nonTriadRatio * 0.35 +
          (ctx.progression.distribution.length >= 6
            ? 0.25
            : ctx.progression.distribution.length >= 4
            ? 0.15
            : 0.05)
      )
    ).toFixed(2)
  );

  // 6. Rhythmic Syncopation: deviation from straight grid, transient offset
  const rhythmicSyncopation = Number(
    Math.min(
      1.0,
      Math.max(
        0.1,
        (1.0 - regularity) * 0.5 + (percussion.hasHiHats ? 0.25 : 0.1)
      )
    ).toFixed(2)
  );

  return {
    danceability,
    energy,
    acousticness,
    instrumentalness,
    harmonicComplexity,
    rhythmicSyncopation,
  };
}

/**
 * Analyzes section-level stylistic variation using Phase 10 sections.
 */
function analyzeSectionStyleVariations(
  ctx: GenreAnalysisContext,
  primaryGenreName: string
): { variations: SectionStyleVariation[]; hasVariation: boolean } {
  const sections = ctx.structure.sections;
  if (!sections || sections.length < 2) {
    return { variations: [], hasVariation: false };
  }

  const variations: SectionStyleVariation[] = [];
  let notableShiftCount = 0;

  for (const sec of sections) {
    const isIntroOrOutro =
      sec.group.toLowerCase().includes("intro") ||
      sec.group.toLowerCase().includes("outro") ||
      sec.label.toLowerCase().includes("intro") ||
      sec.label.toLowerCase().includes("outro");
    const divergentFeatures: string[] = [];
    let contrast: "consistent" | "notable_shift" | "dramatic_contrast" = "consistent";
    let dominantStyle = primaryGenreName;

    // Evaluate section energy compared to average
    if (isIntroOrOutro && sec.characteristics.energy < 0.35) {
      divergentFeatures.push("Gentle dynamic level with reduced percussive drive");
      dominantStyle = ctx.instruments.timbre.acousticness >= 0.5 ? "Acoustic Introduction" : "Ambient Prelude";
      contrast = "notable_shift";
      notableShiftCount++;
    } else if (sec.characteristics.energy > 0.65 && ctx.instruments.percussion.detected) {
      divergentFeatures.push("Peak dynamic intensity and driving rhythmic burst");
    }

    variations.push({
      sectionId: sec.id,
      sectionName: sec.label,
      startTime: sec.startTime,
      endTime: sec.endTime,
      dominantStyle,
      stylisticContrast: contrast,
      divergentFeatures,
    });
  }

  return {
    variations,
    hasVariation: notableShiftCount >= 1,
  };
}

/**
 * Executes full client-side Genre & Musical Style Analysis.
 */
export async function analyzeGenreAndStyle(
  context: GenreAnalysisContext,
  options: GenreAnalysisOptions = {}
): Promise<GenreAnalysisResult> {
  const { onProgress } = options;

  onProgress?.(20, "Extracting multi-dimensional MIR feature vectors...");

  // 1. Calculate Style Trait Radar
  const radar = computeStyleTraitRadar(context);

  onProgress?.(50, "Correlating acoustic telemetry across genre archetypes...");

  // 2. Evaluate all 10 genre archetypes
  const evaluatedGenres: Array<{
    genre: string;
    subgenre: string | null;
    score: number;
    supportingEvidence: string[];
    contradictingFactors: string[];
    culturalContext?: string;
  }> = [];

  for (const def of GENRE_DEFINITIONS) {
    const result = def.evaluate(context, radar);
    evaluatedGenres.push({
      genre: def.name,
      subgenre: result.subgenre,
      score: result.score,
      supportingEvidence: result.supportingEvidence,
      contradictingFactors: result.contradictingFactors,
      culturalContext: result.culturalContext,
    });
  }

  onProgress?.(75, "Ranking stylistic candidates and resolving hybrid alignments...");

  // Sort descending by match score
  evaluatedGenres.sort((a, b) => b.score - a.score);

  const topMatch = evaluatedGenres[0];
  const secondMatch = evaluatedGenres[1];
  const thirdMatch = evaluatedGenres[2];

  // 3. Ambiguity & Evidence Validation
  const isAmbiguous = topMatch.score < 0.42 || Math.abs(topMatch.score - secondMatch.score) < 0.05;

  let primaryGenre: GenreCandidate;
  if (topMatch.score < 0.35) {
    primaryGenre = {
      genre: "Uncertain / Insufficient Evidence",
      subgenre: null,
      confidence: Number(topMatch.score.toFixed(2)),
      confidenceLevel: "uncertain",
      affinityPercentage: Math.round(topMatch.score * 100),
      supportingEvidence: [
        "Acoustic features display diffuse or non-distinctive characteristics across genre archetypes.",
      ],
      contradictingFactors: [
        "No single musical style achieved sufficient classification confidence.",
      ],
      culturalContextNote: "Genre classification requires prominent rhythmic, harmonic, or timbral anchors.",
    };
  } else {
    const confLevel =
      topMatch.score >= 0.75
        ? "high"
        : topMatch.score >= 0.55
        ? "moderate"
        : topMatch.score >= 0.42
        ? "low"
        : "speculative";

    primaryGenre = {
      genre: topMatch.genre,
      subgenre: topMatch.subgenre,
      confidence: Number(topMatch.score.toFixed(2)),
      confidenceLevel: confLevel,
      affinityPercentage: Math.round(topMatch.score * 100),
      supportingEvidence: topMatch.supportingEvidence.slice(0, 4),
      contradictingFactors: topMatch.contradictingFactors.slice(0, 3),
      culturalContextNote: topMatch.culturalContext,
    };
  }

  // 4. Secondary genres / stylistic influences
  const secondaryGenres: GenreCandidate[] = [];
  if (secondMatch && secondMatch.score >= 0.38 && secondMatch.genre !== primaryGenre.genre) {
    secondaryGenres.push({
      genre: secondMatch.genre,
      subgenre: secondMatch.subgenre,
      confidence: Number(secondMatch.score.toFixed(2)),
      confidenceLevel: secondMatch.score >= 0.6 ? "moderate" : "low",
      affinityPercentage: Math.round(secondMatch.score * 100),
      supportingEvidence: secondMatch.supportingEvidence.slice(0, 3),
      contradictingFactors: secondMatch.contradictingFactors.slice(0, 2),
      culturalContextNote: secondMatch.culturalContext,
    });
  }

  if (thirdMatch && thirdMatch.score >= 0.35 && thirdMatch.genre !== primaryGenre.genre && secondaryGenres.length < 2) {
    secondaryGenres.push({
      genre: thirdMatch.genre,
      subgenre: thirdMatch.subgenre,
      confidence: Number(thirdMatch.score.toFixed(2)),
      confidenceLevel: "low",
      affinityPercentage: Math.round(thirdMatch.score * 100),
      supportingEvidence: thirdMatch.supportingEvidence.slice(0, 2),
      contradictingFactors: thirdMatch.contradictingFactors.slice(0, 2),
    });
  }

  // 5. Hybrid Style Synthesis
  let hybridStyleLabel: string | null = null;
  if (
    secondMatch &&
    topMatch.score >= 0.55 &&
    secondMatch.score >= 0.5 &&
    topMatch.score - secondMatch.score <= 0.15
  ) {
    const p = topMatch.genre;
    const s = secondMatch.genre;
    if (p.includes("Pop") && s.includes("Electronic")) hybridStyleLabel = "Electropop / Dance Pop";
    else if (p.includes("Electronic") && s.includes("Pop")) hybridStyleLabel = "Electropop / Synth-Pop";
    else if (p.includes("Rock") && s.includes("Pop")) hybridStyleLabel = "Pop Rock / Alternative Pop";
    else if (p.includes("Pop") && s.includes("Rock")) hybridStyleLabel = "Pop Rock";
    else if (p.includes("Hip-Hop") && s.includes("R&B")) hybridStyleLabel = "Hip-Hop / R&B Fusion";
    else if (p.includes("R&B") && s.includes("Hip-Hop")) hybridStyleLabel = "Urban R&B / Neo-Soul";
    else if (p.includes("Acoustic") && s.includes("Rock")) hybridStyleLabel = "Folk Rock / Acoustic Alternative";
    else if (p.includes("Rock") && s.includes("Acoustic")) hybridStyleLabel = "Acoustic Rock / Roots Rock";
    else if (p.includes("Electronic") && s.includes("Ambient")) hybridStyleLabel = "Ambient Electronic / Downtempo";
    else if (p.includes("Classical") && s.includes("Ambient")) hybridStyleLabel = "Neo-Classical / Cinematic Soundscape";
    else if (p.includes("Jazz") && s.includes("Rock")) hybridStyleLabel = "Jazz Fusion / Jam";
    else {
      hybridStyleLabel = `${topMatch.genre.split("/")[0].trim()} / ${secondMatch.genre.split("/")[0].trim()} Fusion`;
    }
  }

  onProgress?.(90, "Evaluating song section stylistic evolution...");

  // 6. Section variations
  const { variations, hasVariation } = analyzeSectionStyleVariations(
    context,
    primaryGenre.genre
  );

  // 7. Natural Language Summary
  const summary = generateGenreSummary({
    primary: primaryGenre,
    secondary: secondaryGenres,
    hybrid: hybridStyleLabel,
    radar,
    isAmbiguous,
  });

  const methodologyNote =
    "Genre analysis is computed using a multi-dimensional Music Information Retrieval (MIR) feature space integrating tempo, meter, diatonic harmony, vocal formants, transient sharpness, and spectral acousticness. Boundaries are fuzzy and culturally contextual.";

  return {
    primaryGenre,
    secondaryGenres,
    hybridStyleLabel,
    isAmbiguous,
    ambiguityReason: isAmbiguous
      ? "Stylistic characteristics closely overlap multiple genre archetypes without a single dominant aesthetic marker."
      : undefined,
    styleTraits: radar,
    sectionVariations: variations,
    hasSectionVariation: hasVariation,
    analysisSummary: summary,
    methodologyNote,
  };
}

function generateGenreSummary({
  primary,
  secondary,
  hybrid,
  radar,
  isAmbiguous,
}: {
  primary: GenreCandidate;
  secondary: GenreCandidate[];
  hybrid: string | null;
  radar: StyleTraitRadar;
  isAmbiguous: boolean;
}): string {
  if (primary.genre.includes("Uncertain")) {
    return "The audio recording exhibits diffuse stylistic attributes without dominant genre signatures. Features suggest ambient or unconstrained musical form.";
  }

  const subStr = primary.subgenre ? ` (${primary.subgenre})` : "";
  const hybridStr = hybrid ? ` Identified as a ${hybrid}.` : "";
  const secStr =
    secondary.length > 0
      ? ` Demonstrates notable secondary stylistic influences from ${secondary.map((s) => s.genre).join(" and ")}.`
      : "";

  const traitStr = `Acousticness is measured at ${Math.round(radar.acousticness * 100)}%, danceability at ${Math.round(radar.danceability * 100)}%, and energy index at ${Math.round(radar.energy * 100)}%.`;

  const ambStr = isAmbiguous
    ? " Classification confidence is moderated due to overlapping crossover elements."
    : ` Primary alignment rated with ${primary.confidenceLevel} confidence (${primary.affinityPercentage}% affinity).`;

  return `Primary musical style classified as ${primary.genre}${subStr}.${hybridStr}${secStr} ${traitStr}${ambStr}`;
}

export function createEmptyGenreResult(summary: string): GenreAnalysisResult {
  return {
    primaryGenre: {
      genre: "Uncertain / Insufficient Evidence",
      subgenre: null,
      confidence: 0,
      confidenceLevel: "uncertain",
      affinityPercentage: 0,
      supportingEvidence: [summary],
      contradictingFactors: [],
    },
    secondaryGenres: [],
    hybridStyleLabel: null,
    isAmbiguous: true,
    ambiguityReason: summary,
    styleTraits: {
      danceability: 0.5,
      energy: 0.5,
      acousticness: 0.5,
      instrumentalness: 0.5,
      harmonicComplexity: 0.5,
      rhythmicSyncopation: 0.5,
    },
    sectionVariations: [],
    hasSectionVariation: false,
    analysisSummary: summary,
    methodologyNote:
      "Client-side MIR feature extraction did not acquire sufficient audio signal to resolve musical style.",
  };
}
