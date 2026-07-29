# PEIx — Site Institucional

### Arquitetura Técnica e Operações — v1.7 — Julho 2026

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Julho 2026 | Versão inicial. Detalha a stack, o modelo de dados e os fluxos de e-mail que atendem o Requisitos_Site_PEIx_v1.0. Documento independente da Arquitetura_Tecnica do sistema PEIx (produto) — serviço, banco de dados e repositório próprios. |
| 1.1 | Julho 2026 | Adendo — arquitetura do **Diagnóstico de Conformidade guiado**: nova tabela `diagnosticos`, endpoint `POST /api/diagnostico`, cálculo de pontuação server-side. |
| 1.2 | Julho 2026 | Adendo — padrão **e-mail best-effort** (`enviarEmailsSemBloquear`, §8); `DiagnosticoPergunta` ganhou `importancia`/`risco`; `Cargo` ganhou `OUTRO`; nota sobre organização de `prisma/migrations/`. |
| 1.3 | Julho 2026 | Adendo — arquitetura do **Painel Administrativo detalhado**: `admin_users` ganha campos de convite/reset/lockout; nova tabela `post_preview_tokens`; `posts.status` ganha `agendado`; fluxo de convite via token; sanitização de Markdown no backend; validação de upload por magic bytes. |
| 1.4 | Julho 2026 | Adendo — lançamento faseado: arquitetura do Painel Admin da v1.3 **não entra** nesta rodada de deploy, só quando a Fase 1b for retomada. |
| 1.5 | Julho 2026 | Adendo — incidente real de deploy: `prisma/migrations/` nunca tinha sido commitada; migrations geradas contra o banco de produção por falta de ambiente de dev separado; criado ambiente `development` isolado no Railway (§11). |
| 1.6 | Julho 2026 | Adendo — **implementação real do Painel Admin — fundação, leads/assinantes, usuários e CRUD de posts** (retoma a Fase 1b adiada na v1.4), com quatro decisões de arquitetura que não estavam previstas na v1.3 e um incidente de infraestrutura relevante para sessões futuras: sessão via cookie assinado com Web Crypto (compatibilidade com o middleware Edge), verificação de autenticação em duas camadas (Edge + Node), revogação de sessão ao trocar de senha, e sanitização de Markdown via `marked` + `sanitize-html`. Migrations desta sessão foram escritas manualmente. CRUD de posts, gestão de usuários, leads e assinantes detalhados em §3/§4; status por RF em Requisitos_Site_PEIx v1.8 §8. |
| 1.7 | Julho 2026 | Adendo — **Modo de Alto Contraste (RF-SITE-07) e logo por tema (RF-SITE-08)**, ver Requisitos_Site_PEIx_v1_9.md. Puramente **client-side/CSS** — sem nova tabela, endpoint ou dependência de backend: (1) três estados de tema (`default`/`high-contrast-dark`/`high-contrast-light`) via atributo `data-theme` em `<html>`, tokens CSS em `globals.css`, persistidos em `localStorage` (`peix-theme`) e aplicados antes da hidratação por um script `beforeInteractive` em `layout.tsx` — mesmo padrão de "zero JS em runtime normal, só CSS de override" já haviam sido especificado na Proposta original; (2) **novo componente `src/components/site/Logo.tsx`** — renderiza as duas versões do logo (`public/logo/peix-mark-white.png`, `peix-mark-black.png`) simultaneamente no HTML, e a visibilidade de cada uma é controlada por uma regra CSS adicional em `globals.css` (`[data-theme="high-contrast-light"] .peix-logo-{default,hc-light}`), na mesma seção "MODO DE ALTO CONTRASTE" dos demais overrides — decisão de arquitetura: resolver a troca por CSS (e não por lógica React condicionada ao `data-theme` lido em `useEffect`) elimina o risco de flash da versão errada do logo no primeiro paint, já que o atributo `data-theme` já está presente no `<html>` antes da hidratação rodar. |

---

## 1. Visão Geral da Stack

Decisão do fundador: o site é um **serviço separado**, sem compartilhar backend nem banco de dados com o sistema PEIx (produto).

