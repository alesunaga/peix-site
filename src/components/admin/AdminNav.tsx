"use client";

// src/components/admin/AdminNav.tsx
//
// Navegação do shell do Painel Admin. Os itens ainda não implementados
// ficam visíveis (mesmo espírito da decisão "Blog: Em breve" da navbar
// pública — não esconder o que está no roadmap) mas o conteúdo de cada
// página placeholder já avisa que está em construção.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Users, Mail, UserCog, LayoutDashboard, LogOut } from "lucide-react";

const ITENS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/assinantes", label: "Assinantes", icon: Mail },
  { href: "/admin/usuarios", label: "Usuários", icon: UserCog },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-white/10 bg-white/[0.03] sm:w-60 sm:border-r">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">PEIx</p>
        <p className="text-sm text-slate-300">Painel Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {ITENS.map(({ href, label, icon: Icon }) => {
          const ativo = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                ativo
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <p className="mb-2 truncate px-3 text-xs text-slate-500">{email}</p>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut size={16} aria-hidden />
          Sair
        </button>
      </div>
    </aside>
  );
}
