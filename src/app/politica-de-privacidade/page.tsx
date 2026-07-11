// src/app/politica-de-privacidade/page.tsx
//
// RF-SITE-04 — página de Política de Privacidade do site institucional.

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PoliticaPrivacidadeContent } from "@/components/site/PoliticaPrivacidadeContent";

export const metadata = {
  title: "Política de Privacidade — PEIx",
  description:
    "Como o PEIx coleta, usa, armazena e protege os dados pessoais de visitantes do site institucional, em conformidade com a LGPD.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="mx-auto max-w-3xl px-6 pb-6 pt-20 text-center">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Política de Privacidade
          </h1>
        </div>
        <PoliticaPrivacidadeContent />
      </main>
      <Footer />
    </>
  );
}
