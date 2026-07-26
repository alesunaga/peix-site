// src/app/admin/(painel)/posts/page.tsx
import { EmConstrucao } from "@/components/admin/EmConstrucao";

export default function AdminPostsPage() {
  return (
    <EmConstrucao
      titulo="Posts"
      descricao="CRUD do blog: editor Markdown com preview, upload de capa (R2), agendamento e link de preview assinado."
      requisitos="RF-ADMIN-05, 09, 10, 11, 12"
    />
  );
}
