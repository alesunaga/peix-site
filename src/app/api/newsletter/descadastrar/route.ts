// src/app/api/newsletter/descadastrar/route.ts — RF-BLOG-06
//
// Descadastro self-service, sem exigir login (RN-SITE-03) — mesmo token
// usado para confirmar a inscrição (tokenConfirmacao), reaproveitado como
// identificador único e estável do assinante (ver src/lib/resend.ts,
// enviarAvisoNovoPost, que já passa esse token como unsubscribeToken).

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const descadastrarSchema = z.object({ token: z.string().min(1) });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = descadastrarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Token inválido." }, { status: 400 });
  }

  const assinante = await prisma.newsletterSubscriber.findUnique({
    where: { tokenConfirmacao: parsed.data.token },
  });

  if (!assinante) {
    return NextResponse.json({ erro: "Link de descadastro inválido." }, { status: 404 });
  }

  // Idempotente: descadastrar de novo não é erro.
  if (assinante.status !== "DESCADASTRADO") {
    await prisma.newsletterSubscriber.update({
      where: { id: assinante.id },
      data: { status: "DESCADASTRADO", descadastradoEm: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
