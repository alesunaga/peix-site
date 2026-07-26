// src/app/admin/(painel)/posts/[id]/page.tsx — RF-ADMIN-05
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PostForm } from "@/components/admin/PostForm";
import { PostDeleteButton } from "@/components/admin/PostDeleteButton";

export default async function EditarPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Eyebrow>Painel Admin</Eyebrow>
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white">Editar post</h1>
        <PostDeleteButton id={post.id} titulo={post.titulo} redirecionarPara="/admin/posts" />
      </div>
      <PostForm
        modo="editar"
        postId={post.id}
        valoresIniciais={{
          titulo: post.titulo,
          slug: post.slug,
          resumo: post.resumo,
          conteudo: post.conteudo,
          categoria: post.categoria,
          status: post.status,
          publicadoEm: post.publicadoEm?.toISOString() ?? null,
          imagemCapaUrl: post.imagemCapaUrl,
        }}
      />
    </div>
  );
}
