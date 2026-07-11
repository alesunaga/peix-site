// src/components/site/HubAppsSection.tsx
import { Wand2, Target, ClipboardList } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const APPS = [
  {
    icon: Wand2,
    titulo: "Criador de Atividades Pedagógicas",
    texto: "Gera atividades sob medida, alinhadas às metas e adaptações de cada estudante.",
  },
  {
    icon: Target,
    titulo: "Metas e PEI Assistidos por IA",
    texto:
      "Sugere metas SMART e um rascunho inicial do PEI a partir do perfil de aprendizagem do aluno, prontos para revisão do professor.",
  },
  {
    icon: ClipboardList,
    titulo: "Relatórios Personalizados por IA",
    texto:
      "Gera relatórios de acompanhamento individualizados, prontos para compartilhar com a família e a coordenação.",
  },
];

export function HubAppsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Eyebrow>Hub de Aplicativos de Inclusão — M-07</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">
        Ferramentas de IA que apoiam a docência
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-slate-300">
        Inteligência artificial proativa que devolve tempo ao professor no
        planejamento diário.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {APPS.map(({ icon: Icon, titulo, texto }) => (
          <Card key={titulo} className="p-6">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Icon size={20} aria-hidden />
            </span>
            <h3 className="mb-2 font-semibold text-white">{titulo}</h3>
            <p className="text-sm text-slate-400">{texto}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
