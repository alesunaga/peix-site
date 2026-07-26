// src/app/newsletter/descadastrar/page.tsx — RF-BLOG-06
import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { DescadastrarNewsletterClient } from "@/components/site/DescadastrarNewsletterClient";

export const metadata: Metadata = {
  title: "Descadastro da newsletter — Blog PEIx",
  robots: { index: false, follow: false },
};

export default function DescadastrarNewsletterPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-6 py-16">
        <div className="w-full">
          <Suspense>
            <DescadastrarNewsletterClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
