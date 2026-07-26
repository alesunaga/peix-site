// src/app/admin/esqueci-senha/page.tsx — RF-ADMIN-08
import type { Metadata } from "next";
import { EsqueciSenhaForm } from "@/components/admin/EsqueciSenhaForm";

export const metadata: Metadata = {
  title: "Esqueci minha senha — Painel Admin | PEIx",
  robots: { index: false, follow: false },
};

export default function EsqueciSenhaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center">
        <p className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
          PEIx — Painel Admin
        </p>
        <EsqueciSenhaForm />
      </div>
    </main>
  );
}
