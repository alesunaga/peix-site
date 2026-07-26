// src/app/blog/preview/[token]/page.tsx — RF-ADMIN-11
//
// Renderiza um post não publicado (rascunho ou agendado) a partir de um
// token de preview assinado, sem exigir login de quem acessa. Fora do
// escopo do middleware (que só protege /admin/** e /api/admin/**) — rota
// pública por design, mas não indexável (RN-ADMIN-02 / Arquitetura_Tecnica
// v1.3, §10: expõe conteúdo não publicado a quem tiver a URL, por isso tem
// expiração e `noindex`).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { markdownParaHtmlSeguro } from "@/lib/markdown";
import { PostArticle } from "@/components/site/PostArticle";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PreviewPostPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const previewToken = await prisma.postPreviewToken.findUnique({
    where: { token },
    include: { post: true },
  });

  if (!previewToken || previewToken.expiraEm < new Date()) {
    notFound();
  }

  const { post } = previewToken;
  const html = await markdownParaHtmlSeguro(post.conteudo);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
        Este é um preview de um post ainda não publicado ({post.status === "AGENDADO" ? "agendado" : "rascunho"}).
        Este link expira e não aparece nas páginas públicas do blog.
      </div>

      <PostArticle
        titulo={post.titulo}
        categoria={post.categoria}
        resumo={post.resumo}
        imagemCapaUrl={post.imagemCapaUrl}
        html={html}
      />
    </main>
  );
}
