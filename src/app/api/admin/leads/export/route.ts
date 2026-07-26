// src/app/api/admin/leads/export/route.ts — RF-ADMIN-02
//
// Exporta os leads (respeitando o filtro de busca `q`, se enviado) em CSV,
// para uso como CRM provisório. O middleware barra quem não tem cookie
// válido, mas getAdminAtual() é a checagem autoritativa (também cobre
// revogação por troca de senha e desativação — ver src/lib/admin-current.ts).

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminAtual } from "@/lib/admin-current";
import { CARGO_LABELS, LEAD_ORIGEM_LABELS, SEGMENTO_LABELS } from "@/lib/labels";

function csvEscape(valor: string | number | boolean | null | undefined): string {
  if (valor === null || valor === undefined) return "";
  const texto = String(valor);
  if (/[",\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

export async function GET(request: NextRequest) {
  const adminAtual = await getAdminAtual();
  if (!adminAtual) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  const where: Prisma.LeadWhereInput = q
    ? {
        OR: [
          { nome: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { instituicao: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const leads = await prisma.lead.findMany({ where, orderBy: { criadoEm: "desc" } });

  const cabecalho = [
    "Nome",
    "E-mail",
    "Telefone",
    "Instituição",
    "Cidade",
    "UF",
    "Cargo",
    "Segmentos",
    "Quer Demo",
    "Origem",
    "UTM Source",
    "Consentimento LGPD em",
    "Aceite Termos em",
    "Criado em",
    "Atualizado em",
  ];

  const linhas = leads.map((lead) => [
    lead.nome,
    lead.email,
    lead.telefone ?? "",
    lead.instituicao ?? "",
    lead.cidade ?? "",
    lead.uf ?? "",
    lead.cargo ? CARGO_LABELS[lead.cargo] : "",
    lead.segmentos.map((s) => SEGMENTO_LABELS[s] ?? s).join("; "),
    lead.querDemo ? "Sim" : "Não",
    LEAD_ORIGEM_LABELS[lead.origem] ?? lead.origem,
    lead.utmSource ?? "",
    lead.consentimentoLgpdEm ? lead.consentimentoLgpdEm.toISOString() : "",
    lead.aceiteTermosUsoEm ? lead.aceiteTermosUsoEm.toISOString() : "",
    lead.criadoEm.toISOString(),
    lead.atualizadoEm.toISOString(),
  ]);

  const csv = [cabecalho, ...linhas].map((linha) => linha.map(csvEscape).join(",")).join("\r\n");

  // BOM UTF-8 — sem isso o Excel abre acentos em pt-BR quebrados.
  const corpo = "﻿" + csv;
  const dataArquivo = new Date().toISOString().slice(0, 10);

  return new NextResponse(corpo, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-peix-${dataArquivo}.csv"`,
    },
  });
}
