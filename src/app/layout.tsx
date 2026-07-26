import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PEIx — Gestão do Plano Educacional Individualizado",
  description:
    "O PEIx ajuda escolas a elaborar, acompanhar e revisar o PEI, em conformidade com o Decreto nº 12.773/2025.",
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
        {children}
      </body>
    </html>
  );
}
