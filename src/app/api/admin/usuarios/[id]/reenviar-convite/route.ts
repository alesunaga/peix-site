// src/app/api/admin/usuarios/[id]/reenviar-convite/route.ts — RF-ADMIN-07
//
// Regenera o token de convite (funciona tanto para reenviar um convite
// expirado quanto para reativar-via-convite um admin desativado — RF-ADMIN-06
// "cria ou reutiliza, se desativado").

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAtual } from "@/lib/admin-current";
import { emitirConvite } from "@/lib/admin-convite";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const adminAtual = await getAdminAtual();
  if (!adminAtual) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const alvo = await prisma.adminUser.findUnique({ where: { id } });

  if (!alvo) {
    return NextResponse.json({ erro: "Administrador não encontrado." }, { status: 404 });
  }
  if (alvo.status === "ATIVO") {
    return NextResponse.json({ erro: "Este administrador já está ativo." }, { status: 409 });
  }

  await emitirConvite(alvo.id, adminAtual.id);

  return NextResponse.json({ ok: true });
}
