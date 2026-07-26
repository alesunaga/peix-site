// src/app/api/newsletter/subscribe/route.ts — RF-BLOG-03/04
//
// Inscrição na newsletter do blog (nome + e-mail), com double opt-in
// (RF-BLOG-04): o registro nasce com status PENDENTE e só passa a receber
// avisos de novo post depois de confirmar o link enviado por e-mail
// (ver /newsletter/confirmar e src/emails/NewsletterConfirmacao.tsx).
//
// Mesma disciplina de e-mail best-effort do resto do site (§8 da
// arquitetura): o registro já foi salvo com sucesso antes do envio, então
// uma falha do Resend nunca derruba a resposta ao visitante.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { gerarTokenSeguro } from "@/lib/tokens";
import { enviarConfirmacaoNewsletter, enviarEmailsSemBloquear } from "@/lib/resend";

const subscribeSchema = z.object({
  nome: z.string().trim().min(1).optional(),
  email: z.string().trim().email("E-mail inválido."),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const { nome, email } = parsed.data;

  const existente = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  // Já confirmado: não precisa reenviar nada, evita reconfirmar à toa e
  // gerar um token novo sem necessidade.
  if (existente?.status === "CONFIRMADO") {
    return NextResponse.json({ ok: true, jaConfirmado: true });
  }

  let assinante;
  if (!existente) {
    assinante = await prisma.newsletterSubscriber.create({
      data: { nome, email, status: "PENDENTE", tokenConfirmacao: gerarTokenSeguro() },
    });
  } else {
    // PENDENTE (reenvio) ou DESCADASTRADO (reinscrição) — nos dois casos
    // gera um token novo e limpa os timestamps de confirmação/descadastro.
    assinante = await prisma.newsletterSubscriber.update({
      where: { id: existente.id },
      data: {
        nome: nome ?? existente.nome,
        status: "PENDENTE",
        tokenConfirmacao: gerarTokenSeguro(),
        confirmadoEm: null,
        descadastradoEm: null,
      },
    });
  }

  await enviarEmailsSemBloquear([
    () => enviarConfirmacaoNewsletter(assinante.email, assinante.tokenConfirmacao),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}
