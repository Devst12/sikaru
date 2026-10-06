import type { Strokes } from "@/app/engine/geometry/strokes";

export const verticalTemplate: Strokes = [[
  { x: 0.5, y: 0.1 },
  { x: 0.5, y: 0.3 },
  { x: 0.5, y: 0.5 },
  { x: 0.5, y: 0.7 },
  { x: 0.5, y: 0.9 },
]];

export const perfectStroke: Strokes = [[
  { x: 0.5, y: 0.1 },
  { x: 0.5, y: 0.3 },
  { x: 0.5, y: 0.5 },
  { x: 0.5, y: 0.7 },
  { x: 0.5, y: 0.9 },
]];

export const partialStroke: Strokes = [[
  { x: 0.5, y: 0.1 },
  { x: 0.5, y: 0.2 },
]];

export const shakyStroke: Strokes = [[
  { x: 0.54, y: 0.1 },
  { x: 0.53, y: 0.3 },
  { x: 0.54, y: 0.5 },
  { x: 0.53, y: 0.7 },
  { x: 0.54, y: 0.9 },
]];

export const scribble: Strokes = [[
  { x: 0.05, y: 0.1 },
  { x: 0.95, y: 0.9 },
  { x: 0.05, y: 0.9 },
  { x: 0.95, y: 0.1 },
  { x: 0.05, y: 0.1 },
]];

export const reversedStroke: Strokes = [[...perfectStroke[0]].reverse()];

export const orderedPairTemplate: Strokes = [
  [{ x: 0.2, y: 0.15 }, { x: 0.2, y: 0.85 }],
  [{ x: 0.8, y: 0.15 }, { x: 0.8, y: 0.85 }],
];

export const wrongOrderPair: Strokes = [orderedPairTemplate[1], orderedPairTemplate[0]];
