// src/lib/newsletter-dispatch.ts — RF-BLOG-05, usado por RF-ADMIN-12
//
// Dispara o e-mail de aviso de novo post para todos os assinantes confirmados
// da newsletter e registra o resultado em `envios_newsletter` (auditoria).
// Chamado tanto na publicação imediata (transição de status para PUBLICADO
// em src/app/api/admin/posts/[id]/route.ts) quanto pelo job de agendamento
// (src/app/api/cron/publicar-agendados/route.ts) — mesmo fluxo em ambos os
// casos (Arquitetura_Tecnica_Site_PEIx v1.3, §4, itens 4 e 5).
//
// Segue o padrão de e-mail best-effort (§8 da arquitetura): uma falha no
// envio nunca deve impedir a publicação do post, que já foi gravada com
// sucesso — só é registrada na contagem de falhas da auditoria.

import { prisma } from "@/lib/prisma";
import { enviarAvisoNovoPost } from "@/lib/resend";
import type { Post } from "@prisma/client";

export async function dispararNewsletterPost(post: Post): Promise<void> {
  const assinantes = await prisma.newsletterSubscriber.findMany({
    where: { status: "CONFIRMADO" },
    select: { email: true, tokenConfirmacao: true },
  });

  if (assinantes.length === 0) {
    await prisma.newsletterSend.create({
      data: { postId: post.id, totalDestinatarios: 0, totalSucesso: 0, totalFalha: 0 },
    });
    return;
  }

  const resultados = await Promise.allSettled(
    assinantes.map((assinante) =>
      enviarAvisoNovoPost(assinante.email, post, assinante.tokenConfirmacao),
    ),
  );

  let totalSucesso = 0;
  let totalFalha = 0;
  for (const resultado of resultados) {
    if (resultado.status === "fulfilled") {
      totalSucesso += 1;
    } else {
      totalFalha += 1;
      console.error("[newsletter] Falha ao enviar aviso de novo post:", resultado.reason);
    }
  }

  await prisma.newsletterSend.create({
    data: {
      postId: post.id,
      totalDestinatarios: assinantes.length,
      totalSucesso,
      totalFalha,
    },
  });
}
