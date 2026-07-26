// src/app/api/admin/posts/[id]/capa/route.ts — RF-ADMIN-10
//
// Upload de imagem de capa direto do painel para o Cloudflare R2. Validação
// server-side: apenas JPEG/PNG/WebP, tamanho máximo de 5MB, com verificação
// pelo conteúdo real do arquivo (magic bytes) — nunca confia só na extensão
// do nome nem no `Content-Type` declarado pelo cliente, que podem ser
// forjados (ver Arquitetura_Tecnica_Site_PEIx v1.3, §4/§10).

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAtual } from "@/lib/admin-current";
import { detectarTipoImagemReal, extensaoParaTipo } from "@/lib/arquivo-imagem";
import { enviarImagemCapaParaR2 } from "@/lib/r2";

const TAMANHO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminAtual();
  if (!admin) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ erro: "Post não encontrado." }, { status: 404 });
  }

  const formData = await request.formData().catch(() => null);
  const arquivo = formData?.get("arquivo");
  if (!arquivo || !(arquivo instanceof File)) {
    return NextResponse.json({ erro: "Nenhum arquivo enviado." }, { status: 400 });
  }

  if (arquivo.size === 0) {
    return NextResponse.json({ erro: "Arquivo vazio." }, { status: 400 });
  }

  if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
    return NextResponse.json({ erro: "Arquivo maior que 5MB." }, { status: 413 });
  }

  const buffer = Buffer.from(await arquivo.arrayBuffer());

  // Nunca confiar em `arquivo.type` (Content-Type do multipart, forjável pelo
  // cliente) nem na extensão do nome — só o conteúdo real do arquivo decide.
  const tipoReal = detectarTipoImagemReal(buffer);
  if (!tipoReal) {
    return NextResponse.json(
      { erro: "Formato de imagem não suportado. Envie um JPEG, PNG ou WebP." },
      { status: 415 },
    );
  }

  const url = await enviarImagemCapaParaR2({
    postId: post.id,
    buffer,
    extensao: extensaoParaTipo(tipoReal),
    contentType: tipoReal,
  });

  await prisma.post.update({ where: { id: post.id }, data: { imagemCapaUrl: url } });

  return NextResponse.json({ ok: true, url });
}
