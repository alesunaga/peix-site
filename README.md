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

## Status atual (scaffold inicial)

- ✅ Schema Prisma completo (`prisma/schema.prisma`)
- ✅ Rotas de API de Leads e Diagnóstico implementadas (`/api/leads`, `/api/diagnostico`)
- ✅ Templates de e-mail base (confirmação, material, aviso ao representante, newsletter, novo post)
- ⬜ Rotas de API de newsletter (subscribe/confirmar/descadastrar) — a implementar
- ⬜ Rotas de API de posts (CRUD + disparo em lote) — a implementar
- ⬜ Autenticação do painel admin — a implementar
- ⬜ UI de todas as páginas (Home, Recursos, Contato, Blog, Diagnóstico, Admin) — a implementar a partir do mockup validado
