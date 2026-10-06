export const SCORING_WEIGHTS = {
  coverage: 0.3,
  precision: 0.23,
  direction: 0.25,
  order: 0.22,
} as const;

export const STAR_THRESHOLDS = {
  three: 0.8,
  two: 0.6,
  one: 0.35,
} as const;

export const DEFAULT_TOLERANCE = 0.08;
export const RESAMPLED_POINT_COUNT = 64;

