import Link from "next/link";
import type { VideoModel } from "@/generated/prisma/models";

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return String(views);
}

export default function VideoCard({ video }: { video: VideoModel }) {
  const duration = formatDuration(video.duration);

  return (
    <Link
      href={`/watch/${video.id}`}
      className="group flex flex-col gap-2"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface-2">
        {video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-muted">
            ▶
          </div>
        )}
        {duration ? (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
            {duration}
          </span>
        ) : null}
      </div>
      <div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-[var(--accent)]">
          {video.title}
        </h3>
        <p className="mt-1 text-xs text-muted">
          {formatViews(video.views)} ditonton
        </p>
      </div>
    </Link>
  );
}
