import { z } from "zod";

const NormalizedPointSchema = z.object({
  x: z.number().finite().min(0).max(1),
  y: z.number().finite().min(0).max(1),
});

const StrokeTemplateSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  path: z.array(NormalizedPointSchema).min(2),
  direction: z.enum(["up", "down", "left", "right", "up-right", "up-left", "down-left", "down-right", "clockwise", "counter-clockwise"]),
});

export const LetterTemplateSchema = z.object({
  id: z.string().min(1),
  glyph: z.string().min(1),
  script: z.enum(["devanagari", "latin", "digit", "shape"]),
  level: z.number().int().positive(),
  strokes: z.array(StrokeTemplateSchema).min(1),
  tolerance: z.number().finite().min(0).max(1),
  scoreDirection: z.boolean().optional(),
  scoreOrder: z.boolean().optional(),
});

export type LetterTemplate = z.infer<typeof LetterTemplateSchema>;

export function parseLetterTemplate(content: unknown): LetterTemplate {
  return LetterTemplateSchema.parse(content);
}
