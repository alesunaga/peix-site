// src/app/api/admin/auth/login/route.ts
//
// RF-ADMIN-01 — login por e-mail e senha.
// RN-ADMIN-04 — lockout de 5 tentativas malsucedidas / 15 min (padrão
// simplificado, mesmo usado no sistema PEIx produto — reinicia o contador a
// cada sucesso ou quando o bloqueio expira).

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/admin-session";

const LOCKOUT_MAX_TENTATIVAS = 5;
const LOCKOUT_DURACAO_MS = 15 * 60 * 1000;

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

const ERRO_CREDENCIAIS = "E-mail ou senha inválidos.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ erro: ERRO_CREDENCIAIS }, { status: 400 });
  }

  const { email, senha } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });

  // Conta inexistente, ainda não ativada (convidado) ou desativada — mesma
  // mensagem genérica para não revelar o estado da conta a um atacante.
  if (!admin || admin.status !== "ATIVO" || !admin.senhaHash) {
    return NextResponse.json({ erro: ERRO_CREDENCIAIS }, { status: 401 });
  }

  const agora = new Date();

  if (admin.bloqueadoAte && admin.bloqueadoAte > agora) {
    const minutosRestantes = Math.ceil((admin.bloqueadoAte.getTime() - agora.getTime()) / 60000);
    return NextResponse.json(
      { erro: `Conta temporariamente bloqueada por excesso de tentativas. Tente novamente em ${minutosRestantes} min.` },
      { status: 429 },
    );
  }

  const senhaValida = await bcrypt.compare(senha, admin.senhaHash);

  if (!senhaValida) {
    const novasTentativas = admin.tentativasLogin + 1;

    if (novasTentativas >= LOCKOUT_MAX_TENTATIVAS) {
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { tentativasLogin: 0, bloqueadoAte: new Date(agora.getTime() + LOCKOUT_DURACAO_MS) },
      });
      return NextResponse.json(
        { erro: "Muitas tentativas malsucedidas. Conta bloqueada por 15 minutos." },
        { status: 429 },
      );
    }

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { tentativasLogin: novasTentativas },
    });
    return NextResponse.json({ erro: ERRO_CREDENCIAIS }, { status: 401 });
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { tentativasLogin: 0, bloqueadoAte: null },
  });

  const token = await createSessionToken(admin.id);

  const resposta = NextResponse.json({ ok: true, admin: { id: admin.id, email: admin.email } });
  resposta.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
  return resposta;
}
