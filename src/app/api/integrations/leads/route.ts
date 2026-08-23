// src/app/api/integrations/leads/route.ts
//
// API de leitura para uma pipeline de clientes externa (n8n/Zapier/Make,
// planilha, CRM, script próprio) consultar leads novos/atualizados
// periodicamente (polling). Fora de /api/admin/**, então o middleware não
// exige sessão de admin aqui — protegido por um segredo compartilhado
// (`LEADS_API_TOKEN`) enviado no header `Authorization: Bearer <token>`,
// mesmo padrão de /api/cron/publicar-agendados.
//
// Uso: GET /api/integrations/leads?desde=2026-08-01T00:00:00.000Z&cursor=<id>&limit=100
// - `desde` (opcional): só leads com atualizadoEm >= essa data ISO. Sem esse
//   parâmetro, retorna todos os leads (útil na primeira sincronização).
// - `cursor` (opcional): id do último lead já recebido na página anterior,
//   para continuar a paginação dentro da mesma janela de `desde`.
// - `limit` (opcional, padrão 100, máx. 200).
//
// Ordenado por atualizadoEm asc, id asc — ordem estável mesmo com leads
// tendo o mesmo atualizadoEm (upserts em lote/testes), e paginação segura
// mesmo se novos leads forem gravados entre uma chamada e outra.

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const LIMITE_PADRAO = 100;
const LIMITE_MAXIMO = 200;

function autorizado(request: NextRequest): boolean {
  const token = process.env.LEADS_API_TOKEN;
  if (!token) return false;
  return request.headers.get("authorization") === `Bearer ${token}`;
}

export async function GET(request: NextRequest) {
  if (!process.env.LEADS_API_TOKEN) {
    return NextResponse.json({ erro: "LEADS_API_TOKEN não configurado no ambiente." }, { status: 500 });
  }

  if (!autorizado(request)) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const desdeParam = searchParams.get("desde");
  let desde: Date | undefined;
  if (desdeParam) {
    desde = new Date(desdeParam);
    if (Number.isNaN(desde.getTime())) {
      return NextResponse.json({ erro: "Parâmetro 'desde' inválido — use uma data ISO 8601." }, { status: 400 });
    }
  }

  const cursor = searchParams.get("cursor") ?? undefined;

  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || LIMITE_PADRAO, 1), LIMITE_MAXIMO) : LIMITE_PADRAO;

  const where: Prisma.LeadWhereInput = desde ? { atualizadoEm: { gte: desde } } : {};

  const leads = await prisma.lead.findMany({
    where,
    orderBy: [{ atualizadoEm: "asc" }, { id: "asc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      diagnosticos: {
        orderBy: { criadoEm: "desc" },
        take: 1,
      },
    },
  });

  const temMais = leads.length > limit;
  const pagina = temMais ? leads.slice(0, limit) : leads;

  const resultado = pagina.map((lead) => {
    const ultimoDiagnostico = lead.diagnosticos[0];
    return {
      id: lead.id,
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      instituicao: lead.instituicao,
      cidade: lead.cidade,
      uf: lead.uf,
      cargo: lead.cargo,
      segmentos: lead.segmentos,
      querDemo: lead.querDemo,
      origem: lead.origem,
      utmSource: lead.utmSource,
      consentimentoLgpdEm: lead.consentimentoLgpdEm,
      aceiteTermosUsoEm: lead.aceiteTermosUsoEm,
      criadoEm: lead.criadoEm,
      atualizadoEm: lead.atualizadoEm,
      diagnostico: ultimoDiagnostico
        ? {
            pontuacao: ultimoDiagnostico.pontuacao,
            categoria: ultimoDiagnostico.categoria,
            criadoEm: ultimoDiagnostico.criadoEm,
          }
        : null,
    };
  });

  return NextResponse.json({
    leads: resultado,
    temMais,
    proximoCursor: temMais ? pagina[pagina.length - 1].id : null,
  });
}
