// src/app/api/admin/posts/route.ts — RF-ADMIN-05
//
// POST — cria um post. A listagem (GET) é feita direto no Server Component
// de /admin/posts, seguindo o mesmo padrão de leads/assinantes.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminAtual } from "@/lib/admin-current";
import { gerarSlug } from "@/lib/slug";

const CATEGORIAS = [
  "INCLUSAO",
  "LEGISLACAO",
  "IDEIAS_BOAS_PRATICAS",
  "EXPERIENCIAS",
  "ENTREVISTAS",
  "EVENTOS",
] as const;

// RF-ADMIN-12 (agendamento) ainda não implementado — só rascunho/publicado por ora.
const STATUS = ["RASCUNHO", "PUBLICADO"] as const;

const postSchema = z.object({
  titulo: z.string().min(3, "Título muito curto."),
  slug: z.string().min(3).optional(),
  resumo: z.string().min(3, "Resumo muito curto."),
  conteudo: z.string().min(1, "Conteúdo não pode ficar vazio."),
  categoria: z.enum(CATEGORIAS),
  status: z.enum(STATUS).default("RASCUNHO"),
});

/** Garante slug único, adicionando -2, -3... em caso de conflito. */
async function garantirSlugUnico(base: string, ignorarId?: string): Promise<string> {
  let slug = base || "post";
  let contador = 1;

  for (;;) {
    const existente = await prisma.post.findUnique({ where: { slug } });
    if (!existente || existente.id === ignorarId) return slug;
    contador += 1;
    slug = `${base}-${contador}`;
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminAtual();
  if (!admin) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const dados = parsed.data;
  const slugBase = gerarSlug(dados.slug?.trim() || dados.titulo);
  const slug = await garantirSlugUnico(slugBase);

  const post = await prisma.post.create({
    data: {
      titulo: dados.titulo,
      slug,
      resumo: dados.resumo,
      conteudo: dados.conteudo,
      categoria: dados.categoria,
      status: dados.status,
      publicadoEm: dados.status === "PUBLICADO" ? new Date() : null,
      autorId: admin.id,
    },
  });

  return NextResponse.json({ ok: true, post: { id: post.id, slug: post.slug } }, { status: 201 });
}
