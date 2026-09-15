import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import SiteHeader from "@/components/site-header";
import VideoPlayer from "@/components/video-player";
import VideoCard, {
  formatDuration,
  formatViews,
} from "@/components/video-card";

export const dynamic = "force-dynamic";

export default async function WatchPage({
  params,
}: PageProps<"/watch/[id]">) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-16">
          <div className="card w-full max-w-md p-10 text-center">
            <h1 className="text-lg font-semibold">
              Masuk untuk menonton video ini
            </h1>
            <p className="mt-2 text-sm text-muted">
              Buat akun gratis atau masuk untuk mulai menonton.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a href="/register" className="btn-primary w-full">
                Daftar Sekarang
              </a>
              <a href="/login" className="btn-ghost w-full">
                Masuk
              </a>
            </div>
          </div>
        </main>
        <footer className="border-t border-border py-8 text-center text-xs text-muted">
          <p>Videqqu — platform streaming video.</p>
        </footer>
      </>
    );
  }

  const video = await prisma.video.findFirst({
    where: { id, published: true },
  });
  if (!video) notFound();

  await prisma.video.update({
    where: { id: video.id },
    data: { views: { increment: 1 } },
  });

  const more = await prisma.video.findMany({
    where: { published: true, id: { not: video.id } },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const duration = formatDuration(video.duration);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-4">
            <VideoPlayer
              id={video.id}
              src={video.url}
              title={video.title}
              description={video.description}
            />

            <div className="rounded-xl border border-border bg-surface p-4">
              <h1 className="text-lg font-bold leading-snug">{video.title}</h1>
              <p className="mt-1 text-xs text-muted">
                {formatViews(video.views + 1)} ditonton
                {duration ? ` · ${duration}` : ""}
              </p>
              <p className="mt-3 whitespace-pre-line border-t border-border pt-3 text-sm text-muted">
                {video.description}
              </p>
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Video Lainnya
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {more.map((item) => (
                <VideoCard key={item.id} video={item} />
              ))}
            </div>
          </aside>
        </div>
      </main>
      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        <p>Videqqu — platform streaming video.</p>
      </footer>
    </>
  );
}
