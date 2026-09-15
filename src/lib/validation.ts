import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1).max(80).optional(),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(72),
});

export const articleSchema = z.object({
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().max(300).optional(),
  content: z.string().trim().min(1).max(100_000),
  tags: z.string().trim().optional(),
  published: z.coerce.boolean().optional(),
});

export const instrumentSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .transform((v) => v.toUpperCase()),
  name: z.string().trim().min(1).max(120),
  exchange: z.string().trim().max(60).optional(),
  currency: z.string().trim().max(10).optional(),
  sector: z.string().trim().max(60).optional(),
  note: z.string().trim().max(2000).optional(),
  featured: z.coerce.boolean().optional(),
});

export const videoSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000),
  url: z
    .string()
    .trim()
    .url()
    .max(1000)
    .refine((v) => /^https?:\/\//i.test(v), {
      message: "URL harus menggunakan http atau https.",
    }),
  thumbnailUrl: z
    .union([z.string().trim().url().max(1000), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  duration: z
    .union([z.coerce.number().int().min(0).max(86_400), z.nan()])
    .optional()
    .transform((v) => (Number.isFinite(v) ? v : undefined)),
  published: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
});

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || `artikel-${Date.now().toString(36)}`;
}

export function parseTags(input: string | undefined): string[] {
  if (!input) return [];
  return [
    ...new Set(
      input
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0 && t.length <= 30),
    ),
  ].slice(0, 8);
}