| Camada | Tecnologia | Justificativa |
| --- | --- | --- |
| Frontend + Backend | **Next.js** (App Router, TypeScript) | Framework full-stack único: SSR/SSG para SEO do blog e API Routes para o backend no mesmo serviço |
| Estilo | Tailwind CSS | Mesma linguagem visual "Aurora" já validada no mockup. **Atualizado v1.7:** convive com o Modo de Alto Contraste via overrides de atributo `[data-theme]` em `globals.css`, sem reescrever as classes utilitárias dos componentes (ver §3). |
| Banco de dados | PostgreSQL (plugin Railway, projeto próprio) | Instância isolada da do produto PEIx |
| ORM | Prisma | Migrations e type-safety integrados ao Next.js/TypeScript |
| Autenticação (Admin) | E-mail + senha (hash bcrypt) + sessão em cookie httpOnly assinada com **Web Crypto (HMAC-SHA256)** | Ver v1.6 §3 |
| Sanitização de Markdown | **`marked` (parser) + `sanitize-html` (sanitizador)**, combinados em `src/lib/markdown.ts` | Ver v1.6 |
| E-mail transacional e newsletter | **Resend** | Ver §8 |
| Armazenamento de imagens (capas de post) | Cloudflare R2 | **Ainda não integrado** — entra com RF-ADMIN-10 |
| Job agendado (agendamento de posts) | Cron simples (Railway Cron ou rota protegida) | **Ainda não integrado** — entra com RF-ADMIN-12 |
| Hospedagem | Railway | Domínio peix.ia.br, deploy automático via push na branch `main` |
| **Tema/Contraste** *(novo v1.7)* | **CSS custom properties + atributo `[data-theme]`, sem lib de terceiros** | RF-SITE-07 — três estados (`default`, `high-contrast-dark`, `high-contrast-light`), persistidos em `localStorage`, sem estado de servidor |

## 2. Modelo de Dados

Sem alteração nesta versão — o Modo de Alto Contraste e a troca de logo por tema (§3 desta versão) são inteiramente client-side, sem nova tabela nem coluna.

Ver v1.6 §2 para o modelo completo (`leads`, `newsletter_subscribers`, `posts`, `admin_users`, `post_preview_tokens`, `envios_newsletter`, `diagnosticos`).

## 3. Modo de Alto Contraste e Logo por Tema *(novo v1.7)*

**Mecanismo de tema (RF-SITE-07):**

- Atributo `data-theme` em `<html>`, com três valores possíveis: ausente/`default` (Aurora), `high-contrast-dark`, `high-contrast-light`.
- `src/app/globals.css` define os tokens de cada variante (`--hc-*`) e uma extensa lista de overrides por seletor de atributo — por exemplo `[data-theme^="high-contrast"] [class~="bg-indigo-600"] { background-color: var(--hc-accent) !important; }` — em vez de reescrever as classes Tailwind já usadas em cada componente. **Decisão de arquitetura (mantida da proposta original):** zero mudança de markup nos componentes existentes, reduz risco de regressão visual no tema padrão.
- `src/app/layout.tsx` injeta um script inline com `strategy="beforeInteractive"` que lê `localStorage.getItem('peix-theme')` (ou, na ausência, `prefers-contrast`/`prefers-color-scheme`) e aplica `data-theme` no `<html>` **antes da hidratação** — evita o "flash" do tema padrão em quem já escolheu alto contraste.
- `src/components/ui/ThemeToggle.tsx` (client component) é a única peça com estado React: lê o atributo atual em `useEffect` (evitando mismatch de hidratação, já que o valor real depende de `localStorage`, que não existe no servidor) e escreve tanto o atributo quanto `localStorage` ao trocar.

**Logo por tema (RF-SITE-08) — novo componente, sem estado:**

- `src/components/site/Logo.tsx` é um **server component puro, sem `"use client"`** — renderiza sempre as duas tags `<img>` (branca e preta), cada uma com uma classe própria (`peix-logo-default`, `peix-logo-hc-light`).
- A visibilidade é decidida inteiramente por CSS, na mesma seção de `globals.css` dos demais overrides de tema:
  ```css
  [data-theme="high-contrast-light"] .peix-logo-default { display: none; }
  [data-theme="high-contrast-light"] .peix-logo-hc-light { display: block; }
  ```
