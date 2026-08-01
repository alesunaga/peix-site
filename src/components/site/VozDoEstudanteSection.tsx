// src/components/site/VozDoEstudanteSection.tsx
import { Mic, Ear, Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const PONTOS = [
  {
    icon: Mic,
    titulo: "Um espaço só do aluno",
    texto:
      "Interesses, como aprende melhor, aspirações e as adaptações que ele mesmo sugere — registrados na voz do próprio estudante, não só sobre ele.",
  },
  {
    icon: Ear,
    titulo: "Escuta em qualquer formato",
    texto:
      "Entrevista direta, com intérprete, por prancha de comunicação ou pela família — sempre registrada e auditável, mesmo quando ainda não foi possível realizá-la.",
  },
  {
    icon: Sparkles,
    titulo: "Alimenta o PEI, o PAEE e a IA",
    texto:
      "O mesmo relato orienta as metas e atividades sugeridas por IA — sem nunca inventar interesses que o aluno não declarou.",
  },
];

export function VozDoEstudanteSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <Eyebrow>Voz do Estudante</Eyebrow>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            O aluno também tem voz no próprio plano pedagógico
          </h2>
          <p className="mt-4 text-slate-300">
            A maioria dos planos de inclusão é escrita sobre o estudante —
            raramente com ele. O PEIx reserva um espaço dedicado para como o
            próprio aluno se percebe na escola.
          </p>
        </div>

        <div className="space-y-4">
          {PONTOS.map(({ icon: Icon, titulo, texto }) => (
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
