"use client";

// src/components/admin/EsqueciSenhaForm.tsx — RF-ADMIN-08

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "enviando" | "enviado" | "erro";

export function EsqueciSenhaForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("enviando");
    setErro(null);

    const email = new FormData(event.currentTarget).get("email");

    try {
      const resposta = await fetch("/api/admin/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!resposta.ok) throw new Error("Não foi possível processar o pedido.");
      setStatus("enviado");
    } catch (e) {
      setStatus("erro");
      setErro(e instanceof Error ? e.message : "Não foi possível processar o pedido.");
    }
  }

  if (status === "enviado") {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300">
        Se o e-mail existir e estiver ativo, enviamos um link de redefinição. Confira sua caixa de
        entrada.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
    >
      <label className="block text-sm text-slate-300">
        <span className="mb-1.5 block">E-mail</span>
        <input name="email" type="email" required autoComplete="email" className="input" />
      </label>

      {status === "erro" && <p className="mt-4 text-sm text-red-400">{erro}</p>}

      <Button type="submit" disabled={status === "enviando"} className="mt-6 w-full">
        {status === "enviando" ? "Enviando..." : "Enviar link de redefinição"}
      </Button>
    </form>
  );
}
