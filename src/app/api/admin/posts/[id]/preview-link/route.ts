// src/app/api/admin/posts/[id]/preview-link/route.ts — RF-ADMIN-11
//
// Gera um link de preview assinado para um post não publicado (rascunho ou
// agendado), acessível sem exigir login de quem recebe o link — permite
// compartilhar o rascunho com terceiros para revisão sem expor a área
// administrativa. Expira em 7 dias (ver Arquitetura_Tecnica_Site_PEIx v1.3,
// §4, item 6).

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAtual } from "@/lib/admin-current";
import { gerarTokenSeguro } from "@/lib/tokens";

const EXPIRACAO_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

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

  // RN-ADMIN-02: link de preview existe justamente para conteúdo ainda não
  // público. Um post já PUBLICADO tem URL pública normal — gerar um token
  // aqui não faz sentido e só ampliaria a superfície de links válidos à toa.
  if (post.status === "PUBLICADO") {
    return NextResponse.json(
      { erro: "Este post já está publicado — use a URL pública normal." },
      { status: 409 },
    );
  }

  const token = gerarTokenSeguro();
  const expiraEm = new Date(Date.now() + EXPIRACAO_MS);

  await prisma.postPreviewToken.create({
    data: { postId: post.id, token, expiraEm },
  });

  return NextResponse.json({
    ok: true,
    caminho: `/blog/preview/${token}`,
    expiraEm,
  });
}
