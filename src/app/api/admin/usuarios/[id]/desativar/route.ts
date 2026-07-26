// src/app/api/admin/usuarios/[id]/desativar/route.ts — RF-ADMIN-07
//
// Sem exclusão física — FK de autoria de posts fica intacta. Um admin não
// pode desativar a própria conta (evita se trancar fora do painel).

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAtual } from "@/lib/admin-current";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const adminAtual = await getAdminAtual();
  if (!adminAtual) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { id } = await context.params;

  if (id === adminAtual.id) {
    return NextResponse.json(
      { erro: "Você não pode desativar sua própria conta." },
      { status: 400 },
    );
  }

  const alvo = await prisma.adminUser.findUnique({ where: { id } });
  if (!alvo) {
    return NextResponse.json({ erro: "Administrador não encontrado." }, { status: 404 });
  }

  await prisma.adminUser.update({
    where: { id },
    data: {
      status: "DESATIVADO",
      tokenConvite: null,
      conviteExpiraEm: null,
      tokenResetSenha: null,
      resetExpiraEm: null,
    },
  });

  return NextResponse.json({ ok: true });
}
