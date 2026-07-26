// src/app/newsletter/confirmar/page.tsx — RF-BLOG-04
import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ConfirmarNewsletterClient } from "@/components/site/ConfirmarNewsletterClient";

export const metadata: Metadata = {
  title: "Confirmar inscrição — Blog PEIx",
  robots: { index: false, follow: false },
};

export default function ConfirmarNewsletterPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-6 py-16">
        <div className="w-full">
          <Suspense>
            <ConfirmarNewsletterClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
