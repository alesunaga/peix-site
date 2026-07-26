// src/lib/site.ts
//
// URL canônica do site, usada em links absolutos (e-mails transacionais,
// metadados de SEO, sitemap.xml). Fixada em www.peix.ia.br porque a raiz
// (peix.ia.br sem www) não tem CNAME/A configurado no DNS — ver nota da
// v1.5 da Arquitetura Técnica. Configurável via NEXT_PUBLIC_SITE_URL para o
// dia em que a raiz passar a redirecionar (ou para ambientes de preview).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.peix.ia.br").replace(
  /\/$/,
  "",
);
