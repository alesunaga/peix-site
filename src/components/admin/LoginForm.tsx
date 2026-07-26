"use client";

// src/components/admin/LoginForm.tsx — RF-ADMIN-01

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "enviando" | "erro";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("enviando");
    setErro(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      email: form.get("email"),
      senha: form.get("senha"),
    };

    try {
      const resposta = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const corpo = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(corpo?.erro ?? "Não foi possível entrar. Tente novamente.");
      }

      const destino = searchParams.get("redirecionarPara") || "/admin";
      router.push(destino);
      router.refresh();
    } catch (e) {
      setStatus("erro");
      setErro(e instanceof Error ? e.message : "Não foi possível entrar. Tente novamente.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
    >
      <div className="grid gap-5">
        <label className="block text-sm text-slate-300">
          <span className="mb-1.5 block">E-mail</span>
          <input name="email" type="email" required autoComplete="email" className="input" />
        </label>

        <label className="block text-sm text-slate-300">
          <span className="mb-1.5 block">Senha</span>
          <input
            name="senha"
            type="password"
            required
            autoComplete="current-password"
            className="input"
          />
        </label>
      </div>

      {status === "erro" && <p className="mt-4 text-sm text-red-400">{erro}</p>}

      <Button type="submit" disabled={status === "enviando"} className="mt-6 w-full">
        {status === "enviando" ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
