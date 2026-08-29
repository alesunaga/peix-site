// src/app/recursos/page.tsx
import { Navbar } from "@/components/site/Navbar";
import { RecursosHero } from "@/components/site/RecursosHero";
import { PeiSectionsGrid } from "@/components/site/PeiSectionsGrid";
import { VozDoEstudanteSection } from "@/components/site/VozDoEstudanteSection";
import { HubAppsSection } from "@/components/site/HubAppsSection";
import { SegurancaSection } from "@/components/site/SegurancaSection";
import { SegurancaFaqSection } from "@/components/site/SegurancaFaqSection";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Recursos — PEIx",
  description:
    "Detalhamento técnico do PEIx: as 7 seções legais do PEI, a Voz do Estudante, as ferramentas de Inteligência Artificial e a segurança de dados sensíveis.",
};

export default function RecursosPage() {
  return (
    <>
      <Navbar />
      <main>
        <RecursosHero />
        <PeiSectionsGrid />
        <VozDoEstudanteSection />
        <HubAppsSection />
        <SegurancaSection />
        <SegurancaFaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
