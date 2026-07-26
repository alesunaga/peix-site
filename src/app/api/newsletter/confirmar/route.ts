// src/app/api/newsletter/confirmar/route.ts — RF-BLOG-04
//
// Confirma a inscrição na newsletter (double opt-in). Chamada pelo
// componente client de /newsletter/confirmar depois de ler o token da URL —
// nunca muta estado direto num GET de página (mitiga pre-fetch automático de
// link por scanner de e-mail).

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const confirmarSchema = z.object({ token: z.string().min(1) });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = confirmarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Token inválido." }, { status: 400 });
  }

  const assinante = await prisma.newsletterSubscriber.findUnique({
    where: { tokenConfirmacao: parsed.data.token },
  });

  if (!assinante) {
    return NextResponse.json({ erro: "Link de confirmação inválido." }, { status: 404 });
  }

  // Idempotente: se já estava confirmado (ex.: clicou duas vezes), só retorna ok.
  if (assinante.status !== "CONFIRMADO") {
    await prisma.newsletterSubscriber.update({
      where: { id: assinante.id },
      data: { status: "CONFIRMADO", confirmadoEm: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
