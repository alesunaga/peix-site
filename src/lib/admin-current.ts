// src/lib/admin-current.ts
//
// Helper de Server Component/Route Handler para obter o AdminUser da sessão
// atual. O middleware (src/middleware.ts) já garante que só chega aqui quem
// tem cookie válido, mas as páginas ainda precisam dos dados do admin (ex.:
// e-mail exibido no shell, autorId ao criar um post).

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

export async function getAdminAtual() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const sessao = await verifySessionToken(token);
  if (!sessao) return null;

  return prisma.adminUser.findUnique({
    where: { id: sessao.sub },
    select: { id: true, email: true, status: true, criadoEm: true },
  });
}
