# PEIx — Site Institucional

Site de marketing/institucional do PEIx: peix.ia.br

Serviço **independente** do sistema PEIx (produto) — banco de dados, repositório
e deploy próprios no Railway. Não compartilha nenhum dado de aluno, escola ou PEI.

Documentação de referência (na raiz do projeto de conhecimento):

- `Requisitos_Site_PEIx_v1.1.md`
- `Arquitetura_Tecnica_Site_PEIx_v1.1.md`

## Stack

- **Next.js** (App Router, TypeScript) — frontend + backend no mesmo serviço
- **Tailwind CSS** — conceito visual "Aurora"
- **PostgreSQL** (Railway) + **Prisma**
- **Resend** — e-mails transacionais e newsletter
- **Cloudflare R2** — imagens de capa dos posts do blog

## Estrutura de pastas

```
src/
├── app/
│   ├── page.tsx                 # Home
│   ├── recursos/                # Página de Recursos
│   ├── contato/                 # Formulário de Contato (RF-LEAD)
│   ├── diagnostico/              # Diagnóstico de Conformidade (RF-DIAG)
│   ├── blog/
│   │   ├── page.tsx              # Listagem
│   │   └── [slug]/                # Post individual
│   ├── newsletter/
│   │   ├── confirmar/             # Confirmação double opt-in
│   │   └── descadastrar/          # Unsubscribe self-service
│   ├── admin/                    # Painel administrativo (RF-ADMIN)
│   │   ├── login/
│   │   ├── posts/                # CRUD de posts do blog
│   │   ├── leads/                 # Listagem de leads (CSV)
│   │   └── assinantes/            # Listagem de assinantes da newsletter
│   └── api/
│       ├── leads/route.ts         # POST — formulário de Contato
│       ├── diagnostico/route.ts   # POST — Diagnóstico de Conformidade
│       ├── newsletter/            # subscribe / confirmar / descadastrar
│       ├── posts/                 # CRUD + trigger de disparo em lote
│       └── admin/auth/            # Login do painel
├── components/
│   ├── ui/                       # Componentes genéricos (botão, card, etc.)
│   └── site/                     # Hero, ProblemaCards, FaqAccordion etc.
├── emails/                       # Templates de e-mail (react-email)
├── lib/
│   ├── prisma.ts                  # Singleton do Prisma Client
│   ├── resend.ts                  # Orquestração de envio de e-mail
│   ├── diagnostico-config.ts      # Perguntas/pesos do Diagnóstico (RN-DIAG-01)
│   ├── markdown.ts                # Markdown → HTML sanitizado (marked + sanitize-html)
│   ├── newsletter-dispatch.ts     # Disparo em lote ao publicar post (RF-BLOG-05)
│   └── site.ts                    # SITE_URL canônica (www.peix.ia.br) p/ links absolutos
├── app/sitemap.ts                  # Sitemap dinâmico (fixas + posts publicados) — RNF-03
├── app/robots.ts                   # Bloqueia /admin, /api, preview e rotas de token — RNF-03
└── types/
```

## Como rodar localmente

```bash
npm install
cp .env.example .env      # preencher DATABASE_URL, RESEND_API_KEY etc.
npx prisma migrate dev --name init
npm run dev
```

## Status atual (sessão de 26/07/2026 — continuação)

**Fase 1a** (site informativo) e **Fase 1b** (Blog + Painel Admin) estão com todo o
escopo funcional implementado localmente (commits até `38c8d8b`). O que falta é
infraestrutura/publicação — ver checklist no fim desta seção.

