import "server-only";
import { z } from "zod";

const EnvironmentSchema = z.object({
  MONGODB_URI: z.string().min(1).refine(
    (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
    "must be a MongoDB connection URI",
  ).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),
}).superRefine((value, context) => {
  if (Boolean(value.NEXT_PUBLIC_SUPABASE_URL) !== Boolean(value.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    context.addIssue({ code: "custom", message: "Configure both Supabase URL and anon key together." });
  }
  if (Boolean(value.DATABASE_URL) !== Boolean(value.DIRECT_URL)) {
    context.addIssue({ code: "custom", message: "Configure both pooled and direct database URLs together." });
  }
});

const parsedEnvironment = EnvironmentSchema.safeParse(process.env);
if (!parsedEnvironment.success) {
  const invalidNames = parsedEnvironment.error.issues
    .flatMap((issue) => issue.path)
    .filter((part): part is string => typeof part === "string");
  throw new Error(`Invalid environment configuration: ${[...new Set(invalidNames)].join(", ") || "Supabase/database variables must be configured in pairs"}.`);
}

export const env = parsedEnvironment.data;

export function requireMongoUri(): string {
  if (!env.MONGODB_URI) throw new Error("MONGODB_URI is required for learning content.");
  return env.MONGODB_URI;
}

export function requireSupabaseCredentials(): { url: string; anonKey: string; databaseUrl: string; directUrl: string } {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !env.DATABASE_URL || !env.DIRECT_URL) {
    throw new Error("Supabase URL, anon key, pooled DATABASE_URL, and DIRECT_URL are required for account and progress features.");
  }
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    databaseUrl: env.DATABASE_URL,
    directUrl: env.DIRECT_URL,
  };
}
