// src/app/admin/(painel)/usuarios/page.tsx
import { EmConstrucao } from "@/components/admin/EmConstrucao";

export default function AdminUsuariosPage() {
  return (
    <EmConstrucao
      titulo="Usuários"
      descricao="Convite de novos administradores, CRUD e desativação de acesso (sem exclusão física)."
      requisitos="RF-ADMIN-06, 07, 08"
    />
  );
}
