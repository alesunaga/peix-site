// src/app/api/admin/posts/route.ts — RF-ADMIN-05
//
// POST — cria um post. A listagem (GET) é feita direto no Server Component
// de /admin/posts, seguindo o mesmo padrão de leads/assinantes.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
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

const postSchema = z
  .object({
    titulo: z.string().min(3, "Título muito curto."),
    slug: z.string().min(3).optional(),
    resumo: z.string().min(3, "Resumo muito curto."),
    conteudo: z.string().min(1, "Conteúdo não pode ficar vazio."),
    categoria: z.enum(CATEGORIAS),
    status: z.enum(STATUS).default("RASCUNHO"),
    // RF-ADMIN-12: obrigatório e precisa ser futuro quando status = AGENDADO.
    publicadoEm: z.coerce.date().optional(),
  })
  .refine((dados) => dados.status !== "AGENDADO" || (dados.publicadoEm && dados.publicadoEm > new Date()), {
    message: "Informe uma data/hora futura para agendar a publicação.",
    path: ["publicadoEm"],
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
      publicadoEm:
        dados.status === "PUBLICADO"
          ? new Date()
          : dados.status === "AGENDADO"
            ? dados.publicadoEm
            : null,
      autorId: admin.id,
    },
  });

  // Publicação imediata dispara a newsletter (RF-BLOG-05) do mesmo jeito que
  // o job de agendamento (RF-ADMIN-12) — best-effort (mesmo padrão de
  // enviarEmailsSemBloquear, §8 da arquitetura): aguarda o disparo terminar,
  // mas uma falha aqui nunca derruba a resposta de criação do post, que já
  // foi gravado com sucesso.
  if (post.status === "PUBLICADO") {
    try {
      await dispararNewsletterPost(post);
    } catch (e) {
      console.error("[posts] Falha ao disparar newsletter na publicação imediata:", e);
    }
  }

  return NextResponse.json({ ok: true, post: { id: post.id, slug: post.slug } }, { status: 201 });
}
