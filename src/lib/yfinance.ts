const YF_BASE = "https://query1.finance.yahoo.com";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

type CacheEntry = { value: unknown; expiresAt: number };

const cache = new Map<string, CacheEntry>();

async function cached<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;

  const value = await fn();
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

async function yfGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${YF_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Yahoo Finance ${res.status} untuk ${path}`);
  }
  return (await res.json()) as T;
}

export type Quote = {
  symbol: string;
  name: string | null;
  price: number | null;
  previousClose: number | null;
  change: number | null;
  changePercent: number | null;
  currency: string | null;
  exchange: string | null;
  marketState: string | null;
};

type YfChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string;
        shortName?: string;
        longName?: string;
        regularMarketPrice?: number;
        chartPreviousClose?: number;
        previousClose?: number;
        currency?: string;
        fullExchangeName?: string;
        exchangeName?: string;
        marketState?: string;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          close?: (number | null)[];
        }>;
      };
    }>;
  };
};

export async function getQuotes(symbols: string[]): Promise<Quote[]> {
  if (symbols.length === 0) return [];
  const unique = [...new Set(symbols.map((s) => s.toUpperCase()))];

  const results = await Promise.all(
    unique.map((symbol) =>
      cached(`quote:${symbol}`, 60_000, async () => {
        try {
          const data = await yfGet<YfChartResponse>(
            `/v8/finance/chart/${encodeURIComponent(symbol)}`,
            { range: "5d", interval: "1d" },
          );
          const meta = data.chart?.result?.[0]?.meta;
          if (!meta) return null;

          const price = meta.regularMarketPrice ?? null;
          const prev = meta.previousClose ?? meta.chartPreviousClose ?? null;
          const change = price !== null && prev !== null ? price - prev : null;
          const changePercent =
            change !== null && prev ? (change / prev) * 100 : null;

          return {
            symbol: meta.symbol ?? symbol,
            name: meta.shortName ?? meta.longName ?? null,
            price,
            previousClose: prev,
            change,
            changePercent,
            currency: meta.currency ?? null,
            exchange: meta.fullExchangeName ?? meta.exchangeName ?? null,
            marketState: meta.marketState ?? null,
          } satisfies Quote;
        } catch {
          return null;
        }
      }),
    ),
  );

  return results.filter((q): q is Quote => q !== null);
}

export type Candle = { date: string; close: number };

export async function getHistory(
  symbol: string,
  range: string = "1y",
  interval: string = "1d",
): Promise<Candle[]> {
  const safeSymbol = encodeURIComponent(symbol.toUpperCase());
  const safeRange = /^[a-z0-9]+$/i.test(range) ? range : "1y";
  const safeInterval = /^[a-z0-9]+$/i.test(interval) ? interval : "1d";

  return cached(`hist:${safeSymbol}:${safeRange}:${safeInterval}`, 300_000, async () => {
    const data = await yfGet<YfChartResponse>(
      `/v8/finance/chart/${safeSymbol}`,
      { range: safeRange, interval: safeInterval },
    );
    const result = data.chart?.result?.[0];
    if (!result) return [];

    const timestamps = result.timestamp ?? [];
    const closes = result.indicators?.quote?.[0]?.close ?? [];
    const candles: Candle[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const close = closes[i];
      if (close == null) continue;
      candles.push({
        date: new Date(timestamps[i] * 1000).toISOString().slice(0, 10),
        close,
      });
    }
    return candles;
  });
}

export type MarketSummary = {
  symbol: string;
  name: string | null;
  price: number | null;
  changePercent: number | null;
};

const INDEX_SYMBOLS = ["^GSPC", "^IXIC", "^DJI", "^VIX"];

export async function getMarketSummary(): Promise<MarketSummary[]> {
  const quotes = await getQuotes(INDEX_SYMBOLS);
  return quotes.map((q) => ({
    symbol: q.symbol,
    name: q.symbol === "^GSPC" ? "S&P 500" :
          q.symbol === "^IXIC" ? "Nasdaq" :
          q.symbol === "^DJI" ? "Dow Jones" :
          q.symbol === "^VIX" ? "Volatility (VIX)" : q.symbol,
    price: q.price,
    changePercent: q.changePercent,
  }));
}
