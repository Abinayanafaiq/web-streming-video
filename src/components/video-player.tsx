"use client";

import { useEffect, useRef } from "react";

type Props = {
  id: string;
  src: string;
  title: string;
  description: string;
};

export default function VideoPlayer({ id, src, title, description }: Props) {
  const countedRef = useRef<string | null>(null);

  useEffect(() => {
    countedRef.current = null;
  }, [id]);

  function handlePlay() {
    if (countedRef.current === id) return;
    countedRef.current = id;
    fetch(`/api/videos/${id}/view`, { method: "POST" }).catch(() => {});
  }

  const isEmbed = !/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-border bg-black">
        {isEmbed ? (
          <iframe
            key={id}
            src={src}
            title={title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            key={id}
            src={src}
            controls
            playsInline
            onPlay={handlePlay}
            className="aspect-video w-full"
          />
        )}
      </div>

      <div>
        <h1 className="text-xl font-bold leading-snug">{title}</h1>
        <p className="mt-2 whitespace-pre-line text-sm text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