- ✅ Home, Recursos, Contato, Diagnóstico de Conformidade, Política de Privacidade e Termos de Uso — Fase 1a no ar em produção
- ✅ **Painel Admin completo (RF-ADMIN-01 a 12):** login com lockout e sessão em cookie assinado (Web Crypto/Edge), revogação de sessão ao trocar senha; CRUD de Leads/Assinantes/Usuários (convite por token, reset de senha); CRUD de posts com editor Markdown + preview sanitizado (`marked` + `sanitize-html`); **upload de capa pro Cloudflare R2 com validação por magic bytes (RF-ADMIN-10)**; **link de preview assinado com expiração pra posts não publicados (RF-ADMIN-11)**; **agendamento de publicação com job via GitHub Actions a cada 10min, disparando a newsletter automaticamente (RF-ADMIN-12)**
- ✅ **Blog público completo (RF-BLOG-01 a 08):** listagem com filtro por categoria (`/blog`), página individual com SEO (Open Graph, Twitter Card, schema.org/Article), newsletter com double opt-in (`/api/newsletter/subscribe` + `/newsletter/confirmar`), disparo automático de e-mail aos assinantes confirmados quando um post é publicado (`src/lib/newsletter-dispatch.ts`), descadastro self-service sem login
- ✅ **RNF-03 (SEO técnico) — adicionado nesta sessão:** `src/app/sitemap.ts` (páginas fixas + posts publicados, atualizado dinamicamente) e `src/app/robots.ts` (bloqueia `/admin`, `/api`, `/blog/preview` e rotas de token de newsletter)
- ✅ **Bug corrigido nesta sessão:** e-mails transacionais (convite de admin, reset de senha, confirmação de newsletter, aviso de novo post, unsubscribe) e o fallback do material em PDF usavam `https://peix.ia.br` (sem `www`) hardcoded em 6 arquivos — mas só `www.peix.ia.br` tem DNS configurado (raiz sem redirecionamento, ver nota v1.5 da Arquitetura). Esses links quebrariam em produção. Centralizado em `src/lib/site.ts` (`SITE_URL`, configurável via `NEXT_PUBLIC_SITE_URL`) e aplicado em todos os pontos, incluindo `metadataBase` do layout raiz.

**Checklist antes do próximo deploy:**

- ⬜ Repositório local está 2 commits à frente de `origin/main` (1 de antes desta sessão + o desta sessão) — falta `git push`
- ⬜ Aplicar em produção as migrations do R2/preview/agendamento (`prisma migrate deploy` no Railway) se ainda não aplicadas
- ⬜ Confirmar que o secret `CRON_SECRET` do workflow `.github/workflows/publicar-agendados.yml` está cadastrado no GitHub (Settings → Secrets → Actions) — sem isso o agendamento de posts não dispara
- ⬜ Atualizar `MATERIAL_INFORMATIVO_URL` e adicionar `NEXT_PUBLIC_SITE_URL` nas env vars de produção do Railway (o `.env` local já foi corrigido nesta sessão, mas o Railway tem seu próprio conjunto de variáveis)
- ⬜ Adicionar `LEADS_API_TOKEN` nas env vars de produção do Railway — protege `GET /api/integrations/leads`, usada pela pipeline de clientes externa para puxar leads novos/atualizados (ver `.env.example`)

> **Nota de infraestrutura:** as migrations `20260726114400_admin_panel_foundation` e `20260726122442_admin_session_revogacao` foram escritas manualmente (o ambiente onde foram geradas não tem acesso de rede ao Postgres do Railway nem ao engine Linux do Prisma). Antes de rodar localmente: `npx prisma generate`, aplicar as migrations (`npx prisma migrate deploy` ou `migrate dev`) e criar o primeiro admin com `npm run seed:admin -- seuemail@peix.ia.br "senha-forte"`.

> **Nota desta sessão:** o ambiente de execução montou a pasta real do projeto (`C:\Projetos\peix-site`), mas `.git/index.lock` ficou travado com `EPERM` ao tentar remover (mesma limitação de rename/unlink atômico do mount já registrada aqui antes para `node_modules`) — os commits desta sessão **não foram criados automaticamente**. Rode localmente, na sua máquina: apagar `.git\index.lock` (se ainda existir) e então `git add -A && git commit -m "..." && git push`.

Documentos de referência desatualizados em relação ao código — o projeto de conhecimento ainda tem `Requisitos_Site_PEIx_v1.8.md` e `Arquitetura_Tecnica_Site_PEIx_v1.6.md` sem as seções de Blog público e RNF-03; precisam de uma v1.9/v1.7 refletindo este estado.
