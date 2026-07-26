// src/app/admin/resetar-senha/page.tsx — RF-ADMIN-08
import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetarSenhaForm } from "@/components/admin/ResetarSenhaForm";

export const metadata: Metadata = {
  title: "Redefinir senha — Painel Admin | PEIx",
  robots: { index: false, follow: false },
};

export default function ResetarSenhaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center">
        <p className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
          PEIx — Painel Admin
        </p>
        <Suspense>
          <ResetarSenhaForm />
        </Suspense>
      </div>
    </main>
  );
}
