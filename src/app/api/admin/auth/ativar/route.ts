// src/app/api/admin/auth/ativar/route.ts — RF-ADMIN-06
//
// Pública (liberada pelo middleware via prefixo /api/admin/auth/**) — quem
// acessa ainda não tem sessão. Define a senha e ativa a conta convidada;
// já autentica em seguida, por conveniência.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/admin-session";

const schema = z.object({
  token: z.string().min(1),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const { token, senha } = parsed.data;
  const admin = await prisma.adminUser.findUnique({ where: { tokenConvite: token } });

  if (!admin || admin.status !== "CONVIDADO") {
    return NextResponse.json({ erro: "Convite inválido ou já utilizado." }, { status: 400 });
  }
  if (!admin.conviteExpiraEm || admin.conviteExpiraEm < new Date()) {
    return NextResponse.json(
      { erro: "Convite expirado. Peça um novo convite ao administrador." },
      { status: 400 },
    );
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      senhaHash,
      status: "ATIVO",
      tokenConvite: null,
      conviteExpiraEm: null,
      tentativasLogin: 0,
      bloqueadoAte: null,
    },
  });

  const sessionToken = await createSessionToken(admin.id);
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, sessionCookieOptions());
  return resposta;
}
