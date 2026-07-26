// src/components/admin/Paginacao.tsx
//
// Paginação simples via query string — sem JS no cliente, funciona com
// Server Components (a página relê `searchParams` a cada navegação).

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Paginacao({
  paginaAtual,
  totalPaginas,
  basePath,
  searchParams,
}: {
  paginaAtual: number;
  totalPaginas: number;
  basePath: string;
  /** Parâmetros a preservar na navegação (ex.: busca, filtro de status) — "pagina" é sobrescrito. */
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPaginas <= 1) return null;

  function hrefParaPagina(pagina: number) {
    const params = new URLSearchParams();
    for (const [chave, valor] of Object.entries(searchParams)) {
      if (valor) params.set(chave, valor);
    }
    params.set("pagina", String(pagina));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
      <span>
        Página {paginaAtual} de {totalPaginas}
      </span>
      <div className="flex gap-2">
        <Link
          href={hrefParaPagina(Math.max(1, paginaAtual - 1))}
          aria-disabled={paginaAtual <= 1}
          className={`flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 ${
            paginaAtual <= 1 ? "pointer-events-none opacity-40" : "hover:bg-white/5"
          }`}
        >
          <ChevronLeft size={14} aria-hidden />
          Anterior
        </Link>
        <Link
          href={hrefParaPagina(Math.min(totalPaginas, paginaAtual + 1))}
          aria-disabled={paginaAtual >= totalPaginas}
          className={`flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 ${
            paginaAtual >= totalPaginas ? "pointer-events-none opacity-40" : "hover:bg-white/5"
          }`}
        >
          Próxima
          <ChevronRight size={14} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
