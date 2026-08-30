// src/components/site/Hero.tsx
import { ShieldCheck, Quote, Sparkles } from "lucide-react";
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

        <VozPreview />
      </div>
    </section>
  );
}

/**
 * Ilustração da tese da página: o que o estudante declara sobre si alimenta o
 * que o professor recebe como sugestão. Dados fictícios, no mesmo espírito da
 * Escola Demo — nenhum número de resultado é afirmado aqui (ver RN-HOME-02).
 */
function VozPreview() {
  return (
    <Card className="p-6 shadow-2xl shadow-indigo-950/50">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-slate-400">
          peix.app / aluno / voz-do-estudante
        </span>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Quote size={14} className="text-indigo-400" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
              O que a aluna contou
            </p>
          </div>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs italic text-slate-400">
                Como você sente que aprende melhor?
              </dt>
              <dd className="mt-0.5 text-white">Fazendo</dd>
            </div>
            <div>
              <dt className="text-xs italic text-slate-400">
                Quais são seus interesses?
              </dt>
              <dd className="mt-0.5 text-white">Cavalos, desenho</dd>
            </div>
            <div>
              <dt className="text-xs italic text-slate-400">
                O que você gostaria que fosse feito?
              </dt>
              <dd className="mt-0.5 text-white">Sentar perto da professora</dd>
            </div>
          </dl>

          <p className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            Escuta registrada por prancha de comunicação
          </p>
        </div>

        <p aria-hidden className="text-center text-xs text-slate-500">
          ↓
        </p>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-300" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
              Sugestão para a professora de matemática
            </p>
          </div>
          <p className="text-sm text-white">
            Contagem e agrupamento com miniaturas de cavalos
          </p>
          <p className="mt-1 text-xs text-slate-400">
            A professora não participou da escuta. A aluna é que contou.
          </p>
        </div>
      </div>
    </Card>
  );
}
