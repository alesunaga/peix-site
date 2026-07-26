// src/app/admin/(painel)/page.tsx — dashboard do Painel Admin (/admin)

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getAdminAtual } from "@/lib/admin-current";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [admin, totalLeads, totalAssinantesConfirmados, totalAdminsAtivos, totalPosts] =
    await Promise.all([
      getAdminAtual(),
      prisma.lead.count(),
      prisma.newsletterSubscriber.count({ where: { status: "CONFIRMADO" } }),
      prisma.adminUser.count({ where: { status: "ATIVO" } }),
      prisma.post.count(),
    ]);

  return (
    <div>
      <Eyebrow>Painel Admin</Eyebrow>
      <h1 className="mb-1 text-2xl font-semibold text-white">Olá, {admin?.email}</h1>
      <p className="mb-8 text-sm text-slate-400">
        Login, sessão, leads, assinantes, usuários e CRUD de posts já disponíveis. Agendamento,
        upload de capa (R2) e link de preview assinado chegam numa próxima sessão — ver RF-ADMIN-10,
        11, 12.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          titulo="Posts"
          descricao={`${totalPosts} post${totalPosts === 1 ? "" : "s"}. Markdown com preview.`}
          status="Pronto"
          href="/admin/posts"
        />
        <StatusCard
          titulo="Leads"
          descricao={`${totalLeads} recebido${totalLeads === 1 ? "" : "s"} — exportação em CSV.`}
          status="Pronto"
          href="/admin/leads"
        />
        <StatusCard
          titulo="Assinantes"
          descricao={`${totalAssinantesConfirmados} confirmado${totalAssinantesConfirmados === 1 ? "" : "s"}.`}
          status="Pronto"
          href="/admin/assinantes"
        />
        <StatusCard
          titulo="Usuários"
          descricao={`${totalAdminsAtivos} admin${totalAdminsAtivos === 1 ? "" : "s"} ativo${totalAdminsAtivos === 1 ? "" : "s"}.`}
          status="Pronto"
          href="/admin/usuarios"
        />
      </div>
    </div>
  );
}

function StatusCard({
  titulo,
  descricao,
  status,
  href,
}: {
  titulo: string;
  descricao: string;
  status: "Pronto" | "Em construção";
  href?: string;
}) {
  const conteudo = (
    <Card className={`p-5 ${href ? "transition-colors hover:bg-white/[0.07]" : ""}`}>
      <p className="mb-1 text-sm font-medium text-white">{titulo}</p>
      <p className="mb-3 text-xs text-slate-400">{descricao}</p>
      <span
        className={`inline-block rounded-full px-2.5 py-1 text-[11px] ${
          status === "Pronto" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-400"
        }`}
      >
        {status}
      </span>
    </Card>
  );

  return href ? <Link href={href}>{conteudo}</Link> : conteudo;
}
