-- Revogação de sessão ao trocar de senha (correção pós fundação do Painel Admin)
--
-- Sem esse campo, resetar a senha (RF-ADMIN-08) não invalidava sessões já
-- abertas em outro lugar — o cookie é assinado e stateless, então a única
-- forma de revogar é o backend comparar o instante de emissão da sessão
-- ("iat", ver src/lib/admin-session.ts) contra este timestamp.

-- AlterTable
ALTER TABLE "admin_users" ADD COLUMN "senhaAlteradaEm" TIMESTAMP(3);
