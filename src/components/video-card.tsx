import Link from "next/link";
import type { VideoModel } from "@/generated/prisma/models";

type Props = {
  video: VideoModel;
  active?: boolean;
};

export default function VideoCard({ video, active }: Props) {
  return (
    <Link
      href={`/?v=${video.id}`}
      className={`group flex gap-3 rounded-xl border p-3 transition ${
        active
          ? "border-accent bg-surface"
          : "border-border bg-surface hover:border-accent/60"
      }`}
    >
      <div className="flex aspect-video w-32 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-xs text-muted">
        ▶
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-medium leading-snug group-hover:text-accent">
          {video.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted">
          {video.description}
        </p>
        <p className="mt-1 text-xs text-muted">
          {video.views.toLocaleString("id-ID")} ditonton
        </p>
      </div>
    </Link>
  );
}
