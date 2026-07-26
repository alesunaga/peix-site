// src/app/admin/(painel)/layout.tsx
//
// Shell autenticado do Painel Admin. Não se aplica a /admin/login (fora
// deste route group). O middleware (src/middleware.ts) só valida o cookie
// (Edge, sem banco); getAdminAtual() é a checagem autoritativa (status
// ATIVO + revogação por troca de senha — ver src/lib/admin-current.ts).

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

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <AdminNav email={admin.email} />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
