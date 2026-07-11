// src/components/site/HubAppsSection.tsx
import { RefreshCw, Wand2, ClipboardCheck } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const APPS = [
  {
    icon: RefreshCw,
    titulo: "Adaptador Automático de Provas",
    texto:
      "Adapta questão a questão com base no PEI individual do aluno — nunca em diagnósticos genéricos.",
  },
  {
    icon: Wand2,
    titulo: "Criador de Atividades Pedagógicas",
    texto: "Gera atividades sob medida, alinhadas às metas e adaptações de cada estudante.",
  },
  {
    icon: ClipboardCheck,
    titulo: "Gerador de Protocolos de Conduta",
    texto: "Cria protocolos de conduta comportamental estruturados e prontos para aplicação.",
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
