// src/app/blog/[slug]/page.tsx — RF-BLOG-02
//
// Página individual do post: metadados de SEO (title, description, Open
// Graph) e marcação estruturada schema.org/Article para indexação. Só
// posts com status=PUBLICADO e publicadoEm no passado ficam acessíveis por
// aqui (RN-SITE-04) — rascunho/agendado retornam 404, mesmo sabendo o slug.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { markdownParaHtmlSeguro } from "@/lib/markdown";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { PostArticle } from "@/components/site/PostArticle";
import { SITE_URL } from "@/lib/site";

async function buscarPostPublicado(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLICADO", publicadoEm: { lte: new Date() } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await buscarPostPublicado(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.titulo} — Blog PEIx`,
    description: post.resumo,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.titulo,
      description: post.resumo,
      url,
      publishedTime: post.publicadoEm?.toISOString(),
      images: [{ url: post.imagemCapaUrl ?? "/og-image.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.titulo,
      description: post.resumo,
      images: [post.imagemCapaUrl ?? "/og-image.jpg"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await buscarPostPublicado(slug);

  if (!post) {
    notFound();
  }

  const html = await markdownParaHtmlSeguro(post.conteudo);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titulo,
    description: post.resumo,
    image: post.imagemCapaUrl ? [post.imagemCapaUrl] : undefined,
    datePublished: post.publicadoEm?.toISOString(),
    dateModified: post.atualizadoEm.toISOString(),
    author: { "@type": "Organization", name: "PEIx" },
    publisher: { "@type": "Organization", name: "PEIx" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16">
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <PostArticle
          titulo={post.titulo}
          categoria={post.categoria}
          resumo={post.resumo}
          imagemCapaUrl={post.imagemCapaUrl}
          html={html}
          dataExibida={
            post.publicadoEm
              ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(post.publicadoEm)
              : null
          }
        />

        <NewsletterForm className="mt-14" />
      </main>
      <Footer />
    </>
  );
}
