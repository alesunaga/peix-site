// src/app/admin/(painel)/assinantes/page.tsx — RF-ADMIN-03
//
// Listagem dos assinantes da newsletter, com filtro por status
// (pendente / confirmado / descadastrado — double opt-in, RF-BLOG-04).

import Link from "next/link";
import { NewsletterStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Paginacao } from "@/components/admin/Paginacao";
import { NEWSLETTER_STATUS_LABELS } from "@/lib/labels";

const TAMANHO_PAGINA = 25;

const FILTROS: { valor: NewsletterStatus | "TODOS"; label: string }[] = [
  { valor: "TODOS", label: "Todos" },
  { valor: "CONFIRMADO", label: "Confirmados" },
  { valor: "PENDENTE", label: "Pendentes" },
  { valor: "DESCADASTRADO", label: "Descadastrados" },
];

function formatarData(data: Date | null) {
  if (!data) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(data);
}

function badgeClasse(status: NewsletterStatus) {
  switch (status) {
    case "CONFIRMADO":
      return "bg-emerald-500/10 text-emerald-400";
    case "PENDENTE":
      return "bg-amber-500/10 text-amber-400";
    case "DESCADASTRADO":
      return "bg-white/5 text-slate-400";
  }
}

export default async function AdminAssinantesPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const paginaAtual = Math.max(1, Number(sp.pagina) || 1);
  const statusFiltro =
    sp.status && (Object.keys(NewsletterStatus) as string[]).includes(sp.status)
      ? (sp.status as NewsletterStatus)
      : undefined;

  const where: Prisma.NewsletterSubscriberWhereInput = statusFiltro ? { status: statusFiltro } : {};

  const [total, contagens, assinantes] = await Promise.all([
    prisma.newsletterSubscriber.count({ where }),
    prisma.newsletterSubscriber.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { criadoEm: "desc" },
      skip: (paginaAtual - 1) * TAMANHO_PAGINA,
      take: TAMANHO_PAGINA,
    }),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / TAMANHO_PAGINA));
  const totalGeral = contagens.reduce((soma, c) => soma + c._count._all, 0);

  function contagemPara(valor: NewsletterStatus | "TODOS") {
    if (valor === "TODOS") return totalGeral;
    return contagens.find((c) => c.status === valor)?._count._all ?? 0;
  }

  return (
    <div>
      <Eyebrow>Painel Admin</Eyebrow>
      <h1 className="mb-1 text-2xl font-semibold text-white">Assinantes</h1>
      <p className="mb-6 text-sm text-slate-400">
        Assinantes da newsletter do blog, com confirmação double opt-in (RF-BLOG-04).
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTROS.map(({ valor, label }) => {
          const ativo = valor === "TODOS" ? !statusFiltro : statusFiltro === valor;
          const href = valor === "TODOS" ? "/admin/assinantes" : `/admin/assinantes?status=${valor}`;
          return (
            <Link
              key={valor}
              href={href}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                ativo
                  ? "border-indigo-500/40 bg-indigo-600/20 text-indigo-300"
                  : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {label} <span className="text-xs opacity-70">({contagemPara(valor)})</span>
            </Link>
          );
        })}
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Confirmado em</th>
              <th className="px-4 py-3 font-medium">Inscrito em</th>
            </tr>
          </thead>
          <tbody>
            {assinantes.map((assinante) => (
              <tr key={assinante.id} className="border-b border-white/5 text-slate-300 last:border-0">
                <td className="px-4 py-3 text-white">{assinante.nome || "—"}</td>
                <td className="px-4 py-3">{assinante.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${badgeClasse(assinante.status)}`}
                  >
                    {NEWSLETTER_STATUS_LABELS[assinante.status]}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                  {assinante.status === "DESCADASTRADO"
                    ? `Descadastrado em ${formatarData(assinante.descadastradoEm)}`
                    : formatarData(assinante.confirmadoEm)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                  {formatarData(assinante.criadoEm)}
                </td>
              </tr>
            ))}
            {assinantes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Nenhum assinante encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Paginacao
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        basePath="/admin/assinantes"
        searchParams={{ status: statusFiltro }}
      />
    </div>
  );
}
