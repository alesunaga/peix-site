// src/components/site/SegurancaSection.tsx
//
// NOTA: não recebi um print específico do mockup para esta seção da página
// Recursos — apenas o card resumido "Segurança" que já existe na Home
// (SolutionSection). Estendi o mesmo conteúdo em formato de lista para dar
// mais profundidade técnica, já que é a página de "detalhamento técnico".
// Ajuste/substitua livremente se você já tiver copy definido para aqui.

import { Lock, ShieldCheck, EyeOff, FileClock } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const PONTOS = [
  {
    icon: EyeOff,
    titulo: "Pseudoanonimização antes da IA",
    texto:
      "Nomes e RAs são removidos antes de qualquer processamento em IA externa, em conformidade com o Art. 11 da LGPD.",
  },
  {
    icon: FileClock,
    titulo: "Versionamento imutável",
    texto:
      "Cada revisão do PEI gera um novo registro — nada é sobrescrito, o histórico completo fica disponível para auditoria.",
  },
  {
    icon: ShieldCheck,
    titulo: "Conformidade com o Decreto 12.773/2025",
    texto: "Estrutura do PEI e trilha de auditoria seguem as exigências legais vigentes.",
  },
];

export function SegurancaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <Eyebrow>Segurança</Eyebrow>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Dados sensíveis, tratados com o rigor que a LGPD exige
          </h2>
          <p className="mt-4 text-slate-300">
            O PEIx lida com informações sensíveis de alunos todos os dias — a
            segurança não é um recurso adicional, é parte do desenho do sistema.
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
