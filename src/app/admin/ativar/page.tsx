// src/app/admin/ativar/page.tsx — RF-ADMIN-06
//
// Pública (fora do route group (painel) e liberada no middleware) — quem
// chega aqui ainda não tem sessão.

import { Suspense } from "react";
import type { Metadata } from "next";
import { AtivarContaForm } from "@/components/admin/AtivarContaForm";

export const metadata: Metadata = {
  title: "Ativar conta — Painel Admin | PEIx",
  robots: { index: false, follow: false },
};

export default function AtivarContaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center">
        <p className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
          PEIx — Painel Admin
        </p>
        <Suspense>
          <AtivarContaForm />
        </Suspense>
      </div>
    </main>
  );
}
