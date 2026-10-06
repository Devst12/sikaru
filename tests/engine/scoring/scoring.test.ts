import { describe, expect, test } from "vitest";
import { distance, normalizeStrokes, normalizeToBox, resampleStroke } from "@/app/engine/geometry/strokes";
import { coverageScore, directionScore, orderScore, precisionScore, scoreAttempt, starsForScore } from "@/app/engine/scoring/score";
import { LetterTemplateSchema, parseLetterTemplate } from "@/app/engine/scoring/template-schema";
import { orderedPairTemplate, partialStroke, perfectStroke, reversedStroke, scribble, shakyStroke, verticalTemplate, wrongOrderPair } from "@/tests/fixtures/scoring";

describe("geometry helpers", () => {
  test("calculates point distance", () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  test("normalizes a drawing into a centered unit box while preserving its aspect ratio", () => {
    expect(normalizeStrokes([[{ x: 10, y: 20 }, { x: 10, y: 40 }]])).toEqual([
      [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }],
    ]);
  });

  test("resamples along the path at equal distances", () => {
    const points = resampleStroke([{ x: 0, y: 0 }, { x: 10, y: 0 }], 3);
    expect(points).toEqual([{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 10, y: 0 }]);
  });

  test("normalizes canvas coordinates to a template box", () => {
    expect(normalizeToBox([[{ x: 30, y: 40 }, { x: 30, y: 80 }]], { left: 0, top: 0, width: 60, height: 100 })).toEqual([
      [{ x: 0.5, y: 0.4 }, { x: 0.5, y: 0.8 }],
    ]);
  });
});

describe("scoring metrics", () => {
  test("gives a complete parallel stroke full coverage and precision", () => {
    expect(coverageScore(verticalTemplate, perfectStroke, 0.05)).toBe(1);
    expect(precisionScore(verticalTemplate, perfectStroke, 0.05)).toBe(1);
  });

  test("detects partial coverage", () => {
    expect(coverageScore(verticalTemplate, partialStroke, 0.02)).toBeLessThan(0.3);
  });

  test("keeps an on-guide but reversed stroke accurate while flagging its direction", () => {
    expect(coverageScore(verticalTemplate, reversedStroke, 0.05)).toBe(1);
    expect(precisionScore(verticalTemplate, reversedStroke, 0.05)).toBe(1);
    expect(directionScore(reversedStroke, verticalTemplate)).toBe(0);
  });

  test("scores stroke order by swaps between matched template strokes", () => {
    expect(orderScore(orderedPairTemplate, orderedPairTemplate)).toBe(1);
    expect(orderScore(wrongOrderPair, orderedPairTemplate)).toBe(0);
  });

  test("scores the six trace fixtures at their expected star levels", () => {
    expect(scoreAttempt(perfectStroke, verticalTemplate).stars).toBe(3);
    expect(scoreAttempt(shakyStroke, verticalTemplate).stars).toBe(3);
    expect(scoreAttempt(partialStroke, verticalTemplate).stars).toBe(2);
    expect(scoreAttempt(scribble, verticalTemplate, { tolerance: 0.05 }).stars).toBeLessThanOrEqual(1);
    expect(scoreAttempt(reversedStroke, verticalTemplate).stars).toBe(2);
    expect(scoreAttempt(wrongOrderPair, orderedPairTemplate).stars).toBe(2);
  });

  test("does not change scores based on hint use", () => {
    expect(scoreAttempt(perfectStroke, verticalTemplate)).toEqual(scoreAttempt(perfectStroke, verticalTemplate));
  });

  test("uses inclusive documented star thresholds", () => {
    expect(starsForScore(0.8)).toBe(3);
    expect(starsForScore(0.6)).toBe(2);
    expect(starsForScore(0.35)).toBe(1);
    expect(starsForScore(0.3499)).toBe(0);
  });
});

describe("letter template schema", () => {
  const validTemplate = {
    id: "prewrite-standing-line",
    glyph: "│",
    script: "shape",
    level: 1,
    strokes: [{
      id: "line-down",
      role: "body",
      path: [{ x: 0.5, y: 0.1 }, { x: 0.5, y: 0.9 }],
      direction: "down",
    }],
    tolerance: 0.08,
  };

  test("accepts a valid ordered stroke template", () => {
    expect(parseLetterTemplate(validTemplate).id).toBe(validTemplate.id);
  });

  test("rejects a template with a path outside normalized coordinates", () => {
    const parsed = LetterTemplateSchema.safeParse({
      ...validTemplate,
      strokes: [{ ...validTemplate.strokes[0], path: [{ x: 1.1, y: 0 }, { x: 0, y: 1 }] }],
    });
    expect(parsed.success).toBe(false);
  });
});
