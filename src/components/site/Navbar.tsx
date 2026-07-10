// src/components/site/Navbar.tsx
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/recursos", label: "Recursos" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05040f]/80 backdrop-blur-md">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Sparkles size={18} aria-hidden />
          </span>
          PEIx
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <ButtonLink href="/contato" className="text-sm">
          Agendar Demo
        </ButtonLink>
      </nav>
    </header>
  );
}
