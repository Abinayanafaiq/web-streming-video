"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  articleSchema,
  instrumentSchema,
  parseTags,
  slugify,
  videoSchema,
} from "@/lib/validation";

export type FormState = { error?: string; success?: string } | undefined;

function readArticleForm(formData: FormData) {
  return articleSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    tags: formData.get("tags") || undefined,
    published: formData.get("published") === "on",
  });
}

export async function createArticleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = readArticleForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const slug = `${slugify(parsed.data.title)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  await prisma.article.create({
    data: {
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt ?? null,
      content: parsed.data.content,
      tags: parseTags(parsed.data.tags),
      published: parsed.data.published ?? false,
      publishedAt: parsed.data.published ? new Date() : null,
      authorId: admin.id,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
  return { success: "Artikel berhasil dibuat." };
}

export async function updateArticleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID artikel tidak ditemukan." };

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return { error: "Artikel tidak ditemukan." };

  const parsed = readArticleForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const willPublish = parsed.data.published ?? false;
  await prisma.article.update({
    where: { id },
    data: {
      title: parsed.data.title,
      excerpt: parsed.data.excerpt ?? null,
      content: parsed.data.content,
      tags: parseTags(parsed.data.tags),
      published: willPublish,
      publishedAt:
        willPublish && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
  return { success: "Artikel berhasil diperbarui." };
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
}

function readInstrumentForm(formData: FormData) {
  return instrumentSchema.safeParse({
    symbol: formData.get("symbol"),
    name: formData.get("name"),
    exchange: formData.get("exchange") || undefined,
    currency: formData.get("currency") || undefined,
    sector: formData.get("sector") || undefined,
    note: formData.get("note") || undefined,
    featured: formData.get("featured") === "on",
  });
}

export async function createInstrumentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = readInstrumentForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const existing = await prisma.instrument.findUnique({
    where: { symbol: parsed.data.symbol },
  });
  if (existing) return { error: "Simbol sudah terdaftar." };

  await prisma.instrument.create({ data: parsed.data });
  revalidatePath("/admin/instruments");
  revalidatePath("/markets");
  return { success: `Instrumen ${parsed.data.symbol} ditambahkan.` };
}

export async function updateInstrumentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID instrumen tidak ditemukan." };

  const parsed = readInstrumentForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const clash = await prisma.instrument.findFirst({
    where: { symbol: parsed.data.symbol, id: { not: id } },
  });
  if (clash) return { error: "Simbol sudah dipakai instrumen lain." };

  await prisma.instrument.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/instruments");
  revalidatePath("/markets");
  return { success: "Instrumen diperbarui." };
}

export async function deleteInstrumentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.instrument.delete({ where: { id } });
  revalidatePath("/admin/instruments");
  revalidatePath("/markets");
}

export async function updateUserRoleAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const role = formData.get("role") === "ADMIN" ? "ADMIN" : "USER";
  if (!id || id === admin.id) return;
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || id === admin.id) return;
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

function readVideoForm(formData: FormData) {
  return videoSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    url: formData.get("url"),
    thumbnailUrl: formData.get("thumbnailUrl") || undefined,
    duration: formData.get("duration") || undefined,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  });
}

export async function createVideoAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = readVideoForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  await prisma.video.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      url: parsed.data.url,
      thumbnailUrl: parsed.data.thumbnailUrl ?? null,
      duration: parsed.data.duration ?? null,
      published: parsed.data.published ?? false,
      featured: parsed.data.featured ?? false,
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/");
  return { success: "Video berhasil ditambahkan." };
}

export async function updateVideoAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID video tidak ditemukan." };

  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) return { error: "Video tidak ditemukan." };

  const parsed = readVideoForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  await prisma.video.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      url: parsed.data.url,
      thumbnailUrl: parsed.data.thumbnailUrl ?? null,
      duration: parsed.data.duration ?? null,
      published: parsed.data.published ?? false,
      featured: (parsed.data.featured ?? false) && (parsed.data.published ?? false),
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath(`/watch/${id}`);
  return { success: "Video berhasil diperbarui." };
}

export async function deleteVideoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
  revalidatePath("/");
}
