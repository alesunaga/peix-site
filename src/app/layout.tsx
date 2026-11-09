import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { AnalyticsBeacon } from "@/components/site/AnalyticsBeacon";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PEIx — Gestão da Inclusão Pedagógica",
  description:
    "O PEIx reúne o que professores, AEE, acompanhante, família e o próprio estudante sabem sobre o aluno num plano que se atualiza o ano inteiro. Em conformidade com o Decreto nº 12.773/2025.",
  // Prévia ao colar o link no WhatsApp, redes sociais e e-mail: imagem grande
  // 1200x630 (public/og-image.jpg). Páginas com openGraph próprio (ex.: posts do
  // blog) substituem este bloco inteiro — lá a imagem precisa ser declarada.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "PEIx",
    url: "/",
    title: "PEIx — Gestão da Inclusão Pedagógica",
    description:
      "Um modelo vivo do aluno: professores, AEE, acompanhante, família e o próprio estudante num só plano, atualizado o ano inteiro. Em conformidade com o Decreto nº 12.773/2025.",
    images: [
      {
        url: "/og-image.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "PEIx — Gestão da Inclusão Pedagógica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PEIx — Gestão da Inclusão Pedagógica",
    description:
      "Um modelo vivo do aluno: o plano individual de cada estudante, atualizado o ano inteiro por toda a equipe, pela família e pelo próprio aluno.",
    images: ["/og-image.jpg"],
  },
};

// Aplica o tema de alto contraste salvo (ou a preferência do sistema) antes da
// hidratação, para não haver "flash" do tema padrão. Ver ThemeToggle.tsx e a
// seção "MODO DE ALTO CONTRASTE" em globals.css.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem('peix-theme');
    var theme = saved;
    if (!theme) {
      var wantsContrast = window.matchMedia('(prefers-contrast: more)').matches;
      if (wantsContrast) {
        var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        theme = prefersLight ? 'high-contrast-light' : 'high-contrast-dark';
      }
    }
    if (theme && theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* beforeInteractive: roda antes da hidratação, evita flash do tema padrão */}
        <Script id="peix-theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Suspense fallback={null}>
          <AnalyticsBeacon />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
