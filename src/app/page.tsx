// src/app/page.tsx
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { DefinicaoSection } from "@/components/site/DefinicaoSection";
import { ProblemSection } from "@/components/site/ProblemSection";
import { ViradaSection } from "@/components/site/ViradaSection";
import { VozEstudanteHomeSection } from "@/components/site/VozEstudanteHomeSection";
import { IaSection } from "@/components/site/IaSection";
import { PortasSection } from "@/components/site/PortasSection";
import { ImplantationSection } from "@/components/site/ImplantationSection";
import { FaqSection } from "@/components/site/FaqSection";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DefinicaoSection />
        <ProblemSection />
        <ViradaSection />
        <VozEstudanteHomeSection />
        <IaSection />
        <PortasSection />
        <ImplantationSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
