// src/app/admin/(painel)/posts/page.tsx — RF-ADMIN-05
//
// Listagem de posts do blog, com busca, filtro por status e paginação.
// Editor (criar/editar) fica em /admin/posts/novo e /admin/posts/[id].

import Link from "next/link";
import { Plus } from "lucide-react";
import { Prisma, PostStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { Paginacao } from "@/components/admin/Paginacao";
import { PostDeleteButton } from "@/components/admin/PostDeleteButton";
import { POST_CATEGORIA_LABELS, POST_STATUS_LABELS } from "@/lib/labels";

const TAMANHO_PAGINA = 20;

const FILTROS: { valor: PostStatus | "TODOS"; label: string }[] = [
  { valor: "TODOS", label: "Todos" },
  { valor: "RASCUNHO", label: "Rascunho" },
  { valor: "AGENDADO", label: "Agendado" },
  { valor: "PUBLICADO", label: "Publicado" },
];

function formatarData(data: Date | null) {
  if (!data) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(data);
}

function badgeClasse(status: PostStatus) {
  switch (status) {
    case "PUBLICADO":
      return "bg-emerald-500/10 text-emerald-400";
    case "AGENDADO":
      return "bg-indigo-500/10 text-indigo-400";
    default:
      return "bg-amber-500/10 text-amber-400";
  }
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string; q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const paginaAtual = Math.max(1, Number(sp.pagina) || 1);
  const q = (sp.q ?? "").trim();
  const statusFiltro =
    sp.status && (Object.keys(PostStatus) as string[]).includes(sp.status)
      ? (sp.status as PostStatus)
      : undefined;

  const where: Prisma.PostWhereInput = {
    ...(statusFiltro ? { status: statusFiltro } : {}),
    ...(q ? { titulo: { contains: q, mode: "insensitive" } } : {}),
  };

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { criadoEm: "desc" },
      skip: (paginaAtual - 1) * TAMANHO_PAGINA,
      take: TAMANHO_PAGINA,
      include: { autor: { select: { email: true } } },
    }),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / TAMANHO_PAGINA));

  return (
    <div>
      <Eyebrow>Painel Admin</Eyebrow>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-semibold text-white">Posts</h1>
          <p className="text-sm text-slate-400">
            {total} post{total === 1 ? "" : "s"}.
          </p>
        </div>
        <ButtonLink href="/admin/posts/novo" withArrow={false}>
          <Plus size={16} aria-hidden />
          Novo post
        </ButtonLink>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTROS.map(({ valor, label }) => {
            const ativo = valor === "TODOS" ? !statusFiltro : statusFiltro === valor;
            const href =
              valor === "TODOS" ? "/admin/posts" : `/admin/posts?status=${valor}`;
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
                {label}
              </Link>
            );
          })}
        </div>

        <form method="get" className="flex gap-2">
          {statusFiltro && <input type="hidden" name="status" value={statusFiltro} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por título..."
            className="input max-w-xs"
          />
          <button
            type="submit"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
          >
            Buscar
          </button>
        </form>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Autor</th>
              <th className="px-4 py-3 font-medium">Agendado/Publicado em</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-white/5 text-slate-300 last:border-0">
                <td className="px-4 py-3 text-white">{post.titulo}</td>
                <td className="px-4 py-3">{POST_CATEGORIA_LABELS[post.categoria] ?? post.categoria}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${badgeClasse(post.status)}`}>
                    {POST_STATUS_LABELS[post.status] ?? post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{post.autor.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                  {formatarData(post.publicadoEm)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Editar
                    </Link>
                    <PostDeleteButton id={post.id} titulo={post.titulo} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Nenhum post encontrado{q ? ` para "${q}"` : ""}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Paginacao
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        basePath="/admin/posts"
        searchParams={{ q, status: statusFiltro }}
      />
    </div>
  );
}
