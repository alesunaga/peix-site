// src/components/site/Navbar.tsx
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/site/Logo";

type NavItem =
  | { href: string; label: string; comingSoon?: false }
  | { href?: undefined; label: string; comingSoon: true };

const LINKS: NavItem[] = [
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
          <Logo className="h-8 w-8" />
          PEIx
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) =>
            link.comingSoon ? (
              <li key={link.label}>
                <span
                  aria-disabled="true"
                  className="flex cursor-default select-none items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-slate-500"
                >
                  {link.label}
                  <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Em breve
                  </span>
                </span>
              </li>
            ) : (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink
            href="https://app.peix.ia.br"
            variant="secondary"
            className="hidden text-sm sm:inline-flex"
          >
            Acessar plataforma
          </ButtonLink>
          <ButtonLink href="/contato" className="text-sm">
            Ver o sistema
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
