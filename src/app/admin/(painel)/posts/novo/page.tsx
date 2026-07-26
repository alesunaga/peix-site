// src/app/admin/(painel)/posts/novo/page.tsx — RF-ADMIN-05
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PostForm } from "@/components/admin/PostForm";

export default function NovoPostPage() {
  return (
    <div>
      <Eyebrow>Painel Admin</Eyebrow>
      <h1 className="mb-6 text-2xl font-semibold text-white">Novo post</h1>
      <PostForm modo="criar" />
    </div>
  );
}
