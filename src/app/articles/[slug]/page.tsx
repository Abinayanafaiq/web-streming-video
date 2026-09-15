import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: { select: { name: true, email: true } } },
  });

  if (!article || !article.published) notFound();

  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  });

  const more = await prisma.article.findMany({
    where: { published: true, id: { not: article.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <article>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
            {article.publishedAt ? (
              <time dateTime={article.publishedAt.toISOString()}>
                {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            ) : null}
            {article.author?.name ? <span>· {article.author.name}</span> : null}
            <span>· {article.views.toLocaleString("id-ID")} dibaca</span>
          </div>

          <h1 className="text-3xl font-black leading-tight">{article.title}</h1>

          {article.excerpt ? (
            <p className="mt-3 text-lg text-muted">{article.excerpt}</p>
          ) : null}

          {article.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/articles?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-foreground"
                >
                  {tag}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="prose-invert mt-8 whitespace-pre-line text-[15px] leading-relaxed">
            {article.content}
          </div>
        </article>

        {more.length > 0 ? (
          <section className="mt-14 border-t border-border pt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Artikel Lainnya
            </h2>
            <ul className="flex flex-col gap-3">
              {more.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/articles/${item.slug}`}
                    className="text-sm font-medium hover:text-accent"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </>
  );
}
