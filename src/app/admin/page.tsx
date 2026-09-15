import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [articleCount, publishedCount, instrumentCount, userCount, drafts, topArticles] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { published: true } }),
      prisma.instrument.count(),
      prisma.user.count(),
      prisma.article.findMany({
        where: { published: false },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, updatedAt: true },
      }),
      prisma.article.findMany({
        where: { published: true },
        orderBy: { views: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, views: true },
      }),
    ]);

  const stats = [
    { label: "Total Artikel", value: articleCount },
    { label: "Terbit", value: publishedCount },
    { label: "Instrumen", value: instrumentCount },
    { label: "Pengguna", value: userCount },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Ringkasan</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold">
              {stat.value.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 flex items-center justify-between font-semibold">
            Artikel Terpopuler
            <Link href="/admin/articles" className="text-xs text-accent hover:underline">
              Kelola →
            </Link>
          </h2>
          <ul className="flex flex-col gap-3">
            {topArticles.length === 0 ? (
              <li className="text-sm text-muted">Belum ada artikel terbit.</li>
            ) : (
              topArticles.map((article) => (
                <li key={article.id} className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm">{article.title}</span>
                  <span className="shrink-0 text-xs text-muted">
                    {article.views.toLocaleString("id-ID")} dibaca
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-semibold">Draft Belum Terbit</h2>
          <ul className="flex flex-col gap-3">
            {drafts.length === 0 ? (
              <li className="text-sm text-muted">Semua artikel sudah terbit.</li>
            ) : (
              drafts.map((article) => (
                <li key={article.id} className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm">{article.title}</span>
                  <span className="shrink-0 text-xs text-muted">
                    {new Date(article.updatedAt).toLocaleDateString("id-ID")}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
