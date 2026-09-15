import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4">
        <Link href="/" className="text-xl font-black tracking-tight">
          Videq<span className="text-accent">qu</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-muted sm:flex">
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

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              {user.role === "ADMIN" ? (
                <Link href="/admin" className="btn-ghost">
                  Dasbor
                </Link>
              ) : null}
              <span className="hidden text-sm text-muted md:inline">
                {user.name ?? user.email}
              </span>
              <form action={logoutAction}>
                <button type="submit" className="btn-primary">
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Masuk
              </Link>
              <Link href="/register" className="btn-primary">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
