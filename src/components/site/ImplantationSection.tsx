// src/components/site/ImplantationSection.tsx
import { FileSignature, MonitorCheck, UploadCloud, GraduationCap, PlayCircle } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const ETAPAS = [
  {
    icon: FileSignature,
    numero: "1",
    titulo: "Contratação",
    texto: "Assinatura do contrato e agendamento da implantação. Sem burocracia.",
  },
  {
    icon: MonitorCheck,
    numero: "2",
    titulo: "Instalação",
    texto:
      "Acesso liberado imediatamente via navegador. Sem instalação de software ou hardware — funciona em qualquer dispositivo com internet.",
  },
  {
    icon: UploadCloud,
    numero: "3",
    titulo: "Migração",
    texto: "Importamos os dados da planilha atual do Núcleo para o PEIx automaticamente.",
  },
  {
    icon: GraduationCap,
    numero: "4",
    titulo: "Treinamento",
    texto:
      "Treinamento online ao vivo para Gestor, Professor AEE, Regente e Acompanhantes, com gravação disponível para consulta posterior.",
  },
  {
    icon: PlayCircle,
    numero: "5",
    titulo: "Operação",
    texto: "Sistema ativo. Suporte técnico contínuo incluído.",
  },
];

export function ImplantationSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <Eyebrow>Implantação</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Como o PEIx chega até você
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Simples e sem exigir infraestrutura nova. O sistema roda em qualquer
          navegador.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {ETAPAS.map(({ icon: Icon, numero, titulo, texto }) => (
          <Card key={numero} className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                <Icon size={18} aria-hidden />
              </span>
              <span className="font-mono text-sm text-slate-500">{numero}</span>
            </div>
            <h3 className="mb-2 font-semibold text-white">{titulo}</h3>
            <p className="text-sm text-slate-400">{texto}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
