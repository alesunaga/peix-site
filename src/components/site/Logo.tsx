// src/components/site/Logo.tsx
// Marca do PEIx (símbolo "P"). Duas versões (branca e preta) são renderizadas
// sempre — a troca entre elas é feita só por CSS, via seletor [data-theme] em
// globals.css (seção "MODO DE ALTO CONTRASTE" / troca de logo por tema).
//
// Por quê CSS e não JS: o tema é aplicado em <html data-theme="..."> antes da
// hidratação (ver THEME_INIT_SCRIPT em layout.tsx). Decidir a imagem certa em
// JS exigiria useEffect + client component só para isto, e ainda arriscaria
// um "flash" da imagem errada. Com puro CSS, o navegador já pinta a imagem
// certa no primeiro paint, sem depender de hidratação.
//
// Mapeamento (ver Proposta_Modo_Alto_Contraste_Site_PEIx.md):
//   default              -> fundo escuro (slate-900) -> logo branco
//   high-contrast-dark   -> fundo preto               -> logo branco (mesmo arquivo)
//   high-contrast-light  -> fundo branco               -> logo preto

type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <img
        src="/logo/peix-mark-white.png"
        alt=""
        aria-hidden
        className="peix-logo-default absolute inset-0 h-full w-full object-contain"
      />
      <img
        src="/logo/peix-mark-black.png"
        alt=""
        aria-hidden
        className="peix-logo-hc-light absolute inset-0 hidden h-full w-full object-contain"
      />
    </span>
  );
}
