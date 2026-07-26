"use client";

// src/components/site/NewsletterForm.tsx — RF-BLOG-03
//
// Formulário de inscrição na newsletter (nome + e-mail), reusado na
// listagem do blog e ao final de cada post. Conectado a
// POST /api/newsletter/subscribe (double opt-in — RF-BLOG-04).

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Mail, CheckCircle2 } from "lucide-react";

type Status = "idle" | "enviando" | "sucesso" | "erro";

export function NewsletterForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("enviando");
    setErro(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      nome: (form.get("nome") as string)?.trim() || undefined,
      email: form.get("email"),
    };

    try {
      const resposta = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const corpo = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(typeof corpo?.erro === "string" ? corpo.erro : "Confira o e-mail informado.");
      }

      setStatus("sucesso");
    } catch (e) {
      setStatus("erro");
      setErro(e instanceof Error ? e.message : "Não foi possível concluir a inscrição.");
    }
  }

  if (status === "sucesso") {
    return (
      <div className={`rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center ${className}`}>
        <CheckCircle2 className="mx-auto mb-2 text-emerald-400" size={24} aria-hidden />
        <p className="text-sm text-slate-200">
          Quase lá! Enviamos um e-mail de confirmação — clique no link pra ativar sua inscrição.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md ${className}`}
    >
      <div className="mb-3 flex items-center gap-2 text-white">
        <Mail size={18} aria-hidden className="text-indigo-400" />
        <p className="font-semibold">Receba os próximos posts por e-mail</p>
      </div>
      <p className="mb-4 text-sm text-slate-400">
        Sem spam. Você pode se descadastrar quando quiser.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="nome"
          type="text"
          placeholder="Seu nome (opcional)"
          className="input sm:w-1/3"
        />
        <input name="email" type="email" required placeholder="Seu e-mail" className="input" />
        <Button type="submit" disabled={status === "enviando"} className="shrink-0">
          {status === "enviando" ? "Enviando..." : "Inscrever"}
        </Button>
      </div>
      {status === "erro" && <p className="mt-3 text-sm text-red-400">{erro}</p>}
    </form>
  );
}
