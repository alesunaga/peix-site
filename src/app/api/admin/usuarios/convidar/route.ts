// src/app/api/admin/usuarios/convidar/route.ts — RF-ADMIN-06
//
// Protegida pelo middleware (não está sob /api/admin/auth/**). Cria um novo
// AdminUser convidado ou reutiliza um registro desativado/já convidado com
// esse e-mail — nunca reutiliza um e-mail já ativo.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminAtual } from "@/lib/admin-current";
import { emitirConvite } from "@/lib/admin-convite";

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const adminAtual = await getAdminAtual();
  if (!adminAtual || adminAtual.status !== "ATIVO") {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "E-mail inválido." }, { status: 400 });
  }

  const { email } = parsed.data;
  const existente = await prisma.adminUser.findUnique({ where: { email } });

  if (existente?.status === "ATIVO") {
    return NextResponse.json(
      { erro: "Já existe um administrador ativo com esse e-mail." },
      { status: 409 },
    );
  }

  const admin = existente ?? (await prisma.adminUser.create({ data: { email, status: "CONVIDADO" } }));

  await emitirConvite(admin.id, adminAtual.id);

  return NextResponse.json({ ok: true }, { status: 201 });
}
