// src/app/contato/page.tsx
import { Navbar } from "@/components/site/Navbar";
import { ContatoIntro } from "@/components/site/ContatoIntro";
import { ContatoForm } from "@/components/site/ContatoForm";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Contato — PEIx",
  description: "Fale com o PEIx e agende uma demonstração para a sua escola.",
};

export default function ContatoPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 50% at 10% 0%, rgba(99,102,241,0.18), transparent)",
          }}
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-start">
          <ContatoIntro />
          <ContatoForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
