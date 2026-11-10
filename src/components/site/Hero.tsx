// src/components/site/Hero.tsx
import { ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { AlunoOrbita } from "@/components/site/AlunoOrbita";

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
            Ninguém, sozinho, conhece esse aluno{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              por inteiro.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-slate-300">
            A professora vê uma parte. O AEE vê outra. O acompanhante vê o dia a
            dia. A família vê o que a escola nunca vê. E o próprio estudante sabe
            coisas que ninguém pensou em perguntar.
          </p>

          <p className="mt-4 max-w-lg text-lg text-slate-300">
            O PEIx reúne tudo isso num{" "}
            <strong className="font-semibold text-white">
              modelo vivo do aluno
            </strong>{" "}
            — que se atualiza o ano inteiro, não uma vez por ano.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/contato" withArrow>
              Ver o sistema por dentro
            </ButtonLink>
            <ButtonLink href="/diagnostico" variant="accent" withArrow>
              Diagnóstico gratuito
            </ButtonLink>
            <ButtonLink href="/recursos" variant="secondary">
              Explorar recursos
            </ButtonLink>
          </div>
        </div>

        <AlunoOrbita />
      </div>
    </section>
  );
}
