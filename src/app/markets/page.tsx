import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getQuotes } from "@/lib/yfinance";
import SiteHeader from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const instruments = await prisma.instrument.findMany({
    orderBy: [{ featured: "desc" }, { symbol: "asc" }],
  });

  const quotes = await getQuotes(instruments.map((i) => i.symbol)).catch(() => []);
  const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold">Instrumen Pasar</h1>
        <p className="mb-8 text-sm text-muted">
          Harga ditunda 1 menit, sumber Yahoo Finance. Klik simbol untuk grafik
          dan detail.
        </p>

        {instruments.length === 0 ? (
          <div className="card p-10 text-center text-muted">
            Belum ada instrumen. Admin dapat menambahkannya di dasbor.
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Simbol</th>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 text-right font-medium">Harga</th>
                  <th className="px-4 py-3 text-right font-medium">Perubahan</th>
                  <th className="px-4 py-3 font-medium">Bursa</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((instrument) => {
                  const quote = quoteMap.get(instrument.symbol);
                  const pct = quote?.changePercent ?? null;
                  return (
                    <tr
                      key={instrument.id}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/markets/${instrument.symbol}`}
                          className="font-mono font-semibold hover:text-accent"
                        >
                          {instrument.symbol}
                        </Link>
                        {instrument.featured ? (
                          <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                            unggulan
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {instrument.name}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {quote?.price != null
                          ? quote.price.toLocaleString("id-ID", {
                              maximumFractionDigits: 2,
                            })
                          : "—"}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-mono tabular-nums ${
                          (pct ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {pct != null
                          ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">
                        {instrument.exchange ?? quote?.exchange ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
