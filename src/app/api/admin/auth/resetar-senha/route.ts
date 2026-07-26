// src/app/api/admin/auth/resetar-senha/route.ts — RF-ADMIN-08
//
// Pública. Token de uso único (limpo após o uso).
//
// Grava `senhaAlteradaEm` — é isso que faz sessões antigas (abertas antes
// deste reset) pararem de valer no próximo request, mesmo que a assinatura
// e a expiração do cookie continuem tecnicamente válidas. A checagem em si
// mora em getAdminAtual() (src/lib/admin-current.ts), porque só ali (runtime
// Node.js) dá pra consultar o banco — o middleware roda em Edge e só valida
// o cookie. Ver src/lib/admin-session.ts para o desenho completo.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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
  const admin = await prisma.adminUser.findUnique({ where: { tokenResetSenha: token } });

  if (!admin) {
    return NextResponse.json({ erro: "Link inválido ou já utilizado." }, { status: 400 });
  }
  if (!admin.resetExpiraEm || admin.resetExpiraEm < new Date()) {
    return NextResponse.json(
      { erro: "Link expirado. Solicite uma nova redefinição." },
      { status: 400 },
    );
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      senhaHash,
      tokenResetSenha: null,
      resetExpiraEm: null,
      tentativasLogin: 0,
      bloqueadoAte: null,
      senhaAlteradaEm: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
