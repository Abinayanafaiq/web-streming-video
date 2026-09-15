import { prisma } from "@/lib/prisma";
import { deleteVideoAction } from "../actions";
import VideoForm from "./video-form";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Kelola Video</h1>
        <p className="text-sm text-muted">
          Atur judul, deskripsi, dan video yang ditampilkan di beranda.
        </p>
      </div>

      <section className="card p-5">
        <h2 className="mb-4 font-semibold">Video Baru</h2>
        <VideoForm />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Semua Video ({videos.length})</h2>
        {videos.length === 0 ? (
          <div className="card p-8 text-center text-sm text-muted">
            Belum ada video.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className="card flex flex-wrap items-center gap-4 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{video.title}</p>
                  <p className="truncate text-xs text-muted">
                    {video.published ? "Tampil" : "Disembunyikan"}
                    {video.featured ? " · Video utama" : ""} ·{" "}
                    {video.views.toLocaleString("id-ID")} ditonton
                  </p>
                </div>
                <form action={deleteVideoAction}>
                  <input type="hidden" name="id" value={video.id} />
                  <button
                    type="submit"
                    className="btn-ghost text-red-400 hover:bg-red-500/10"
                  >
                    Hapus
                  </button>
                </form>
                <details className="w-full">
                  <summary className="cursor-pointer text-sm text-accent">
                    Edit judul &amp; deskripsi
                  </summary>
                  <div className="mt-4">
                    <VideoForm video={video} />
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
