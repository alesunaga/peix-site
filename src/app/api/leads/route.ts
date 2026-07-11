// src/app/api/leads/route.ts
//
// RF-LEAD-01 a 07 / RN-LEAD-01 / RN-SITE-01
//
// Fluxo (ver Arquitetura_Tecnica_Site_PEIx_v1.1, §3):
// 1. Valida o corpo da requisição.
// 2. Verifica se já existe lead com o mesmo e-mail atualizado nos últimos 7 dias.
//    - Se existir: atualiza o registro, NÃO reenvia aviso ao representante.
//    - Se não existir: cria o registro e dispara os 3 e-mails.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  enviarConfirmacaoLead,
  enviarMaterialInformativo,
  enviarAvisoRepresentante,
  enviarEmailsSemBloquear,
} from "@/lib/resend";

const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

const leadSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().optional(),
  instituicao: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().length(2).optional(),
  cargo: z
    .enum(["DIRETOR_PEDAGOGICO", "MANTENEDOR_DONO", "COORDENADOR_INCLUSAO", "PROFESSOR_AEE", "OUTRO"])
    .optional(),
  segmentos: z
    .array(z.enum(["EDUCACAO_INFANTIL", "FUNDAMENTAL_1", "FUNDAMENTAL_2", "ENSINO_MEDIO"]))
    .optional(),
  querDemo: z.boolean().optional(),
  consentimentoLgpd: z.literal(true, {
    errorMap: () => ({ message: "É necessário aceitar o tratamento de dados (LGPD)." }),
  }),
  utmSource: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const { consentimentoLgpd, ...dados } = parsed.data;

  const leadExistente = await prisma.lead.findUnique({ where: { email: dados.email } });

  const jaAtualizadoRecentemente =
    leadExistente &&
    Date.now() - leadExistente.atualizadoEm.getTime() < SETE_DIAS_MS;

  const lead = await prisma.lead.upsert({
    where: { email: dados.email },
    create: {
      ...dados,
      consentimentoLgpdEm: new Date(),
    },
    update: {
      ...dados,
    },
  });

  // RF-LEAD-05/06 — sempre reenvia confirmação + material ao visitante.
  // E-mail é best-effort: uma falha aqui não deve impedir a resposta de
  // sucesso, já que o lead já foi gravado no banco.
  await enviarEmailsSemBloquear([
    () => enviarConfirmacaoLead(lead),
    () => enviarMaterialInformativo(lead),
  ]);

  // RN-LEAD-01 — só avisa o representante se for lead novo ou "esfriado" (>7 dias)
  if (!jaAtualizadoRecentemente) {
    await enviarEmailsSemBloquear([() => enviarAvisoRepresentante(lead, null)]);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
