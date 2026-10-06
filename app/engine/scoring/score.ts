import { DEFAULT_TOLERANCE, RESAMPLED_POINT_COUNT, SCORING_WEIGHTS, STAR_THRESHOLDS } from "./constants";
import { distance, normalizeToBox, resampleStrokes, type Box, type Point, type Strokes } from "../geometry/strokes";

export type ScoreOptions = {
  tolerance?: number;
  scoreDirection?: boolean;
  scoreOrder?: boolean;
  bounds?: Box;
};

export type ScoreResult = {
  coverage: number;
  precision: number;
  direction: number;
  order: number;
  score: number;
  stars: 0 | 1 | 2 | 3;
};

function validateTolerance(tolerance: number): void {
  if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance > 1) {
    throw new RangeError("Tolerance must be a finite value between 0 and 1.");
  }
}

function hasNearbyPoint(point: Point, candidates: Point[], tolerance: number): boolean {
  return candidates.some((candidate) => distance(point, candidate) <= tolerance);
}

export function coverageScore(template: Strokes, user: Strokes, tolerance: number): number {
  validateTolerance(tolerance);
  const templatePoints = template.flat();
  const userPoints = user.flat();
  if (templatePoints.length === 0 || userPoints.length === 0) return 0;
  const covered = templatePoints.filter((point) => hasNearbyPoint(point, userPoints, tolerance)).length;
  return covered / templatePoints.length;
}

export function precisionScore(template: Strokes, user: Strokes, tolerance: number): number {
  validateTolerance(tolerance);
  const templatePoints = template.flat();
  const userPoints = user.flat();
  if (templatePoints.length === 0 || userPoints.length === 0) return 0;
  const precise = userPoints.filter((point) => hasNearbyPoint(point, templatePoints, tolerance)).length;
  return precise / userPoints.length;
}

function strokeDistance(user: Point[], template: Point[]): number {
  if (user.length === 0 || template.length === 0) return Number.POSITIVE_INFINITY;
  const userToTemplate = user.reduce((sum, point) => sum + Math.min(...template.map((target) => distance(point, target))), 0) / user.length;
  const templateToUser = template.reduce((sum, point) => sum + Math.min(...user.map((target) => distance(point, target))), 0) / template.length;
  return (userToTemplate + templateToUser) / 2;
}

export function orderScore(user: Strokes, template: Strokes): number {
  const matchedTemplateIndexes = user.map((stroke) => {
    let bestIndex = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    template.forEach((candidate, index) => {
      const candidateDistance = strokeDistance(stroke, candidate);
      if (candidateDistance < bestDistance) {
        bestDistance = candidateDistance;
        bestIndex = index;
      }
    });
    return bestIndex;
  }).filter((index) => index >= 0);

  const pairCount = matchedTemplateIndexes.length * (matchedTemplateIndexes.length - 1) / 2;
  if (pairCount === 0) return 1;

  let swaps = 0;
  for (let first = 0; first < matchedTemplateIndexes.length; first += 1) {
    for (let second = first + 1; second < matchedTemplateIndexes.length; second += 1) {
      if (matchedTemplateIndexes[first] > matchedTemplateIndexes[second]) swaps += 1;
    }
  }
  return 1 - swaps / pairCount;
}

export function directionScore(user: Strokes, template: Strokes): number {
  const strokeCount = Math.max(user.length, template.length);
  if (strokeCount === 0) return 0;

  let total = 0;
  for (let index = 0; index < strokeCount; index += 1) {
    const userStroke = user[index];
    const templateStroke = template[index];
    if (!userStroke || !templateStroke || userStroke.length < 2 || templateStroke.length < 2) continue;

    const userStart = userStroke[0];
    const userEnd = userStroke[userStroke.length - 1];
    const templateStart = templateStroke[0];
    const templateEnd = templateStroke[templateStroke.length - 1];
    const userLength = distance(userStart, userEnd);
    const templateLength = distance(templateStart, templateEnd);
    if (userLength === 0 || templateLength === 0) continue;

    const dot = ((userEnd.x - userStart.x) * (templateEnd.x - templateStart.x)
      + (userEnd.y - userStart.y) * (templateEnd.y - templateStart.y)) / (userLength * templateLength);
    total += (Math.max(-1, Math.min(1, dot)) + 1) / 2;
  }
  return total / strokeCount;
}

export function starsForScore(score: number): ScoreResult["stars"] {
  if (score >= STAR_THRESHOLDS.three) return 3;
  if (score >= STAR_THRESHOLDS.two) return 2;
  if (score >= STAR_THRESHOLDS.one) return 1;
  return 0;
}

export function scoreAttempt(userStrokes: Strokes, templateStrokes: Strokes, options: ScoreOptions = {}): ScoreResult {
  const tolerance = options.tolerance ?? DEFAULT_TOLERANCE;
  validateTolerance(tolerance);

  // Points share a coordinate system by default; raw canvas coordinates can provide their letter box.
  const normalizedUser = resampleStrokes(options.bounds ? normalizeToBox(userStrokes, options.bounds) : userStrokes, RESAMPLED_POINT_COUNT);
  const normalizedTemplate = resampleStrokes(templateStrokes, RESAMPLED_POINT_COUNT);
  const coverage = coverageScore(normalizedTemplate, normalizedUser, tolerance);
  const precision = precisionScore(normalizedTemplate, normalizedUser, tolerance);
  const direction = options.scoreDirection === false ? 1 : directionScore(normalizedUser, normalizedTemplate);
  const order = options.scoreOrder === false ? 1 : orderScore(normalizedUser, normalizedTemplate);

  // Active weights are normalized so disabled early-level checks do not grant free score.
  const activeWeight = SCORING_WEIGHTS.coverage + SCORING_WEIGHTS.precision
    + (options.scoreDirection === false ? 0 : SCORING_WEIGHTS.direction)
    + (options.scoreOrder === false ? 0 : SCORING_WEIGHTS.order);
  const weighted = coverage * SCORING_WEIGHTS.coverage
    + precision * SCORING_WEIGHTS.precision
    + (options.scoreDirection === false ? 0 : direction * SCORING_WEIGHTS.direction)
    + (options.scoreOrder === false ? 0 : order * SCORING_WEIGHTS.order);
  const score = activeWeight === 0 ? 0 : Math.max(0, Math.min(1, weighted / activeWeight));

  return { coverage, precision, direction, order, score, stars: starsForScore(score) };
}
