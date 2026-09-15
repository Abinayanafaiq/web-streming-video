import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getQuotes } from "@/lib/yfinance";
import SiteHeader from "@/components/site-header";
import { toggleWatchlistAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const items = await prisma.watchlist.findMany({
    where: { userId: user.id },
    include: { instrument: true },
    orderBy: { createdAt: "desc" },
  });

  const quotes = await getQuotes(
    items.map((i) => i.instrument.symbol),
  ).catch(() => []);
  const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold">Watchlist Saya</h1>
        <p className="mb-8 text-sm text-muted">
          Pantau instrumen yang Anda ikuti. Data harga dari Yahoo Finance.
        </p>

        {items.length === 0 ? (
          <div className="card p-10 text-center text-muted">
            Watchlist kosong. Tambahkan instrumen dari{" "}
            <Link href="/markets" className="text-accent hover:underline">
              halaman pasar
            </Link>
            .
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => {
              const quote = quoteMap.get(item.instrument.symbol);
              const pct = quote?.changePercent ?? null;
              return (
                <li
                  key={item.id}
                  className="card flex items-center gap-4 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/markets/${item.instrument.symbol}`}
                      className="font-mono font-semibold hover:text-accent"
                    >
                      {item.instrument.symbol}
                    </a>
                    <p className="truncate text-xs text-muted">
                      {item.instrument.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm tabular-nums">
                      {quote?.price != null
                        ? quote.price.toLocaleString("id-ID", {
                            maximumFractionDigits: 2,
                          })
                        : "—"}
                    </p>
                    <p
                      className={`text-xs tabular-nums ${
                        (pct ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {pct != null
                        ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`
                        : "—"}
                    </p>
                  </div>
                  <form action={toggleWatchlistAction}>
                    <input
                      type="hidden"
                      name="instrumentId"
                      value={item.instrumentId}
                    />
                    <button
                      type="submit"
                      className="btn-ghost text-red-400 hover:bg-red-500/10"
                    >
                      Hapus
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
