"use client";

// src/components/site/FaqSection.tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PERGUNTAS = [
  {
    pergunta: "O PEIx atende às exigências do Decreto nº 12.773/2025?",
    resposta:
      "Sim. O PEI é estruturado nas 7 seções exigidas pela legislação, com versionamento automático e imutável — cada revisão fica registrada, pronta para fiscalização.",
  },
  {
    pergunta: "Como o sistema protege os dados sensíveis dos alunos?",
    resposta:
      "Nomes e RAs são removidos (pseudoanonimização) antes de qualquer processamento em IA externa, em conformidade com o Art. 11 da LGPD.",
  },
  {
    pergunta: "Os professores realmente vão adotar mais uma ferramenta?",
    resposta:
      "O PEIx foi desenhado para que o professor ganhe tempo no primeiro dia de uso — a adoção é consequência do valor imediato, não de uma obrigação.",
  },
  {
    pergunta: "A adaptação de provas é genérica ou individual?",
    resposta:
      "Individual. O adaptador gera as adaptações questão a questão, a partir do PEI específico de cada aluno — nunca de diagnósticos genéricos.",
  },
  {
    pergunta: "O PEI é obrigatório também em escolas particulares?",
    resposta:
      "Sim. O Decreto nº 12.773/2025 e a Lei Brasileira de Inclusão (Lei nº 13.146/2015) se aplicam a escolas públicas e privadas.",
  },
];

export function FaqSection() {
  const [abertoIndex, setAbertoIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <div className="text-center">
        <Eyebrow>Dúvidas Frequentes</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Objeções técnicas e jurídicas, resolvidas
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
