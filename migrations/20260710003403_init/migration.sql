-- CreateEnum
CREATE TYPE "cargo" AS ENUM ('DIRETOR_PEDAGOGICO', 'MANTENEDOR_DONO', 'COORDENADOR_INCLUSAO', 'PROFESSOR_AEE');

-- CreateEnum
CREATE TYPE "segmento" AS ENUM ('EDUCACAO_INFANTIL', 'FUNDAMENTAL_1', 'FUNDAMENTAL_2', 'ENSINO_MEDIO');

-- CreateEnum
CREATE TYPE "lead_origem" AS ENUM ('FORMULARIO', 'DIAGNOSTICO');

-- CreateEnum
CREATE TYPE "newsletter_status" AS ENUM ('PENDENTE', 'CONFIRMADO', 'DESCADASTRADO');

-- CreateEnum
CREATE TYPE "post_status" AS ENUM ('RASCUNHO', 'PUBLICADO');

-- CreateEnum
CREATE TYPE "post_categoria" AS ENUM ('INCLUSAO', 'LEGISLACAO', 'IDEIAS_BOAS_PRATICAS', 'EXPERIENCIAS', 'ENTREVISTAS', 'EVENTOS');

-- CreateEnum
CREATE TYPE "diagnostico_categoria" AS ENUM ('INICIANTE', 'EM_TRANSICAO', 'AVANCADA');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "instituicao" TEXT,
    "cidade" TEXT,
    "uf" TEXT,
    "cargo" "cargo",
    "segmentos" "segmento"[],
    "querDemo" BOOLEAN NOT NULL DEFAULT false,
    "origem" "lead_origem" NOT NULL DEFAULT 'FORMULARIO',
    "utmSource" TEXT,
    "consentimentoLgpdEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "email" TEXT NOT NULL,
    "status" "newsletter_status" NOT NULL DEFAULT 'PENDENTE',
    "tokenConfirmacao" TEXT NOT NULL,
    "confirmadoEm" TIMESTAMP(3),
    "descadastradoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "categoria" "post_categoria" NOT NULL,
    "imagemCapaUrl" TEXT,
    "autor" TEXT NOT NULL,
    "status" "post_status" NOT NULL DEFAULT 'RASCUNHO',
    "publicadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envios_newsletter" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "disparadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalDestinatarios" INTEGER NOT NULL,
    "totalSucesso" INTEGER NOT NULL,
    "totalFalha" INTEGER NOT NULL,

    CONSTRAINT "envios_newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosticos" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "respostas" JSONB NOT NULL,
    "pontuacao" INTEGER NOT NULL,
    "categoria" "diagnostico_categoria" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagnosticos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_tokenConfirmacao_key" ON "newsletter_subscribers"("tokenConfirmacao");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "envios_newsletter" ADD CONSTRAINT "envios_newsletter_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos" ADD CONSTRAINT "diagnosticos_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
