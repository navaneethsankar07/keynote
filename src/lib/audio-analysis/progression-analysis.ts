/**
 * Chord Progression & Harmonic Analysis Engine
 *
 * Analyzes time-varying chord sequences from Phase 7 chord detection:
 * - Recurring chord progression pattern recognition (n-grams from length 2 to 6)
 * - Chord transition matrix & transition probabilities
 * - Separate chord event frequency vs. cumulative time duration metrics
 * - Roman numeral harmonic degree analysis relative to Phase 6 detected key
 * - Transparent handling of key uncertainty and non-diatonic / borrowed chords
 */

import {
  PITCH_CLASSES,
  PitchClass,
  KeyAnalysisResult,
  ChordSegment,
  ProgressionPattern,
  ProgressionOccurrence,
  ChordTransition,
  ChordDistributionItem,
  ProgressionAnalysisResult,
  HarmonicDegree,
} from "./types";

/**
 * Derives the Roman numeral and harmonic function of a chord relative to a known key.
 */
export function deriveHarmonicDegree(
  chordRoot: PitchClass,
  chordQuality: string | null,
  keyRoot: PitchClass,
  keyMode: "Major" | "Minor"
): HarmonicDegree {
  const rootIdx = PITCH_CLASSES.indexOf(chordRoot);
  const keyRootIdx = PITCH_CLASSES.indexOf(keyRoot);
  const interval = (rootIdx - keyRootIdx + 12) % 12;

  if (keyMode === "Major") {
    switch (interval) {
      case 0: // Root / Tonic
        return {
          romanNumeral: chordQuality === "minor" ? "i" : chordQuality === "dom7" ? "I7" : "I",
          scaleDegree: 1,
          isDiatonic: chordQuality === "major" || chordQuality === "maj7",
          functionLabel: "Tonic",
        };
      case 1: // ♭II (Neapolitan)
        return {
          romanNumeral: "♭II",
          scaleDegree: 0,
          isDiatonic: false,
          functionLabel: "Neapolitan (Non-diatonic)",
        };
      case 2: // Supertonic
        return {
          romanNumeral: chordQuality === "major" ? "II" : chordQuality === "dom7" ? "II7" : "ii",
          scaleDegree: 2,
          isDiatonic: chordQuality === "minor" || chordQuality === "min7",
          functionLabel: chordQuality === "major" ? "Secondary Dominant (V/V)" : "Supertonic",
        };
      case 3: // ♭III (Borrowed from parallel minor)
        return {
          romanNumeral: "♭III",
          scaleDegree: 0,
          isDiatonic: false,
          functionLabel: "Borrowed Mediant",
        };
      case 4: // Mediant
        return {
          romanNumeral: chordQuality === "major" ? "III" : "iii",
          scaleDegree: 3,
          isDiatonic: chordQuality === "minor",
          functionLabel: chordQuality === "major" ? "Secondary Dominant (V/vi)" : "Mediant",
        };
      case 5: // Subdominant
        return {
          romanNumeral: chordQuality === "minor" ? "iv" : "IV",
          scaleDegree: 4,
          isDiatonic: chordQuality === "major" || chordQuality === "maj7",
          functionLabel: chordQuality === "minor" ? "Minor Subdominant (iv)" : "Subdominant",
        };
      case 6: // ♯IV / ♭V
        return {
          romanNumeral: "♯IV",
          scaleDegree: 0,
          isDiatonic: false,
          functionLabel: "Tritone Substitute (Non-diatonic)",
        };
      case 7: // Dominant
        return {
          romanNumeral: chordQuality === "minor" ? "v" : chordQuality === "dom7" ? "V7" : "V",
          scaleDegree: 5,
          isDiatonic: chordQuality === "major" || chordQuality === "dom7",
          functionLabel: chordQuality === "minor" ? "Minor Dominant (v)" : "Dominant",
        };
      case 8: // ♭VI (Borrowed submediant)
        return {
          romanNumeral: "♭VI",
          scaleDegree: 0,
          isDiatonic: false,
          functionLabel: "Borrowed Submediant",
        };
      case 9: // Submediant (Relative minor)
        return {
          romanNumeral: chordQuality === "major" ? "VI" : "vi",
          scaleDegree: 6,
          isDiatonic: chordQuality === "minor" || chordQuality === "min7",
          functionLabel: chordQuality === "major" ? "Secondary Dominant (V/ii)" : "Submediant (Relative Minor)",
        };
      case 10: // ♭VII (Subtonic)
        return {
          romanNumeral: "♭VII",
          scaleDegree: 0,
          isDiatonic: false,
          functionLabel: "Subtonic (Mixolydian Modal)",
        };
      case 11: // Leading tone
        return {
          romanNumeral: chordQuality === "diminished" ? "vii°" : "VII",
          scaleDegree: 7,
          isDiatonic: chordQuality === "diminished",
          functionLabel: "Leading Tone",
        };
    }
  } else {
    // Minor Key (Natural Minor / Harmonic Minor context)
    switch (interval) {
      case 0: // Tonic
        return {
          romanNumeral: chordQuality === "major" ? "I" : "i",
          scaleDegree: 1,
          isDiatonic: chordQuality === "minor" || chordQuality === "min7",
          functionLabel: chordQuality === "major" ? "Major Tonic (Picardy 3rd)" : "Tonic",
        };
      case 2: // Supertonic
        return {
          romanNumeral: chordQuality === "diminished" ? "ii°" : "ii",
          scaleDegree: 2,
          isDiatonic: chordQuality === "diminished",
          functionLabel: "Supertonic",
        };
      case 3: // Mediant (Relative Major)
        return {
          romanNumeral: chordQuality === "minor" ? "iii" : "III",
          scaleDegree: 3,
          isDiatonic: chordQuality === "major" || chordQuality === "maj7",
          functionLabel: "Mediant (Relative Major)",
        };
      case 5: // Subdominant
        return {
          romanNumeral: chordQuality === "major" ? "IV" : "iv",
          scaleDegree: 4,
          isDiatonic: chordQuality === "minor" || chordQuality === "min7",
          functionLabel: chordQuality === "major" ? "Dorian Subdominant (IV)" : "Subdominant",
        };
      case 7: // Dominant
        return {
          romanNumeral: chordQuality === "major" || chordQuality === "dom7" ? "V" : "v",
          scaleDegree: 5,
          isDiatonic: true, // Both natural minor v and harmonic V are standard
          functionLabel: chordQuality === "major" || chordQuality === "dom7" ? "Harmonic Dominant" : "Natural Dominant",
        };
      case 8: // Submediant
        return {
          romanNumeral: chordQuality === "minor" ? "vi" : "VI",
          scaleDegree: 6,
          isDiatonic: chordQuality === "major" || chordQuality === "maj7",
          functionLabel: "Submediant",
        };
      case 10: // Subtonic
        return {
          romanNumeral: chordQuality === "minor" ? "vii" : "VII",
          scaleDegree: 7,
          isDiatonic: chordQuality === "major",
          functionLabel: "Subtonic",
        };
      case 11: // Raised leading tone
        return {
          romanNumeral: chordQuality === "diminished" ? "vii°" : "VII",
          scaleDegree: 7,
          isDiatonic: chordQuality === "diminished",
          functionLabel: "Leading Tone",
        };
      default:
        return {
          romanNumeral: "♭" + interval,
          scaleDegree: 0,
          isDiatonic: false,
          functionLabel: "Non-diatonic",
        };
    }
  }

  return {
    romanNumeral: "?",
    scaleDegree: 0,
    isDiatonic: false,
    functionLabel: "Non-diatonic",
  };
}

