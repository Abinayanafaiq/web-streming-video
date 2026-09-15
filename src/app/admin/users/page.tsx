import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { deleteUserAction, updateUserRoleAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { sessions: true, watchlist: true } },
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Pengguna</h1>
        <p className="text-sm text-muted">
          Kelola peran dan akun. Password disimpan ter-hash (bcrypt) dan tidak
          dapat dilihat oleh siapa pun, termasuk admin.
        </p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Pengguna</th>
              <th className="px-4 py-3 font-medium">Peran</th>
              <th className="px-4 py-3 font-medium">Sesi</th>
              <th className="px-4 py-3 font-medium">Watchlist</th>
              <th className="px-4 py-3 font-medium">Terdaftar</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name ?? "—"}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px]">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{user._count.sessions}</td>
                <td className="px-4 py-3 text-muted">{user._count.watchlist}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(user.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <form action={updateUserRoleAction}>
                      <input type="hidden" name="id" value={user.id} />
                      <input
                        type="hidden"
                        name="role"
                        value={user.role === "ADMIN" ? "USER" : "ADMIN"}
                      />
                      <button type="submit" className="btn-ghost">
                        {user.role === "ADMIN" ? "Jadikan User" : "Jadikan Admin"}
                      </button>
                    </form>
                    <form action={deleteUserAction}>
                      <input type="hidden" name="id" value={user.id} />
                      <button
                        type="submit"
                        className="btn-ghost text-red-400 hover:bg-red-500/10"
                      >
                        Hapus
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
