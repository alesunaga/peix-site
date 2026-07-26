"use client";

// src/components/admin/ResetarSenhaForm.tsx — RF-ADMIN-08

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "enviando" | "sucesso" | "erro";

export function ResetarSenhaForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setStatus("erro");
      setErro("Link inválido — falta o token.");
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
      const resposta = await fetch("/api/admin/auth/resetar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, senha }),
      });
      const corpo = await resposta.json().catch(() => null);
      if (!resposta.ok) throw new Error(corpo?.erro ?? "Não foi possível redefinir a senha.");

      setStatus("sucesso");
    } catch (e) {
      setStatus("erro");
      setErro(e instanceof Error ? e.message : "Não foi possível redefinir a senha.");
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300">
        Link inválido ou incompleto. Solicite uma nova redefinição.
      </div>
    );
  }

  if (status === "sucesso") {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center text-sm text-slate-200">
        Senha redefinida.{" "}
        <Link href="/admin/login" className="underline">
          Fazer login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
    >
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
        {status === "enviando" ? "Salvando..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
