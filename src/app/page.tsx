// src/app/page.tsx
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { ProblemSection } from "@/components/site/ProblemSection";
import { InversionSection } from "@/components/site/InversionSection";
import { SolutionSection } from "@/components/site/SolutionSection";
import { FlowSection } from "@/components/site/FlowSection";
import { DifferentialSection } from "@/components/site/DifferentialSection";
import { FaqSection } from "@/components/site/FaqSection";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <InversionSection />
        <SolutionSection />
        <FlowSection />
        <DifferentialSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
