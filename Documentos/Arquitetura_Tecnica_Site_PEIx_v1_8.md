# PEIx — Site Institucional

### Arquitetura Técnica e Operações — v1.8 — Agosto 2026

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Julho 2026 | Versão inicial. Detalha a stack, o modelo de dados e os fluxos de e-mail que atendem o Requisitos_Site_PEIx_v1.0. Documento independente da Arquitetura_Tecnica do sistema PEIx (produto) — serviço, banco de dados e repositório próprios. |
| 1.1 | Julho 2026 | Adendo — arquitetura do **Diagnóstico de Conformidade guiado**: nova tabela `diagnosticos`, endpoint `POST /api/diagnostico`, cálculo de pontuação server-side. |
| 1.2 | Julho 2026 | Adendo — padrão **e-mail best-effort** (`enviarEmailsSemBloquear`, §8); `DiagnosticoPergunta` ganhou `importancia`/`risco`; `Cargo` ganhou `OUTRO`; nota sobre organização de `prisma/migrations/`. |
| 1.3 | Julho 2026 | Adendo — arquitetura do **Painel Administrativo detalhado**: `admin_users` ganha campos de convite/reset/lockout; nova tabela `post_preview_tokens`; `posts.status` ganha `agendado`; fluxo de convite via token; sanitização de Markdown no backend; validação de upload por magic bytes. |
| 1.4 | Julho 2026 | Adendo — lançamento faseado: arquitetura do Painel Admin da v1.3 **não entra** nesta rodada de deploy, só quando a Fase 1b for retomada. |
| 1.5 | Julho 2026 | Adendo — incidente real de deploy: `prisma/migrations/` nunca tinha sido commitada; migrations geradas contra o banco de produção por falta de ambiente de dev separado; criado ambiente `development` isolado no Railway (§11). |
| 1.6 | Julho 2026 | Adendo — **implementação real do Painel Admin — fundação, leads/assinantes, usuários e CRUD de posts** (retoma a Fase 1b adiada na v1.4), com quatro decisões de arquitetura que não estavam previstas na v1.3 e um incidente de infraestrutura relevante para sessões futuras: sessão via cookie assinado com Web Crypto (compatibilidade com o middleware Edge), verificação de autenticação em duas camadas (Edge + Node), revogação de sessão ao trocar de senha, e sanitização de Markdown via `marked` + `sanitize-html`. Migrations desta sessão foram escritas manualmente. CRUD de posts, gestão de usuários, leads e assinantes detalhados em §3/§4; status por RF em Requisitos_Site_PEIx v1.8 §8. |
| 1.7 | Julho 2026 | Adendo — **Modo de Alto Contraste (RF-SITE-07) e logo por tema (RF-SITE-08)**, ver Requisitos_Site_PEIx_v1_9.md. Puramente **client-side/CSS** — sem nova tabela, endpoint ou dependência de backend. |
| 1.8 | Agosto 2026 | Adendo — **Analytics próprio (RF-ADMIN-04, antes marcado "Fase 2")**, ver Requisitos_Site_PEIx_v1_10.md. Motivado por uma dúvida do fundador sobre como obter estatísticas do site (Google Analytics vs. ferramenta própria) e sobre tagear visitantes para retargeting — a segunda ideia foi **descartada na mesma sessão**: a Politica_Privacidade_PEIx §8 já promete publicamente "não utilizamos cookies de rastreamento publicitário nem compartilhamos dados de navegação com redes de anúncios", e implementar retargeting quebraria esse compromisso sem revisão jurídica do texto. Decisão de arquitetura: analytics **construído do zero** (não GA4/Plausible/Matomo) — reaproveita 100% do stack já existente (Postgres via Prisma, Route Handlers, área admin autenticada), sem novo serviço nem dependência externa. Duas tabelas novas (`analytics_pageviews`, `analytics_eventos`), coleta via beacon first-party (`POST /api/track`, runtime Node — não Edge, ver §4), visitante identificado por hash diário sem cookie nem IP/UA persistidos, e dashboard **incorporado à página `/admin` existente** (não uma aba separada — decisão tomada em revisão, ver §4). Migration escrita manualmente (mesmo padrão da v1.5/v1.6); processo desta sessão para confirmar qual `DATABASE_URL` do `.env` correspondia a qual ambiente do Railway documentado em §12, para não repetir o incidente da v1.5. |

