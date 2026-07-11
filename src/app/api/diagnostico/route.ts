// src/app/api/diagnostico/route.ts
//
// RF-DIAG-01 a 06 (ver Arquitetura_Tecnica_Site_PEIx_v1.1, §5)
//
// 1. Recebe as respostas do wizard + e-mail (gate de captura de lead).
// 2. Recalcula a pontuação NO SERVIDOR (nunca confia em valor vindo do cliente).
// 3. Cria/atualiza o lead (mesma regra de dedup de RF-LEAD), origem = DIAGNOSTICO.
// 4. Grava o registro em Diagnostico, vinculado ao lead.
// 5. Reaproveita o mesmo fluxo de e-mails do formulário de contato, incluindo
//    a pontuação no aviso ao representante.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { calcularDiagnostico, PERGUNTAS } from "@/lib/diagnostico-config";
import {
  enviarConfirmacaoLead,
  enviarMaterialInformativo,
  enviarAvisoRepresentante,
  enviarEmailsSemBloquear,
} from "@/lib/resend";

const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

const diagnosticoSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  respostas: z.record(z.string(), z.string()),
  consentimentoLgpd: z.literal(true, {
    errorMap: () => ({ message: "É necessário aceitar o tratamento de dados (LGPD)." }),
  }),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = diagnosticoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const { nome, email, respostas } = parsed.data;
  // consentimentoLgpd já validado pelo schema (z.literal(true)) — só é
  // usado para a checagem acima; não precisa ser persistido como campo.

  // Garante que só perguntas conhecidas entram no cálculo (RF-DIAG-02)
  const respostasValidas = Object.fromEntries(
    PERGUNTAS.filter((p) => p.id in respostas).map((p) => [p.id, respostas[p.id]]),
  );

  const { pontuacao, pontuacaoMaxima, categoria, detalhes } = calcularDiagnostico(respostasValidas);

  const leadExistente = await prisma.lead.findUnique({ where: { email } });
  const jaAtualizadoRecentemente =
    leadExistente && Date.now() - leadExistente.atualizadoEm.getTime() < SETE_DIAS_MS;

  const lead = await prisma.lead.upsert({
    where: { email },
    create: {
      nome,
      email,
      origem: "DIAGNOSTICO",
      consentimentoLgpdEm: new Date(),
    },
    update: {
      nome,
      // Não sobrescreve origem se o lead já existia por outro canal
    },
  });

  const diagnostico = await prisma.diagnostico.create({
    data: {
      leadId: lead.id,
      respostas: respostasValidas,
      pontuacao,
      categoria,
    },
  });

  await enviarEmailsSemBloquear([
    () => enviarConfirmacaoLead(lead),
    () => enviarMaterialInformativo(lead),
  ]);

  if (!jaAtualizadoRecentemente) {
    await enviarEmailsSemBloquear([() => enviarAvisoRepresentante(lead, diagnostico)]);
  }

  return NextResponse.json(
    { pontuacao, pontuacaoMaxima, categoria, detalhes },
    { status: 201 },
  );
}
