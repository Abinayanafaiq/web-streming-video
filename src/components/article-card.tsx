import Link from "next/link";
import type { ArticleModel } from "@/generated/prisma/models";

export default function ArticleCard({ article }: { article: ArticleModel }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 transition hover:border-accent/60"
    >
      <div className="flex items-center gap-2 text-xs text-muted">
        {date ? <time dateTime={article.publishedAt?.toISOString()}>{date}</time> : null}
        {article.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="font-semibold leading-snug group-hover:text-accent">
        {article.title}
      </h3>
      {article.excerpt ? (
        <p className="line-clamp-3 text-sm text-muted">{article.excerpt}</p>
      ) : null}
      <span className="mt-auto text-xs text-muted">
        {article.views.toLocaleString("id-ID")} dibaca
      </span>
    </Link>
  );
}