---

## 1. Visão Geral da Stack

Decisão do fundador: o site é um **serviço separado**, sem compartilhar backend nem banco de dados com o sistema PEIx (produto).

| Camada | Tecnologia | Justificativa |
| --- | --- | --- |
| Frontend + Backend | **Next.js** (App Router, TypeScript) | Framework full-stack único: SSR/SSG para SEO do blog e API Routes para o backend no mesmo serviço |
| Estilo | Tailwind CSS | Mesma linguagem visual "Aurora" já validada no mockup, convive com o Modo de Alto Contraste (v1.7) |
| Banco de dados | PostgreSQL (plugin Railway, projeto próprio) | Instância isolada da do produto PEIx |
| ORM | Prisma | Migrations e type-safety integrados ao Next.js/TypeScript |
| Autenticação (Admin) | E-mail + senha (hash bcrypt) + sessão em cookie httpOnly assinada com **Web Crypto (HMAC-SHA256)** | Ver v1.6 §3 |
| Sanitização de Markdown | **`marked` (parser) + `sanitize-html` (sanitizador)**, combinados em `src/lib/markdown.ts` | Ver v1.6 |
| E-mail transacional e newsletter | **Resend** | Ver §9 |
| Armazenamento de imagens (capas de post) | Cloudflare R2 | **Ainda não integrado** — entra com RF-ADMIN-10 |
| Job agendado (agendamento de posts) | Cron simples (Railway Cron ou rota protegida) | **Ainda não integrado** — entra com RF-ADMIN-12 |
| Hospedagem | Railway | Domínio peix.ia.br, deploy automático via push na branch `main`, ambientes `production`/`development` isolados |
| Tema/Contraste | CSS custom properties + atributo `[data-theme]`, sem lib de terceiros | RF-SITE-07/08, ver v1.7 |
| **Analytics** *(novo v1.8)* | **Construído do zero — sem GA4, Plausible ou Matomo.** Duas tabelas Postgres + 1 Route Handler (`/api/track`) + 1 client component (`AnalyticsBeacon`), sem dependência nova no `package.json` | RF-ADMIN-04, ver §3 |

## 2. Modelo de Dados

Ver v1.6 §2 para o modelo completo (`leads`, `newsletter_subscribers`, `posts`, `admin_users`, `post_preview_tokens`, `envios_newsletter`, `diagnosticos`). O Modo de Alto Contraste (v1.7) não alterou o schema.

**Novo em v1.8** — duas tabelas isoladas, sem relação de FK com o restante do schema:

| Tabela | Campos principais | Observação |
| --- | --- | --- |
| `analytics_pageviews` | id, path, referrer, utmSource, utmMedium, utmCampaign, visitanteHash, dispositivo (enum), criadoEm | Uma linha por navegação (primeira carga + troca de rota client-side) |
| `analytics_eventos` | id, tipo (enum: `DIAGNOSTICO_CONCLUIDO` / `FORMULARIO_ENVIADO` / `NEWSLETTER_INSCRITA` / `POST_LIDO`), path, visitanteHash, metadata (jsonb), criadoEm | Eventos de conversão, gravados pelo próprio backend no momento em que a ação de negócio já acontece |

`visitanteHash` = SHA-256(IP + User-Agent + data do dia + salt de `ANALYTICS_SALT`) — nunca persiste IP nem User-Agent brutos. O hash muda todo dia, então só permite contar "visitantes únicos por dia", não reidentificar alguém ao longo do tempo (ver §3).

## 3. Analytics Próprio *(novo v1.8)*

**Por que não usar um serviço pronto:** Google Analytics usa cookies de rastreamento, o que exigiria alterar o texto da Politica_Privacidade_PEIx (§8: "não utilizamos cookies de rastreamento") e provavelmente um banner de consentimento. Plausible/Umami resolveriam sem esse problema, mas custo recorrente (ou infra própria) e um serviço a mais para manter não se justificam para uma pequena tabela de eventos que já cabe no Postgres existente. Comparação completa nas anotações da sessão que precedeu a implementação (não versionada como documento formal).

