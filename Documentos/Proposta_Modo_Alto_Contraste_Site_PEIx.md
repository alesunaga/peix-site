# Proposta — Modo de Alto Contraste (Acessibilidade de Cores)
### Site PEIx — Julho 2026

## 1. Contexto

O Requisitos_Site_PEIx (RF-SITE-03 / RNF-04) já exige conformidade WCAG AA na paleta base "Aurora" (slate escuro + indigo/azul de acento). Esta proposta adiciona um **segundo tema, opcional**, para usuários com baixa visão ou sensibilidade a contraste — sem alterar o tema padrão.

Sugestão de novo requisito, se aprovado:

> **RF-SITE-XX** — O site deve oferecer um alternador de "Modo Alto Contraste" com duas variantes (escura e clara), acessível via teclado, que troca a paleta visual para uma versão com contraste mínimo AAA (7:1 para texto normal) e persiste a preferência do usuário entre visitas.

## 2. Mecanismo proposto

- Três estados de tema: `default` (Aurora), `high-contrast-dark` (fundo preto) e `high-contrast-light` (fundo branco) — o usuário liga/desliga o alto contraste e, dentro dele, escolhe escuro ou claro (ex.: um botão "Alto contraste" no cabeçalho + um sub-toggle escuro/claro que só aparece quando o modo está ativo).
- Preferência salva em `localStorage` (`peix-theme`) e reaplicada no carregamento (evita "flash" do tema errado com um script inline no `<head>`).
- Como ponto de partida, se o usuário nunca escolheu manualmente: `prefers-contrast: more` ativa o alto contraste, e `prefers-color-scheme` decide entre a variante escura ou clara.
- Implementado via atributo `data-theme` no `<html>` (`default` | `high-contrast-dark` | `high-contrast-light`), não via classe Tailwind `dark:` (que já está reservada para um eventual modo escuro/claro separado do tema padrão).

## 3. Paletas de alto contraste

Duas variantes, ambas elevando todos os pares texto/fundo para 7:1+ (AAA). Números de contraste abaixo verificados por cálculo (fórmula WCAG de luminância relativa), não estimados.

**3.1 — Alto contraste escuro** (mesma linguagem "Aurora": fundo preto, acento quente)

