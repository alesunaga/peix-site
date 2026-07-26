"use client";

// src/components/admin/InviteAdminForm.tsx — RF-ADMIN-06

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "enviando" | "erro" | "sucesso";

export function InviteAdminForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setStatus("enviando");
    setErro(null);

    const email = new FormData(formEl).get("email");

    try {
      const resposta = await fetch("/api/admin/usuarios/convidar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const corpo = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(corpo?.erro ?? "Não foi possível enviar o convite.");
      }

      setStatus("sucesso");
      formEl.reset();
      router.refresh();
    } catch (e) {
      setStatus("erro");
      setErro(e instanceof Error ? e.message : "Não foi possível enviar o convite.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-start gap-2">
      <input
        name="email"
        type="email"
        required
        placeholder="email@exemplo.com"
        className="input max-w-xs"
      />
      <Button type="submit" disabled={status === "enviando"}>
        {status === "enviando" ? "Enviando..." : "Convidar"}
      </Button>
      {status === "erro" && <p className="w-full text-sm text-red-400">{erro}</p>}
      {status === "sucesso" && (
        <p className="w-full text-sm text-emerald-400">Convite enviado.</p>
      )}
    </form>
  );
}
