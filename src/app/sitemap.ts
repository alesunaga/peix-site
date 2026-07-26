// src/app/sitemap.ts — RNF-03
//
// Sitemap dinâmico: páginas institucionais fixas + posts publicados do
// blog (RN-SITE-04 — só status=PUBLICADO e publicadoEm no passado entram
// aqui; rascunho/agendado não são indexáveis, mesma regra da página
// individual do post em src/app/blog/[slug]/page.tsx).

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

// Sem isso, o Next tenta pré-renderizar /sitemap.xml em build-time — e o
// Railway não expõe `postgres.railway.internal` pro container de build,
// só em runtime (mesma rede interna). Renderiza por request, como as
// páginas do admin que já consultam o banco.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginasFixas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/recursos`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contato`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/diagnostico`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/politica-de-privacidade`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/termos-de-uso`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const posts = await prisma.post.findMany({
    where: { status: "PUBLICADO", publicadoEm: { lte: new Date() } },
    select: { slug: true, atualizadoEm: true },
    orderBy: { publicadoEm: "desc" },
  });

  const paginasDePosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.atualizadoEm,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...paginasFixas, ...paginasDePosts];
}
