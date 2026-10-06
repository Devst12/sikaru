import { NextRequest } from "next/server";
import { z } from "zod";
import bundledCounting from "@/content/math-counting.json";
import bundledShapes from "@/content/shape-pairs.json";
import bundledPrewriting from "@/content/prewriting.json";
import { getMongoClient } from "@/server/mongo/client";

const ContentKindSchema = z.enum(["shape-pairs", "prewriting", "math-counting"]);

const ShapePairsSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("shape-pairs"),
  title: z.string().min(1),
  pairs: z.array(z.object({
    id: z.string().min(1),
    shape: z.string().min(1),
    label: z.string().min(1),
  })).min(2),
});

const PrewritingSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("prewriting"),
  name: z.string().min(1),
  glyph: z.string().min(1),
  path: z.string().min(1),
  start: z.object({ x: z.number().min(0).max(600), y: z.number().min(0).max(300) }),
  direction: z.string().min(1),
});

const MathCountingSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("math-counting"),
  title: z.string().min(1),
  question: z.string().min(1),
  answer: z.number().int().min(1).max(5),
  objects: z.array(z.object({
    id: z.string().min(1),
    icon: z.string().min(1),
    name: z.string().min(1),
  })).min(1).max(5),
}).refine((item) => item.objects.length === item.answer, "Counting lesson object count must match its answer.");

const validators = {
  "shape-pairs": ShapePairsSchema,
  prewriting: PrewritingSchema,
  "math-counting": MathCountingSchema,
} as const;

const bundledContent = {
  "shape-pairs": bundledShapes,
  prewriting: bundledPrewriting,
  "math-counting": bundledCounting,
} as const;

function describeSafeError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown database error";
  const uri = process.env.MONGODB_URI;
  return uri
    ? message.replaceAll(uri, "[redacted]").replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, "mongodb://[redacted]")
    : message.replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, "mongodb://[redacted]");
}

export async function GET(request: NextRequest) {
  const parsedKind = ContentKindSchema.safeParse(request.nextUrl.searchParams.get("kind"));
  if (!parsedKind.success) {
    return Response.json({ error: "Choose shape-pairs or prewriting content." }, { status: 400 });
  }

  const kind = parsedKind.data;
  const validator = validators[kind];

  try {
    const mongoClient = await getMongoClient();
    const records = await mongoClient
      .db()
      .collection("learning_content")
      .find({ kind }, { projection: { _id: 0 } })
      .toArray();

    if (records.length === 0) {
      const items = z.array(validator).parse(bundledContent[kind]);
      return Response.json({ items, source: "bundled" });
    }

    const items = z.array(validator).parse(records);
    return Response.json({ items, source: "mongodb" });
  } catch (error) {
    console.error("[api/content] Using bundled content after MongoDB read failed", describeSafeError(error));
    const items = z.array(validator).parse(bundledContent[kind]);
    return Response.json({ items, source: "bundled" });
  }
}
