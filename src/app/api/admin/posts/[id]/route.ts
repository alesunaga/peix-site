// src/app/api/admin/posts/[id]/route.ts — RF-ADMIN-05
//
// PATCH — edita um post existente (inclui publicar/despublicar via `status`).
// DELETE — exclusão real (RF-ADMIN-05 permite; diferente de AdminUser, que
// nunca é excluído fisicamente). Bloqueada pelo banco (RESTRICT) se o post
// já tiver disparo de newsletter registrado.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminAtual } from "@/lib/admin-current";
import { gerarSlug } from "@/lib/slug";
import { dispararNewsletterPost } from "@/lib/newsletter-dispatch";

const CATEGORIAS = [
  "INCLUSAO",
  "LEGISLACAO",
  "IDEIAS_BOAS_PRATICAS",
  "EXPERIENCIAS",
  "ENTREVISTAS",
  "EVENTOS",
] as const;

const STATUS = ["RASCUNHO", "AGENDADO", "PUBLICADO"] as const;

const updateSchema = z
  .object({
    titulo: z.string().min(3).optional(),
    slug: z.string().min(3).optional(),
    resumo: z.string().min(3).optional(),
    conteudo: z.string().min(1).optional(),
    categoria: z.enum(CATEGORIAS).optional(),
    status: z.enum(STATUS).optional(),
    // RF-ADMIN-12: obrigatório e precisa ser futuro quando status = AGENDADO.
    publicadoEm: z.coerce.date().optional(),
  })
  .refine((dados) => dados.status !== "AGENDADO" || (dados.publicadoEm && dados.publicadoEm > new Date()), {
    message: "Informe uma data/hora futura para agendar a publicação.",
    path: ["publicadoEm"],
  });

async function garantirSlugUnico(base: string, ignorarId: string): Promise<string> {
  let slug = base || "post";
  let contador = 1;

  for (;;) {
    const existente = await prisma.post.findUnique({ where: { slug } });
    if (!existente || existente.id === ignorarId) return slug;
    contador += 1;
    slug = `${base}-${contador}`;
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminAtual();
  if (!admin) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ erro: "Post não encontrado." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const dados = parsed.data;

  let slug = post.slug;
  if (dados.slug?.trim() || dados.titulo) {
    const base = gerarSlug(dados.slug?.trim() || dados.titulo || post.titulo);
    if (base !== post.slug) {
      slug = await garantirSlugUnico(base, id);
    }
  }

  const novoStatus = dados.status ?? post.status;
  const estavaPublicado = post.status === "PUBLICADO";

  // RN-SITE-04: só marca publicadoEm na primeira transição para PUBLICADO —
  // despublicar não apaga a data histórica (quem decide visibilidade é o
  // status). RF-ADMIN-12: transição para AGENDADO grava a data/hora futura
  // informada — é ela que o job de agendamento usa para decidir quando
  // publicar (ver src/app/api/cron/publicar-agendados/route.ts).
  let publicadoEm = post.publicadoEm;
  if (novoStatus === "PUBLICADO" && !estavaPublicado) {
    publicadoEm = new Date();
  } else if (novoStatus === "AGENDADO") {
    publicadoEm = dados.publicadoEm ?? post.publicadoEm;
  }

  const atualizado = await prisma.post.update({
    where: { id },
    data: {
      ...dados,
      slug,
      status: novoStatus,
      publicadoEm,
    },
  });

  // Publicação imediata dispara a newsletter (RF-BLOG-05) — mesmo padrão
  // best-effort do job de agendamento (RF-ADMIN-12, ver
  // src/lib/newsletter-dispatch.ts). Só dispara na transição, nunca de novo
  // se o post já estava PUBLICADO (evita reenvio ao só editar o conteúdo).
  if (novoStatus === "PUBLICADO" && !estavaPublicado) {
    try {
      await dispararNewsletterPost(atualizado);
    } catch (e) {
      console.error("[posts] Falha ao disparar newsletter na publicação imediata:", e);
    }
  }

  return NextResponse.json({ ok: true, post: { id: atualizado.id, slug: atualizado.slug } });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminAtual();
  if (!admin) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await prisma.post.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json({ erro: "Post não encontrado." }, { status: 404 });
      }
      if (e.code === "P2003" || e.code === "P2014") {
        return NextResponse.json(
          { erro: "Não é possível excluir: este post tem registros vinculados (ex.: envio de newsletter já disparado)." },
          { status: 409 },
        );
      }
    }
    throw e;
  }

  return NextResponse.json({ ok: true });
}
