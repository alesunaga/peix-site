// src/components/site/SolutionSection.tsx
import { FileText, Cpu, Lock } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const PILARES = [
  {
    icon: FileText,
    tag: "PEI DIGITAL",
    titulo: "PEI estruturado em 7 seções legais",
    texto:
      "Da identificação do aluno às metas SMART e adaptações por disciplina, com versionamento automático e imutável a cada revisão.",
  },
  {
    icon: Cpu,
    tag: "HUB M-07",
    titulo: "Apps de IA para a docência",
    texto:
      "Adaptador automático de provas por questão, criador de atividades sob medida e gerador de protocolos de conduta — tudo a partir do PEI individual.",
  },
  {
    icon: Lock,
    tag: "SEGURANÇA",
    titulo: "Conformidade robusta com a LGPD",
    texto:
      "Pseudoanonimização remove nomes e RAs antes de qualquer processamento em IA externa, em estrita conformidade com o Art. 11 da LGPD.",
  },
];

export function SolutionSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <Eyebrow>A Solução</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Uma plataforma que trabalha ao lado do professor
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Três pilares que transformam obrigação legal em ganho pedagógico real.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PILARES.map(({ icon: Icon, tag, titulo, texto }) => (
          <Card key={tag} className="p-6">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Icon size={20} aria-hidden />
            </span>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-400">
              {tag}
            </p>
            <h3 className="mb-2 text-lg font-semibold text-white">{titulo}</h3>
            <p className="text-sm text-slate-400">{texto}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
