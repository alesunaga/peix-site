// src/app/admin/(painel)/usuarios/page.tsx — RF-ADMIN-06/07
//
// Convite de novos administradores, listagem com status e ações
// (reenviar convite, desativar). Sem exclusão física.

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { prisma } from "@/lib/prisma";
import { getAdminAtual } from "@/lib/admin-current";
import { InviteAdminForm } from "@/components/admin/InviteAdminForm";
import { UsuarioRowActions } from "@/components/admin/UsuarioRowActions";

const STATUS_LABELS: Record<string, string> = {
  CONVIDADO: "Convidado",
  ATIVO: "Ativo",
  DESATIVADO: "Desativado",
};

function badgeClasse(status: string) {
  switch (status) {
    case "ATIVO":
      return "bg-emerald-500/10 text-emerald-400";
    case "CONVIDADO":
      return "bg-amber-500/10 text-amber-400";
    default:
      return "bg-white/5 text-slate-400";
  }
}

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(data);
}

export default async function AdminUsuariosPage() {
  const [adminAtual, usuarios] = await Promise.all([
    getAdminAtual(),
    prisma.adminUser.findMany({
      orderBy: { criadoEm: "asc" },
      include: { convidadoPor: { select: { email: true } } },
    }),
  ]);

  return (
    <div>
      <Eyebrow>Painel Admin</Eyebrow>
      <h1 className="mb-1 text-2xl font-semibold text-white">Usuários</h1>
      <p className="mb-6 text-sm text-slate-400">
        Convide administradores por e-mail — a senha nunca é definida por quem convida. Todo admin
        ativo tem o mesmo nível de acesso (RN-ADMIN-01).
      </p>

      <Card className="mb-6 p-5">
        <p className="mb-3 text-sm font-medium text-white">Convidar administrador</p>
        <InviteAdminForm />
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Convidado por</th>
              <th className="px-4 py-3 font-medium">Desde</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-b border-white/5 text-slate-300 last:border-0">
                <td className="px-4 py-3 text-white">{usuario.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${badgeClasse(usuario.status)}`}>
                    {STATUS_LABELS[usuario.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {usuario.convidadoPor?.email ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                  {formatarData(usuario.criadoEm)}
                </td>
                <td className="px-4 py-3">
                  <UsuarioRowActions
                    id={usuario.id}
                    status={usuario.status}
                    isSelf={usuario.id === adminAtual?.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
