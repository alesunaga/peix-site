"use client";

// src/components/admin/UsuarioRowActions.tsx — RF-ADMIN-07

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "CONVIDADO" | "ATIVO" | "DESATIVADO";

export function UsuarioRowActions({
  id,
  status,
  isSelf,
}: {
  id: string;
  status: Status;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function chamar(path: string, confirmacao?: string) {
    if (confirmacao && !window.confirm(confirmacao)) return;

    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(path, { method: "POST" });
      const corpo = await resposta.json().catch(() => null);
      if (!resposta.ok) throw new Error(corpo?.erro ?? "Ação falhou.");
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Ação falhou.");
    } finally {
      setCarregando(false);
    }
  }

  if (isSelf) {
    return <span className="text-xs text-slate-500">Você</span>;
  }

  return (
    <div className="flex items-center gap-3">
      {(status === "CONVIDADO" || status === "DESATIVADO") && (
        <button
          disabled={carregando}
          onClick={() => chamar(`/api/admin/usuarios/${id}/reenviar-convite`)}
          className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
        >
          {status === "DESATIVADO" ? "Reativar (reenviar convite)" : "Reenviar convite"}
        </button>
      )}
      {status === "ATIVO" && (
        <button
          disabled={carregando}
          onClick={() =>
            chamar(`/api/admin/usuarios/${id}/desativar`, "Desativar este administrador?")
          }
          className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
        >
          Desativar
        </button>
      )}
      {erro && <span className="text-xs text-red-400">{erro}</span>}
    </div>
  );
}
