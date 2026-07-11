// src/components/site/InversionSection.tsx
import { X, Check } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const MERCADO_ATUAL = [
  "Sistema exige preenchimento manual do PEI",
  "Professor enxerga apenas trabalho adicional",
  "Adoção baixíssima — registros ficam desatualizados",
];

const INVERSAO_PEIX = [
  "Professor acessa para criar um PEI em minutos",
  "Ganha tempo no planejamento diário",
  "O registro pedagógico acontece como efeito colateral",
  "Conformidade legal sem esforço extra",
];

export function InversionSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>O Foco Central — Adoção Docente</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          A dor que o mercado{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            não resolveu
          </span>
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Sistemas de gestão escolar falham onde mais importa: o professor não usa.
          Enquanto as plataformas atuais representam trabalho adicional sem retorno
          percebido, o PEIx <strong className="text-white">inverte essa relação</strong>.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <X size={16} aria-hidden />
            </span>
            <h3 className="font-semibold text-white">O mercado atual</h3>
          </div>
          <ol className="space-y-3">
            {MERCADO_ATUAL.map((item, i) => (
              <li key={item} className="flex gap-3 text-sm text-slate-300">
                <span className="text-slate-500">{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </Card>

        <Card className="border-indigo-500/30 bg-indigo-500/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <Check size={16} aria-hidden />
            </span>
            <h3 className="font-semibold text-white">A inversão do PEIx</h3>
          </div>
          <ol className="space-y-3">
            {INVERSAO_PEIX.map((item, i) => (
              <li key={item} className="flex gap-3 text-sm text-slate-300">
                <span className="text-indigo-400">{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card className="mt-6 p-10 text-center">
        <p className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
          O professor acessa para{" "}
          <span className="text-indigo-400">ganhar tempo</span>. A conformidade
          acontece como <span className="text-purple-400">efeito colateral</span>.
        </p>
        <p className="mt-3 text-sm text-slate-400">
          É por isso que a adoção não é uma promessa — é a consequência natural do design.
        </p>
      </Card>
    </section>
  );
}