- **Por que não um `useEffect` lendo `data-theme` e decidindo qual `<img>` renderizar:** exigiria marcar `Logo.tsx` como client component, adicionar um render inicial "neutro" (mesmo problema de mismatch de hidratação que `ThemeToggle` já resolve hoje) e ainda correria o risco de um flash de ~1 frame da versão errada antes do `useEffect` rodar. Resolver por CSS elimina os três problemas de uma vez, ao custo de renderizar duas tags `<img>` sempre (uma delas oculta) — aceitável dado o tamanho pequeno dos assets (ver abaixo).
- Assets: `public/logo/peix-mark-white.png` (17KB) e `public/logo/peix-mark-black.png` (22KB), PNG com canal alpha, ~213×256px — resolução suficiente para o tamanho de exibição atual (32px/28px de altura no Navbar/Footer) em telas retina, sem depender de SVG.
- **Decisão de design (registrada como `RN-SITE-05` em Requisitos_Site_PEIx v1.9):** uma terceira versão do logo, com gradiente branco→índigo (cogitada para destaque na seção Hero), não entra em produção em nenhum tema — mantém consistência de marca e evita conflito com a exigência de formas sólidas (sem gradiente/blur) dos modos de alto contraste.

## 4. Fluxo de Sessão, Convite e Autenticação de Administrador

Sem alteração — ver v1.6 §3.

## 5. Fluxo de CRUD de Posts

Sem alteração — ver v1.6 §4.

## 6. Fluxo do Formulário de Contato

Sem alteração — ver v1.0/v1.2.

## 7. Fluxo do Blog e Newsletter

Sem alteração de arquitetura — ainda não implementado (Blog público continua fora do escopo até o Painel Admin estar fechado).

## 8. Fluxo do Diagnóstico de Conformidade

Sem alteração — ver v1.1/v1.2.

## 9. Padrão de E-mail Best-Effort

Sem alteração — ver v1.2.

## 10. Por que Resend

Sem alteração — ver v1.0.

## 11. Segurança e LGPD

Sem alteração — ver v1.0–v1.6. **Nota v1.7:** o Modo de Alto Contraste não introduz superfície de risco nova — não há dado pessoal, cookie de sessão nem chamada de rede envolvida; `localStorage` guarda apenas a preferência de tema (`peix-theme`), sem informação identificável.

## 12. Deploy e Ambientes

Sem alteração em relação à v1.5/v1.6. **Nota v1.7:** mudança de puro frontend (CSS + 1 componente + 2 assets estáticos) — sem migration, sem variável de ambiente nova, sem impacto no processo de deploy já descrito na v1.5/v1.6 §11. Build de produção (`npm run build`) validado nesta sessão: compilou, passou lint/typecheck, 38 páginas geradas sem erro.

## 13. Roadmap Técnico

| Fase | Escopo técnico |
| --- | --- |
| Fase 1a — MVP informativo | Next.js + Postgres + Resend, fluxo completo de leads, newsletter (parcial — sem Blog) e Diagnóstico. **✅ Concluído.** |
| Fase 1b — Painel Admin + Blog | **✅ Concluído (v1.6):** fundação (sessão/login/lockout), leads, assinantes, CRUD de usuários (convite/reset/desativação), CRUD de posts com Markdown sanitizado. **Pendente:** upload de capa (R2), preview assinado, agendamento (job periódico), e o Blog público (listagem, post individual, newsletter, disparo em lote). |
| Adendo — Modo de Alto Contraste + logo por tema | **✅ Concluído nesta sessão (v1.7).** Puramente CSS + 1 componente client-side (`ThemeToggle`) + 1 componente server-side (`Logo`) — sem dependência de fase. |
| Fase 2 | Materiais gated por categoria, instrumentação de métricas (RF-ADMIN-04), exportação para CRM externo |
| Fase 3 | Automação de nutrição de leads, testes A/B de CTA |
