import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#0b0b0b]/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0 text-2xl font-black tracking-tight">
          <span className="rounded-md bg-[var(--accent)] px-1.5 py-0.5 text-white">
            Videq
          </span>
          <span className="rounded-md bg-white px-1.5 py-0.5 text-black">
            qu
          </span>
        </Link>

        <form action="/" className="relative ml-2 hidden flex-1 max-w-xl sm:block">
          <input
            type="search"
            name="q"
            placeholder="Cari video..."
            className="w-full rounded-full border border-surface-2 bg-surface py-2 pl-4 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            aria-label="Cari"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-surface-2 px-3 py-1.5 text-sm text-muted transition hover:text-foreground"
          >
            🔍
          </button>
        </form>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              {user.role === "ADMIN" ? (
                <Link href="/admin" className="btn-ghost !py-1.5 text-xs">
                  Dasbor
                </Link>
              ) : null}
              <span className="hidden text-sm text-muted md:inline">
                {user.name ?? user.email}
              </span>
              <form action={logoutAction}>
                <button type="submit" className="btn-primary !py-1.5 text-xs">
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !py-1.5 text-xs">
                Masuk
              </Link>
              <Link href="/register" className="btn-primary !py-1.5 text-xs">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-4 border-t border-border px-4 py-1.5 text-xs text-muted sm:hidden">
        <Link href="/" className="transition hover:text-foreground">
          Beranda
        </Link>
        <Link href="/articles" className="transition hover:text-foreground">
          Riset
        </Link>
        <Link href="/markets" className="transition hover:text-foreground">
          Pasar
        </Link>
        {user ? (
          <Link href="/watchlist" className="transition hover:text-foreground">
            Watchlist
          </Link>
        ) : null}
      </nav>
    </header>
  );
}
