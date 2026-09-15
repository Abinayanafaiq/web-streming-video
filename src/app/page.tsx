import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/site-header";
import VideoCard from "@/components/video-card";
import VideoPlayer from "@/components/video-player";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: PageProps<"/">) {
  const { v } = await searchParams;
  const selectedId = typeof v === "string" ? v : undefined;

  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const active =
    videos.find((video) => video.id === selectedId) ?? videos[0] ?? null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        {videos.length === 0 || !active ? (
          <div className="card p-10 text-center">
            <p className="text-lg font-semibold">Belum ada video</p>
            <p className="mt-2 text-sm text-muted">
              Video yang ditambahkan admin akan muncul di sini.
            </p>
            <Link href="/login" className="btn-primary mt-6 inline-flex">
              Masuk sebagai Admin
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-4">
              <VideoPlayer
                id={active.id}
                src={active.url}
                title={active.title}
                description={active.description}
              />
            </div>

            <aside className="flex flex-col gap-3">
              <h2 className="font-semibold">Video Lainnya</h2>
              <div className="flex flex-col gap-3">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} active={video.id === active.id} />
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>
      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        <p>
          Videqqu — platform streaming video. Kelola konten melalui dasbor
          admin.
        </p>
      </footer>
    </>
  );
}
