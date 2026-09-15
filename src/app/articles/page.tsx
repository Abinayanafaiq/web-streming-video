import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/site-header";
import ArticleCard from "@/components/article-card";

export const dynamic = "force-dynamic";

export default async function ArticlesPage({
  searchParams,
}: PageProps<"/articles">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const tag = typeof params.tag === "string" ? params.tag.trim() : "";

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      ...(tag ? { tags: { has: tag.toLowerCase() } } : {}),
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Publikasi Riset</h1>
            <p className="text-sm text-muted">
              {articles.length} artikel{tag ? ` dengan tag "${tag}"` : ""}
            </p>
          </div>
          <form action="/articles" className="flex w-full gap-2 sm:w-80">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari artikel..."
              className="input"
            />
            <button type="submit" className="btn-primary">
              Cari
            </button>
          </form>
        </div>

        {articles.length === 0 ? (
          <div className="card p-10 text-center text-muted">
            Tidak ada artikel yang cocok.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
