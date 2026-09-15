import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 block text-center text-2xl font-black tracking-tight"
        >
          Kuant<span className="text-accent">Riset</span>
        </Link>
        <div className="card p-6">{children}</div>
      </div>
    </div>
  );
}
