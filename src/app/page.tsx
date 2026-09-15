import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/site-header";
import VideoCard from "@/components/video-card";

export const dynamic = "force-dynamic";

type HomeSearchParams = { q?: string | string[] };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const videos = await prisma.video.findMany({
    where: {
      published: true,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {query ? (
          <p className="mb-4 text-sm text-muted">
            Hasil untuk{" "}
            <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>{" "}
            — {videos.length} video
          </p>
        ) : null}

        {videos.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-lg font-semibold">
              {query ? "Tidak ada video ditemukan" : "Belum ada video"}
            </p>
            <p className="mt-2 text-sm text-muted">
              {query
                ? "Coba kata kunci lain."
                : "Video yang ditambahkan admin akan muncul di sini."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
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
