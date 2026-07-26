"use client";

// src/components/admin/AtivarContaForm.tsx — RF-ADMIN-06

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "enviando" | "erro";

export function AtivarContaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setStatus("erro");
      setErro("Link de convite inválido — falta o token.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const senha = String(form.get("senha") ?? "");
    const confirmarSenha = String(form.get("confirmarSenha") ?? "");

    if (senha !== confirmarSenha) {
      setStatus("erro");
      setErro("As senhas não coincidem.");
      return;
    }

    setStatus("enviando");
    setErro(null);

    try {
      const resposta = await fetch("/api/admin/auth/ativar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, senha }),
      });
      const corpo = await resposta.json().catch(() => null);
      if (!resposta.ok) throw new Error(corpo?.erro ?? "Não foi possível ativar a conta.");

      router.push("/admin");
      router.refresh();
    } catch (e) {
      setStatus("erro");
      setErro(e instanceof Error ? e.message : "Não foi possível ativar a conta.");
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300">
        Link de convite inválido ou incompleto. Peça um novo convite ao administrador.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
    >
      <p className="mb-5 text-sm text-slate-300">Defina a senha da sua conta para ativá-la.</p>
      <div className="grid gap-5">
        <label className="block text-sm text-slate-300">
          <span className="mb-1.5 block">Nova senha</span>
          <input
            name="senha"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input"
          />
        </label>
        <label className="block text-sm text-slate-300">
          <span className="mb-1.5 block">Confirmar senha</span>
          <input
            name="confirmarSenha"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input"
          />
        </label>
      </div>

      {status === "erro" && <p className="mt-4 text-sm text-red-400">{erro}</p>}

      <Button type="submit" disabled={status === "enviando"} className="mt-6 w-full">
        {status === "enviando" ? "Ativando..." : "Ativar conta"}
      </Button>
    </form>
  );
}
