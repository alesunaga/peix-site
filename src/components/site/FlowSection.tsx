// src/components/site/FlowSection.tsx
import { ClipboardList, Sparkles, LineChart, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const ETAPAS = [
  {
    icon: ClipboardList,
    numero: "01",
    titulo: "Estruture o PEI",
    texto:
      "A coordenação cria o plano em 7 seções guiadas, com metas SMART e adaptações por disciplina.",
  },
  {
    icon: Sparkles,
    numero: "02",
    titulo: "A IA adapta o dia a dia",
    texto:
      "Professores geram provas e atividades adaptadas em minutos, direto do PEI de cada aluno.",
  },
  {
    icon: LineChart,
    numero: "03",
    titulo: "Acompanhe a evolução",
    texto: "Registro contínuo de progresso e revisões periódicas, com histórico imutável de cada mudança.",
  },
  {
    icon: ShieldCheck,
    numero: "04",
    titulo: "Comprove conformidade",
    texto:
      "Relatórios prontos para fiscalização, atendendo ao Decreto 12.773/2025 e à LBI.",
  },
];

export function FlowSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <Eyebrow>O Fluxo</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Da obrigação legal ao ganho pedagógico
        </h2>
      </div>

      <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Linha conectando as etapas — só faz sentido em telas largas, onde a ordem lê como sequência real */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-6 hidden h-px bg-white/10 lg:block"
        />

        {ETAPAS.map(({ icon: Icon, numero, titulo, texto }) => (
          <li key={numero} className="relative">
            <span className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#05040f] text-indigo-400">
              <Icon size={20} aria-hidden />
            </span>
            <p className="mb-1 text-xs font-mono text-slate-500">{numero}</p>
            <h3 className="mb-2 font-semibold text-white">{titulo}</h3>
            <p className="text-sm text-slate-400">{texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
