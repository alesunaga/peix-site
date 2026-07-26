#!/usr/bin/env node
// scripts/seed-admin.mjs
//
// Cria (ou reativa) o primeiro AdminUser com status=ATIVO, direto no banco.
// Necessário porque o fluxo de convite (RF-ADMIN-06) parte de um admin já
// autenticado — precisa existir um primeiro usuário por fora desse fluxo.
//
// Uso:
//   node --env-file=.env scripts/seed-admin.mjs seuemail@peix.ia.br "senha-forte-aqui"
// (ou: npm run seed:admin -- seuemail@peix.ia.br "senha-forte-aqui")
//
// Rodar localmente / onde o DATABASE_URL alcance o Postgres — não roda no
// ambiente de sandbox usado para gerar este código (sem acesso de rede ao
// Railway).

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const [, , email, senha] = process.argv;

if (!email || !senha) {
  console.error("Uso: node --env-file=.env scripts/seed-admin.mjs <email> <senha>");
  process.exit(1);
}

if (senha.length < 8) {
  console.error("A senha precisa ter pelo menos 8 caracteres.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL não encontrada no ambiente. Rode com: node --env-file=.env scripts/seed-admin.mjs ...",
  );
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  // rounds=12 — mesmo custo do sistema PEIx produto (Arquitetura_Tecnica_Site_PEIx v1.3, §3).
  const senhaHash = await bcrypt.hash(senha, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { senhaHash, status: "ATIVO", tentativasLogin: 0, bloqueadoAte: null },
    create: { email, senhaHash, status: "ATIVO" },
  });

  console.log(`Admin pronto: ${admin.email} (status=${admin.status}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
