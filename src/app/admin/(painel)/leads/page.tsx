// src/app/admin/(painel)/leads/page.tsx — RF-ADMIN-02
//
// Listagem dos leads recebidos pelo formulário de Contato e pelo
// Diagnóstico de Conformidade, com busca e exportação em CSV.

import Link from "next/link";
import { Download } from "lucide-react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Paginacao } from "@/components/admin/Paginacao";
import { CARGO_LABELS, LEAD_ORIGEM_LABELS } from "@/lib/labels";

const TAMANHO_PAGINA = 25;

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(data);
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const paginaAtual = Math.max(1, Number(sp.pagina) || 1);

  const where: Prisma.LeadWhereInput = q
    ? {
        OR: [
          { nome: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { instituicao: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { criadoEm: "desc" },
      skip: (paginaAtual - 1) * TAMANHO_PAGINA,
      take: TAMANHO_PAGINA,
    }),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / TAMANHO_PAGINA));
  const exportHref = q ? `/api/admin/leads/export?q=${encodeURIComponent(q)}` : "/api/admin/leads/export";

  return (
    <div>
      <Eyebrow>Painel Admin</Eyebrow>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-semibold text-white">Leads</h1>
          <p className="text-sm text-slate-400">
            {total} lead{total === 1 ? "" : "s"} recebido{total === 1 ? "" : "s"} pelo Contato e pelo
            Diagnóstico de Conformidade.
          </p>
        </div>
        <Link
          href={exportHref}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
        >
          <Download size={16} aria-hidden />
          Exportar CSV
        </Link>
      </div>

      <form method="get" className="mb-4 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome, e-mail ou instituição..."
          className="input max-w-sm"
        />
        <button
          type="submit"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
        >
          Buscar
        </button>
        {q && (
          <Link
            href="/admin/leads"
            className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-slate-200"
          >
            Limpar
          </Link>
        )}
      </form>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Contato</th>
              <th className="px-4 py-3 font-medium">Instituição</th>
              <th className="px-4 py-3 font-medium">Cargo</th>
              <th className="px-4 py-3 font-medium">Origem</th>
              <th className="px-4 py-3 font-medium">Demo</th>
              <th className="px-4 py-3 font-medium">Recebido em</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-white/5 text-slate-300 last:border-0">
                <td className="px-4 py-3 text-white">{lead.nome}</td>
                <td className="px-4 py-3">
                  <p>{lead.email}</p>
                  {lead.telefone && <p className="text-xs text-slate-500">{lead.telefone}</p>}
                </td>
                <td className="px-4 py-3">
                  <p>{lead.instituicao || "—"}</p>
                  {(lead.cidade || lead.uf) && (
                    <p className="text-xs text-slate-500">
                      {[lead.cidade, lead.uf].filter(Boolean).join(" / ")}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">{lead.cargo ? CARGO_LABELS[lead.cargo] : "—"}</td>
                <td className="px-4 py-3">{LEAD_ORIGEM_LABELS[lead.origem] ?? lead.origem}</td>
                <td className="px-4 py-3">{lead.querDemo ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                  {formatarData(lead.criadoEm)}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Nenhum lead encontrado{q ? ` para "${q}"` : ""}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Paginacao
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        basePath="/admin/leads"
        searchParams={{ q }}
      />
    </div>
  );
}
