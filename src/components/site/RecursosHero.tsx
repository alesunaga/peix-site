// src/components/site/RecursosHero.tsx
import { Eyebrow } from "@/components/ui/Eyebrow";

export function RecursosHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(99,102,241,0.2), transparent)",
        }}
      />
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Eyebrow>Recursos — Detalhamento Técnico</Eyebrow>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Tudo que a coordenação técnica precisa checar
        </h1>
        <p className="mt-6 text-lg text-slate-300">
          Um mergulho nas capacidades operacionais do PEIx, das 7 seções legais do
          PEI ao Hub de Apps de IA (M-07) e à segurança de dados sensíveis.
        </p>
      </div>
    </section>
  );
}
