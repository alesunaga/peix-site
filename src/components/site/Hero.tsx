// src/components/site/Hero.tsx
import { ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradiente radial de fundo — conceito Aurora */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(99,102,241,0.25), transparent), radial-gradient(50% 40% at 90% 10%, rgba(168,85,247,0.18), transparent)",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-300">
            <ShieldCheck size={14} className="text-emerald-400" aria-hidden />
            Conforme o Decreto Federal nº 12.773/2025
          </div>

          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            O PEI deixou de ser{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              uma sobrecarga.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-slate-300">
            O PEIx transforma a gestão do Plano Educacional Individualizado em uma
            rotina leve. Inteligência artificial que devolve horas ao professor e
            garante a conformidade legal da sua escola — sem planilhas, Word ou
            grupos de WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/contato" withArrow>
              Agendar demonstração
            </ButtonLink>
            <ButtonLink href="/recursos" variant="secondary">
              Explorar recursos
            </ButtonLink>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <Card className="p-6 shadow-2xl shadow-indigo-950/50">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-slate-400">peix.app / pei / aluno-2048</span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4">
        <div className="space-y-1">
          {["Identificação", "Metas SMART", "Adaptações", "Família"].map((item, i) => (
            <div
              key={item}
              className={`rounded-lg px-3 py-2 text-sm ${
                i === 1
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-sm font-medium text-white">Meta SMART — Leitura</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-indigo-500" />
            </div>
            <p className="mt-1 text-xs text-slate-400">72% concluída</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-lg font-semibold text-white">14</p>
              <p className="text-xs text-slate-400">Provas adaptadas</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-lg font-semibold text-white">37</p>
              <p className="text-xs text-slate-400">Alunos ativos</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <ShieldCheck size={14} aria-hidden />
            Versão imutável registrada — conforme Decreto 12.773/2025
          </div>
        </div>
      </div>
    </Card>
  );
}
