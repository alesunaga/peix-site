-- Analytics próprio (Analytics_Proprio_Site_PEIx_v1.0)
--
-- Escrita manualmente (sem rodar `prisma migrate dev` contra nenhum banco):
-- o .env local tinha duas DATABASE_URL — uma ativa, uma comentada — e não
-- foi possível confirmar com segurança qual delas é o ambiente de
-- desenvolvimento isolado criado depois do incidente descrito em
-- Arquitetura_Tecnica_Site_PEIx v1.5, §11. Confirme o ambiente antes de
-- aplicar (`npx prisma migrate deploy` no ambiente correto, ou
-- `npx prisma migrate dev` se ainda estiver em cima do schema local).
--
-- Tabelas novas e isoladas (analytics_pageviews, analytics_eventos) — não
-- alteram nenhuma tabela existente.

-- CreateEnum
CREATE TYPE "analytics_dispositivo" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET', 'DESCONHECIDO');

-- CreateEnum
CREATE TYPE "analytics_evento_tipo" AS ENUM ('DIAGNOSTICO_CONCLUIDO', 'FORMULARIO_ENVIADO', 'NEWSLETTER_INSCRITA', 'POST_LIDO');

-- CreateTable
CREATE TABLE "analytics_pageviews" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "visitanteHash" TEXT NOT NULL,
    "dispositivo" "analytics_dispositivo" NOT NULL DEFAULT 'DESCONHECIDO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pageviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_eventos" (
    "id" TEXT NOT NULL,
    "tipo" "analytics_evento_tipo" NOT NULL,
    "path" TEXT,
    "visitanteHash" TEXT,
    "metadata" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_pageviews_criadoEm_idx" ON "analytics_pageviews"("criadoEm");

-- CreateIndex
CREATE INDEX "analytics_pageviews_path_idx" ON "analytics_pageviews"("path");

-- CreateIndex
CREATE INDEX "analytics_eventos_criadoEm_idx" ON "analytics_eventos"("criadoEm");

-- CreateIndex
CREATE INDEX "analytics_eventos_tipo_idx" ON "analytics_eventos"("tipo");
