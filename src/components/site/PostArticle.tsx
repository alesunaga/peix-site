// src/components/site/PostArticle.tsx — RF-BLOG-02, reusado por RF-ADMIN-11
//
// Renderização do conteúdo de um post (capa, categoria, título, resumo e o
// HTML já sanitizado no servidor — ver src/lib/markdown.ts). Compartilhado
// entre a página pública (/blog/[slug]) e o link de preview assinado de
// posts não publicados (/blog/preview/[token]), pra não duplicar a
// marcação/estilo em dois lugares.

import { POST_CATEGORIA_LABELS } from "@/lib/labels";
import type { PostCategoria } from "@prisma/client";

export function PostArticle({
  titulo,
  categoria,
  resumo,
  imagemCapaUrl,
  html,
  dataExibida,
}: {
  titulo: string;
  categoria: PostCategoria;
  resumo: string;
  imagemCapaUrl: string | null;
  html: string;
  /** Data já formatada (pt-BR) pra exibir abaixo do título — omitido se null. */
  dataExibida?: string | null;
}) {
  return (
    <article>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-400">
        {POST_CATEGORIA_LABELS[categoria] ?? categoria}
      </p>
      <h1 className="mb-3 text-3xl font-semibold text-white sm:text-4xl">{titulo}</h1>
      {dataExibida && <p className="mb-6 text-sm text-slate-500">{dataExibida}</p>}

      {imagemCapaUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagemCapaUrl}
          alt=""
          className="mb-8 w-full rounded-xl border border-white/10 object-cover"
        />
      )}

      <p className="mb-8 text-lg text-slate-300">{resumo}</p>

      <div className="post-preview text-slate-200" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
