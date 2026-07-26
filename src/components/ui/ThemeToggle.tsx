"use client";
// src/components/ui/ThemeToggle.tsx
// Alternador do Modo de Alto Contraste (acessibilidade de cores).
// Ver Proposta_Modo_Alto_Contraste_Site_PEIx.md e o bloco de overrides
// em src/app/globals.css (seção "MODO DE ALTO CONTRASTE").
//
// Importante: as classes usadas aqui (bg-white/5, border-white/10,
// text-slate-300, bg-indigo-600, text-white) foram escolhidas de propósito
// por já terem overrides de alto contraste no globals.css — qualquer classe
// nova usada neste componente precisaria de um override equivalente lá.

import { useEffect, useState } from "react";
import { Contrast, Moon, Sun } from "lucide-react";

type Theme = "default" | "high-contrast-dark" | "high-contrast-light";

const THEME_KEY = "peix-theme";

const OPTIONS: { theme: Theme; label: string; Icon: typeof Contrast }[] = [
  { theme: "default", label: "Contraste padrão", Icon: Contrast },
  { theme: "high-contrast-dark", label: "Alto contraste escuro", Icon: Moon },
  { theme: "high-contrast-light", label: "Alto contraste claro", Icon: Sun },
];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "default") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as Theme | null) ?? "default";
    setTheme(current);
    setMounted(true);
  }, []);

  function persist(next: Theme) {
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }

  // Evita mismatch de hidratação: o estado real depende do localStorage,
  // que só existe no cliente. Antes de montar, mostra os 3 botões neutros
  // (mesmo layout, sem estado ativo) para não haver salto de tamanho.
  const activeTheme = mounted ? theme : "default";

  return (
    <div
      role="group"
      aria-label="Modo de contraste"
      className="flex items-center overflow-hidden rounded-lg border border-white/10"
    >
      {OPTIONS.map(({ theme: optionTheme, label, Icon }) => {
        const isActive = mounted && activeTheme === optionTheme;
        return (
          <button
            key={optionTheme}
            type="button"
            onClick={() => persist(optionTheme)}
            aria-pressed={isActive}
            title={label}
            className={`flex h-9 w-9 items-center justify-center transition-colors ${
              isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={16} aria-hidden />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
