// src/app/recursos/page.tsx
import { Navbar } from "@/components/site/Navbar";
import { RecursosHero } from "@/components/site/RecursosHero";
import { PeiSectionsGrid } from "@/components/site/PeiSectionsGrid";
import { HubAppsSection } from "@/components/site/HubAppsSection";
import { SegurancaSection } from "@/components/site/SegurancaSection";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Recursos — PEIx",
  description:
    "Detalhamento técnico do PEIx: as 7 seções legais do PEI, o Hub de Apps de IA (M-07) e a segurança de dados sensíveis.",
};

export default function RecursosPage() {
  return (
    <>
      <Navbar />
      <main>
        <RecursosHero />
        <PeiSectionsGrid />
        <HubAppsSection />
        <SegurancaSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
