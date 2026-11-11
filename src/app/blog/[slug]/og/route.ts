// src/app/blog/[slug]/og/route.ts — RF-BLOG-02 (prévia de compartilhamento)
//
// Imagem de prévia (Open Graph) do post, servida pelo próprio domínio do
// site. A capa original fica no R2 exatamente como foi enviada (PNG de até
// 5MB, em `*.r2.dev`), e o WhatsApp descarta em silêncio a imagem de prévia
// quando ela é pesada ou demora a responder — o link sai só com título e
// resumo. Esta rota entrega sempre um JPEG 1200×630 leve, com cache longo.
//
// Mesma regra de visibilidade da página do post (RN-SITE-04): só post
// PUBLICADO com publicadoEm no passado. Qualquer falha (post inexistente,
// sem capa, R2 fora do ar) cai na imagem padrão do site, nunca em erro.

import { NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

const LARGURA = 1200;
const ALTURA = 630;
const LIMITE_ORIGEM_BYTES = 6 * 1024 * 1024;

function imagemPadrao() {
  return NextResponse.redirect(`${SITE_URL}/og-peix.jpg`, 302);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLICADO", publicadoEm: { lte: new Date() } },
    select: { imagemCapaUrl: true },
  });

  if (!post?.imagemCapaUrl) return imagemPadrao();

  // A URL da capa só é gravada pelo próprio servidor (upload para o R2), mas
  // conferimos a origem mesmo assim antes de buscar qualquer coisa.
  const baseR2 = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
  if (!baseR2 || !post.imagemCapaUrl.startsWith(`${baseR2}/`)) {
    return imagemPadrao();
  }

  try {
    const resposta = await fetch(post.imagemCapaUrl, {
      signal: AbortSignal.timeout(8000),
    });
    if (!resposta.ok) return imagemPadrao();

    const original = Buffer.from(await resposta.arrayBuffer());
    if (original.byteLength > LIMITE_ORIGEM_BYTES) return imagemPadrao();

    const jpeg = await sharp(original)
      .resize(LARGURA, ALTURA, { fit: "cover", position: "centre" })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    return new NextResponse(new Uint8Array(jpeg), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(jpeg.byteLength),
        // A URL usada nos metadados leva `?v=<atualizadoEm>`, então trocar a
        // capa gera um endereço novo e o cache longo não prende a antiga.
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable",
      },
    });
  } catch {
    return imagemPadrao();
  }
}
