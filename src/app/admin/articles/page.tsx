import { prisma } from "@/lib/prisma";
import { deleteArticleAction } from "../actions";
import ArticleForm from "./article-form";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Kelola Artikel</h1>
        <p className="text-sm text-muted">
          Tulis dan publikasikan riset kuantitatif.
        </p>
      </div>

      <section className="card p-5">
        <h2 className="mb-4 font-semibold">Artikel Baru</h2>
        <ArticleForm />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Semua Artikel ({articles.length})</h2>
        {articles.length === 0 ? (
          <div className="card p-8 text-center text-sm text-muted">
            Belum ada artikel.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {articles.map((article) => (
              <div
                key={article.id}
                className="card flex flex-wrap items-center gap-4 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{article.title}</p>
                  <p className="text-xs text-muted">
                    {article.published ? "Terbit" : "Draft"} ·{" "}
                    {article.views.toLocaleString("id-ID")} dibaca ·{" "}
                    {article.tags.join(", ") || "tanpa tag"}
                  </p>
                </div>
                <form action={deleteArticleAction}>
                  <input type="hidden" name="id" value={article.id} />
                  <button
                    type="submit"
                    className="btn-ghost text-red-400 hover:bg-red-500/10"
                  >
                    Hapus
                  </button>
                </form>
                <details className="w-full">
                  <summary className="cursor-pointer text-sm text-accent">
                    Edit
                  </summary>
                  <div className="mt-4">
                    <ArticleForm article={article} />
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
