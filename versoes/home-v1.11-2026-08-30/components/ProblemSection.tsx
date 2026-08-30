// src/components/site/ProblemSection.tsx
import { AlertTriangle, MessagesSquare, Clock, Scale } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const PROBLEMAS = [
  {
    icon: AlertTriangle,
    titulo: "PEIs perdidos no Word",
    texto:
      "Documentos soltos, versões duplicadas e nenhum histórico do que mudou. Na fiscalização, ninguém encontra o arquivo certo.",
  },
  {
    icon: MessagesSquare,
    titulo: "Combinados no WhatsApp",
    texto:
      "Decisões pedagógicas importantes se perdem em grupos de mensagens, sem registro formal nem rastreabilidade.",
  },
  {
    icon: Clock,
    titulo: "Professores sobrecarregados",
    texto:
      "Horas de planejamento manual para adaptar cada prova e atividade. A equipe se esgota antes de chegar ao aluno.",
  },
  {
    icon: Scale,
    titulo: "Risco jurídico crescente",
    texto:
      "Sem PEI estruturado e versionado, a escola fica exposta às exigências do Decreto 12.773/2025 e da LBI.",
  },
];

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <Eyebrow>O Problema</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Gerir inclusão em ferramentas improvisadas custa caro
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          A obrigatoriedade do PEI chegou. As ferramentas de sempre não acompanharam.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROBLEMAS.map(({ icon: Icon, titulo, texto }) => (
          <Card key={titulo} className="p-6">
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
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
