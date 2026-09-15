import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getHistory, getQuotes } from "@/lib/yfinance";
import SiteHeader from "@/components/site-header";
import Sparkline from "@/components/sparkline";
import { toggleWatchlistAction } from "@/app/watchlist/actions";

export const dynamic = "force-dynamic";

const RANGES = [
  { value: "1mo", label: "1 Bulan" },
  { value: "3mo", label: "3 Bulan" },
  { value: "6mo", label: "6 Bulan" },
  { value: "1y", label: "1 Tahun" },
];

export default async function InstrumentPage({
  params,
  searchParams,
}: PageProps<"/markets/[symbol]">) {
  const { symbol: rawSymbol } = await params;
  const { range } = await searchParams;
  const symbol = decodeURIComponent(rawSymbol).toUpperCase();
  const safeRange = RANGES.some((r) => r.value === range)
    ? (range as string)
    : "6mo";

  const instrument = await prisma.instrument.findUnique({
    where: { symbol },
  });
  if (!instrument) notFound();

  const user = await getCurrentUser();
  const inWatchlist = user
    ? (await prisma.watchlist.findUnique({
        where: {
          userId_instrumentId: { userId: user.id, instrumentId: instrument.id },
        },
      })) !== null
    : false;

  const [quote, history] = await Promise.all([
    getQuotes([symbol]).then((q) => q[0] ?? null).catch(() => null),
    getHistory(symbol, safeRange, "1d").catch(() => []),
  ]);

  const closes = history.map((c) => c.close);
  const first = closes[0];
  const last = closes[closes.length - 1];
  const periodChange =
    first && last && first !== 0 ? ((last - first) / first) * 100 : null;
  const positive = (periodChange ?? 0) >= 0;

  const returns = closes.slice(1).map((c, i) => (c - closes[i]) / closes[i]);
  const mean = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
  const stddev = Math.sqrt(
    returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (returns.length || 1),
  );
  const annualizedVol = stddev * Math.sqrt(252) * 100;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-mono text-3xl font-black">{symbol}</h1>
            <p className="text-muted">
              {instrument.name}
              {instrument.exchange ? ` · ${instrument.exchange}` : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums">
              {quote?.price != null
                ? quote.price.toLocaleString("id-ID", {
                    maximumFractionDigits: 2,
                  })
                : "—"}
            </p>
            <p
              className={`tabular-nums ${
                (quote?.changePercent ?? 0) >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {quote?.changePercent != null
                ? `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}% hari ini`
                : "—"}
            </p>
            {user ? (
              <form action={toggleWatchlistAction} className="mt-2">
                <input type="hidden" name="instrumentId" value={instrument.id} />
                <button
                  type="submit"
                  className={inWatchlist ? "btn-ghost" : "btn-primary"}
                >
                  {inWatchlist ? "Hapus dari Watchlist" : "+ Watchlist"}
                </button>
              </form>
            ) : null}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted">
              Periode {safeRange}:{" "}
              <span className={positive ? "text-emerald-400" : "text-red-400"}>
                {periodChange != null
                  ? `${positive ? "+" : ""}${periodChange.toFixed(2)}%`
                  : "—"}
              </span>
              <span className="ml-4">
                Volatilitas tahunan (perkiraan):{" "}
                {isFinite(annualizedVol) ? `${annualizedVol.toFixed(1)}%` : "—"}
              </span>
            </div>
            <nav className="flex gap-2">
              {RANGES.map((r) => (
                <Link
                  key={r.value}
                  href={`/markets/${symbol}?range=${r.value}`}
                  className={`rounded-lg px-3 py-1 text-xs transition ${
                    r.value === safeRange
                      ? "bg-accent text-white"
                      : "border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {r.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="rounded-xl bg-surface-2 p-4">
            {closes.length > 1 ? (
              <Sparkline closes={closes} positive={positive} />
            ) : (
              <p className="py-10 text-center text-sm text-muted">
                Data historis tidak tersedia.
              </p>
            )}
          </div>

          <p className="mt-3 text-xs text-muted">
            Statistik berbasis harga penutupan historis, bersifat informatif.
            Bukan rekomendasi investasi.
          </p>
        </div>

        {instrument.note ? (
          <div className="card mt-6 p-5">
            <h2 className="mb-2 font-semibold">Catatan Riset</h2>
            <p className="whitespace-pre-line text-sm text-muted">
              {instrument.note}
            </p>
          </div>
        ) : null}
      </main>
    </>
  );
}
