// src/app/blog/page.tsx — RF-BLOG-01
//
// Listagem pública de posts, com filtro por categoria. Só mostra posts
// status=PUBLICADO com publicadoEm no passado (RN-SITE-04) — rascunho e
// agendado nunca aparecem aqui, só pelo link de preview assinado
// (RF-ADMIN-11, /blog/preview/[token]).

import Link from "next/link";
import type { Metadata } from "next";
import { Prisma, PostCategoria } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Card } from "@/components/ui/Card";
import { POST_CATEGORIA_LABELS } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Blog — PEIx",
  description:
    "Inclusão, legislação (Decreto nº 12.773/2025), boas práticas e experiências do Núcleo de Práticas Inclusivas.",
};

const TAMANHO_PAGINA = 12;

const CATEGORIAS = Object.entries(POST_CATEGORIA_LABELS) as [PostCategoria, string][];

function formatarData(data: Date | null) {
  if (!data) return "";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(data);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; pagina?: string }>;
}) {
  const sp = await searchParams;
  const paginaAtual = Math.max(1, Number(sp.pagina) || 1);
  const categoriaFiltro =
    sp.categoria && (Object.keys(PostCategoria) as string[]).includes(sp.categoria)
      ? (sp.categoria as PostCategoria)
      : undefined;

  const where: Prisma.PostWhereInput = {
    status: "PUBLICADO",
    publicadoEm: { lte: new Date() },
    ...(categoriaFiltro ? { categoria: categoriaFiltro } : {}),
  };

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { publicadoEm: "desc" },
      skip: (paginaAtual - 1) * TAMANHO_PAGINA,
      take: TAMANHO_PAGINA,
    }),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / TAMANHO_PAGINA));

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-400">Blog</p>
        <h1 className="mb-8 text-3xl font-semibold text-white sm:text-4xl">
          Inclusão, legislação e prática pedagógica
        </h1>

        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              !categoriaFiltro
                ? "border-indigo-500/40 bg-indigo-600/20 text-indigo-300"
                : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            Todos
          </Link>
          {CATEGORIAS.map(([valor, label]) => (
            <Link
              key={valor}
              href={`/blog?categoria=${valor}`}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                categoriaFiltro === valor
                  ? "border-indigo-500/40 bg-indigo-600/20 text-indigo-300"
                  : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="text-slate-400">Nenhum post publicado {categoriaFiltro ? "nessa categoria " : ""}ainda.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="flex h-full flex-col overflow-hidden transition-colors hover:border-indigo-400/40">
                  {post.imagemCapaUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.imagemCapaUrl} alt="" className="h-40 w-full object-cover" />
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-indigo-600/30 to-purple-600/20" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-400">
                      {POST_CATEGORIA_LABELS[post.categoria] ?? post.categoria}
                    </p>
                    <h2 className="mb-2 text-lg font-semibold text-white">{post.titulo}</h2>
                    <p className="mb-4 line-clamp-3 flex-1 text-sm text-slate-400">{post.resumo}</p>
                    <p className="text-xs text-slate-500">{formatarData(post.publicadoEm)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <Link
                key={pagina}
                href={`/blog?${categoriaFiltro ? `categoria=${categoriaFiltro}&` : ""}pagina=${pagina}`}
                className={`rounded-lg px-3.5 py-1.5 text-sm ${
                  pagina === paginaAtual
                    ? "bg-indigo-600 text-white"
                    : "border border-white/10 text-slate-400 hover:bg-white/5"
                }`}
              >
                {pagina}
              </Link>
            ))}
          </div>
        )}

        <NewsletterForm className="mt-14" />
      </main>
      <Footer />
    </>
  );
}
