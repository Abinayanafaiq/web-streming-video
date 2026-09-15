"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function toggleWatchlistAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const instrumentId = String(formData.get("instrumentId") ?? "");
  if (!instrumentId) return;

  const existing = await prisma.watchlist.findUnique({
    where: {
      userId_instrumentId: {
        userId: user.id,
        instrumentId,
      },
    },
  });

  if (existing) {
    await prisma.watchlist.delete({ where: { id: existing.id } });
  } else {
    await prisma.watchlist.create({
      data: { userId: user.id, instrumentId },
    });
  }

  revalidatePath("/watchlist");
  revalidatePath("/markets");
}
