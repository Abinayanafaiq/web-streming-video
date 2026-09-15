"use client";

import { useActionState } from "react";
import type { VideoModel } from "@/generated/prisma/models";
import {
  createVideoAction,
  updateVideoAction,
  type FormState,
} from "../actions";

type Props = {
  video?: VideoModel;
};

export default function VideoForm({ video }: Props) {
  const action = video ? updateVideoAction : createVideoAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {video ? <input type="hidden" name="id" value={video.id} /> : null}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`video-title-${video?.id ?? "new"}`}
          className="text-sm font-medium"
        >
          Judul Video *
        </label>
        <input
          id={`video-title-${video?.id ?? "new"}`}
          name="title"
          required
          maxLength={200}
          defaultValue={video?.title}
          placeholder="Judul yang tampil pada pemutar video"
          className="input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`video-description-${video?.id ?? "new"}`}
          className="text-sm font-medium"
        >
          Deskripsi *
        </label>
        <textarea
          id={`video-description-${video?.id ?? "new"}`}
          name="description"
          rows={4}
          maxLength={2000}
          defaultValue={video?.description}
          placeholder="Deskripsi video yang ditampilkan di bawah pemutar"
          className="input resize-y"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`video-url-${video?.id ?? "new"}`}
          className="text-sm font-medium"
        >
          URL Video (mp4 atau embed) *
        </label>
        <input
          id={`video-url-${video?.id ?? "new"}`}
          name="url"
          type="url"
          required
          defaultValue={video?.url}
          placeholder="https://contoh.com/video.mp4"
          className="input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`video-thumbnail-${video?.id ?? "new"}`}
            className="text-sm font-medium"
          >
            URL Thumbnail
          </label>
          <input
            id={`video-thumbnail-${video?.id ?? "new"}`}
            name="thumbnailUrl"
            type="url"
            defaultValue={video?.thumbnailUrl ?? ""}
            placeholder="https://contoh.com/gambar.jpg"
            className="input"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`video-duration-${video?.id ?? "new"}`}
            className="text-sm font-medium"
          >
            Durasi (detik)
          </label>
          <input
            id={`video-duration-${video?.id ?? "new"}`}
            name="duration"
            type="number"
            min={0}
            defaultValue={video?.duration ?? ""}
            placeholder="596"
            className="input"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={video?.published ?? false}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Tampilkan (publik)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={video?.featured ?? false}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Jadi video utama
        </label>
      </div>

      {state?.error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          {state.success}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary self-start">
        {pending ? "Menyimpan..." : video ? "Simpan Perubahan" : "Tambah Video"}
      </button>
    </form>
  );
}
