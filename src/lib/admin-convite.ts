// src/lib/admin-convite.ts
//
// RF-ADMIN-06/07 — lógica compartilhada entre "convidar por e-mail" (novo ou
// reutilizando um admin desativado) e "reenviar convite" (convidado ou
// desativado existente): sempre regenera o token e reenvia o e-mail.

import { prisma } from "@/lib/prisma";
import { enviarConviteAdmin, enviarEmailsSemBloquear } from "@/lib/resend";
import { gerarTokenSeguro } from "@/lib/tokens";

export const CONVITE_VALIDADE_MS = 48 * 60 * 60 * 1000; // 48h

export async function emitirConvite(adminId: string, convidadoPorId: string) {
  const tokenConvite = gerarTokenSeguro();
  const conviteExpiraEm = new Date(Date.now() + CONVITE_VALIDADE_MS);

  const admin = await prisma.adminUser.update({
    where: { id: adminId },
    data: { status: "CONVIDADO", tokenConvite, conviteExpiraEm, convidadoPorId },
  });

  const convidadoPor = await prisma.adminUser.findUnique({
    where: { id: convidadoPorId },
    select: { email: true },
  });

  // Convite gravado no banco não deve depender do envio do e-mail (mesma
  // disciplina de "backend nunca confia no cliente / e-mail é best-effort"
  // já usada em src/app/api/leads/route.ts).
  await enviarEmailsSemBloquear([
    () => enviarConviteAdmin(admin, tokenConvite, convidadoPor?.email ?? null),
  ]);

  return admin;
}
