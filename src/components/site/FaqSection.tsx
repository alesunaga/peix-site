"use client";

// src/components/site/FaqSection.tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PERGUNTAS = [
  {
    pergunta: "Os dados do meu aluno vão para uma empresa de inteligência artificial?",
    resposta:
      "O conteúdo pedagógico sim; a identidade não. Nome e registro do aluno viram códigos antes de qualquer chamada, e o registro de auditoria guarda quem pediu o quê e quando, sem o conteúdo. A escola também pode operar com a IA desligada, sem nenhuma chamada externa.",
  },
  {
    pergunta: "Ver o aluno por inteiro não é montar um dossiê sobre ele?",
    resposta:
      "Visão completa não significa acesso completo. Cada perfil vê o que precisa para agir: o acompanhante não vê laudo, o professor regente não vê documento, a família vê o próprio filho. A visão inteira existe para o aluno — não para a escola.",
  },
  {
    pergunta: "Precisamos do laudo para começar?",
    resposta:
      "Não. A elegibilidade segue a Nota Técnica nº 04/2014 e a Lei nº 14.254/2021: a criança não espera o diagnóstico para ter um plano.",
  },
];

export function FaqSection() {
  const [abertoIndex, setAbertoIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <div className="text-center">
        <Eyebrow>Dúvidas Frequentes</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          As perguntas que toda escola faz
        </h2>
      </div>

      <div className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
        {PERGUNTAS.map(({ pergunta, resposta }, index) => {
          const aberto = abertoIndex === index;
          return (
            <div key={pergunta}>
              <button
                type="button"
                onClick={() => setAbertoIndex(aberto ? null : index)}
                aria-expanded={aberto}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-white">{pergunta}</span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={`shrink-0 text-slate-400 transition-transform ${
                    aberto ? "rotate-180" : ""
                  }`}
                />
              </button>
              {aberto && (
                <p className="px-6 pb-5 text-sm text-slate-400">{resposta}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
