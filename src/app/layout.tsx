import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PEIx — Gestão do Plano Educacional Individualizado",
  description:
    "O PEIx ajuda escolas a elaborar, acompanhar e revisar o PEI, em conformidade com o Decreto nº 12.773/2025.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
