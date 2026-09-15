import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";

const navItems = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/videos", label: "Video" },
  { href: "/admin/articles", label: "Artikel" },
  { href: "/admin/instruments", label: "Instrumen" },
  { href: "/admin/users", label: "Pengguna" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
        <Link href="/" className="mb-8 text-lg font-black tracking-tight">
          Videq<span className="text-accent">qu</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface-2 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
          <div className="text-xs text-muted">
            Masuk sebagai
            <div className="truncate text-sm text-foreground">{user.email}</div>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="btn-ghost w-full">
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-border px-4 md:hidden">
          <Link href="/admin" className="font-black">
            Admin
          </Link>
          <nav className="ml-auto flex items-center gap-3 text-sm text-muted">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
