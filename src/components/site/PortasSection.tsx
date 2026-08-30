// src/components/site/PortasSection.tsx
import { Building2, ClipboardCheck, GraduationCap, Heart } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const PORTAS = [
  {
    icon: Building2,
    perfil: "Direção",
    texto:
      "Quando pedirem o documento, ele existe. Relatório da escola inteira por período, com diagnóstico, ciência da família, apoio e reuniões registradas.",
  },
  {
    icon: ClipboardCheck,
    perfil: "Coordenação",
    texto:
      "Você para de descobrir os problemas tarde. O sistema avisa o que está vencendo, quem está sem atividade e qual PEI parou.",
  },
  {
    icon: GraduationCap,
    perfil: "Professor",
    texto:
      "Você não recomeça do zero. O contexto do aluno chega pronto, e as sugestões de meta e atividade partem do que já se sabe sobre ele. O PEI deixa de ser uma sobrecarga.",
  },
  {
    icon: Heart,
    perfil: "Família",
    texto:
      "Um lugar para acompanhar sem precisar pedir: o que seu filho fez, em que áreas avançou, o que está em foco agora.",
  },
];

export function PortasSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <Eyebrow>Quatro portas</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Cada pessoa da escola entra por um motivo diferente
        </h2>
      </div>

      <dl className="mt-12 grid gap-5 sm:grid-cols-2">
        {PORTAS.map(({ icon: Icon, perfil, texto }) => (
          <Card key={perfil} className="p-6">
            <dt className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                <Icon size={18} aria-hidden />
              </span>
              <span className="font-semibold text-white">{perfil}</span>
            </dt>
            <dd className="text-sm text-slate-400">{texto}</dd>
          </Card>
        ))}
      </dl>
    </section>
  );
}
