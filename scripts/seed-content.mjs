import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import nextEnv from "@next/env";
import { z } from "zod";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const root = new URL("../", import.meta.url);
const contentFiles = [
  {
    file: "math-counting.json",
    schema: z.object({
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
    }).refine((item) => item.objects.length === item.answer, "Object count must match answer"),
  },
  {
    file: "shape-pairs.json",
    schema: z.object({
      id: z.string().min(1),
      kind: z.literal("shape-pairs"),
      title: z.string().min(1),
      pairs: z.array(z.object({
        id: z.string().min(1),
        shape: z.string().min(1),
        label: z.string().min(1),
      })).min(2),
    }),
  },
  {
    file: "prewriting.json",
    schema: z.object({
      id: z.string().min(1),
      kind: z.literal("prewriting"),
      name: z.string().min(1),
      glyph: z.string().min(1),
      path: z.string().min(1),
      start: z.object({ x: z.number().min(0).max(600), y: z.number().min(0).max(300) }),
      direction: z.string().min(1),
    }),
  },
];
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is required to seed bundled learning content.");
  process.exitCode = 1;
} else {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db().collection("learning_content");
    await collection.createIndex({ kind: 1, id: 1 }, { unique: true, name: "kind_id_unique" });

    let saved = 0;
    for (const { file, schema } of contentFiles) {
      const path = fileURLToPath(new URL(`content/${file}`, root));
      const records = JSON.parse(await readFile(path, "utf8"));
      if (!Array.isArray(records)) throw new Error(`Invalid content records in ${file}`);
      const validRecords = records.map((record) => schema.parse(record));
      if (validRecords.length > 0) {
        const operations = validRecords.map((record) => ({
          updateOne: {
            filter: { kind: record.kind, id: record.id },
            update: { $set: record },
            upsert: true,
          },
        }));
        await collection.bulkWrite(operations);
        saved += validRecords.length;
      }
    }

    console.log(`Learning content seed complete (${saved} bundled records processed).`);
  } catch (error) {
    console.error("Learning content seed failed:", error instanceof Error ? error.name : "UnknownError");
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}
