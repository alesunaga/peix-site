// src/app/admin/(painel)/layout.tsx
//
// Shell autenticado do Painel Admin. Não se aplica a /admin/login (fora
// deste route group). O middleware (src/middleware.ts) já garante sessão
// válida antes de chegar aqui; getAdminAtual() só busca os dados para exibir.

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminAtual } from "@/lib/admin-current";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Painel Admin | PEIx",
  robots: { index: false, follow: false },
};

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminAtual();

  // Defesa extra além do middleware (ex.: admin foi desativado entre o
  // middleware e o carregamento da página).
  if (!admin || admin.status !== "ATIVO") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <AdminNav email={admin.email} />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