| Token | Aurora (padrão) | Alto contraste escuro | Contraste |
| --- | --- | --- | --- |
| `--bg-base` | `slate-900` (#0f172a) | `#000000` | — |
| `--bg-surface` | `white/5` sobre slate-900 | `#0a0a0a`, borda sólida `#ffffff` 2px (sem blur) | — |
| `--text-primary` | `slate-100` (#f1f5f9) | `#ffffff` | 21:1 sobre `--bg-base` |
| `--text-secondary` | `slate-400` (#94a3b8) | `#e5e5e5` | 16.7:1 sobre `--bg-base` |
| `--accent` | `indigo-500` (#6366f1) | `#ffd60a` (amarelo) | 14.9:1 sobre `--bg-base` |
| `--accent-text-on` | `white` | `#000000` | 14.9:1 sobre `--accent` |
| `--border` | `white/10` | `#ffffff` sólido | — |
| `--focus-ring` | `indigo-400`, 2px | `#ffd60a`, 3px, offset 2px | — |

**3.2 — Alto contraste claro** (fundo branco, acento na família azul/indigo da marca)

| Token | Aurora (padrão) | Alto contraste claro | Contraste |
| --- | --- | --- | --- |
| `--bg-base` | `slate-900` (#0f172a) | `#ffffff` | — |
| `--bg-surface` | `white/5` sobre slate-900 | `#f5f5f5`, borda sólida `#000000` 2px (sem blur) | — |
| `--text-primary` | `slate-100` (#f1f5f9) | `#000000` | 21:1 sobre `--bg-base` |
| `--text-secondary` | `slate-400` (#94a3b8) | `#333333` | 12.6:1 sobre `--bg-base` |
| `--accent` | `indigo-500` (#6366f1) | `#1e3a8a` (indigo/azul escuro) | 10.4:1 sobre `--bg-base` |
| `--accent-text-on` | `white` | `#ffffff` | 10.4:1 sobre `--accent` |
| `--border` | `white/10` | `#000000` sólido | — |
| `--focus-ring` | `indigo-400`, 2px | `#1e3a8a`, 3px, offset 2px | — |

Notas:
- No escuro, amarelo (#ffd60a) substitui o indigo como cor de acento porque indigo sobre preto puro não atinge 7:1; amarelo sobre preto atinge quase 15:1 e mantém boa distinção para as formas mais comuns de daltonismo. No claro, um indigo bem mais escuro (#1e3a8a, próximo do `indigo-900` do Tailwind) já atinge 10.4:1 sobre branco sem precisar trocar de matiz — mantém a identidade "azul profundo/indigo" da marca também no modo claro.
- Efeito glassmorphism (`backdrop-blur` + transparência) é **desativado** nas duas variantes de alto contraste — transparência reduz contraste de forma imprevisível dependendo do que está atrás.
- Vermelho/verde de estado (erro/sucesso em formulários) devem usar também ícone ou texto, não só cor, nos três temas (já é boa prática WCAG 1.4.1, vale reforçar no alto contraste).

## 4. Implementação técnica (Next.js + Tailwind)

**4.1 — `globals.css`:** definir os tokens como CSS custom properties e trocar por seletor de atributo.

```css
:root {
  --bg-base: #0f172a;
  --bg-surface: rgba(255,255,255,0.05);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --accent: #6366f1;
  --accent-text-on: #ffffff;
  --border: rgba(255,255,255,0.1);
  --focus-ring: #818cf8;
}

[data-theme="high-contrast-dark"] {
  --bg-base: #000000;
  --bg-surface: #0a0a0a;
  --text-primary: #ffffff;
  --text-secondary: #e5e5e5;
  --accent: #ffd60a;
  --accent-text-on: #000000;
  --border: #ffffff;
  --focus-ring: #ffd60a;
}

[data-theme="high-contrast-light"] {
  --bg-base: #ffffff;
  --bg-surface: #f5f5f5;
  --text-primary: #000000;
  --text-secondary: #333333;
  --accent: #1e3a8a;
  --accent-text-on: #ffffff;
  --border: #000000;
  --focus-ring: #1e3a8a;
}

[data-theme^="high-contrast"] .glass {
  backdrop-filter: none;
  border-width: 2px;
}
```

**4.2 — `tailwind.config.ts`:** mapear as classes utilitárias usadas hoje para os tokens, em vez de cores fixas (`bg-slate-900` → `bg-[var(--bg-base)]`), permitindo reaproveitar os componentes existentes sem duplicar markup.

**4.3 — Script anti-flash (`app/layout.tsx`, antes do `<body>`):**

```html
<script dangerouslySetInnerHTML={{
  __html: `
    (function () {
      var saved = localStorage.getItem('peix-theme');
      var wantsContrast = window.matchMedia('(prefers-contrast: more)').matches;
      var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      var theme = saved || (wantsContrast ? (prefersLight ? 'high-contrast-light' : 'high-contrast-dark') : 'default');
      if (theme !== 'default') {
        document.documentElement.setAttribute('data-theme', theme);
      }
    })();
  `
}} />
```

**4.4 — Componente `ThemeToggle` (client component):** botão principal liga/desliga o alto contraste (`default` ↔ último `high-contrast-*` usado); um segundo controle (segmentado "Escuro/Claro") aparece só quando o alto contraste está ativo. Ambos leem/escrevem `data-theme` no `<html>` e `localStorage` (`peix-theme`), com `aria-pressed`/`aria-checked` refletindo o estado.

## 5. Critérios de aceite

- [ ] Todo texto das duas variantes de alto contraste passa em checagem automática (axe DevTools / Lighthouse) com contraste ≥ 7:1 (AAA) para texto normal e ≥ 4.5:1 para texto grande.
- [ ] Alternância (liga/desliga + escuro/claro) funciona via teclado (Tab + Enter/Espaço) e é anunciada por leitor de tela.
- [ ] Preferência persiste entre páginas e entre visitas (mesmo navegador), incluindo qual variante (escura/clara) foi a última usada.
- [ ] Nenhum "flash" do tema errado perceptível no carregamento inicial, nas três combinações possíveis.
- [ ] Estados de erro/sucesso em formulários continuam distinguíveis sem depender só da cor, nas três combinações.

## 6. Escopo e esforço

Não depende de nenhuma tabela nova no banco (é só estado de cliente) — pode ser feito em paralelo a qualquer fase do roadmap técnico, inclusive na Fase 1 (MVP), já que é puramente CSS + um componente client-side. Esforço estimado: pequeno (poucos dias), concentrado em mapear as classes Tailwind existentes para os tokens CSS acima.
