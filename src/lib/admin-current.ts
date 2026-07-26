// src/lib/admin-current.ts
//
// Helper de Server Component/Route Handler para obter o AdminUser da sessão
// atual. O middleware (src/middleware.ts) só valida assinatura/expiração do
// cookie (roda em Edge, sem acesso ao Postgres) — esta função é a checagem
// AUTORITATIVA: também rejeita sessões emitidas antes da última troca de
// senha (revogação — ver comentário em src/lib/admin-session.ts) e sessões
// de admins desativados. Toda rota/página protegida deve chamar
// getAdminAtual() e tratar `null` como não autenticado, não confiar só no
// middleware ter deixado passar.

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

export async function getAdminAtual() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const sessao = await verifySessionToken(token);
  if (!sessao) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: sessao.sub },
    select: { id: true, email: true, status: true, criadoEm: true, senhaAlteradaEm: true },
  });
  if (!admin) return null;

  // Só ATIVO conta como autenticado — convidado ainda não ativou a conta,
  // desativado perdeu acesso (RF-ADMIN-07). Centralizado aqui em vez de em
  // cada chamador.
  if (admin.status !== "ATIVO") return null;

  // Revogação: uma sessão emitida antes da senha ter sido alterada não vale
  // mais, mesmo com assinatura/expiração ainda válidas. Comparação truncada
  // ao segundo (granularidade do `iat`) para não invalidar, por
  // arredondamento, a própria sessão recém-criada no instante da troca —
  // ver src/lib/admin-session.ts.
  if (admin.senhaAlteradaEm) {
    const senhaAlteradaEmSegundos = Math.floor(admin.senhaAlteradaEm.getTime() / 1000);
    if (senhaAlteradaEmSegundos > sessao.iat) {
      return null;
    }
  }

  return admin;
}
