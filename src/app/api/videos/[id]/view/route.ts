import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!video) {
    return NextResponse.json({ error: "Video tidak ditemukan." }, { status: 404 });
  }

  await prisma.video.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json({ ok: true });
}
