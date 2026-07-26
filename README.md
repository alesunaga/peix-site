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
│   └── diagnostico-config.ts      # Perguntas/pesos do Diagnóstico (RN-DIAG-01)
└── types/
```

## Como rodar localmente

```bash
npm install
cp .env.example .env      # preencher DATABASE_URL, RESEND_API_KEY etc.
npx prisma migrate dev --name init
npm run dev
```

## Status atual (fim da sessão de 26/07/2026)

- ✅ Home, Recursos, Contato, Diagnóstico de Conformidade e Política de Privacidade — Fase 1a no ar
- ✅ Rotas de API de Leads e Diagnóstico implementadas e testadas (`/api/leads`, `/api/diagnostico`)
- ✅ Templates de e-mail base e padrão de e-mail best-effort (`enviarEmailsSemBloquear` em `src/lib/resend.ts`)
- ✅ Go-live da Fase 1a concluído (Railway, DNS de `www.peix.ia.br`, Google Workspace, Resend fora do sandbox)
- ✅ **Painel Admin — fundação (Fase 1b, RF-ADMIN-01):** schema Prisma atualizado (`admin_users` com convite/reset/lockout, `posts.autorId`, `post_status.AGENDADO`, `post_preview_tokens`); login com sessão em cookie assinado (httpOnly, RN-ADMIN-03) e lockout (RN-ADMIN-04); middleware protegendo `/admin/**`; shell autenticado (`/admin`) com navegação para Posts/Leads/Assinantes/Usuários
- ✅ **Painel Admin — Leads (RF-ADMIN-02):** `/admin/leads` com busca (nome/e-mail/instituição), paginação e exportação em CSV (`GET /api/admin/leads/export`)
- ✅ **Painel Admin — Assinantes (RF-ADMIN-03):** `/admin/assinantes` com filtro por status (pendente/confirmado/descadastrado), contadores e paginação
- ✅ **Painel Admin — Usuários (RF-ADMIN-06, 07, 08):** `/admin/usuarios` — convite por e-mail (token 48h, senha nunca definida por quem convida), reenvio de convite, desativação (sem exclusão física — reativação é feita reenviando um novo convite); `/admin/ativar` (define senha e já autentica), `/admin/esqueci-senha` e `/admin/resetar-senha` (token de uso único, 1h)
- ✅ **Painel Admin — revogação de sessão ao trocar de senha:** `AdminUser.senhaAlteradaEm` + `iat` no cookie de sessão — resetar a senha (ou ativar convite) agora derruba qualquer sessão aberta antes da troca no próximo request, mesmo com o cookie ainda "válido" (assinatura/expiração ok). Checagem autoritativa em `getAdminAtual()` (`src/lib/admin-current.ts`), que roda em Node.js — o middleware (Edge) não tem acesso ao Postgres para isso. Toda rota protegida usa `getAdminAtual()`, não só o middleware.
- ✅ **Painel Admin — CRUD de posts (RF-ADMIN-05, RF-ADMIN-09):** `/admin/posts` — listagem com busca por título, filtro por status (rascunho/publicado) e paginação; `/admin/posts/novo` e `/admin/posts/[id]` com editor Markdown e preview ao vivo (debounced) via `POST /api/admin/posts/preview`; slug gerado a partir do título (editável manualmente) com checagem de unicidade; `publicadoEm` gravado na primeira publicação; exclusão com tratamento de erros de FK do Prisma. Sanitização de HTML sempre no backend (`src/lib/markdown.ts`, `marked` + `sanitize-html`) — nunca no cliente, mesma função será reaproveitada no blog público.
- ⬜ Rotas de API de newsletter (subscribe/confirmar/descadastrar) — a implementar
- ⬜ Rotas de API de posts públicas (listagem/disparo em lote) — a implementar
- ⬜ Upload de capa (R2), link de preview assinado e agendamento de publicação (RF-ADMIN-10, 11, 12) — a implementar

> **Nota de infraestrutura:** as migrations `20260726114400_admin_panel_foundation` e `20260726122442_admin_session_revogacao` foram escritas manualmente (o ambiente onde foram geradas não tem acesso de rede ao Postgres do Railway nem ao engine Linux do Prisma). Antes de rodar localmente: `npx prisma generate`, aplicar as migrations (`npx prisma migrate deploy` ou `migrate dev`) e criar o primeiro admin com `npm run seed:admin -- seuemail@peix.ia.br "senha-forte"`.

Documentos de referência atualizados: `Requisitos_Site_PEIx_v1.7.md` e `Arquitetura_Tecnica_Site_PEIx_v1.5.md`.
