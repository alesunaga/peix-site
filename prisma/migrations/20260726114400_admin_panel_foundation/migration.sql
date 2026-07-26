-- Painel Administrativo — fundação (RF-ADMIN-01 a 12)
-- Arquitetura_Tecnica_Site_PEIx v1.3/1.5, §3 e §4
--
-- Assume 0 linhas em "posts" e "admin_users" no momento da aplicação desta
-- migration (Painel Admin/Blog ainda não tinham sido implementados — ver
-- Requisitos_Site_PEIx v1.7, linha 183: "Não iniciado"). Se isso não for
-- mais verdade no ambiente onde esta migration for aplicada, confira antes:
--   SELECT count(*) FROM "posts"; SELECT count(*) FROM "admin_users";
-- e ajuste o passo "autorId" (autor -> autorId) antes de aplicar.

-- CreateEnum
CREATE TYPE "admin_status" AS ENUM ('CONVIDADO', 'ATIVO', 'DESATIVADO');

-- AlterEnum
ALTER TYPE "post_status" ADD VALUE 'AGENDADO';

-- AlterTable: admin_users — convite, reset de senha e lockout (v1.3)
ALTER TABLE "admin_users"
  ALTER COLUMN "senhaHash" DROP NOT NULL,
  ADD COLUMN "status" "admin_status" NOT NULL DEFAULT 'CONVIDADO',
  ADD COLUMN "tokenConvite" TEXT,
  ADD COLUMN "conviteExpiraEm" TIMESTAMP(3),
  ADD COLUMN "convidadoPorId" TEXT,
  ADD COLUMN "tokenResetSenha" TEXT,
  ADD COLUMN "resetExpiraEm" TIMESTAMP(3),
  ADD COLUMN "tentativasLogin" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "bloqueadoAte" TIMESTAMP(3);

-- AlterTable: posts — autor (texto livre) vira autorId (FK admin_users)
ALTER TABLE "posts" DROP COLUMN "autor";
ALTER TABLE "posts" ADD COLUMN "autorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "post_preview_tokens" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_preview_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_tokenConvite_key" ON "admin_users"("tokenConvite");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_tokenResetSenha_key" ON "admin_users"("tokenResetSenha");

-- CreateIndex
CREATE UNIQUE INDEX "post_preview_tokens_token_key" ON "post_preview_tokens"("token");

-- AddForeignKey
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_convidadoPorId_fkey" FOREIGN KEY ("convidadoPorId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_preview_tokens" ADD CONSTRAINT "post_preview_tokens_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
