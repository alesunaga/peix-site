// src/app/diagnostico/page.tsx
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { DiagnosticoWizard } from "@/components/site/DiagnosticoWizard";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata = {
  title: "Diagnóstico de Conformidade — PEIx",
  description: "Descubra em poucos minutos o nível de conformidade da sua escola com o PEI.",
};

export default function DiagnosticoPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 0%, rgba(99,102,241,0.2), transparent)",
          }}
        />
        <div className="mx-auto max-w-3xl px-6 pt-16 text-center">
          <Eyebrow>Diagnóstico Gratuito</Eyebrow>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Qual o nível de conformidade da sua escola?
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            4 perguntas rápidas. Sem cadastro até o final.
          </p>
        </div>

        <div className="px-6 py-16">
          <DiagnosticoWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
