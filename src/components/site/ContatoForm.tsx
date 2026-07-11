"use client";

// src/components/site/ContatoForm.tsx
//
// RF-LEAD-01 a 04 — formulário conectado a POST /api/leads.
// RF-LEAD-03: checkbox de consentimento LGPD é obrigatório antes do envio
// (não estava no mockup original — é exigência legal, ver
// Requisitos_Site_PEIx_v1.1).

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

const CARGOS = [
  { valor: "DIRETOR_PEDAGOGICO", label: "Diretor(a) pedagógico(a)" },
  { valor: "MANTENEDOR_DONO", label: "Mantenedor(a) / Dono(a)" },
  { valor: "COORDENADOR_INCLUSAO", label: "Coordenador(a) de inclusão" },
  { valor: "PROFESSOR_AEE", label: "Professor(a) de AEE" },
  { valor: "OUTRO", label: "Outro" },
];

const SEGMENTOS = [
  { valor: "EDUCACAO_INFANTIL", label: "Educação Infantil" },
  { valor: "FUNDAMENTAL_1", label: "Ensino Fundamental 1" },
  { valor: "FUNDAMENTAL_2", label: "Ensino Fundamental 2" },
  { valor: "ENSINO_MEDIO", label: "Ensino Médio" },
];

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

type Status = "idle" | "enviando" | "sucesso" | "erro";

export function ContatoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);
  const [segmentosSelecionados, setSegmentosSelecionados] = useState<string[]>([]);

  function alternarSegmento(valor: string) {
    setSegmentosSelecionados((atual) =>
      atual.includes(valor) ? atual.filter((s) => s !== valor) : [...atual, valor],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("enviando");
    setErro(null);

    const form = new FormData(event.currentTarget);

    const payload = {
      nome: form.get("nome"),
      email: form.get("email"),
      telefone: form.get("telefone") || undefined,
      instituicao: form.get("instituicao") || undefined,
      cidade: form.get("cidade") || undefined,
      uf: form.get("uf") || undefined,
      cargo: form.get("cargo") || undefined,
      segmentos: segmentosSelecionados,
      querDemo: form.get("querDemo") === "on",
      consentimentoLgpd: form.get("consentimentoLgpd") === "on",
    };

    try {
      const resposta = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        throw new Error(corpo?.erro ? "Confira os campos obrigatórios." : "Falha no envio.");
      }

      setStatus("sucesso");
    } catch (e) {
      setStatus("erro");
      setErro(e instanceof Error ? e.message : "Não foi possível enviar. Tente novamente.");
    }
  }

  if (status === "sucesso") {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 text-emerald-400" size={32} aria-hidden />
        <h3 className="mb-2 text-lg font-semibold text-white">Recebemos seu contato!</h3>
        <p className="text-sm text-slate-300">
          Enviamos uma confirmação e um material informativo para o seu e-mail.
          Nosso representante vai falar com você em breve.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome completo" required>
          <input name="nome" type="text" required className="input" />
        </Field>
        <Field label="E-mail institucional" required>
          <input name="email" type="email" required className="input" />
        </Field>

        <Field label="Telefone / WhatsApp">
          <input name="telefone" type="tel" className="input" />
        </Field>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Field label="Cidade">
            <input name="cidade" type="text" className="input" />
          </Field>
          <Field label="UF">
            <select name="uf" className="input">
              <option value="">—</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Instituição de ensino">
            <input name="instituicao" type="text" className="input" />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Cargo">
            <select name="cargo" className="input">
              <option value="">Selecione seu cargo</option>
              {CARGOS.map(({ valor, label }) => (
                <option key={valor} value={valor}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 text-sm text-slate-300">Segmentos atendidos</p>
          <div className="grid grid-cols-2 gap-2">
            {SEGMENTOS.map(({ valor, label }) => (
              <label
                key={valor}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300"
              >
                <input
                  type="checkbox"
                  checked={segmentosSelecionados.includes(valor)}
                  onChange={() => alternarSegmento(valor)}
                  className="rounded border-white/20 bg-transparent"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
          <input name="querDemo" type="checkbox" className="rounded border-white/20 bg-transparent" />
          Quero agendar uma demonstração guiada
        </label>

        <label className="flex items-start gap-2 text-xs text-slate-400 sm:col-span-2">
          <input
            name="consentimentoLgpd"
            type="checkbox"
            required
            className="mt-0.5 shrink-0 rounded border-white/20 bg-transparent"
          />
          <span>
            Autorizo o tratamento dos meus dados de acordo com a{" "}
            <a
              href="/politica-de-privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-200"
            >
              Política de Privacidade
            </a>
            .
          </span>
        </label>
      </div>

      {status === "erro" && (
        <p className="mt-4 text-sm text-red-400">{erro}</p>
      )}

      <Button type="submit" disabled={status === "enviando"} className="mt-6 w-full sm:w-auto">
        {status === "enviando" ? "Enviando..." : "Enviar e agendar conversa"}
      </Button>
    </form>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-1.5 block">
        {label} {required && <span className="text-indigo-400">*</span>}
      </span>
      {children}
    </label>
  );
}
