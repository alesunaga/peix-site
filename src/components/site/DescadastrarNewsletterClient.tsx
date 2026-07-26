"use client";

// src/components/site/DescadastrarNewsletterClient.tsx — RF-BLOG-06

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

type Status = "carregando" | "sucesso" | "erro";

export function DescadastrarNewsletterClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("carregando");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("erro");
      setErro("Link de descadastro inválido — falta o token.");
      return;
    }

    let cancelado = false;

    (async () => {
      try {
        const resposta = await fetch("/api/newsletter/descadastrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const corpo = await resposta.json().catch(() => null);
        if (!resposta.ok) throw new Error(corpo?.erro ?? "Não foi possível processar o descadastro.");
        if (!cancelado) setStatus("sucesso");
      } catch (e) {
        if (!cancelado) {
          setStatus("erro");
          setErro(e instanceof Error ? e.message : "Não foi possível processar o descadastro.");
        }
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [token]);

  if (status === "carregando") {
    return <p className="text-center text-sm text-slate-400">Processando...</p>;
  }

  if (status === "erro") {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <XCircle className="mx-auto mb-3 text-red-400" size={32} aria-hidden />
        <h1 className="mb-2 text-lg font-semibold text-white">Não foi possível descadastrar</h1>
        <p className="text-sm text-slate-300">{erro}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <CheckCircle2 className="mx-auto mb-3 text-slate-300" size={32} aria-hidden />
      <h1 className="mb-2 text-lg font-semibold text-white">Inscrição cancelada</h1>
      <p className="text-sm text-slate-300">
        Você não vai mais receber avisos de novos posts do blog do PEIx. Se mudar de ideia, pode se
        inscrever de novo a qualquer momento.
      </p>
    </div>
  );
}
