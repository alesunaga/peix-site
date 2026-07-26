// src/app/api/cron/publicar-agendados/route.ts — RF-ADMIN-12
//
// Job periódico: publica posts `AGENDADO` cuja data já chegou e dispara a
// newsletter (RF-BLOG-05). Fora de /api/admin/**, então o middleware não
// exige sessão de admin aqui — em vez disso, protegido por um segredo
// compartilhado (`CRON_SECRET`) enviado no header `Authorization`, chamado
// por um scheduler externo (Railway Cron ou equivalente, a cada 5–15min —
// ver Arquitetura_Tecnica_Site_PEIx v1.3, §4/§11).
//
// Cada post agendado é publicado e tem a newsletter disparada individualmente
// — uma falha num post não deve impedir os demais de serem processados.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dispararNewsletterPost } from "@/lib/newsletter-dispatch";

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ erro: "CRON_SECRET não configurado no ambiente." }, { status: 500 });
  }

  const autorizacao = request.headers.get("authorization");
  if (autorizacao !== `Bearer ${secret}`) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const agora = new Date();
  const pendentes = await prisma.post.findMany({
    where: { status: "AGENDADO", publicadoEm: { lte: agora } },
  });

  const processados: Array<{ id: string; titulo: string; ok: boolean; erro?: string }> = [];

  for (const post of pendentes) {
    try {
      const publicado = await prisma.post.update({
        where: { id: post.id },
        data: { status: "PUBLICADO" },
      });

      await dispararNewsletterPost(publicado);

      processados.push({ id: post.id, titulo: post.titulo, ok: true });
    } catch (e) {
      console.error(`[cron/publicar-agendados] Falha ao publicar post ${post.id}:`, e);
      processados.push({
        id: post.id,
        titulo: post.titulo,
        ok: false,
        erro: e instanceof Error ? e.message : "Erro desconhecido.",
      });
    }
  }

  return NextResponse.json({ ok: true, total: pendentes.length, processados });
}
