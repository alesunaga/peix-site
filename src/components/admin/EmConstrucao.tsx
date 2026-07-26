// src/components/admin/EmConstrucao.tsx — placeholder para telas do Painel
// Admin ainda não implementadas nesta fase (ver README, "Status atual").

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function EmConstrucao({
  titulo,
  descricao,
  requisitos,
}: {
  titulo: string;
  descricao: string;
  requisitos: string;
}) {
  return (
    <div>
      <Eyebrow>Painel Admin</Eyebrow>
      <h1 className="mb-1 text-2xl font-semibold text-white">{titulo}</h1>
      <p className="mb-8 text-sm text-slate-400">{descricao}</p>

      <Card className="p-6">
        <p className="text-sm text-slate-300">Em construção — chega em uma próxima sessão.</p>
        <p className="mt-1 text-xs text-slate-500">{requisitos}</p>
      </Card>
    </div>
  );
}