/**
 * Analyzes chord sequences, progression loops, transitions, and duration distributions.
 */
export function analyzeChordProgression(
  segments: ChordSegment[],
  keyResult: KeyAnalysisResult | null,
  totalDuration: number
): ProgressionAnalysisResult {
  // 1. Filter out silent/no-chord segments for harmonic sequence analysis
  const musicalSegments = segments.filter((s) => s.name !== "N.C." && !s.isUncertain);

  // 2. Check key reliability for Roman numeral analysis
  const keyReliable =
    !!keyResult &&
    keyResult.key !== "Undetermined" &&
    (keyResult.confidence === "high" || keyResult.confidence === "moderate");

  const keyRoot = keyResult?.root ?? "C";
  const keyMode = keyResult?.mode ?? "Major";

  // Helper map from chordName to Roman Numeral
  const getRoman = (chordName: string, segRoot: PitchClass | null, segQuality: string | null) => {
    if (!keyReliable || !segRoot) return null;
    const deg = deriveHarmonicDegree(segRoot, segQuality, keyRoot, keyMode);
    return deg.romanNumeral;
  };

  // 3. Chord Frequency & Duration Distribution
  const distMap = new Map<
    string,
    {
      eventCount: number;
      totalDurationSec: number;
      root: PitchClass | null;
      quality: string | null;
      isDiatonic: boolean;
      romanNumeral: string | null;
    }
  >();

  for (const seg of segments) {
    if (seg.name === "N.C.") continue;

    const existing = distMap.get(seg.name);
    const roman = getRoman(seg.name, seg.root, seg.quality);
    const isDiatonic =
      keyReliable && seg.root
        ? deriveHarmonicDegree(seg.root, seg.quality, keyRoot, keyMode).isDiatonic
        : true;

    if (!existing) {
      distMap.set(seg.name, {
        eventCount: 1,
        totalDurationSec: seg.duration,
        root: seg.root,
        quality: seg.quality,
        isDiatonic,
        romanNumeral: roman,
      });
    } else {
      existing.eventCount += 1;
      existing.totalDurationSec += seg.duration;
    }
  }

  const distribution: ChordDistributionItem[] = Array.from(distMap.entries())
    .map(([chordName, data]) => ({
      chordName,
      romanNumeral: data.romanNumeral,
      eventCount: data.eventCount,
      totalDurationSec: Math.round(data.totalDurationSec * 10) / 10,
      percentage: totalDuration > 0 ? Math.round((data.totalDurationSec / totalDuration) * 1000) / 10 : 0,
      isDiatonic: data.isDiatonic,
    }))
    .sort((a, b) => b.totalDurationSec - a.totalDurationSec);

  // 4. Chord Transition Matrix
  const transitionCountMap = new Map<string, number>();
  const fromTotalsMap = new Map<string, number>();

  for (let i = 0; i < musicalSegments.length - 1; i++) {
    const from = musicalSegments[i].name;
    const to = musicalSegments[i + 1].name;

    if (from === to) continue; // Skip self-transitions

    const pairKey = `${from}->${to}`;
    transitionCountMap.set(pairKey, (transitionCountMap.get(pairKey) || 0) + 1);
    fromTotalsMap.set(from, (fromTotalsMap.get(from) || 0) + 1);
  }

  const transitions: ChordTransition[] = Array.from(transitionCountMap.entries())
    .map(([pairKey, count]) => {
      const [from, to] = pairKey.split("->");
      const fromTotal = fromTotalsMap.get(from) || 1;
      const prob = Math.round((count / fromTotal) * 100) / 100;

      const fromSeg = musicalSegments.find((s) => s.name === from);
      const toSeg = musicalSegments.find((s) => s.name === to);

      return {
        fromChord: from,
        toChord: to,
        count,
        probability: prob,
        fromRoman: fromSeg ? getRoman(from, fromSeg.root, fromSeg.quality) : null,
        toRoman: toSeg ? getRoman(to, toSeg.root, toSeg.quality) : null,
      };
    })
    .sort((a, b) => b.count - a.count);

  // 5. Progression Pattern Recognition (lengths 2 to 6)
  const chordSeq = musicalSegments.map((s) => s.name);
  const rawPatterns: {
    sequence: string[];
    occurrences: ProgressionOccurrence[];
    avgConfidence: number;
  }[] = [];

  for (let len = 4; len >= 2; len--) {
    if (chordSeq.length < len * 2) continue;

    for (let i = 0; i <= chordSeq.length - len; i++) {
      const candidate = chordSeq.slice(i, i + len);

      // Avoid repeating identical adjacent chords like [C, C, C, C]
      const uniqueInCandidate = new Set(candidate);
      if (uniqueInCandidate.size < 2) continue;

      // Search for non-overlapping occurrences across the full sequence
      const occurrences: ProgressionOccurrence[] = [];
      let j = 0;
      let totalConf = 0;
      let confCount = 0;

      while (j <= chordSeq.length - len) {
        let match = true;
        for (let k = 0; k < len; k++) {
          if (chordSeq[j + k] !== candidate[k]) {
            match = false;
            break;
          }
        }

        if (match) {
          const startSeg = musicalSegments[j];
          const endSeg = musicalSegments[j + len - 1];
          const dur = Math.round((endSeg.endTime - startSeg.startTime) * 100) / 100;

          occurrences.push({
            startIndex: j,
            endIndex: j + len - 1,
            startTime: startSeg.startTime,
            endTime: endSeg.endTime,
            duration: dur,
          });

          for (let k = 0; k < len; k++) {
            totalConf += musicalSegments[j + k].confidence;
            confCount++;
          }

          j += len; // Jump past this match to avoid trivial overlap
        } else {
          j++;
        }
      }

      if (occurrences.length >= 2) {
        // Check if candidate is already recorded
        const candKey = candidate.join(",");
        const alreadyExists = rawPatterns.some((p) => p.sequence.join(",") === candKey);

        if (!alreadyExists) {
          rawPatterns.push({
            sequence: candidate,
            occurrences,
            avgConfidence: confCount > 0 ? Math.round((totalConf / confCount) * 100) / 100 : 0.8,
          });
        }
      }
    }
  }

  // Filter out redundant subpatterns that only occur as a subset of longer patterns
  const prunedPatterns: {
    sequence: string[];
    occurrences: ProgressionOccurrence[];
    avgConfidence: number;
  }[] = [];

  for (const pat of rawPatterns) {
    const isSubPattern = rawPatterns.some(
      (longer) =>
        longer.sequence.length > pat.sequence.length &&
        longer.occurrences.length >= pat.occurrences.length &&
        longer.sequence.join(",").includes(pat.sequence.join(","))
    );

    if (!isSubPattern) {
      prunedPatterns.push(pat);
    }
  }

  // Format into final ProgressionPattern objects
  const patterns: ProgressionPattern[] = prunedPatterns
    .map((pat, idx) => {
      const patternName = pat.sequence.join(" → ");
      const totalDur = pat.occurrences.reduce((a, b) => a + b.duration, 0);
      const avgDur = pat.occurrences.length > 0 ? Math.round((totalDur / pat.occurrences.length) * 10) / 10 : 0;

      const romanNumerals = keyReliable
        ? pat.sequence.map((chordName) => {
            const seg = musicalSegments.find((s) => s.name === chordName);
            return seg ? getRoman(chordName, seg.root, seg.quality) || chordName : chordName;
          })
        : null;

      return {
        id: `prog-pat-${idx}`,
        chords: pat.sequence,
        romanNumerals,
        patternName,
        length: pat.sequence.length,
        repetitionCount: pat.occurrences.length,
        occurrences: pat.occurrences,
        totalDuration: Math.round(totalDur * 10) / 10,
        averageDuration: avgDur,
        confidence: pat.avgConfidence,
        isDominant: false,
      };
    })
    .sort((a, b) => {
      // Sort by length * repetitions * duration
      const scoreA = a.length * a.repetitionCount * a.totalDuration;
      const scoreB = b.length * b.repetitionCount * b.totalDuration;
      return scoreB - scoreA;
    });

  if (patterns.length > 0) {
    patterns[0].isDominant = true;
  }

  const primaryProgression = patterns.length > 0 ? patterns[0] : null;
  const totalChordChanges = Math.max(0, musicalSegments.length - 1);

  // 6. Generate Factual Harmonic Summary
  let harmonicSummary = "";
  if (primaryProgression) {
    const romanStr = primaryProgression.romanNumerals
      ? ` (${primaryProgression.romanNumerals.join(" → ")})`
      : "";
    harmonicSummary =
      `Identified recurring ${primaryProgression.length}-chord progression ${primaryProgression.patternName}${romanStr} ` +
      `repeated ${primaryProgression.repetitionCount} times across the piece, spanning ${primaryProgression.totalDuration}s total duration. ` +
      `The progression exhibits ${transitions[0] ? `frequent transitions from ${transitions[0].fromChord} to ${transitions[0].toChord}` : "smooth harmonic motion"}.`;
  } else if (distribution.length > 0) {
    harmonicSummary =
      `Harmonic sequence features ${distribution.length} distinct chords across ${totalChordChanges} transitions. ` +
      `No strict recurring cyclical loop detected; harmony unfolds through varied harmonic motion anchored around ${distribution[0].chordName}.`;
  } else {
    harmonicSummary = "No discernible harmonic progressions detected in this audio signal.";
  }

  return {
    patterns,
    primaryProgression,
    transitions,
    distribution,
    keyReliable,
    keyUsed: keyReliable ? keyResult!.key : null,
    totalChordChanges,
    harmonicSummary,
  };
}

