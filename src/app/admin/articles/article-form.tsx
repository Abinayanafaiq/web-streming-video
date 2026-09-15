"use client";

import { useActionState } from "react";
import type { ArticleModel } from "@/generated/prisma/models";
import {
  createArticleAction,
  updateArticleAction,
  type FormState,
} from "../actions";

type Props = {
  article?: ArticleModel;
};

export default function ArticleForm({ article }: Props) {
  const action = article ? updateArticleAction : createArticleAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`title-${article?.id ?? "new"}`} className="text-sm font-medium">
          Judul *
        </label>
        <input
          id={`title-${article?.id ?? "new"}`}
          name="title"
          required
          defaultValue={article?.title}
          className="input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`excerpt-${article?.id ?? "new"}`} className="text-sm font-medium">
          Ringkasan
        </label>
        <textarea
          id={`excerpt-${article?.id ?? "new"}`}
          name="excerpt"
          rows={2}
          defaultValue={article?.excerpt ?? ""}
          className="input resize-y"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`content-${article?.id ?? "new"}`} className="text-sm font-medium">
          Konten *
        </label>
        <textarea
          id={`content-${article?.id ?? "new"}`}
          name="content"
          rows={10}
          required
          defaultValue={article?.content}
          className="input resize-y font-mono text-xs"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`tags-${article?.id ?? "new"}`} className="text-sm font-medium">
          Tag (pisahkan dengan koma)
        </label>
        <input
          id={`tags-${article?.id ?? "new"}`}
          name="tags"
          defaultValue={article?.tags.join(", ")}
          placeholder="statistik, equity, volatilitas"
          className="input"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={article?.published ?? false}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        Terbitkan
      </label>

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
        {pending ? "Menyimpan..." : article ? "Simpan Perubahan" : "Buat Artikel"}
      </button>
    </form>
  );
}
