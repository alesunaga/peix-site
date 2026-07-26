// src/app/robots.ts — RNF-03
//
// Bloqueia crawling de rotas sem valor de indexação: painel admin e suas
// APIs, rotas internas de e-mail (confirmação/descadastro carregam token na
// URL) e o link de preview assinado de posts não publicados (que já tem
// `noindex` na própria página — ver src/app/blog/preview/[token]/page.tsx —
// mas reforçar aqui evita que a URL apareça em resultados de busca por
// referência externa).

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/blog/preview/", "/newsletter/confirmar", "/newsletter/descadastrar"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