**Coleta de pageview — via beacon first-party, não middleware Edge:**

- `src/components/site/AnalyticsBeacon.tsx` (client component, montado em `layout.tsx` dentro de `<Suspense>` por causa de `useSearchParams()`) dispara `navigator.sendBeacon('/api/track', ...)` a cada navegação (App Router client-side routing incluso), com fallback para `fetch(..., { keepalive: true })`.
- **Decisão de arquitetura — por que não no `middleware.ts` existente:** o middleware roda em runtime **Edge** (necessário para verificar o cookie de sessão do admin com Web Crypto, ver v1.6 §3), e o Prisma Client não funciona em Edge sem um driver adapter específico que o projeto não usa. Gravar a pageview direto do middleware exigiria essa complexidade extra. Em vez disso, o beacon chama `POST /api/track` (`src/app/api/track/route.ts`), um Route Handler comum, que roda em runtime Node.js e usa o Prisma normalmente — mesmo padrão de todas as outras rotas da API do site.
- Ser uma chamada **de mesma origem** (não um domínio de terceiro como `google-analytics.com`) evita a maior parte dos bloqueadores de anúncio genéricos, que miram domínios conhecidos de rastreamento — vantagem sobre GA4 mesmo sem essa ser a motivação principal da escolha.
- `src/lib/analytics.ts` calcula o hash de visitante, classifica o dispositivo por User-Agent e filtra User-Agents de bot conhecidos (Googlebot, uptime monitors etc.) antes de gravar — sem detecção sofisticada de bot/fraude nesta fase.
- Gravação é **best-effort**: `registrarPageview`/`registrarEvento` nunca lançam exceção — mesmo espírito de `enviarEmailsSemBloquear` (v1.2).

**Eventos de conversão — instrumentados direto nas rotas já existentes, sem endpoint extra:**

- `POST /api/diagnostico` grava `DIAGNOSTICO_CONCLUIDO` ao final do fluxo já existente.
- `POST /api/leads` grava `FORMULARIO_ENVIADO`.
- `POST /api/newsletter/confirmar` grava `NEWSLETTER_INSCRITA` (na confirmação do double opt-in, não no cadastro inicial — RF-BLOG-04).

**Dashboard — dentro de `/admin`, não numa aba separada:**

- `src/lib/analytics-queries.ts` concentra as agregações (resumo do período, série temporal, páginas mais vistas, origem de tráfego, funil de conversão), consultadas direto via Prisma pelo server component — mesmo padrão de `src/app/admin/(painel)/leads/page.tsx`, sem rota REST intermediária.
- Agregação por dia/página/origem feita **em memória** (sem SQL bruto — nenhuma outra parte do código usa `$queryRaw`, e o volume de um site institucional deste porte não justifica a complexidade). Se o tráfego crescer muito, pode virar uma tabela de rollup diário sem mudar a assinatura das funções.
- Gráfico de linha em SVG puro (`src/components/admin/AnalyticsLineChart.tsx`), sem adicionar lib de gráficos ao projeto.
- **Decisão tomada em revisão, depois da primeira implementação:** o conteúdo nasceu como uma página separada (`/admin/analytics`), mas foi movido para dentro de `src/app/admin/(painel)/page.tsx` (o dashboard raiz do admin) — o dashboard original era só uma grade estática de contadores (Posts/Leads/Assinantes/Usuários) sem muito propósito próprio; as estatísticas de acesso são o conteúdo natural da tela inicial do admin. O item "Analytics" foi removido do `AdminNav`.

**Escopo explicitamente fora desta versão:** sem "tempo real", sem detecção sofisticada de bot/fraude, sem segmentação avançada, sem exportação/API pública dos dados — ver justificativa completa no desenho técnico original da sessão.

## 4. Fluxo de Sessão, Convite e Autenticação de Administrador

