// src/app/api/admin/posts/preview/route.ts — RF-ADMIN-09
//
// Converte Markdown em HTML sanitizado para o preview em tempo real do
// editor. Chamado com debounce pelo client (src/components/admin/PostForm.tsx).
// Nunca renderizar o Markdown->HTML no cliente sem passar por aqui.

import { NextRequest, NextResponse } from "next/server";
import { getAdminAtual } from "@/lib/admin-current";
import { markdownParaHtmlSeguro } from "@/lib/markdown";

export async function POST(request: NextRequest) {
  const admin = await getAdminAtual();
  if (!admin) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const conteudo = typeof body?.conteudo === "string" ? body.conteudo : "";

  const html = await markdownParaHtmlSeguro(conteudo);
  return NextResponse.json({ html });
}
