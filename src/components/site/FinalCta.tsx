// src/components/site/FinalCta.tsx
import { ButtonLink } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 0%, rgba(99,102,241,0.2), transparent)",
        }}
      />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Sua escola pronta para a fiscalização.{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Seus professores com mais tempo.
          </span>
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Agende uma conversa de 30 minutos para ver o sistema. Sem apresentação
          de vendas — o produto na tela e as suas perguntas.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/contato" withArrow>
            Ver o sistema por dentro
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
