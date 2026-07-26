// src/lib/markdown.ts — RF-ADMIN-09
//
// Único lugar do projeto que converte Markdown de post em HTML. Sempre
// sanitizado no backend (nunca confiar em sanitização client-side) — usado
// tanto no preview em tempo real do editor (/api/admin/posts/preview)
// quanto, futuramente, na página pública do blog. Decisão de segurança:
// editor WYSIWYG que salva HTML bruto abriria superfície de XSS caso um
// post seja comprometido ou um admin cole conteúdo malicioso (ver
// Arquitetura_Tecnica_Site_PEIx v1.3, §3).

import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.use({ gfm: true, breaks: true });

const TAGS_PERMITIDAS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "strong", "em", "del",
  "ul", "ol", "li",
  "blockquote", "code", "pre",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
];

export async function markdownParaHtmlSeguro(markdown: string): Promise<string> {
  const htmlBruto = await marked.parse(markdown ?? "");

  return sanitizeHtml(htmlBruto, {
    allowedTags: TAGS_PERMITIDAS,
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Links de post sempre abrem em nova aba, com rel seguro.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
    },
  });
}
