"use client";

// src/components/admin/PostDeleteButton.tsx — RF-ADMIN-05

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PostDeleteButton({
  id,
  titulo,
  redirecionarPara,
}: {
  id: string;
  titulo: string;
  /** Se informado, navega pra cá após excluir em vez de só recarregar a lista atual. */
  redirecionarPara?: string;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm(`Excluir o post "${titulo}"? Essa ação não pode ser desfeita.`)) return;

    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const corpo = await resposta.json().catch(() => null);
      if (!resposta.ok) throw new Error(corpo?.erro ?? "Não foi possível excluir.");

      if (redirecionarPara) {
        router.push(redirecionarPara);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível excluir.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDelete}
        disabled={carregando}
        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
      >
        Excluir
      </button>
      {erro && <span className="text-xs text-red-400">{erro}</span>}
    </div>
  );
}
