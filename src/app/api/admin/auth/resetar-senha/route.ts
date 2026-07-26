// src/app/api/admin/auth/resetar-senha/route.ts — RF-ADMIN-08
//
// Pública. Token de uso único (limpo após o uso).
//
// Nota de escopo: a sessão atual é um cookie assinado stateless (sem store
// de sessões no servidor — ver src/lib/admin-session.ts), então não há como
// revogar individualmente sessões já emitidas para este usuário ao resetar
// a senha. Elas seguem válidas até expirar naturalmente (RN-ADMIN-03, até 7
// dias de inatividade). Aceitável para o escopo atual (painel interno, baixo
// tráfego) — revisar se isso virar requisito de segurança mais estrito.

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
    },
  });

  return NextResponse.json({ ok: true });
}
