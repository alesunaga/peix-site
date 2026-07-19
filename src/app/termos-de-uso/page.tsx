// src/app/termos-de-uso/page.tsx
//
// RF-SITE-06 — página de Termos de Uso do site institucional.

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TermosDeUsoContent } from "@/components/site/TermosDeUsoContent";

export const metadata = {
  title: "Termos de Uso — PEIx",
  description:
    "Termos de Uso do site institucional do PEIx: navegação, funcionalidades, propriedade intelectual e regras de uso.",
};

export default function TermosDeUsoPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="mx-auto max-w-3xl px-6 pb-6 pt-20 text-center">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Termos de Uso</h1>
        </div>
        <TermosDeUsoContent />
      </main>
      <Footer />
    </>
  );
}
