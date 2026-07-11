// src/components/site/ContatoIntro.tsx
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const CHECKLIST_ESTATICO = [
  "Demonstração com dados fictícios da Escola Demo",
  "Onboarding assistido dos primeiros PEIs",
];

export function ContatoIntro() {
  return (
    <div>
      <Eyebrow>Contato & Qualificação</Eyebrow>
      <h1 className="text-3xl font-bold text-white sm:text-4xl">
        Sua escola está pronta para o PEI?
      </h1>
      <p className="mt-4 text-slate-300">
        Conte-nos sobre a sua instituição. Preparamos uma abordagem sob medida
        para o seu contexto — sem discurso genérico de vendas.
      </p>

      <ul className="mt-6 space-y-3">
        <li>
          <Link
            href="/diagnostico"
            className="flex items-start gap-2 text-sm text-slate-300 hover:text-white"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden />
            Diagnóstico gratuito do nível de conformidade da sua escola
            <ArrowRight size={14} className="mt-0.5 shrink-0" aria-hidden />
          </Link>
        </li>
        {CHECKLIST_ESTATICO.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">
        <ShieldCheck size={18} aria-hidden />
        Conformidade legal garantida
      </div>
    </div>
  );
}
