import { RESAMPLED_POINT_COUNT } from "../scoring/constants";

export type Point = { x: number; y: number };
export type Stroke = Point[];
export type Strokes = Stroke[];
export type Box = { left: number; top: number; width: number; height: number };

export function distance(first: Point, second: Point): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

export function normalizeStrokes(strokes: Strokes): Strokes {
  const points = strokes.flat();
  if (points.length === 0) return [];

  const bounds = points.reduce((box, point) => ({
    minX: Math.min(box.minX, point.x),
    minY: Math.min(box.minY, point.y),
    maxX: Math.max(box.maxX, point.x),
    maxY: Math.max(box.maxY, point.y),
  }), {
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  });
  const size = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

  if (size === 0) {
    return strokes.map((stroke) => stroke.map(() => ({ x: 0.5, y: 0.5 })));
  }

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const horizontalInset = (size - width) / 2;
  const verticalInset = (size - height) / 2;

  return strokes.map((stroke) => stroke.map((point) => ({
    x: (point.x - bounds.minX + horizontalInset) / size,
    y: (point.y - bounds.minY + verticalInset) / size,
  })));
}

export function normalizeToBox(strokes: Strokes, box: Box): Strokes {
  if (!Number.isFinite(box.width) || !Number.isFinite(box.height) || box.width <= 0 || box.height <= 0) {
    throw new RangeError("The template box must have positive width and height.");
  }
  return strokes.map((stroke) => stroke.map((point) => ({
    x: (point.x - box.left) / box.width,
    y: (point.y - box.top) / box.height,
  })));
}

export function resampleStroke(stroke: Stroke, count = RESAMPLED_POINT_COUNT): Stroke {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("The resampled point count must be a positive integer.");
  }
  if (stroke.length === 0) return [];
  if (count === 1 || stroke.length === 1) return Array.from({ length: count }, () => ({ ...stroke[0] }));

  const segmentLengths = stroke.slice(1).map((point, index) => distance(stroke[index], point));
  const pathLength = segmentLengths.reduce((total, segmentLength) => total + segmentLength, 0);
  if (pathLength === 0) return Array.from({ length: count }, () => ({ ...stroke[0] }));

  const cumulativeLengths = [0];
  for (const segmentLength of segmentLengths) {
    cumulativeLengths.push(cumulativeLengths[cumulativeLengths.length - 1] + segmentLength);
  }

  return Array.from({ length: count }, (_, index) => {
    if (index === count - 1) return { ...stroke[stroke.length - 1] };
    const targetLength = pathLength * index / (count - 1);
    const nextPointIndex = cumulativeLengths.findIndex((length) => length >= targetLength);
    const endIndex = Math.max(1, nextPointIndex);
    const startLength = cumulativeLengths[endIndex - 1];
    const segmentLength = segmentLengths[endIndex - 1];
    const ratio = segmentLength === 0 ? 0 : (targetLength - startLength) / segmentLength;
    const start = stroke[endIndex - 1];
    const end = stroke[endIndex];
    return {
      x: start.x + (end.x - start.x) * ratio,
      y: start.y + (end.y - start.y) * ratio,
    };
  });
}

export function resampleStrokes(strokes: Strokes, count = RESAMPLED_POINT_COUNT): Strokes {
  return strokes.map((stroke) => resampleStroke(stroke, count));
}
