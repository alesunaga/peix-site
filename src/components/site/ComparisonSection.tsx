// src/components/site/ComparisonSection.tsx
import { Check, X, Minus } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

type Status = "yes" | "no" | "dash";

type Linha = {
  recurso: string;
  planilha: Status;
  generico: Status;
  peix: Status;
};

const LINHAS: Linha[] = [
  { recurso: "PEI estruturado em 7 seções legais", planilha: "no", generico: "no", peix: "yes" },
  { recurso: "Versionamento automático do PEI", planilha: "no", generico: "no", peix: "yes" },
  { recurso: "Alertas legais automáticos", planilha: "no", generico: "no", peix: "yes" },
  { recurso: "Perfil colaborativo Acompanhante", planilha: "no", generico: "no", peix: "yes" },
  {
    recurso: "Criptografia e gestão de acessos por perfil (LGPD)",
    planilha: "yes",
    generico: "no",
    peix: "yes",
  },
  { recurso: "Importação da planilha atual", planilha: "dash", generico: "no", peix: "yes" },
  { recurso: "Card consolidado do aluno", planilha: "no", generico: "no", peix: "yes" },
  {
    recurso: "IA proativa e progresso pessoal do professor",
    planilha: "no",
    generico: "no",
    peix: "yes",
  },
  { recurso: "Monitoramento contra uso indevido da IA", planilha: "no", generico: "no", peix: "yes" },
];

function StatusIcon({ status }: { status: Status }) {
  if (status === "yes") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        <Check size={16} aria-hidden />
        <span className="sr-only">Sim</span>
      </span>
    );
  }
  if (status === "dash") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-slate-500">
        <Minus size={16} aria-hidden />
        <span className="sr-only">Não se aplica</span>
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-slate-500">
      <X size={16} aria-hidden />
      <span className="sr-only">Não</span>
    </span>
  );
}

export function ComparisonSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <Eyebrow>Comparativo</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Por que o PEIx e não outra solução?
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Planilhas e sistemas de gestão escolar genéricos não foram feitos para o
          PEI. O PEIx foi.
        </p>
      </div>

      <Card className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" className="px-6 py-4 font-medium text-slate-400">
                Recurso
              </th>
              <th scope="col" className="px-6 py-4 text-center font-medium text-slate-400">
                Planilha / Controle Manual
              </th>
              <th scope="col" className="px-6 py-4 text-center font-medium text-slate-400">
                Sistema de Gestão Escolar Genérico
              </th>
              <th scope="col" className="px-6 py-4 text-center font-semibold text-indigo-400">
                PEIx
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {LINHAS.map((linha) => (
              <tr key={linha.recurso}>
                <th scope="row" className="px-6 py-4 font-normal text-slate-200">
                  {linha.recurso}
                </th>
                <td className="px-6 py-4 text-center">
                  <StatusIcon status={linha.planilha} />
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusIcon status={linha.generico} />
                </td>
                <td className="bg-indigo-600/10 px-6 py-4 text-center">
                  <StatusIcon status={linha.peix} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
