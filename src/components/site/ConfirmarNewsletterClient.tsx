"use client";

// src/components/site/ConfirmarNewsletterClient.tsx — RF-BLOG-04
//
// Dispara a confirmação assim que a página carrega (via useEffect, não no
// GET da página em si — evita que um pre-fetch automático de link por
// scanner de e-mail confirme a inscrição sem o visitante ter clicado de verdade).

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

type Status = "carregando" | "sucesso" | "erro";

export function ConfirmarNewsletterClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("carregando");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("erro");
      setErro("Link de confirmação inválido — falta o token.");
      return;
    }

    let cancelado = false;

    (async () => {
      try {
        const resposta = await fetch("/api/newsletter/confirmar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const corpo = await resposta.json().catch(() => null);
        if (!resposta.ok) throw new Error(corpo?.erro ?? "Não foi possível confirmar a inscrição.");
        if (!cancelado) setStatus("sucesso");
      } catch (e) {
        if (!cancelado) {
          setStatus("erro");
          setErro(e instanceof Error ? e.message : "Não foi possível confirmar a inscrição.");
        }
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [token]);

  if (status === "carregando") {
    return <p className="text-center text-sm text-slate-400">Confirmando sua inscrição...</p>;
  }

  if (status === "erro") {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <XCircle className="mx-auto mb-3 text-red-400" size={32} aria-hidden />
        <h1 className="mb-2 text-lg font-semibold text-white">Não foi possível confirmar</h1>
        <p className="text-sm text-slate-300">{erro}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
      <CheckCircle2 className="mx-auto mb-3 text-emerald-400" size={32} aria-hidden />
      <h1 className="mb-2 text-lg font-semibold text-white">Inscrição confirmada!</h1>
      <p className="text-sm text-slate-300">
        Você vai receber um aviso por e-mail sempre que publicarmos um novo post no blog.
      </p>
    </div>
  );
}
