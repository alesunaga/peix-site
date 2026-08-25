// src/lib/analytics-queries.ts
//
// Consultas de agregação para o dashboard /admin/analytics
// (Analytics_Proprio_Site_PEIx_v1.0). Chamadas direto do server component da
// página — mesmo padrão já usado nas demais páginas do Painel Admin (ex.:
// src/app/admin/(painel)/leads/page.tsx consulta o Prisma direto, sem rota
// REST intermediária).
//
// A agregação por dia/página/origem é feita em memória (não com SQL bruto:
// nenhuma outra parte do código usa $queryRaw, e o volume de um site
// institucional deste porte não justifica a complexidade). Se o tráfego
// crescer muito, isso pode virar uma tabela de rollup diário sem mudar a
// assinatura destas funções.

import { prisma } from "@/lib/prisma";

export type PeriodoDias = 7 | 30 | 90;

function inicioDoPeriodo(dias: PeriodoDias): Date {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return data;
}

function formatarDiaISO(data: Date): string {
  return data.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function resumoPeriodo(dias: PeriodoDias) {
  const inicioAtual = inicioDoPeriodo(dias);
  const inicioAnterior = inicioDoPeriodo((dias * 2) as PeriodoDias);

  const [pageviewsAtual, pageviewsAnterior] = await Promise.all([
    prisma.analyticsPageview.findMany({
      where: { criadoEm: { gte: inicioAtual } },
      select: { visitanteHash: true },
    }),
    prisma.analyticsPageview.count({
      where: { criadoEm: { gte: inicioAnterior, lt: inicioAtual } },
    }),
  ]);

  const totalVisitas = pageviewsAtual.length;
  const visitantesUnicos = new Set(pageviewsAtual.map((p) => p.visitanteHash)).size;

  const variacaoVisitas =
    pageviewsAnterior > 0
      ? Math.round(((totalVisitas - pageviewsAnterior) / pageviewsAnterior) * 100)
      : null;

  return { totalVisitas, visitantesUnicos, variacaoVisitas };
}

export async function serieTemporal(dias: PeriodoDias) {
  const inicio = inicioDoPeriodo(dias);
  const pageviews = await prisma.analyticsPageview.findMany({
    where: { criadoEm: { gte: inicio } },
    select: { criadoEm: true },
  });

  const contagemPorDia = new Map<string, number>();
  // Garante que todo dia do período apareça no gráfico, mesmo sem visita.
  for (let i = 0; i < dias; i++) {
    const data = new Date();
    data.setDate(data.getDate() - i);
    contagemPorDia.set(formatarDiaISO(data), 0);
  }
  for (const pv of pageviews) {
    const dia = formatarDiaISO(pv.criadoEm);
    contagemPorDia.set(dia, (contagemPorDia.get(dia) ?? 0) + 1);
  }

  return Array.from(contagemPorDia.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dia, total]) => ({ dia, total }));
}

export async function paginasMaisVistas(dias: PeriodoDias, limite = 10) {
  const inicio = inicioDoPeriodo(dias);
  const pageviews = await prisma.analyticsPageview.findMany({
    where: { criadoEm: { gte: inicio } },
    select: { path: true },
  });

  const contagemPorPath = new Map<string, number>();
  for (const pv of pageviews) {
    contagemPorPath.set(pv.path, (contagemPorPath.get(pv.path) ?? 0) + 1);
  }

  return Array.from(contagemPorPath.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limite)
    .map(([path, total]) => ({ path, total }));
}

export async function origensTrafego(dias: PeriodoDias, limite = 10) {
  const inicio = inicioDoPeriodo(dias);
  const pageviews = await prisma.analyticsPageview.findMany({
    where: { criadoEm: { gte: inicio } },
    select: { referrer: true, utmSource: true },
  });

  const contagemPorOrigem = new Map<string, number>();
  for (const pv of pageviews) {
    let origem: string;
    if (pv.utmSource) {
      origem = pv.utmSource;
    } else if (pv.referrer) {
      try {
        origem = new URL(pv.referrer).hostname;
      } catch {
        origem = pv.referrer;
      }
    } else {
      origem = "Acesso direto";
    }
    contagemPorOrigem.set(origem, (contagemPorOrigem.get(origem) ?? 0) + 1);
  }

  return Array.from(contagemPorOrigem.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limite)
    .map(([origem, total]) => ({ origem, total }));
}

export async function funilConversao(dias: PeriodoDias) {
  const inicio = inicioDoPeriodo(dias);

  const [totalVisitas, diagnosticoConcluido, formularioEnviado] = await Promise.all([
    prisma.analyticsPageview.count({ where: { criadoEm: { gte: inicio } } }),
    prisma.analyticsEvento.count({
      where: { tipo: "DIAGNOSTICO_CONCLUIDO", criadoEm: { gte: inicio } },
    }),
    prisma.analyticsEvento.count({
      where: { tipo: "FORMULARIO_ENVIADO", criadoEm: { gte: inicio } },
    }),
  ]);

  const leadCapturado = diagnosticoConcluido + formularioEnviado;

  return { totalVisitas, diagnosticoConcluido, leadCapturado };
}
