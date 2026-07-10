// src/components/site/DifferentialSection.tsx
import { Clock, Heart, Zap } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const STATS = [
  {
    icon: Clock,
    titulo: "Até 6h",
    texto: "economizadas por semana em planejamento adaptado",
  },
  {
    icon: Heart,
    titulo: "Adoção real",
    texto: "professores regentes usam porque ganham tempo — não por obrigação",
  },
  {
    icon: Zap,
    titulo: "Minutos",
    texto: "para adaptar uma prova inteira a partir do PEI individual",
  },
];

export function DifferentialSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <Eyebrow>Diferencial</Eyebrow>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Adoção garantida porque o professor ganha tempo no primeiro dia
          </h2>
          <p className="mt-4 text-slate-300">
            A maioria dos sistemas de gestão escolar falha na ponta: o professor
            não usa. O PEIx inverte a lógica — em vez de mais uma tarefa de
            auditoria, entrega ferramentas proativas de IA que reduzem a carga
            diária. O resultado é conformidade que acontece naturalmente.
          </p>
        </div>

        <div className="space-y-4">
          {STATS.map(({ icon: Icon, titulo, texto }) => (
            <Card key={titulo} className="flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-white">{titulo}</p>
                <p className="text-sm text-slate-400">{texto}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
