// src/components/site/ViradaSection.tsx
import { Camera, Activity } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

export function ViradaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>A Virada</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          O PEI é anual porque escrever um PEI custa caro.{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Não porque as crianças mudem uma vez por ano.
          </span>
        </h2>
      </div>

      <div className="mx-auto mt-8 max-w-3xl space-y-4 text-lg text-slate-300">
        <p>
          São seis, dez horas de trabalho coletivo por documento. Foi esse custo
          — não o ritmo do aluno — que definiu o calendário do PEI. O resultado é
          que quase todo PEI está desatualizado quase o tempo todo: uma
          fotografia de março orientando decisões de setembro.
        </p>
        <p>
          O Decreto nº 12.773/2025 pede atualização contínua. Até agora, isso não
          fechava na conta de horas de escola nenhuma.
        </p>
        <p className="text-white">
          O PEIx derruba o custo de revisar. E quando revisar deixa de doer, o
          PEI para de ser documento e vira outra coisa.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-500/15 text-slate-400">
              <Camera size={16} aria-hidden />
            </span>
            <h3 className="font-semibold text-white">Antes</h3>
          </div>
          <p className="text-slate-300">
            Uma fotografia anual, escrita por uma pessoa, a partir de um pedaço
            da informação.
          </p>
        </Card>

        <Card className="border-indigo-500/30 bg-indigo-500/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
              <Activity size={16} aria-hidden />
            </span>
            <h3 className="font-semibold text-white">Agora</h3>
          </div>
          <p className="text-slate-300">
            Um modelo vivo do aluno, alimentado por todos que convivem com ele.{" "}
            <strong className="font-semibold text-white">
              Inclusive ele mesmo.
            </strong>
          </p>
        </Card>
      </div>
    </section>
  );
}
