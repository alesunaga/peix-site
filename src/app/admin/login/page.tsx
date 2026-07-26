// src/app/admin/login/page.tsx — RF-ADMIN-01
//
// Fora do grupo de rotas (painel): não usa o shell autenticado
// (src/app/admin/(painel)/layout.tsx), já que ainda não há sessão aqui.

import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Login — Painel Admin | PEIx",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center">
        <p className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
          PEIx — Painel Admin
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