Sem alteração — ver v1.6 §3.

## 5. Fluxo de CRUD de Posts

Sem alteração — ver v1.6 §4.

## 6. Fluxo do Formulário de Contato

Sem alteração de arquitetura. **v1.8:** ao final do fluxo, grava evento `FORMULARIO_ENVIADO` (ver §3).

## 7. Fluxo do Blog e Newsletter

Sem alteração de arquitetura — ainda não implementado (Blog público continua fora do escopo até o Painel Admin estar fechado). **v1.8:** a confirmação de double opt-in (`POST /api/newsletter/confirmar`) já existente passa a gravar evento `NEWSLETTER_INSCRITA`.

## 8. Fluxo do Diagnóstico de Conformidade

Sem alteração de arquitetura. **v1.8:** ao final do fluxo, grava evento `DIAGNOSTICO_CONCLUIDO` com a categoria calculada como metadata (ver §3).

## 9. Padrão de E-mail Best-Effort

Sem alteração — ver v1.2. **v1.8:** o mesmo espírito (nunca deixar um efeito colateral quebrar o fluxo principal) foi reaplicado em `registrarPageview`/`registrarEvento` (§3).

## 10. Por que Resend

Sem alteração — ver v1.0.

## 11. Modo de Alto Contraste e Logo por Tema

Sem alteração — ver v1.7 §3.

## 12. Segurança e LGPD

Sem alteração — ver v1.0–v1.7. **Nota v1.8:** o Analytics próprio não usa cookie, não persiste IP nem User-Agent brutos (só o hash diário — ver §2/§3), e a decisão explícita desta sessão foi **não** implementar tageamento de visitantes para retargeting/publicidade — mantém a Politica_Privacidade_PEIx §8 inalterada, sem necessidade de revisão jurídica nem banner de consentimento novo.

## 13. Deploy e Ambientes

Sem alteração de processo em relação à v1.5/v1.6. **Nota v1.8 — confirmação de ambiente antes da migration:** o `.env` local tinha duas `DATABASE_URL` (uma ativa, uma comentada) sem indicação clara de qual era `development`. Confirmado via Railway (aba Variables do serviço Postgres, em cada ambiente, revelando `DATABASE_URL`): **produção = porta 29855, desenvolvimento = porta 15371** (a que já estava ativa no `.env` local). Migration `20260824213532_add_analytics` aplicada primeiro em desenvolvimento (`prisma migrate dev`, testada de ponta a ponta localmente) e só depois em produção (`prisma migrate deploy`, com `DATABASE_URL` sobrescrita via variável de ambiente temporária no terminal, sem alterar o `.env`). **Registrado para sessões futuras:** a dupla de portas 29855/15371 = produção/desenvolvimento pode ser conferida rapidamente assim, sem precisar repetir esse processo de novo.

## 14. Roadmap Técnico

| Fase | Escopo técnico |
| --- | --- |
| Fase 1a — MVP informativo | Next.js + Postgres + Resend, fluxo completo de leads, newsletter (parcial — sem Blog) e Diagnóstico. **✅ Concluído.** |
| Fase 1b — Painel Admin + Blog | **✅ Concluído (v1.6):** fundação (sessão/login/lockout), leads, assinantes, CRUD de usuários (convite/reset/desativação), CRUD de posts com Markdown sanitizado. **Pendente:** upload de capa (R2), preview assinado, agendamento (job periódico), e o Blog público (listagem, post individual, newsletter, disparo em lote). |
| Adendo — Modo de Alto Contraste + logo por tema | **✅ Concluído (v1.7).** Puramente CSS + 1 componente client-side (`ThemeToggle`) + 1 componente server-side (`Logo`) — sem dependência de fase. |
| Adendo — Analytics próprio | **✅ Concluído nesta sessão (v1.8).** RF-ADMIN-04 sai de "Fase 2" — implementado como analytics construído do zero, sem serviço externo, incorporado ao dashboard `/admin` existente. |
| Fase 2 | Materiais gated por categoria, exportação para CRM externo |
| Fase 3 | Automação de nutrição de leads, testes A/B de CTA |
