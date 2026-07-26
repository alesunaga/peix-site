// src/app/api/admin/auth/esqueci-senha/route.ts — RF-ADMIN-08
//
// Pública. Sempre responde com a mesma mensagem genérica, exista ou não o
// e-mail — evita enumeração de contas (mesmo espírito da mensagem genérica
// de login em /api/admin/auth/login).

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { enviarResetSenhaAdmin, enviarEmailsSemBloquear } from "@/lib/resend";
import { gerarTokenSeguro } from "@/lib/tokens";

const schema = z.object({ email: z.string().email() });

const RESET_VALIDADE_MS = 60 * 60 * 1000; // 1h
const MENSAGEM_GENERICA = "Se o e-mail existir e estiver ativo, enviamos um link de redefinição.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: true, mensagem: MENSAGEM_GENERICA });
  }

  const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });

  if (admin && admin.status === "ATIVO") {
    const tokenResetSenha = gerarTokenSeguro();
    const resetExpiraEm = new Date(Date.now() + RESET_VALIDADE_MS);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { tokenResetSenha, resetExpiraEm },
    });

    await enviarEmailsSemBloquear([() => enviarResetSenhaAdmin(admin, tokenResetSenha)]);
  }

  return NextResponse.json({ ok: true, mensagem: MENSAGEM_GENERICA });
}
