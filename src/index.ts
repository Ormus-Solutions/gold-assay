/**
 * @ormus/gold-assay — Vibium annex: score UI proofs (OCR/DOM summaries)
 * before an agent claims the flow is GREEN.
 */

export type AssayVerdict = 'GREEN' | 'AMBER' | 'RED';

export interface UiProof {
  ocrText: string;
  domSummary: string;
  expect: string[];
  forbid?: string[];
  frameId?: string;
}

export interface AssayWeights {
  expectHit: number;
  forbidHit: number;
  densityBonus: number;
  minGreen: number;
  minAmber: number;
}

export interface AssayResult {
  verdict: AssayVerdict;
  score: number;
  confidence: number;
  hits: string[];
  violations: string[];
  reason: string;
  frameId?: string;
}

const DEFAULT_WEIGHTS: AssayWeights = {
  expectHit: 0.35,
  forbidHit: 0.5,
  densityBonus: 0.1,
  minGreen: 0.75,
  minAmber: 0.45,
};

function includesLoose(hay: string, needle: string): boolean {
  try {
    if (needle.startsWith('/') && needle.lastIndexOf('/') > 0) {
      const last = needle.lastIndexOf('/');
      const body = needle.slice(1, last);
      const flags = needle.slice(last + 1) || 'i';
      return new RegExp(body, flags).test(hay);
    }
  } catch {
    /* fall through */
  }
  return hay.toLowerCase().includes(needle.toLowerCase());
}

export function assay(proof: UiProof, weights: Partial<AssayWeights> = {}): AssayResult {
  const w = { ...DEFAULT_WEIGHTS, ...weights };
  const corpus = `${proof.ocrText}\n${proof.domSummary}`;
  const hits = proof.expect.filter((e) => includesLoose(corpus, e));
  const violations = (proof.forbid ?? []).filter((f) => includesLoose(corpus, f));

  const expectRatio = proof.expect.length === 0 ? 0 : hits.length / proof.expect.length;
  let score = expectRatio * (1 - w.forbidHit) + hits.length * w.expectHit * 0.05;
  score -= violations.length * w.forbidHit;
  if (corpus.trim().length > 40) score += w.densityBonus;
  score = Math.max(0, Math.min(1, score));

  const confidence = Math.min(
    1,
    0.5 + hits.length * 0.1 + (violations.length === 0 ? 0.2 : 0) + (corpus.length > 80 ? 0.1 : 0),
  );

  let verdict: AssayVerdict = 'RED';
  if (violations.length > 0) {
    verdict = 'RED';
  } else if (score >= w.minGreen && expectRatio >= 0.8) {
    verdict = 'GREEN';
  } else if (score >= w.minAmber) {
    verdict = 'AMBER';
  }

  return {
    verdict,
    score,
    confidence,
    hits,
    violations,
    reason:
      violations.length > 0
        ? `Forbidden signals: ${violations.join(', ')}`
        : `expect ${hits.length}/${proof.expect.length}, score=${score.toFixed(3)}`,
    frameId: proof.frameId,
  };
}

export function assayFlow(proofs: UiProof[]): {
  overall: AssayVerdict;
  steps: AssayResult[];
} {
  const steps = proofs.map((p) => assay(p));
  const overall: AssayVerdict = steps.some((s) => s.verdict === 'RED')
    ? 'RED'
    : steps.every((s) => s.verdict === 'GREEN')
      ? 'GREEN'
      : 'AMBER';
  return { overall, steps };
}
