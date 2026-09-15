import { prisma } from "@/lib/prisma";
import { deleteInstrumentAction } from "../actions";
import InstrumentForm from "./instrument-form";

export const dynamic = "force-dynamic";

export default async function AdminInstrumentsPage() {
  const instruments = await prisma.instrument.findMany({
    orderBy: { symbol: "asc" },
    include: { _count: { select: { watchlistedBy: true } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Kelola Instrumen</h1>
        <p className="text-sm text-muted">
          Daftar simbol yang tampil di halaman pasar. Harga diambil live dari
          Yahoo Finance.
        </p>
      </div>

      <section className="card p-5">
        <h2 className="mb-4 font-semibold">Instrumen Baru</h2>
        <InstrumentForm />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Semua Instrumen ({instruments.length})</h2>
        {instruments.length === 0 ? (
          <div className="card p-8 text-center text-sm text-muted">
            Belum ada instrumen.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {instruments.map((instrument) => (
              <div
                key={instrument.id}
                className="card flex flex-wrap items-center gap-4 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono font-semibold">
                    {instrument.symbol}
                    {instrument.featured ? (
                      <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                        unggulan
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {instrument.name} ·{" "}
                    {instrument._count.watchlistedBy} di watchlist
                  </p>
                </div>
                <form action={deleteInstrumentAction}>
                  <input type="hidden" name="id" value={instrument.id} />
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
                    <InstrumentForm instrument={instrument} />
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
