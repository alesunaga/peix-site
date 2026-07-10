// src/components/site/Footer.tsx
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-sm text-slate-400 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <Sparkles size={14} aria-hidden />
          </span>
          PEIx
        </div>

        <p>Sistema de Gestão do Núcleo de Práticas Inclusivas</p>

        <nav aria-label="Links institucionais" className="flex gap-4">
          <Link href="/politica-de-privacidade" className="hover:text-white">
            Privacidade
          </Link>
          <Link href="/contato" className="hover:text-white">
            Contato
          </Link>
        </nav>
      </div>
    </footer>
  );
}
