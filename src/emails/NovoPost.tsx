// src/emails/NovoPost.tsx
// RF-BLOG-05/06 — disparado em lote quando um post é publicado.
// Sempre inclui link de descadastro (unsubscribe self-service).

import type { Post } from "@prisma/client";

type Props = { post: Post; unsubscribeToken: string };

export default function NovoPost({ post, unsubscribeToken }: Props) {
  const linkPost = `https://peix.ia.br/blog/${post.slug}`;
  const linkUnsubscribe = `https://peix.ia.br/newsletter/descadastrar?token=${unsubscribeToken}`;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1e1b3a", maxWidth: 560 }}>
      <p>Novo post no blog do PEIx:</p>
      <h2>{post.titulo}</h2>
      <p>{post.resumo}</p>
      <p>
        <a href={linkPost}>Ler o post completo</a>
      </p>
      <hr />
      <p style={{ fontSize: 12, color: "#6b7280" }}>
        Não quer mais receber esses avisos?{" "}
        <a href={linkUnsubscribe}>Cancelar inscrição</a>
      </p>
    </div>
  );
}
